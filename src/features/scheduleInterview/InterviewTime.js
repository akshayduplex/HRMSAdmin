import React, { useEffect, useState } from "react";
import TimeRadio from "./TimeRadio";
import { setInterviewTime } from "../slices/ScheduleInterviews/ScehduleInterviews";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

const InterviewTime = () => {
    const dispatch = useDispatch();
    const { interviewTime, interviewDate } = useSelector((state) => state.interview); // Include interviewDate from Redux
    const [availableTimes, setAvailableTimes] = useState([]);

    const handleOptionChange1 = (e) => {
        dispatch(setInterviewTime(e.target.value));
    };

    // Generate time slots based on start and end time, in 30-minute intervals
    const generateTimeSlots = (startTime, endTime) => {
        let times = [];
        let current = moment(startTime);
        let end = moment(endTime);

        while (current <= end) {
            times.push(current.format('hh:mm a'));
            current = current.add(30, 'minutes');
        }

        return times;
    };

    // Update available time slots based on the interview date
    useEffect(() => {
        const now = moment();
        const selectedDate = moment(interviewDate);
        let startTime = moment('9:00 am', 'hh:mm a'); // Start time for interviews
        let endTime = moment('7:30 pm', 'hh:mm a'); // End time for interviews

        if (selectedDate.isSame(now, 'day')) {
            // If the selected interview date is today, restrict times to future time slots
            if (now > startTime) {
                startTime = now.add(30 - (now.minute() % 30), 'minutes'); // Round up to the next 30-minute slot
            }
        }

        const generatedSlots = generateTimeSlots(startTime, endTime);
        setAvailableTimes(generatedSlots);

        // Automatically select the first time slot if no time is selected
        if (!interviewTime && generatedSlots.length > 0) {
            dispatch(setInterviewTime(generatedSlots[0]));
        }
    }, [interviewDate, dispatch, interviewTime]);

    return (
        <>
            <div className="d-flex selct_dt">
                <h6 className="selecthdng">Select Time :</h6>
                <h4>{interviewTime}</h4>
            </div>
            <div className="d-flex start_timewrap">
                {/* Render the time slots dynamically based on availableTimes */}
                {availableTimes.map((time) => (
                    <TimeRadio
                        key={time}
                        value={time}
                        checked={interviewTime === time} // Compare with the Redux state
                        onChange={handleOptionChange1} // Dispatch the selected time
                    />
                ))}
            </div>
        </>
    );
};

export default InterviewTime;
