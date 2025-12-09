import React, { useState } from "react";
import GoBackButton from "../goBack/GoBackButton";
import FormControl from "@mui/material/FormControl";
import { TiArrowSortedUp } from "react-icons/ti";
import { TiArrowSortedDown } from "react-icons/ti";


import PayrollBars from './PayrollBars'
import CurrentMonthCalendar from './CurrentMonthCalendar'
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import AllHeaders from "../partials/AllHeaders";
import { useDispatch } from "react-redux";
import { FetchClosedProjectListDropDown } from "../slices/ProjectListDropDown/ProjectListDropdownSlice";
import AsyncSelect from 'react-select/async';




const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#D2C9FF',
        },
        height: '44px',
    }),
    menu: (provided) => ({
        ...provided,
        borderTop: '1px solid #D2C9FF',
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
    }),
};

export default function PayrollIndex() {
    const [project, setProject] = useState("");
    const [option , setOptions] = useState(null);

    const dispatch = useDispatch();


    /********************** Project List Dropdown ********************/
    const projectLoadOption = async (input) => {
        const result = await dispatch(FetchClosedProjectListDropDown(input)).unwrap();
        return result;
    }
    const projectMenuOpen = async () => {
        const result = await dispatch(FetchClosedProjectListDropDown('')).unwrap();
        setOptions(result);
    }
    const handleProjectChanges = (option) => {
        setProject(option);
    }

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="hrhdng d-flex justify-content-between read-btn reload-btn">
                        <div className="hdng_select d-flex">
                            <h2>Payroll</h2>
                            <FormControl fullWidth>
                                <AsyncSelect
                                    cacheOptions
                                    defaultOptions
                                    defaultValue={option}
                                    loadOptions={projectLoadOption}
                                    value={project}
                                    onMenuOpen={projectMenuOpen}
                                    placeholder="Select Project"
                                    onChange={handleProjectChanges}
                                    classNamePrefix="react-select"
                                    styles={customStyles}
                                />
                            </FormControl>
                        </div>
                        <Link to="/run-payroll">
                            <button className="btn hrtop_btns"> Run Payroll</button>
                        </Link>
                    </div>
                    <div className="row mt-4">
                        <div className='col-sm-3'>
                            <div className='sitecard payrollcard'>
                                <div className='statxt'>
                                    <h4><CountUp end={3200} duration={5} /> </h4>
                                    <p className="smalltext"><span>+1 Day longer</span> vs last month</p>
                                    <p className="bigtext">Total Working Days</p>
                                </div>
                            </div>
                        </div>
                        {/* <div className='col-sm-3'>
                            <div className='sitecard payrollcard'>
                                <div className='statxt'>
                                    <h4><CountUp end={156.00} duration={5} /> </h4>
                                    <p className="smalltext"><span>+1 hours longer</span> vs last month</p>
                                    <p className="bigtext">Total Overtime Hours</p>
                                </div>
                            </div>
                        </div> */}
                        <div className='col-sm-3'>
                            <div className='sitecard payrollcard'>
                                <div className='statxt'>
                                    <h4><CountUp end={86.32} duration={5} /> </h4>
                                    <p className="smalltext"><span>+5 Days longer</span> vs last month</p>
                                    <p className="bigtext">Total Off-Time Days</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard payrollcard'>
                                <div className='statxt'>
                                    <h4><CountUp end={132} duration={5} /> </h4>
                                    <p className="smalltext"><span>+2 Paid</span> vs last month</p>
                                    <p className="bigtext">Total Payroll Paid</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-sm-6">
                            <div className="payr_card">
                                <div className="dflexbtwn mb-3">
                                    <h5>Company Payments Overview</h5>
                                    <button className="exprtbtn">Export</button>
                                </div>
                                <div className="paymentchart_wrap">
                                    <PayrollBars />
                                    <div className="costs_wrp">
                                        <div className="costbx">
                                            <span>Total Cost</span>
                                            <div className="value_incdec">
                                                <h4>137K</h4>
                                                <span className="bg_greenlt"><TiArrowSortedUp />+ 4.5%</span>
                                            </div>
                                        </div>
                                        <div className="costbx">
                                            <span>Salary</span>
                                            <div className="value_incdec">
                                                <h4>37K</h4>
                                                <span className="bg_greenlt"><TiArrowSortedUp />+ 6.5%</span>
                                            </div>
                                        </div>
                                        <div className="costbx">
                                            <span>Other</span>
                                            <div className="value_incdec">
                                                <h4>27K</h4>
                                                <span className="bg_redlt"><TiArrowSortedDown />+ 1.5%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="payr_card">
                                <h5>Current Pay Period</h5>
                                <CurrentMonthCalendar />
                                <div className="dates_wrp">
                                    <div className="calndr_text">
                                        <h6>Approval deadline</h6>
                                        <h4>April 12th, 24:00</h4>
                                    </div>
                                    <div className="calndr_text">
                                        <h6>Pay Period</h6>
                                        <h4>May 1 - 31</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row my-4">
                        <div className="col-sm-12">
                            <div className="payr_card">
                                <h5>Required Action impacting payroll</h5>
                                <div className="payroll_notf_list">
                                    <div className="payroll_notfc">
                                        <h5> Approve <Link to="#">3 on-role</Link> timesheet of the payroll on <span>March 1st - 31 </span></h5>
                                        <span className="bg_redlt">Urgent</span>
                                    </div>
                                    <div className="payroll_notfc">
                                        <h5> Approve <Link to="#">1 on-contract</Link> timesheet of the payroll on <span>March 1st - 31 </span></h5>
                                        <span className="bg_redlt">Urgent</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}