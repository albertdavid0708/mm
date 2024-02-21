import "ethers";
import { ethers } from "ethers";
import { PANCAKE_ABI, poolABI } from "../abi/abi";
import { provider } from "./provider";
import { Command } from "../schema/command";
import Big from "big.js";
import { env } from "../config/config";

const PRIVATE_KEY = env.wallet.primaryKey;

const rate = 10000;
const rateSell = 500;

const contractAddress = "0xefccF3Bb83Bf83fF472A8Ea60A7FEa196fBEecF1";

// Connect to the smart contract
const contractPool = new ethers.Contract(contractAddress, poolABI, provider);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const routerAddress = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1";
const routerContract = new ethers.Contract(routerAddress, PANCAKE_ABI, wallet);

class PancakeSwap {
  public async swapBuy(amount: number) {
    const tokenInAddress = "0xBB7dc48E3C4f02de78981F79EA02Ac0052c275A3"; // Example token address (e.g., BUSD)
    // Address of the token you want to receive
    const tokenOutAddress = "0xc270ac59b20021B3D9bF4422dbdfce91a0314165"; // Example token address (e.g., BNB)

    const amountIn = ethers.parseUnits(amount.toString(), "ether"); // Example: 1 tokenIn

    // Minimum amount of tokenOut to receive
    const amountOutMin = ethers.parseUnits((amount / rate).toString(), "ether"); // Example: 0.1 tokenOut
    console.log("BUY", amountIn, amountOutMin);
    const to = wallet.address;

    // Deadline for the transaction (current block number + 10)
    const deadline = Math.floor(Date.now() / 1000) + 600; // 10 minutes from now

    // Function to perform the swap
    async function performSwap() {
      try {
        const tx = await routerContract.swapExactTokensForTokens(
          amountIn,
          amountOutMin,
          [tokenInAddress, tokenOutAddress],
          to,
          deadline,
          { gasLimit: 300000 }
        );
        console.log("Swap transaction sent:", tx.hash);
        await tx.wait();
        console.log("Swap transaction confirmed");
      } catch (error) {
        console.error("Error performing swap:", error);
      }
    }

    // Call the function to perform the swap
    performSwap();
  }

  public async swapSell(amount: number) {
    const tokenInAddress = "0xc270ac59b20021B3D9bF4422dbdfce91a0314165"; // Example token address (e.g., BUSD)

    // Address of the token you want to receive
    const tokenOutAddress = "0xBB7dc48E3C4f02de78981F79EA02Ac0052c275A3"; // Example token address (e.g., BNB)

    const amountIn = ethers.parseUnits(amount.toString(), "ether"); // Example: 1 tokenIn

    // Minimum amount of tokenOut to receive
    const amountOutMin = ethers.parseUnits(
      (amount * rateSell).toString(),
      "ether"
    ); // Example: 0.1 tokenOut
    console.log("SELL", amountIn, amountOutMin);
    const to = wallet.address;

    // Deadline for the transaction (current block number + 10)
    const deadline = Math.floor(Date.now() / 1000) + 600; // 10 minutes from now

    // Function to perform the swap

    // Function to perform the swap
    async function performSwap() {
      try {
        const tx = await routerContract.swapExactTokensForTokens(
          amountIn,
          amountOutMin,
          [tokenInAddress, tokenOutAddress],
          to,
          deadline,
          { gasLimit: 300000 }
        );
        console.log("Swap transaction sent:", tx.hash);
        await tx.wait();
        console.log("Swap transaction confirmed");
      } catch (error) {
        console.error("Error performing swap:", error);
      }
    }

    // Call the function to perform the swap
    performSwap();
  }
}

function getRandomZeroOrOne(): number {
  return Math.round(Math.random());
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function buyAndSell() {
  while (true) {
    let amount = Math.random() * 100 + 1;
    amount = 1_000_000_000;
    let amountSell = (Math.random() * 100 + 1) / rate;
    amountSell = 300_000;
    const pancakeSwap = new PancakeSwap();
    // const randomZeroOrOne = getRandomZeroOrOne();
    const randomZeroOrOne = 0;

    try {
      if (randomZeroOrOne) {
        await pancakeSwap.swapBuy(amount);
      } else {
        await pancakeSwap.swapSell(amountSell);
      }
    } catch (e) {
      console.log(e);
    }
    await sleep(5000);
  }
}

function divideIntoPartsBig(total: Big, numParts: number): Big[] {
  const parts: Big[] = [];

  for (let i = 0; i < numParts - 1; i++) {
    const randomPart = new Big(Math.random()).mul(total).round(0, 0);
    parts.push(randomPart);
    total = total.sub(randomPart);
  }

  parts.push(total); // Ensure total sum is exactly the original total

  return parts;
}

function divideIntoParts(total: number, numParts: number): number[] {
  const parts: number[] = [];

  for (let i = 0; i < numParts - 1; i++) {
    const randomPart = Math.floor(Math.random() * (total - 1)) + 1;
    parts.push(randomPart);
    total -= randomPart;
  }

  parts.push(total); // Ensure total sum is exactly the original total

  return parts;
}

async function commandMM(command: Command, numParts: number) {
  const reserves = await contractPool.getReserves();
  let reserve0 = Big(reserves._reserve0.toString());
  let reserve1 = Big(reserves._reserve1.toString());
  const k = reserve0.times(reserve1);
  const rangeCommand = [];

  const randomTimestamp: number[] = divideIntoParts(command.seconds, numParts);
  const pancakeSwap = new PancakeSwap();
  if (command.position === "bull") {
    const reserve0Percent = reserve0.times(command.percent / 100);
    const randomAmount: Big[] = divideIntoPartsBig(
      reserve0Percent.div(Big(10).pow(18)),
      numParts
    );
    console.log(
      "Randomly Buy divided into 5 parts:",
      randomAmount.map((part) => part.toNumber())
    );
    for (let i = 0; i < numParts; i++) {
      await pancakeSwap.swapBuy(Math.round(randomAmount[i].toNumber()));
      await sleep(randomTimestamp[i] * 1000);
    }
  } else if (command.position === "bear") {
    const reserve1Percent = reserve1.times(command.percent / 100);

    const randomAmount: Big[] = divideIntoPartsBig(
      reserve1Percent.div(Big(10).pow(18)),
      numParts
    );
    console.log(
      "Randomly sell divided into 5 parts:",
      randomAmount.map((part) => part.toFixed())
    );
    for (let i = 0; i < numParts; i++) {
      await pancakeSwap.swapSell(randomAmount[i].toNumber());
      await sleep(randomTimestamp[i] * 1000);
    }
  }
}
commandMM({
  percent: 5,
  seconds: 60,
  position: "bull",
}, 2).then();

// commandMM({
//   percent: 5,
//   seconds: 60,
//   position: "bear",
// }).then();
