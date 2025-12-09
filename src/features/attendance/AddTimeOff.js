import React, { useState } from "react";
import { LuCalendarClock } from "react-icons/lu";
import { IoCloseSharp } from "react-icons/io5";
import Calendar from "react-calendar";
import CustomCheck from "./CustomCheck";
import CustomCheckType from "./CustomCheckType";
import Box from "@mui/material/Box";
import Form from 'react-bootstrap/Form';
import { DateRange } from 'react-date-range';
import { dayDiff } from "../../utils/common";
import moment from "moment";
import { LeaveCategoryDropDown } from "../slices/LeaveSlices/LeaveSlices";
import AsyncSelect from 'react-select/async';
import { useDispatch } from "react-redux";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";
import { toast } from "react-toastify";
import { getDatesInRange } from "../../utils/common";




const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : '#d2c9ff',
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#D2C9FF',
        },
        width: '90%',
        height: '48px',
    }),
    menu: (provided) => ({
        ...provided,
        borderTop: '1px solid #D2C9FF',
        width: '90%',
    }),
    option: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid #D2C9FF',
        color: state.isSelected ? '#fff' : '#000',
        backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#80CBC4' : provided.backgroundColor,
        '&:hover': {
            backgroundColor: '#80CBC4',
            color: '#fff',
        },
        // width:'90%',
    }),
};



export default function AddTimeOff({ emp  , setOpenAdd}) {
    // const [openAdd, setOpenAdd] = useState(false);
    const [LeaveType, setLeaveType] = useState('');
    const [LeaveCategory, setLeaveCategory] = useState(null);
    const [option, setOption] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const handleLeaveCategoryLoadOption = async (input) => {
        let result = await dispatch(LeaveCategoryDropDown(input)).unwrap()
        return result?.data?.map((option) => ({ value: option.name, label: option.name }));
    }

    const handleMenuOpen = async () => {
        let result = await dispatch(LeaveCategoryDropDown('')).unwrap()
        setOption(result?.data?.map((option) => ({ value: option.name, label: option.name })))
    }

    const handleLeaveChanges = (option) => {
        setLeaveCategory(option)
    }

    const addTime = (newOpen) => () => {
        setOpenAdd(newOpen);
    };

    const handleSubmit = async () => {

        try {

            if (!LeaveCategory) {
                toast.warn("Please Select the Leave Category")
                return
            }
            if (!LeaveType) {
                toast.warn("Please choose the Leave Type")
                return
            }
            let payloads = {
                "employee_doc_id": emp?.data?._id,
                "leave_dates": [],
                "project_id": emp?.data?.project_id,
                "leave_category": LeaveCategory?.label,
                "time_off_type": LeaveType
            }
            if (state && state.length > 0) {
                const startDate = state[0]?.startDate;
                const endDate = state[0]?.endDate;

                if (startDate && endDate) {
                    console.log(getDatesInRange(startDate, endDate), 'this is the selected date range');
                    payloads.leave_dates = getDatesInRange(startDate, endDate)
                } else {
                    console.log('Start or end date is missing.');
                }
            }

            setLoading(true)

            let result = await axios.post(`${config.API_URL}applyEmployeeLeave` , payloads , apiHeaderToken(config.API_TOKEN));
            if(result.status === 200){
                toast.success(result?.data?.message);
                setLoading(false);
                setOpenAdd(false);
            }else {
                toast.error(result?.data?.message);
                setLoading(false)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
            setLoading(false)
        }
    }



    return (
        <>
            <Box sx={{ width: 500 }} role="presentation">
                <div className="purple-top py-2"></div>
                <div className="container ps-4">
                    <div className="d-flex justify-content-between mt-4 align-items-center">
                        <h5>Add Leave</h5>
                        <IoCloseSharp size={20} onClick={addTime(false)} />
                    </div>
                    <div className="timeoff_items">
                        <div className="d-flex flex-row gap-2 mt-4 align-items-center">
                            <LuCalendarClock />
                            <p>Leave Category</p>
                        </div>
                        <div className='mt-3'>
                            <AsyncSelect
                                // cacheOptions
                                defaultOptions
                                defaultValue={option}
                                loadOptions={handleLeaveCategoryLoadOption}
                                value={LeaveCategory}
                                onMenuOpen={handleMenuOpen}
                                placeholder="Select Leave type"
                                onChange={handleLeaveChanges}
                                classNamePrefix="react-select"
                                styles={customStyles}
                            />
                        </div>
                    </div>
                    <div className="timeoff_items">
                        <div className="d-flex flex-row gap-2 mt-4 align-items-center">
                            <LuCalendarClock />
                            <p>Time off Type</p>
                        </div>
                        <CustomCheckType setLeaveType={setLeaveType} />
                    </div>
                    <div className="timeoff_items">
                        <div className="d-flex flex-row gap-2 mt-4 align-items-center">
                            <LuCalendarClock />
                            <p>Select Time off </p>
                        </div>
                        <div className="d-flex flex-row gap-2 mt-2">
                            <div className="border-purple h-100 py-3 d-flex justify-content-center flex-column gap-3 align-items-center">
                                <p>Current Pay Period</p>
                                <DateRange
                                    editableDateInputs={true}
                                    onChange={item => setState([item.selection])}
                                    moveRangeOnFirstSelection={false}
                                    ranges={state}
                                    minDate={new Date()}
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row gy-3 mt-2">
                        <div className="col-lg-12">
                            <div className="loggedcolor">
                                <span>Duration:</span> <span className="color-darkpurple"> {Array.isArray(state) && dayDiff(state[0]?.startDate, state[0]?.endDate)} Days</span>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="loggedcolor">
                                <span>Time off dates:</span>
                                <span className="color-darkpurple">{moment(state[0]?.startDate).format('DD MMMM')} - {moment(state[0]?.endDate).format('DD MMMM YYYY')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center my-4">
                        <button className="cancelbtn" onClick={addTime(false)}>Cancel</button>
                        <button className="btn savebtn" onClick={handleSubmit} disabled={loading}>{loading ? 'Loading....' : 'save'}</button>
                    </div>
                </div>
            </Box>
        </>
    );

}



