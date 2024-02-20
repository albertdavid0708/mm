
import { Contract } from "../entities/Contract"

export interface IContractRepo {
    findAll: () => Promise<Contract[]>
}