import axios from "axios";
import User from "../interfaces/User";
import jwt_decode from "jwt-decode";
let api: string = `${process.env.REACT_APP_API}/users`;




// Get user token details from local storage
export function getTokenDetails() {

    let token = JSON.parse(sessionStorage.getItem("token") as string
    ).token;
    return jwt_decode(token)
}