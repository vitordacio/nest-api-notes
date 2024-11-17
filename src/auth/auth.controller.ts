import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthResponseDTO, SignInDTO } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async signIn(@Body() auth: SignInDTO): Promise<AuthResponseDTO> {
    const response = await this.authService.signIn(auth);

    return response;
  }
}
