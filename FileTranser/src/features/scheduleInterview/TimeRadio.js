import React from "react";

const TimeRadio = ({ value, checked, onChange }) => {
  return (
    <label className="radio-container1">
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span className="labltext1">{value}</span>
      <span className="checkmark1"></span>
    </label>
  );
};

export default TimeRadio;
