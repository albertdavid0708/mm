import { number } from "joi";
import "reflect-metadata";
import { Contract } from "./Contract";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntityWithTimestamps } from "./Base";
import { DepositWithdraw } from "./DepositWithdraw";

@Entity("currencies")
export class Currency extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Contract, (contract) => contract.currency)
  contracts: Contract[];

  @OneToMany(
    () => DepositWithdraw,
    (depositWithdraw) => depositWithdraw.currency
  )
  depositWithdraw: DepositWithdraw[];

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column()
  decimal: number;

  @Column({ name: "is_withdrawal_allowed", comment: "Lock withdraw" })
  isWithdrawalAllowed: boolean;

  @Column({ name: "withdrawal_upper_threshold", comment: "" })
  withdrawalUpperThreshold: string;

  @Column({ name: "withdrawal_lower_threshold", comment: "" })
  withdrawalLowerThreshold: string;

  @Column({ name: "image_url" })
  imageUrl: string;
}
