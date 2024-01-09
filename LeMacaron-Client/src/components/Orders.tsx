import { FunctionComponent, useEffect, useState } from "react";
import Product from "../interfaces/Product";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import { getOrders } from "../services/ordersService";
import Order from "../interfaces/Order";
import { getUserDetails } from "../services/usersService";
import User from "../interfaces/User";


interface OrdersProps {
    userInfo: any
}

const Orders: FunctionComponent<OrdersProps> = ({ userInfo }) => {
    let [orders, setOrders] = useState<Order[]>([])
    let navigate = useNavigate()
    let [cards, setCards] = useState<Product[]>([]);
    let [dataUpdated, setDataUpdated] = useState<boolean>(false);
    let [user, setUser] = useState<User>({ firstName: "", middleName: "", lastName: "", phone: "", email: "", password: "", imageUrl: "", imageAlt: "", state: "", country: "", city: "", street: "", houseNumber: "", zip: "", role: 0, });
    let render = () => setDataUpdated(!dataUpdated);


    useEffect(() => {
        getProducts().then((res) => {
            setCards(res.data.filter((card: Product) => orders.includes(card._id as any)));


        }).catch((err) => console.log(err));
    }, []);



    useEffect(() => {
        if (userInfo.userId) {
            getOrders(userInfo.userId)

                .then((res) => {
                    setOrders(res.data);

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
            <div className="p-5 container " style={{ minHeight: "80vh" }}>
                <div className="row mt-3 ">
                    <div className="col-md-6 animationLeftSlide">
                        <div className="row fs-4" style={{ textAlign: "start" }} key={user._id}>
                            <img className="col-4 rounded-5 mt-2" style={{ width: "130px", height: "100px", objectFit: "cover", }} src={`${user.imageUrl}`} alt="" />
                            <div className="col-8">
                                <p> {user.firstName} {user.lastName}</p>
                                <p>{user.email}</p>
                                <p onClick={() => navigate(`/profile/${userInfo.userId}`)} className="btn fs-5">Change user details</p>
                            </div>
                            <div className="backColorImage mt-3 p-3">
                                <h4>ADDRESS</h4>
                                <p>{user.firstName} {user.lastName}</p>
                                <p>{user.city}</p>
                                <p>{user.street} {user.houseNumber}</p>
                                <p>{user.zip} {user.state}</p>
                                <p>{user.country}</p>
                            </div>

                        </div>
                    </div>

                    <div className="col-md-4 row animationRightSlide" style={{ margin: "0 auto", textAlign: "left" }}>
                        <h2 >ORDERS</h2>
                        {orders.length ? (<>
                            {
                                orders.map((order: Order) => (

                                    <div
                                        className="row my-2 p-2 card shadow"
                                        key={order._id}
                                        style={{ margin: "0 auto" }} >

                                        <p>Order ID: <span className="fw-bold"> {order._id}</span></p>
                                        <p>TTL ITEMS: <span className="fw-bold"> {order.totalItemsInCart}</span></p>
                                        <p>TOTAL PRICE: <span className="fw-bold"> {order.totalToPay}</span> ₪</p>
                                        <p>STATUS:<span className="fw-bold"> {order.orderStatus}</span></p>
                                        <p>ORDER DATE: <span className="fw-bold"> {order.orderDate}</span></p>
                                    </div>
                                )).reverse()
                            }
                        </>) : (<div style={{ margin: "0 auto" }}>
                            <div style={{ position: "relative", top: "15%", fontFamily: "Montserrat, sans-serif", textAlign: "center", margin: "0 auto" }} className="fw-bold fs-4 mb-5 " >
                                <img src="images/empty-ba1g.svg" alt="bag" style={{ width: "10rem", marginBottom: "25px" }} />
                                <p >YOUR BAG IS EMPTY</p>
                                <button className="btn btn-dark text-light" onClick={() => navigate("/products")}>SHOP NOW</button>
                            </div>
                        </div>)}

                    </div>


                </div>

            </div>
        </>

    )
}

export default Orders;