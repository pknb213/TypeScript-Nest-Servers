import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {UsersService} from "./users.service";
import {SignUpInputType, SignUpOutputType} from "./dtos/sign-up.dto";
import {SignInInputType, SignInOutputType} from "./dtos/sign-in.dto";
import {SignOutInputType, SignOutOutputType} from "./dtos/sign-out.dto";
import {GetAllUsersOutputType, GetUserOutputType} from "./dtos/get-user.dto";

@Controller('/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Post()
    async signUp(
        @Body() signUpInputType: SignUpInputType
    ): Promise<SignUpOutputType> {
        return this.usersService.signUp(signUpInputType)
    }

    @Get('/all')
    async getUsers(): Promise<GetAllUsersOutputType> {
        return this.usersService.getAllUsers()
    }

    @Get(':id')
    async getUser(
        @Param('id') userId: number
    ): Promise<GetUserOutputType> {
        console.log(userId)
        return this.usersService.getUser(userId)
    }

    @Post("/login")
    async signIn(
        @Body() signInInputType: SignInInputType
    ): Promise<SignInOutputType> {
        return this.usersService.signIn(signInInputType)
    }

    @Delete("/logout")
    async signOut(
        @Body() signOutInputType: SignOutInputType
    ): Promise<SignOutOutputType> {
        return this.usersService.signOut(signOutInputType)
    }

    // Todo: Edit User    1. DTO, 2. Service
    @Put(":id")
    async editUser(
        @Body() editUserInputType: any
    ): Promise<any> {
        return this.usersService.editUser(editUserInputType)
    }
}
