import { WalletOnChain } from "../schema/wallet.schema";

export interface IOnChainService {
  createWallet: () => Promise<WalletOnChain>;
  createMultipleWallet: (numberOfWallet: number) => Promise<WalletOnChain[]>;
}
