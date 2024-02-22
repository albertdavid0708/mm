import { number } from "joi";
import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BaseEntityWithTimestamps } from "./Base";

@Entity("blockchains")
export class Blockchain extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "chain_id" })
  chainId: number;

  @Column({ name: "rpc_url", type: "varchar", length: 256 })
  rpcUrl: string;

  @Column({ name: "name", type: "varchar", length: 128 })
  name: string;

  @Column({ name: "last_block_number" })
  lastBlockNumber: number;

  @Column({ name: "is_deactivated" })
  isDeactivated: boolean;
}
