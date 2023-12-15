import { Injectable } from '@nestjs/common';
import {SignUpInputType, SignUpOutputType} from "./dtos/sign-up.dto";
import {SignInInputType, SignInOutputType} from "./dtos/sign-in.dto";
import {SignOutInputType, SignOutOutputType} from "./dtos/sign-out.dto";
import {GetAllUsersOutputType, GetUserOutputType} from "./dtos/get-user.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import {Repository} from "typeorm";
import {JwtService} from "../../global/jwt/jwt.service";
import {EditUserInputType, EditUserOutputType} from "./dtos/edit-user.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly users: Repository<UserEntity>,
        private readonly jwtService: JwtService
    ) {}
    async signUp({
        email,
        password,
        role,
    }: SignUpInputType): Promise<SignUpOutputType> {
        try {
            if(!await this.existUser(email)) {
                return { ok: false, error: `There is a user with that email already` };
            }
            const user = this.users.create({
                email,
                password,
                role
            })
            await this.users.save(user)
            return {
                ok: true,
                data: user.id
            }
        } catch (e) {
            console.log(e)
            return {
                ok: false,
                error: "Could not create account"
            }
        }
    }

    async existUser(email: string): Promise<Boolean> {
        try {
            const exists = await this.users.findOne({
                where: {
                    email: email,
                }
            })
            if (exists) return false
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async signIn({
        email,
        password
     }: SignInInputType): Promise<SignInOutputType> {
        try {
            const user = await this.users.findOne({
                where: {
                    email: email
                },
                select: ["id", "password"]
            })
            if(!user) return {ok: false, error: "User not found"}
            const checkPassword = await user.checkPassword(password)
            if (!checkPassword) {
                return {
                  ok: false,
                  error: "Wrong password"
                };
            }
            const token = this.jwtService.sign(user.id);
            return {
                ok: true,
                token
            }
        } catch (e) {
            console.log(e)
            return {
                ok: false,
                error: e,
            }
        }
    }

    async signOut({id}: SignOutInputType): Promise<SignOutOutputType> {
        try {
            const { ok, error, data } = await this.getUser(id)
            if (!ok) return { ok, error }
            if (id !== data.id) return { ok: false, error: "Not authorized" };
            await this.users.delete(id)
            return { ok: true, data: id}
        } catch (e) {
            console.log(e)
            return {
                ok: false,
                error: e,
            }
        }
    }

    async getUser(userId: number): Promise<GetUserOutputType> {
        try {
            const user = await this.users.findOne({
                where: {
                    id: userId
                }
            })
            if(!user) return {ok: false, error: "유저 없엉"}
            return {ok: true, data: user}
        } catch (e) {
            console.log(e)
            return {
                ok: false,
                error: e,
            }
        }
    }

    async getAllUsers(): Promise<GetAllUsersOutputType> {
        try {
            const users = await this.users.find()
            return {
                ok: true,
                data: users
            }
        } catch (e) {
            console.log(e)
            return {
                ok: false,
                error: e,
            }
        }
    }

    async editUser(
        userId: number, {
            name,
            email,
            password,
            age,
            gender,
            address
   }: EditUserInputType): Promise<EditUserOutputType> {
        try {
            if (!name && !email && !password && !age && !gender && !address)
                return { ok: false, error: "Body 비어있다"}
            // Todo: 여기다 추가로 각 파라미터에 대한 Validate를 설정해야 한다.
            // 예로 들면 Gender는 men, woman만 가능하고, 나이 범위, 길이 등
            const {data: user} = await this.getUser(userId)
            user.name = name ? name : user.name
            user.email = email ? email : user.email
            user.password = password ? password : user.password
            user.age = age ? age : user.age
            user.gender = gender ? gender : user.gender
            user.address = address ? address : user.address
            user.updatedAt = new Date()
            await this.users.save(user)
            return {
                ok: true,
                data: userId
            }
        } catch (e) {
            console.log(e)
            return {
                ok: false,
                error: e
            }
        }
    }
}
