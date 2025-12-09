import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { FetchClosedProjectListDropDown } from '../slices/ProjectListDropDown/ProjectListDropdownSlice';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { GetJobList  , GetDesignationWiseJobList} from '../slices/AtsSlices/getJobListSlice';
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

const CandidateImportModal = ({ show, handleClose }) => {
    // State to handle input fields and file
    const [project, setProject] = useState(null);
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();
    const [option, setOptions] = useState(null)
    const [projectWiseJobList, setJobList] = useState(null)
    const [selectedOption, setSelectedOption] = useState(null);
    const [jobSelectedOption, setSelectedJobOption] = useState(null);
    const [defaultDesignation, setDefaultDesignation] = useState(null);
    const [designationSelectedValue, setSelectedDesignationValue] = useState(null)

    const defaultOptionValue = [
        { value: 'Devnet', label: 'Devnet' },
        { value: 'Linkedin', label: 'Linkedin' },
        { value: 'Naukri', label: 'Naukri' },
        { value: 'Outgrow', label: 'Outgrow' }
    ];



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
        setSelectedDesignationValue(null)
        setSelectedJobOption(null)
        setDefaultDesignation(option?.budget_estimate_list?.map((item) => {
            return {
                value: item?.designation_id,
                label: item?.designation
            }
        }))
    }

    const handleDesignationChanges = (option) => {
        setSelectedDesignationValue(option)
        setSelectedJobOption(null)
        let Payloads = {
            "keyword": "",
            "department": "",
            "job_title": "",
            "location": "",
            "designation": option?.label,
            "designation_id":option?.value,
            "job_type": "",
            "salary_range": "",
            "page_no": "1",
            "project_id": project?.value,
            "per_page_record": "100",
            "scope_fields": [
                "_id",
                "project_name",
                "department",
                "job_title",
                "job_type",
                "experience",
                "location",
                "salary_range",
                "status",
                "working",
                "deadline",
                "form_candidates",
                "total_vacancy",
                "available_vacancy",
                "add_date",
                "designation"
            ],
        }
        dispatch(GetDesignationWiseJobList(Payloads)).unwrap()
            .then((response) => {
                if (response && response?.length > 0) {
                    setJobList(response?.map((item) => {
                        return {
                            id: item._id,
                            label: item?.job_title,
                            value: item?._id,
                        }
                    }))
                }
            })
            .catch((err) => {
                console.log(err, 'this is Job List Error');
            })
    }

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    const handleJobChange = (option) => {
        setSelectedJobOption(option)
    }



    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const handleDownload = () => {
        // You can directly reference the file path in the public folder
        const fileUrl = `/Hrms_Candidate_import_data_format.xlsx`;
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'Hrms_Candidate_import_data_format.xlsx'; // The name of the downloaded file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = async () => {
        if(!project){
            return toast.warn("Please Select the Project");
        }
        if(!designationSelectedValue){
            return toast.warn("Please choose the Designation");
        }
        if(!selectedOption){
            return toast.warn("Please choose the Applied From");
        }
        if(!file){
            return toast.warn("Please Choose the File")
        }
        if(!jobSelectedOption){
            return toast.warn("Please Select the Job")
        }

        try {
            let formData = new FormData();

            formData.append('project_id',project?.value);
            formData.append('job_id',jobSelectedOption?.value);
            formData.append('applied_from',selectedOption?.value);
            formData.append('filename',file);

            const response = await axios.post(`${config.API_URL}importCandidatesData` , formData , apiHeaderTokenMultiPart(config.API_TOKEN))
            if(response.status === 200){
                toast.success(response?.data?.message);
                setProject(null);
                handleClose();
                setFile(null);
                setSelectedJobOption(null);
                setSelectedOption(null);
                setSelectedDesignationValue(null)
            }else {
                toast.error(response?.data?.message);
            }
        } catch (error) {
            console.log(error , 'this is Error')
            toast.error(error?.response?.data?.message);
        }
    }

    return (
        <Modal show={show} onHide={handleClose} size='md'>
            <Modal.Header closeButton>
                <Modal.Title>Import Candidates</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Project Input */}
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
                    <Form.Group className="mb-3">
                        <Form.Label>Designation</Form.Label>
                        <Select
                            value={designationSelectedValue}
                            onChange={handleDesignationChanges}
                            options={defaultDesignation || []}
                            placeholder="Select a Designation"
                            isSearchable={true}   // Enable search
                            styles={customStyles}
                            onMenuOpen={() => {
                                if (!project) {
                                    return toast.warn("Please Select the Project");
                                }
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Posted Job</Form.Label>
                        <Select
                            value={jobSelectedOption}
                            onChange={handleJobChange}
                            options={projectWiseJobList || []}
                            placeholder="Search the Posted Job"
                            isSearchable={true}   // Enable search
                            styles={customStyles}
                            onMenuOpen={() => {
                                if (!project) {
                                    return toast.warn('Please Select the Project')
                                }
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Applied From</Form.Label>
                        <Select
                            value={selectedOption}
                            onChange={handleChange}
                            options={defaultOptionValue}
                            placeholder="Select a platform"
                            isSearchable={true}   // Enable search
                            styles={customStyles}
                        />
                    </Form.Group>

                    {/* Posted Job Input */}


                    {/* CSV File Upload */}
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Import CSV or Excel File</Form.Label>
                        <Form.Control
                            type="file"
                            accept=".xlsx"
                            onChange={handleFileChange}
                            required
                            // value={file}
                        />
                    </Form.Group>

                    <div className='d-flex align-content-center justify-content-between'>
                        <Button variant="primary" type="button" onClick={handleImport}>
                            Import Candidates
                        </Button>
                        <Button variant="primary" type="button" onClick={handleDownload}>
                            Downloads Format
                        </Button>
                    </div>

                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CandidateImportModal;
