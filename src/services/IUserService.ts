import { User } from '../entities/User'

export type IUserService = {
  findOneById: (id: number) => Promise<User | null>
  createOne: (user: User) => Promise<User | null>
}
