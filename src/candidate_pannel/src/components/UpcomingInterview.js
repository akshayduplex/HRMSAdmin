

import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoBackButton from "./Goback";
import RejectModal from "./RejectModal";
import { DateFormate } from "../utils/common";
import { Link } from "react-router-dom";
import config from "../config/Config";
import { apiHeaderToken } from "../config/ApiHeaders";
import axios from "axios";
import { find } from 'lodash';
import AssignCoEmployeeModal from './AssignCoEmpModal';
import moment from 'moment';
// import Spinner from 'react-bootstrap/Spinner';

const UpcomingInterview = () => {
    const [modalShow, setModalShow] = useState(false);
    const [data, setData] = useState([]);
    const [perPageRecord, setPerPageRecord] = useState(10);
    // const [loader, setLoader] = useState(false)
    const [rejectProp, setRejectProp] = useState({});
    const [modaltoast, setModaltoast] = useState({
        status: false,
        message: ""
    });

    const [openCoEmpModal, setOpenCoEmpModal] = useState(false);

    let emp_login = JSON.parse(localStorage.getItem('employeeLogin')) || {};
    //const [totalRecords, setTotalRecords] = useState(0);
    const handleSubmit = async () => {
        const UpcomingInterview = JSON.parse(localStorage.getItem("employeeLogin"));
        const employeeId = UpcomingInterview?._id;
        const payload = {
            employee_id: employeeId,
            page_no: 1,
            per_page_record: perPageRecord,
            scope_fields: ["_id", "job_id", "job_title", "project_name", "name", "applied_jobs"],
            type: "Upcoming"
        };
        try {
            let response = await axios.post(`${config.API_URL}getInterviewCandidateList`, payload, apiHeaderToken(config.API_TOKEN));
            const allData = response.data.data;
            setData(allData);

        } catch (error) {
            console.error(error);
        }
    };

    const assignCoEmployee = async (emp = {}) => {
        return toast.warning("Feature in Under Development");
    }

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

    const handleInterview = (job) => {
        if (job.google_meet_link) {
            const link = job.google_meet_link.trim();
            // alert(link);
            window.open(link, '_blank', 'noopener,noreferrer');
        } else {
            toast('Google Meet link is not available.');
        }
    };

    return (
        <>
            <div className="maincontent">
                <div className="container">
                    <GoBackButton />
                    <div className="card tablecard" data-aos="fade-in" data-aos-duration="3000">
                        <div className="cardhdr">
                            <h3>Upcoming Interview</h3>
                            <p>Upcoming interview listing</p>
                        </div>
                        <div className="cardbody">
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Srn</th>
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
                                            candidate?.applied_jobs?.map((job, jobIndex) => {
                                                if (job?.form_status === "Interview") {
                                                    return (
                                                        <tr key={`${index}-${jobIndex}`}>
                                                            <td>
                                                                <p>{index + 1}</p>
                                                            </td>
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
                                                                    {/* <p>{moment.utc(job.interview_date).format("hh:mm A,  DD/MM/YYYY ")}</p> */}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="tablebtns">
                                                                    {!['Accept', 'Reject'].includes(job?.interviewer?.find((item) => item?.employee_id === emp_login?._id)?.status) && (
                                                                        <button onClick={() => handleAccept(candidate?._id, job?._id, job?.interviewer[0]?._id)}>
                                                                            Accept
                                                                        </button>
                                                                    )}
                                                                    {/* {job?.interviewer[0]?.status === 'Accept' && (
                                                                        <Link to={`/reschedule/${candidate.job_id}?candidate_id=${candidate?._id}&applied_job_id=${job?._id}`}>Re-schedule</Link>
                                                                    )} */}
                                                                    {/* {(job?.interviewer?.find((item) => item?.employee_id === emp_login?._id)?.status === 'Accept' && job.interview_host === "One-To-One") && (
                                                                        <Link to={`/reschedule/${candidate.job_id}?candidate_id=${candidate?._id}&applied_job_id=${job?._id}&interviewer_id=${job?.interviewer?.find((item) => item?.employee_id === emp_login?._id)?._id}`}>
                                                                            Re-schedule
                                                                        </Link>
                                                                    )} */}

                                                                    {
                                                                        job?.interviewer?.find((item) => item?.employee_id === emp_login?._id)?.status !== 'Reject' ?
                                                                            <button onClick={() => {
                                                                                setModalShow(true);
                                                                                setRejectProp({
                                                                                    candidateId: candidate._id,
                                                                                    jobId: job._id,
                                                                                    interviewerId: job.interviewer.length > 0 ? job?.interviewer?.find((item) => item?.employee_id === emp_login?._id)?._id : null
                                                                                });
                                                                            }}>Reject</button>

                                                                            :

                                                                            <span className="rejected-tag">
                                                                                Rejected
                                                                            </span>
                                                                    }

                                                                    {['Accept'].includes(job?.interviewer?.find((item) => item?.employee_id === emp_login?._id)?.status) && (
                                                                        <button onClick={() => setOpenCoEmpModal(true)}>
                                                                            Assign Co-Employee
                                                                        </button>
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
            <RejectModal rejectProp={rejectProp} show={modalShow} setModaltoast={setModaltoast} onHide={() => setModalShow(false)} />
            <ToastContainer />

            <AssignCoEmployeeModal open={openCoEmpModal} handleClose={() => setOpenCoEmpModal(false)} assignFn={assignCoEmployee} />
        </>
    );
}

export default UpcomingInterview;

