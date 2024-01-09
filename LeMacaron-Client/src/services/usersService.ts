import axios from "axios";
import User from "../interfaces/User";
import jwt_decode from "jwt-decode";
let api: string = `${process.env.REACT_APP_API}/users`;


// Register
export function addUser(userToAdd: User) {
    return axios.post(`${api}`, userToAdd);
}
// login
export function checkUser(userToCheck: any) {
    return axios.post(
        `${api}/login`, userToCheck
    )
}

// Update user role
export function updateUserRole(newRole: any) {
    return axios.put(`${api}`, newRole,
        { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } })
}
// Update user by params _id 
export function updateUser(updatedUser: User, id: string) {
    return axios.patch(`${api}/${id}`, updatedUser,
        { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } })
}
// Change user password
export function changeUserPassword(updatedUser: User, id: string) {
    return axios.patch(`${api}/pass/${id}`, updatedUser,
        { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } })
}


// Get all users
export function getAllUsers() {
    return axios.get(api,
    );
}
//Get user details
export function getUserDetails(_id: string) {
    return axios.get(`${api}/${_id}`,
        { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } });
}

// Get Specific Product by Key
export function getUserByKey(key: string) {
    return axios.get(`${api}/search/${key}`,);
}



// Delete User
export function deleteUserById(userId: string) {
    return axios.delete(`${api}/${userId}`,
        { headers: { Authorization: JSON.parse(sessionStorage.getItem("token") as string).token } });
}




// Get user token details from local storage
export function getTokenDetails() {

    let token = JSON.parse(sessionStorage.getItem("token") as string
    ).token;
    return jwt_decode(token)
}