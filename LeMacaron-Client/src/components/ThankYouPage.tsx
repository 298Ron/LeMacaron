import { FunctionComponent, useEffect, useState } from "react";
import { getOrders } from "../services/ordersService";
import { getUserDetails } from "../services/usersService";
import User from "../interfaces/User";
import Order from "../interfaces/Order";
interface ThankYouPage {
    userInfo: any
}

const ThankYouPage: FunctionComponent<ThankYouPage> = ({ userInfo }) => {
    let [order, setOrder] = useState<Order>()
    let [user, setUser] = useState<User>({ firstName: "", middleName: "", lastName: "", phone: "", email: "", password: "", imageUrl: "", imageAlt: "", state: "", country: "", city: "", street: "", houseNumber: "", zip: "", role: 0, });
    useEffect(() => {
        if (userInfo.userId) {
            getOrders(userInfo.userId)

                .then((res) => {

                    setOrder(res.data[(res.data.length) - 1])


                }).catch((err) => console.log(err))
        }

    }, [userInfo.userId]);
    useEffect(() => {
        getUserDetails(userInfo.userId)
            .then((res) => {
                setUser(res.data)

            }
            )
            .catch((err) => console.log(err));
    }, []);

    return (
        <>
            <div className="container" style={{ minHeight: "60vh", position: "relative" }}>
                <div className="card col-md-7 " style={{ margin: "100px auto" }}>
                    <h1 className="p-3 ">ORDER CONFIRMED!</h1>
                    <div className="fs-4">
                        <p >Order ID: <span className="fw-bold order_id"  >{order?._id}</span></p>
                        <p>Full Name: <span className="fw-bold order_name">{user.firstName} {user.lastName}</span></p>
                        <p>Total Payed: <span className="fw-bold order_ttl">{order?.totalToPay} ₪</span></p>
                        <p>ORDER DATE: <span className="fw-bold "> {order?.orderDate}</span></p>
                    </div>

                </div>
            </div >
        </>
    )
}

export default ThankYouPage;