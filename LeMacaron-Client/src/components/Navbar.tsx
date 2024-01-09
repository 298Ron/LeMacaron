import { FunctionComponent, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ReactSwitch from "react-switch";
import { getCarts } from "../services/CartService";
import Cart from "../interfaces/Cart";
interface NavbarProps {
    userInfo: any;
    setUserInfo: Function;
    theme: any;
    toggleTheme: any;
    render: any;
    dataUpdated: any;
}





const Navbar: FunctionComponent<NavbarProps> = ({ userInfo, setUserInfo, theme, toggleTheme, render, dataUpdated }) => {
    const ref = useRef(null)
    let roles = (userInfo.role >= 0);
    let navigate = useNavigate();
    let [cart, setCart] = useState<Cart>()

    let logout = () => {
        if (window.confirm("Are you sure?") === true) {
            sessionStorage.removeItem("userInfo");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("ShippingTo");

            navigate("");
        }


    };


    useEffect(() => {
        if (userInfo.userId) {
            getCarts(userInfo.userId)
                .then((res) => {
                    setCart(res.data);


                }).catch((err) => console.log(err))

        }

    }, [dataUpdated]);





    let findKey1: any = ((ref.current as any))


    return (
        <nav className="navbar  navbar-expand-lg Navbar position-sticky top-0 start-50 shadow-lg z-3 animationBottomSlide ">
            <div className="container-fluid" style={{ width: "90%" }}>

                <NavLink to="/" className=" lemacaroon darkText me-3" style={{
                    fontSize: "1.7rem", fontFamily: "Pacifico, cursive", textDecoration: "none",
                }} >
                    LeMacaroon
                </NavLink>
                <button className="navbar-toggler " type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" >
                    <span className="navbar-toggler-icon " data-bs-theme="light"></span>
                </button>


                <div className="collapse navbar-collapse" id="navbarNav" style={{ fontFamily: "Montserrat, sans-serif", margin: "0 auto" }}>

                    <ul className="navbar-nav" >
                        <ul className="navbar-nav " >
                            <li className="nav-item">
                                <NavLink to="/about" className="  mt-2 mx-2 nav-link navHeader  darkText" aria-current="page" >
                                    ABOUT
                                </NavLink>

                            </li>
                            <li className="nav-item ">
                                <NavLink to="/products" className="  mt-2 mx-2 nav-link navHeader darkText" aria-current="page">
                                    PRODUCTS
                                </NavLink>
                            </li>
                            {roles && (
                                <>

                                </>
                            )}
                            {(userInfo.role >= 1) && (
                                <>
                                    <li className="nav-item ">
                                        <NavLink to="/adminPanel" className="  mt-2 mx-2 nav-link navHeader darkText" aria-current="page">
                                            USERS
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                    </ul>
                </div>


                <form className="d-flex mt-3" role="search" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <div className="switch">

                        <label className="">{theme === "light" ? "Light Mode" : "Dark Mode"}</label>
                        <br></br>
                        <ReactSwitch onChange={toggleTheme} checked={theme === "dark"} />

                    </div>
                    {roles ? (
                        <>
                            <NavLink to="/cart" className=" mx-4 image darkText" aria-current="page" style={{ fontSize: "30px", position: "relative", textDecoration: "none", }}>
                                <i className="fa-solid fa-cart-shopping" ></i>
                                <div className="rounded-circle bg-danger d-flex justify-content-center align-items-center" style={{ color: "white", height: "22px", width: "22px", position: "relative", bottom: "35%", right: "-60%", fontSize: "0.8rem", }}> <label ref={ref}>
                                    {cart?.totalItemsInCart}

                                </label></div>

                            </NavLink>
                            <div className="mt-1">


                                <NavLink to={`/orders`}><img src={userInfo.imageUrl} alt="" className="rounded" style={{ width: "40px", objectFit: "cover", height: "40px" }} /></NavLink>

                                <button onClick={logout} className="nav-link ">
                                    Logout
                                </button>
                            </div>

                        </>
                    ) : (<>
                        <><NavLink to="/login" className="nav-link mx-4  navHeader">
                            LOGIN
                        </NavLink><NavLink to="/register" className="nav-link  navHeader">
                                SIGNUP
                            </NavLink></>
                    </>)}

                </form>


            </div>
        </nav>
    )
}

export default Navbar;