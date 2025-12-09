import React from "react";

const CustomRadio = ({ value, checked, onChange }) => {
  return (
    <label className="radio-container">
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange} 
      />
      <span className="labltext">{value}</span>
      <span className="checkmark"></span>
    </label>
  );
};

export default CustomRadio;
