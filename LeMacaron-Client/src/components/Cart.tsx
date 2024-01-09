import { FunctionComponent, useEffect, useState } from "react";
import Product from "../interfaces/Product";
import { addToCart, decreaseQuantity, deleteProductFomCart, getCarts } from "../services/CartService";
import { errorMsg, successMsg } from "../services/feedbacksService";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import Cart from "../interfaces/Cart";
import { findByTestId } from "@testing-library/react";
import Card from "../interfaces/Product";
import { getTokenDetails } from "../services/usersService";

interface CartsProps {
    userInfo: any;
    render: any;
    dataUpdated: any;
}

const Carts: FunctionComponent<CartsProps> = ({ userInfo, render, dataUpdated }) => {
    let [cart, setCart] = useState<Cart>()
    let navigate = useNavigate()
    let [cards, setCards] = useState<Product[]>([]);
    let [cartItems, setCartItems] = useState<Cart[]>([])


    let handleAddToCart = (card: Card) => {

        if (Number(card.quantityInStock) <= 0) {
            return errorMsg(`Item "${card.title}" is out of stock`)
        } else {

            addToCart(card._id as string, card.price as number, 1 as number)

                .then((res) => {
                    /*   setDataUpdated(!dataUpdated) */
                    setCartItems([...cartItems]);
                    successMsg(`${card.title} was added to cart!`);
                    sessionStorage.setItem("userInfo"
                        , JSON.stringify({

                            email: (getTokenDetails() as any).email,
                            userId: (getTokenDetails() as any)._id,
                            role: (getTokenDetails() as any).role,
                            imageUrl: (getTokenDetails() as any).imageUrl,
                        }))

                    render()
                })
                .catch((err) => { console.log(err); });
        }

    }
    let handleDecreaseQuantity = (card: Card) => {

        decreaseQuantity(card._id as string, card.price as number, 1 as number)
            .then((res) => {

                successMsg(`${card.title} quantity has been decreased by one`);

                sessionStorage.setItem("userInfo"
                    , JSON.stringify({

                        email: (getTokenDetails() as any).email,
                        userId: (getTokenDetails() as any)._id,
                        role: (getTokenDetails() as any).role,
                        imageUrl: (getTokenDetails() as any).imageUrl,
                    }))


                render()
            }).catch((err) => console.log(err))

    }


    let handleRemoveFromCart = (card: any) => {
        let specificCart = cart?.cards[cart.cards.findIndex((c) => c._id == card._id)]
        let removeQuantity = specificCart?.quantity
        sessionStorage.setItem("userInfo"
            , JSON.stringify({

                email: (getTokenDetails() as any).email,
                userId: (getTokenDetails() as any)._id,
                role: (getTokenDetails() as any).role,
                imageUrl: (getTokenDetails() as any).imageUrl,
            }))
        deleteProductFomCart(specificCart?._id as string, specificCart?.price as number, specificCart?.quantity as number)
            .then((res) => {


                render()
            }).catch((err) => {
                console.log(err)
            })
    }

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
    }, [cartItems]);



    useEffect(() => {
        if (userInfo.userId) {
            getCarts(userInfo.userId)

                .then((res) => {
                    setCart(res.data);



                }).catch((err) => console.log(err))
        }

    }, [dataUpdated, userInfo.userId]);



    return (
        <div className="container my-5 checkOut" style={{ textAlign: "start", minHeight: "77vh" }} >
            {cards.length ? (
                <>
                    <div className="row">

                        <div className="col-md-8 animationLeftSlide">

                            <h4 className="fw-normal display-6 mb-3 ">YOUR BAG</h4>

                            <p className=" fs-5 "><i className="fa-solid fa-circle-exclamation "></i> <span className="text-warning"> Your items aren’t reserved,</span> checkout quickly to make sure you don’t miss out.</p>

                            {cards.map((card: Product) => {

                                return (


                                    <div className="row p-3 " key={card._id} style={{ fontFamily: "Montserrat, sans-serif", borderBottom: "1px solid  rgba(0, 0, 0, 0.1)", }}>

                                        <span className="col">
                                            <img className="shadow" onClick={() => navigate(`/products/info/${card._id}`)} src={`${card.image}`} alt={`${card.title}`} style={{ objectFit: "cover", width: "7rem", height: "8rem", }} />
                                        </span>
                                        <div className="col ">
                                            <span className="">{card.title}</span>
                                            <span className=""><br />{card.category}</span>
                                            <span className="fw-bolder"><br />{card.price} ₪</span>

                                        </div>
                                        <span className="col"></span>
                                        <div className="col" style={{ alignItems: "right" }}>
                                            <div className=" d-flex align-items-center  mt-3" style={{ gap: ".5rem" }}>

                                                <div className="d-flex align-items-center justify-content-center" style={{ gap: ".5rem" }}>

                                                    <button className="btn bg-light text-dark border-1 border-dark fw-bold rounded-3 " onClick={() => handleDecreaseQuantity(card)} >-</button>
                                                    {(cart?.cards.length) && (<>
                                                        <span className="mx-2" style={{ textAlign: "center" }}>
                                                            <span className="fw-bold">Qty: {((cart?.cards[cart.cards.findIndex((c) => c._id == card._id)])) ? (< >{cart?.cards[cart.cards.findIndex((c) => c._id == card._id)].quantity}</>) : (<p>0</p>)}  </span></span>
                                                    </>)}




                                                    <button className="btn bg-light text-dark border-1 border-dark fw-bold rounded-3 " onClick={() => handleAddToCart(card)}>+</button>

                                                </div>

                                                <button className="btn  bg-secondary-emphasis text-dark rounded" style={{ backgroundColor: "lightgray" }} onClick={() => handleRemoveFromCart(cart?.cards[cart.cards.findIndex((c) => c._id == card._id)])} ><i className="fa-solid fa-trash-can"></i></button>
                                            </div>
                                        </div>
                                    </div>

                                )
                            })}
                        </div>
                        <div className="col-md-1"></div>
                        <div className="col-md-3 animationRightSlide" style={{ fontFamily: "Montserrat, sans-serif", }}>
                            <h4 className="fw-normal display-6 pb-3 sumarry" style={{ borderBottom: "1px solid  rgba(0, 0, 0, 0.1)", }}>SUMMARY</h4>
                            <div className=" mt-4">
                                <div className="row pb-3">

                                    {/* SUB TOTAL */}
                                    <div className="row">
                                        <h4 className="col-md-8" style={{ textAlign: "left" }}>Sub Total:  </h4>
                                        <h4 className="col-md-4" style={{ textAlign: "right" }}> {cart?.totalToPay} ₪</h4>
                                    </div>

                                    {/* THE DISCOUNT CALCULATOR */}
                                    {(cart?.orderDiscountCode == "True") && (
                                        <div className="row  mt-2" >
                                            <h4 className="col-md-8" style={{ textAlign: "left" }}>Discount:  </h4>
                                            <h4 className="col-md-4" style={{ textAlign: "right" }}>
                                                <p>- {cart.totalToPay * 0.2}₪  (20%)</p>

                                                <p></p>



                                            </h4>
                                        </div>)}

                                    {/* SHIPPING */}
                                    <div className="row  mt-2" >
                                        <h4 className="col-md-8" style={{ textAlign: "left" }}>Shipping:  </h4>
                                        <h4 className="col-md-4" style={{ textAlign: "right" }}>
                                            {/* SHIPPING WITH DISCOUNT CODE */}  {(cart?.orderDiscountCode == "True") && (<>
                                                {((cart.totalToPay * 0.8) >= 200) ? (<>Free</>) : (<>20₪</>)}</>)}
                                            {/* SHIPPING WITHOUT DISCOUNT CODE */} {(cart?.orderDiscountCode != "True") &&
                                                (<>{(cart?.totalToPay as any >= 200) ? (<>Free</>) : (<>20₪</>)}</>)}
                                        </h4>
                                    </div>

                                    {/* TOTAL */}
                                    <div className="row py-3 mt-3" style={{ borderBlock: "1px solid  rgba(0, 0, 0, 0.1)", }}>
                                        <h4 className="col-md-8" style={{ textAlign: "left" }}>Total:  </h4>
                                        <h4 className="col-md-4" style={{ textAlign: "right" }}>
                                            {/* TOTAL WITH DISCOUNT CODE */}  {(cart?.orderDiscountCode == "True") && (<>
                                                {((cart.totalToPay * 0.8) >= 200) ? (<>{(cart.totalToPay * 0.8)}</>) : (<>{(cart.totalToPay * 0.8) + 20}</>)}</>)}
                                            {/* TOTAL WITHOUT DISCOUNT CODE */} {(cart?.orderDiscountCode != "True") &&
                                                (<>{(cart?.totalToPay as any >= 200) ? (<>{cart?.totalToPay}</>) : (<>{cart?.totalToPay as any + 20}</>)}</>)}
                                            ₪</h4>
                                    </div>
                                </div >


                            </div>
                            <div className="fw-bold">
                                <Link to={`/checkout`}> <button className="btn w-100 rounded-5 p-3 text-light fs-5" style={{ margin: "0px auto", marginTop: "20px", }} ><i className="fa-solid fa-bag-shopping  me-2"></i> CHECKOUT SECURELY</button></Link>
                                <p className="mt-5  text-center">DELIVERED TO YOUR DOOR.</p>
                                <p className="mt-3  text-center text-light bg-secondary p-4 opacity-75 fs-6" > <i className="fa-solid fa-truck me-2"></i> Free Delivery over 200₪ </p>
                                <div style={{ textAlign: "center" }}>
                                    <p className="mt-4 pt-3" style={{ borderTop: "1px solid  rgba(0, 0, 0, 0.1)" }}>NEED HELP ?</p>
                                    <p className="phone">Vlad : +972 53-911-4070</p>
                                    <p className="phone">Marina : +972 55-917-7167</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>

            ) : (
                <div style={{ height: "65vh", margin: "0 auto" }}>
                    <div style={{ position: "relative", top: "30%", fontFamily: "Montserrat, sans-serif", textAlign: "center", margin: "0 auto" }} className="fw-bold fs-4 mb-3 " >
                        <img src="images/empty-ba1g.svg" alt="bag" style={{ width: "10rem", marginBottom: "25px" }} />
                        <p >YOUR BAG IS EMPTY</p>
                        <button className="btn btn-dark text-light" onClick={() => navigate("/products")}>SHOP NOW</button>
                    </div>
                </div>)}

        </div >



    )
}

export default Carts;