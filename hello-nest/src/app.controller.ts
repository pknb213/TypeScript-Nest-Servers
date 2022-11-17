import {Controller, Get, Post} from '@nestjs/common';
import { AppService } from './app.service';
import {AuthService} from "./auth/auth.service";

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private readonly authService: AuthService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post("/1")
  authTest(email: string, pass: string) {
    return this.authService.validateUser(email, pass)
  }
  @Post("/2")
  loginTest(email: string) {
    return this.authService.login(email)
  }
}
