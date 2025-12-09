import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { FetchClosedProjectListDropDown } from '../../features/slices/ProjectListDropDown/ProjectListDropdownSlice';
import AsyncSelect from 'react-select/async';
import { toast } from 'react-toastify';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken, apiHeaderTokenMultiPart } from '../../config/api_header';



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

const EmpImportModal = ({ show, handleClose }) => {
    // State to handle input fields and file
    const [project, setProject] = useState(null);
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();
    const [option, setOptions] = useState(null)
    const [loading , setLoading] = useState(false);


    const projectLoadOption = async (input) => {
        const result = await dispatch(FetchClosedProjectListDropDown(input)).unwrap();
        return result;
    }
    const projectMenuOpen = async () => {
        const result = await dispatch(FetchClosedProjectListDropDown('')).unwrap();
        setOptions(result);
    }
    const handleProjectChanges = (option) => {
        setProject(option)
    }

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const handleImport = async () => {
        if (!project) {
            return toast.warn("Please Select the Project");
        }
        if (!file) {
            return toast.warn("Please Choose the File")
        }

        setLoading(true)

        try {
            let formData = new FormData();
            formData.append('project_id', project?.value);
            formData.append('project_name', project?.label);
            formData.append('filename', file);

            const response = await axios.post(`${config.API_URL}importEmployeeData`, formData, apiHeaderTokenMultiPart(config.API_TOKEN))
            if (response.status === 200) {
                toast.success(response?.data?.message);
                setProject(null);
                handleClose();
                setFile(null);
            } else {
                toast.error(response?.data?.message);
            }
            setLoading(false)
        } catch (error) {
            console.log(error, 'this is Error')
            toast.error(error?.response?.data?.message || error?.message);
            setLoading(false)
        }
    }

    return (
        <Modal show={show} onHide={(e) => handleClose(false)} size='md'>
            <Modal.Header closeButton>
                <Modal.Title>Import Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Project</Form.Label>
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
                    </Form.Group>
                    {/* CSV File Upload */}

                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Import CSV or Excel File</Form.Label>
                        <Form.Control
                            type="file"
                            accept=".xlsx"
                            onChange={handleFileChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group  controlId="text-center" className="mb-3 text-center">
                        <Button variant="success" disabled={loading} className='text-center' type="button" onClick={handleImport}>
                         { loading ? "Importing....." : 'Import Employee'  }
                        </Button>
                    </Form.Group>

                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EmpImportModal;
