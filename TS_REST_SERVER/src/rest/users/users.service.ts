import { Injectable } from '@nestjs/common';
import {SignUpOutputType} from "./dtos/sign-up.dto";
import {SignInOutputType} from "./dtos/sign-in.dto";
import {SignOutOutputType} from "./dtos/sign-out.dto";
import {GetAllUsersOutputType, GetUserOutputType} from "./dtos/get-user.dto";

@Injectable()
export class UsersService {
    async signUp(): Promise<SignUpOutputType> {
        return {ok: false, error: ""}
    }

    async signIn(): Promise<SignInOutputType> {
        return {ok: false, error: ""}
    }

    async signOut(): Promise<SignOutOutputType> {
        return {ok: false, error: ""}
    }

    async getUser(): Promise<GetUserOutputType> {
        return {ok: false, error: ""}
    }

    async getAllUsers(): Promise<GetAllUsersOutputType> {
        return {ok: false, error: ""}
    }
}
