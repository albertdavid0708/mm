import { number } from "joi";
import "reflect-metadata";
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntityWithTimestamps } from "./Base";
import { decrypt, encrypt } from "../helper/cryptoHelper";

@Entity("wallets")
export class Wallet extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column({ name: "private_key" })
  privateKey: string;

  @Column({ name: "iv" })
  iv: string;

  @BeforeInsert()
  @BeforeUpdate()
  encryptField() {
    if (this.privateKey) {
      const { iv, encryptedData } = encrypt(this.privateKey);
      this.privateKey = encryptedData;
      this.iv = iv;
    }
  }

  @AfterLoad()
  decryptField() {
    if (this.privateKey) {
      this.privateKey = decrypt(this.privateKey, this.iv);
    }
  }
}
