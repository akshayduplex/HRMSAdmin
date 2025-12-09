import React, { useState } from "react"; 
import DatePicker from "react-multi-date-picker";
import InputGroup from "react-bootstrap/InputGroup";
import { CiCalendar } from "react-icons/ci";

const TimePeriod = ()=> {

    const [values, setValues] = useState([]);
    const handleChange = (dates) => {
        if (dates.length > 2) {
            dates.shift();
        }
        setValues(dates);
    };

    return (
        <>
            <InputGroup className="daterangepicker max-input">
                <InputGroup.Text id="basic-addon1" className="rangelable">
                    Time Period:
                </InputGroup.Text>
                <div className="position-relative full-calendar-width rng_calndr">
                    <DatePicker
                        multiple
                        value={values}
                        onChange={handleChange}
                        dateSeparator=" to "
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