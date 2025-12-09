import React, { useEffect, useMemo, useRef, useState } from "react";
import { LuFileStack, LuLayoutDashboard } from "react-icons/lu";
import TokenOutlinedIcon from '@mui/icons-material/TokenOutlined';
import { MdCurrencyExchange, MdOutlineEventNote, MdSettings } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { LuUserCheck } from "react-icons/lu";
import { MdOutlinePayments } from "react-icons/md";
import { LuFileKey2 } from "react-icons/lu";
import { LuLogOut } from "react-icons/lu";
import { PiGraph, PiIdentificationBadgeDuotone } from "react-icons/pi";
import { FaArrowTrendUp, FaElementor, FaSheetPlastic } from "react-icons/fa6";
// import { LuArrowUpSquare } from "react-icons/lu";
import { LuArrowUp } from "react-icons/lu";

import { GrDocumentExcel } from "react-icons/gr";
import { MdManageAccounts } from "react-icons/md";
import { MdSpatialTracking } from "react-icons/md";
import { GoProjectRoadmap } from "react-icons/go";
import { FaLocationDot } from "react-icons/fa6";
import { TbTemplate, TbTimeDurationOff } from "react-icons/tb";
import { GiDuration } from "react-icons/gi";
import { FaPersonBreastfeeding } from "react-icons/fa6";
import { MdSpatialAudioOff } from "react-icons/md";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { MdRealEstateAgent } from "react-icons/md";
import { SiPrivatedivision } from "react-icons/si";
import { CgPathDivide } from "react-icons/cg";
import { CiBank, CiDesktop } from "react-icons/ci";
import { PiTrainRegionalFill } from "react-icons/pi";
import { CgDisplayGrid } from "react-icons/cg";
import { MdSensorOccupied } from "react-icons/md";
import { FaTags } from "react-icons/fa6";
import { MdCastForEducation } from "react-icons/md";
import { MdAddLocationAlt } from "react-icons/md";
import { TbBrandMastercard } from "react-icons/tb";
import { FaBehanceSquare, FaWpforms } from "react-icons/fa";
import { MdHolidayVillage } from "react-icons/md";
import { SiPayloadcms } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import { FaCalendarDays } from "react-icons/fa6";
import { FaExchangeAlt } from "react-icons/fa";
import { IoIosPersonAdd } from "react-icons/io";
import { FaUser } from 'react-icons/fa';
import config from "../../config/config";
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { RiMailSettingsLine } from "react-icons/ri";
import { AiOutlineForm } from "react-icons/ai";


