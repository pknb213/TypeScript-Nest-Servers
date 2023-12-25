import {UpdateDateColumn, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class CommonEntity {
  @PrimaryGeneratedColumn()
  id: number
  @CreateDateColumn()
  createdAt: Date
  @UpdateDateColumn()
  updatedAt: Date
}