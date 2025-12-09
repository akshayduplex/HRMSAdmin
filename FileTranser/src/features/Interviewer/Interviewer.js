import React, { useState } from "react";
// import GoBackButton from "./Goback";
import GoBackButton from "../analytics/GoBackButton";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
// import SelectComponent from './Select-component';
import SelectComponent from "../dashboard/SelectComponent";
// import Upcoming_interview from './Upcoming-interviewtable';
import UpcomingInterview from "./UpcommingInterview";

// import Today_interview from './Today-interviewtable';
import TodayInterview from "./TodayInerview";
import AllHeaders from "../partials/AllHeaders";

export default function Interviews() {
    const [activeTab, setActiveTab] = useState("first")

    const changeTab = () => {
        setActiveTab('second');
    };

    return (
        <>
           <AllHeaders />
            <div className="maincontent">
                <div className="container" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="d-flex justify-content-between read-btn reload-btn">
                        <h2>Interviews</h2>
                    </div>
                    <div className="mt-3">
                        <div className="postedjobs">
                            <Tab.Container
                                id="left-tabs-example"
                                defaultActiveKey="first"
                                fill
                            >
                                <Nav
                                    variant="pills"
                                    className="flex-row border-full d-flex justify-content-between align-items-end mb-3"
                                    activeKey={activeTab} onSelect={(k) => setActiveTab(k)}
                                >
                                    <div className="d-flex flex-row">
                                        <Nav.Item>
                                            <Nav.Link eventKey="first" className={activeTab === 'first' ? 'active ' : 'unactive '}>Upcoming</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="second" className={activeTab === 'second' ? 'active ' : 'unactive'}>Today</Nav.Link>
                                        </Nav.Item>
                                    </div>
                                </Nav>
                                <Tab.Content className="contere hrforms" activeKey={activeTab} >
                                    <Tab.Pane eventKey="first" className={activeTab === 'first' ? 'active show' : 'active d-none'} >
                                        <div className='col-sm-12'>
                                            <div className='sitecard p-0'>
                                                <div className='dflexbtwn emp_tblhdr'>
                                                    <div className='project_employe'>
                                                        <SelectComponent />
                                                    </div>
                                                </div>
                                                <UpcomingInterview />
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="second" className={activeTab === 'second' ? 'active show' : 'active d-none'}>
                                        <div className='col-sm-12'>
                                            <div className='sitecard p-0'>
                                                <div className='dflexbtwn emp_tblhdr'>
                                                    <div className='project_employe'>
                                                        <SelectComponent />
                                                    </div>
                                                </div>
                                                <TodayInterview />
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
