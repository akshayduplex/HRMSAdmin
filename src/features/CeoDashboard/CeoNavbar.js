import React from "react";
import { IoIosArrowRoundUp, IoIosSearch } from "react-icons/io";
import { Link, Navigate, useNavigate } from "react-router-dom";
import config from "../../config/config";
import { NavDropdown } from "react-bootstrap";
import { logout } from "../auth/authSlice";
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useDispatch } from "react-redux";
import userAvatarImg from "../../images/profile.png";
import { Form } from 'react-bootstrap'

const CeoNavbarComponent = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };



    return (
        <>

            <div className="w-100 mt-4 d-flex justify-content-end">
                {/* <div className="d-flex align-items-center position-absolute right-5">
                        <img  alt="logo" />
                </div> */}
                <div className="topdashhdr d-flex align-items-center">
                    <div className="searchbar">
                        <div className="srchbox">
                            <Form>
                                <Form.Group className="searchwrap" controlId="exampleForm.ControlInput1">
                                    <IoIosSearch />
                                    <Form.Control type="text" placeholder="Search" />
                                </Form.Group>
                            </Form>
                        </div>
                    </div>
                    <div className="notf_icn">
                        <NotificationsOutlinedIcon />
                    </div>
                    <div className="d-flex align-items-center hdrprof_menu">
                        <img src={userAvatarImg} alt={config.COMPANY_NAME} />
                        <NavDropdown title="" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#">
                                My Profile
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </div>
                </div>
            </div>

            <hr style={{ color: 'blue !important' }} />

        </>
    )
}


export default CeoNavbarComponent