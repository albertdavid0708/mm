import { Chain } from "../helper/enum";
import { Pagination } from "./pagination.schema";

type WalletParams = Pagination & {
  address?: string;
};

type WalletCreatePayload = {
  chain: Chain;
  numberOfWallet: number;
};

type WalletOnChain = {
  address: string;
  privateKey: string;
  mnemonic?: string;
};

export { WalletParams, WalletCreatePayload, WalletOnChain };
