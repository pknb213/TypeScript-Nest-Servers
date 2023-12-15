import {CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
@Entity()
export class CommonEntity {
    @PrimaryGeneratedColumn()
    @Field(type=> Number)
    id: number
    @CreateDateColumn()
    @Field(type=> Date)
    createdAt: Date
    @CreateDateColumn()
    @Field(type=> Date)
    updatedAt: Date
}