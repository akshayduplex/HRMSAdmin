import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { setInterviewers } from "../slices/ScheduleInterviews/ScehduleInterviews";
import { useDispatch, useSelector } from "react-redux";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#fff !important",
    borderColor: state.isFocused
      ? "#D2C9FF"
      : state.isHovered
        ? "#80CBC4"
        : provided.borderColor,
    boxShadow: state.isFocused ? "0 0 0 1px #D2C9FF" : "none",
    "&:hover": {
      borderColor: "#D2C9FF",
    },
    minHeight: "44px",
  }),
  menu: (provided) => ({
    ...provided,
    borderTop: "1px solid #D2C9FF",
  }),
  option: (provided, state) => ({
    ...provided,
    borderBottom: "1px solid #D2C9FF",
    color: state.isSelected ? "#fff" : "#000000",
    backgroundColor: state.isSelected
      ? "#4CAF50"
      : state.isFocused
        ? "#80CBC4"
        : provided.backgroundColor,
    "&:hover": {
      backgroundColor: "#80CBC4",
      color: "#fff",
    },
  }),
};

const AsyncMultiSelectInput = ({ loadOptions, defaultValue, OnMenuOpen }) => {
  const dispatch = useDispatch();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { interviewers  , interviewHost} = useSelector((state) => state.interview);

  const handleChange = (selected) => {
    setSelectedOptions(selected);
    //  Handle  MultiSelect If Interview is Local
    if(Array.isArray(selected) && interviewHost === 'Panel'){
      let result = selected?.map((item) => ({
        employee_name: item?.label,
        employee_id: item?.value,
        designation: item?.designation,
      }));
      dispatch(setInterviewers(result));
    }else {
      let arr = [{
        employee_name: selected?.label,
        employee_id: selected?.value,
        designation: selected?.designation,
      }]
      dispatch(setInterviewers(arr));
    }
  };


  // When change the Interview Host the Also change the Selected Location

  // useState(() => {
  //   if (interviewHost) {
  //     setSelectedOptions([])
  //     dispatch(setInterviewers([]));
  //   }

  // } , [interviewHost])



  useEffect(() => {
    if (interviewers?.length > 0) {
      let result = interviewers.map((item) => ({
        label: item?.employee_name,
        value: item?.employee_id,
        designation: item?.designation,
      }));
      setSelectedOptions(result);
    }
  }, [interviewers]);

  return (
    <AsyncSelect
      isMulti={interviewHost === 'Panel' ? true : false}
      defaultOptions={defaultValue}
      loadOptions={loadOptions}
      value={selectedOptions}
      onChange={handleChange}
      onMenuOpen={OnMenuOpen}
      placeholder="Search Interviews..."
      closeMenuOnSelect={true} // Set to true to close the dropdown after selection
      classNamePrefix="react-select"
      styles={customStyles}
      menuPlacement="top" // Set the dropdown to open above the input
    /> 
  );
};

export default AsyncMultiSelectInput;
