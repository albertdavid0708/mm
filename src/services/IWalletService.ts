import {
  WalletCreatePayload,
  WalletParams,
  WalletResponse,
} from "../schema/wallet.schema";

export type IWalletService = {
  createMultiple: (payload: WalletCreatePayload) => Promise<any>;
  getWallet: (params: WalletParams) => Promise<WalletResponse[]>;
};
