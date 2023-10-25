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
import {MailService} from "../mail/mail.service";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Verification) private readonly verifications: Repository<Verification>,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
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
            const verification = await this.verifications.save(this.verifications.create({
                user
            }))
            this.mailService.sendVerificationEmail(user.email, verification.code)
            return {ok: true}
        } catch (e) {
            console.log(e);
            return {ok: false, error: "Couldn't create account"}
        }
    }

    async login({email, password}: LoginInput): Promise<{ ok: boolean, error?: string, token?: string }> {
        // find the user with email
        // check if the passwrod
        // make jwt
        try {
            const user = await this.users.findOne(
                {
                    where: {email},
                    select: ["id", "password"]
                }
            )
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
                error: "Can't log user in."
            }
        }
    }

    async findById(id: number): Promise<UserProfileOutput> {
        try {
            const user = await this.users.findOneBy({id})
            if (!user) return {ok: false, error: "User Not Found", user: user}
            return {
                ok: true,
                user: user
            }
        } catch (error) {
            return {
                ok: false,
                error: "User Not Found"
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
                this.verifications.delete({user: {id: user.id}})
                const verification = await this.verifications.save(this.verifications.create({user}))
                this.mailService.sendVerificationEmail(user.email, verification.code)
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
                error: "Could not update profile"
            }
        }
    }

    async verifyEmail(code: string): Promise<VerifyEmailOutput> {
        try {
            const verification = await this.verifications.findOne(({where: {code}, relations: ['user']}))
            if (verification) {
                verification.user.verified = true
                await this.users.save(verification.user)
                await this.users.delete(verification.id)
                return {
                    ok: true,
                }
            }
            return {
                ok: false,
                error: "Verification Is False"
            }
        } catch (error) {
            return {
                ok: false,
                error: "Could not verify email"
            }
        }
    }
}