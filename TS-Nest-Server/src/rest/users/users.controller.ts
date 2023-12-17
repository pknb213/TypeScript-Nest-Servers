import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {UsersService} from "./users.service";
import {SignUpInput, SignUpOutput} from "./dtos/sign-up.dto";
import {SignInInput, SignInOutput} from "./dtos/sign-in.dto";
import {SignOutInput, SignOutOutput} from "./dtos/sign-out.dto";
import {GetAllUsersOutput, GetUserOutput} from "./dtos/get-user.dto";
import {Role} from "../../global/auth/role.decorator";
import {AuthUser} from "../../global/auth/auth.decorator";
import {UserEntity} from "./entities/user.entity";
import {EditUserInput, EditUserOutput} from "./dtos/edit-user.dto";

@Controller('/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Post()
    async signUp(
        @Body() signUpInput: SignUpInput
    ): Promise<SignUpOutput> {
        return this.usersService.signUp(signUpInput)
    }

    @Role(["Owner"])
    @Get('/all')
    async getUsers(
    ): Promise<GetAllUsersOutput> {
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
        @Body() signInInput: SignInInput
    ): Promise<SignInOutput> {
        return this.usersService.signIn(signInInput)
    }

    @Delete("/logout")
    async signOut(
        @Body() signOutInput: SignOutInput
    ): Promise<SignOutOutput> {
        return this.usersService.signOut(signOutInput)
    }

    @Role(["Owner"])
    @Get(':id')
    async getUser(
        @Param('id') userId: number
    ): Promise<GetUserOutput> {
        return this.usersService.getUser(userId)
    }

    @Role(["Any"])
    @Put()
    async editUser(
        @AuthUser() user: UserEntity,
        @Body() editUserInput: EditUserInput
    ): Promise<EditUserOutput> {
        return this.usersService.editUser(user.id, editUserInput)
    }

}
