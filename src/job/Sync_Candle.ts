import { redis } from "../database/Redis";
import {
  getBeginningOfCurrentMinute,
  getBeginningOfPreviousMinute,
} from "../helper/TimeUtils";
import { KeyRedisPrefix, Period } from "../helper/enum";
import {
  genKeySpecificProvider,
  genKeyTokenPriceOHLC,
} from "../helper/generateKey";

async function getCandlesForToken(
  token: Token,
  timestamp: number,
  period: Period
): Promise<string[]> {
  const keyOHLC = genKeyTokenPriceOHLC(token.network, token.address, period);
  return await redis.zrangebyscore(keyOHLC, timestamp, timestamp);
}

type Token = {
  network: string;
  address: string;
};

async function initFromToCandleMinutes(from: number, to: number) {
  const allTokens = [
    {
      network: "bsc",
      address: "0xBB7dc48E3C4f02de78981F79EA02Ac0052c275A3".toLowerCase(),
    },
  ];
  const period = Period.OneMinute;
  for (const token of allTokens) {
    const keyOHLC = genKeyTokenPriceOHLC(token.network, token.address, period);
    let previousCandle: any = {};
    for (let i = from; i <= to; i += 60) {
      const timestamp = getBeginningOfCurrentMinute(i);

      const candle = await getCandlesForToken(token, timestamp, period);
      const timestampPrevious = timestamp - 60;
      const timestampAfter = timestamp + 60;
      const candlePrevious = await getCandlesForToken(
        token,
        timestampPrevious,
        period
      );
      const candleAfter = await getCandlesForToken(
        token,
        timestampAfter,
        period
      );
      if (candle.length === 0) {
        continue;
        let candleInsert: any = {};
        let isNewCandle = false;
        if (candlePrevious.length !== 0) {
          isNewCandle = true;
          const priceFormatFloat = JSON.parse(candlePrevious[0]).c;
          candleInsert = {
            t: timestamp,
            o: priceFormatFloat,
            h: priceFormatFloat,
            c: priceFormatFloat,
            l: priceFormatFloat,
            vb: 0,
          };
        }
        if (candleAfter.length !== 0) {
          const priceFormatFloat = JSON.parse(candleAfter[0]).c;
          isNewCandle = true;
          if (candleInsert.t === undefined) {
            candleInsert = {
              t: timestamp,
              o: priceFormatFloat,
              h: priceFormatFloat,
              c: priceFormatFloat,
              l: priceFormatFloat,
              vb: 0,
            };
          } else {
            candleInsert.h = Math.max(
              parseInt(candleInsert.h),
              priceFormatFloat
            ).toString();
            candleInsert.l = Math.min(
              parseInt(candleInsert.l),
              priceFormatFloat
            ).toString();
            candleInsert.c = priceFormatFloat;
          }
        }
        if (isNewCandle) {
          console.log(
            "timestamp",
            timestamp,
            candleInsert,
            candleAfter,
            candlePrevious
          );

          const pipeline = redis.pipeline();
          pipeline.zremrangebyscore(keyOHLC, timestamp, timestamp);
          pipeline.zadd(keyOHLC, timestamp, JSON.stringify(candleInsert));
          await pipeline.exec();
        }
      } else {
        if (Object.keys(previousCandle).length === 0) {
          previousCandle = JSON.parse(candle[0]);
        } else {
          const candleInsert = JSON.parse(candle[0]);
          const closePricePreviousCandle = previousCandle.c;
          candleInsert.o = closePricePreviousCandle;
          candleInsert.h = Math.max(
            parseInt(candleInsert.h),
            closePricePreviousCandle
          ).toString();
          candleInsert.l = Math.min(
            parseInt(candleInsert.l),
            closePricePreviousCandle
          ).toString();
          console.log("Update timestamp", candleInsert);
          const pipeline = redis.pipeline();
          pipeline.zremrangebyscore(keyOHLC, timestamp, timestamp);
          pipeline.zadd(keyOHLC, timestamp, JSON.stringify(candleInsert));
          await pipeline.exec();
        }
      }
    }
  }
}

async function initCandle(period: Period, timestamp: number) {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const TAG = `initCandle in ${period} and ${timestamp} current timestamp ${currentTimestamp}`;
  const allTokens = [
    {
      network: "bsc",
      address: "0xBB7dc48E3C4f02de78981F79EA02Ac0052c275A3".toLowerCase(),
    },
  ];

  const getCandlesPromises = allTokens.map((token: Token) =>
    getCandlesForToken(token, timestamp, period)
  );

  const allCandlesUSDT = await Promise.all(getCandlesPromises);

  let count = 0;

  const setCandlesPromise = allTokens.map((token: Token, index: number) => {
    const keyOHLC = genKeyTokenPriceOHLC(token.network, token.address, period);
    const symbol = genKeySpecificProvider(token.network, token.address);
    const timestampPrevious = getBeginningOfCurrentMinute(timestamp);
    if (allCandlesUSDT[index].length === 0) {
      // const priceFormatFloat = price;
      const priceFormatFloat = 0;
      const candleInsert = {
        t: timestamp,
        o: priceFormatFloat,
        h: priceFormatFloat,
        c: priceFormatFloat,
        l: priceFormatFloat,
        vb: 0,
      };
      count += 1;
      const pipeline = redis.pipeline();
      pipeline.zremrangebyscore(keyOHLC, timestamp, timestamp);
      pipeline.zadd(keyOHLC, timestamp, JSON.stringify(candleInsert));
      return pipeline.exec();
    }
  });
  await Promise.all(setCandlesPromise);
}

async function initCandleMinutes() {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const timestamp = getBeginningOfPreviousMinute(currentTimestamp);
  await initCandle(Period.OneMinute, timestamp);
}

export { initCandleMinutes, initFromToCandleMinutes };
