import { FunctionComponent } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { addProduct } from "../services/productService";
import { successMsg } from "../services/feedbacksService";
import { useNavigate } from "react-router-dom";

interface NewCardProps {
    userInfo: any
}

const NewCard: FunctionComponent<NewCardProps> = ({ userInfo }) => {
    let resetForm = () => {

    }
    let navigate = useNavigate()
    let formik = useFormik({
        initialValues: { image: "", title: "", description: "", price: 0, quantityInStock: 0, creatorId: userInfo.userId, category: "" },
        validationSchema: yup.object({
            image: yup.string().required(),
            title: yup.string().required().min(2),
            description: yup.string().required().min(2),
            price: yup.number().required(),
            quantityInStock: yup.number().required(),
            category: yup.string().required(),

        }),
        onSubmit(values) {
            addProduct(values)
                .then((res) => {
                    navigate("/products")
                    successMsg("Product was added successfuly!");

                    resetForm()
                })
                .catch((err) => console.log(err))
        }
    })
    return (
        <>
            <div className="container col-md-8" style={{ minHeight: "70vh" }}>
                <h4 className="display-4 border-bottom pb-3">ADD A NEW PRODUCT</h4>
                <form className="form" onSubmit={formik.handleSubmit}>
                    <div className="row">
                        {/*LEFT COLUMN*/}
                        <div className="col-md-6">
                            <div className="form-floating mb-3">
                                <input type="text"
                                    name="image"
                                    className="form-control text-dark" placeholder="Image url"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.image} />
                                <label className="text-dark" >Image url</label>
                                {formik.touched.image && formik.errors.image && (
                                    <small className="text-danger">{formik.errors.image}</small>)}
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text"
                                    name="title"
                                    className="form-control" placeholder="Title"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.title} />
                                <label className="text-dark" >Title</label>
                                {formik.touched.title && formik.errors.title && (
                                    <small className="text-danger">{formik.errors.title}</small>)}
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text"
                                    name="description"
                                    className="form-control" placeholder="Description"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.description} />
                                <label className="text-dark" >Description</label>
                                {formik.touched.description && formik.errors.description && (
                                    <small className="text-danger">{formik.errors.description}</small>)}
                            </div>

                        </div>
                        {/*RIGHT COLUMN*/}
                        <div className="col-md-6">
                            <div className="form-floating mb-3">
                                <input type="number"
                                    name="price"
                                    className="form-control" placeholder="price"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.price} />
                                <label className="text-dark" >price</label>
                                {formik.touched.price && formik.errors.price && (
                                    <small className="text-danger">{formik.errors.price}</small>)}
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text"
                                    name="quantityInStock"
                                    className="form-control" placeholder="price"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.quantityInStock} />
                                <label className="text-dark" >In Stock</label>
                                {formik.touched.quantityInStock && formik.errors.quantityInStock && (
                                    <small className="text-danger">{formik.errors.quantityInStock}</small>)}
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text"
                                    name="category"
                                    className="form-control" placeholder="Map URL"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.category} />
                                <label className="text-dark ms-2" >Category</label>
                                {formik.touched.category && formik.errors.category && (
                                    <small className="text-danger">{formik.errors.category}</small>)}
                            </div>
                        </div>


                    </div>
                    <button className="btn btn-danger col-md-3 mx-1 mb-3" onClick={resetForm}>Cancel</button>
                    <button className="btn btn-primary col-md-3 mx-1 mb-3" type="reset"><i className="fa-solid fa-rotate"></i></button>
                    <br />
                    <button type="submit" className="btn btn-success w-25 mb-3" disabled={!formik.isValid || !formik.dirty}>Add Product</button>
                </form>
            </div>
        </>
    )
}

export default NewCard;