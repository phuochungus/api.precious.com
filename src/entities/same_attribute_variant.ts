import { Expose } from "class-transformer";
import { Product } from "src/entities/product.entity";
import { Variant } from "src/entities/variant.entity";

export class SameAttributeVariant extends Variant {
    constructor(variant: Partial<Variant>, product: Product) {
        super(variant);
        Object.assign(this, variant);
        this.name = `${product.name}`;
        this.price = product.price;
        this.img_paths = product.img_paths;
        this.quantity = 0;
        this.product_id = product.id;
    }
    @Expose()
    get img_paths_url() {
        return this.img_paths.map(path => `https://storage.googleapis.com/${process.env.STORAGE_BUCKET_NAME}/${path}`);
    }
}