import React from "react";
import { HiDotsVertical } from "react-icons/hi";
import Dropdown from "react-bootstrap/Dropdown";
//import { FaRegClone } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
//import { FiLink } from "react-icons/fi";
import { BsArchive } from "react-icons/bs";
import { Link } from "react-router-dom";
import { CamelCases , DateFormate } from "../../utils/common";
import { changeStatusOfJob , GetJobList } from "../slices/AtsSlices/getJobListSlice";
import { useDispatch } from "react-redux";


const JobCardsArchived = ({value})=>{
    const dispatch = useDispatch();

    // handle unAchieved jobs status
    const handleJobStatus = (e, data) => {
        e.preventDefault();
        let Payloads = {
            _id: data._id,
            status:'Published'
        }
        dispatch(changeStatusOfJob(Payloads))
        .unwrap()
        .then((response) => {
             if(response && response?.status ){
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
                      "form_candidates"
                    ],
                }
                dispatch(GetJobList(Payloads));
             }
        })
        .catch(err => {
            console.error(err);
        })
    }

    const handleDeleteJob = (e, data) => {
        e.preventDefault();
        let Payloads = {
            _id: data._id,
            status:'Removed'
        }
        dispatch(changeStatusOfJob(Payloads))
        .unwrap()
        .then((response) => {
             if(response && response?.status ){
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
                      "form_candidates"
                    ],
                }
                dispatch(GetJobList(Payloads));
             }
        })
        .catch(err => {
            console.error(err);
        })
    }

    return (
        <>
            <div className="card hr_jobcards archieved_jobcard me-2">
                <div className="card-body">
                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex flex-column gap-1 contenter">
                                <div className="location">
                                    <span className="text-start w-100 d-flex">
                                        { CamelCases(value.working)}
                                    </span>
                                </div>
                                <h3 className="text-start mb-0">
                                    {value.job_title}
                                </h3>
                                <span className="text-start">
                                    {" "}
                                    {/* {value?.location[0]?.name} */}
                                    {value?.project_name} , {value?.location[0]?.name}
                                </span>
                            </div>
                            <div className="d-flex flex-row">
                                <div className="d-flex flex-column gap-2">
                                    <Link to={`/job-details/${value._id}`} className="detaibtn disablebtn">
                                        View Detail
                                    </Link>
                                    <span className="datetime">
                                       {DateFormate(value.deadline)}
                                    </span>
                                </div>
                                <div className="ddbtn buttnner archive_dropdwn">
                                    <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic">
                                            <HiDotsVertical />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="py-2 job_dropdown min-widther mt-2">
                                            <Dropdown.Item onClick={(e) => handleJobStatus(e,value)}>
                                                <div className="d-flex flex-row">
                                                    <BsArchive />
                                                    <span>Unarchive</span>
                                                </div>
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => handleDeleteJob(e, value)}>
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
                        <div className="d-flex flex-row flex-wrap">
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0">{ value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Total')?.value}</h4>
                                <span>Total Candidates</span>
                            </div>
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0 color-purple">{ value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Rejected')?.value}</h4>
                                <span>Rejected</span>
                            </div>
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0 color-orange">{ value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Interview')?.value}</h4>
                                <span>Interview</span>
                            </div>
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0 color-blue">{ value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Offer')?.value}</h4>
                                <span>Offer</span>
                            </div>
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0 color-green">{ value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Hired')?.value}</h4>
                                <span>Hire</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JobCardsArchived;
