import React, { useState } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import TokenOutlinedIcon from '@mui/icons-material/TokenOutlined';
import { MdOutlineEventNote } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { LuUserCheck } from "react-icons/lu";
import { MdOutlinePayments } from "react-icons/md";
import { LuFileKey2 } from "react-icons/lu";
import { LuSettings2 } from "react-icons/lu";
import { LuLogOut } from "react-icons/lu";
import { PiGraph } from "react-icons/pi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { LuArrowUpSquare } from "react-icons/lu";
import { GrDocumentExcel } from "react-icons/gr";
import { MdManageAccounts } from "react-icons/md";

import config from "../../config/config";


import { Link } from 'react-router-dom';

// import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi/";
import MenuIcon from '@mui/icons-material/Menu';

import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

function Sidebars() {
    //const { collapseSidebar } = useProSidebar();
    const [collapsed, setCollapsed] = useState(true);

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
                                    <img src={config.LOGO_PATH}  alt={config.COMPANY_NAME}/>
                                </div>
                            </MenuItem> 
                        )}
                    </Menu>

                    <Menu className="sidemenus noline">
                       
                        <SubMenu className="active" icon={<LuLayoutDashboard />} label="Dashboard">
                            <MenuItem className="sub_active" icon={<PiGraph />} component={<Link to="/analytics" />}> Analytics </MenuItem>
                        </SubMenu>
                        <div className="menulables">
                            <p>Master</p>
                        </div>
                        <MenuItem icon={<TokenOutlinedIcon />} component={<Link to="/projects" />} >  Project</MenuItem>
                        <div className="menulables">
                            <p>ATS</p>
                        </div>
                        <MenuItem icon={<MdOutlineEventNote />} component={<Link to="/ats" />} >  Application Tracking System</MenuItem>
                        <MenuItem icon={<MdManageAccounts />} component={<Link to="/assessment" />} >  ManageAssessment</MenuItem>
                        <div className="menulables">
                            <p>People</p>
                        </div>
                        <SubMenu className="" icon={<GoPeople />} label="People">
                            <MenuItem className="sub_active" icon={<FaArrowTrendUp />} component={<Link to="/employee-extension" />}> Extension </MenuItem>
                            <MenuItem className="sub_active" icon={<LuArrowUpSquare />} component={<Link to="/employee-appraisal" />}> Appraisal </MenuItem>
                            <MenuItem className="sub_active" icon={<GrDocumentExcel />} component={<Link to="/contract-closure" />}> Full & Final </MenuItem>
                        </SubMenu>
                        <MenuItem icon={<LuUserCheck />} component={<Link to="/attendance-index" />} > Attendance</MenuItem>
                        <MenuItem icon={<MdOutlinePayments />} component={<Link to="/payroll" />} > Payroll</MenuItem>
                        <MenuItem icon={<LuFileKey2 />} component={<Link to="/" />} >  Policies</MenuItem>
                        <MenuItem icon={<LuSettings2 />} component={<Link to="/" />} > Setting</MenuItem>
                        <MenuItem icon={<LuLogOut />} component={<Link to="/" />} > Logout</MenuItem>

                    </Menu>
                </main>
            </Sidebar>
        </>
    );
}
export default Sidebars;
