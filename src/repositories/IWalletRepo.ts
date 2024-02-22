import { Wallet } from "../entities/Wallet";
import { WalletOnChain } from "../schema/wallet.schema";

export interface IWalletRepo {
  createMultiple: (wallets: WalletOnChain[]) => Promise<void>;
}
