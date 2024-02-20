import { User } from '../../entities/User'
import { IUserRepo } from '../IUserRepo'
import { DataSource, Repository } from 'typeorm'

export class UserRepo implements IUserRepo {
	private readonly userRepository: Repository<User>

	constructor (
		private readonly dataSource: DataSource
	) {
		this.userRepository = this.dataSource.getRepository(User)
	}

	public async findOneById (id: number): Promise<User | null> {
		console.log(await this.userRepository.findOne(
			{ where:
				{ id: id }
			}
		))
		return await this.userRepository.findOne(
			{ where:
				{ id: id }
			}
		)
	}

	public async findAll(): Promise<User[]> {
		return await this.userRepository.find()
	}

	public async createOne(user: User): Promise<User | null>{
		const createdUser = await this.userRepository.create(
			user
		)
		return createdUser
	}
}
