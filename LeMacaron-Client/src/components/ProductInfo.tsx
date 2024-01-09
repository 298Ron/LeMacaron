import { FunctionComponent, useEffect, useState } from "react";
import Card from "../interfaces/Product";
import { getProductById } from "../services/productService";
import { useNavigate, useParams } from "react-router-dom";
import User from "../interfaces/User";
import { addToCart } from "../services/CartService";
import { errorMsg, successMsg } from "../services/feedbacksService";
import { getTokenDetails } from "../services/usersService";
import axios from "axios";

interface ProductInfoProps {
    userInfo: User;
    render: any;
    dataUpdated: any;
}

const ProductInfo: FunctionComponent<ProductInfoProps> = ({ userInfo, render, dataUpdated }) => {



    let [cartItems, setCartItems] = useState<any[]>([])
    const params = useParams();

    useEffect(() => {

        getProductById((params.id) as string)
            .then((res) => {
                setCards(res.data)

                render()

            })
            .catch((err) => console.log(err))
    }, []);
    let handleAddToCart = (card: Card) => {
        if (Number(card.quantityInStock) <= 0) {
            return errorMsg(`Item "${card.title}" is out of stock`)
        } else {
            addToCart(card._id as string, card.price as number, 1 as number)
                .then((res) => {
                    setCartItems([...cartItems]);
                    successMsg(`${card.title} was added to cart!`);
                    sessionStorage.setItem("userInfo"
                        , JSON.stringify({
                            totalItemsInCart: (JSON.parse(sessionStorage.getItem("userInfo") as any).totalItemsInCart) + 1,
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

    let [cards, setCards] = useState<Card>();
    let [style, setStyle] = useState()
    let [style1, setStyle1] = useState("d-none")
    let [style2, setStyle2] = useState("d-block")


    const changeStyle = (theImage: any) => {
        setStyle(theImage);
        setStyle1("d-block")
        setStyle2("d-none")
    }
    let roles = (userInfo.role);
    const [image, setImage] = useState()
    useEffect(() => {
        axios.get(`http://localhost:9500/api/products/${params.id}`)
            .then((res) => {
                console.log(res.data.images);
                setImage(res.data.images);
            }
            )
            .catch((err) => console.log(err))
    }, []);
    return (
        <>
            <div className="container my-5 " style={{ minHeight: "73vh" }} key={cards?._id}>
                <h4 className="display-4">{cards?.title}</h4>
                <div className="row my-5" style={{ width: "80%", margin: "0 auto" }}>
                    <div className="col-md-5">

                        <img src={`/${style}`} style={{ width: "100%", objectFit: "cover" }} className={` ${style1} `} />
                        <img src={`/${cards?.image}`} alt={cards?.title} style={{ width: "100%", objectFit: "cover" }} className={`animationLeftSlide ${style2}`} />
                    </div>


                    <div className="col-md-7 mt-5 animationRightSlide">
                        <h4>{cards?.description}</h4>
                        <h4 className="mt-4 fs-3">Price: {cards?.price} ₪ </h4>
                        {roles && <button className=" btnHover btn w-75"
                            onClick={() => handleAddToCart(cards as any)}><i className="fa-solid fa-plus"></i> Add to cart
                        </button>}
                        <br />
                        {cards?.images?.map((image: string) => (
                            <img src={`/${image}`} alt={`${image}`} style={{ width: "25%" }} className="m-2" onClick={() => changeStyle(image)} key={image} />
                        ))}

                    </div>

                </div>


            </div>
        </>
    )
}

export default ProductInfo;