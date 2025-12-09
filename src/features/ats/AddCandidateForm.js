import React, { useState, useEffect } from 'react';
import GoBackButton from '../goBack/GoBackButton';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { FaRegEdit } from "react-icons/fa";
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken, apiHeaderTokenMultiPart } from '../../config/api_header';
import moment from 'moment';
import { Col, InputGroup, Row } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import { FetchProjectListDropDown, FetchProjectLocationDropDown } from '../slices/ProjectListDropDown/ProjectListDropdownSlice';
import { GetJobListById } from '../slices/AtsSlices/getJobListSlice';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { GetDesignationWiseJobList } from '../slices/AtsSlices/getJobListSlice';
import { AiOutlineCalendar } from 'react-icons/ai';
import { useSearchParams } from 'react-router-dom';





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


const AddCandidate = () => {

    const [option, setOptions] = useState([]);
    const [projectSelectedOption, projectSetSelectedOption] = useState(null);
    const [designationSelectedValue, setSelectedDesignationValue] = useState(null)
    const [defaultDesignation, setDefaultDesignation] = useState(null)
    const [jobSelectedOption, setSelectedJobOption] = useState(null);
    const [projectWiseJobList, setJobList] = useState(null)
    const [selectedOption, setSelectedOption] = useState(null);
    const [location, setLocation] = useState(null);
    const [fetchAppliedFromLoading , setFetchAppliedFromLoading] = useState(false);
    const [fetchAppliedFromData , setFetchAppliedFromData] = useState([]);

    const [searchParams] = useSearchParams()
    const JobId = searchParams.get('jobId')
    const dispatch = useDispatch()



    useEffect(() => {

        if (JobId) {

            (async () => {

                dispatch(GetJobListById(JobId)).unwrap()
                    .then((response) => {
                        if (response) {

                            projectSetSelectedOption(
                                {
                                    value: response?.project_id,
                                    label: response?.project_name,
                                }
                            )

                            setSelectedDesignationValue(
                                {
                                    value: response.designation_id,
                                    label: response?.designation,
                                }
                            )

                            setSelectedJobOption(
                                {
                                    id: response._id,
                                    label: response?.job_title,
                                    value: response?._id,
                                    job_type: response?.job_type,
                                    department: response?.department
                                }
                            )
                        }
                    })
                    .catch((err) => {
                        console.log(err, 'this is Job List Error');
                    })
            })()

        }

    }, [JobId, dispatch])

    const [appliedFormData, setAppliedFromData] = useState(
        {
            candidate_name: '',
            candidate_email: '',
            candidate_phone: '',
            candidate_experience: '',
            candidate_designation: '',
            candidate_resume: '',
            candidate_status: '',
            candidate_last_working_days: '',
            candidate_notice_period: '',
            candidate_current_emp: '',
            candidate_current_emp_phone: '',
            candidate_total_experience_years: '0',
            candidate_total_experience_months: '0',
            candidate_relevant_experience_years: '0',
            candidate_relevant_experience_months: '0',
            candidate_education: '',
            candidate_profile_img: '',
            candidate_current_ctc: '',
            candidate_expected_ctc: '',
            candidate_linkedin_link: '',
            candidate_portfolio_link: '',
            candidate_instagram_link: '',
            candidate_facebook_link: '',
            candidate_website_link: '',
            candidate_referee_name: '',
        }
    )


    const handleFromChanges = (obj) => {
        setAppliedFromData((prev) => ({
            ...prev,
            ...obj
        }))
    }

    useEffect(() => {

        ( async () => {

            try {

                let payload = {"keyword":"","page_no":"1","per_page_record":"1000" , "status":"Active" };

                setFetchAppliedFromLoading(true)

                let response = await axios.post(`${config.API_URL}getAppliedFromList` , payload , apiHeaderToken(config.API_TOKEN));

                if(response.status === 200){
                    setFetchAppliedFromData(response.data.data?.map((item) => {
                        return {
                            value:item?.name,
                            label:item?.name,
                        }
                    }));
                }
                
            } catch (error) {
                
            }
            finally{
                setFetchAppliedFromLoading(false)
            }
        })()

    } , [])



    const projectLoadOption = async (input) => {
        const result = await dispatch(FetchProjectListDropDown(input)).unwrap();
        return result;
    };

    const projectMenuOpen = async () => {
        const result = await dispatch(FetchProjectListDropDown('')).unwrap();
        setOptions(result);
    };

    const handleProjectChanges = (option) => {
        projectSetSelectedOption(option);
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
            "designation_id": option?.value,
            "job_type": "",
            "salary_range": "",
            "page_no": "1",
            "project_id": projectSelectedOption?.value,
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
                            job_type: item?.job_type,
                            department: item?.department
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

    const projectLocationLoadOption = async (input) => {
        const result = await dispatch(FetchProjectLocationDropDown(input)).unwrap();
        return result.slice(0, 10); // Limit to 10 records
    }

    // open menu drop down list project list state list dropdown ->...
    const handleMenuOpenLocationDropdown = async () => {
        const result = await dispatch(FetchProjectLocationDropDown('')).unwrap();
        setOptions(result);
    };

    // handle changes project state filter -> 
    const handleProjectLocationChange = (option) => {
        setLocation(option);
    }


    const handleMakeSumbit = async (e) => {
        e.preventDefault();

        if (!projectSelectedOption) {
            return toast.warn('Please Select the Project')
        }

        if (!designationSelectedValue) {
            return toast.warn('Please Select the Designation')
        }

        if (!jobSelectedOption) {
            return toast.warn('Please Select the Job')
        }

        if(!selectedOption?.label){
            return toast.warn('Please Select the Applied From')
        }

        const requiredFields = ['candidate_name', 'candidate_phone', 'candidate_email', 'candidate_designation'];

        for (let field of requiredFields) {
            if (!appliedFormData[field]) {
                const fieldName = field.replace('candidate_', '').replace('_', ' ');
                return toast.warn(`${fieldName} is required`);
            }
        }

        let formData = new FormData();

        formData.append("job_id", jobSelectedOption?.id)
        formData.append("job_title", jobSelectedOption?.label)
        formData.append("job_type", jobSelectedOption?.job_type)
        formData.append("project_id", projectSelectedOption?.value)
        formData.append("project_name", projectSelectedOption?.label)
        formData.append("name", appliedFormData?.candidate_name)
        formData.append("email", appliedFormData?.candidate_email)
        formData.append("mobile_no", appliedFormData?.candidate_phone)
        formData.append("filename", appliedFormData?.candidate_resume)
        formData.append("designation", appliedFormData?.candidate_designation)
        formData.append("current_employer", appliedFormData?.candidate_current_emp)
        formData.append("current_employer_mobile", appliedFormData?.candidate_current_emp_phone)
        formData.append("location", location?.label)
        formData.append("current_ctc", appliedFormData.candidate_current_ctc)
        formData.append("expected_ctc", appliedFormData.candidate_expected_ctc)
        formData.append("notice_period", appliedFormData.candidate_notice_period)
        formData.append("last_working_day", appliedFormData.candidate_last_working_days)
        formData.append("reference_employee", appliedFormData.candidate_referee_name)
        formData.append("applied_from", selectedOption?.label)
        formData.append("department", jobSelectedOption?.department)
        formData.append("photo", appliedFormData?.candidate_profile_img)
        formData.append("social_links", JSON.stringify([
            {
                brand: 'facebook',
                link: appliedFormData.candidate_facebook_link
            },
            {
                brand: 'linkedin',
                link: appliedFormData.candidate_linkedin_link
            },
            {
                brand: 'instagram',
                link: appliedFormData.candidate_instagram_link
            },
        ])
        )
        formData.append("total_experience", `${appliedFormData.candidate_total_experience_years} Year(s) ${appliedFormData.candidate_total_experience_months ? appliedFormData.candidate_total_experience_months + " " + " Month(s) " : ""}`)
        formData.append("relevant_experience", `${appliedFormData.candidate_relevant_experience_years} Year(s) ${appliedFormData.candidate_relevant_experience_months ? appliedFormData.candidate_relevant_experience_months + " " + " Month(s) " : ""}`)

        try {
            let response = await axios.post(`${config.API_URL}addManualJobCandidate `, formData, apiHeaderTokenMultiPart(config.API_TOKEN));
            if (response.status === 200) {
                toast.success(response.data?.message)
            } else {
                toast.error(response.data?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
        }
    }

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="row">
                        <div className="pagename">
                            <h3>Add Candidate</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="sitecard">
                            <div className="projectcard">
                                <Form>
                                    <Row>
                                        <Col ms={4}>
                                            <Form.Group className="mb-3" controlId="formicProject">
                                                <Form.Label>Select Project</Form.Label>
                                                <AsyncSelect
                                                    placeholder="Select Project"
                                                    defaultOptions
                                                    defaultValue={option}
                                                    value={projectSelectedOption}
                                                    loadOptions={projectLoadOption}
                                                    onMenuOpen={projectMenuOpen}
                                                    onChange={(option) => handleProjectChanges(option)}
                                                    classNamePrefix="react-select"
                                                    styles={customStyles}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col ms={4}>
                                            <Form.Group className="mb-3" controlId="foggrmicProjhhect">
                                                <Form.Label>Designation</Form.Label>
                                                <Select
                                                    value={designationSelectedValue}
                                                    onChange={handleDesignationChanges}
                                                    options={defaultDesignation || []}
                                                    placeholder="Select a Designation"
                                                    isSearchable={true}   // Enable search
                                                    styles={customStyles}
                                                    onMenuOpen={() => {
                                                        if (!projectSelectedOption) {
                                                            return toast.warn("Please Select the Project");
                                                        }
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col ms={4}>
                                            <Form.Group className="mb-3" controlId="foggrmicProggject">
                                                <Form.Label>Posted Job</Form.Label>
                                                <Select
                                                    value={jobSelectedOption}
                                                    onChange={handleJobChange}
                                                    options={projectWiseJobList || []}
                                                    placeholder="Search the Posted Job"
                                                    isSearchable={true}   // Enable search
                                                    styles={customStyles}
                                                    onMenuOpen={() => {
                                                        if (!projectSelectedOption) {
                                                            return toast.warn('Please Select the Project')
                                                        }
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>

                                    </Row>

                                    <Row>
                                        <Col ms={4} className='mb-3'>
                                            <Form.Group className="mb-3" controlId="forgmicProhggject">
                                                <Form.Label>Applied From</Form.Label>
                                                <Select
                                                    value={selectedOption}
                                                    onChange={handleChange}
                                                    options={fetchAppliedFromData}
                                                    placeholder="Select a platform"
                                                    isSearchable={true}   // Enable search
                                                    styles={customStyles}
                                                    isLoading={fetchAppliedFromLoading}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col ms={4} className='mb-3'>
                                            <Form.Group className="mb-3" controlId="forghhmicPjroject">
                                                <Form.Label>Candidate Full Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Candidate Name"
                                                    value={appliedFormData.candidate_name}
                                                    onChange={(e) => {

                                                        const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");

                                                        if (value.length <= 40) {
                                                            handleFromChanges({ candidate_name: value });
                                                        }

                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col ms={4} className='mb-3'>
                                            <Form.Group className="mb-3" controlId="formicPhddroject">
                                                <Form.Label>Candidate Mobile No</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="+91.......98"
                                                    value={appliedFormData.candidate_phone}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/g, "");
                                                        if (value.length <= 10) {
                                                            handleFromChanges({ candidate_phone: value });
                                                        }
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>

                                    </Row>


                                    <Row>

                                        <Col ms={4} className='mb-3'>
                                            <Form.Group className="mb-3" controlId="formicProjhfect">
                                                <Form.Label>Candidate Email Id</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="test@gmail.com"
                                                    value={appliedFormData.candidate_email}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^a-zA-Z0-9@._-]/
                                                            , "");
                                                        if (value.length <= 40) {
                                                            handleFromChanges({ candidate_email: value });
                                                        }
                                                    }
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col ms={4} className='mb-3'>
                                            <Form.Group className="mb-3" controlId="fdormhicProject">
                                                <Form.Label>Current Employee</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Current Employee"
                                                    value={appliedFormData.candidate_current_emp}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^a-zA-Z0-9\s]/, "");

                                                        if (value?.length <= 50) {
                                                            handleFromChanges({ candidate_current_emp: value });
                                                        }
                                                    }}

                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col ms={4} className='mb-3'>
                                            <Form.Group className="mb-3" controlId="formicgggggProject">
                                                <Form.Label>Current Designation</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Current Designation"
                                                    value={appliedFormData.candidate_designation}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^a-zA-Z0-9\s]/, "");
                                                        if (value?.length <= 50) {

                                                            handleFromChanges({ candidate_designation: value });

                                                        }
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>

                                    </Row>


                                    <Row>

                                        <Col ms={4} className='mb-3'>
                                            <Form.Group className="mb-3" controlId="formicPrhhhoject">
                                                <Form.Label>Candidate Location</Form.Label>
                                                <AsyncSelect
                                                    placeholder="Location"
                                                    defaultOptions
                                                    defaultValue={option}
                                                    value={location}
                                                    loadOptions={projectLocationLoadOption}
                                                    onMenuOpen={handleMenuOpenLocationDropdown}
                                                    onChange={(option) => handleProjectLocationChange(option)}
                                                    classNamePrefix="react-select"
                                                    styles={customStyles}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col ms={4} className='mb-3'>
                                            <Form.Group className="mb-3" controlId="formicPghhhhhfroject">
                                                <Form.Label>Current CTC (LPA)</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Current CTC"
                                                    value={appliedFormData.candidate_current_ctc}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/, "");

                                                        if (value?.length <= 8) {
                                                            handleFromChanges({ candidate_current_ctc: value });
                                                        }
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col ms={4} className='mb-3'>
                                            <Form.Group className="mb-3" controlId="formicPrgggoject">
                                                <Form.Label>Expected CTC (LPA)</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Expected CTC"
                                                    value={appliedFormData.candidate_expected_ctc}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/, "");
                                                        if (value?.length <= 8) {
                                                            handleFromChanges({ candidate_expected_ctc: value });
                                                        }
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>

                                    </Row>

                                    <Row>

                                        <Col ms={6} className='mb-3'>
                                            <Form.Label>Total Experience</Form.Label>
                                            <Row>

                                                <Col sm={6}>
                                                    <Form.Group className="mb-3" controlId="formicPrhggtgoject">
                                                        <InputGroup>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="0"
                                                                value={appliedFormData.candidate_total_experience_years}
                                                                onChange={(e) => {
                                                                    const value = e.target.value.replace(/[^0-9]/, "");
                                                                    if (value?.length <= 2) {
                                                                        handleFromChanges({ candidate_total_experience_years: value });
                                                                    }
                                                                }}
                                                            />
                                                            <InputGroup.Text>Years</InputGroup.Text>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>

                                                <Col sm={6}>
                                                    <Form.Group className="mb-3" controlId="formidfdcProject">
                                                        <InputGroup>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="0"
                                                                value={appliedFormData.candidate_total_experience_months}
                                                                onChange={(e) => {
                                                                    const value = e.target.value.replace(/[^0-9]/, "");
                                                                    if (value?.length <= 2 && value <= 12) {
                                                                        handleFromChanges({ candidate_total_experience_months: value });
                                                                    }
                                                                }}
                                                            />
                                                            <InputGroup.Text>Months</InputGroup.Text>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>

                                        <Col ms={6} className='mb-3'>
                                            <Form.Label>Relevant Experience</Form.Label>
                                            <Row>

                                                <Col sm={6}>
                                                    <Form.Group className="mb-3" controlId="formicgggProject">
                                                        <InputGroup>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="0"
                                                                value={appliedFormData.candidate_relevant_experience_years}
                                                                onChange={(e) => {
                                                                    const value = e.target.value.replace(/[^0-9]/, "");
                                                                    if (value?.length <= 2) {
                                                                        handleFromChanges({ candidate_relevant_experience_years: value });
                                                                    }
                                                                }}
                                                            />
                                                            <InputGroup.Text>Years</InputGroup.Text>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>

                                                <Col sm={6}>
                                                    <Form.Group className="mb-3" controlId="formieecProject">
                                                        <InputGroup>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="0"
                                                                value={appliedFormData.candidate_relevant_experience_months}
                                                                onChange={(e) => {
                                                                    const value = e.target.value.replace(/[^0-9]/, "");
                                                                    if (value?.length <= 2 && value <= 12) {
                                                                        handleFromChanges({ candidate_relevant_experience_months: value });
                                                                    }
                                                                }}
                                                            />
                                                            <InputGroup.Text>Months</InputGroup.Text>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>

                                    </Row>


                                    <Row>

                                        <Col ms={4} className='mb-3'>
                                            <Form.Group className="mb-3" controlId="formicProject">
                                                <Form.Label>Notice Period (In A Days) </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Notice Period (In a Days)"
                                                    value={appliedFormData.candidate_notice_period}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/, "");
                                                        if (value?.length <= 2) {
                                                            handleFromChanges({ candidate_notice_period: value });
                                                        }
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col sm={4} className="mb-3">
                                            <Form.Group controlId="formicProject">
                                                <Form.Label>Last Working Date</Form.Label>

                                                <InputGroup>
                                                    <InputGroup.Text>
                                                        <AiOutlineCalendar />
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type="date"
                                                        placeholder="Choose Date"
                                                        value={appliedFormData.candidate_last_working_days}
                                                        onChange={(e) => {
                                                            handleFromChanges({ candidate_last_working_days: e.target.value });
                                                        }}
                                                        min={moment().format("YYYY-MM-DD")}
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>

                                        <Col ms={4} className='mb-3'>
                                            <Form.Group className="mb-3" controlId="formicProject">
                                                <Form.Label>Referee Name (if any)</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Referee Name"
                                                    value={appliedFormData.candidate_referee_name}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^a-zA-Z0-9\s]/, "");

                                                        if (value?.length <= 50) {
                                                            handleFromChanges({ candidate_referee_name: value });
                                                        }
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>

                                    </Row>


                                    <Row>


                                        <Col ms={4} className='mb-3'>
                                            <Form.Group className="mb-3" controlId="formicProject">
                                                <Form.Label>Linkedin Profile Links</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="https//....."
                                                    value={appliedFormData.candidate_linkedin_link}
                                                    onChange={(e) => {
                                                        handleFromChanges({ candidate_linkedin_link: e.target.value });
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>


                                        <Col ms={4} className='mb-3'>
                                            <Form.Group className="mb-3" controlId="formicProject">
                                                <Form.Label>Facebook Profile Link</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="https//....."
                                                    value={appliedFormData.candidate_facebook_link}
                                                    onChange={(e) => {
                                                        handleFromChanges({ candidate_facebook_link: e.target.value });
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col ms={4} className='mb-3'>
                                            <Form.Group className="mb-3" controlId="formicProject">
                                                <Form.Label>Instagram Profile Link</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="https//....."
                                                    value={appliedFormData.candidate_instagram_link}
                                                    onChange={(e) => {
                                                        handleFromChanges({ candidate_instagram_link: e.target.value });
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>

                                    </Row>


                                    <Row>

                                        <Col ms={6} className='mb-3'>
                                            <Form.Group className="mb-3" controlId="formicProject">
                                                <Form.Label>Resume</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    placeholder="Choose file"
                                                    accept='.pdf,.docs,docx'
                                                    onChange={(e) => {
                                                        const file = e.target.files[0]; // Get the selected file
                                                        if (file) {
                                                            handleFromChanges({ candidate_resume: file });
                                                        }
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col ms={6} className='mb-3'>
                                            <Form.Group className="mb-3" controlId="formicProject">
                                                <Form.Label>Profile Image</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    placeholder="Choose file"
                                                    accept='.jpg,.jpeg,.png'
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            handleFromChanges({ candidate_profile_img: file });
                                                        }
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>

                                    </Row>

                                    <Row>
                                        {
                                            // loading ?
                                            //     <div className='m-auto text-center'>
                                            //         <Button type="button" className='btn manpwbtn my-4'><Spinner animation="border" role="status"></Spinner></Button>
                                            //     </div> :
                                            <div className='m-auto text-center'>
                                                <Button type="button" className='btn manpwbtn my-4' onClick={handleMakeSumbit}>Submit</Button>
                                            </div>
                                        }
                                    </Row>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default AddCandidate;