function Sidebars({ setShowSidebar, showSidebar }) {
    const [collapsed, setCollapsed] = useState(false);
    const [toggled, setToggled] = useState(false);
    const navigation = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const activeItemRef = useRef(null); // Ref for the active menu item

    // Scroll to the active menu item on route change
    useEffect(() => {
        if (activeItemRef.current) {
            activeItemRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [location.pathname]); // Runs whenever the route changes



    // Retrieve user from localStorage
    const LoggedUser = useMemo(() => {
        const user = localStorage.getItem("admin_role_user");
        try {
            return JSON.parse(user) || {};
        } catch (e) {
            console.error("Invalid user data in localStorage");
            return {};
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth > 768) {
            const savedState = JSON.parse(localStorage.getItem("sidebar_state")) || {};
            setCollapsed(savedState.collapsed ?? false); // Default to open
            setToggled(savedState.toggled ?? false);
        }
    }, []);

    // Handle sidebar collapse
    const handleCollapsedChange = () => {
        const newCollapsed = !collapsed;
        if (window.innerWidth < 768) {
            setShowSidebar(!showSidebar)
            setCollapsed(newCollapsed);
        }
        if (window.innerWidth > 768) {
            setCollapsed(newCollapsed);
            localStorage.setItem("sidebar_state", JSON.stringify({ collapsed: newCollapsed, toggled }));
        }
    };

    // Handle sidebar toggle
    const handleToggleSidebar = (value) => {
        setToggled(value);
        localStorage.setItem("sidebar_state", JSON.stringify({ collapsed, toggled: value }));
    };

    // Handle logout with confirmation
    const handleLogOut = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem("admin_role_user");
            navigation("/login");
        }
    };


    return (
        <>
            <Sidebar className={`sitesidebar app ${toggled ? "toggled" : ""}`} style={{ height: "100%", position: "fixed" }} collapsed={collapsed} toggled={toggled}
                handleToggleSidebar={handleToggleSidebar} handleCollapsedChange={handleCollapsedChange} // Attach ref to sidebar
            // Capture scroll events
            >
                <main>
                    <Menu className="sidelogobox">
                        {collapsed ? (<MenuItem icon={<MenuIcon />} onClick={handleCollapsedChange}></MenuItem>) : (
                            <MenuItem prefix={<MenuIcon />} onClick={handleCollapsedChange} >
                                <div className="dashlogo">
                                    <img src={config.LOGO_PATH} alt={config.COMPANY_NAME} />
                                </div>
                            </MenuItem>
                        )}
                    </Menu>

                    {/* And So Mani Menues */}

                    <Menu className="sidemenus noline" >

                        {/* DashBoard Validation */}

                        <SubMenu className={(location.pathname === "/dashboard" || location.pathname === "/analytics") && "active"} icon={<LuLayoutDashboard />} component={<Link to="/dashboard" />} label="Dashboard">
                            <MenuItem className={location.pathname === "/dashboard" ? "active" : 'sub_active'} icon={<LuLayoutDashboard />} component={<Link to="/dashboard" />} onClick={() => {
                                if (window.innerWidth < 768) {
                                    setShowSidebar(!showSidebar)
                                }
                            }}> Dashboard </MenuItem>

                            <MenuItem className={location.pathname === "/analytics" ? "active" : 'sub_active'} icon={<PiGraph />} component={<Link to="/analytics" />} onClick={() => {
                                if (window.innerWidth < 768) {
                                    setShowSidebar(!showSidebar)
                                }
                            }}> Analytics </MenuItem>
                        </SubMenu>
                        {/* 
                        {
                            LoggedUser?.permissions?.find(permission => permission.slug === 'dashboard') ?
                                (
                                    <>
                                        <SubMenu className="active" icon={<LuLayoutDashboard />} component={<Link to="/dashboard" />} label="Dashboard">
                                            <MenuItem className="sub_active" icon={<LuLayoutDashboard />} component={<Link to="/dashboard" />}> Dashboard </MenuItem>
                                            {
                                                LoggedUser?.permissions?.find(permission => permission.slug === 'analytics')
                                                &&
                                                <MenuItem className="" icon={<PiGraph />} component={<Link to="/analytics" />}> Analytics </MenuItem>
                                            }
                                        </SubMenu>
                                    </>
                                )
                                : null
                        } */}

                        {/* Commented The All Code Form Now Only in Development Propose to show the Commented Data From the URL */}
                        {/* {
                            (LoggedUser?.permissions?.find(permission => permission.slug === 'setting') && LoggedUser?.permissions?.find(permission => permission.slug === 'People')) &&
                            <MenuItem icon={<LuSettings2 />} component={<Link to="/setting" />} > Setting</MenuItem>
                        } */}

                        {/* Ceo sir Desk */}

                        {
                            LoggedUser?.permissions?.find(permission => permission.slug === 'ceo-desk') ?
                                (
                                    <>
                                        <div className="menulables">
                                            <p>CEO SIR Desk</p>
                                        </div>
                                        {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'ceo-desk') &&
                                            <MenuItem ref={location.pathname === "/ceo-desk" ? activeItemRef : null} className={(location.pathname === "/ceo-desk" || location.pathname === "/ceo-mpr-list" || location.pathname === "/ceo-approval-note") && "active"} icon={<CiDesktop />} component={<Link to="/ceo-desk" />} onClick={() => {
                                                if (window.innerWidth < 768) {
                                                    setShowSidebar(!showSidebar)
                                                }
                                            }} >  CEO DESK </MenuItem>
                                        }
                                    </>
                                )
                                : null
                        }


                        {
                            LoggedUser?.permissions?.find(permission => permission.slug === 'hod-desk') ?
                                (
                                    <>
                                        <div className="menulables">
                                            <p>HOD SIR Desk</p>
                                        </div>
                                        {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'hod-desk') &&
                                            <MenuItem ref={location.pathname === "/hod-desk" ? activeItemRef : null} className={(location.pathname === "/hod-desk" || location.pathname === "/hod-mpr-list" || location.pathname === "/hod-approval-note" || location.pathname === "/appointment-approval-hod" ) && "active"} icon={<CiDesktop />} component={<Link to="/hod-desk" />} onClick={() => {
                                                if (window.innerWidth < 768) {
                                                    setShowSidebar(!showSidebar)
                                                }
                                            }} >  HOD DESK </MenuItem>
                                        }
                                    </>
                                )
                                : null
                        }



                        {/* Master Nav Page--------------******************************* */}


                        {
                            LoggedUser?.permissions?.find(permission => permission.slug === 'projects') ?
                                (
                                    <>
                                        <div className="menulables">
                                            <p>Master</p>
                                        </div>
                                        {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'projects') &&
                                            <MenuItem ref={location.pathname === "/projects" ? activeItemRef : null} className={(location.pathname === "/projects" || location.pathname === "/add-project" || location.pathname === "/close-project") && "active"} icon={<TokenOutlinedIcon />} component={<Link to="/projects" />} onClick={() => {
                                                if (window.innerWidth < 768) {
                                                    setShowSidebar(!showSidebar)
                                                }
                                            }}>  Project </MenuItem>
                                        }
                                    </>
                                )
                                : null
                        }

                        {/* ATS Menu List Option */}

                        {
                            LoggedUser?.permissions?.find(permission => permission.slug === 'ats') ?
                                (
                                    <>
                                        <div className="menulables">
                                            <p>ATS</p>
                                        </div>
                                        {/* Ats Menu Access Role */}
                                        {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'ats')
                                            &&
                                            <MenuItem ref={location.pathname === "/ats" ? activeItemRef : null} className={(location.pathname === "/ats" || location.pathname === "/candidate-listing" || location.pathname?.includes("/candidate-profile") || location.pathname === "/create-job" || location.pathname?.includes('/job-cards-details') || location.pathname?.includes('/job-details') || location.pathname?.includes("/schedule-interview")) && "active"} icon={<MdOutlineEventNote />} component={<Link to="/ats" />} onClick={() => {
                                                if (window.innerWidth < 768) {
                                                    setShowSidebar(!showSidebar)
                                                }
                                            }} >  Application Tracking System</MenuItem>
                                        }

                                        {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'ats')
                                            &&
                                            <MenuItem ref={location.pathname === "/ats" ? activeItemRef : null} className={(location.pathname === "/job-list"  ) && "active"} icon={<LuFileStack  />} component={<Link to="/job-list" />} onClick={() => {
                                                if (window.innerWidth < 768) {
                                                    setShowSidebar(!showSidebar)
                                                }
                                            }} >  All Jobs </MenuItem>
                                        }

                                        {/* Assign The Assessment Managment Assign Task  */}
                                        {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'ats')
                                            &&
                                            <MenuItem ref={location.pathname === "/score-comparison-sheet" ? activeItemRef : null} className={(location.pathname === "/score-comparison-sheet" || location.pathname === "/score-comparison-sheet") && "active"} icon={<FaSheetPlastic />} component={<Link to="/score-comparison-sheet" />} onClick={() => {
                                                if (window.innerWidth < 768) {
                                                    setShowSidebar(!showSidebar)
                                                }
                                            }} >Score Sheet</MenuItem>
                                        }
                                        {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'ats')
                                            &&
                                            <MenuItem ref={location.pathname === "/appointment-approval" ? activeItemRef : null} className={(location.pathname === "/appointment-approval" || location.pathname === "/appointment-approval") && "active"} icon={<FaSheetPlastic />} component={<Link to="/appointment-approval" />} onClick={() => {
                                                if (window.innerWidth < 768) {
                                                    setShowSidebar(!showSidebar)
                                                }
                                            }} >Appointment Approval</MenuItem>
                                        }
                                        {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'assessment')
                                            &&
                                            <MenuItem ref={location.pathname === "/assessment" ? activeItemRef : null} className={(location.pathname === "/assessment" || location.pathname === "/assessment-list") && "active"} icon={<MdManageAccounts />} component={<Link to="/assessment" />} onClick={() => {
                                                if (window.innerWidth < 768) {
                                                    setShowSidebar(!showSidebar)
                                                }
                                            }} >Manage Assessment</MenuItem>
                                        }
                                    </>
                                ) : null
                        }

                        {/* Analytics Menu Ats Tracker */}

                        {
                            LoggedUser?.permissions?.find(permission => permission.slug === 'analytics') ?
                                (
                                    <>
                                        <div className="menulables">
                                            <p>Analytic Trackers</p>
                                        </div>

                                        {/* Analytics Menu Dashboard */}
                                        {/* Employee Tracker Charge */}
                                        {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'employementtracker')
                                            &&
                                            <MenuItem ref={location.pathname === "/employementtracker" ? activeItemRef : null} className={location.pathname === "/employementtracker" && "active"} icon={<MdSpatialTracking />} component={<Link to="/employementtracker" />} onClick={() => {
                                                if (window.innerWidth < 768) {
                                                    setShowSidebar(!showSidebar)
                                                }
                                            }}> Employment Tracker </MenuItem>
                                        }
                                        {/* ATS Tracker */}
                                        {/* {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'ats')
                                            &&
                                            <MenuItem className={location.pathname === "/ats" && "active"} icon={<MdOutlineEventNote />} component={<Link to="/ats" />}> Job (ATS) Tracker </MenuItem>
                                        } */}
                                        {/* Project Tracker */}
                                        {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'project-tracker')
                                            &&
                                            <MenuItem ref={location.pathname === "/project-tracker" ? activeItemRef : null} className={location.pathname === "/project-tracker" && "active"} icon={<GoProjectRoadmap />} component={<Link to="/project-tracker" />} onClick={() => {
                                                if (window.innerWidth < 768) {
                                                    setShowSidebar(!showSidebar)
                                                }
                                            }}> Project Tracker </MenuItem>
                                        }
                                        {/* alumni Tracker */}
                                        {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'employee-alumni-tracker')
                                            &&
                                            <MenuItem ref={location.pathname === "/employee-alumni-tracker" ? activeItemRef : null} className={location.pathname === "/employee-alumni-tracker" && "active"} icon={<GoProjectRoadmap />} component={<Link to="/employee-alumni-tracker" />} onClick={() => {
                                                if (window.innerWidth < 768) {
                                                    setShowSidebar(!showSidebar)
                                                }
                                            }}> Employee Alumni Tracker </MenuItem>
                                        }
                                    </>
                                ) : null
                        }

                        {/* Manpower Requisition Form */}

                        {
                            LoggedUser?.permissions?.find(permission => permission.slug === 'manpower-acquisition') ?
                                (
                                    <>
                                        <div className="menulables">
                                            <p>Manpower Requisition Form</p>
                                        </div>

                                        {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'manpower-acquisition') &&
                                            <MenuItem ref={location.pathname === "/manpower-acquisition" ? activeItemRef : null} className={location.pathname === "/manpower-acquisition" && "active"} icon={<IoIosPersonAdd />} component={<Link to="/manpower-acquisition" />} onClick={() => {
                                                if (window.innerWidth < 768) {
                                                    setShowSidebar(!showSidebar)
                                                }
                                            }}> Add From  </MenuItem>
                                        }
                                        {/* List of ManPower Acquisition Form */}

                                        {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'manpower-acquisition-list') &&
                                            <MenuItem ref={location.pathname === "/manpower-acquisition-list" ? activeItemRef : null} className={location.pathname === "/manpower-acquisition-list" && "active"} icon={<MdOutlineEventNote />} component={<Link to="/manpower-acquisition-list" />} onClick={() => {
                                                if (window.innerWidth < 768) {
                                                    setShowSidebar(!showSidebar)
                                                }
                                            }}> List of Froms </MenuItem>
                                        }
                                    </>
                                ) : null
                        }

                        {
                            LoggedUser?.permissions?.find(permission => permission.slug === 'assets-managment') ?
                                (
                                    <>
                                        <div className="menulables">
                                            <p>Assets Managment</p>
                                        </div>

                                        {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'assets-managment') &&
                                            <MenuItem ref={location.pathname === "/assets-managment" ? activeItemRef : null} className={location.pathname === "/assets-managment" && "active"} icon={<FaElementor />} component={<Link to="/assets-managment" />} onClick={() => {
                                                if (window.innerWidth < 768) {
                                                    setShowSidebar(!showSidebar)
                                                }
                                            }}> Assets Listing  </MenuItem>

                                        }
                                        {/* List of ManPower Acquisition Form */}
                                        <MenuItem ref={location.pathname === "/assets-master" ? activeItemRef : null} className={location.pathname === "/assets-master" && "active"} icon={<FaElementor />} component={<Link to="/assets-master" />} onClick={() => {
                                            if (window.innerWidth < 768) {
                                                setShowSidebar(!showSidebar)
                                            }
                                        }}>Add Assets Type</MenuItem>


                                        {/* {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'manpower-acquisition-list') &&
                                            <MenuItem ref={location.pathname === "/manpower-acquisition-list" ? activeItemRef : null} className={location.pathname === "/manpower-acquisition-list" && "active"} icon={<MdOutlineEventNote />} component={<Link to="/manpower-acquisition-list" />}> List of Froms </MenuItem>
                                        } */}
                                    </>
                                ) : null
                        }


                        {/* People List Menu */}

                        {
                            LoggedUser?.permissions?.find(permission => permission.slug === 'People') ?
                                (
                                    <>
                                        <div className="menulables">
                                            <p>People</p>
                                        </div>
                                        {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'People') &&
                                            // manage Here People sub Menu
                                            <SubMenu className={(location.pathname === "/employee-extension" || location.pathname === "/employee-appraisal" || location.pathname === "/contract-closure" || location.pathname === "/employee-list" || location.pathname === "/people-profile" || location.pathname === "/candidate-detail") && "active"} icon={<GoPeople />} label="People">
                                                {
                                                    (LoggedUser?.permissions?.find(permission => permission.slug === 'employee-extension') && LoggedUser?.permissions?.find(permission => permission.slug === 'People')) &&
                                                    <MenuItem ref={location.pathname === "/employee-extension" ? activeItemRef : null} className={location.pathname === "/employee-extension" ? "active" : 'sub_active'} icon={<FaArrowTrendUp />} component={<Link to="/employee-extension" />} onClick={() => {
                                                        if (window.innerWidth < 768) {
                                                            setShowSidebar(!showSidebar)
                                                        }
                                                    }}> Extension </MenuItem>
                                                }
                                                {
                                                    (LoggedUser?.permissions?.find(permission => permission.slug === 'employee-appraisal') && LoggedUser?.permissions?.find(permission => permission.slug === 'People')) &&
                                                    <MenuItem ref={location.pathname === "/employee-appraisal" ? activeItemRef : null} className={location.pathname === "/employee-appraisal" || (location.pathname === "/employee-list" && searchParams.get('type') === 'appraisalDue') ? "active" : 'sub_active'} icon={<LuArrowUp />} component={<Link to="/employee-appraisal" />} onClick={() => {
                                                        if (window.innerWidth < 768) {
                                                            setShowSidebar(!showSidebar)
                                                        }
                                                    }}> Appraisal </MenuItem>
                                                }
                                                {
                                                    (LoggedUser?.permissions?.find(permission => permission.slug === 'contract-closure') && LoggedUser?.permissions?.find(permission => permission.slug === 'People')) &&
                                                    <MenuItem ref={location.pathname === "/contract-closure" ? activeItemRef : null} className={location.pathname === "/contract-closure" ? "active" : 'sub_active'} icon={<GrDocumentExcel />} component={<Link to="/contract-closure" />} onClick={() => {
                                                        if (window.innerWidth < 768) {
                                                            setShowSidebar(!showSidebar)
                                                        }
                                                    }}> Full & Final </MenuItem>
                                                }
                                                {
                                                    (LoggedUser?.permissions?.find(permission => permission.slug === 'employee-list') && LoggedUser?.permissions?.find(permission => permission.slug === 'People')) &&
                                                    <MenuItem ref={location.pathname === "/employee-list" ? activeItemRef : null} className={(location.pathname === "/employee-list" && searchParams.get('type') !== 'appraisalDue') ? "active" : 'sub_active'} icon={<GoPeople />} component={<Link to="/employee-list" />} onClick={() => {
                                                        if (window.innerWidth < 768) {
                                                            setShowSidebar(!showSidebar)
                                                        }
                                                    }}> People </MenuItem>
                                                }
                                            </SubMenu>
                                        }
                                        {
                                            (LoggedUser?.permissions?.find(permission => permission.slug === 'attendance-index') && LoggedUser?.permissions?.find(permission => permission.slug === 'People')) &&
                                            <MenuItem
                                                ref={location.pathname === "/attendance-index" ? activeItemRef : null}
                                                className={(location.pathname === "/attendance-index" || location.pathname === "/time-sheet") && "active"} icon={<LuUserCheck />} component={<Link to="/attendance-index" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }} > Attendance
                                            </MenuItem>
                                        }
                                        {
                                            (LoggedUser?.permissions?.find(permission => permission.slug === 'payroll') && LoggedUser?.permissions?.find(permission => permission.slug === 'People')) &&
                                            <MenuItem ref={location.pathname === "/payroll" ? activeItemRef : null} className={location.pathname === "/payroll" && "active"} icon={<MdOutlinePayments />} component={<Link to="/payroll" />} onClick={() => {
                                                if (window.innerWidth < 768) {
                                                    setShowSidebar(!showSidebar)
                                                }
                                            }} > Payroll</MenuItem>
                                        }
                                        {
                                            (LoggedUser?.permissions?.find(permission => permission.slug === 'policy') && LoggedUser?.permissions?.find(permission => permission.slug === 'People')) &&
                                            <MenuItem
                                                ref={location.pathname === "/policy" ? activeItemRef : null}
                                                className={location.pathname === "/policy" && "active"} icon={<LuFileKey2 />} component={<Link to="/policy" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }} >  Policies</MenuItem>
                                        }
                                    </>
                                ) : null
                        }

                        {
                            LoggedUser?.permissions?.find(permission => permission.slug === 'role-users') ?
                                (
                                    <>
                                        <div className="menulables">
                                            <p>Role Users</p>
                                        </div>
                                        {
                                            (LoggedUser?.permissions?.find(permission => permission.slug === 'add-role-user') && LoggedUser?.permissions?.find(permission => permission.slug === 'role-users')) &&
                                            <MenuItem ref={location.pathname === "/add-role-user" ? activeItemRef : null} className={location.pathname === "/add-role-user" && "active"} icon={<FaUser />} component={<Link to="/add-role-user" />}
                                                onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}
                                            > Add Role User </MenuItem>
                                        }
                                        {
                                            (LoggedUser?.permissions?.find(permission => permission.slug === 'role-users-list') && LoggedUser?.permissions?.find(permission => permission.slug === 'role-users')) &&
                                            <MenuItem
                                                ref={location.pathname === "/role-users-list" ? activeItemRef : null}
                                                className={location.pathname === "/role-users-list" && "active"} icon={<MdManageAccounts />} component={<Link to="/role-users-list" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }} > List Of Role Users </MenuItem>
                                        }
                                    </>
                                ) : null
                        }
                        {
                            LoggedUser?.permissions?.find(permission => permission.slug === 'setting') ?
                                (
                                    <>
                                        <div className="menulables">
                                            <p>Settings</p>
                                        </div>
                                        <MenuItem ref={location.pathname === "/system-settings" ? activeItemRef : null} className={location.pathname === "/system-settings" && "active"} icon={<MdSettings />} component={<Link to="/system-settings" />} onClick={() => {
                                            if (window.innerWidth < 768) {
                                                setShowSidebar(!showSidebar)
                                            }
                                        }} > System Settings </MenuItem>

                                        <MenuItem ref={location.pathname === "/template-settings" ? activeItemRef : null} className={location.pathname === "/template-settings" && "active"} icon={<TbTemplate />} component={<Link to="/template-settings" />} onClick={() => {
                                            if (window.innerWidth < 768) {
                                                setShowSidebar(!showSidebar)
                                            }
                                        }} > Template Settings </MenuItem>

                                    </>
                                ) : null
                        }

                        {/* <MenuItem ref={location.pathname === "/system-settings" ? activeItemRef : null} className={location.pathname === "/system-settings" && "active"} icon={<MdSettings />} component={<Link to="/system-settings" />} > System Settings </MenuItem> */}
                        {/* <MenuItem icon={<RiMailSettingsLine /> } component={<Link to="/add-role-user" />} > SMTP Mail Setting </MenuItem>
                        <MenuItem icon={<RiMailSettingsLine /> } component={<Link to="/add-role-user" />} > Google Places API Setting </MenuItem>
                        <MenuItem icon={<RiMailSettingsLine /> } component={<Link to="/add-role-user" />} > Support Setting </MenuItem>
                        <MenuItem icon={<RiMailSettingsLine /> } component={<Link to="/add-role-user" />} > Address Setting </MenuItem> */}
                        {/* {

                        } */}



                        {
                            LoggedUser?.permissions?.find(permission => permission.slug === 'master') ?
                                (
                                    <>
                                        <div className="menulables">
                                            <p>All Master</p>
                                        </div>
                                        {/* Add Location */}
                                        {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'add-location' && 'master') &&
                                            <SubMenu className={location.pathname === "/add-location" && "active"} icon={<FaLocationDot />} label="Location">
                                                <MenuItem className="sub_active" icon={<MdAddLocationAlt />} component={<Link to="/add-location" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}> Add Location </MenuItem>
                                            </SubMenu>
                                        }
                                        {/* Add Designation */}
                                        {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'add-designation' && 'master') &&
                                            <SubMenu className={location.pathname === "/add-designation" && "active"} icon={<TbBrandMastercard />} label="Designation">
                                                <MenuItem className="sub_active" icon={<FaArrowTrendUp />} component={<Link to="/add-designation" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}> Add Designation</MenuItem>
                                            </SubMenu>
                                        }
                                        {/* Add Duration */}
                                        {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'duration' && 'master') &&
                                            <SubMenu className={location.pathname === "/duration" && "active"} icon={<TbTimeDurationOff />} label="Duration">
                                                <MenuItem className="sub_active" icon={<GiDuration />} component={<Link to="/duration" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}>Duration</MenuItem>
                                            </SubMenu>
                                        }
                                        {/* Add Department */}
                                        {
                                            LoggedUser?.permissions?.find(permission => permission.slug === 'department' && 'master') &&
                                            <SubMenu className={location.pathname === "/department" && "active"} icon={<FaPersonBreastfeeding />} label="Department">
                                                <MenuItem className="sub_active" icon={<MdSpatialAudioOff />} component={<Link to="/department" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}>Department</MenuItem>
                                            </SubMenu>
                                        }
                                        {/* Add State */}
                                        {
                                            LoggedUser?.permissions?.some(permission => permission?.slug === 'state' && 'master') &&
                                            <SubMenu className={location.pathname === "/state" && "active"} icon={<MdOutlineRealEstateAgent />} label="State">
                                                <MenuItem className="sub_active" icon={<MdRealEstateAgent />} component={<Link to="/state" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}>State</MenuItem>
                                            </SubMenu>
                                        }
                                        {/* Add Division */}
                                        {
                                            LoggedUser?.permissions?.some(permission => permission?.slug === 'division' && 'master') &&
                                            <SubMenu className={location.pathname === "/division" && "active"} icon={<SiPrivatedivision />} label="Division">
                                                <MenuItem className="sub_active" icon={<CgPathDivide />} component={<Link to="/division" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}>Division</MenuItem>
                                            </SubMenu>
                                        }
                                        {
                                            LoggedUser?.permissions?.some(permission => permission?.slug === 'division' && 'master') &&
                                            <SubMenu className={location.pathname === "/applied-from" && "active"} icon={<AiOutlineForm />} label="Applied From">
                                                <MenuItem className="sub_active" icon={<AiOutlineForm />} component={<Link to="/applied-from" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}>Applied From</MenuItem>
                                            </SubMenu>
                                        }
                                        {/* Add Bank  */}
                                        {
                                            LoggedUser?.permissions?.some(permission => permission?.slug === 'bank' && 'master') &&
                                            <SubMenu className={location.pathname === "/bank" && "active"} icon={<CiBank />} label="Bank">
                                                <MenuItem className="sub_active" icon={<CiBank />} component={<Link to="/bank" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}>Bank</MenuItem>
                                            </SubMenu>
                                        }
                                        {/* Add Region */}
                                        {
                                            LoggedUser?.permissions?.some(permission => permission?.slug === 'region' && 'master') &&
                                            <SubMenu className={location.pathname === "/region" && "active"} icon={<PiTrainRegionalFill />} label="Region">
                                                <MenuItem className="sub_active" icon={<PiTrainRegionalFill />} component={<Link to="/region" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}>Region</MenuItem>
                                            </SubMenu>
                                        }
                                        {/* Add Dispensary */}
                                        {
                                            LoggedUser?.permissions?.some(permission => permission?.slug === 'dispensary' && 'master') &&
                                            <SubMenu className={location.pathname === "/dispensary" && "active"} icon={<CgDisplayGrid />} label="Dispensary">
                                                <MenuItem className="sub_active" icon={<CgDisplayGrid />} component={<Link to="/dispensary" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}>Dispensary</MenuItem>
                                            </SubMenu>
                                        }
                                        {/* Add Occupations */}
                                        {
                                            LoggedUser?.permissions?.some(permission => permission?.slug === 'occupation' && 'master') &&
                                            <SubMenu className={location.pathname === "/occupation" && "active"} icon={<MdSensorOccupied />} label="Occupation">
                                                <MenuItem className="sub_active" icon={<MdSensorOccupied />} component={<Link to="/occupation" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}>Occupation</MenuItem>
                                            </SubMenu>
                                        }
                                        {/*  Add Tags  */}
                                        {
                                            LoggedUser?.permissions?.some(permission => permission?.slug === 'tags' && 'master') &&
                                            <SubMenu className={location.pathname === "/tags" && "active"} icon={<FaTags />} label="Tags">
                                                <MenuItem className="sub_active" icon={<FaTags />} component={<Link to="/tags" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}>Tags</MenuItem>
                                            </SubMenu>

                                        }
                                        {/* Add Eudcation */}
                                        {
                                            LoggedUser?.permissions?.some(permission => permission?.slug === 'education' && 'master') &&
                                            <SubMenu className={location.pathname === "/education" && "active"} icon={<MdCastForEducation />} label="Education">
                                                <MenuItem className="sub_active" icon={<MdCastForEducation />} component={<Link to="/education" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}>Education</MenuItem>
                                            </SubMenu>
                                        }
                                        {/* Add Benifits */}
                                        {
                                            LoggedUser?.permissions?.some(permission => permission?.slug === 'benefits' && 'master') &&
                                            <SubMenu className={location.pathname === "/benefits" && "active"} icon={<FaBehanceSquare />} label="Benefits">
                                                <MenuItem className="sub_active" icon={<FaBehanceSquare />} component={<Link to="/benefits" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}>Benefits</MenuItem>
                                            </SubMenu>
                                        }
                                        {/* Add Holiday */}
                                        {
                                            LoggedUser?.permissions?.some(permission => permission?.slug === 'holiday' && 'master') &&
                                            <SubMenu className={location.pathname === "/holiday" && "active"} icon={<MdHolidayVillage />} label="Holiday">
                                                <MenuItem className="sub_active" icon={<MdHolidayVillage />} component={<Link to="/holiday" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}>Holiday</MenuItem>
                                            </SubMenu>
                                        }
                                        {/* Add Cms */}
                                        {
                                            LoggedUser?.permissions?.some(permission => permission?.slug === 'cms' && 'master') &&
                                            <SubMenu className={location.pathname === "/cms" && "active"} icon={<SiPayloadcms />} label="Cms">
                                                <MenuItem className="sub_active" icon={<SiPayloadcms />} component={<Link to="/cms" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}>Cms</MenuItem>
                                            </SubMenu>
                                        }
                                        {/* Add SalaryRange */}
                                        {
                                            LoggedUser?.permissions?.some(permission => permission?.slug === 'salary-range' && 'master') &&
                                            <SubMenu className={location.pathname === "/salary-range" && "active"} icon={<FaSackDollar />} label="SalaryRange">
                                                <MenuItem className="sub_active" icon={<FaSackDollar />} component={<Link to="/salary-range" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}>Salary Range</MenuItem>
                                            </SubMenu>
                                        }
                                        {/* Add Leave Category */}
                                        {
                                            LoggedUser?.permissions?.some(permission => permission?.slug === 'leave' && 'master') &&
                                            <SubMenu className={location.pathname === "/leave" && "active"} icon={<FaCalendarDays />} label="Leave">
                                                <MenuItem className="sub_active" icon={<FaCalendarDays />} component={<Link to="/leave" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}>Leave</MenuItem>
                                            </SubMenu>
                                        }
                                        {/* Add Grade list */}
                                        {
                                            LoggedUser?.permissions?.some(permission => permission?.slug === 'gradelist' && 'master') &&
                                            <SubMenu className={location.pathname === "/gradelist" && "active"} icon={<FaExchangeAlt />} label="GradeList">
                                                <MenuItem className="sub_active" icon={<FaExchangeAlt />} component={<Link to="/gradelist" />} onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        setShowSidebar(!showSidebar)
                                                    }
                                                }}>GradeList</MenuItem>
                                            </SubMenu>
                                        }

                                        <SubMenu className={location.pathname === "/currency" && "active"} icon={<MdCurrencyExchange />} label="Currency">
                                            <MenuItem className="sub_active" icon={<MdCurrencyExchange />} component={<Link to="/currency" />} onClick={() => {
                                                if (window.innerWidth < 768) {
                                                    setShowSidebar(!showSidebar)
                                                }
                                            }}>Add Currency</MenuItem>
                                        </SubMenu>

                                        <SubMenu className={location.pathname === "/batch-id" && "active"} icon={<PiIdentificationBadgeDuotone />} label="Batch Id">
                                            <MenuItem className="sub_active" icon={<PiIdentificationBadgeDuotone />} component={<Link to="/batch-id" />} onClick={() => {
                                                if (window.innerWidth < 768) {
                                                    setShowSidebar(!showSidebar)
                                                }
                                            }}>Add Batch Id</MenuItem>
                                        </SubMenu>

                                        {/* <SubMenu className={location.pathname === "/assets-master" && "active"} icon={<FaElementor />} label="Add Assets">
                                            <MenuItem className="sub_active" icon={<FaElementor />} component={<Link to="/assets-master" />}>Add Assets Type</MenuItem>
                                        </SubMenu> */}

                                    </>
                                ) : null
                        }

                        <MenuItem onClick={handleLogOut} icon={<LuLogOut />} > Logout </MenuItem>



                    </Menu>
                </main>
            </Sidebar >
        </>
    );
}
export default Sidebars;
