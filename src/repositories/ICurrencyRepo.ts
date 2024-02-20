import { Currency } from "../entities/Currency";

export interface ICurrencyRepo {
  findOneBySymbol: (symbol: string) => Promise<Currency | null>;
  findOneById: (id: number) => Promise<Currency | null>;
}
