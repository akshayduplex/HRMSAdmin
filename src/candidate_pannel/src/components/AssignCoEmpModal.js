import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    Button,
    Backdrop,
    Fade
} from '@mui/material';
import Select from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';
import { GetEmployeeListDropDownScroll } from '../../../features/slices/EmployeeSlices/EmployeeSlice';
import { useDispatch } from 'react-redux';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
    outline: 'none',
};

const coEmployees = [
    { value: 'emp1', label: 'John Doe' },
    { value: 'emp2', label: 'Jane Smith' },
    { value: 'emp3', label: 'Alice Johnson' },
];

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

const AssignCoEmployeeModal = ({ open, handleClose , addType = 'co-emp' , assignFn }) => {
    const [selectedCoEmployee, setSelectedCoEmployee] = useState(null);
    const dispatch = useDispatch()

    const handleAssign = () => {
        if (selectedCoEmployee) {
            // console.log('Assigned to:', selectedCoEmployee);
            assignFn(selectedCoEmployee);
            setSelectedCoEmployee(null); // Clear selection after assignment
            // handleClose();
        }
    };

    const projectLoadOptionPageNations = async (inputValue, loadedOptions, { page }) => {

        let payloads = {
            "keyword": inputValue,
            "page_no": page.toString(),
            "per_page_record": "10",
            "scope_fields": ["employee_code", "name", "email", "mobile_no", "_id", 'designation'],
            "profile_status": "Active",
        }

        const result = await dispatch(GetEmployeeListDropDownScroll(payloads)).unwrap();

        return {
            options: result, // must be array of { label, value } objects
            hasMore: result.length >= 10, // if true, next page will load
            additional: {
                page: page + 1
            }
        };
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{ backdrop: { timeout: 300 } }}
        >
            <Fade in={open}>
                <Box sx={modalStyle}>
                    <Typography variant="h5" gutterBottom fontWeight={600}>
                       {addType === 'interviewer' ? 'Assign Interviewer' : 'Assign Co-Employee'}
                    </Typography>
                    {/* <Select
                        options={coEmployees}
                        value={selectedCoEmployee}
                        onChange={setSelectedCoEmployee}
                        placeholder="Select Co-Employee"
                    /> */}

                    <AsyncPaginate
                        placeholder={addType === 'interviewer' ? 'Select Interviewer' : 'Select Co-Employee'}
                        value={selectedCoEmployee}
                        loadOptions={projectLoadOptionPageNations}
                        onChange={setSelectedCoEmployee}
                        debounceTimeout={300}
                        isClearable
                        styles={customStyles}
                        additional={{
                            page: 1
                        }}
                        classNamePrefix="react-select"
                    />

                    <Box mt={3} textAlign="right">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAssign}
                            disabled={!selectedCoEmployee}
                        >
                            Assign
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default AssignCoEmployeeModal;
