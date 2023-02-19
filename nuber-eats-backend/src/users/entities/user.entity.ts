import {BeforeInsert, BeforeUpdate, Column, Entity, OneToMany} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {Field, InputType, ObjectType, registerEnumType} from "@nestjs/graphql";
import * as bcrypt from "bcrypt"
import {InternalServerErrorException} from "@nestjs/common";
import {IsEmail, IsEnum} from "class-validator";
import {Restaurant} from "../../restaurant/entities/restaurant.entity";
enum UserRole {
    Client,
    Owner,
    Delivery,
}

registerEnumType(UserRole, {name: 'UserRole'})
@InputType('UserInputType', {isAbstract: true})
@ObjectType()
@Entity()
export class User extends CoreEntity{
    @Column()
    @Field(type=> String)
    @IsEmail()
    email: string

    @Column({select: false})
    @Field(type=> String)
    password: string

    @Column({type: 'enum', enum: UserRole})
    @Field(type=> UserRole)
    @IsEnum(UserRole)
    role: UserRole

    @Column({default: false, unique: true})
    @Field(type=>Boolean)
    verified: boolean

    @Field(type => [Restaurant])
    @OneToMany(type => Restaurant, restaurant => restaurant.owner)
    restaurants: Restaurant[]

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        if (this.password) {
            try {
                this.password = await bcrypt.hash(this.password, 10)
            } catch (error) {
                console.log(error)
                throw new InternalServerErrorException()
            }
        }
    }
    async checkPassword(aPassword: string): Promise<boolean> {
        try {
            const ok = await bcrypt.compare(aPassword, this.password)
            return ok
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException()
        }
    }
}