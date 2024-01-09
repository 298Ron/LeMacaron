import { FunctionComponent, useEffect, useState, useRef } from "react";
import Product from "../interfaces/Product";
import { getCarts } from "../services/CartService";
import { errorMsg, successMsg } from "../services/feedbacksService";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import Cart from "../interfaces/Cart";
import * as yup from "yup"
import { useFormik } from "formik";
import User from "../interfaces/User";
import { getUserDetails } from "../services/usersService";
import { addToOrders, checkDiscountCode } from "../services/ordersService";
import emailjs from "@emailjs/browser";


interface FavCardsProps {
    userInfo: any;
    render: any;
    dataUpdated: any;
}

const FavCards: FunctionComponent<FavCardsProps> = ({ userInfo, render, dataUpdated }) => {
    let [user, setUser] = useState<User>({ firstName: "", middleName: "", lastName: "", phone: "", email: "", password: "", imageUrl: "", imageAlt: "", state: "", country: "", city: "", street: "", houseNumber: "", zip: "", role: 0, });
    const ref = useRef(null)
    let [cart, setCart] = useState<Cart>()
    let navigate = useNavigate()
    let [cards, setCards] = useState<Product[]>([]);
    /* let [dataUpdated, setDataUpdated] = useState<boolean>(false); */
    /* let render = () => setDataUpdated(!dataUpdated); */
    let [cartItems, setCartItems] = useState<Cart[]>([])


    useEffect(() => {
        getCarts(userInfo.userId).then((res) => {

            let defaultCardIds: Cart[] = res.data?.cards.map((card: Cart) => card._id) || [];
            setCartItems(defaultCardIds)
            setCart(res.data);

        }).catch((err) => console.log(err))
    }, [userInfo.userId,]);
    useEffect(() => {
        getProducts().then((res) => {


            setCards(res.data.filter((card: Product) => cartItems.includes(card._id as any)));
        }).catch((err) => console.log(err));
    }, [cartItems]);

    let hadleAddToOrders = (cart: Cart) => {
        addToOrders(cart, ("Confirmed!"))
            .then((res) => {
                render();
                navigate("/thanks");
                successMsg("Confirmed!")
            })
            .catch((err) => console.log(err)
            )
    }
    useEffect(() => {
        getUserDetails(userInfo.userId)
            .then((res) => {
                setUser(res.data)

            }
            )
            .catch((err) => console.log(err));
    }, []);
    let shippingAdress = JSON.parse(sessionStorage.getItem("ShippingTo") as string)
    let formik = useFormik({
        initialValues: { cardNumber: "", nameOnCard: "", expirationDate: "", securityCode: "", },
        validationSchema: yup.object({
            cardNumber: yup.string().required().min(14).max(19),
            nameOnCard: yup.string().required().min(2),
            expirationDate: yup.string().required().min(4).max(4),
            securityCode: yup.string().required().max(5),
        }),
        onSubmit(values, cart) {
            navigate("/thanks");

        }
    })
    let handleCheckCode = (theCode: any) => {
        if (theCode !== "GET20") {
            return (errorMsg("Wrong code!"))
        } else if ((cart?.orderDiscountCode === ("True" as any)) && (theCode === "GET20")) {
            return errorMsg("Code is already active!")
        } else if (cart?.orderDiscountCode === ("AlreadyUsed" as any)) {
            return errorMsg("Code was already used!")
        }
        else if (theCode === "GET20") {
            checkDiscountCode(theCode)
                .then((res) => {
                    render()
                })
                .catch((err) => {

                    console.log(err);

                })
        }
        render()
    }

    const sendEmail = (e: any) => {
        e.preventDefault();
        emailjs.sendForm(`service_vegfu5b`, `template_nn3d4st`, e.target, `JxsqO1p2xh4avYxOA`);


    }
    let theCode: any = ((ref.current as any))
    return (







        <div className="container my-5 checkOut" style={{ textAlign: "start", minHeight: "75vh", fontFamily: "Montserrat, sans-serif" }} >


            {cards.length ? (

                <div className="row" >
                    {/* LEFT PAGE COLUMN */}
                    <div className="col-md-7 animationLeftSlide" >
                        <div>
                            <h4>Contact Info</h4>
                            <table className="row p-3 my-3" style={{ border: "1px solid  rgba(0, 0, 0, 0.2)", }}>
                                <tbody>
                                    <tr className="row pb-3">
                                        <td className="col-md-3 text-secondary">Contact</td>
                                        <td className="col-md-6">{userInfo.email}</td>
                                        <td className="col-md-3" style={{ textAlign: "end" }}><span className=" text-secondary" onClick={() => { navigate("/checkout") }}>Change</span></td>
                                    </tr>
                                    <tr className="row py-3 " style={{ borderBlock: "1px solid  rgba(0, 0, 0, 0.2)" }}>
                                        <td className="col-md-3 text-secondary">Ship to</td>
                                        <td className="col-md-6">{` ${shippingAdress.city}, ${shippingAdress.addressLine1}, ${shippingAdress.postalCode}, ${shippingAdress.addressLine2}`}</td>
                                        <td className="col-md-3" style={{ textAlign: "end" }}><span className=" text-secondary" onClick={() => { navigate("/checkout") }}>Change</span></td>
                                    </tr>
                                    <tr className="row pt-3">
                                        <td className="col-md-3 text-secondary">Shipping Coast</td>
                                        <td className="col-md-6">{(cart?.totalToPay as number >= 200) ? (<>Free Delivery </>) : (<>20 ₪</>)} </td>
                                        <td className="col-md-3"></td>
                                    </tr>
                                </tbody>

                            </table>
                            <div >
                                <div className="my-4">  <h4>Payment</h4>
                                    <h6>All transactions are secure and encrypted.</h6></div>
                                <h5> * This payment method is only for demo, no money will taken from you *</h5>
                                <form className="form p-3 shadow-sm" onSubmit={formik.handleSubmit} style={{ border: "1px solid  rgba(0, 0, 0, 0.2)", backgroundColor: "rgba(210, 210, 210,0.2)", position: "relative", }}>

                                    <div className="form-floating mb-3 col-md-12">
                                        <input
                                            type="number"
                                            name="cardNumber"
                                            className="form-control shadow-sm"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.cardNumber}
                                            placeholder="cardNumber" />
                                        <label className="text-dark  ms-2">Card number</label>
                                        {formik.touched.cardNumber && formik.errors.cardNumber && (<small className="text-danger">{formik.errors.cardNumber}</small>)}
                                    </div>
                                    <div className="form-floating mb-3 col-md-12">
                                        <input
                                            type="text"
                                            name="nameOnCard"
                                            className="form-control shadow-sm"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.nameOnCard}
                                            placeholder="nameOnCard" />
                                        <label className="text-dark  ms-2">Name on card</label>
                                        {formik.touched.nameOnCard && formik.errors.nameOnCard && (<small className="text-danger">{formik.errors.nameOnCard}</small>)}
                                    </div>
                                    <div className="row">
                                        <div className="form-floating mb-3 col-md-6">
                                            <input
                                                type="number"
                                                name="expirationDate"
                                                className="form-control shadow-sm"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.expirationDate}
                                                placeholder="expirationDate" />
                                            <label className="text-dark  ms-2">Expiration date</label>
                                            {formik.touched.expirationDate && formik.errors.expirationDate && (<small className="text-danger">{formik.errors.expirationDate}</small>)}
                                        </div>
                                        <div className="form-floating mb-3 col-md-6">
                                            <input
                                                type="number"
                                                name="securityCode"
                                                className="form-control shadow-sm"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.securityCode}
                                                placeholder="securityCode" />
                                            <label className="text-dark  ms-2">Security Code</label>
                                            {formik.touched.securityCode && formik.errors.securityCode && (<small className="text-danger">{formik.errors.securityCode}</small>)}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>

                    <div className="col-md-1 " style={{ borderRight: "1px solid  rgba(0, 0, 0, 0.1)" }}></div>
                    {/* RIGHT PAGE COLUMN */}
                    <div className="col-md-4 animationRightSlide ">





                        <div className="pb-3 ms-4" >
                            {cards.map((card: Product) => {

                                return (


                                    <div className="row " style={{ fontFamily: "Montserrat, sans-serif" }} key={card._id}>
                                        <div className="col-md-2" >   <span className="rounded-circle bg-secondary border border-dark d-flex justify-content-center align-items-center" style={{ color: "white", height: "22px", width: "22px", position: "relative", top: "12px", right: "-35px", fontSize: "0.8rem", opacity: "95%" }}>{(cart?.totalItemsInCart === 0) ? (<>0</>) : (<>{cart?.cards[cart.cards.findIndex((c) => c._id === card._id)].quantity}</>)}</span>

                                            <img className="shadow-lg" onClick={() => navigate(`/products/info/${card._id}`)} src={`${card.image}`} alt={`${card.title}`} style={{ objectFit: "cover", width: "3rem", height: "4rem", }} />
                                        </div>
                                        <div className="row col-md-10 mt-3 ">
                                            <span className="" style={{ textAlign: "left" }}>{card.title}</span>
                                            <span className="col-md-3 text-secondary" style={{ textAlign: "left" }}>  {card.category}</span>
                                            <span className="fw-normal col-md-9" style={{ textAlign: "right" }}>{card.price} ₪</span>
                                        </div>

                                    </div>)
                            })}
                            <div className=" row me-2 my-4 py-4" style={{ borderBlock: "1px solid  rgba(0, 0, 0, 0.1)" }}>

                                <div className="col-md-8  form-floating my-1" >
                                    <input
                                        id="discountCode"
                                        type="text"
                                        className="form-control shadow-sm"
                                        placeholder="discountCode"
                                        ref={ref} />
                                    <label className="text-dark ms-2">Discount code</label>
                                </div>
                                <button className="btn text-secondary text-dark col-md-3 my-1" style={{ backgroundColor: "lightgray" }} onClick={() => { handleCheckCode(theCode.value) }}>APPLY</button>
                                <div className="row ms-3 mt-3 fs-5 text-danger fw-bold ">  {(cart?.orderDiscountCode == ("True" as any)) && (<>DISCOUNT CODE IS ACTIVE</>)}</div>
                            </div>
                            <div className="row">

                                {/* SUB TOTAL */}
                                <div className="row">
                                    <h6 className="col-md-8" style={{ textAlign: "left" }}>Sub Total:  </h6>
                                    <h6 className="col-md-4" style={{ textAlign: "right" }}> {cart?.totalToPay} ₪</h6>
                                </div>

                                {/* THE DISCOUNT CALCULATOR */}
                                {(cart?.orderDiscountCode == "True") && (
                                    <div className="row  mt-2" >
                                        <h6 className="col-md-8" style={{ textAlign: "left" }}>Discount:  </h6>
                                        <h6 className="col-md-4" style={{ textAlign: "right" }}>
                                            <p>- {cart.totalToPay * 0.2}₪  (20%)</p>

                                            <p></p>



                                        </h6>
                                    </div>)}

                                {/* SHIPPING */}
                                <div className="row  mt-2" >
                                    <h6 className="col-md-8" style={{ textAlign: "left" }}>Shipping:  </h6>
                                    <h6 className="col-md-4" style={{ textAlign: "right" }}>
                                        {/* SHIPPING WITH DISCOUNT CODE */}  {(cart?.orderDiscountCode == "True") && (<>
                                            {((cart.totalToPay * 0.8) >= 200) ? (<>Free</>) : (<>20₪</>)}</>)}
                                        {/* SHIPPING WITHOUT DISCOUNT CODE */} {(cart?.orderDiscountCode != "True") &&
                                            (<>{(cart?.totalToPay as any >= 200) ? (<>Free</>) : (<>20₪</>)}</>)}
                                    </h6>
                                </div>

                                {/* TOTAL */}
                                <div className="row py-3 mt-3" style={{ borderBlock: "1px solid  rgba(0, 0, 0, 0.1)", }}>
                                    <h6 className="col-md-8" style={{ textAlign: "left" }}>Total:  </h6>
                                    <h6 className="col-md-4" style={{ textAlign: "right" }}>
                                        {/* TOTAL WITH DISCOUNT CODE */}  {(cart?.orderDiscountCode == "True") && (<>
                                            {((cart.totalToPay * 0.8) >= 200) ? (<>{(cart.totalToPay * 0.8)}</>) : (<>{(cart.totalToPay * 0.8) + 20}</>)}</>)}
                                        {/* TOTAL WITHOUT DISCOUNT CODE */} {(cart?.orderDiscountCode != "True") &&
                                            (<>{(cart?.totalToPay as any >= 200) ? (<>{cart?.totalToPay}</>) : (<>{cart?.totalToPay as any + 20}</>)}</>)}
                                        ₪</h6>
                                </div>
                            </div>

                            <button className="btn btn-primary text-light w-100 my-4"

                                /* disabled={!formik.isValid || !formik.dirty}  */

                                onClick={() => {
                                    hadleAddToOrders(cart as any);
                                }}
                            >{`PAY NOW >`}</button>


                        </div>

                        <div >


                        </div >


                    </div>

                </div>



            ) : (
                <div style={{ position: "absolute", top: "40%", margin: "0 auto" }} className="fw-bold fs-4 mb-3 " >
                    <img src="images/empty-ba1g.svg" alt="bag" style={{ width: "10rem", marginBottom: "25px" }} />
                    <p >YOUR BAG IS EMPTY</p>
                    <button className="btn btn-dark text-light" onClick={() => navigate("/products")}>SHOP NOW</button>
                </div>)
            }

        </div >




    )
}

export default FavCards;