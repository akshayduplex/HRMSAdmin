import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the styles
import { DateRange } from 'react-date-range';


const CurrentMonthCalendar = () => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);


  return (
    <div className='payroll_calender mt-4 text-center'>
      <DateRange
        editableDateInputs={true}
        onChange={item => setState([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={state}
        minDate={new Date()}
      />
    </div>
  );
};

export default CurrentMonthCalendar;
