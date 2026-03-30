import { User } from "../entity/User"
import { RA } from "../values-objects/register-academic"

export interface UserRepository {
     create(user: User): Promise<void>
     findByEmail(email: string): Promise<User | null>
     findByRA(ra: RA): Promise<User | null>
     save(user: User): Promise<void>
}

