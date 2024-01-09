import axios from "axios";


let api: string = `${process.env.REACT_APP_API}/carts`;


// get all user's carts
export function getCarts(userId: string) {
    return axios.get(`${api}/${userId}`, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } })
}

// add or remove user's favorits 
export function addToCart(cardToAdd: string, cardPrice: number, quantity: number) {
    const cardId = { _id: cardToAdd, price: cardPrice, quantity: quantity }
    return axios.post(api, cardId, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } })
}

// add or remove user's favorits 
export function decreaseQuantity(cardToChange: string, cardPrice: number, quantity: number) {
    const cardId = { _id: cardToChange, price: cardPrice, quantity: quantity }
    return axios.put(api, cardId, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } })
}
// add or remove user's favorits 
export function deleteProductFomCart(cardToChange: string, cardPrice: number, quantity: number) {
    const cardId = { _id: cardToChange, price: cardPrice, quantity: quantity }
    return axios.put(`${api}/items`, cardId, { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } })
}



