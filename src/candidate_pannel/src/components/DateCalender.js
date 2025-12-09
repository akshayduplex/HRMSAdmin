

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the CSS for styling

const DateCalender = ({ setInterviewDate }) => {
    const [date, setDate] = useState(new Date());

    const handleDateChange = (newDate) => {
        setDate(newDate);
        const formattedDate = formatDateTime(newDate);
        setInterviewDate(formattedDate);
    };

    const formatDateTime = (date) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <>
            <div className="d-flex selct_dt">
                <h6 className="selecthdng">Select Date :</h6>
                <h4>{formatDateTime(date)}</h4>
            </div>
            <Calendar
                onChange={handleDateChange}
                value={date}
            />
        </>
    );
};

export default DateCalender;
