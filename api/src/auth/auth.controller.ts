import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './current-user.decorator';
import type { TokenPayload } from './token.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(@Body() payload: CreateUsuarioDto) {
    return this.authService.register(payload);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: TokenPayload) {
    return this.authService.getSessionUser(user.sub);
  }
}
