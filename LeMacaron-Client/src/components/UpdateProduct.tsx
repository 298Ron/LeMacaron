import { useFormik } from "formik";
import { FunctionComponent, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup"
import { getProductById, updateProduct } from "../services/productService";
import { successMsg } from "../services/feedbacksService";
import axios from "axios";
import Product from "../interfaces/Product";
interface UpdateCardProps {
    userInfo: any
}

const UpdateCard: FunctionComponent<UpdateCardProps> = () => {
    const params = useParams();
    let { id } = useParams();
    let [product, setProduct] = useState<Product>({
        image: "",
        title: "",
        description: "",
        creatorId: "",
        price: 0,
        quantityInStock: 0,
        category: "",
        images: []
    })

    useEffect(() => {
        // get product by id


        getProductById(params.id as string)
            .then((res) => setProduct(res.data))
            .catch((err) => console.log(err))
    }, [params.id]);

    let navigate = useNavigate()
    let formik = useFormik({
        initialValues: { image: product.image, title: product.title, description: product.description, price: product.price, quantityInStock: product.quantityInStock, creatorId: product.creatorId, category: product.category, images: product.images },

        validationSchema: yup.object({
            image: yup.string().required(),
            title: yup.string().required().min(2),
            description: yup.string().required().min(2),
            price: yup.number().required(),
            quantityInStock: yup.number().required(),
            category: yup.string().required(),
            images: yup.array()
        }),
        enableReinitialize: true,
        onSubmit(values) {
            updateProduct(values, id as string)
                .then((res) => {
                    successMsg("Product was updated successfully!")
                    navigate("/products")
                })
                .catch((err) => console.log(err)
                )

        }
    })
    let clear = () => {
        formik.resetForm()
    }




    return (
        <>

            <div className="container col-md-8 " style={{ minHeight: "83vh" }}>
                <h4 className="display-4 border-bottom pb-3 mt-5">UPDATE PRODUCT</h4>
                <form className="form" onSubmit={formik.handleSubmit}>
                    <div className="row">
                        {/*LEFT COLUMN*/}
                        <div className="col-md-6 animationLeftSlide">
                            <div className="form-floating mb-3">
                                <input type="text"
                                    name="image"
                                    className="form-control shadow" placeholder="Image url"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.image} />
                                <label className="darkText" >Image url</label>
                                {formik.touched.image && formik.errors.image && (
                                    <small className="text-danger">{formik.errors.image}</small>)}
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text"
                                    name="title"
                                    className="form-control shadow" placeholder="Title"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.title} />
                                <label className="darkText" >Title</label>
                                {formik.touched.title && formik.errors.title && (
                                    <small className="text-danger">{formik.errors.title}</small>)}
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text"
                                    name="description"
                                    className="form-control shadow" placeholder="Description"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.description} />
                                <label className="darkText" >Description</label>
                                {formik.touched.description && formik.errors.description && (
                                    <small className="text-danger">{formik.errors.description}</small>)}
                            </div>


                        </div>
                        {/*RIGHT COLUMN*/}
                        <div className="col-md-6" style={{ animation: "1s ease-in 0s 1 slideInFromRight" }}>
                            <div className="form-floating mb-3">
                                <input type="text"
                                    name="price"
                                    className="form-control shadow" placeholder="price"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.price} />
                                <label className="darkText" >price</label>
                                {formik.touched.price && formik.errors.price && (
                                    <small className="text-danger">{formik.errors.price}</small>)}
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text"
                                    name="category"
                                    className="form-control shadow" placeholder="category"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.category} />
                                <label className="darkText" >Category</label>
                                {formik.touched.category && formik.errors.category && (
                                    <small className="text-danger">{formik.errors.category}</small>)}
                            </div>
                            <div className="form-floating mb-3">
                                <input type="number"
                                    name="quantityInStock"
                                    className="form-control" placeholder="quantityInStock"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.quantityInStock} />
                                <label className="darkText" >In Stock</label>
                                {formik.touched.quantityInStock && formik.errors.quantityInStock && (
                                    <small className="text-danger">{formik.errors.quantityInStock}</small>)}
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success w-50 mb-3" disabled={!formik.isValid || !formik.dirty}>Update card</button>
                </form>

                <button className="btn btn-primary col-md-3 mx-1 mb-3" onClick={clear}>Restore last saved</button>
                <NavLink to="/products" className="btn btn-danger col-md-3 mx-1 mb-3">Cancel</NavLink>

            </div>

        </>
    )
}

export default UpdateCard;
