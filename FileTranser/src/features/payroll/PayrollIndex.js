import React, { useState } from "react";
import GoBackButton from "../goBack/GoBackButton";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { TiArrowSortedUp } from "react-icons/ti";
import { TiArrowSortedDown } from "react-icons/ti";


import PayrollBars from './PayrollBars'
import CurrentMonthCalendar from './CurrentMonthCalendar'
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';


export default function PayrollIndex() {
    const [project, setProject] = useState("");
    const handleChange = (event) => {
        setProject(event.target.value);
    };

    return (
        <>
            <div className="maincontent">
                <div className="container" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="hrhdng d-flex justify-content-between read-btn reload-btn">
                        <div className="hdng_select d-flex">
                            <h2>Payroll</h2>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                    Select Project
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={project}
                                    label="Select Project"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={10}>Project 1</MenuItem>
                                    <MenuItem value={20}>Project 2</MenuItem>
                                    <MenuItem value={30}>Project 3</MenuItem>
                                </Select>
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