import { FunctionComponent, useEffect, useRef, useState } from "react";
import Card from "../interfaces/Product";
import Cart from "../interfaces/Cart";
import { deleteProduct, getProductByKey, getProducts } from "../services/productService";
import { errorMsg, successMsg } from "../services/feedbacksService";
import { addToCart, getCarts } from "../services/CartService";
import { Link, useNavigate } from "react-router-dom";
import { getTokenDetails } from "../services/usersService";

interface MyCardsProps {
    userInfo: any;
    render: any;
    dataUpdated: any;
}

const MyCards: FunctionComponent<MyCardsProps> = ({ userInfo, render, dataUpdated }) => {
    const ref = useRef(null)
    let [cart, setCart] = useState<Cart>()
    let [cartItems, setCartItems] = useState<any[]>([])
    let navigate = useNavigate();
    let [cards, setCards] = useState<Card[]>([]);

    let handleAddToCart = (card: Card) => {
        if (Number(card.quantityInStock) <= 0) {
            return errorMsg(`Item "${card.title}" is out of stock`)
        } else {
            addToCart(card._id as string, card.price as number, 1 as number)
                .then((res) => {

                    render()
                    setCartItems([...cartItems]);
                    successMsg(`${card.title} was added to cart!`);
                    sessionStorage.setItem("userInfo"
                        , JSON.stringify({

                            email: (getTokenDetails() as any).email,
                            userId: (getTokenDetails() as any)._id,
                            role: (getTokenDetails() as any).role,
                            imageUrl: (getTokenDetails() as any).imageUrl,
                        }))


                })
                .catch((err) => { console.log(err); });
        }
    }

    let removeCard = (card: Card) => {
        if (window.confirm("Are you sure?") === true) {
            deleteProduct(card._id as string)
                .then((res) => {
                    render()
                    successMsg("Product deleted successfully!")
                    navigate("/products")
                })
                .catch((err) => console.log(err))
        }
    }
    useEffect(() => {
        if (userInfo.userId) {
            getCarts(userInfo.userId).then((res) => {
                let defaultCardIds: any[] = res.data?.cards.map((card: any) => card._id) || [];
                setCartItems(defaultCardIds);
                setCart(res.data);
                changeStyle3();


            }).catch((err) => console.log(err))
        }
        getProducts()
            .then((res) => {
                setCards(res.data)

            })
            .catch((err) => console.log(err));
    }, [dataUpdated, userInfo.userId]);


    let searchSystem = (some: any) => {
        if (some.length > 0) {
            getProductByKey(some)
                .then((res) => {

                    setCards(res.data)
                })
                .catch((err) => {
                    console.log(err);
                })
        } else if (some.length === 0) {
            getProducts()
                .then((res) => {
                    setCards(res.data)

                })
                .catch((err) => console.log(err));
        }

    }
    let findKey: any = ((ref.current as any))


    let [style, setStyle] = useState("d-none");
    let [style1, setStyle1] = useState("d-block");
    const changeStyle = () => {
        if (style !== "d-none") {
            setStyle("d-none");
            setStyle1("d-block");
        }
        else {
            setStyle("d-block");
            setStyle1("d-none");
        }
    }
    let [style3, setStyle3] = useState("col-md-4");
    const changeStyle3 = () => {
        if (userInfo) {
            setStyle3("col-md-7")
        }
    }

    let roles = (userInfo.role >= 0);
    return (
        <>
            <div style={{ minHeight: "65vh" }}>
                <div className=" container animationRightSlide" style={{ margin: "0 auto" }}>
                    <h4 className="display-5 mt-3">PRODUCTS</h4>
                    <p className=" mb-2">Here you can find macarons from all categories</p>
                    <div className="row">
                        <div className="col-md-5" style={{ margin: "0 auto" }}>
                            <div className="form-floating mb-3 " style={{ margin: "0 auto", }}>
                                <input type="text"
                                    name="image"
                                    className="form-control text-dark "
                                    placeholder="Search"
                                    ref={ref}

                                    onChange={() => searchSystem(findKey.value)}
                                />
                                <label className="text-dark " style={{ fontSize: "1rem" }} >Search by Name / Category</label>

                            </div>

                        </div>



                    </div>
                    <button className="btn col-md-2 m-2 mb-4" onClick={changeStyle}>Change view</button>
                </div >

                {/* CARDS */}
                <div className={`container mb-5  animationLeftSlide ${style}`}>
                    <div className={` `}>
                        {cards.length ? (
                            <div className="row " style={{ textAlign: "left" }}>
                                {cards.map((card: Card, index: number) => (




                                    <div className=" my-3 col-md-3 card image animationLeftSlide" style={{ width: "18rem", margin: "0 auto", }} key={index}>





                                        <span style={{ position: "relative" }} >
                                            <img src={card.image} onClick={() => navigate(`info/${card._id}`)} className="card-img-top object-fit-cover mt-2 " alt={card.title} style={{ width: "16.5rem", height: "16.5rem", }} />
                                            {roles && <button className=" btnHover btn2" style={{ position: "absolute", bottom: "3%", left: "7%" }}
                                                onClick={() => handleAddToCart(card)}>
                                                <i className="fa-solid fa-plus"></i>
                                                Add to cart</button>}

                                        </span>

                                        <div className="card-body">
                                            <h6 className="card-title mt-2">{card.title}</h6>
                                            <p className="">{card.category}</p>
                                            <h5 className="cart-price">{card.price} ₪</h5>

                                            {((userInfo.role >= 1)) && (<Link to={`/products/edit/${card._id as string}`}><i className="fa-solid fa-pen mx-5 text-warning"></i></Link>)}
                                            {((userInfo.role >= 1)) && (<Link to="" onClick={() => removeCard(card)} ><i className="fa-solid fa-trash text-danger ms-3" ></i></Link>)}
                                        </div>
                                    </div>
                                )
                                )
                                }

                            </div>
                        ) : (<p style={{ height: "40vh" }}>There is no cards to display</p>)}


                    </div>
                    {(userInfo.role >= 1) && (<Link to="add" className="btn  rounded-5 fw-bold position-fixed end-0 m-3 newCard " style={{ top: "70%" }}><i className="fa-solid fa-plus me-2"></i>Add</Link>)}
                </div >
                {/* ROWS */}
                <div className={`container mb-5 animationLeftSlide ${style1} `}  >
                    {cards.length ? (<div>

                        {cards.map((card: Card, index: number) => (



                            <div className={`row p-3 ${style3} col-md-8`} style={{ fontFamily: "Montserrat, sans-serif", borderBottom: "1px solid  rgba(0, 0, 0, 0.1)", margin: "0 auto" }} key={index}>

                                <span className="col-md-4" >
                                    <img className="shadow" onClick={() => navigate(`/products/info/${card._id}`)} src={`${card.image}`} alt={`${card.title}`} style={{ objectFit: "cover", width: "7rem", height: "8rem", }} />
                                </span>
                                <div className="col-md-4">
                                    <span className="">{card.title}</span>
                                    <span className=""><br />{card.category}</span>
                                    <span className="fw-bolder"><br />{card.price} ₪</span>

                                </div>

                                <div className="col-md-4" style={{ alignItems: "right" }}>
                                    <div className=" d-flex align-items-center  mt-3" style={{ gap: ".5rem" }}>

                                        <div className="d-flex align-items-center justify-content-center" style={{ gap: ".5rem", margin: "0 auto" }}>

                                            {roles && <button className=" btnHover btn"
                                                onClick={() => handleAddToCart(card)}><i className="fa-solid fa-plus"></i> Add to cart</button>}


                                            {((userInfo.role >= 1)) && (<Link to={`/products/edit/${card._id as string}`}><i className="fa-solid fa-pen mx-5 text-warning"></i></Link>)}
                                            {((userInfo.role >= 1)) && (<Link to="" onClick={() => removeCard(card)} ><i className="fa-solid fa-trash text-danger ms-3" ></i></Link>)}

                                        </div>


                                    </div>
                                </div>

                            </div>

                        ))}
                        {(userInfo.role >= 1) && (<Link to="add" className="btn  rounded-5 fw-bold position-fixed end-0 m-3 newCard " style={{ top: "70%" }}><i className="fa-solid fa-plus me-2"></i>Add</Link>)}
                    </div>


                    ) : (<p style={{ height: "40vh" }}>There is no cards to display</p>)}
                </div>


            </div>
        </>
    )
};

export default MyCards;