import { FunctionComponent } from "react";
import { useFormik } from "formik";
import { checkUser, getTokenDetails } from "../services/usersService";
import * as yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import { errorMsg, successMsg } from "../services/feedbacksService";
interface LoginProps {
    setUserInfo: Function;
}

const Login: FunctionComponent<LoginProps> = ({ setUserInfo }) => {


    let navigate = useNavigate();
    let formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: yup.object({
            email: yup.string().required().email(),
            password: yup.string().required().min(9),
        }),
        onSubmit(values) {
            checkUser(values)
                .then((res) => {
                    navigate("/");
                    successMsg(`You're logged in as ${values.email}`);
                    sessionStorage.setItem(
                        "token",
                        JSON.stringify({
                            token: res.data,
                        }
                        )

                    );


                    sessionStorage.setItem(
                        "userInfo",
                        JSON.stringify({

                            email: (getTokenDetails() as any).email,
                            userId: (getTokenDetails() as any)._id,
                            role: (getTokenDetails() as any).role,
                            imageUrl: (getTokenDetails() as any).imageUrl,

                        }

                        )

                    );
                    setUserInfo(
                        JSON.parse(sessionStorage.getItem("userInfo") as string)
                    );


                })

                .catch((err) => {
                    console.log(err)
                    errorMsg("Wrong email or password")
                });
        },

    })
    let clear = () => {
        formik.resetForm()
    }
    return (
        <>
            <div className="container col-md-4 mt-5 animationRightSlide" style={{ height: "70vh", }}>
                <h2 className="display-6 my-3">LOGIN</h2>
                <form className="form row" onSubmit={formik.handleSubmit} id="myForm">
                    <div className="form-floating">
                        <input type="email" className="form-control shadow mb-2"
                            id="floatingEmail"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Email" />
                        <label htmlFor="floatingEmail" className="ms-4 text-dark">Email</label>
                        {formik.touched.email && formik.errors.email && (
                            <small className="text-danger">{formik.errors.email}</small>)}
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control shadow mb-2"
                            name="password"
                            id="floatingPassword"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="password" />
                        <label htmlFor="floatingPassword" className="ms-4 text-dark">password</label>
                        {formik.touched.password && formik.errors.password && (
                            <small className="text-danger">{formik.errors.password}</small>)}
                    </div>
                    <div className="my-2">

                        <button className="btn btn-secondary col-md-12 my-2" type="submit" disabled={!formik.isValid || !formik.dirty}>SUBMIT</button>
                    </div>
                </form>
                <NavLink to="/" className="btn btn-danger col-md-5 mx-1 mb-3" style={{ backgroundColor: "crimson", opacity: "90%" }}>Cancel</NavLink>
                <button className="btn btn-primary col-md-5 mx-1 mb-3" onClick={clear} style={{ backgroundColor: "blue", opacity: "90%" }}><i className="fa-solid fa-rotate"></i></button>
            </div>
        </>
    )
}

export default Login;