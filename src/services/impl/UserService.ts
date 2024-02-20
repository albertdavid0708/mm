import { User } from '../../entities/User'
import { } from 'typedi'
import { IUserService } from '../IUserService'
import { IUserRepo } from '../../repositories/IUserRepo'

export class UserService implements IUserService {

	constructor (
		private readonly userRepo: IUserRepo
	) {
	}

	public async findOneById (id: number): Promise<User | null> {
		console.log(id)
		return await this.userRepo.findOneById(id)
	}

	public async createOne (user: User): Promise<User | null> {
		console.log(user)
		return await this.userRepo.createOne(user)
	}
}
