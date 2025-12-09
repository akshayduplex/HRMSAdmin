// src/components/Dropdown.js
import React, { useState, useRef, useEffect } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoClose } from "react-icons/io5";
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

const TotalHoursDropdown = () => {
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
                Total hours <CiEdit />
            </button>
            {isOpen && (
                <div className="custom_dropdown">
                    <div className='dflexbtwn'>
                        <h4>Add Total hours</h4>
                        <button onClick={handleDropdownButtonClick} className='closebtn'><IoClose /></button>
                    </div>
                    <InputGroup>
                        <Form.Control aria-label="" placeholder='0' />
                        <InputGroup.Text>Hours</InputGroup.Text>
                    </InputGroup>
                    <button className='savebtn'>Save</button>
                </div>
            )}
        </div>
    );
};


export default TotalHoursDropdown;
