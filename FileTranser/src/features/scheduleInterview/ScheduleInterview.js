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
import { useSelector , useDispatch } from "react-redux";
import { setInterviewDuration } from "../slices/ScheduleInterviews/ScehduleInterviews";
import { useParams } from "react-router-dom";

const ScheduleInterview = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [showInterviewDetail, setShowInterviewDetail] = useState(false);
  const interviewPayloads = useSelector((state) => state.interview)
  const [shower, setShower] = useState();
  const dispatch = useDispatch();
  const { id } = useParams();

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
    dispatch(setInterviewDuration(e.target.value+" "+"min"))
  }

  // here handle the logs details
  console.log(interviewPayloads , 'this is redux payloads data')

  useEffect(() => {
    selectTime();
  }, [selectedOption]);


  const handleShowInterviewDetail = () => {
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
      <AllHeaders />
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
                          <Form.Control aria-label="Text input with dropdown button" onChange={handleCustomDuration}/>
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
