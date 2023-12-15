import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {UsersService} from "./users.service";
import {SignUpInputType, SignUpOutputType} from "./dtos/sign-up.dto";
import {SignInInputType, SignInOutputType} from "./dtos/sign-in.dto";
import {SignOutInputType, SignOutOutputType} from "./dtos/sign-out.dto";
import {GetAllUsersOutputType, GetUserOutputType} from "./dtos/get-user.dto";
import {Role} from "../../global/auth/role.decorator";
import {AuthUser} from "../../global/auth/auth.decorator";
import {UserEntity} from "./entities/user.entity";
import {EditUserInputType, EditUserOutputType} from "./dtos/edit-user.dto";

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

    @Role(["Owner"])
    @Get('/all')
    async getUsers(
    ): Promise<GetAllUsersOutputType> {
        return this.usersService.getAllUsers()
    }

    @Role(["Any"])
    @Get("/me")
    async me(
        @AuthUser() user: UserEntity
    ): Promise<UserEntity> {
        console.log("???????", user)
        return user
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

    @Role(["Owner"])
    @Get(':id')
    async getUser(
        @Param('id') userId: number
    ): Promise<GetUserOutputType> {
        return this.usersService.getUser(userId)
    }

    @Role(["Any"])
    @Put()
    async editUser(
        @AuthUser() user: UserEntity,
        @Body() editUserInputType: EditUserInputType
    ): Promise<EditUserOutputType> {
        return this.usersService.editUser(user.id, editUserInputType)
    }

}
