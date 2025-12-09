import React, { useEffect, useState } from 'react';
//import { useDispatch } from 'react-redux';
//import { useNavigate } from 'react-router-dom';


import RamenDiningOutlinedIcon from '@mui/icons-material/RamenDiningOutlined';
import { LuLayoutDashboard } from "react-icons/lu";
import TurnRightOutlinedIcon from '@mui/icons-material/TurnRightOutlined';
import { IoIosInformationCircleOutline } from "react-icons/io";


import TeamTable from "./TeamTable";
import SelectComponent from './SelectComponent';
import SearchEmployee from './SearchEmployee';
import DateSelector from './DateSelector';
import { FaRegClock } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { IoPeopleSharp } from "react-icons/io5";
import moment from 'moment'
import { HourDiff, TimeZone } from '../../utils/common';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import axios from 'axios';



import AllHeaders from '../partials/AllHeaders';
import { MdPendingActions, MdToday, MdUpcoming } from 'react-icons/md';
import { FaUserCheck } from 'react-icons/fa6';


const Dashboard = () => {

    const loginUsers = JSON.parse(localStorage.getItem('admin_role_user')) ?? {};
    const [CountShow, setCountShow] = useState({
        total: 0,
        onNotice: 0,
        Resigned: 0,
        AvailablePosition: 0,
        workAnniversary: 0,
        todayBirthday: 0,
        inductionDue: 0,
        appraisalDue: 0,
        LeaveRequestRaised: 0
    })

    const handleCandidatesChanges = (obj) => {
        setCountShow((prevState) => ({
            ...prevState,
            ...obj
        }));
    };
    const GrettingMessage = () => {
        const currentHour = moment().hour();
        let greeting;
        if (currentHour < 12) {
            greeting = 'Good Morning';
        } else if (currentHour < 18) {
            greeting = 'Good Afternoon';
        } else {
            greeting = 'Good Evening';
        }
        return greeting;
    }

    // handle the count records from the server 
    useEffect(() => {
        // get the total records data 
        (async () => {
            try {
                let Payloads = {
                    "job_id": "",
                    "type": "Total"
                }

                let response = await axios.post(`${config.API_URL}countEmployeeRecords`, Payloads, apiHeaderToken(config.API_TOKEN));
                if (response.status === 200) {
                    // setTotal(response.data)
                    handleCandidatesChanges({ total: response.data.data })
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        })();
        // get the onNOtice count records
        (async () => {
            try {
                let Payloads = {
                    "job_id": "",
                    "type": "onNotice"
                }

                let response = await axios.post(`${config.API_URL}countEmployeeRecords`, Payloads, apiHeaderToken(config.API_TOKEN));
                if (response.status === 200) {
                    handleCandidatesChanges({ OnNotice: response.data.data })
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        })();
        // get the Resined count records 
        (async () => {
            try {
                let Payloads = {
                    "job_id": "",
                    "type": "Resigned"
                }

                let response = await axios.post(`${config.API_URL}countEmployeeRecords`, Payloads, apiHeaderToken(config.API_TOKEN));
                if (response.status === 200) {
                    handleCandidatesChanges({ Resigned: response.data.data })
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        })();
        // get the Available position 
        (async () => {
            try {
                let Payloads = {
                    "job_id": "",
                    "type": "AvailableJobs"
                }
                let response = await axios.post(`${config.API_URL}countEmployeeRecords`, Payloads, apiHeaderToken(config.API_TOKEN));
                if (response.status === 200) {
                    handleCandidatesChanges({ AvailablePosition: response.data.data })
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        })();
        // get the work anniversary
        (async () => {
            try {
                let Payloads = {
                    "job_id": "",
                    "type": "workAnniversary"
                }
                let response = await axios.post(`${config.API_URL}countEmployeeRecords`, Payloads, apiHeaderToken(config.API_TOKEN));
                if (response.status === 200) {
                    handleCandidatesChanges({ workAnniversary: response.data.data })
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        })();
        // get the Today Birthday
        (async () => {
            try {
                let Payloads = {
                    "job_id": "",
                    "type": "todayBirthday"
                }
                let response = await axios.post(`${config.API_URL}countEmployeeRecords`, Payloads, apiHeaderToken(config.API_TOKEN));
                if (response.status === 200) {
                    handleCandidatesChanges({ todayBirthday: response.data.data })
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        })();
        // get induction Due
        (async () => {
            try {
                let Payloads = {
                    "job_id": "",
                    "type": "inductionDue"
                }
                let response = await axios.post(`${config.API_URL}countEmployeeRecords`, Payloads, apiHeaderToken(config.API_TOKEN));
                if (response.status === 200) {
                    handleCandidatesChanges({ inductionDue: response.data.data })
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        })();
        // get Appraisal Due
        (async () => {
            try {
                let Payloads = {
                    "job_id": "",
                    "type": "appraisalDue"
                }
                let response = await axios.post(`${config.API_URL}countEmployeeRecords`, Payloads, apiHeaderToken(config.API_TOKEN));
                if (response.status === 200) {
                    handleCandidatesChanges({ appraisalDue: response.data.data })
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        })();
        // get Leave Request Raised
        (async () => {
            try {
                let Payloads = {
                    "job_id": "",
                    "type": "LeaveRequest"
                }
                let response = await axios.post(`${config.API_URL}countEmployeeRecords`, Payloads, apiHeaderToken(config.API_TOKEN));
                if (response.status === 200) {
                    handleCandidatesChanges({ LeaveRequestRaised: response.data.data })
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        })();
    }, [])

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <div className='row'>
                        <div className='datewish my-4'>
                            <p>{moment().format('dddd, DD MMMM YYYY')} <span> Checkin: {TimeZone(loginUsers?.last_login)}</span></p>
                            <h3>{GrettingMessage()} , {loginUsers?.name}</h3>
                        </div>
                    </div>
                    <div className='row statsrow'>
                        <div className='col-sm-12'>
                            <h5 className='smallhdng'>My Stats</h5>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <Link to="/interviews">
                                    <div className='dfexbtwn'>
                                        <div className='statxt'>
                                            <h4>Interviews</h4>
                                            <p>Schedule Data*</p>
                                        </div>
                                        <div className='stataction'>
                                            <span><IoPeopleSharp /></span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <Link to={"/employee-list"}>
                                    <div className='dfexbtwn'>
                                        <div className='statxt'>
                                            <h4> {CountShow?.total}</h4>
                                            <p>Total Employee</p>
                                        </div>
                                        <div className='stataction'>
                                            <span className=''> <IoPeopleSharp /> </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <Link to={"/employee-list?type=Resigned"}>
                                    <div className='dfexbtwn'>
                                        <div className='statxt'>
                                            <h4>{CountShow.Resigned}</h4>
                                            <p>Resigned</p>
                                        </div>
                                        <div className='stataction'>
                                            <span className=''> <IoPeopleSharp /> </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <Link to={"/employee-list?type=onNotice"}>
                                    <div className='dfexbtwn'>
                                        <div className='statxt'>
                                            <h4>{CountShow.onNotice}</h4>
                                            <p>On Notice</p>
                                        </div>
                                        <div className='stataction'>
                                            <span className=''> <IoPeopleSharp /> </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <Link to={"/employee-list?type=availablePosition"}>
                                    <div className='dfexbtwn'>
                                        <div className='statxt'>
                                            <h4>{CountShow.AvailablePosition}</h4>
                                            <p>Available Positions</p>
                                        </div>
                                        <div className='stataction'>
                                            <span className=''> <IoPeopleSharp /> </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <Link to={"/employee-list?type=workAnniversary"}>
                                    <div className='dfexbtwn'>
                                        <div className='statxt'>
                                            <h4>{CountShow.workAnniversary}</h4>
                                            <p>Work Anniversary</p>
                                        </div>
                                        <div className='stataction'>
                                            <span className=''> <IoPeopleSharp /> </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <Link to={"/employee-list?type=todayBirthday"}>
                                    <div className='dfexbtwn'>
                                        <div className='statxt'>
                                            <h4>{CountShow.todayBirthday}</h4>
                                            <p>Today Birthday</p>
                                        </div>
                                        <div className='stataction'>
                                            <span> <LuLayoutDashboard /></span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <Link to={"/employee-list?type=inductionDue"}>
                                    <div className='dfexbtwn'>
                                        <div className='statxt'>
                                            <h4>{CountShow.inductionDue}</h4>
                                            <p>Induction Due</p>
                                        </div>
                                        <div className='stataction'>
                                            <span> <LuLayoutDashboard /></span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <Link to={"/employee-list?type=appraisalDue"}>
                                    <div className='dfexbtwn'>
                                        <div className='statxt'>
                                            <h4>{CountShow.appraisalDue}</h4>
                                            <p>Appraisal Due</p>
                                        </div>
                                        <div className='stataction'>
                                            <span> <LuLayoutDashboard /></span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <div className='dfexbtwn'>
                                    <div className='statxt'>
                                        <h4>{CountShow.LeaveRequestRaised}</h4>
                                        <p>Leave Request Raised </p>
                                    </div>
                                    <div className='stataction'>
                                        <a href='/leave-request'>
                                            <span><TurnRightOutlinedIcon /></span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <Link to={'/candidate-joining-listing?type=today'}>
                                    <div className='dfexbtwn'>
                                        <div className='statxt'>
                                            <h4>{CountShow.LeaveRequestRaised}</h4>
                                            <p>Today Joining</p>
                                        </div>
                                        <div className='stataction'>
                                            <span><MdToday /></span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <Link to={`/candidate-joining-listing?type=upcoming`}>
                                    <div className='dfexbtwn'>
                                        <div className='statxt'>
                                            <h4>{CountShow.LeaveRequestRaised}</h4>
                                            <p>Upcoming Joining</p>
                                        </div>
                                        <div className='stataction'>
                                            <span><MdUpcoming /></span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <div className='dfexbtwn'>
                                    <div className='statxt'>
                                        <h4>{CountShow.LeaveRequestRaised}</h4>
                                        <p>Approved Reference Check</p>
                                    </div>
                                    <div className='stataction'>
                                        <a href='/leave-request'>
                                            <span><FaUserCheck /></span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <div className='dfexbtwn'>
                                    <div className='statxt'>
                                        <h4>{CountShow.LeaveRequestRaised}</h4>
                                        <p>Pending Reference Check</p>
                                    </div>
                                    <div className='stataction'>
                                        <a href='/leave-request'>
                                            <span><MdPendingActions /></span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-6'>
                            <div className='sitecard'>
                                <div className='absentcard text-center'>
                                    <div className='absnt_text justify-content-center'>
                                        <IoIosInformationCircleOutline />
                                        <p>You were absent on 13 April 2024</p>
                                    </div>
                                    <div className='absntbtn'>
                                        <Link to={`/candidate-detail?id=${loginUsers && loginUsers?._id}`}><button className='transbtn'>Apply Leave</button></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>

                    </div>
                    {/* <div className='row'>
                        <div className='col-sm-12'>
                            <h5 className='smallhdng'>Team Activity</h5>
                        </div>
                        <div className='col-sm-12'>
                            <div className='sitecard p-0'>
                                <div className='dflexbtwn emp_tblhdr'>
                                    <div className='project_employe'>
                                        <SelectComponent />
                                        <SearchEmployee />
                                    </div>
                                    <div className='dates'>
                                        <DateSelector />
                                    </div>
                                </div>
                                <TeamTable />
                                Data Not Found
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    );
};

export default Dashboard;