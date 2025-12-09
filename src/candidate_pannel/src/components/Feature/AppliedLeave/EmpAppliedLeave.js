import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Switch,
    Avatar,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Drawer,
    Divider,
    FormControlLabel,
} from '@mui/material';
import GoBackButton from '../../Goback';
import AddLeave from './EmpAddLeave';
import { CiCalendar, CiEdit } from 'react-icons/ci';
import candidate from "../../../images/candidate.png";
import TimePeriod from '../../../../../features/attendance/TimePeriod';
import styled from 'styled-components';


const Line = styled.div`
  width: ${(props) => props.width}%;
  height: 5px; // Example height
  background-color: #00B957; // Example color
  margin-bottom: 5px;
`;
const Line2 = styled.div`
  width: ${(props) => props.width}%;
  height: 5px; // Example height
  background-color: #FF2200; // Example color
  margin-bottom: 5px;
`;
const Line3 = styled.div`
  width: ${(props) => props.width}%;
  height: 5px; // Example height
  background-color: #AFAFAF; // Example color
  margin-bottom: 5px;
`;



const LeaveManagement = () => {
    const [openAddLeave, setOpenAddLeave] = useState(false);
    const [showLabel, setShowLabel] = useState(false);


    const totalItems = 22;

    const firstLinePercent = (10 / totalItems) * 100;
    const secondLinePercent = (0 / totalItems) * 100;
    const thirdLinePercent = (1 / totalItems) * 100;

    

    return (

        <>

            <div className="maincontent">
                <div className="container">
                    <GoBackButton />
                    <div className="mb-4">
                        <h3> My Attendance </h3>
                    </div>

                    <Box p={2}>
                        <Box display="flex" gap={2}>
                            <Paper elevation={1} sx={{ width: 280, borderRadius: 2, p: 2 }}>
                                {/* <div className="sitecard attendce_sideprofile"> */}
                                <div className="prfimg_brf">
                                    <img src={candidate} className="imgsize" alt="" />
                                    <h4 className="name mb-0">{"Abhishek Gupta"}</h4>
                                    <p>{"Associate Manager"}</p>
                                    <p>{"112323"}</p>
                                </div>
                                <div className="attndc_brief">
                                    <div className=" d-flex flex-row justify-content-center align-items-center totalattnd">
                                        <CiCalendar size={20} />
                                        <h5>{10}</h5>
                                        <span>Total days</span>
                                    </div>
                                    <div className="d-flex justify-content-between px-2 w-100 mb-4">
                                        <div className="d-flex justify-content-start flex-column mini-det gap-1 align-items-start">
                                            <div className="line-blue"></div>
                                            <h5>{5} Days</h5>
                                            <span>Regular</span>
                                        </div>
                                        <div className="d-flex justify-content-start flex-column mini-det gap-1 align-items-start">
                                            <div className="line-blue"></div>
                                            <h5>0.00 hours</h5>
                                            <span>Overtime</span>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between px-2 w-100">
                                        <div className="d-flex justify-content-start flex-column mini-det gap-1 align-items-start">
                                            <div className="line-blue"></div>
                                            <h5>0.00 Day</h5>
                                            <span>PTO</span>
                                        </div>
                                        <div className="d-flex justify-content-start flex-column mini-det gap-1 align-items-start">
                                            <div className="line-blue"></div>
                                            <h5>0.00 Day</h5>
                                            <span>Holiday</span>
                                        </div>
                                    </div>
                                </div>
                                {/* </div> */}
                                {/* </Box> */}
                            </Paper>

                            <Box flexGrow={1}>
                                <TimePeriod />
                                <div className="d-flex justify-content-between mt-3 brkdown_row">
                                    <div className="d-flex flex-row gap-2 align-items-center">
                                        <h6 className="mb-0">Days Breakdown</h6>
                                        <div className="line-right"></div>
                                        <b>{0} Days</b>
                                    </div>
                                    <div className="d-flex gap-1 align-items-center brkdown_wrap">
                                        <div className="brkd_appr brkdwn_box">
                                            <p>Present:<span>0 Days</span></p>
                                        </div>
                                        <div className="brkd_reject brkdwn_box">
                                            <p>Absent: <span>0 Days</span></p>
                                        </div>
                                        <div className="brkd_pend brkdwn_box">
                                            <p>Remaining:<span>{10}</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="d-flex flex-row gap-0 align-items-center">
                                        <Line width={firstLinePercent}></Line>
                                        <Line2 width={secondLinePercent}></Line2>
                                        <Line3 width={thirdLinePercent}></Line3>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between mt-3">
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={showLabel}
                                                    onChange={(e) => setShowLabel(e.target.checked)}
                                                />
                                            }
                                            label="Show only unapproved days"
                                        />
                                    </Box>

                                    <div className="d-flex flex-row gap-2">
                                        <button className="time-off" onClick={() => setOpenAddLeave(true)}>
                                            Add leave
                                        </button>
                                        {/* <button className="reject-all">Reject All</button>
                                        <button className="confirm" onClick={()=> {}}>
                                            Approve All
                                        </button> */}
                                    </div>
                                </div>


                                <div className="mt-3">
                                    <div className="w-100 hide-check">
                                        <Table className="payroll_tables timesheettbles header-white">
                                            <thead>
                                                <tr>
                                                    <th style={{color:'#fff'}} >Date</th>
                                                    <th style={{color:'#fff'}}>Check In</th>
                                                    <th style={{color:'#fff'}}>Check Out</th>
                                                    <th style={{color:'#fff'}}>Days</th>
                                                    <th style={{color:'#fff'}}>Overtime</th>
                                                    <th style={{color:'#fff'}}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* <tr>
                        <td colSpan={6} style={{ textAlign: 'center' }}>
                          No Records Found
                        </td>
                      </tr> */}

                                                <tr>
                                                    <td>
                                                        <div className="d-flex date_day">
                                                            <span className="border-sec rounded-5 lineheight32">
                                                                Mon
                                                            </span>
                                                            <span className="text-start lineheight">
                                                                1 April 2024
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>09:30 am</td>
                                                    <td>07:00 pm</td>
                                                    <td>1</td>
                                                    <td>-</td>
                                                    <td>
                                                        <div className="text-end">
                                                            <CiEdit />
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="d-flex date_day">
                                                            <span className="border-sec rounded-5 lineheight32">
                                                                Tue
                                                            </span>
                                                            <span className="text-start lineheight">
                                                                2 April 2024
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>09:30 am</td>
                                                    <td>07:00 pm</td>
                                                    <td>1</td>
                                                    <td>-</td>
                                                    <td>
                                                        <div className="text-end">
                                                            <CiEdit />
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className="leaves-app">
                                                    <td>
                                                        <div className="d-flex date_day">
                                                            <span className="border-sec rounded-5 lineheight32">
                                                                Wed
                                                            </span>
                                                            <span className="text-start lineheight">
                                                                3 April 2024
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td colSpan={2}>
                                                        <div className="d-flex flex-column gap-2 align-items-start">
                                                            <b>OD leave</b>
                                                            <span>Approved by Neha (HOD)</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex flex-column gap-2 align-items-start">
                                                            <b>Type</b>
                                                            <span>Sick Leave</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex flex-column gap-2 align-items-start">
                                                            <b>Approved on</b>
                                                            <span>7 April 2024</span>
                                                        </div>
                                                    </td>

                                                    <td colSpan={2}>
                                                        <div className="d-flex flex-column gap-2 align-items-start">
                                                            <b>Duration</b>
                                                            <span>24 Hours</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="d-flex date_day">
                                                            <span className="border-sec rounded-5 lineheight32">
                                                                Thu
                                                            </span>
                                                            <span className="text-start lineheight">
                                                                4 April 2024
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>09:30 am</td>
                                                    <td>07:00 pm</td>
                                                    <td>1</td>
                                                    <td>-</td>
                                                    <td>
                                                        <div className="text-end">
                                                            <CiEdit />
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </Box>
                        </Box>
                    </Box>
                </div>
            </div>

            <Drawer open={openAddLeave} anchor="right" onClose={() => setOpenAddLeave(false)}>
                <AddLeave setOpenAdd={setOpenAddLeave} />
            </Drawer>
        </>
    );
};

export default LeaveManagement;





