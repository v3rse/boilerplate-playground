import { IsNotEmpty, MinLength } from 'class-validator'

export class User {
  @IsNotEmpty()
  username: string

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  lastname: string

  @IsNotEmpty()
  @MinLength(6)
  password: string

  @IsNotEmpty()
  age: number
}