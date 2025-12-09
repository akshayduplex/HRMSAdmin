import React, { useEffect, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import userAvatarImg from "../../images/profile.png";
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import { IoIosMenu, IoIosSearch } from "react-icons/io";
import config from "../../config/config";

import { logout } from "../auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// using the the Custome Hookes to manges the size 
function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
}


function TopHeader() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showSidebar, setShowSidebar] = useState(false);
    const { width } = useWindowSize();

    const handleShowSidebar = () => {
        setShowSidebar(!showSidebar);
    }


    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <>
            {width < 768 ? (
                showSidebar && (
                    <DashboardSidebar
                        setShowSidebar={setShowSidebar}
                        showSidebar={showSidebar}
                    />
                )
            ) : (
                <DashboardSidebar />
            )}

            <div className="dflxbtwn_mob wd80 tophdr d-flex justify-content-end">
                <div className="mobmenu_txt">
                    <span onClick={handleShowSidebar}><IoIosMenu />
                    </span>
                    <h2>HRMS</h2>
                </div>
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