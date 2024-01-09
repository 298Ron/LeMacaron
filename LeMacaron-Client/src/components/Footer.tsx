import { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";

interface FooterProps {

}

const Footer: FunctionComponent<FooterProps> = () => {
    return (
        <>
            <footer className="darkText downfooter py-3" style={{ width: "100%", }} >
                <div className="container  ">
                    <div className="">
                        <div className="col-4"></div>
                        <div className="col-12 ">


                            <div className="row mt-3">
                                <ul>
                                    <NavLink to="" className={""}><i className="col-2  fa-2x  fa-brands  darkText  fa-facebook"></i></NavLink>
                                    <NavLink to="https://www.instagram.com/le.macaron_boutique/" className={""} target="_blank"><i className="col-2  fa-2x  fa-brands  darkText  fa-instagram"></i></NavLink>
                                    <NavLink to="" className={""}><i className="col-2  fa-2x  fa-brands  darkText  fa-twitter"></i></NavLink>
                                </ul>
                                <div className="row" >
                                    <ul className="list-inline " >
                                        <NavLink to="/" className=" darkText mx-4 col-3  fw-bold text-decoration-none" aria-current="page">
                                            HOME
                                        </NavLink>
                                        <NavLink to="/about" className=" darkText col-3  fw-bold text-decoration-none" aria-current="page">
                                            ABOUT
                                        </NavLink>
                                    </ul>
                                </div>
                                <div className="col-md-12 mt-1">
                                    <p>© 2023 LeMacaroon. All rights reserved.</p>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;