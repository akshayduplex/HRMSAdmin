import React, { useState } from "react";
import { HiOutlineDocumentText, HiOutlineUsers } from "react-icons/hi2";
import { FaUserCheck, FaUsersRectangle } from "react-icons/fa6";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import { useLocation } from "react-router-dom";

// import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi/";
import MenuIcon from '@mui/icons-material/Menu';

import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { AiOutlineCalendar } from "react-icons/ai";

function Sidebars() {
    //const { collapseSidebar } = useProSidebar();
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const [toggled, setToggled] = useState(false);

    const handleCollapsedChange = () => {
        setCollapsed(!collapsed);
    };

    const handleToggleSidebar = (value) => {
        setToggled(value);
    };

    return (
        <>
            <Sidebar className={`sitesidebar app ${toggled ? "toggled" : ""}`} style={{ height: "100%", position: "fixed" }} collapsed={collapsed} toggled={toggled}
                handleToggleSidebar={handleToggleSidebar} handleCollapsedChange={handleCollapsedChange}>
                <main>
                    <Menu className="sidelogobox">
                        {collapsed ? (<MenuItem icon={<MenuIcon />} onClick={handleCollapsedChange}></MenuItem>) : (
                            <MenuItem prefix={<MenuIcon />} onClick={handleCollapsedChange} >
                                <div className="dashlogo">
                                    <img src={logo} alt="logoImg"/>
                                </div>
                            </MenuItem>
                        )}
                    </Menu>
                    <Menu className="sidemenus">
                        {/* <MenuItem className={` ${location.pathname === '/upcoming' && "active"}`} icon={<FaUsersRectangle />} > <Link to="/upcoming"> Upcoming Interview</Link></MenuItem>
                        <MenuItem className={` ${location.pathname === '/today-interview' && "active"}`} icon={<HiOutlineUsers />} > <Link to="/today-interview"> Today Interview </Link></MenuItem> */}
                        <MenuItem className={` ${location.pathname === '/all-interview' && "active"}`} icon={<HiOutlineUsers />} > <Link to="/all-interview"> All Interview </Link></MenuItem>
                        <MenuItem className={` ${location.pathname === '/employee-reference' && "active"}`} icon={<FaUserCheck  />} > <Link to="/employee-reference"> Reference Check </Link></MenuItem>
                        <MenuItem className={` ${location.pathname === '/employee-mpr' && "active"}`} icon={<HiOutlineDocumentText />} > <Link to="/employee-mpr"> MPR Approval(s)  </Link></MenuItem>
                        <MenuItem className={` ${location.pathname === '/employee-approval' && "active"}`} icon={<HiOutlineDocumentText />} > <Link to="/employee-approval"> Approval Notes </Link></MenuItem>
                        {/* <MenuItem className={` ${location.pathname === '/employee-apply-leave' && "active"}`} icon={<AiOutlineCalendar  />} > <Link to="/employee-apply-leave"> My Attendance </Link></MenuItem> */}
                        <MenuItem className={` ${location.pathname === '/appointmentApproval' && "active"}`} icon={<AiOutlineCalendar  />} > <Link to="/appointmentApproval"> Appointment Approval </Link></MenuItem>
                    </Menu>
                </main>
            </Sidebar>
        </>
    );
}
export default Sidebars;
