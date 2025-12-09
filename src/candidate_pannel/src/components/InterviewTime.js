import React, { useState } from "react";
import TimeRadio from "./TimeRadio";

const InterviewTime = ({setInterviewTime}) => {
    const [selectedOption1, setSelectedOption1] = useState("");


    const handleOptionChange1 = (e) => {
        setSelectedOption1(e.target.value);
       //console.log(e.target.value)
        setInterviewTime(e.target.value)
    };

    return (
        <>
            <div className="d-flex selct_dt">
                <h6 className="selecthdng">Select Time :</h6>
                <h4>{selectedOption1}</h4>
            </div>
            <div className="d-flex start_timewrap">
                <TimeRadio
                    value="10:00 am" 
                    checked={selectedOption1 === "10:00 am"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="10:30 am"
                    checked={selectedOption1 === "10:30 am"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="11:00 am"
                    checked={selectedOption1 === "11:00 am"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="11:30 am"
                    checked={selectedOption1 === "11:30 am"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="12:00 pm"
                    checked={selectedOption1 === "12:00 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="12:30 pm"
                    checked={selectedOption1 === "12:30 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="1:00 pm"
                    checked={selectedOption1 === "1:00 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="1:30 pm"
                    checked={selectedOption1 === "1:30 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="2:00 pm"
                    checked={selectedOption1 === "2:00 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="2:30 pm"
                    checked={selectedOption1 === "2:30 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="3:00 pm"
                    checked={selectedOption1 === "3:00 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="3:30 pm"
                    checked={selectedOption1 === "3:30 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="4:00 pm"
                    checked={selectedOption1 === "4:00 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="4:30 pm"
                    checked={selectedOption1 === "4:30 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="5:00 pm"
                    checked={selectedOption1 === "5:00 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="5:30 pm"
                    checked={selectedOption1 === "5:30 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="6:00 pm"
                    checked={selectedOption1 === "6:00 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="6:30 pm"
                    checked={selectedOption1 === "6:30 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="7:00 pm"
                    checked={selectedOption1 === "7:00 pm"}
                    onChange={handleOptionChange1}
                />
                <TimeRadio
                    value="7:30 pm"
                    checked={selectedOption1 === "7:30 pm"}
                    onChange={handleOptionChange1}
                />
            </div>
        </>
    )
}

export default InterviewTime;
