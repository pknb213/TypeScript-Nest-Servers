import {Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import Dict = NodeJS.Dict;

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(userEmail: string, password: string): Promise<any> {
        console.log("Email: %s, Pwd: %s", userEmail, password)
        const user = await this.usersService.findOne(userEmail);
        if (user && user.password === password) {
            const {password, ...result} = user;
            return result;
        }
        return null
    }

    async login(user: any): Promise<Dict<any>> {
        const payload = {userEmail: user.userEmail, sub: user.userId};
        return {access_token: this.jwtService.sign(payload)};
    }
}
