export type IBlockchainService = {
    runSynchronize: () => Promise<void>
}