import { Module } from '@nestjs/common';
import {UsersModule} from "../../rest/users/users.module";
import {APP_GUARD} from "@nestjs/core";
import {AuthGuard} from "./auth.guard";

@Module({
    imports: [
        UsersModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        }
    ]
})
export class AuthModule {}
