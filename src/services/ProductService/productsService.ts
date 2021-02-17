import { Category } from "../../database/models";
import { Product } from "./productsInterfaces";

const addProduct = (name: String): Product => {
    const category = new Category({
        displayName: 'Some useless string for GET request'
    })
    category.save()

    const resultProduct: Product = {
        name: category
    };

    return resultProduct;
}


export {
    addProduct
}