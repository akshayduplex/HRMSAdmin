

import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoBackButton from '../../Goback';
import RejectModal from '../../RejectModal';
import { DateFormate } from '../../../utils/common';
import axios from "axios";
import config from '../../../config/Config';
import { apiHeaderToken } from '../../../config/ApiHeaders';
import AssignCoEmployeeModal from '../../AssignCoEmpModal';
import { Link } from 'react-router-dom';
import RateModal from '../../RateModal';
import moment from 'moment';
import { Box, Button, InputAdornment, Stack, TextField } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";


const AllInterviewListDetails = () => {
    const [modalShow, setModalShow] = useState(false);
    const [modalShowRate, setModalShowRate] = useState(false);
    const [data, setData] = useState([]);
    const [perPageRecord, setPerPageRecord] = useState(10);
    const [assignData, setAssignData] = useState(null);

    // const [loader, setLoader] = useState(false)
    const [rejectProp, setRejectProp] = useState({});
    const [openFeedback, setOpenFeedBack] = useState({});
    const [modaltoast, setModaltoast] = useState({
        status: false,
        message: ""
    });

    const [openCoEmpModal, setOpenCoEmpModal] = useState(false);

    const [query, setQuery] = useState("");
    const [hasReset , setHasReset] = useState(false);

    const handleSearch = () => {
        handleSubmit(query)
        if(!hasReset){
            setHasReset(true)
        }
    };

    const handleReset = () => {
        setQuery("");
        handleSubmit('')
        setHasReset(false)
    };

    let emp_login = JSON.parse(localStorage.getItem('employeeLogin')) || {};
    //const [totalRecords, setTotalRecords] = useState(0);
    const handleSubmit = async (keywords = '') => {
        const UpcomingInterview = JSON.parse(localStorage.getItem("employeeLogin"));
        const employeeId = UpcomingInterview?._id;
        const payload = {
            employee_id: employeeId,
            page_no: 1,
            per_page_record: perPageRecord,
            scope_fields: ["_id", "job_id", "job_title", "project_name", "name", "applied_jobs"],
            type: "All",
            keywords: keywords
        };
        try {
            let response = await axios.post(`${config.API_URL}getInterviewCandidateList`, payload, apiHeaderToken(config.API_TOKEN));
            const allData = response.data.data;
            setData(allData);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        handleSubmit();
    }, [perPageRecord]);

    useEffect(() => {
        if (modaltoast?.status) {
            toast.success(modaltoast?.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setModaltoast({
                status: false,
                message: ""
            });
        }
    }, [modaltoast]);

    const handleOpenAssign = (candidateDetails = {}, jobDetails = {}) => {
        let data = {
            candidateId: candidateDetails?._id,
            applied_job_doc_id: jobDetails?._id,
        }
        setAssignData(data);
        setOpenCoEmpModal(true);
    }

    const assignCoEmployee = async (emp = {}) => {
        let payload = {
            interviewer_id: emp?.value,
            interviewer_name: emp?.label,
            interviewer_email: emp?.email,
            interview_designation: emp?.designation || '',
            employee_id: emp_login?._id,
            candidate_id: assignData?.candidateId,
            applied_job_doc_id: assignData?.applied_job_doc_id,
        }

        console.log("assignCoEmployee payload", payload);

        return toast.warning("Feature in Under Development");
    }

    const handleAccept = async (candidate_id, applied_job_id, interviewer_id) => {
        // setLoader(true);
        const payload = {
            candidate_id,
            applied_job_id,
            interviewer_id,
            status: "Accept",
            comment: ""
        };

        try {
            let response = await axios.post(`${config.API_URL}acceptRejectInterview`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            handleSubmit();
        } catch (error) {
            console.error(error);
        }
    };

    const handleInterview = (job) => {
        if (job.google_meet_link) {
            const link = job.google_meet_link.trim();
            // alert(link);
            window.open(link, '_blank', 'noopener,noreferrer');
        } else {
            toast('Google Meet link is not available.');
        }
    };

    const handleDownload = async (resumeFile) => {
        const response = await fetch(`${config.IMAGE_PATH}${resumeFile}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = resumeFile;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <>
            <div className="maincontent">
                <div className="container">
                    <GoBackButton />
                    <div className="card tablecard" data-aos="fade-in" data-aos-duration="3000">
                        <div className="cardhdr d-flex justify-content-between">

                            <div>
                                <h3>All Interview Details</h3>
                                <p>All interview listing</p>
                            </div>

                            <div className="searchbar">
                                <Box
                                    sx={{
                                        // p: 2,
                                        // bgcolor: "background.paper",
                                        // borderRadius: 2,
                                        // boxShadow: 2,
                                        maxWidth: 700,
                                        mx: "auto",
                                    }}
                                >
                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        spacing={2}
                                        alignItems="center"
                                    >
                                        <TextField
                                            fullWidth
                                            size="small"
                                            variant="outlined"
                                            placeholder="Search by Name, Mobile, or Job Title"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon sx={{ color: "primary.main" }} />
                                                    </InputAdornment>
                                                ),
                                                sx: {
                                                    borderRadius: "10px",         // pill-shaped input
                                                    backgroundColor: "background.paper",
                                                    boxShadow: 1,
                                                    transition: "all 0.3s ease-in-out",
                                                    "&:hover": {
                                                        boxShadow: 1,               // stronger shadow on hover
                                                    },
                                                    "&.Mui-focused": {
                                                        boxShadow: 1,               // glow effect on focus
                                                        borderColor: "primary.main",
                                                    },
                                                },
                                            }}
                                        />

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={!query}
                                            // startIcon={<SearchIcon />}
                                            onClick={handleSearch}
                                        >
                                            Search
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            disabled={!hasReset}
                                            // startIcon={<ClearIcon />}
                                            onClick={handleReset}
                                        >
                                            Reset
                                        </Button>
                                    </Stack>
                                </Box>

                            </div>
                        </div>
                        <div className="cardbody">
                            <Table>
                                <thead>
                                    <tr>
                                        {/* <th>Srn</th> */}
                                        <th>Candidate Details</th>
                                        <th>Project Name</th>
                                        <th>Interview Detail</th>
                                        <th>Date & Time</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.length > 0 ? (
                                        data?.map((candidate, index) =>
                                            candidate?.applied_jobs?.filter((item) => item?.interviewer?.length > 0 && item?.interview_status === 'Pending')?.map((job, jobIndex) => {
                                                if (job?.form_status === "Interview") {
                                                    return (
                                                        <tr key={`${index}-${jobIndex}`}>
                                                            {/* <td>
                                                                <p>{index + jobIndex + 1}</p>
                                                            </td> */}
                                                            <td>
                                                                <div className="tbltext">
                                                                    <p>{candidate.name}</p>
                                                                    <p>{job.stage}</p>
                                                                    {/* <p>{job.interview_host}</p> */}
                                                                    <p>
                                                                        {job?.interview_host === "Panel" ? (
                                                                            `${job.interview_host} Interviewer `
                                                                        ) : job?.interview_host === "One-To-One" ? (
                                                                            `${job?.interview_host}`
                                                                        ) : null}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="tbltext">
                                                                    <p>{job.project_name}</p>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="tbltext">
                                                                    <p>{job.job_title}</p>
                                                                    <p>{job.interview_type}</p>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="tbltext">
                                                                    <p>{DateFormate(job.interview_date)}</p>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="tablebtns d-grid gap-2" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                                                    {!['Accept', 'Reject'].includes(job?.interviewer?.find((item) => item?.employee_id === emp_login?._id)?.status) && (
                                                                        <button onClick={() => handleAccept(candidate?._id, job?._id, job?.interviewer[0]?._id)}>
                                                                            Accept
                                                                        </button>
                                                                    )}

                                                                    {
                                                                        job?.interviewer?.find((item) => item?.employee_id === emp_login?._id)?.status !== 'Reject' ?
                                                                            <button onClick={() => {
                                                                                setModalShow(true);
                                                                                setRejectProp({
                                                                                    candidateId: candidate._id,
                                                                                    jobId: job._id,
                                                                                    interviewerId: Array.isArray(job.interviewer) ? job?.interviewer?.find((item) => item?.employee_id === emp_login?._id)?._id : job
                                                                                    // interviewerId: job
                                                                                });
                                                                            }}>Reject</button>
                                                                            :
                                                                            <span className="rejected-tag">
                                                                                Rejected
                                                                            </span>
                                                                    }

                                                                    {['Accept'].includes(job?.interviewer?.find((item) => item?.employee_id === emp_login?._id)?.status) && (
                                                                        <button onClick={() => handleOpenAssign(candidate, job)}>
                                                                            <span style={{fontSize: '11px'}}>Assign Co-Employee</span>
                                                                        </button>
                                                                    )}

                                                                    {['Accept'].includes(job?.interviewer?.find((item) => item?.employee_id === emp_login?._id)?.status) && (
                                                                        // <div className="tablebtns d-grid gap-2" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                                                        <>
                                                                            <Link to={`/candidate-profiles/${candidate._id}`}>Candidate Profile</Link>
                                                                            <button onClick={() => handleDownload(candidate.resume_file)}>Download CV</button>

                                                                            {moment.utc(job.interview_date).isSame(moment.utc(), "day") && job.google_meet_link !== "" && (
                                                                                <button onClick={() => handleInterview(job)}>Join Interview</button>
                                                                            )}

                                                                            <button onClick={() => {
                                                                                setModalShowRate(true);
                                                                                setOpenFeedBack({
                                                                                    candidateId: candidate._id,
                                                                                    jobId: job._id,
                                                                                    interviewerId: job.interviewer.length > 0 ? job.interviewer[0]._id : null
                                                                                });
                                                                            }}>Rate Candidate</button>
                                                                        </>
                                                                       
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                                return null;
                                            })
                                        )
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">No Data Found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
                <div className=" mt-2">
                    {
                        data?.length !== 0 && data?.length >= perPageRecord &&
                        <div className="text-center">
                            <button
                                className="btn btn-primary"
                                onClick={() => setPerPageRecord(perPageRecord + 10)}
                            >
                                View More
                            </button>
                        </div>
                    }
                    {/* <button onClick={() => setPerPageRecord(perPageRecord + 1)} className="btn btn-primary">View More</button> */}
                </div>
            </div>

            <RejectModal rejectProp={rejectProp} show={modalShow} setModaltoast={setModaltoast} onHide={() => setModalShow(false)} handleSubmit={handleSubmit} setRejectProp={setRejectProp} />
            <RateModal rateProp={openFeedback} show={modalShowRate} setModaltoast={setModaltoast} onHide={() => setModalShowRate(false)} />
            <ToastContainer />


            <AssignCoEmployeeModal open={openCoEmpModal} handleClose={() => {
                setOpenCoEmpModal(false)
                setAssignData(null);
            }} assignFn={assignCoEmployee} />
        </>
    );
}

export default AllInterviewListDetails;

