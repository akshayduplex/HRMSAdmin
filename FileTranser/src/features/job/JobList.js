import React, { useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";

import GoBackButton from '../goBack/GoBackButton';
// import JobCards from "./JobCards";
import JobCards from "../ats/JobCards";
// import JobCardsArchived from "./JobCardsArchived";
import JobCardsArchived from "../ats/JobCardsArchived";
import AllHeaders from "../partials/AllHeaders";
import { useSelector, useDispatch } from "react-redux";
import { GetJobList } from "../slices/AtsSlices/getJobListSlice";
import { InfinitySpin } from 'react-loader-spinner'



function JobList() {
    const dispatch = useDispatch();
    const PublishedJobList = useSelector((state) => state.getJobsList.getJobList)

    useEffect(() => {
        let Payloads = {
            "keyword": "",
            "department": "",
            "job_title": "",
            "location": "",
            "job_type": "",
            "salary_range": "",
            "page_no": "1",
            "per_page_record": "100",
            "scope_fields": [
                "_id",
                "project_name",
                "department",
                "job_title",
                "job_type",
                "experience",
                "location",
                "salary_range",
                "status",
                "working",
                "deadline",
                "form_candidates",
            ],
        }
        dispatch(GetJobList(Payloads));
    }, [dispatch]);
    return (
        <><AllHeaders />
            <div className="maincontent">
                <div className="container" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="hrhdng">
                            <h2>Posted Jobs listing</h2>
                            <p className="mb-0 text-start">
                                Active and Archived job listing
                            </p>
                        </div>
                    </div>
                    <div className="row mt-4 gap-4">
                        <div className="col-lg-12">
                            <div className="postedjobs">
                                <Tab.Container
                                    id="left-tabs-example"
                                    defaultActiveKey="first"
                                    fill
                                >
                                    <Nav
                                        variant="pills"
                                        className="flex-row border-full d-flex justify-content-between align-items-end"
                                    >
                                        <div className="d-flex flex-row">
                                            <Nav.Item>
                                                <Nav.Link eventKey="first">Active Jobs ({PublishedJobList.status === 'success' && PublishedJobList.data.filter((job) => job.status === 'Published').length})</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="second">
                                                    Archieved Jobs ({PublishedJobList.status === 'success' && PublishedJobList.data.filter((job) => job.status === 'Archived').length})
                                                </Nav.Link>
                                            </Nav.Item>
                                        </div>
                                    </Nav>
                                    <Tab.Content className="contere">
                                        <Tab.Pane eventKey="first">
                                            <div className="d-flex flex-column gap-2 mt-1 scroller-content">
                                                {
                                                    PublishedJobList.status === 'loading' ?
                                                        <div className="d-flex align-content-center justify-content-center">
                                                            <InfinitySpin
                                                                visible={true}
                                                                width="200"
                                                                color="#4fa94d"
                                                                ariaLabel="infinity-spin-loading"
                                                            />
                                                        </div> :
                                                        PublishedJobList.status === 'success' &&
                                                        PublishedJobList.data.length !== 0 &&
                                                        PublishedJobList.data.map((value, index) => {
                                                            if (value?.status === 'Published') {
                                                                return (
                                                                    <JobCards value={value} />
                                                                )
                                                            }
                                                            return null;
                                                        })
                                                }
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="second">
                                            <div className="d-flex flex-column gap-2 mt-1 scroller-content">
                                                {
                                                    PublishedJobList.status === 'loading' ?
                                                        <div className="d-flex align-content-center justify-content-center">
                                                            <InfinitySpin
                                                                visible={true}
                                                                width="200"
                                                                color="#4fa94d"
                                                                ariaLabel="infinity-spin-loading"
                                                            />
                                                        </div> :
                                                        PublishedJobList.status === 'success' &&
                                                        PublishedJobList.data.length !== 0 &&
                                                        PublishedJobList.data.map((value, index) => {
                                                            if (value?.status === 'Archived') {
                                                                return (
                                                                    <JobCardsArchived value={value} />
                                                                )
                                                            }
                                                            return null;
                                                        })
                                                }
                                            </div>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default JobList;
