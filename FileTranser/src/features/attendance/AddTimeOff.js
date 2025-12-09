import React, { useState } from "react";
import { LuCalendarClock } from "react-icons/lu";
import Box from "@mui/material/Box";
import { IoCloseSharp } from "react-icons/io5";
import Calendar from "react-calendar";
import CustomCheck from "./CustomCheck";
import CustomCheckType from "./CustomCheckType";

const AddTimeOff = ()=> {
    const [openAdd, setOpenAdd] = useState(false);

    const addTime = (newOpen) => () => {
        setOpenAdd(newOpen);
      };

      console.log( openAdd );
    
    return (
        <>
            <Box sx={{ width: 500 }} role="presentation">
                <div className="purple-top py-2"></div>
                <div className="container ps-4">
                    <div className="d-flex justify-content-between mt-4 align-items-center">
                        <h5>Add Time off</h5>
                        <IoCloseSharp size={20} onClick={addTime(false)} />
                    </div>
                    <div className="timeoff_items">
                        <div className="d-flex flex-row gap-2 mt-4 align-items-center">
                            <LuCalendarClock />
                            <p>Time off Category</p>
                        </div>
                        <CustomCheck />
                    </div>
                    <div className="timeoff_items">
                        <div className="d-flex flex-row gap-2 mt-4 align-items-center">
                            <LuCalendarClock />
                            <p>Time off Type</p>
                        </div>
                        <CustomCheckType />
                    </div>
                    <div className="timeoff_items">
                        <div className="d-flex flex-row gap-2 mt-4 align-items-center">
                            <LuCalendarClock />
                            <p>Select Time off </p>
                        </div>
                        <div className="d-flex flex-row gap-2 mt-2">
                            <div className="border-purple h-100 py-3 d-flex justify-content-center flex-column gap-3 align-items-center">
                                <p>Current Pay Period</p>
                                <Calendar />
                            </div>
                        </div>
                    </div>
                    <div class="row gy-3 mt-2">
                        <div className="col-lg-12">
                            <div className="loggedcolor">
                                <span>Duration:</span> <span className="color-darkpurple">4 days</span>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="loggedcolor">
                                <span>Time off dates:</span>
                                <span className="color-darkpurple">22 April - 25 April 2024</span>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center my-4">
                        <button className="cancelbtn" onClick={addTime(false)}>Cancel</button>
                        <button className="btn savebtn">Save</button>
                    </div>
                </div>
            </Box>
        </>
    );

}

export default AddTimeOff;