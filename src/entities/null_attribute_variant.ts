import { Expose } from "class-transformer";
import { Product } from "src/entities/product.entity";
import { Variant } from "src/entities/variant.entity";


export class NullAttributeVariant extends Variant {
    constructor(variant: Partial<Variant>, product: Product) {
        super(variant);
        Object.assign(this, variant);
        this.name = null;
        this.price = null;
        this.img_paths = [];
        this.quantity = null;
        this.product_id = product.id;
    }
    @Expose()
    get img_paths_url() {
        return this.img_paths.map(path => `https://storage.googleapis.com/${process.env.STORAGE_BUCKET_NAME}/${path}`);
    }
}