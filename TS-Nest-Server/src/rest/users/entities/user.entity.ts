import {CommonEntity} from "../../common/entities/common.entity";
import {BeforeInsert, BeforeUpdate, Column, Entity} from "typeorm";
import {InternalServerErrorException} from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Entity()
export class UserEntity extends CommonEntity {
    @Column({nullable: true}) name: string
    @Column() email: string
    @Column() password: string
    @Column() role: string
    @Column({default: false}) verified: boolean
    @Column({nullable: true}) age: number
    @Column({nullable: true}) gender: string
    @Column({nullable: true}) address: string

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        if (!this.password) {
          return;
        }
        try {
          this.password = await bcrypt.hash(this.password, 10);
        } catch (error) {
          console.log(error);
          throw new InternalServerErrorException();
        }
    }

    async checkPassword(aPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(aPassword, this.password);
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException();
        }
    }
}