import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, JoinColumn} from "typeorm";
import { Measure } from "./Measure"

@Entity()
export class Habit extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;
}