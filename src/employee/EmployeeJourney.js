import React, { useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import { TfiEmail } from "react-icons/tfi";
import Accordion from 'react-bootstrap/Accordion';
import { FiBarChart } from "react-icons/fi";


export default function EmployeeJourney() {


    return (
        <>
            <div className="row my-3" data-aos="fade-in" data-aos-duration="3000">
                <div className="col-lg-12">
                    <div className="sitecard h-100 p-0 pt-4">
                        <div className="infobox borderbtm">
                            <div className="px-4 w-100">
                                <h5>Employee Journey</h5>
                                <div className="timeline_srch">
                                    <div className="srchbar">
                                        <IoIosSearch />
                                        <input type="text" placeholder="Search timeline"></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="timelinewrap px-4 w-100">
                            <div className="timeline_row">
                                <div className="dateline">
                                    <h6>Today</h6>
                                </div>
                                <div className="evntrow">
                                    <div className="evnttxt">
                                        <div className="evnt_icon">
                                            <span className="bg_dpurple"> <TfiEmail /> </span>
                                        </div>
                                        <div className="evntabt">
                                            <h6>Subject: Reminder from Preeti Dwivedi</h6>

                                            <Accordion defaultActiveKey={null}>
                                                <Accordion.Item eventKey="0">
                                                    <Accordion.Header>Dear Anshul Awasthi,</Accordion.Header>
                                                    <Accordion.Body>
                                                        <p>I hope this email finds you well. I wanted to remind you that the deadline
                                                            for M&E Report is approaching on 12/12/2024. Please complete the task or project and submit it before the deadline.
                                                        </p>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>

                                        </div>
                                    </div>
                                    <div className="evntdate">
                                        <p>4/11/2024, 10:30 am</p>
                                    </div>
                                </div>
                            </div>
                            <div className="timeline_row">
                                <div className="dateline">
                                    <h6>This Week</h6>
                                </div>
                                <div className="evntrow">
                                    <div className="evnttxt">
                                        <div className="evnt_icon">
                                            <span className="bg_dpurple"> <TfiEmail /> </span>
                                        </div>
                                        <div className="evntabt">
                                            <h6>Subject: Reminder from Preeti Dwivedi</h6>

                                            <Accordion defaultActiveKey={null}>
                                                <Accordion.Item eventKey="0">
                                                    <Accordion.Header>Dear Anshul Awasthi,</Accordion.Header>
                                                    <Accordion.Body>
                                                        <p>I hope this email finds you well. I wanted to remind you that the deadline
                                                            for M&E Report is approaching on 12/12/2024. Please complete the task or project and submit it before the deadline.
                                                        </p>
                                                    </Accordion.Body>
                                                </Accordion.Item>

                                            </Accordion>
                                        </div>
                                    </div>
                                    <div className="evntdate">
                                        <p>4/11/2024, 10:30 am</p>
                                    </div>
                                </div>
                            </div>
                            <div className="timeline_row">
                                <div className="dateline">
                                    <h6>This Month</h6>
                                </div>
                                <div className="evntrow">
                                    <div className="evnttxt">
                                        <div className="evnt_icon">
                                            <span className="bg_dpurple"> <TfiEmail /> </span>
                                        </div>
                                        <div className="evntabt">
                                            <h6>Subject: Reminder from Preeti Dwivedi</h6>

                                            <Accordion defaultActiveKey={null}>
                                                <Accordion.Item eventKey="0">
                                                    <Accordion.Header>Dear Anshul Awasthi,</Accordion.Header>
                                                    <Accordion.Body>
                                                        <p>I hope this email finds you well. I wanted to remind you that the deadline
                                                            for M&E Report is approaching on 12/12/2024. Please complete the task or project and submit it before the deadline.
                                                        </p>
                                                    </Accordion.Body>
                                                </Accordion.Item>

                                            </Accordion>
                                        </div>
                                    </div>
                                    <div className="evntdate">
                                        <p>4/11/2024, 10:30 am</p>
                                    </div>
                                </div>
                                <div className="evntrow">
                                    <div className="evnttxt">
                                        <div className="evnt_icon">
                                            <span className="bg_dgreen"> <FiBarChart /> </span>
                                        </div>
                                        <div className="evntabt">
                                            <h6>Increment of Anshul Awasthi</h6>
                                            <div className='onlytxt'>
                                                <p>Updated by HR Neelam Tiwari</p>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className="evntdate">
                                        <p>4/11/2024, 10:30 am</p>
                                    </div>
                                </div>
                            </div>

                        </div>


                    </div>
                </div>
            </div>

        </>
    );
}

