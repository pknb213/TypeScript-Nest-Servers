import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { User } from "./entities/user.entity";
import {Injectable} from "@nestjs/common";
import {CreateAccountInput} from "./dtos/create-account.dto";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User)
        private readonly users: Repository<User>) {

        }
    async createAccount({email, password, role}: CreateAccountInput){
        // chek new user
        // create user & hash the passwrd
        try {
            const exists = await this.users.findOne({where: {email}})
            if (exists) {
                return
            }
            await this.users.save(this.users.create({email, password, role}))
            return true
        } catch (e) {
            return
        }
    }
}