import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDTO, IUserDTO, UpdatePasswordDTO } from "./user.dto";
import { AuthGuard } from "../auth/auth.guard";
import { Request } from "express";

@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() body: CreateUserDTO): Promise<IUserDTO> {
    const user = await this.usersService.create(body);

    return user;
  }

  @UseGuards(AuthGuard)
  @Get("/:user_id")
  async findById(@Param("user_id") user_id: string): Promise<IUserDTO> {
    const user = await this.usersService.findById(user_id);
    return user;
  }

  @UseGuards(AuthGuard)
  @Get("/username/:username")
  async findByUsername(@Param("username") username: string): Promise<IUserDTO> {
    const user = await this.usersService.findByUsername(username);
    return user;
  }

  @UseGuards(AuthGuard)
  @Put("/username/:username")
  async updateUsername(
    @Req() req: Request,
    @Param("username") username: string,
  ): Promise<IUserDTO> {
    const user = await this.usersService.updateUsername(req.user, username);
    return user;
  }

  @UseGuards(AuthGuard)
  @Put("/password")
  async updatePassword(
    @Req() req: Request,
    @Body() body: UpdatePasswordDTO,
  ): Promise<IUserDTO> {
    const user = await this.usersService.updatePassword(req.user, body);
    return user;
  }

  @UseGuards(AuthGuard)
  @Delete()
  async delete(@Req() req: Request): Promise<void> {
    await this.usersService.delete(req.user);
  }
}
