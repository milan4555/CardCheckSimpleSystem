import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class EventLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    regNumber!: number;

    @Column()
    eventId!: number;

    @Column()
    createdAt!: Date;
}