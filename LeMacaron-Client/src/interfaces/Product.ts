
export default interface Product {
    image: string;
    title: string;
    description: string;
    price: number;
    quantityInStock: number;
    creatorId?: string;
    _id?: string;
    category: string;
    images?: []
};