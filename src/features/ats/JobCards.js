import React, { useState } from "react";
import { HiDotsVertical, HiOutlineOfficeBuilding } from "react-icons/hi";
import Dropdown from "react-bootstrap/Dropdown";
import { FaRegClone } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiLink } from "react-icons/fi";
import { BsArchive, BsBriefcase } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { CamelCases, changeJobTypeLabel, isJobExpired } from "../../utils/common";
import { toast } from 'react-toastify';
import config from "../../config/config";
import { changeStatusOfJob, GetJobList, CloneJobs, AchievedJobList } from "../slices/AtsSlices/getJobListSlice";
import { useDispatch } from "react-redux";
import { BsBuildings } from "react-icons/bs";
import moment from "moment";
import { CiCirclePlus, CiEdit } from "react-icons/ci";
import { LiaMapMarkerSolid } from "react-icons/lia";
import PublicIcon from '@mui/icons-material/Public';
import PostJobModal from "../job/JobDetails/PostJobModal";
import { DeleteForever, ViewComfyAltSharp } from "@mui/icons-material";
import UnpublishOrDeleteJobOnNaukri from "../job/JobDetails/UnPublishOrDeleteJob";
import axios from "axios";
import { apiHeaderToken } from "../../config/api_header";
import { MdReplay } from "react-icons/md";



