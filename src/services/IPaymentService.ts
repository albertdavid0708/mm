import { Contract } from "../entities/Contract"

export type IPaymentService = {
    deposit: (address: string, amount: number | string, contract: Contract) => Promise<string>
    getWithdrawalApproval: (address: string, amount: number) => Promise<string>
    requestWithdrawal: (address: string, amount: number) => Promise<string>
}