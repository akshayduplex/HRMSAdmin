import React, { useState } from 'react';

const CustomCheck = () => {
    const [selectedValue, setSelectedValue] = useState('');

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
    };

    return (
        <div className="custom-radio-group d-flex flex-row gap-2 mt-2 align-items-center">
            <label className="customcheck-radio">
                <input
                    type="radio"
                    name="customRadio"
                    value="PTO"
                    checked={selectedValue === 'PTO'}
                    onChange={handleRadioChange}
                />
                <span className="checkmark_check">PTO</span>
            </label>
            <label className="customcheck-radio">
                <input
                    type="radio"
                    name="customRadio"
                    value="Sick Leave"
                    checked={selectedValue === 'Sick Leave'}
                    onChange={handleRadioChange}
                />
                <span className="checkmark_check">Sick Leave</span>
            </label>
            <label className="customcheck-radio">
                <input
                    type="radio"
                    name="customRadio"
                    value="Vacation"
                    checked={selectedValue === 'Vacation'}
                    onChange={handleRadioChange}
                />
                <span className="checkmark_check">Vacation</span>
            </label>
        </div>
    );
};

export default CustomCheck;
