import React, { useState } from 'react';

const CustomCheckType = ({setLeaveType}) => {
    const [selectedValue, setSelectedValue] = useState('');

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
        setLeaveType(event.target.value)
    };

    return (
        <div className="custom-radio-group d-flex flex-row gap-2 mt-2 align-items-center">
            <label className="customcheck-radio">
                <input
                    type="radio"
                    name="checktype"
                    value="HalfDay"
                    checked={selectedValue === 'HalfDay'}
                    onChange={handleRadioChange}
                />
                <span className="checkmark_check">Half Day</span>
            </label>
            <label className="customcheck-radio">
                <input
                    type="radio"
                    name="checktype"
                    value="FullDay"
                    checked={selectedValue === 'FullDay'}
                    onChange={handleRadioChange}
                />
                <span className="checkmark_check">Full Day</span>
            </label>
        </div>
    );
};

export default CustomCheckType;
