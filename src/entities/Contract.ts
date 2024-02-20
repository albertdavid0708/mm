import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { BaseEntityWithTimestamps } from "./Base";
import { Blockchain } from "./Blockchain";
import { Currency } from "./Currency";
import { DepositWithdraw } from "./DepositWithdraw";
import { WalletAction } from "./WalletAction";

@Entity("contracts")
export class Contract extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "contract_name" })
  contractName: string;

  @Column({ name: "is_paused", comment: "" })
  isPause: string;

  @ManyToOne(() => Blockchain, (blockchain) => blockchain.contracts)
  @JoinColumn({ name: "blockchain_id" })
  blockchain: Blockchain;

  @Column({ name: "address" })
  address: string;

  @Column({ name: "admin_address" })
  adminAddress: string;

  @ManyToOne(() => Currency, (currency) => currency.contracts)
  @JoinColumn({ name: "currency_id" })
  currency: Currency;

  @OneToMany(
    () => DepositWithdraw,
    (depositWithdraw) => depositWithdraw.currency
  )
  depositWithdraw: DepositWithdraw[];

  @OneToMany(() => WalletAction, (walletAction) => walletAction.contract)
  walletAction: WalletAction[];
}
