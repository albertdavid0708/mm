import { ethers, toBeArray } from "ethers";
import { provider } from "./provider";
import { poolABI } from "../abi/abi";
import { Big } from "big.js";
import {
  genKeyTokenPriceOHLC,
  genKeyTokenPriceOHLCInTimestamp,
} from "../helper/generateKey";
import {
  getBeginningOfCurrentMinute,
  getBeginningOfPreviousMinute,
} from "../helper/TimeUtils";
import { DataKey } from "../helper/enum";
import { redis } from "../database/Redis";

interface SwapEvent {
  sender: string;
  amount0In: string;
  amount1In: string;
  amount0Out: string;
  amount1Out: string;
  to: string;
}

// Address of the smart contract
const contractAddress = "0xefccF3Bb83Bf83fF472A8Ea60A7FEa196fBEecF1";

// Connect to the smart contract
const contract = new ethers.Contract(contractAddress, poolABI, provider);

async function listenEvent() {
  // Function to listen for the 'Swap' event
  function listenForSwapEvent() {
    contract.on(
      "Swap",
      async (
        sender: string,
        amount0In: ethers.BigNumberish,
        amount1In: ethers.BigNumberish,
        amount0Out: ethers.BigNumberish,
        amount1Out: ethers.BigNumberish,
        to: string,
        event: ethers.EventLog
      ) => {
        const swapEvent: SwapEvent = {
          sender,
          amount0In: amount0In.toString(),
          amount1In: amount1In.toString(),
          amount0Out: amount0Out.toString(),
          amount1Out: amount1Out.toString(),
          to,
        };
        const block = await provider.getBlock(event.blockNumber);
        if (block) {
          await saveToRedis(swapEvent, block.timestamp);
        }

        console.log("Swap event received:", swapEvent);
      }
    );
  }

  // Start listening for the 'Swap' event
  listenForSwapEvent();
}
async function getAllEvent() {
  const filter: ethers.ContractEventName = contract.filters["Swap"]();
  const toBlock = await provider.getBlockNumber();
  console.log(toBlock);
  const fromBlock = toBlock - 30000;
  const step = 10000;
  let events: ethers.EventLog[] = [];
  for (let i = toBlock; i >= fromBlock; i -= step) {
    try {
      const startBlock = Math.max(fromBlock, i - step + 1);
      const items = (await contract.queryFilter(
        filter,
        startBlock,
        i
      )) as ethers.EventLog[];
      events = events.concat(items);
      console.log(items);
    } catch (e) {
      console.log(e);
    }
  }
  console.log(events);
  for (const event of events.reverse()) {
    const block = await provider.getBlock(event.blockNumber);
    console.log(event.args);
    const swapEvent: SwapEvent = {
      sender: event.args.sender,
      amount0In: event.args.amount0In.toString(),
      amount1In: event.args.amount1In.toString(),
      amount0Out: event.args.amount0Out.toString(),
      amount1Out: event.args.amount1Out.toString(),
      to: event.args.to,
    };
    if (block !== null) {
      await saveToRedis(swapEvent, block.timestamp);
    }
  }
}

async function saveToRedis(event: SwapEvent, timestampOutSide: number) {
  const network = "bsc";
  const token = "0xBB7dc48E3C4f02de78981F79EA02Ac0052c275A3".toLowerCase();
  const timestamp = getBeginningOfCurrentMinute(timestampOutSide);
  const keyOHLC = genKeyTokenPriceOHLC(network, token, "1m");
  const keyOHLCInTimestamp = genKeyTokenPriceOHLCInTimestamp(
    token,
    timestamp,
    "1m"
  );

  let rate: any = Big(0);
  if (event.amount0In !== "0") {
    rate = Big(event.amount0In).div(Big(event.amount1Out));
  } else {
    rate = Big(event.amount0Out).div(Big(event.amount1In));
  }
  console.log("RATE", rate.toString());
  rate = rate.toString();
  let valueInTimestamp = await redis.get(keyOHLCInTimestamp);
  if (valueInTimestamp === null) {
    const previousTimestamp = getBeginningOfPreviousMinute(timestamp);
    let valueInPreviousTimestamp = await redis.zrangebyscore(
      keyOHLC,
      previousTimestamp,
      previousTimestamp
    );
    let valueInCurrentTime = await redis.zrangebyscore(
      keyOHLC,
      timestamp,
      timestamp
    );
    let openPrice = rate;
    if (valueInPreviousTimestamp.length > 0) {
      openPrice = JSON.parse(valueInPreviousTimestamp[0])[DataKey.close];
    }
    openPrice = openPrice !== undefined ? rate : openPrice;
    let high = rate;
    let low = rate;
    let close = rate;
    if (valueInCurrentTime.length > 0) {
      high = Math.max(
        JSON.parse(valueInCurrentTime[0])[DataKey.high],
        openPrice
      );
      low = Math.min(JSON.parse(valueInCurrentTime[0])[DataKey.low], openPrice);
      close = JSON.parse(valueInCurrentTime[0])[DataKey.close];
    }
    valueInTimestamp = JSON.stringify({
      open: openPrice,
      high,
      low,
      close,
      timestamp: timestamp,
    });
  } else {
    const candle = JSON.parse(valueInTimestamp);
    candle.high = Math.max(
      parseFloat(candle.high),
      parseFloat(rate)
    ).toString();
    candle.low = Math.min(parseFloat(candle.low), parseFloat(rate)).toString();
    candle.close = rate;
    valueInTimestamp = JSON.stringify(candle);
  }
  console.log("Timestamp", valueInTimestamp);
  const valueInTimestampObject = JSON.parse(valueInTimestamp);
  await redis.set(keyOHLCInTimestamp, valueInTimestamp, "EX", 5 * 60);
  const pipeline = redis.pipeline();
  pipeline.zremrangebyscore(keyOHLC, timestamp, timestamp);
  pipeline.zadd(
    keyOHLC,
    timestamp,
    JSON.stringify({
      [DataKey.timestamp]: valueInTimestampObject.timestamp,
      [DataKey.open]: valueInTimestampObject.open,
      [DataKey.high]: valueInTimestampObject.high,
      [DataKey.close]: valueInTimestampObject.close,
      [DataKey.low]: valueInTimestampObject.low,
      [DataKey.totalBaseVolume]: valueInTimestampObject.volumeTokenA,
    })
  );
  await pipeline.exec();
}

export { listenEvent, getAllEvent };
