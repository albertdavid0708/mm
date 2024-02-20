import { Blockchain } from "../entities/Blockchain";


export interface IBlockchainRepo {
    findAll: () => Promise<Blockchain[]>
    updateBlockNumber: (blockchainId: number, latestBlockNumber: number) => Promise<Blockchain>
    findOneById: (id: number) => Promise<Blockchain>
}