function JobCards({ value }) {

    const dispatch = useDispatch();
    const [postedData, setPostedData] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [OpenDeleteConfirmation, setDeleteConfirmation] = useState(false);

    const handleCopyLink = async (e, id) => {
        e.preventDefault();
        const currentUrl = config.portal_url + 'job-details/' + id
        try {
            // Use the Clipboard API if available
            await navigator.clipboard.writeText(currentUrl);
            // toast.success("Link copied to clipboard!");

            setTimeout(() => {
                window.open(currentUrl, '_blank')
            }, 500);

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
                        "status": 'Archived',
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
                            "designation",
                            "naukari_job_data"
                        ],
                    }
                    dispatch(AchievedJobList(Payloads));
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
                            "form_candidates",
                            "designation",
                            "naukari_job_data"
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
                            "form_candidates",
                            "designation",
                            "naukari_job_data"
                        ],
                    }
                    dispatch(GetJobList(Payloads));
                }
            })
            .catch(err => {
                console.error(err);
            })
    }

    // handle Delete Job From Naukri -
    const handleDeleteOrUnpublish = async () => {
        try {

            let response = await axios.post(`${config.API_URL}naukri/unpublish_job`, {
                job_doc_id: value?._id
            }, apiHeaderToken(config.API_TOKEN))

            if (response.data?.status) {

                toast.success(response.data?.message)
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
                        "designation",
                        "naukari_job_data",
                        "requisition_form_opening_type",
                    ],
                }
                dispatch(GetJobList(Payloads));

            } else {
                toast.error(response.data?.message || 'An error occurred while processing your request.');
            }

        } catch (error) {
            toast.error(error?.response.data?.message || 'An unexpected error occurred. Please try again later.');
        }
    }

    const handlePostJobOnDevnet = async () => {
        try {

            let response = await axios.post(`${config.API_URL}naukri/postJobOnDevnet`, {
                job_id: value?._id
            }, apiHeaderToken(config.API_TOKEN))

            if (response.data?.status) {

                toast.success(response.data?.message)
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
                        "designation",
                        "naukari_job_data",
                        "requisition_form_opening_type",
                    ],
                }
                dispatch(GetJobList(Payloads));

            } else {
                toast.error(response.data?.message || 'An error occurred while processing your request.');
            }

        } catch (error) {
            toast.error(error?.response.data?.message || error?.message || 'An unexpected error occurred. Please try again later.');
        }
    }

    const handleFetchCandidateFromNaukri = async () => {
        try {

            let response = await axios.post(`${config.API_URL}naukri/fetchCandidates`, { "job_doc_id": value?._id }, apiHeaderToken(config.API_TOKEN))

            if (response.data?.status) {

                toast.success(response.data?.message)
                // dispatch(GetJobListById(id));
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
                        "designation",
                        "naukari_job_data"
                    ],
                }
                dispatch(GetJobList(Payloads));

            } else {
                toast.error(response.data?.message || 'An error occurred while processing your request.');
            }

        } catch (error) {
            toast.error(error?.response.data?.message || 'An unexpected error occurred. Please try again later.');
        }
    }

    return (
        <>
            <div className="card hr_jobcards me-2" key={value._id}>
                <div className="card-body">
                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex flex-column gap-1 contenter atsjc_hdr">
                                <div className="location">
                                    <span className="text-start w-100 d-flex">
                                        {changeJobTypeLabel(value.job_type)}
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
                                        <LiaMapMarkerSolid />
                                        {" "}
                                        {value?.location[0]?.name}
                                    </span>
                                    <span className="text-start location">
                                        <BsBriefcase />
                                        {" "}
                                        {value?.designation}
                                    </span>
                                    <span className="text-start location">
                                        <HiOutlineOfficeBuilding />
                                        {" "}
                                        {value?.department}
                                    </span>
                                    <span className="text-start location">
                                        <HiOutlineOfficeBuilding />
                                        {" "}
                                        {CamelCases(value?.requisition_form_opening_type) || "N/A"} {" "} {value?.requisition_form_opening_type === 'new' && "Opening"}
                                    </span>
                                </div>
                            </div>
                            <div className="d-flex flex-row">
                                <div className="d-flex flex-column gap-2">
                                    <Link className="detaibtn" to={`/job-details/${value._id}`} >
                                        View Detail
                                    </Link>
                                    <span className="datetime">
                                        {moment(value?.add_date).format("DD/MM/YYYY")}
                                    </span>
                                    {
                                        value?.naukari_job_data?.added_on && (
                                            <span className="datetime">
                                                Published On {moment(value?.naukari_job_data?.added_on).format("DD/MM/YYYY")}
                                            </span>
                                        )
                                    }
                                </div>
                                <div className="ddbtn buttnner">
                                    <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic">
                                            <HiDotsVertical />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="py-2 job_dropdown min-widther mt-2">
                                            <Dropdown.Item href={`/add-candidate?jobId=${value._id}`}>
                                                <div className="d-flex flex-row">
                                                    <CiCirclePlus />
                                                    <span>Add Candidate</span>
                                                </div>
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => handleCopyLink(e, value.job_title_slug)}>
                                                <div className="d-flex flex-row">
                                                    <FiLink />
                                                    <span>Copy Link</span>
                                                </div>
                                            </Dropdown.Item>
                                            <Dropdown.Item href={`/create-job?id=${value?._id}`}>
                                                <div className="d-flex flex-row">
                                                    <CiEdit />
                                                    <span>Edit Job</span>
                                                </div>
                                            </Dropdown.Item>

                                            {
                                                !isJobExpired(value?.deadline) && value?.naukari_job_data?.status !== 'DELETED' && value?.naukari_job_data?.publish_job_id &&
                                                <Dropdown.Item onClick={(e) => {
                                                    e.preventDefault();
                                                    setModalOpen(true);
                                                }}>
                                                    <div className="d-flex flex-row">
                                                        <PublicIcon />
                                                        <span> {"Update Job"}  </span>
                                                    </div>
                                                </Dropdown.Item>
                                            }

                                            {
                                                !isJobExpired(value?.deadline) && value?.naukari_job_data?.status !== 'CREATED' && !value?.naukari_job_data?.publish_job_id &&
                                                <Dropdown.Item onClick={(e) => {
                                                    e.preventDefault();
                                                    setModalOpen(true);
                                                }}>
                                                    <div className="d-flex flex-row">
                                                        <PublicIcon />
                                                        <span> {"Post On Naukari"} </span>
                                                    </div>
                                                </Dropdown.Item>
                                            }

                                            {
                                                value?.naukari_job_data?.status === 'CREATED' &&
                                                <Dropdown.Item onClick={(e) => {
                                                    e.preventDefault();
                                                    setDeleteConfirmation(true);
                                                }}>
                                                    <div className="d-flex flex-row">
                                                        <DeleteForever />
                                                        <span> {"Unpublish / Delete ( Naukri )"} </span>
                                                    </div>
                                                </Dropdown.Item>
                                            }


                                            {
                                                value?.naukari_job_data?.status !== 'DELETED' && ((postedData && postedData?.jobStatus?.naukri?.url) || value?.naukari_job_data?.publish_link) &&
                                                <Dropdown.Item href={postedData?.jobStatus?.naukri?.url || value?.naukari_job_data?.publish_link} target="_blank" rel="noopener noreferrer">
                                                    <div className="d-flex flex-row">
                                                        <ViewComfyAltSharp />
                                                        <span> View Job On Naukri </span>
                                                    </div>
                                                </Dropdown.Item>
                                            }

                                            {
                                                value?.naukari_job_data?.publish_job_id &&
                                                <Dropdown.Item onClick={(e) => {
                                                    e.preventDefault()
                                                    handleFetchCandidateFromNaukri()
                                                }}>
                                                    <div className="d-flex flex-row">
                                                        <MdReplay size={18} />
                                                        <span>Refresh Candidate(s)</span>
                                                    </div>
                                                </Dropdown.Item>
                                            }

                                            {value?.naukari_job_data?.status === 'DELETED' && (
                                                <Dropdown.Item onClick={(e) => {
                                                    e.preventDefault();
                                                    setModalOpen(true);
                                                }}>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <MdReplay size={18} />
                                                        <span>Repost Job On Naukri</span>
                                                    </div>
                                                </Dropdown.Item>
                                            )}

                                            <Dropdown.Item onClick={(e) => {
                                                e.preventDefault();
                                                handlePostJobOnDevnet(value)
                                            }}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <PublicIcon size={18} />
                                                    <span>Post On Devnet</span>
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
                                    <Link to={`/job-cards-details/${value._id}?type=total`}>
                                        <div className="d-flex flex-column justify-content-start align-items-start jobnums linnner">
                                            <h4 className="mb-0">  {value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Total')?.value}</h4>
                                            <span>Total </span>
                                        </div>
                                    </Link>
                                    <Link to={`/job-cards-details/${value._id}?type=new`}>
                                        <div className="d-flex flex-column justify-content-start align-items-start jobnums linnner">
                                            <h4 className="mb-0 color-green">  {value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Applied')?.value}</h4>
                                            <span>Applied</span>
                                        </div>
                                    </Link>
                                    <Link to={`/job-cards-details/${value._id}?type=Shortlisted`}>
                                        <div className="d-flex flex-column justify-content-start  align-items-start jobnums linnner">
                                            <h4 className="mb-0 color-pink">  {value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Shortlisted')?.value}
                                            </h4>
                                            <span>Shortlisted</span>
                                        </div>
                                    </Link>
                                    <Link to={`/job-cards-details/${value._id}?type=Interview`}>
                                        <div className="d-flex flex-column justify-content-start  align-items-start jobnums linnner">
                                            <h4 className="mb-0 color-purple">  {value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Interview')?.value}
                                            </h4>
                                            <span>Interview</span>
                                        </div>
                                    </Link>
                                    <Link to={`/job-cards-details/${value._id}?type=Offered`}>
                                        <div className="d-flex flex-column justify-content-start  align-items-start jobnums linnner">
                                            <h4 className="mb-0 color-blue"> {value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Offer')?.value}</h4>
                                            <span>Offered</span>
                                        </div>
                                    </Link >
                                    <Link to={`/job-cards-details/${value._id}?type=Hired`}>
                                        <div className="d-flex flex-column justify-content-start  align-items-start jobnums linnner">
                                            <h4 className="mb-0 color-green">  {value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Hired')?.value} </h4>
                                            <span>Hired</span>
                                        </div>
                                    </Link>
                                    <Link to={`/job-cards-details/${value._id}?type=Rejected`}>
                                        <div className="d-flex flex-column justify-content-start align-items-start jobnums linnner">
                                            <h4 className="mb-0 color-orange"> {value?.form_candidates && value?.form_candidates.find((item) => item.level === 'Rejected')?.value}</h4>
                                            <span>Rejected</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className="d-flex flex-row flex-wrap justify-content-end newjb_fields">
                                <div className="d-flex flex-column align-items-start jobnums linnner">
                                    <h4 className="mb-0 ">  {value?.total_vacancy ? value?.total_vacancy : 0}</h4>
                                    <span>Net Vacancy</span>
                                </div>
                                <div className="d-flex flex-column  align-items-start jobnums linnner">
                                    <h4 className="mb-0 color-green">  {value?.available_vacancy ? value?.available_vacancy : 0}
                                    </h4>
                                    <span>Available Vacancy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal Component */}
            <PostJobModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                data={value}
                setPostedData={setPostedData}
                postedData={postedData}
            />

            <UnpublishOrDeleteJobOnNaukri
                deleteConfirmOpen={OpenDeleteConfirmation}
                handleDeleteOrUnpublish={handleDeleteOrUnpublish}
                onClose={() => setDeleteConfirmation(false)}
            />
        </>
    )
}

export default JobCards;
