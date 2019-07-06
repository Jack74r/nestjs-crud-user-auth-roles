import { JwtAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Controller, Post, Body, UseGuards, Logger } from '@nestjs/common';
import { UserLoginDto } from '../user/dto/user-login.dto';
import { UserEntity } from '../entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) { }

  @Post('login')
  async login(@Body() user: UserLoginDto): Promise<any> {
    return this.service.login(user);
  }

  @Post('register')
  async register(@Body() user: UserEntity): Promise<any> {
    Logger.log("register");
    Logger.log(user);

    return this.service.register(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('test')
  async test(): Promise<any> {
    return { test: "test ok" };
  }
}
