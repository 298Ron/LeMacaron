import axios from "axios";
import Cart from "../interfaces/Cart";

let api: string = `${process.env.REACT_APP_API}/orders`;

// get all user's carts
export function getOrders(userId: string) {
    return axios.get(`${api}/${userId}`, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } })
}
// add or remove user's favorits 
export function addToOrders(cart: Cart, status: string) {
    const cardId = { cart, status }
    return axios.post(`${api}/addNewOrder`, cart, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } })
}

export function checkDiscountCode(theCode: any) {

    let theDiscountCode = { theCode: theCode }
    return axios.post(`${api}/discount`, theDiscountCode, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } })
}