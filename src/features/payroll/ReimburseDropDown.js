// src/components/Dropdown.js
import React, { useState, useRef, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { IoAdd } from "react-icons/io5";
import { FaIndianRupeeSign } from "react-icons/fa6";

const ReimburseDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleButtonClick = () => {
        setIsOpen(prevState => !prevState);
    };

    const handleClickOutside = event => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };
    const handleDropdownButtonClick = () => {
        setIsOpen(false);
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button className='edits' onClick={handleButtonClick}>
                <IoAdd />  Reimbursement
            </button>
            {isOpen && (
                <div className="custom_dropdown">
                    <div className='dflexbtwn'>
                        <h4>Add Reimbursement</h4>
                        <button onClick={handleDropdownButtonClick} className='closebtn'><IoClose /></button>
                    </div>
                    <InputGroup>
                        <InputGroup.Text> <FaIndianRupeeSign /> </InputGroup.Text>
                        <Form.Control aria-label="" placeholder='0' />

                    </InputGroup>
                    <button className='savebtn'>Save</button>
                </div>
            )}
        </div>
    );
};

export default ReimburseDropdown;
