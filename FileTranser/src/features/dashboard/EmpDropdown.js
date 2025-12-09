import React from 'react';
import Dropdown from "react-bootstrap/Dropdown";
import { LuUserCheck } from "react-icons/lu";
import { BsThreeDots } from "react-icons/bs";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import WorkOffOutlinedIcon from '@mui/icons-material/WorkOffOutlined';

const EmpDropdown = () => {

    return (
        <>
            <Dropdown className='employ_dropdown'>
                <Dropdown.Toggle id="dropdown-basic">
                    <BsThreeDots />
                </Dropdown.Toggle>
                <Dropdown.Menu className="py-2 min-widther mt-2">
                    <Dropdown.Item href="#/action-1">
                        <div className="d-flex gap-3 flex-row">
                            <LuUserCheck />
                            <span>Approve Attendance</span>
                        </div>
                    </Dropdown.Item>
                    <Dropdown.Item href="#/action-2">
                        <div className="d-flex gap-3 flex-row">
                            <CalendarTodayOutlinedIcon />
                            <span>Approve leave</span>
                        </div>
                    </Dropdown.Item>
                    <Dropdown.Item href="#/action-4">
                        <div className="d-flex gap-3 flex-row">
                            <WorkOffOutlinedIcon />
                            <span>Mark as Absent</span>
                        </div>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};

export default EmpDropdown;