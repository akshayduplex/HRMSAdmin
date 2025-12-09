import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the CSS for styling
import { setInterviewDate } from '../slices/ScheduleInterviews/ScehduleInterviews';
import { useDispatch , useSelector  } from 'react-redux';
import moment from 'moment';

const DateCalender = () => {
    const { interviewDate } = useSelector((state) => state.interview)
    const dispatch = useDispatch();

    const handleDateChange = (newDate) => {
        dispatch(setInterviewDate(newDate));
    };

    return (
        <>
            <div className="d-flex selct_dt">
                <h6 className="selecthdng">Select Date :</h6>
                <h4>{moment(interviewDate).format("MMMM DD")}</h4>
            </div>
            <Calendar
                onChange={handleDateChange}
                value={interviewDate}
            />
        </>
    );
};

export default DateCalender;
