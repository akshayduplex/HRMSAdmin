import React, { useEffect } from "react";
import { HiDotsVertical } from "react-icons/hi";
import Dropdown from "react-bootstrap/Dropdown";
import { FaRegClone } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiLink } from "react-icons/fi";
import { BsArchive } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { CamelCases, DateFormate } from "../../utils/common";
import { toast } from 'react-toastify';
import config from "../../config/config";
import { changeStatusOfJob, GetJobList, CloneJobs } from "../slices/AtsSlices/getJobListSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaLocationDot } from "react-icons/fa6";
import { BsBuildings } from "react-icons/bs";



function JobCards({ value }) {
    const dispatch = useDispatch();
    // const changeStatus = useSelector((state) => state.getJobsList.changeJobStatus);
    const handleCopyLink = async (e, id) => {
        e.preventDefault();
        const currentUrl = config.BASE_URL + 'job-details/' + id
        try {
            // Use the Clipboard API if available
            await navigator.clipboard.writeText(currentUrl);
            toast.success("Link copied to clipboard!");
        } catch (err) {
            // Fallback for older browsers or if Clipboard API fails
            const textarea = document.createElement("textarea");
            textarea.value = currentUrl;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in some cases
            textarea.style.opacity = 0;  // Hide the textarea
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand("copy");
                toast.success("Link copied to clipboard!");
            } catch (execErr) {
                console.error("Failed to copy the link: ", execErr);
                toast.error("Link copied to clipboard!");
            } finally {
                document.body.removeChild(textarea);
            }
        }
    };

    // handle the job status 
    const handleJobStatus = (e, data) => {
        e.preventDefault();
        let Payloads = {
            _id: data._id,
            status: 'Archived'
        }
        dispatch(changeStatusOfJob(Payloads))
            .unwrap()
            .then((response) => {
                if (response && response?.status) {
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

    // handle the delete the records from the server 

    const handleDeleteJob = (e, data) => {
        e.preventDefault();
        let Payloads = {
            _id: data._id,
            status: 'Removed'
        }
        dispatch(changeStatusOfJob(Payloads))
            .unwrap()
            .then((response) => {
                if (response && response?.status) {
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

    // handle clone data ->   
    const handleCloneJobs = (e, data) => {
        e.preventDefault();
        let Payloads = {
            job_id: data._id
        }
        dispatch(CloneJobs(Payloads))
            .unwrap()
            .then((response) => {
                console.log(response, 'this is response')
                if (response && response?.status) {
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
            <div className="card hr_jobcards me-2" key={value._id}>
                <div className="card-body">
                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex flex-column gap-1 contenter">
                                <div className="location">
                                    <span className="text-start w-100 d-flex">
                                        {CamelCases(value.working)}
                                    </span>
                                </div>
                                <h3 className="text-start jobcrdhdng mb-0">
                                    <Link to={`/job-cards-details/${value._id}`}>{value.job_title}</Link>
                                </h3>
                                {/* <span className="text-start">
                                  {value?.project_name} , {value?.location[0]?.name}
                                </span> */}
                                <div className="project_location">
                                    <span className="text-start">
                                        <BsBuildings />
                                         {" "}
                                        {value?.project_name}
                                    </span>
                                    <span className="text-start location">
                                        <FaLocationDot />
                                        {" "}
                                        {value?.location[0]?.name}
                                    </span>
                                </div>
                            </div>
                            <div className="d-flex flex-row">
                                <div className="d-flex flex-column gap-2">
                                    <Link className="detaibtn" to={`/job-details/${value._id}`} >
                                        View Detail
                                    </Link>
                                    <span className="datetime">
                                        {DateFormate(value.deadline)}
                                    </span>
                                </div>
                                <div className="ddbtn buttnner">
                                    <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic">
                                            <HiDotsVertical />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="py-2 job_dropdown min-widther mt-2">
                                            <Dropdown.Item onClick={(e) => handleCopyLink(e, value._id)}>
                                                <div className="d-flex flex-row">
                                                    <FiLink />
                                                    <span>Copy Link</span>
                                                </div>
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => handleCloneJobs(e, value)}>
                                                <div className="d-flex flex-row">
                                                    <FaRegClone />
                                                    <span>Clone</span>
                                                </div>
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => handleJobStatus(e, value)}>
                                                <div className="d-flex flex-row">
                                                    <BsArchive />
                                                    <span>Archieve</span>
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

                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex flex-row flex-wrap">
                                <div className="d-flex flex-row flex-wrap justify-content-start">
                                    <div className="d-flex flex-column justify-content-start align-items-start jobnums linnner">
                                        <h4 className="mb-0">  {value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Total')?.value}</h4>
                                        <span>Total Candidates</span>
                                    </div>
                                    <div className="d-flex flex-column justify-content-start  align-items-start jobnums linnner">
                                        <h4 className="mb-0 color-pink">  {value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Interview')?.value}
                                        </h4>
                                        <span>Shortlisted</span>
                                    </div>
                                    <div className="d-flex flex-column justify-content-start  align-items-start jobnums linnner">
                                        <h4 className="mb-0 color-purple">  {value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Interview')?.value}
                                        </h4>
                                        <span>Interview</span>
                                    </div>
                                    <div className="d-flex flex-column justify-content-start  align-items-start jobnums linnner">
                                        <h4 className="mb-0 color-blue"> {value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Offer')?.value}</h4>
                                        <span>Offer</span>
                                    </div>
                                    <div className="d-flex flex-column justify-content-start  align-items-start jobnums linnner">
                                        <h4 className="mb-0 color-green">  {value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Hired')?.value} </h4>
                                        <span>Hire</span>
                                    </div>
                                    <div className="d-flex flex-column justify-content-start align-items-start jobnums linnner">
                                        <h4 className="mb-0 color-orange"> {value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Rejected')?.value}</h4>
                                        <span>Rejected</span>
                                    </div>
                                </div>
                                {/* <div className="d-flex flex-column justify-content-start align-items-start jobnums linnner ml-4">
                                        <h4 className="mb-0 ">  {value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Total')?.value}</h4>
                                        <span>Net Vacancy</span>
                                </div>
                                <div className="d-flex flex-column justify-content-start  align-items-start jobnums linnner">
                                        <h4 className="mb-0 color-green">  {value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Interview')?.value}
                                        </h4>
                                        <span>Available Vacancy</span>
                                </div> */}
                                {/* net and available vacancy from the today date  */}
                            </div>
                            <div className="d-flex flex-row flex-wrap justify-content-end newjb_fields">
                                    <div className="d-flex flex-column align-items-start jobnums linnner">
                                        <h4 className="mb-0 ">  {value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Total')?.value}</h4>
                                        <span>Net Vacancy</span>
                                    </div>
                                    <div className="d-flex flex-column  align-items-start jobnums linnner">
                                        <h4 className="mb-0 color-green">  {value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Interview')?.value}
                                        </h4>
                                        <span>Available Vacancy</span>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JobCards;
