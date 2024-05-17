import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Cart } from './cart.entity';
import { Expose } from 'class-transformer';
import { Order } from 'src/entities/order.entity';
import { Address } from 'src/entities/address.entity';

export enum Gender {
  MALE,
  FEMALE,
}


export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uid: string;

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  @JoinColumn()
  cart: Cart;

  @Column({ nullable: true })
  avatar_img_path?: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.MALE })
  gender: Gender;

  @Column({ nullable: true })
  email?: string;

  @Column('smallint', { nullable: true })
  age?: number;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(() => Address, address => address.user)
  addresses: Address[];

  @Column({ nullable: true })
  phone_number: string;

  @Column({ enum: UserRole, default: UserRole.USER })
  userRole: UserRole;

  @Expose()
  get avatar_img_path_url(): string {
    if (this.avatar_img_path)
      return `https://storage.googleapis.com/${process.env.STORAGE_BUCKET_NAME}/${this.avatar_img_path}`
    return null;
  }
}
