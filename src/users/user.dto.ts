import { IsString, MinLength, MaxLength } from "class-validator";

export interface IUserDTO {
  id_user: string;
  username: string;
  password?: string;
  created_at?: string;
  updated_at?: string;
}

export class CreateUserDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(256)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(36)
  password: string;
}

export class UpdatePasswordDTO {
  @IsString()
  @MinLength(6)
  @MaxLength(36)
  currentPassword: string;

  @IsString()
  @MinLength(6)
  @MaxLength(36)
  newPassword: string;
}
