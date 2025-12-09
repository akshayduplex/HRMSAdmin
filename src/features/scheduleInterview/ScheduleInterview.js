import React, { useState, useEffect } from "react";
import GoBackButton from "../goBack/GoBackButton";
import CustomRadio from "./CustomeRadioButton";
import DateCalender from "./DateCalendar";
import InterviewTime from "./InterviewTime";
import InterviewDetail from "./InterviewDetails";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import JobDtlHeader from "../job/JobCartsDetails/JobCartsDtlHeaders";
import AllHeaders from "../partials/AllHeaders";
import { useSelector, useDispatch } from "react-redux";
import { setInterviewDuration, getJobDetails, setInterviewDate, setInterviewTime, setInterviewType, setInterviewLink, setInterviewStage, setInterviewHost, setInterviewers, setInterviewVenueLocation, getUsersDetailsByIds } from "../slices/ScheduleInterviews/ScehduleInterviews";
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { Col, Row } from "react-bootstrap";
import { CustomChangesJobType } from "../../utils/common";



const ScheduleInterview = () => {
  const [selectedOption, setSelectedOption] = useState("15 min");
  const [showInterviewDetail, setShowInterviewDetail] = useState(false);
  const interviewPayloads = useSelector((state) => state.interview)
  const { interviewDate, interviewTime, interviewDuration, userDetails } = useSelector((state) => state.interview)

  const [shower, setShower] = useState();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const userId = searchParams.get('userId');
  const projectId = searchParams.get('project_id');

  // fetch the job details records 
  useEffect(() => {
    let Payloads = {
      "_id": userId,
      "scope_fields": []
    }
    dispatch(getJobDetails(Payloads))
  }, [dispatch, userId]);

  useEffect(() => {

    if (projectId) {
      let payloads = {
        "job_id": id,
        "project_id": projectId,
        "candidate_ids": userId?.split(',')
      }
      dispatch(getUsersDetailsByIds(payloads))
    }

  }, [id, dispatch, userId, projectId])

  // autofill the records if exist if interview State is interviews
  useEffect(() => {
    if (interviewPayloads.getJobDetailsList.status === 'success') {
      let getInterviewInfo = interviewPayloads.getJobDetailsList.data?.applied_jobs?.filter((item) => item.job_id === id)
      if (getInterviewInfo?.length > 0 && getInterviewInfo[0]?.form_status === 'Interview') {
        // set the filled interview duration
        dispatch(setInterviewDuration(getInterviewInfo[0]?.interview_duration))
        setSelectedOption(getInterviewInfo[0]?.interview_duration)
        // set the date date autofill ->
        dispatch(setInterviewDate(moment(getInterviewInfo[0]?.interview_date).utcOffset("+05:30").format('ddd MMM DD YYYY HH:mm:ss [GMT]Z (India Standard Time)')))
        dispatch(setInterviewTime(moment(getInterviewInfo[0]?.interview_date).utc().format("hh:mm a")))
        dispatch(setInterviewType(getInterviewInfo[0]?.interview_type))
        dispatch(setInterviewLink(getInterviewInfo[0]?.google_meet_link))
        dispatch(setInterviewStage(getInterviewInfo[0]?.stage))
        dispatch(setInterviewHost(getInterviewInfo[0]?.interview_host))
        let interviewListOnload = getInterviewInfo[0]?.interviewer?.filter((item) => item.stage === getInterviewInfo[0]?.stage).map((item) => {
          return {
            designation: item.designation,
            employee_id: item.employee_id,
            employee_name: item.employee_name
          }
        })
        dispatch(setInterviewers(interviewListOnload))
        dispatch(setInterviewVenueLocation({ label: getInterviewInfo?.[0]?.venue_location, value: getInterviewInfo?.[0]?.venue_location }))
      }
    }
  }, [dispatch, interviewPayloads.getJobDetailsList])



  const selectTime = () => {
    // If the selected option is "custom", set shower to true
    if (selectedOption !== "Custom") {
      setShower(false);
    } else {
      // Otherwise, set shower to false
      setShower(true);
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    dispatch(setInterviewDuration(e.target.value))
  };


  const handleCustomDuration = (e) => {
    dispatch(setInterviewDuration(e.target.value + " " + "min"))
  }

  useEffect(() => {
    selectTime();
  }, [selectedOption]);


  const handleShowInterviewDetail = () => {
    if (!selectedOption && !interviewDuration) {
      toast.warn('Please Select The Interview Duration');
      return false;
    }
    if (!interviewDate) {
      toast.warn("Please Select The Interview Date");
      return false
    }
    if (!interviewTime) {
      toast.warn("Please Select The Interview Time");
      return;
    }
    setShowInterviewDetail(true);
  };
  const handleShowInterview = () => {
    setShowInterviewDetail(false);
  };

  useEffect(() => {
    localStorage.setItem("selectedOption", selectedOption);
    localStorage.setItem("showInterviewDetail", showInterviewDetail.toString());
  }, [selectedOption, showInterviewDetail]);

  useEffect(() => {
    const savedSelectedOption = localStorage.getItem("selectedOption");
    const savedShowInterviewDetail = localStorage.getItem(
      "showInterviewDetail"
    );

    if (savedSelectedOption) {
      setSelectedOption(savedSelectedOption);
    }

    if (savedShowInterviewDetail !== null) {
      setShowInterviewDetail(savedShowInterviewDetail === "true");
    }
  }, []);
  return (
    <>
      {/* <AllHeaders /> */}
      <div className="maincontent">
        <div className="container" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="reschdule_wrap">
            <div className="d-flex justify-content-between align-items-center my-3">
              <div className="hrhdng">
                <h2 className="mb-0">Schedule Interview</h2>
              </div>
            </div>
            <JobDtlHeader />
            <Row className="mt-2 mb-2">
              {
                userDetails?.status === 'loading' ?
                  <Col sm={12} md={12} lg={12}>

                    <div className="row p-3 bg-light rounded shadow-sm">
                      <div className="text-center">
                        <p> Loading..... </p>
                      </div>
                    </div>

                  </Col>
                  : userDetails?.status === 'success' && userDetails?.data?.length > 0 &&
                  <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Profile Status</th>
                        <th>Job Type</th>
                        <th>Job Title</th>
                        <th>Job Designation</th>
                        <th>Job Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userDetails?.data?.map((item, index) => (
                        <tr key={index}>
                          <td>{item?.name}</td>
                          <td>{item?.email?.length > 40 ? item?.email?.slice(0, 20) + "..." : item?.email}</td>
                          <td>{item?.applied_jobs?.[0]?.form_status || "N/A"}</td>
                          <td>{CustomChangesJobType(item?.applied_jobs?.[0]?.job_type) || "N/A"}</td>
                          <td>{item?.applied_jobs?.[0]?.job_title || "N/A"}</td>
                          <td>{item?.applied_jobs?.[0]?.job_designation || "N/A"}</td>
                          <td>{item?.applied_jobs?.[0]?.job_location || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              }
            </Row>
            {!showInterviewDetail && (
              <>
                <div className="sel_dur my-4">
                  <h6 className="selecthdng text-start m-0">Duration</h6>
                  <div className="d-flex select_time justify-content-start align-items-end">
                    <div className="d-flex flex-row gap-2 align-items-end">
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
                          <Form.Control aria-label="Text input with dropdown button" onChange={handleCustomDuration} />
                          <InputGroup.Text>Min</InputGroup.Text>
                        </InputGroup>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-sm-6">
                    <div className="calender">
                      <DateCalender />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <InterviewTime />
                    <div className="mt-4">
                      <button className="sitebtn btnblue fullbtn btn-defaulter" onClick={handleShowInterviewDetail}> Next </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {showInterviewDetail && (
              <InterviewDetail onPrevios={handleShowInterview} />
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleInterview;
