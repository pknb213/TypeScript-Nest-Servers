import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";
import {Injectable} from "@nestjs/common";
import {CreateAccountInput} from "./dtos/create-account.dto";
import {LoginInput} from "./dtos/login.dto";
import {ConfigService} from "@nestjs/config";
import * as jwt from 'jsonwebtoken'
import {JwtService} from "../jwt/jwt.service";
import {EditProfileInput, EditProfileOutput} from "./dtos/edit-profile.dto";
import {Verification} from "./entities/verfication.entity";
import {UserProfileOutput} from "./dtos/user-profile.dto";
import {VerifyEmailOutput} from "./dtos/verify-email.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Verification) private readonly verifications: Repository<Verification>,
        private readonly jwtService: JwtService,
    ) {
    }

    async createAccount(
        {email, password, role}: CreateAccountInput
    ): Promise<{ ok: boolean, error?: string }> {
        // chek new user
        // create user & hash the passwrd
        try {
            const exists = await this.users.findOne({where: {email}})
            if (exists) {
                return {ok: false, error: "There is User with that email already"}
            }
            const user = await this.users.save(this.users.create({email, password, role}))
            await this.verifications.save(this.verifications.create({
                user
            }))
            return {ok: true}
        } catch (e) {
            return {ok: false, error: "Couldn't create account"}
        }
    }

    async login({email, password}: LoginInput): Promise<{ ok: boolean, error?: string, token?: string }> {
        // find the user with email
        // check if the passwrod
        // make jwt
        try {
            const user = await this.users.findOne({where: {email}, select: ["id", "password"]})
            if (!user) {
                return {
                    ok: false,
                    error: 'User not Found'
                }
            }
            const passwordCorrect = await user.checkPassword(password)
            if (!passwordCorrect) {
                return {
                    ok: false,
                    error: 'Wrong Password'
                }
            }
            const token = this.jwtService.sign(user.id)
            return {
                ok: true,
                token
            }
        } catch (error) {
            return {
                ok: false,
                error
            }
        }
    }

    async findById(id: number): Promise<UserProfileOutput> {
        try {
            const user = await this.users.findOne({where: {id}})
            if(user) {
                return {
                    ok: true,
                    user: user
                }
            }
        } catch (error) {
            return {
                ok: false,
                error
            }
        }
    }

    async editProfile(
        userId: number,
        {email, password}: EditProfileInput
    ): Promise<EditProfileOutput> {
        try {
            const user = await this.users.findOne({where: {id: userId}})
            if (email) {
                user.email = email
                user.verified = false
                await this.verifications.save(this.verifications.create({user}))
            }
            if (password) {
                user.password = password
            }
            await this.users.save(user)
            return {
                ok: true,
            }
        } catch (error) {
            return {
                ok: false,
                error
            }
        }
    }

    async verifyEmail(code: string): Promise<VerifyEmailOutput> {
        try {
           const verification = await this.verifications.findOne(({where: {code}, relations: ['user']}))
            if(verification) {
                console.log(verification, verification.user)
                verification.user.verified = true
                await this.users.save(verification.user)
                return {
                    ok: true,
                }
            }
            return {
                ok: false,
                error: "Verification Is False"
            }
        } catch(error) {
            return {
                ok: false,
                error
            }
        }
    }
}