import { RA } from "@domain/user/values-objects/register-academic"
import { Either, left, right } from "../../core/either"
import { User, UserRole } from "@domain/user/entity/User"
import { UserRepository } from "@domain/user/repository/user-repository"
import { Email } from "@domain/user/values-objects/email"
import { Password } from "@domain/user/values-objects/password"

interface CreateUserRequest {
    name: string
    email: string
    password: string
    role: UserRole
    ra: string
}

type CreateUserResponse = Either<
    Error,
    {
        user: User
    }
>

export class CreateUserUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute({
        name,
        email,
        password,
        role,
        ra
    }: CreateUserRequest): Promise<CreateUserResponse> {

        let studentRA
        let emailVO
        let passwordVO

        try {
            studentRA = RA.create(ra)
            emailVO = Email.create(email)
            passwordVO = Password.create(password)
        } catch (error) {
            return left(error as Error)
        }

        const existingEmail = await this.userRepository.findByEmail(email)

        if (existingEmail) {
            return left(new Error("Usuário já existe!"))
        }

        const existingRA = await this.userRepository.findByRA(studentRA)

        if (existingRA) {
            return left(new Error("RA já cadastrado!"))
        }

        const userOrError = User.create({
            name,
            email: emailVO,
            password: passwordVO,
            role,
            ra: studentRA
        })

        if (userOrError.isLeft()) {
            return left(userOrError.value)
        }

        const user = userOrError.value

        await this.userRepository.create(user)

        return right({ user })
    }
}