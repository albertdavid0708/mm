import { ethers } from "ethers";
import Web3 from "web3";
const providerCache: Record<number, ethers.providers.JsonRpcProvider> = {};

const getProvider = (chainId: number, rpcURL: string, name: string) => {
  console.log(chainId, rpcURL, name);
  if (!providerCache[chainId]) {
    providerCache[chainId] = new ethers.providers.JsonRpcProvider(rpcURL, {
      name: name,
      chainId: chainId,
    });
  }
  return providerCache[chainId];
};
const crawlEVMLogs = async (
  rpcUrl: string,
  fromBlock: number,
  toBlock: number,
  addresses: string[]
) => {
  const logs = new Web3(rpcUrl).eth.getPastLogs({
    fromBlock: fromBlock,
    toBlock: toBlock,
    address: addresses,
  });
  return logs;
};

export { getProvider, crawlEVMLogs };
