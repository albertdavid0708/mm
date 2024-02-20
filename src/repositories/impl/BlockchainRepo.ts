import { Blockchain } from '../../entities/Blockchain'
import { IBlockchainRepo } from '../IBlockchainRepo'
import { DataSource, Repository } from 'typeorm'



export class BlockchainRepo implements IBlockchainRepo {
    private readonly blockchainRepo: Repository<Blockchain>

    constructor(
        private readonly dataSource: DataSource
    ) {
        this.blockchainRepo = this.dataSource.getRepository(Blockchain)
    }

    public async findAll(): Promise<Blockchain[]> {
        return await this.blockchainRepo.find({
            relations: {
                contracts: true,
            },
        })
    }

    public async findOneById(id: number): Promise<Blockchain> {
        const b = await this.blockchainRepo.findOne({
            where: {
                id: id
            },
            relations: {
                contracts: true
            }
        })
        if (!b) {
            throw new Error(`Blockchain with ID ${id} not found.`);
        }
        return b
    }

    public async updateBlockNumber(blockchainId: number, latestBlockNumber: number): Promise<Blockchain> {
        // Find the blockchain entity by ID.
        const blockchain = await this.blockchainRepo.findOne({
            where: { id: blockchainId },
        })

        if (!blockchain) {
            throw new Error(`Blockchain with ID ${blockchainId} not found.`);
        }

        // Update the latest block number.
        blockchain.lastBlockNumber = latestBlockNumber;

        // Save the updated blockchain entity.
        return await this.blockchainRepo.save(blockchain);
    }
}

async function runTest() {
    const module = await import(`../../database/MyDataSource`);
    await module.mysqlDataSource.initialize();
    const dataSource = module.mysqlDataSource; // Initialize your data source here
    const blockchainRepo = new BlockchainRepo(dataSource);
    
    // Perform your test logic here
    const startTime = performance.now(); // Capture the start time in milliseconds
    const allBlockchains = await blockchainRepo.findAll();
    console.log("All Blockchains:", allBlockchains);

    const endTime = performance.now(); // Capture the end time in milliseconds
    const elapsedTime = endTime - startTime; // Calculate the elapsed time in milliseconds
    console.log(`Test completed in ${elapsedTime} ms`);
}


// Check if the script is executed directly
if (require.main === module) {
    // Run the test function only when executed directly
    runTest();
}