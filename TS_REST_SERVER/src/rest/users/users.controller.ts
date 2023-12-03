import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {UsersService} from "./users.service";
import {SignUpInputType, SignUpOutputType} from "./dtos/sign-up.dto";
import {SignInInputType, SignInOutputType} from "./dtos/sign-in.dto";
import {SignOutInputType, SignOutOutputType} from "./dtos/sign-out.dto";
import {GetAllUsersOutputType, GetUserInputType, GetUserOutputType} from "./dtos/get-user.dto";

@Controller('/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Post()
    async signUp(
        @Body()
        signUpInputType: SignUpInputType
    ): Promise<SignUpOutputType> {
        return this.usersService.signUp()
    }

    @Get(':id')
    async getUser(
        @Param('id')
        getUserInputType: GetUserInputType
    ): Promise<GetUserOutputType> {
        return this.usersService.getUser()
    }
    @Get('/all')
    async getUsers(): Promise<GetAllUsersOutputType> {
        return this.usersService.getAllUsers()
    }

    @Post()
    async signIn(
        @Body()
        signInInputType: SignInInputType
    ): Promise<SignInOutputType> {
        return this.usersService.signIn()
    }

    @Post()
    async signOut(
        @Body()
        signOutInputType: SignOutInputType
    ): Promise<SignOutOutputType> {
        return this.usersService.signOut()
    }
}
