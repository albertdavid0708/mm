import { DataSource, Repository } from "typeorm";
import { IContractRepo } from "../IContractRepo";
import { Contract } from "../../entities/Contract";
import { Blockchain } from "../../entities/Blockchain";

export class ContractRepo implements IContractRepo {
  private readonly contractRepo: Repository<Contract>;

  constructor(private readonly dataSource: DataSource) {
    this.contractRepo = this.dataSource.getRepository(Contract);
  }

  public async findAll(): Promise<Contract[]> {
    return this.contractRepo.find({
      relations: {
        blockchain: true
      }
    });
  }

}
