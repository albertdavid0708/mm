import { DataSource, Repository } from "typeorm";
import { Wallet } from "../../entities/Wallet";
import { WalletOnChain, WalletParams } from "../../schema/wallet.schema";
import { IWalletRepo } from "../IWalletRepo";

export class WalletRepo implements IWalletRepo {
  private readonly walletRepository: Repository<Wallet>;

  constructor(private readonly dataSource: DataSource) {
    this.walletRepository = this.dataSource.getRepository(Wallet);
  }
  public async createMultiple(wallets: WalletOnChain[]): Promise<void> {
    const walletDatabases: Wallet[] = [];
    for (const wallet of wallets) {
      const newWallet = new Wallet();
      newWallet.address = wallet.address;
      newWallet.privateKey = wallet.privateKey;
      walletDatabases.push(newWallet);
    }
    console.log(walletDatabases);
    await this.walletRepository.insert(walletDatabases);
  }

  public async getWallets(params: WalletParams): Promise<Wallet[]> {
    const wallets = this.walletRepository.find();
    return wallets;
  }
}
