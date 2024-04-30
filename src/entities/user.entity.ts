import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Expose } from 'class-transformer';

export enum Gender {
  MALE,
  FEMALE,
}

export enum Role {
  USER,
  ADMIN,
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

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column('smallint', { nullable: true })
  age?: number;

  @Expose()
  get avatar_img_path_url(): string {
    if (this.avatar_img_path)
      return `https://storage.googleapis.com/${process.env.STORAGE_BUCKET_NAME}/${this.avatar_img_path}`
    return null;
  }
}
