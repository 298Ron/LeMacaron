import { FunctionComponent, useEffect, useState } from "react";
import Card from "../interfaces/Product";
import { getProducts } from "../services/productService";
import { useNavigate } from "react-router-dom";

interface HomeProps {
    render: any;
    dataUpdated: any;
}

const Home: FunctionComponent<HomeProps> = ({ render, dataUpdated }) => {
    let navigate = useNavigate()
    let [cardChanged, setCardsChanged] = useState<boolean>(false);
    let [cards, setCards] = useState<Card[]>([]);
    useEffect(() => {
        getProducts()
            .then((res) => {
                setCards(res.data);
                render()
            })
            .catch((err) => console.log(err))

    }, [cardChanged]);
    return (
        <>
            <div className="home " >
                <div className="pb-3 p-5 " style={{ zIndex: "2", backgroundImage: "url(images/homePageMacaroons.jpg)", backgroundAttachment: "fixed", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "bottom", minHeight: "100vh", maxHeight: "130vh", }}>
                    <div className="" style={{ margin: "0 auto", position: "relative" }}>
                        <div className="animationRightSlide col-md-4 p-4 card" style={{ right: "0%", opacity: "90%", maxHeight: "80vh", position: "absolute" }} >
                            <h3 className="display-1" >HOME</h3>
                            <p className="" style={{ fontSize: "1.0em" }} >Attention business owners and entrepreneurs! Are you ready to take your company to new heights of success? Look no further than BCard. We are a dynamic and innovative company dedicated to helping businesses thrive in today's competitive landscape. By registering on our website, you gain access to a wide range of exclusive benefits and resources tailored to meet your specific needs. From strategic partnerships to industry insights, our platform is designed to empower you and drive your business forward. Don't miss out on this opportunity to unlock growth and discover new possibilities.</p>

                        </div>
                    </div ></div>


                <div className="py-5 ">
                    <h4 className="display-4 ">OUR  GALLERY</h4>
                    <div className="" >
                        {cards.length ? (
                            <div className="row border-top border-dark " style={{ margin: "0 auto", width: "85%" }}>
                                {cards.map((card: Card) => (
                                    <div className="card col-md-3 my-4 shadow" style={{ width: "18rem", margin: "0 auto" }} key={card._id}>
                                        <img src={card.image} onClick={() => navigate(`/products/info/${card._id}`)} className="card-img-top object-fit-cover mt-2" alt={card.title} style={{ width: "16.5rem", height: "16.5rem" }} />
                                        <div className="card-body">
                                            <h5 className="card-title">{card.title}</h5>
                                            <p className="card-text">{card.description}</p>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (<p>There is no cards to display</p>)}
                    </div>
                </div>
            </div >
        </>

    )
};


export default Home;