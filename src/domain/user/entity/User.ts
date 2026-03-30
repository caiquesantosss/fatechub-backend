import { Either, left, right } from "../../../core/either"
import { Email } from "../values-objects/email"
import { Password } from "../values-objects/password"
import { RA } from "../values-objects/register-academic"

export enum UserRole {
  STUDENT = "student",
  PROFESSOR = "professor",
  SECRETARY = "secretary",
  COORDINATOR = "coordinator"
}

export type UserStatus = "active" | "inactive"

interface CreateUserProps {
  name: string
  email: Email
  password: Password
  role: UserRole
  ra?: RA
}

export class User {
  private constructor(
    public name: string,
    public email: Email,
    public password: Password,
    public role: UserRole,
    public status: UserStatus,
    public ra?: RA
  ) {}

  static create(props: CreateUserProps): Either<Error, User> {
    if (props.role === UserRole.STUDENT && !props.ra) {
      return left(new Error("Aluno precisa ter RA"))
    }

    if (props.role !== UserRole.STUDENT && props.ra) {
      return left(new Error("Apenas alunos podem ter RA"))
    }

    const user = new User(
      props.name,
      props.email,
      props.password,
      props.role,
      "active",
      props.ra
    )

    return right(user)
  }

  disable() {
    if (this.status === 'inactive') {
      throw new Error('Usuário já está desativado!')
    }

    this.status = 'inactive'
  }

  activate() {
    if (this.status === 'active') {
      throw new Error('Usuário já está ativo')
    }

    this.status = 'active'
  }
}