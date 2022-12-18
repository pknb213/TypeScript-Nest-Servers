import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService} from "./auth/auth.service";
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import {JwtModule, JwtService} from "@nestjs/jwt";
import { MoviesModule } from './movies/movies.module';
@Module({
  imports: [AuthModule, UsersModule, JwtModule, MoviesModule],
  controllers: [AppController],
  providers: [AppService, AuthService, UsersService, JwtService],
})
export class AppModule {}
