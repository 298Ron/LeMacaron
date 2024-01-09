import { FunctionComponent, useEffect, useRef, useState } from "react";


import User from "../interfaces/User";
import { deleteUserById, getAllUsers, getUserByKey, updateUserRole } from "../services/usersService";
import { errorMsg, successMsg } from "../services/feedbacksService";


interface AdminPanel {
    userInfo: any;
    setUserInfo: Function;
}

const AdminPanel: FunctionComponent<AdminPanel> = ({ userInfo, setUserInfo }) => {
    const ref = useRef(null)

    let [allUsers, setAllUsers] = useState<User[]>([]);
    let render = () => setDataUpdated(!dataUpdated);
    let [dataUpdated, setDataUpdated] = useState<boolean>(false);
    let admins = ((userInfo.role >= 1))


    let changeRole = (specificUser: any) => {
        if (admins) {
            updateUserRole(specificUser).then((res) => {

                render()

                successMsg("User role changed!");
            }).catch((err) => console.log(err)
            )
        } else {
            errorMsg("You dont have permissions")
        }

    }
    useEffect(() => {
        getAllUsers()
            .then((res) => {
                setAllUsers((res.data))

            }
            )
            .catch((error) => console.log(error))
    }, [dataUpdated]);

    let searchSystem = (some: any) => {
        if (some.length > 0) {
            getUserByKey(some)
                .then((res) => {

                    setAllUsers(res.data)
                })
                .catch((err) => {
                    console.log(err);
                })
        } else if (some.length === 0) {
            getAllUsers()
                .then((res) => {
                    setAllUsers(res.data)

                })
                .catch((err) => console.log(err));
        }

    }
    let findKey: any = ((ref.current as any))

    let deleteSpecificUser = (usr: User) => {
        if (window.confirm("Are you sure?") === true) {
            deleteUserById(usr._id as any)
                .then((res) => {

                    successMsg("User deleted successfully!");
                    render();

                })
                .catch((err) => console.log(err)
                )
        }

    }



    return (
        <>


            <div className="container my-2 adminPanel animationLeftSlide" style={{ textAlign: "start", minHeight: "75vh", fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem" }} >
                <h3 className="display-5 mb-5 p-4 border-dark border-bottom" style={{ textAlign: "center" }}>ADMIN PANEL</h3>

                <div className="form-floating mb-3" style={{ margin: "0 auto", width: "60vw" }}>
                    <input type="text"
                        name="image"
                        className="form-control text-dark "
                        placeholder="Search"
                        ref={ref}

                        onChange={() => searchSystem(findKey.value)}
                    />
                    <label className="text-dark " style={{ fontSize: "1rem" }} >Search user</label>
                </div>
                <div className="row m-4" style={{ rowGap: "20px", columnGap: "1px" }} >

                    {allUsers?.map((user: User, index: number) => (

                        <div className="col-md-3 card shadow  animationLeftSlide " key={index} style={{ margin: "0 auto" }} >
                            <div className="card-body ">

                                <h6>Name: <span className="fw-bold ms-1">{user.firstName} {user.lastName}</span></h6>
                                <h6>Email: <span className="fw-bold ms-1">{user.email}</span></h6>
                                <h6>Phone: <span className="fw-bold ms-1">{user.phone}</span></h6>
                                <h6>Role: <span className="fw-bold ms-1"> {user.role == 0 ? (`Is User`) : ((user.role == 1) ? (`Is Admin`) : (`is Super Admin`))} {`[ Type: ${user.role}]`}</span></h6>

                                {((user.role as any) > 1) ? (<></>) : ((userInfo.role > 1) && (<button className="btn btn2"
                                    onClick={() => {
                                        changeRole(user);

                                    }

                                    }>Change role</button>))}
                                {((user.role as any > 1)) ? (<></>) : ((userInfo.role > 1) && (<button className="btn bg-danger ms-1 my-1 btn-dark"
                                    onClick={() => {
                                        deleteSpecificUser(user);

                                    }

                                    }>Delete user</button>))}



                            </div>

                        </div>





                    ))}
                </div>







            </div>



        </>
    )
}

export default AdminPanel;