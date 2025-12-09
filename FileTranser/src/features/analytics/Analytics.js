import React from 'react';
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';


import JobBarChart from './JobBarChart';
import ServiceBarChart from './ServiceBarChart';
import GoBackButton from './GoBackButton';
import ProjectEmployeeOverview from './ProjectEmployeeOverview';
import AllHeaders from '../partials/AllHeaders';




const Analytics = () => {
    return (
        <>
        <AllHeaders/>
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className='row'>
                        <div className='datewish my-4'>
                            <p>Monday, 15 April 2024</p>
                            <h3>Analytics</h3>
                        </div>
                    </div>
                    <div className='row statsrow'>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <Link to="/employee-list">
                                    <div className='dfexbtwn'>
                                        <div className='statxt'>
                                            <h4><CountUp end={1200} duration={5} /></h4>
                                            <p>Total Employee</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <Link to="/employee-list">
                                    <div className='dfexbtwn'>
                                        <div className='statxt'>
                                            <h4><CountUp end={650} duration={5} /></h4>
                                            <p>On-role</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <Link to="/employee-list">
                                    <div className='dfexbtwn'>
                                        <div className='statxt'>
                                            <h4><CountUp end={350} duration={5} /></h4>
                                            <p>On-contract</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <Link to="/employee-list">
                                    <div className='dfexbtwn'>
                                        <div className='statxt'>
                                            <h4><CountUp end={200} duration={5} /></h4>
                                            <p>Empaneled</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <Link to="/employee-list">
                                    <div className='dfexbtwn'>
                                        <div className='statxt'>
                                            <h4><CountUp end={75} duration={5} /></h4>
                                        </div>
                                        <div className='stataction'>
                                            <Link to="#">
                                                <span> <ArrowRightAltOutlinedIcon /> </span>
                                            </Link>
                                        </div>
                                    </div>
                                    <p>Due for Appraisal</p>
                                </Link>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <Link to="/projects">
                                    <div className='dfexbtwn'>
                                        <div className='statxt'>
                                            <h4><CountUp end={15} duration={5} /></h4>
                                        </div>
                                        <div className='stataction'>
                                            <Link to="#">
                                                <span> <ArrowRightAltOutlinedIcon /> </span>
                                            </Link>
                                        </div>
                                    </div>
                                    <p>Live Projects</p>
                                </Link>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div className='sitecard statcard'>
                                <Link to="/employee-list">
                                    <div className='dfexbtwn'>
                                        <div className='statxt'>
                                            <h4><CountUp end={15} duration={5} /></h4>
                                        </div>
                                        <div className='stataction'>
                                            <Link to="#">
                                                <span> <ArrowRightAltOutlinedIcon /> </span>
                                            </Link>
                                        </div>
                                    </div>
                                    <p>Extension Requests</p>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-sm-6'>
                            <div className='sitecard'>
                                <JobBarChart />
                            </div>
                        </div>
                        <div className='col-sm-6'>
                            <div className='sitecard'>
                                <ServiceBarChart />
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-sm-12'>
                            <div className='sitecard pr-0'>
                                <ProjectEmployeeOverview />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Analytics;
