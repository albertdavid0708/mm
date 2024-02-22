import { Wallet } from "../entities/Wallet";
import { WalletOnChain, WalletParams } from "../schema/wallet.schema";

export interface IWalletRepo {
  createMultiple: (wallets: WalletOnChain[]) => Promise<void>;
  getWallets: (params: WalletParams) => Promise<Wallet[]>;
}
