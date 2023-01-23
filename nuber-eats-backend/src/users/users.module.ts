import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {UsersResolver} from "./user.resolver";
import {UsersService} from "./user.service";
import {Verification} from "./entities/verfication.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Verification]),
    ],
    providers: [UsersResolver, UsersService],
    exports: [UsersService]
})
export class UsersModule {}
