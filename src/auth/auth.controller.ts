import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login_firebase')
  async login(@Body('id_token') idToken: string) {
    const user = await this.authService.validateUser(idToken);
    return { id: user.id };
  }
}
