import "reflect-metadata";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntityWithTimestamps } from "./Base";
import { Currency } from "./Currency";
import { Contract } from "./Contract";

enum TransactionType {
  Deposit = "deposit",
  Withdraw = "withdraw",
}

@Entity("deposit_withdraw")
export class DepositWithdraw extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Currency, (currency) => currency.contracts)
  @JoinColumn({ name: "currency_id" })
  currency: Currency;

  @Column({
    type: "enum",
    enum: TransactionType,
    default: TransactionType.Deposit, // Set a default value if needed
  })
  type: TransactionType;

  @ManyToOne(() => Contract, (contract) => contract.depositWithdraw)
  @JoinColumn({ name: "contract_id" })
  contract: Contract;

  @Column()
  address: string;

  @Column()
  signature: string;

  @Column()
  amount: number;

  @Column({ name: "approved_by" })
  approvedBy: string;
}
