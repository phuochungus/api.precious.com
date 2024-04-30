import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { Variant } from "./variant.entity";
import { Option } from "./option.entity";
import { Expose } from "class-transformer";
import { Type } from "./type.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    short_description: string;

    @Column()
    description: string;

    @Column("text", { array: true, default: [] })
    img_paths: string[];

    @Column()
    rating: number;

    @Column()
    price: number;

    @Column({ default: 0 })
    quantity: number;

    @Column()
    category_id: number;

    @ManyToMany(() => Type)
    @JoinTable()
    types: Type[];

    @ManyToOne(() => Category, category => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @OneToMany(() => Variant, variant => variant.product)
    variants: Variant[];

    @OneToMany(() => Option, option => option.product)
    options: Option[];

    @DeleteDateColumn()
    deleted_at: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Expose()
    get img_paths_url() {
        return this.img_paths.map(path => `https://storage.googleapis.com/${process.env.STORAGE_BUCKET_NAME}/${path}`);
    }
}