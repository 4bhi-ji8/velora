export interface ProductCategory {
    _id : string;
    name : string;
    description : string;
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    category: ProductCategory;
    stock: number;
}