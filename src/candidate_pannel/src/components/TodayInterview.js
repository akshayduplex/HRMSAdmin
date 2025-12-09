
import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import RateModal from "./RateModal";
import GoBackButton from "./Goback";
import { DateFormate } from "../utils/common";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import config from "../config/Config";
import { apiHeaderToken } from "../config/ApiHeaders";
import axios from "axios";

const TodayInterview = () => {
    const [modalShow, setModalShow] = useState(false);
    const [data, setData] = useState([]);
    const [rateProp, setRateProp] = useState({});
    const [modaltoast, setModaltoast] = useState({status: false,message: ""});
    const [perPageRecord, setPerPageRecord] = useState(10);

    const handleSubmit = async () => {
        const TodayInterview = JSON.parse(localStorage.getItem("employeeLogin"));
        const employeeId = TodayInterview?._id;
        const payload = {
            employee_id: employeeId,
            page_no: 1,
            per_page_record: perPageRecord,
            scope_fields: ["_id", "job_id", "job_title", "project_name", "name", "applied_jobs", "resume_file"],
            type: "Today"
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
        handleSubmit(perPageRecord);
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
                            <h3>Today Interview</h3>
                            <p>Today interview listing</p>
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
                                    {data?.length >0 ? (
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
                                                                    <p>{job.interview_host}</p>
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
                                                                <div className="tablebtns">
                                                                    <Link to={`/candidate-profiles/${candidate._id}`}>Candidate Profile</Link>
                                                                    <button onClick={() => handleDownload(candidate.resume_file)}>Download CV</button>

                                                                    {job.google_meet_link !== '' && (
                                                                        <button onClick={() => handleInterview(job)}>Join Interview</button>
                                                                    )}
                                                                    <button onClick={() => {
                                                                        setModalShow(true);
                                                                        setRateProp({
                                                                            candidateId: candidate._id,
                                                                            jobId: job._id,
                                                                            interviewerId: job.interviewer.length > 0 ? job.interviewer[0]._id : null
                                                                        });
                                                                    }}>Rate Candidate</button>
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
                                            <td colSpan="6" className="text-center">
                                                No data found
                                            </td>
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
            <RateModal rateProp={rateProp} show={modalShow} setModaltoast={setModaltoast} onHide={() => setModalShow(false)} />
            <ToastContainer />
        </>
    );
}

export default TodayInterview;



