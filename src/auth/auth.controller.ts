import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './DTO/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginEmailDTO } from './DTO/login-email.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login_firebase')
  async login(@Body() { idToken }: LoginDTO) {
    return await this.authService.validateUser(idToken);
  }

  @Post('/login_with_email')
  async loginWithEmail(@Body() { email, password }: LoginEmailDTO) {
  }
}
