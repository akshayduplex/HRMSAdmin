import React from "react";
import TimeRadio from "./TimeRadio";
import { setInterviewTime } from "../slices/ScheduleInterviews/ScehduleInterviews";
import { useDispatch , useSelector } from "react-redux";


const InterviewTime = () => {
    const dispatch = useDispatch();
    const { interviewTime }  = useSelector((state) => state.interview)

    const handleOptionChange1 = (e) => {
        dispatch(setInterviewTime(e.target.value));
    };

    return (
        <>
            <div className="d-flex selct_dt">
                <h6 className="selecthdng">Select Time :</h6>
                <h4>{interviewTime}</h4>
            </div>
            <div className="d-flex start_timewrap">
                <TimeRadio
                    value="10:00 am" 
                    checked={interviewTime === "10:00 am"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="10:30 am"
                    checked={interviewTime === "10:30 am"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="11:00 am"
                    checked={interviewTime === "11:00 am"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="11:30 am"
                    checked={interviewTime === "11:30 am"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="12:00 pm"
                    checked={interviewTime === "12:00 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="12:30 pm"
                    checked={interviewTime === "12:30 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="1:00 pm"
                    checked={interviewTime === "1:00 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="1:30 pm"
                    checked={interviewTime === "1:30 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="2:00 pm"
                    checked={interviewTime === "2:00 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="2:30 pm"
                    checked={interviewTime === "2:30 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="3:00 pm"
                    checked={interviewTime === "3:00 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="3:30 pm"
                    checked={interviewTime === "3:30 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="4:00 pm"
                    checked={interviewTime === "4:00 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="4:30 pm"
                    checked={interviewTime === "4:30 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="5:00 pm"
                    checked={interviewTime === "5:00 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="5:30 pm"
                    checked={interviewTime === "5:30 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="6:00 pm"
                    checked={interviewTime === "6:00 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="6:30 pm"
                    checked={interviewTime === "6:30 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="7:00 pm"
                    checked={interviewTime === "7:00 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="7:30 pm"
                    checked={interviewTime === "7:30 pm"}
                    onChange={handleOptionChange1}
                />
            </div>
        </>
    )
}

export default InterviewTime;
