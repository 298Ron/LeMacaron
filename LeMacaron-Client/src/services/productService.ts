import axios from "axios";
import Product from "../interfaces/Product";

let api: string = `${process.env.REACT_APP_API}/products`;

// GET all Products
export function getProducts() {
    return axios.get(api);
}
// Get Specific Product by Key
export function getProductByKey(key: string) {
    return axios.get(`${api}/search/${key}`);
}

// Get Specific Card by id
export function getProductById(_id: string) {
    return axios.get(`${api}/${_id}`);
}


// Post new Product
export function addProduct(newProduct: Product) {
    return axios.post(`${api}`, newProduct, {
        headers: {
            Authorization: JSON.parse(sessionStorage.getItem("token") as string
            ).token,
        }
    });
}

export function getProductsByOwner() {
    return axios.get(`${api}`);
}
// Put Product by _id
export function updateProduct(updateProduct: Product, _id: string) {
    return axios.put(`${api}/${_id}`, updateProduct, {
        headers: {
            Authorization: JSON.parse(sessionStorage.getItem("token") as string
            ).token,
        }
    });
}

// Delete Card by id
export function deleteProduct(_id: string) {
    return axios.delete(`${api}/${_id}`, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } });
}

