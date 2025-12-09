
import React from "react";
import Sidebars from "./DashSidebar";
//import Dropdown from 'react-bootstrap/Dropdown';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import user from "../images/profile.png";
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import { Link ,useNavigate} from "react-router-dom";
import { IoIosSearch } from "react-icons/io";


function DashNav() {
const navigate=useNavigate()
    
    function handleLogout(){
        window.sessionStorage.removeItem('employeeLogin');
        localStorage.removeItem('employeeLogin')
        navigate('/login')
        window.location.reload()
    }


    return (
        <>
            <Sidebars />
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
                        <NotificationsOutlinedIcon/>
                        {/* <Dropdown>
                            <Dropdown.Toggle as={CustomToggle} className="notf_dropdown_toggle">
                                <NotificationsOutlinedIcon className="text-dark" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <div className="notificationbox">
                                    <div className="notf_list">
                                        <div className="notf_row">
                                            <p>You have <span>10</span> interviews schedule for today.</p>
                                            <span className="timedate">1 min ago</span>
                                        </div>
                                        <div className="notf_row">
                                            <p>Cloud watch 10:30 am interview is rescheduled.</p>
                                            <span className="timedate">1 min ago</span>
                                        </div>
                                        <div className="notf_row">
                                            <p>Sai Jaiswal 1st round interview request rejected by you.</p>
                                            <span className="timedate">1 min ago</span>
                                        </div>
                                        <div className="notf_row">
                                            <p>Sai Jaiswal 1st round interview request rejected by you.</p>
                                            <span className="timedate">1 min ago</span>
                                        </div>
                                    </div>
                                    <div className="clrall">
                                        <button>Clear All</button>
                                    </div>
                                </div>
                            </Dropdown.Menu>
                        </Dropdown> */}
                    </div>

                    <div className="d-flex align-items-center hdrprof_menu">
                        <img src={user} alt="userImg" />
                        <NavDropdown title="" id="basic-nav-dropdown" className="nav-dropdown">
                            <NavDropdown.Item>
                                <Link to="/profile" className="text-dark">My Profile</Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <Link className="text-dark" onClick={handleLogout}>Logout</Link>
                            </NavDropdown.Item>
                        </NavDropdown>


                    </div>
                </div>
            </div>
        </>
    );
}

export default DashNav;
