import { } from "typedi";
import { Blockchain } from "../../entities/Blockchain";
import { IBlockchainRepo } from "../../repositories/IBlockchainRepo";
import { IBlockchainService } from "../IBlockchainService";
import { getProvider } from "../../utils/EVMBlockchainUtils";
import Web3 from "web3";
import claimAbi from "../../../assets/ClaimABI.json";
import { ethers } from "ethers";
import { Contract } from "../../entities/Contract";
import { IContractRepo } from "../../repositories/IContractRepo";
import { BlockchainRepo } from "../../repositories/impl/BlockchainRepo";
import { ContractRepo } from "../../repositories/impl/ContractRepo";

export class EVMBlockchainService implements IBlockchainService {
	constructor(
		private readonly blockchainRepo: IBlockchainRepo,
		private readonly contractRepo: IContractRepo,
	) { }

	SLOW_BLOCK = 5;
	SYNC_STEP = 100;
	DEPOSIT_FUNCTION = "DepositToken";

	public async syncSingleBlockchainLatestBlock(blockchain: Blockchain) {
		if (blockchain.isDeactivated) {
			return;
		}
		const latestBlockNumber = await getProvider(
			blockchain.chainId,
			blockchain.rpcUrl,
			blockchain.name
		).getBlockNumber();
		let fromBlock = blockchain.lastBlockNumber
		const blockLimit: number = latestBlockNumber - this.SLOW_BLOCK;
		while (fromBlock < latestBlockNumber) {
			const toBlock =
				blockLimit > fromBlock + 1 + this.SYNC_STEP
					? fromBlock + 1 + this.SYNC_STEP
					: blockLimit;
			const addresses = blockchain.contracts.map((contract) => contract.address);
			const logs = await new Web3(blockchain.rpcUrl).eth.getPastLogs({
				fromBlock: fromBlock + 1,
				toBlock: toBlock,
				address: addresses,
			});
			console.log(`crawling from ${fromBlock + 1} to ${toBlock}`)
			if (!logs.length) {
				blockchain.lastBlockNumber = toBlock;
				await this.blockchainRepo.updateBlockNumber(blockchain.id, toBlock);
			}
			const contracts = await this.contractRepo.findAll();
			if (!contracts) {
				return;
			}
			await this.processLogs(logs, claimAbi, contracts);
			fromBlock = toBlock
		}
	}

	private async processLogs(logs: any, abi: any, contracts: Contract[]) {
		const contractMap: Record<number, Contract> = {};
		for (const contract of contracts) {
			// Assuming 'id' is the field you want to use as the key
			contractMap[contract.id] = contract;
		}
		let iface = new ethers.utils.Interface(abi);
		let parsedLog: ethers.utils.LogDescription;
		for (let log of logs) {
			try {
				parsedLog = iface.parseLog(log);
			} catch {
				break;
			}
			console.log("log data::", parsedLog);
			switch (parsedLog.name) {
				case this.DEPOSIT_FUNCTION: {
					//     const fromAddr = parsedLog.args.depositFrom
					//     const c = contractMap[parsedLog.args.address]
					//     this.paymentService.deposit(
					//         fromAddr, ethers.utils.formatUnits(parsedLog.args.value.toString(), c.currency.decimal), c)
					// }
					break;
				}
				default:
					break;
			}
		}
		console.log(logs);
	}

	public async runSynchronize(): Promise<void> {
		console.log("Start synchronizing process");
		while (true) {
			const allBlockchain = await this.blockchainRepo.findAll();
			let promises: Promise<any>[] = [];
			allBlockchain.forEach((b) => {
				promises.push(this.syncSingleBlockchainLatestBlock(b));
			});
			await Promise.all(promises);
		}
	}
	
}

// Define a test function here
async function runTest() {
	const module = await import(`../../database/MyDataSource`);
	await module.mysqlDataSource.initialize();
	const dataSource = module.mysqlDataSource; // Initialize your data source here
	const blrepo = new BlockchainRepo(dataSource)
	const evmService = new EVMBlockchainService(
		blrepo,
		new ContractRepo(dataSource)
	);
	const blockchain = await blrepo.findOneById(1)
	console.log(blockchain)
	await evmService.syncSingleBlockchainLatestBlock(blockchain)
	// Perform your test logic here
}

// Check if the script is executed directly
if (require.main === module) {
	// Run the test function only when executed directly
	runTest();
}
