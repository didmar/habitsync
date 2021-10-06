import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinTable, PrimaryColumn} from "typeorm";
import { Habit } from "./Habit"

@Entity()
export class Measure extends BaseEntity {

    @PrimaryColumn()
    @ManyToOne(() => Habit)
    habit: Habit;

    @PrimaryColumn({ type: 'date' })
    date: Date;

    @Column("int")
    value: number;
}