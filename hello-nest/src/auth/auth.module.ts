import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UsersService} from "../users/users.service";
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
  providers: [AuthService],
  imports: [UsersModule, JwtModule],
  exports: [AuthService]
})
export class AuthModule {
}
