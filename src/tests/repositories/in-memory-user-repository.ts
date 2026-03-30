import { UserRepository } from '@domain/user/repository/user-repository'
import { User } from '@domain/user/entity/User'
import { Email } from '@domain/user/values-objects/email'
import { RA } from '@domain/user/values-objects/register-academic'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async create(user: User): Promise<void> {
    this.items.push(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    return (
      this.items.find(user =>
        user.email.getValue() === email
      ) ?? null
    )
  }

  async findByRA(ra: RA): Promise<User | null> {
    return (
      this.items.find(user =>
        user.ra?.equals(ra)
      ) ?? null
    )
  }

  async save(user: User): Promise<void> {
    const index = this.items.findIndex(u =>
      u.email.getValue() === user.email.getValue()
    )

    if (index >= 0) {
      this.items[index] = user
    }
  }
}