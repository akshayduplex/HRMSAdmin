import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the styles

const CurrentMonthCalendar = () => {
  const [date, setDate] = useState('');
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    setDate( new Date() );
    // Get the first and last date of the current month
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    setDateRange([startOfMonth, endOfMonth]);
  }, [date]);

  return (
    <div className='payroll_calender mt-4'>
      <Calendar
        value={dateRange}
        selectRange={true}
        tileClassName={({ date, view }) => {
          if (view === 'month' && date >= dateRange[0] && date <= dateRange[1]) {
            return 'highlight';
          }
        }}
      />
    </div>
  );
};

export default CurrentMonthCalendar;
