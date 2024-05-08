import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Role {
    SUPER_ADMIN = 'SUPER_ADMIN',
}

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    uid: string;

    @Column()
    role: string;
}