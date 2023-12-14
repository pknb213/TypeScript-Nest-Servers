import {CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class CommonEntity {
    @PrimaryGeneratedColumn()
    id: number
    @CreateDateColumn()
    createdAt: Date
    @CreateDateColumn()
    updatedAt: Date
}