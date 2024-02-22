import { WalletCreatePayload, WalletParams } from "../../schema/wallet.schema";
import { IWalletService } from "../IWalletService";
import { IWalletRepo } from "../../repositories/IWalletRepo";
import { IOnChainService } from "../IOnChainService";
import { chainMapping } from "./OnChainService";

class WalletService implements IWalletService {
  constructor(private readonly walletRepo: IWalletRepo) {}

  public async createMultiple(payload: WalletCreatePayload) {
    console.log(chainMapping[payload.chain]);
    const classOnChainService: IOnChainService = new chainMapping[
      payload.chain
    ]();

    const wallets = await classOnChainService.createMultipleWallet(
      payload.numberOfWallet
    );
    await this.walletRepo.createMultiple(wallets);
    return;
  }

  public async getWallet(params: WalletParams) {}
}

export { WalletService };
