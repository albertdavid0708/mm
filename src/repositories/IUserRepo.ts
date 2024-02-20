import { User } from '../entities/User';

export interface IUserRepo {
  findOneById: (id: number) => Promise<User | null>;
  findAll: () => Promise<User[]>;
  createOne: (user: User) => Promise<User | null>;
}
