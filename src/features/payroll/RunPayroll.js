import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import GoBackButton from "../goBack/GoBackButton";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { CiCalendar } from "react-icons/ci";
import Stepper from "./Stepper";
import AllHeaders from "../partials/AllHeaders";
import { useDispatch } from "react-redux";
import { FetchClosedProjectListDropDown } from "../slices/ProjectListDropDown/ProjectListDropdownSlice";
import AsyncSelect from 'react-select/async';


const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#D2C9FF',
        },
        height: '44px',
    }),
    menu: (provided) => ({
        ...provided,
        borderTop: '1px solid #D2C9FF',
    }),
    option: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid #D2C9FF',
        color: state.isSelected ? '#fff' : '#000',
        backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#80CBC4' : provided.backgroundColor,
        '&:hover': {
            backgroundColor: '#80CBC4',
            color: '#fff',
        },
    }),
};



export default function RunPayroll() {
    const [project, setProject] = useState("");
    const [option, setOptions] = useState(null);
    const handleChange = (event) => {
        setProject(event.target.value);
    };
    const dispatch = useDispatch();


    /********************** Project List Dropdown ********************/
    const projectLoadOption = async (input) => {
        const result = await dispatch(FetchClosedProjectListDropDown(input)).unwrap();
        return result;
    }
    const projectMenuOpen = async () => {
        const result = await dispatch(FetchClosedProjectListDropDown('')).unwrap();
        setOptions(result);
    }
    const handleProjectChanges = (option) => {
        setProject(option);
    }



    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="hrhdng d-flex runpay_hdr">
                        <div className="hdng_select d-flex">
                            <h2>Run Payroll</h2>
                            <div className="custom_timeprd">
                                <span>Time Period:</span>
                                <span className="timerange">1 April 2024 to 30 April 2024</span>
                                <CiCalendar />
                            </div>
                            <FormControl fullWidth>
                                <AsyncSelect
                                    cacheOptions
                                    defaultOptions
                                    defaultValue={option}
                                    loadOptions={projectLoadOption}
                                    value={project}
                                    onMenuOpen={projectMenuOpen}
                                    placeholder="Select Project"
                                    onChange={handleProjectChanges}
                                    classNamePrefix="react-select"
                                    styles={customStyles}
                                />
                            </FormControl>
                        </div>
                    </div>
                    <div className="row">
                        <Stepper />
                    </div>
                </div>
            </div>
        </>
    )
}