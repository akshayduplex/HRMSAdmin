import React, { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdOutlineDateRange } from "react-icons/md";

const DateSelector = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const handleNextDay = () => {
        setCurrentDate(addDays(currentDate, 1));
    };

    const handlePreviousDay = () => {
        setCurrentDate(subDays(currentDate, 1));
    };

    return (
        <>
            <div className='dateadjust'>
                
                <span><MdOutlineDateRange /> {format(currentDate, 'dd MMMM')}</span>
                <button onClick={handlePreviousDay}>  <MdKeyboardArrowLeft/> </button>
                <button onClick={handleNextDay}> <MdKeyboardArrowRight/> </button>
            </div>
        </>
    );
};

export default DateSelector;
