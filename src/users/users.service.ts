import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDTO, IUserDTO, UpdatePasswordDTO } from "./user.dto";
import { v4 } from "uuid";
import { compareSync, hashSync } from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../db/entities/users.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepositoty: Repository<UserEntity>,
  ) {}

  async create(user: CreateUserDTO): Promise<IUserDTO> {
    const usernameAlreadyExists = await this.userRepositoty.findOne({
      where: { username: user.username },
    });

    if (usernameAlreadyExists) {
      throw new ConflictException("Nome de usuário já cadastrado no sistema.");
    }

    const newUser: IUserDTO = {
      id_user: v4(),
      username: user.username,
      password: hashSync(user.password, 10),
    };

    const userCreated = await this.userRepositoty.save(newUser);

    return this.entityToDTO(userCreated);
  }

  async findById(user_id: string): Promise<IUserDTO> {
    const foundUser = await this.userRepositoty.findOne({
      where: { id_user: user_id },
    });

    if (!foundUser) {
      throw new NotFoundException("Usuário não encontrado");
    }

    return this.entityToDTO(foundUser);
  }

  async findByUsername(username: string, signIn?: boolean): Promise<IUserDTO> {
    const foundUser = await this.userRepositoty.findOne({
      where: { username },
    });

    if (!foundUser) {
      throw signIn
        ? new UnauthorizedException("Usuário/senha não correspondem")
        : new NotFoundException();
    }

    return this.entityToDTO(foundUser, signIn);
  }

  async updateUsername(
    reqUser: ExpressUser,
    username: string,
  ): Promise<IUserDTO> {
    const [foundUser, usernameAlreadyExists] = await Promise.all([
      this.findById(reqUser.id),
      this.userRepositoty.findOne({
        where: { username },
      }),
    ]);

    if (usernameAlreadyExists && usernameAlreadyExists.id_user !== reqUser.id) {
      throw new ConflictException("Nome de usuário já cadastrado no sistema.");
    }

    foundUser.username = username;
    const updatedUser = await this.userRepositoty.save(foundUser);

    return this.entityToDTO(updatedUser);
  }

  async updatePassword(
    reqUser: ExpressUser,
    body: UpdatePasswordDTO,
  ): Promise<IUserDTO> {
    const foundUser = await this.userRepositoty.findOne({
      where: { id_user: reqUser.id },
    });

    if (!foundUser || !compareSync(body.currentPassword, foundUser.password)) {
      throw new UnauthorizedException("Usuário/senha não correspondem");
    }

    foundUser.password = hashSync(body.newPassword, 10);
    const updatedUser = await this.userRepositoty.save(foundUser);

    return this.entityToDTO(updatedUser);
  }

  async delete(reqUser: ExpressUser): Promise<void> {
    const foundUser = await this.findById(reqUser.id);

    await this.userRepositoty.delete(foundUser.id_user);
  }

  private entityToDTO(user: UserEntity, showPassword?: boolean): IUserDTO {
    const formatedUser = {
      id_user: user.id_user,
      username: user.username,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    if (showPassword) formatedUser["password"] = user.password;

    return formatedUser;
  }
}
