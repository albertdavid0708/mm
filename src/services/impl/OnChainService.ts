import { ethers } from "ethers";
import { WalletOnChain } from "../../schema/wallet.schema";
import { IOnChainService } from "../IOnChainService";
import { Chain } from "../../helper/enum";

class EVM implements IOnChainService {
  public async createWallet(): Promise<WalletOnChain> {
    const wallet = ethers.Wallet.createRandom();
    const walletReturn: WalletOnChain = {
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
    return walletReturn;
  }
  public async createMultipleWallet(numberOfWallet: number) {
    const wallets: WalletOnChain[] = [];
    for (let i = 0; i < numberOfWallet; i++) {
      wallets.push(await this.createWallet());
    }
    return wallets;
  }
}
export const chainMapping = {
  [Chain.bsc]: EVM,
};
