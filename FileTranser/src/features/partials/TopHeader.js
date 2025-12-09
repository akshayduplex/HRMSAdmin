import React from "react";
import DashboardSidebar from "./DashboardSidebar";
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'; 
import userAvatarImg from "../../images/profile.png";
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import { IoIosSearch } from "react-icons/io";
import config from "../../config/config";

import { logout } from "../auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function TopHeader() {
 const navigate = useNavigate();
 const dispatch = useDispatch();

 const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

    return (
        <>
            <DashboardSidebar />
            <div className="wd80 tophdr d-flex justify-content-end">
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
        </>
    );
}
export default TopHeader;