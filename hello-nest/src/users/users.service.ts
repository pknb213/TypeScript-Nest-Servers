import { Injectable } from '@nestjs/common';

export type User = any

@Injectable()
export class UsersService {
    private readonly users = [
        {
            userId: 1,
            userEmail: 'sory5339@gmail.com',
            password: 'sory5339',
        },
    ];
    async findOne(userEmail: string): Promise<User | undefined> {
        return this.users.find(user => user.userEmail === userEmail);
    }
}
