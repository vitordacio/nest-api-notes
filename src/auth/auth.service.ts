import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { AuthResponseDTO, SignInDTO } from "./auth.dto";
import { compareSync } from "bcrypt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  private expirationTimeInSeconds: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.expirationTimeInSeconds = +this.configService.get<number>(
      "JWT_EXPIRATION_TIME",
    );
  }

  async signIn(auth: SignInDTO): Promise<AuthResponseDTO> {
    const foundUser = await this.usersService.findByUsername(
      auth.username,
      true,
    );

    if (!foundUser || !compareSync(auth.password, foundUser.password)) {
      throw new UnauthorizedException("Usuário/senha não correspondem");
    }

    const payload = { sub: foundUser.id_user, username: foundUser.username };

    const token = this.jwtService.sign(payload);

    return {
      token,
      expiresIn: this.expirationTimeInSeconds,
    };
  }
}
