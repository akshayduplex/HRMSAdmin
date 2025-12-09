
import React, { useCallback, useEffect, useState } from "react";
import GoBackButton from "./Goback";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";
import { GiSandsOfTime } from "react-icons/gi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import CustomRadio from "./CustomRadio";
import DateCalender from './DateCalender';
import InterviewTime from './InterviewTime';
import { useParams, useSearchParams } from "react-router-dom";
import config from "../config/Config";
import { apiHeaderToken } from "../config/ApiHeaders";
import Spinner from 'react-bootstrap/Spinner';
import axios from "axios";

const RescheduleInterview = () => {
    const [shower, setShower] = useState(false);
    const [loader, setLoader] = useState(false)
    const [selectedOption, setSelectedOption] = useState("");
    const [customDuration, setCustomDuration] = useState("");
    const [interviewDate, setInterviewDate] = useState("");
    const [interviewTime, setInterviewTime] = useState("");
    const [data, setData] = useState([]);
    const { _id } = useParams();
    const [searchParams] = useSearchParams()
    const candidateId = searchParams.get('candidate_id')
    const appliedId = searchParams.get('applied_job_id')
    const interviewerId = searchParams.get('interviewer_id')
    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };
    const handleSubmit = useCallback(async () => {

        const payload = { _id, status: ["_id", "project_name", "department", "job_title", "job_type", "experience", "location", "salary_range"] };
        try {
            let response = await axios.post(`${config.API_URL}getJobById`, payload, apiHeaderToken(config.API_TOKEN));
            //console.log(response);
            setData(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }, [_id]);

    useEffect(() => {
        handleSubmit();
    }, [handleSubmit]);

    const ScheduledInterview = async () => {
        setLoader(true);
        const payload = {
            candidate_id: candidateId,
            applied_job_id: appliedId,
            interviewer_id: interviewerId,
            interview_duration: selectedOption !== "Custom" ? selectedOption : `${customDuration} Min`,
            interview_date: `${interviewDate} ${interviewTime}`
        };
        try {
            let response = await axios.post(`${config.API_URL}scheduleInterViewDate`, payload, apiHeaderToken(config.API_TOKEN));
            console.log(response.data);
            setLoader(false);
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
        } catch (error) {
            setLoader(false);
            console.error(error);
            toast.error("Failed to schedule the interview", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const selectTime = () => {
        if (selectedOption !== "Custom") {
            setShower(false);
        } else {
            setShower(true);
        }
    };

    useEffect(() => {
        selectTime();
    }, [selectedOption]);

    return (
        <>
            <div className="maincontent">
                <div className="container">
                    <GoBackButton />
                    <div className="reschdule_wrap" data-aos="fade-in" data-aos-duration="3000">
                        <div className="cardhdr px-0">
                            <h3>Re-Schedule Interview</h3>
                        </div>
                        <div className="sitecard">
                            <div className="dtlheadr">
                                <div className="job_postn">
                                    <span className="work_loc">Onsite</span>
                                    <h3>{data.job_title}</h3>
                                    <span>{data.location?.[0]?.name}</span>
                                </div>
                                <div className="job_summry">
                                    <div className="jbsum">
                                        <span>Job Type</span>
                                        <p><FiCalendar /> {data.job_type}</p>
                                    </div>
                                    <div className="jbsum">
                                        <span>Salary Range</span>
                                        <p><MdOutlineCurrencyRupee /> {data.salary_range}</p>
                                    </div>
                                    <div className="jbsum">
                                        <span>Deadline</span>
                                        <p><GiSandsOfTime /> {new Date(data.deadline).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sel_dur my-4">
                            <h6 className="selecthdng">Duration</h6>
                            <div className="d-flex select_time">
                                <CustomRadio
                                    value="15 min"
                                    checked={selectedOption === "15 min"}
                                    onChange={handleOptionChange}
                                />
                                <CustomRadio
                                    value="30 min"
                                    checked={selectedOption === "30 min"}
                                    onChange={handleOptionChange}
                                />
                                <CustomRadio
                                    value="45 min"
                                    checked={selectedOption === "45 min"}
                                    onChange={handleOptionChange}
                                />
                                <CustomRadio
                                    value="60 min"
                                    checked={selectedOption === "60 min"}
                                    onChange={handleOptionChange}
                                />
                                <CustomRadio
                                    value="Custom"
                                    checked={selectedOption === "Custom"}
                                    onChange={handleOptionChange}
                                />
                                <div className={`${shower ? "d-block custom_duration" : "d-none"} ps-4`}>
                                    <h6>Custom duration</h6>
                                    <InputGroup className="autowidther">
                                        <Form.Control
                                            aria-label="Text input with dropdown button"
                                            value={customDuration}
                                            onChange={(e) => setCustomDuration(e.target.value)}
                                        />
                                        <InputGroup.Text>Min</InputGroup.Text>
                                    </InputGroup>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="calender">
                                    <DateCalender setInterviewDate={setInterviewDate} />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <InterviewTime setInterviewTime={setInterviewTime} />
                                <div className="mt-4">
                                    <button className="sitebtn btnblue fullbtn" onClick={ScheduledInterview}>
                                        {loader ? <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                        </> : "Submit"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </>
    );
}

export default RescheduleInterview;



