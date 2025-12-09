import React from "react";
import { HiDotsVertical } from "react-icons/hi";
import Dropdown from "react-bootstrap/Dropdown";
import { FaRegClone } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiLink } from "react-icons/fi";
import { BsArchive } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { CamelCases, DateFormate } from "../../../utils/common";


function JobCards({data}) {
    return (
        <>
            <div className="card hr_jobcards me-2">
                <div className="card-body">
                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex flex-column gap-1 contenter">
                                <div className="location">
                                    <span className="text-start w-100 d-flex">
                                        { CamelCases(data.working) }
                                    </span>
                                </div>
                                <h3 className="text-start jobcrdhdng mb-0">
                                    <Link to={`/job-cards-details${data._id}`}>{data.job_title}</Link>
                                </h3>
                                <span className="text-start">
                                  {data?.project_name} , {data.location[0]?.name}
                                </span>
                            </div>
                            <div className="d-flex flex-row">
                                <div className="d-flex flex-column gap-2">
                                    <a href="/job-details" className="detaibtn">
                                        View Detail
                                    </a>
                                    <span className="datetime">
                                        {DateFormate(data.deadline)}
                                    </span>
                                </div>
                                <div className="ddbtn buttnner">
                                    <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic">
                                            <HiDotsVertical />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="py-2 job_dropdown min-widther mt-2">
                                            <Dropdown.Item href="#/action-1">
                                                <div className="d-flex flex-row">
                                                    <FiLink />
                                                    <span>Copy Link</span>
                                                </div>
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#/action-2">
                                                <div className="d-flex flex-row">
                                                    <FaRegClone />

                                                    <span>Clone</span>
                                                </div>
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">
                                                <div className="d-flex flex-row">
                                                    <BsArchive />
                                                    <span>Archieve</span>
                                                </div>
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#/action-4">
                                                <div className="d-flex flex-row">
                                                    <RiDeleteBin6Line />
                                                    <span>Delete</span>
                                                </div>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                        {/* <div className="d-flex flex-row flex-wrap">
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0">20</h4>
                                <span>Total Candidates</span>
                            </div>
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0 color-purple">12</h4>
                                <span>Review</span>
                            </div>
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0 color-orange">6</h4>
                                <span>Interview</span>
                            </div>
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0 color-blue">3</h4>
                                <span>Offer</span>
                            </div>
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0 color-green">1</h4>
                                <span>Hire</span>
                            </div>
                        </div> */}
                                                <div className="d-flex flex-row flex-wrap">
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0">{ data?.form_candidates && data?.form_candidates.find((item) => item.level === 'Total')?.value}</h4>
                                <span>Total Candidates</span>
                            </div>
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0 color-purple">{ data?.form_candidates && data?.form_candidates.find((item) => item.level === 'Rejected')?.value}</h4>
                                <span>Rejected</span>
                            </div>
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0 color-orange">{ data?.form_candidates && data?.form_candidates.find((item) => item.level === 'Interview')?.value}</h4>
                                <span>Interview</span>
                            </div>
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0 color-blue">{ data?.form_candidates && data?.form_candidates.find((item) => item.level === 'Offer')?.value}</h4>
                                <span>Offer</span>
                            </div>
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0 color-green">{ data?.form_candidates && data?.form_candidates.find((item) => item.level === 'Hired')?.value}</h4>
                                <span>Hire</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JobCards;
