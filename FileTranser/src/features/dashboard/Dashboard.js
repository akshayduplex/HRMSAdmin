import React from 'react';
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


import AllHeaders from '../partials/AllHeaders';


const Dashboard = () => {
  //const dispatch = useDispatch();
  //const navigate = useNavigate(); 

  return (
    <>
        <AllHeaders />
        <div className="maincontent">
            <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                <div className='row'>
                    <div className='datewish my-4'>
                        <p>Monday, 15 April 2024</p>
                        <h3>Good Morning, Anuja</h3>
                    </div>
                </div>
                <div className='row statsrow'>
                    <div className='col-sm-12'>
                        <h5 className='smallhdng'>My Stats</h5>
                    </div>
                    <div className='col-sm-3'>
                        <div className='sitecard statcard'>
                            <div className='dfexbtwn'>
                                <div className='statxt'>
                                    <h4>9:16 AM</h4>
                                    <p>Today checkin time</p>
                                </div>
                                <div className='stataction'>
                                    <span className=''> <FaRegClock /> </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-3'>
                        <div className='sitecard statcard'>
                            <div className='dfexbtwn'>
                                <div className='statxt'>
                                    <h4>4 h 23 min</h4>
                                    <p>Today work Time*</p>
                                </div>
                                <div className='stataction'>
                                    <span> <LuLayoutDashboard /></span>
                                </div>
                            </div>
                        </div>
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
                            <div className='dfexbtwn'>
                                <div className='statxt'>
                                    <h4>3</h4>
                                    <p>Recent Leave Requests</p>
                                </div>
                                <div className='stataction'>
                                    <a href='/leave-request'>
                                        <span><TurnRightOutlinedIcon /></span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-sm-12'>
                        <div className='sitecard'>
                            <div className='dflexbtwn absentcard'>
                                <div className='absnt_text'>
                                    <IoIosInformationCircleOutline />
                                    <p>You were absent on 13 April 2024</p>
                                </div>
                                <div className='absntbtn'>
                                    <button className='transbtn'>Apply Leave</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
);
};

export default Dashboard;