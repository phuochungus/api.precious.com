import { User } from "src/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    address: string;

    @ManyToOne(() => User, user => user.addresses, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: number;
}
