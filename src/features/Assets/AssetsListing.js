import React, { useState } from 'react';
// import GoBackButton from './';
import GoBackButton from '../goBack/GoBackButton.js';
import AssetsTabs from './AssetsTabs.js';
import AddAssetsModal from "./assetscreens/Modals/AddAssetsModal.js"
import { useDispatch } from 'react-redux';
import { GetEmployeeListDropDown } from '../slices/EmployeeSlices/EmployeeSlice.js';
import AsyncSelect from "react-select/async";
import { useNavigate } from 'react-router-dom';


const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: "#fff",
        borderColor: state.isFocused
            ? "#D2C9FF"
            : state.isHovered
                ? "#80CBC4"
                : provided.borderColor,
        boxShadow: state.isFocused ? "0 0 0 1px #D2C9FF" : "none",
        "&:hover": {
            borderColor: "#D2C9FF",
        },
        height: "44px",
        width: "250px",
    }),
    menu: (provided) => ({
        ...provided,
        borderTop: "1px solid #D2C9FF",
        zIndex: 999999999999999,
    }),
    option: (provided, state) => ({
        ...provided,
        borderBottom: "1px solid #D2C9FF",
        color: state.isSelected ? "#fff" : "#000",
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
    placeholder: (provided) => ({
        ...provided,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    }),
};




export default function AssetManagement() {
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const dispatch = useDispatch();
    const [option, setOption] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const navigate = useNavigate();


    const EmplooyListOpenMenu = async () => {
        let data = await dispatch(GetEmployeeListDropDown("")).unwrap();
        setOption(data);
    };
    const handleEmployeeChange = (option) => {
        setSelectedOption(option);

        setTimeout(() => {
            handleToNavigate(option?.value)
        }, 2000);
    };
    const EmployeeLoadOption = async (input) => {
        let data = await dispatch(GetEmployeeListDropDown(input)).unwrap();
        return data;
    };
    // Select the Navigation it's Profile Page
    const handleToNavigate = (id) => {
        localStorage.setItem("onBoardingId", id);
        navigate('/people-profile?tab=assets')
    }

    return (
        <>
            <div className="maincontent">
                <div className="container" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div class="dflexbtwn">
                        <div class="hrhdng">
                            <h2>Assets Listings</h2>
                            <p>Total Available and Assigned Assets list</p>
                        </div>
                        <div className='d-flex gap-2'>
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                defaultValue={option}
                                loadOptions={EmployeeLoadOption}
                                value={selectedOption}
                                onMenuOpen={EmplooyListOpenMenu}
                                placeholder="Choose Employee To Assign."
                                onChange={handleEmployeeChange}
                                classNamePrefix="react-select"
                                styles={customStyles}
                            />
                            <button className="bg_purplbtn" onClick={handleShow}>Add Asset</button>
                        </div>
                    </div>
                    <AssetsTabs />
                </div>
            </div>
            <AddAssetsModal show={show} onHide={() => setShow(false)} />
        </>
    );
}
