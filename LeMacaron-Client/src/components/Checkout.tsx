import { FunctionComponent, useEffect, useState, useRef } from "react";
import Product from "../interfaces/Product";
import { getCarts } from "../services/CartService";
import { errorMsg, successMsg } from "../services/feedbacksService";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import Cart from "../interfaces/Cart";
import * as yup from "yup"
import { useFormik } from "formik";
import User from "../interfaces/User";
import { getUserDetails } from "../services/usersService";
import { checkDiscountCode } from "../services/ordersService";



interface FavCardsProps {
    userInfo: any
}

const FavCards: FunctionComponent<FavCardsProps> = ({ userInfo }) => {
    let [cart, setCart] = useState<Cart>()
    const ref = useRef(null)
    let navigate = useNavigate()
    let [cards, setCards] = useState<Product[]>([]);
    let [dataUpdated, setDataUpdated] = useState<boolean>(false);
    let [cartItems, setCartItems] = useState<Cart[]>([])
    let render = () => setDataUpdated(!dataUpdated);

    useEffect(() => {
        getCarts(userInfo.userId).then((res) => {

            let defaultCardIds: Cart[] = res.data?.cards.map((card: Cart) => card._id) || [];
            setCartItems(defaultCardIds)
        }).catch((err) => console.log(err))
    }, [dataUpdated, userInfo.userId,]);


    useEffect(() => {
        getProducts().then((res) => {


            setCards(res.data.filter((card: Product) => cartItems.includes(card._id as any)));

        }).catch((err) => console.log(err));
    }, [dataUpdated, cartItems]);



    useEffect(() => {
        if (userInfo.userId) {
            getCarts(userInfo.userId)

                .then((res) => {
                    setCart(res.data);

                }).catch((err) => console.log(err))
        }
    }, [dataUpdated, userInfo.userId]);

    useEffect(() => {
        getUserDetails(userInfo.userId)
            .then((res) => {
                setUser(res.data)

            })
            .catch((err) => console.log(err));
    }, []);
    let [user, setUser] = useState<User>({ firstName: "", middleName: "", lastName: "", phone: "", email: "", password: "", imageUrl: "", imageAlt: "", state: "", country: "", city: "", street: "", houseNumber: "", zip: "", role: 0, });
    let formik = useFormik({
        initialValues: { email: user.email, firstName: user.firstName, lastName: user.lastName, addressLine1: "", addressLine2: `${user.street}, ${user.houseNumber}`, postalCode: user.zip, city: user.city, phone: user.phone },
        enableReinitialize: true,
        validationSchema: yup.object({
            email: yup.string().required().email(),
            firstName: yup.string().required().min(2),
            lastName: yup.string().required().min(2),
            addressLine1: yup.string().required().min(2),
            addressLine2: yup.string(),
            postalCode: yup.number().required().min(5),
            city: yup.string().required().min(2),
            phone: yup.string().required().min(8).max(13),
        }),
        onSubmit(values) {
            navigate("/payment")
        }
    })
    let handleSubmitButton = () => {
        navigate("/payment");
        sessionStorage.setItem("ShippingTo", JSON.stringify({
            addressLine1: formik.values.addressLine1,
            addressLine2: formik.values.addressLine2,
            postalCode: formik.values.postalCode,
            city: formik.values.city,
        }))
    }

    let handleCheckCode = (theCode: any) => {
        if (theCode !== "GET20") {
            return (errorMsg("Wrong code!"))
        } else if ((cart?.orderDiscountCode == ("True" as any)) && (theCode == "GET20")) {
            return errorMsg("Code is already active!")
        } else if (cart?.orderDiscountCode == ("AlreadyUsed" as any)) {
            return errorMsg("Code was already used!")
        }
        else if (theCode === "GET20") {
            checkDiscountCode(theCode)
                .then((res) => {
                    render()
                    successMsg("Code was successfully avtiveted!")
                })
                .catch((err) => {

                    console.log(err);

                })
        }
        render()
    }
    let theCode: any = ((ref.current as any))
    return (
        <div className="container my-5 checkOut" style={{ textAlign: "start", minHeight: "75vh", fontFamily: "Montserrat, sans-serif" }} >
            {cards.length ? (
                <>
                    <div className="row" >
                        {/* LEFT PAGE COLUMN */}
                        <div className="col-md-7 animationLeftSlide" >
                            <form className="form" onSubmit={formik.handleSubmit}>
                                <h4 className="mb-3 ms-2" >Contact</h4>
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        name="email"
                                        className="form-control shadow-sm"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.email}
                                        placeholder="Email" />
                                    <label className="text-dark">Email</label>
                                    {formik.touched.email && formik.errors.email && (<small className="text-danger">{formik.errors.email}</small>)}
                                </div>
                                <h4 className="my-4 ms-2">Shipping address</h4>
                                <div className="row">
                                    <div className="form-floating mb-3 col-md-6">
                                        <input
                                            type="text"
                                            name="firstName"
                                            className="form-control shadow-sm"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.firstName}
                                            placeholder="firstName" />
                                        <label className="text-dark  ms-2">First Name</label>
                                        {formik.touched.firstName && formik.errors.firstName && (<small className="text-danger">{formik.errors.firstName}</small>)}
                                    </div>
                                    <div className="form-floating mb-3 col-md-6">
                                        <input
                                            type="text"
                                            name="lastName"
                                            className="form-control shadow-sm"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.lastName}
                                            placeholder="lastName" />
                                        <label className="text-dark  ms-2">Last Name</label>
                                        {formik.touched.lastName && formik.errors.lastName && (<small className="text-danger">{formik.errors.lastName}</small>)}
                                    </div>
                                </div>
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        name="addressLine1"
                                        className="form-control shadow-sm"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.addressLine1}
                                        placeholder="addressLine1" />
                                    <label className="text-dark">Address Line 1</label>
                                    {formik.touched.addressLine1 && formik.errors.addressLine1 && (<small className="text-danger">{formik.errors.addressLine1}</small>)}
                                </div>
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        name="addressLine2"
                                        className="form-control shadow-sm"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.addressLine2}
                                        placeholder="addressLine2" />
                                    <label className="text-dark">Address Line 2</label>
                                    {formik.touched.addressLine2 && formik.errors.addressLine2 && (<small className="text-danger">{formik.errors.addressLine2}</small>)}
                                </div>
                                <div className="row">
                                    <div className="form-floating mb-3 col-md-6">
                                        <input
                                            type="text"
                                            name="postalCode"
                                            className="form-control shadow-sm"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.postalCode}
                                            placeholder="postalCode" />
                                        <label className="text-dark  ms-2">Postal Code</label>
                                        {formik.touched.postalCode && formik.errors.postalCode && (<small className="text-danger">{formik.errors.postalCode}</small>)}
                                    </div>
                                    <div className="form-floating mb-3 col-md-6">
                                        <input
                                            type="text"
                                            name="city"
                                            className="form-control shadow-sm"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.city}
                                            placeholder="city" />
                                        <label className="text-dark ms-2">City</label>
                                        {formik.touched.city && formik.errors.city && (<small className="text-danger">{formik.errors.city}</small>)}
                                    </div>
                                </div>
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        name="phone"
                                        className="form-control shadow-sm"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.phone}
                                        placeholder="phone" />
                                    <label className="text-dark">Phone</label>
                                    {formik.touched.phone && formik.errors.phone && (<small className="text-danger">{formik.errors.phone}</small>)}
                                </div>



                            </form>
                        </div>

                        <div className="col-md-1 " style={{ borderRight: "1px solid  rgba(0, 0, 0, 0.1)" }}></div>
                        {/* RIGHT PAGE COLUMN */}
                        <div className="col-md-4 animationRightSlide" >

                            <div className="pb-3 ms-4" >
                                {cards.map((card: Product) => {

                                    return (


                                        <div className="row " style={{ fontFamily: "Montserrat, sans-serif" }} key={card._id}>
                                            <div className="col-md-2">   <span className="rounded-circle bg-secondary border border-dark d-flex justify-content-center align-items-center" style={{ color: "white", height: "22px", width: "22px", position: "relative", top: "12px", right: "-35px", fontSize: "0.8rem", opacity: "95%" }}>{(cart?.totalItemsInCart == 0) ? (<>0</>) : (<>{cart?.cards[cart.cards.findIndex((c) => c._id == card._id)].quantity}</>)}</span>
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
                                <button className="btn btn-primary text-light w-100 my-4" disabled={!formik.isValid || !formik.dirty} onClick={() => { handleSubmitButton() }}>{`CONTINUE TO PAYMENT >`}</button>
                            </div>

                        </div>
                    </div>

                </>

            ) : (
                <div style={{ position: "absolute", top: "40%", left: "43%", }} className="fw-bold fs-4 mb-3 " >
                    <img src="images/empty-ba1g.svg" alt="bag" style={{ width: "10rem", marginBottom: "25px" }} />
                    <p >YOUR BAG IS EMPTY</p>
                    <button className="btn btn-dark text-light" onClick={() => navigate("/products")}>SHOP NOW</button>
                </div>)
            }

        </div >



    )
}

export default FavCards;