import { DataSource, Repository } from "typeorm";
import { Currency } from "../../entities/Currency";
import { ICurrencyRepo } from "../ICurrencyRepo";

export class CurrencyRepo implements ICurrencyRepo {
  private readonly currencyRepo: Repository<Currency>;

  constructor(private readonly dataSource: DataSource) {
    this.currencyRepo = this.dataSource.getRepository(Currency);
  }
  public async findOneBySymbol(symbol: string): Promise<Currency | null> {
    return this.currencyRepo.findOne({
      where: {
        symbol: symbol,
      },
    });
  }

  public async findOneById(id: number): Promise<Currency | null> {
    return this.currencyRepo.findOne({
      where: {
        id: id,
      },
    });
  }
}
