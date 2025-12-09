import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";
import InputGroup from "react-bootstrap/InputGroup";
import { CiCalendar } from "react-icons/ci";

const TimePeriod = () => {

    const [values, setValues] = useState([]);
    const [closed, setClosed] = useState(true);
    const handleChange = (dates) => {
        if (dates.length > 2) {
            dates.shift();

        }
        setValues(dates);
        if (dates.length === 2) {
            setClosed(false); // Close the picker
            console.log(dates, "this is Date Picker and Time Picker Data");
        }
    };

    return (
        <>
            <InputGroup className="daterangepicker max-input">
                <InputGroup.Text id="basic-addon1" className="rangelable">
                     Range:
                </InputGroup.Text>
                <div className="position-relative full-calendar-width rng_calndr">
                    <DatePicker
                        multiple
                        value={values}
                        onChange={handleChange}
                        dateSeparator=" to "
                        open={closed} // Controls the open/close state
                        onOpen={() => setClosed(true)} // Reopen when manually opened
                    />
                    <div className="rngcalendar">
                        <CiCalendar />
                    </div>
                </div>
            </InputGroup>
        </>
    );
}

export default TimePeriod;