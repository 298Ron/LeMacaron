import { FunctionComponent } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { changeUserPassword } from "../services/usersService";
import { errorMsg, successMsg } from "../services/feedbacksService";


interface ChangePasswordProps {
    userInfo: any;
    setUserInfo: Function;
}

const ChangePassword: FunctionComponent<ChangePasswordProps> = ({ userInfo, setUserInfo }) => {
    let navigate = useNavigate();
    let formik = useFormik({
        initialValues: { currentPassword: "", password: "", passwordConfirm: "" },
        validationSchema: yup.object({
            currentPassword: yup.string().required().min(9),
            password: yup.string().required().min(9),
            passwordConfirm: yup.string().required().min(9),
        }),
        onSubmit(values) {
            if (values.password != values.passwordConfirm) {
                return errorMsg("The new passwords are not much!")
            } else {
                changeUserPassword(values as any, userInfo.userId)
                    .then((res) => {
                        successMsg("Password was updated successfully!")
                    })

                    .catch((err) => {
                        console.log(err);
                        errorMsg("Something went wrong")

                    })
            }


        }
    })
    let clear = () => {
        formik.resetForm()
    }

    return (
        <>
            <div className="container col-md-4 mt-5 animationRightSlide" style={{ minHeight: "64vh", fontFamily: "Montserrat, sans-serif" }}>
                <div >
                    <h3 className="display-4 my-5">Password Change</h3>
                    <form className="form row" onSubmit={formik.handleSubmit}>
                        <div className="form-floating">
                            <input type="password" className="form-control shadow mb-2"
                                id="floatingcurrentPassword"
                                name="currentPassword"
                                value={formik.values.currentPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="currentPassword" />
                            <label htmlFor="floatingcurrentPassword" className="ms-4 text-dark">currentPassword</label>
                            {formik.touched.currentPassword && formik.errors.currentPassword && (
                                <small className="text-danger">{formik.errors.currentPassword}</small>)}
                        </div>
                        <div className="form-floating">
                            <input type="password" className="form-control shadow mb-2"
                                id="floatingpassword"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="password" />
                            <label htmlFor="floatingpassword" className="ms-4 text-dark">password</label>
                            {formik.touched.password && formik.errors.password && (
                                <small className="text-danger">{formik.errors.password}</small>)}
                        </div>
                        <div className="form-floating">
                            <input type="password" className="form-control shadow mb-2"
                                id="floatingpasswordConfirm"
                                name="passwordConfirm"
                                value={formik.values.passwordConfirm}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="passwordConfirm" />
                            <label htmlFor="floatingpasswordConfirm" className="ms-4 text-dark">passwordConfirm</label>
                            {formik.touched.passwordConfirm && formik.errors.passwordConfirm && (
                                <small className="text-danger">{formik.errors.passwordConfirm}</small>)}
                        </div>
                        <button className="btn col-6 mt-4 m-auto" type="submit" disabled={!formik.isValid || !formik.dirty}>Change password</button>

                    </form>
                    <button className="btn col-5 mt-4 m-auto bg-secondary text-light" onClick={clear}>clear inputs</button>
                </div>

            </div >
        </>
    )
}

export default ChangePassword;