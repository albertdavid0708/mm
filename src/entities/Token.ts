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

@Entity("tokens")
export class Token extends BaseEntityWithTimestamps {}
