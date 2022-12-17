import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService} from "./auth/auth.service";
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import {JwtModule, JwtService} from "@nestjs/jwt";
import { MoviesController } from './movies/movies.controller';
import { MoviesService } from './movies/movies.service';

@Module({
  imports: [AuthModule, UsersModule, JwtModule],
  controllers: [AppController, MoviesController],
  providers: [AppService, AuthService, UsersService, JwtService, MoviesService],
})
export class AppModule {}
