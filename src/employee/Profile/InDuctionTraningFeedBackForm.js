import React, { useEffect, useState } from "react";
import { Button, Form, Row, Spinner } from "react-bootstrap";
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";
import TypeSuggestionSelect from "./LocationSuggetion";
import { GetDesignationList } from "../../features/slices/DesignationDropDown/designationDropDown";
import { useDispatch } from "react-redux";
import { useDebounce } from 'use-debounce';
import AsyncSelect from 'react-select/async';
import { FetchDepartmentListDropDown } from "../../features/slices/departmentSlice";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderTokenMultiPart } from "../../config/api_header";


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


const InductionForm = ({ employeeDoc, setNotEdit, getEmployeeListFun }) => {


    const dispatch = useDispatch();
    const [option, setOption] = useState(null);
    const [designation, setDesignation] = useState(null);
    const [loading, setLoading] = useState(false);
    const loginData = JSON.parse(localStorage.getItem('admin_role_user')) || {};

    const [InductionState, setInductionState] = useState({
        inductionDate: null,
        inductionDuration: '',
        location: '',
        facilitatorsName: '',
        inductionVenue: '',
        organization_option1: 'Strongly Disagree',
        facilities_option1: 'Strongly Disagree',
        facilities_option2: 'Strongly Disagree',
        subject_and_content1: 'Strongly Disagree',
        subject_and_content2: 'Strongly Disagree',
        subject_and_content3: 'Strongly Disagree',
        subject_and_content4: 'Strongly Disagree',
        presentation_option1: 'Strongly Disagree',
        presentation_option2: 'Strongly Disagree',
        presentation_option3: 'Strongly Disagree',
        over_all_relevance_option1: 'Strongly Disagree',
        over_all_relevance_option2: 'Strongly Disagree',
        suggestionOfHRTraining: '',
        commentOnFurtherExtended: '',
        participantName: '',
        dateOfJoining: null,
        emp_code: '',
        emp_signature: null,
        department_id: '',
        department_name: '',
    })

    useEffect(() => {
        if (employeeDoc?.induction_form_data) {
            HandleChanges({
                inductionDate: employeeDoc.induction_form_data.date,
                inductionDuration: employeeDoc.induction_form_data.duration,
                location: employeeDoc.induction_form_data.location,
                facilitatorsName: employeeDoc.induction_form_data.name_of_facilitators,
                inductionVenue: employeeDoc.induction_form_data.venue,
                organization_option1: employeeDoc.induction_form_data.organization,
                facilities_option1: employeeDoc.induction_form_data.facilities_option_1,
                facilities_option2: employeeDoc.induction_form_data.facilities_option_2,
                subject_and_content1: employeeDoc.induction_form_data.subject_content_1,
                subject_and_content2: employeeDoc.induction_form_data.subject_content_2,
                subject_and_content3: employeeDoc.induction_form_data.subject_content_3,
                subject_and_content4: employeeDoc.induction_form_data.subject_content_4,
                presentation_option1: employeeDoc.induction_form_data.presentation_1,
                presentation_option2: employeeDoc.induction_form_data.presentation_2,
                presentation_option3: employeeDoc.induction_form_data.presentation_3,
                over_all_relevance_option1: employeeDoc.induction_form_data.over_all_usefulness_1,
                over_all_relevance_option2: employeeDoc.induction_form_data.over_all_usefulness_2,
                suggestionOfHRTraining: employeeDoc.induction_form_data.others_1,
                commentOnFurtherExtended: employeeDoc.induction_form_data.others_2,
                participantName: employeeDoc.induction_form_data.participant_name,
                dateOfJoining: employeeDoc.induction_form_data.date_of_joining,
                emp_code: employeeDoc.induction_form_data.employee_code,
                department_name: employeeDoc.induction_form_data.participant_department,
                department_id: employeeDoc.induction_form_data.participant_department,
            })
            setDesignation(
                {
                    label: employeeDoc.induction_form_data.participant_designation,
                    value: employeeDoc.induction_form_data.participant_designation
                }
            )
        }
    }, [employeeDoc])

    const HandleChanges = (obj) => {
        setInductionState(prev => (
            {
                ...prev,
                ...obj
            }
        ))
    }

    /******************* Get Designation List here  *****************/
    const projectDesignationLoadOption = async (input) => {
        const result = await dispatch(GetDesignationList(input)).unwrap();
        return result.slice(0, 10); // Limit to 10 records
    }

    // open menu drop down list project list state list dropdown ->...
    const handleMenuOpenDesignationDropdown = async () => {
        const result = await dispatch(GetDesignationList('')).unwrap();
        setOption(result);
    };

    // handle changes project state filter -> 
    const handleProjectDesignationChange = (option) => {
        setDesignation(option);
    }

    /********************** Get Department Dropdown ***********/
    const departmentLoadOption = async (input) => {
        const result = await dispatch(FetchDepartmentListDropDown(input)).unwrap();
        return result;
    }
    const departmentMenuOpen = async () => {
        const result = await dispatch(FetchDepartmentListDropDown('')).unwrap();
        setOption(result);
    }
    const handleDepartmentChanges = (option) => {
        HandleChanges({ department_id: option.value, department_name: option.label })
    }

    const handleInductionSubmit = async (event) => {
        event.preventDefault()
        if (!InductionState?.inductionDate) {
            return toast.warn('Please Choose the Induction Date');
        }
        if (!InductionState?.inductionDuration) {
            return toast.warn('Please Enter the Induction Duration');
        }
        if (!InductionState?.location) {
            return toast.warn('Please Choose or Enter Induction Location');
        }
        if (!InductionState?.facilitatorsName) {
            return toast.warn('Please Enter the Facilitator Name');
        }
        if (!InductionState?.inductionVenue) {
            return toast.warn('Please Enter the Venue Location');
        }
        if (!InductionState.organization_option1) {
            return toast.warn('Please Select the Organization Question Answers')
        }
        if (!InductionState.suggestionOfHRTraining) {
            return toast.warn('Please Add the Suggestion In HR Induction training Suggestion')
        }
        if (!InductionState.commentOnFurtherExtended) {
            return toast.warn('Please Add the Comment On induction training or areas that need to be extended further')
        }
        if (!InductionState.participantName) {
            return toast.warn('Please  Enter participant Name')
        }
        if (!designation) {
            return toast.warn('Please Select the Designation')
        }
        if (!InductionState.department_name) {
            return toast.warn('Please Select the Department')
        }
        if (!InductionState.dateOfJoining) {
            return toast.warn('Please choose Date of Joining')
        }
        if (!InductionState.emp_code) {
            return toast.warn('Please Enter Employ code')
        }

        let formData = new FormData();

        formData.append('employee_doc_id', employeeDoc?._id);
        formData.append('date', InductionState?.inductionDate);
        formData.append('duration', InductionState.inductionDuration);
        formData.append('location', InductionState.location || '');
        formData.append('location_id', InductionState.location);
        formData.append('name_of_facilitators', InductionState.facilitatorsName || '');
        formData.append('venue', InductionState.inductionVenue || '');
        formData.append('organization', InductionState.organization_option1);
        formData.append('facilities_option_1', InductionState.facilities_option1);
        formData.append('facilities_option_2', InductionState.facilities_option2);
        formData.append('subject_content_1', InductionState.subject_and_content1);
        formData.append('subject_content_2', InductionState.subject_and_content2);
        formData.append('subject_content_3', InductionState.subject_and_content3);
        formData.append('subject_content_4', InductionState.subject_and_content4);
        formData.append('presentation_1', InductionState.presentation_option1);
        formData.append('presentation_2', InductionState.presentation_option2);
        formData.append('presentation_3', InductionState.presentation_option3);
        formData.append('over_all_usefulness_1', InductionState.over_all_relevance_option1);
        formData.append('over_all_usefulness_2', InductionState.over_all_relevance_option2);
        formData.append('others_1', InductionState.suggestionOfHRTraining);
        formData.append('others_2', InductionState.commentOnFurtherExtended);
        formData.append('participant_name', InductionState.participantName || '');
        formData.append('participant_designation', designation?.label);
        formData.append('participant_department', InductionState.department_name);
        formData.append('date_of_joining', InductionState.dateOfJoining || '');
        formData.append('employee_code', InductionState.emp_code || '');
        formData.append('filename', InductionState.emp_signature ? InductionState.emp_signature : '');
        formData.append("add_by_name", loginData?.name);
        formData.append("add_by_email", loginData?.email);
        formData.append("add_by_mobile", loginData?.mobile_no);
        formData.append("add_by_designation", loginData?.designation);

        try {
            setLoading(true)
            let response = await axios.post(`${config.API_URL}addInductionFormData`, formData, apiHeaderTokenMultiPart(config.API_TOKEN))
            if (response.status === 200) {
                toast.success(response.data?.message)
                getEmployeeListFun();
            } else {
                toast.error(response.data?.message)
            }
            setLoading(false)
        } catch (error) {
            toast.error(error?.response.data?.message || 'something went wrong')
            setLoading(false)
        }
    }


    return (
        <>
            <div className="InductionForm">
                <div className='dflexbtwn'>
                    <div className='pagename'>
                        <h3>Induction Training Feedback Form</h3>
                        <p>HR Induction (New Joining)</p>
                    </div>
                    <div className='pagename'>
                        {
                            employeeDoc && employeeDoc?.induction_form_status === 'Complete' &&
                            <Button onClick={setNotEdit}>View Details page</Button>
                        }
                    </div>
                </div>
                <div className='row'>
                    <div className='sitecard'>
                        <Form className='requistn_form'>
                            <Row>
                                <div className='mb-3 col-sm-4 position-relative'>
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                        type="Date"
                                        placeholder="Choose the Date"
                                        value={InductionState.inductionDate}
                                        onChange={(e) => {
                                            let inductionDate = e.target.value;
                                            HandleChanges({ inductionDate: inductionDate })
                                        }}
                                    />
                                </div>
                                <div className='mb-3 col-sm-4'>
                                    <Form.Label>Duration</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Duration"
                                        value={InductionState.inductionDuration}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const regex = /^[0-9]*\.?[0-9]*$/;
                                            if (regex.test(value)) {
                                                HandleChanges({ inductionDuration: value })
                                            }
                                        }}
                                    />
                                </div>
                                <div className='mb-3 col-sm-4'>
                                    <Form.Label>Location</Form.Label>
                                    <TypeSuggestionSelect handleChanges={HandleChanges} inDuctionLocation={InductionState.location} />
                                </div>
                            </Row>
                            <Row>
                                <div className='mb-3 col-sm-4'>
                                    <Form.Label>Name Of Facilitators</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter The Name"
                                        value={InductionState.facilitatorsName}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[A-Za-z\s]*$/.test(value)) {
                                                HandleChanges({ facilitatorsName: value });
                                            }
                                        }}
                                    />
                                </div>
                                <div className='mb-3 col-sm-4'>
                                    <Form.Label>Venue</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Venue"
                                        value={InductionState.inductionVenue}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[A-Za-z\s]*$/.test(value)) {
                                                HandleChanges({ inductionVenue: value });
                                            }
                                        }}
                                    />
                                </div>
                            </Row>
                            <Row>
                                <div className='mb-3 col-sm-12'>
                                    <Form.Label>Organization</Form.Label>
                                    <div className="mt-3">
                                        <Form.Label className="fontStyle">I Was Informed Well In Advance About The Induction Program</Form.Label>
                                        <div className="d-flex flex-row gap-5">
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Disagree"
                                                name="formHorizontalRadios"
                                                id="formHorizontalRadios1"
                                                value={InductionState?.organization_option1}
                                                checked={InductionState?.organization_option1 === 'Strongly Disagree'}
                                                onChange={(e) => HandleChanges({ organization_option1: 'Strongly Disagree' })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Disagree"
                                                name="formHorizontalRadios"
                                                id="formHorizontalRadios2"
                                                value={InductionState?.organization_option1}
                                                checked={InductionState?.organization_option1 === 'Disagree'}
                                                onChange={(e) => HandleChanges({ organization_option1: 'Disagree' })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Neither Agree Nor Disagree"
                                                name="formHorizontalRadios"
                                                id="formHorizontalRadios3"
                                                value={InductionState?.organization_option1}
                                                checked={InductionState?.organization_option1 === 'Neither Agree Nor Disagree'}
                                                onChange={(e) => HandleChanges({ organization_option1: 'Neither Agree Nor Disagree' })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Agree"
                                                name="formHorizontalRadios"
                                                id="formHorizontalRadios3"
                                                value={InductionState?.organization_option1}
                                                checked={InductionState?.organization_option1 === 'Agree'}
                                                onChange={(e) => HandleChanges({ organization_option1: 'Agree' })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Agree"
                                                name="formHorizontalRadios"
                                                id="formHorizontalRadios4"
                                                value={InductionState?.organization_option1}
                                                checked={InductionState?.organization_option1 === 'Strongly Agree'}
                                                onChange={(e) => HandleChanges({ organization_option1: 'Strongly Agree' })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='mb-3 col-sm-12'>
                                    <Form.Label>Facilities</Form.Label>
                                    <div className="mt-3">
                                        <Form.Label className="fontStyle">1. The Ambiance Wan Conductive And Comfortable</Form.Label>
                                        <div className="d-flex flex-row gap-5">
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Disagree"
                                                name="Facilities"
                                                id="Facilities1"
                                                value="Strongly Disagree"
                                                checked={InductionState?.facilities_option1 === 'Strongly Disagree'}
                                                onChange={(e) => HandleChanges({ facilities_option1: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Disagree"
                                                name="Facilities"
                                                id="Facilities2"
                                                value="Disagree"
                                                checked={InductionState?.facilities_option1 === 'Disagree'}
                                                onChange={(e) => HandleChanges({ facilities_option1: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Neither Agree Nor Disagree"
                                                name="Facilities"
                                                id="Facilities3"
                                                value="Neither Agree Nor Disagree"
                                                checked={InductionState?.facilities_option1 === 'Neither Agree Nor Disagree'}
                                                onChange={(e) => HandleChanges({ facilities_option1: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Agree"
                                                name="Facilities"
                                                id="Facilities4"
                                                value="Agree"
                                                checked={InductionState?.facilities_option1 === 'Agree'}
                                                onChange={(e) => HandleChanges({ facilities_option1: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Agree"
                                                name="Facilities"
                                                id="Facilities5"
                                                value="Strongly Agree"
                                                checked={InductionState?.facilities_option1 === 'Strongly Agree'}
                                                onChange={(e) => HandleChanges({ facilities_option1: e.target.value })}
                                            />
                                        </div>

                                    </div>
                                    <div className="mt-3">
                                        <Form.Label className="fontStyle">2. Good Training Aids and Audio-visual aids  were used</Form.Label>
                                        <div className="d-flex flex-row gap-5">
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Disagree"
                                                name="Facilities2"
                                                id="Facilities11"
                                                value="Strongly Disagree"
                                                checked={InductionState?.facilities_option2 === 'Strongly Disagree'}
                                                onChange={(e) => HandleChanges({ facilities_option2: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Disagree"
                                                name="Facilities2"
                                                id="Facilities12"
                                                value="Disagree"
                                                checked={InductionState?.facilities_option2 === 'Disagree'}
                                                onChange={(e) => HandleChanges({ facilities_option2: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Neither Agree Nor Disagree"
                                                name="Facilities2"
                                                id="Facilities13"
                                                value="Neither Agree Nor Disagree"
                                                checked={InductionState?.facilities_option2 === 'Neither Agree Nor Disagree'}
                                                onChange={(e) => HandleChanges({ facilities_option2: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Agree"
                                                name="Facilities2"
                                                id="Facilities14"
                                                value="Agree"
                                                checked={InductionState?.facilities_option2 === 'Agree'}
                                                onChange={(e) => HandleChanges({ facilities_option2: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Agree"
                                                name="Facilities2"
                                                id="Facilities15"
                                                value="Strongly Agree"
                                                checked={InductionState?.facilities_option2 === 'Strongly Agree'}
                                                onChange={(e) => HandleChanges({ facilities_option2: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='mb-3 col-sm-12'>
                                    <Form.Label>Subject And Content</Form.Label>
                                    <div className="mt-3">
                                        <Form.Label className="fontStyle">1. Introduction to Organization (including parent organization), its leadership team , Vision , Mission & Value explained and presented neatly</Form.Label>
                                        <div className="d-flex flex-row gap-5">
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Disagree"
                                                name="subject"
                                                id="subject11"
                                                value="Strongly Disagree"
                                                checked={InductionState.subject_and_content1 === 'Strongly Disagree'}
                                                onChange={(e) => HandleChanges({ subject_and_content1: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Disagree"
                                                name="subject"
                                                id="subject12"
                                                value="Disagree"
                                                checked={InductionState.subject_and_content1 === 'Disagree'}
                                                onChange={(e) => HandleChanges({ subject_and_content1: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Neither Agree Nor Disagree"
                                                name="subject"
                                                id="subject13"
                                                value="Neither Agree Nor Disagree"
                                                checked={InductionState.subject_and_content1 === 'Neither Agree Nor Disagree'}
                                                onChange={(e) => HandleChanges({ subject_and_content1: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Agree"
                                                name="subject"
                                                id="subject14"
                                                value="Agree"
                                                checked={InductionState.subject_and_content1 === 'Agree'}
                                                onChange={(e) => HandleChanges({ subject_and_content1: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Agree"
                                                name="subject"
                                                id="subject15"
                                                value="Strongly Agree"
                                                checked={InductionState.subject_and_content1 === 'Strongly Agree'}
                                                onChange={(e) => HandleChanges({ subject_and_content1: e.target.value })}
                                            />
                                        </div>

                                    </div>
                                    <div className="mt-3">
                                        <Form.Label className="fontStyle">2. Current Position of organization , its operational footprints , products & services , donor / partners , was explained and presented neatly</Form.Label>
                                        <div className="d-flex flex-row gap-5">
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Disagree"
                                                name="subject2"
                                                id="subject21"
                                                value="Strongly Disagree"
                                                checked={InductionState?.subject_and_content2 === 'Strongly Disagree'}
                                                onChange={(e) => HandleChanges({ subject_and_content2: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Disagree"
                                                name="subject2"
                                                id="subject22"
                                                value="Disagree"
                                                checked={InductionState?.subject_and_content2 === 'Disagree'}
                                                onChange={(e) => HandleChanges({ subject_and_content2: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Neither Agree Nor Disagree"
                                                name="subject2"
                                                id="subject23"
                                                value="Neither Agree Nor Disagree"
                                                checked={InductionState?.subject_and_content2 === 'Neither Agree Nor Disagree'}
                                                onChange={(e) => HandleChanges({ subject_and_content2: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Agree"
                                                name="subject2"
                                                id="subject24"
                                                value="Agree"
                                                checked={InductionState?.subject_and_content2 === 'Agree'}
                                                onChange={(e) => HandleChanges({ subject_and_content2: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Agree"
                                                name="subject2"
                                                id="subject25"
                                                value="Strongly Agree"
                                                checked={InductionState?.subject_and_content2 === 'Strongly Agree'}
                                                onChange={(e) => HandleChanges({ subject_and_content2: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <Form.Label className="fontStyle">3. HR norms including leave, Working hours & attendance, Performance Appraisal process , Employee benefits schema & travel policy were explained properly</Form.Label>
                                        <div className="d-flex flex-row gap-5">
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Disagree"
                                                name="subject3"
                                                id="subject31"
                                                value="Strongly Disagree"
                                                checked={InductionState?.subject_and_content3 === 'Strongly Disagree'}
                                                onChange={(e) => HandleChanges({ subject_and_content3: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Disagree"
                                                name="subject3"
                                                id="subject32"
                                                value="Disagree"
                                                checked={InductionState?.subject_and_content3 === 'Disagree'}
                                                onChange={(e) => HandleChanges({ subject_and_content3: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Neither Agree Nor Disagree"
                                                name="subject3"
                                                id="subject33"
                                                value="Neither Agree Nor Disagree"
                                                checked={InductionState?.subject_and_content3 === 'Neither Agree Nor Disagree'}
                                                onChange={(e) => HandleChanges({ subject_and_content3: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Agree"
                                                name="subject3"
                                                id="subject34"
                                                value="Agree"
                                                checked={InductionState?.subject_and_content3 === 'Agree'}
                                                onChange={(e) => HandleChanges({ subject_and_content3: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Agree"
                                                name="subject3"
                                                id="subject35"
                                                value="Strongly Agree"
                                                checked={InductionState?.subject_and_content3 === 'Strongly Agree'}
                                                onChange={(e) => HandleChanges({ subject_and_content3: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <Form.Label className="fontStyle">4. HRIS (Employee Self Service ) module Introduction and usage explained by the Facilitator properly</Form.Label>
                                        <div className="d-flex flex-row gap-5">
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Disagree"
                                                name="subject4"
                                                id="subject41"
                                                value="Strongly Disagree"
                                                checked={InductionState?.subject_and_content4 === 'Strongly Disagree'}
                                                onChange={(e) => HandleChanges({ subject_and_content4: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Disagree"
                                                name="subject4"
                                                id="subject42"
                                                value="Disagree"
                                                checked={InductionState?.subject_and_content4 === 'Disagree'}
                                                onChange={(e) => HandleChanges({ subject_and_content4: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Neither Agree Nor Disagree"
                                                name="subject4"
                                                id="subject43"
                                                value="Neither Agree Nor Disagree"
                                                checked={InductionState?.subject_and_content4 === 'Neither Agree Nor Disagree'}
                                                onChange={(e) => HandleChanges({ subject_and_content4: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Agree"
                                                name="subject4"
                                                id="subject44"
                                                value="Agree"
                                                checked={InductionState?.subject_and_content4 === 'Agree'}
                                                onChange={(e) => HandleChanges({ subject_and_content4: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Agree"
                                                name="subject4"
                                                id="subject45"
                                                value="Strongly Agree"
                                                checked={InductionState?.subject_and_content4 === 'Strongly Agree'}
                                                onChange={(e) => HandleChanges({ subject_and_content4: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='mb-3 col-sm-12'>
                                    <Form.Label>Presentation / Pedagogy</Form.Label>
                                    <div className="mt-3">
                                        <Form.Label className="fontStyle">1. The Facilitator/presenter had good presentation and effective teaching skills</Form.Label>
                                        <div className="d-flex flex-row gap-5">
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Disagree"
                                                name="Presentation"
                                                id="Presentation1"
                                                value="Strongly Disagree"
                                                checked={InductionState.presentation_option1 === 'Strongly Disagree'}
                                                onChange={(e) => HandleChanges({ presentation_option1: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Disagree"
                                                name="Presentation"
                                                id="Presentation2"
                                                value="Disagree"
                                                checked={InductionState.presentation_option1 === 'Disagree'}
                                                onChange={(e) => HandleChanges({ presentation_option1: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Neither Agree Nor Disagree"
                                                name="Presentation"
                                                id="Presentation3"
                                                value="Neither Agree Nor Disagree"
                                                checked={InductionState.presentation_option1 === 'Neither Agree Nor Disagree'}
                                                onChange={(e) => HandleChanges({ presentation_option1: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Agree"
                                                name="Presentation"
                                                id="Presentation4"
                                                value="Agree"
                                                checked={InductionState.presentation_option1 === 'Agree'}
                                                onChange={(e) => HandleChanges({ presentation_option1: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Agree"
                                                name="Presentation"
                                                id="Presentation5"
                                                value="Strongly Agree"
                                                checked={InductionState.presentation_option1 === 'Strongly Agree'}
                                                onChange={(e) => HandleChanges({ presentation_option1: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <Form.Label className="fontStyle">2. The Facilitator could give value added inputs in additional to the induction content</Form.Label>
                                        <div className="d-flex flex-row gap-5">
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Disagree"
                                                name="Presentation1"
                                                id="Presentation11"
                                                value="Strongly Disagree"
                                                checked={InductionState.presentation_option2 === 'Strongly Disagree'}
                                                onChange={(e) => HandleChanges({ presentation_option2: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Disagree"
                                                name="Presentation1"
                                                id="Presentation12"
                                                value="Disagree"
                                                checked={InductionState.presentation_option2 === 'Disagree'}
                                                onChange={(e) => HandleChanges({ presentation_option2: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Neither Agree Nor Disagree"
                                                name="Presentation1"
                                                id="Presentation13"
                                                value="Neither Agree Nor Disagree"
                                                checked={InductionState.presentation_option2 === 'Neither Agree Nor Disagree'}
                                                onChange={(e) => HandleChanges({ presentation_option2: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Agree"
                                                name="Presentation1"
                                                id="Presentation14"
                                                value="Agree"
                                                checked={InductionState.presentation_option2 === 'Agree'}
                                                onChange={(e) => HandleChanges({ presentation_option2: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Agree"
                                                name="Presentation1"
                                                id="Presentation15"
                                                value="Strongly Agree"
                                                checked={InductionState.presentation_option2 === 'Strongly Agree'}
                                                onChange={(e) => HandleChanges({ presentation_option2: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <Form.Label className="fontStyle">3. Trainer wan interested and addressed participants concern</Form.Label>
                                        <div className="d-flex flex-row gap-5">
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Disagree"
                                                name="Presentation2"
                                                id="Presentation21"
                                                value="Strongly Disagree"
                                                checked={InductionState.presentation_option3 === 'Strongly Disagree'}
                                                onChange={(e) => HandleChanges({ presentation_option3: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Disagree"
                                                name="Presentation2"
                                                id="Presentation22"
                                                value="Disagree"
                                                checked={InductionState.presentation_option3 === 'Disagree'}
                                                onChange={(e) => HandleChanges({ presentation_option3: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Neither Agree Nor Disagree"
                                                name="Presentation2"
                                                id="Presentation23"
                                                value="Neither Agree Nor Disagree"
                                                checked={InductionState.presentation_option3 === 'Neither Agree Nor Disagree'}
                                                onChange={(e) => HandleChanges({ presentation_option3: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Agree"
                                                name="Presentation2"
                                                id="Presentation24"
                                                value="Agree"
                                                checked={InductionState.presentation_option3 === 'Agree'}
                                                onChange={(e) => HandleChanges({ presentation_option3: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Agree"
                                                name="Presentation2"
                                                id="Presentation25"
                                                value="Strongly Agree"
                                                checked={InductionState.presentation_option3 === 'Strongly Agree'}
                                                onChange={(e) => HandleChanges({ presentation_option3: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='mb-3 col-sm-12'>
                                    <Form.Label>Over All Relevance / Usefulness</Form.Label>
                                    <div className="mt-3">
                                        <Form.Label className="fontStyle">1. This induction is relevant to my current job &amp; use my future growth and learning</Form.Label>
                                        <div className="d-flex flex-row gap-5">
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Disagree"
                                                name="over_all_relevance_option"
                                                id="over_all_relevance_option1"
                                                value="Strongly Disagree"
                                                checked={InductionState.over_all_relevance_option1 === 'Strongly Disagree'}
                                                onChange={(e) => HandleChanges({ over_all_relevance_option1: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Disagree"
                                                name="over_all_relevance_option"
                                                id="over_all_relevance_option2"
                                                value="Disagree"
                                                checked={InductionState.over_all_relevance_option1 === 'Disagree'}
                                                onChange={(e) => HandleChanges({ over_all_relevance_option1: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Neither Agree Nor Disagree"
                                                name="over_all_relevance_option"
                                                id="over_all_relevance_option3"
                                                value="Neither Agree Nor Disagree"
                                                checked={InductionState.over_all_relevance_option1 === 'Neither Agree Nor Disagree'}
                                                onChange={(e) => HandleChanges({ over_all_relevance_option1: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Agree"
                                                name="over_all_relevance_option"
                                                id="over_all_relevance_option4"
                                                value="Agree"
                                                checked={InductionState.over_all_relevance_option1 === 'Agree'}
                                                onChange={(e) => HandleChanges({ over_all_relevance_option1: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Agree"
                                                name="over_all_relevance_option"
                                                id="over_all_relevance_option5"
                                                value="Strongly Agree"
                                                checked={InductionState.over_all_relevance_option1 === 'Strongly Agree'}
                                                onChange={(e) => HandleChanges({ over_all_relevance_option1: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <Form.Label className="fontStyle">2. I would recommend this induction to my department personnel</Form.Label>
                                        <div className="d-flex flex-row gap-5">
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Disagree"
                                                name="over_all_relevance_option1"
                                                id="over_all_relevance_option115"
                                                value="Strongly Disagree"
                                                checked={InductionState.over_all_relevance_option2 === 'Strongly Disagree'}
                                                onChange={(e) => HandleChanges({ over_all_relevance_option2: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Disagree"
                                                name="over_all_relevance_option1"
                                                id="over_all_relevance_option125"
                                                value="Disagree"
                                                checked={InductionState.over_all_relevance_option2 === 'Disagree'}
                                                onChange={(e) => HandleChanges({ over_all_relevance_option2: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Neither Agree Nor Disagree"
                                                name="over_all_relevance_option1"
                                                id="over_all_relevance_option135"
                                                value="Neither Agree Nor Disagree"
                                                checked={InductionState.over_all_relevance_option2 === 'Neither Agree Nor Disagree'}
                                                onChange={(e) => HandleChanges({ over_all_relevance_option2: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Agree"
                                                name="over_all_relevance_option1"
                                                id="over_all_relevance_option145"
                                                value="Agree"
                                                checked={InductionState.over_all_relevance_option2 === 'Agree'}
                                                onChange={(e) => HandleChanges({ over_all_relevance_option2: e.target.value })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Strongly Agree"
                                                name="over_all_relevance_option1"
                                                id="over_all_relevance_option155"
                                                value="Strongly Agree"
                                                checked={InductionState.over_all_relevance_option2 === 'Strongly Agree'}
                                                onChange={(e) => HandleChanges({ over_all_relevance_option2: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Row>
                            <Row>
                                <div className='mb-3 col-sm-12'>
                                    <Form.Label>Others</Form.Label>
                                    <div className="mt-3">
                                        <Form.Label className="fontStyle">1. What changes to the HR Induction training would you suggest? ( including time  , value , course , content , facilities , ect. )</Form.Label>
                                        <div className="mb-3 col-sm-12">
                                            <ReactQuill
                                                value={InductionState.suggestionOfHRTraining}
                                                onChange={(value) => HandleChanges({ suggestionOfHRTraining: value })}
                                                placeholder="Enter description"
                                                className="custom-quills"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <Form.Label className="fontStyle">2. Comments on the most useful parts of the induction training or areas that need to be extended further</Form.Label>
                                        <div className="mb-3 col-sm-12">
                                            <ReactQuill
                                                value={InductionState.commentOnFurtherExtended}
                                                onChange={(value) => HandleChanges({ commentOnFurtherExtended: value })}
                                                placeholder="Enter description"
                                                className="custom-quills"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Row>
                            <Row>
                                <div className='mb-3 col-sm-4'>
                                    <Form.Label>Participant Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter full Name"
                                        value={InductionState.participantName}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            HandleChanges({ participantName: value })
                                        }}
                                    />
                                </div>
                                <div className='mb-3 col-sm-4'>
                                    <Form.Label>Designation</Form.Label>
                                    <AsyncSelect
                                        placeholder="Designation"
                                        defaultOptions
                                        defaultValue={option}
                                        value={designation}
                                        loadOptions={projectDesignationLoadOption}
                                        onMenuOpen={handleMenuOpenDesignationDropdown}
                                        onChange={(option) => handleProjectDesignationChange(option)}
                                        classNamePrefix="react-select"
                                        styles={customStyles}
                                    />
                                </div>
                                <div className='mb-3 col-sm-4'>
                                    <Form.Label>Department</Form.Label>
                                    <AsyncSelect
                                        placeholder="Department"
                                        defaultOptions
                                        defaultValue={option}
                                        value={InductionState.department_id ? { value: InductionState.department_id, label: InductionState.department_name } : null}
                                        loadOptions={departmentLoadOption}
                                        onMenuOpen={departmentMenuOpen}
                                        onChange={(option) => handleDepartmentChanges(option)}
                                        classNamePrefix="react-select"
                                        styles={customStyles}
                                    />
                                </div>
                            </Row>
                            <Row>
                                <div className='mb-3 col-sm-4 position-relative'>
                                    <Form.Label>Date Of Joining</Form.Label>
                                    <Form.Control
                                        type="Date"
                                        placeholder="Choose the Date"
                                        value={InductionState.dateOfJoining}
                                        onChange={(e) => {
                                            let inductionDate = e.target.value;
                                            HandleChanges({ dateOfJoining: inductionDate })
                                        }}
                                    />
                                </div>
                                <div className='mb-3 col-sm-4'>
                                    <Form.Label>Employee Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Employee code"
                                        value={InductionState.emp_code}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            HandleChanges({ emp_code: value })
                                        }}
                                    />
                                </div>

                                <div className='mb-3 col-sm-12'>
                                    <Form.Group controlId="formFile">
                                        <Form.Label className="text-start w-100">
                                            Upload Signature(.jpeg ,.jpg ,.png)
                                        </Form.Label>
                                        <div className="customfile_upload">
                                            <input
                                                type="file"
                                                className="cstmfile w-100"
                                                onChange={(e) => HandleChanges({ emp_signature: e.target.files[0] })}
                                                accept=".jpeg ,.jpg ,.png"
                                            />
                                        </div>
                                    </Form.Group>
                                </div>
                            </Row>
                            <Row>
                                {
                                    loading ?
                                        <div className='m-auto text-center'>
                                            <Button type="button" className='btn manpwbtn my-4' ><Spinner animation="border" role="status"></Spinner></Button>
                                        </div> :
                                        <div className='m-auto text-center'>
                                            <Button type="submit" className='btn manpwbtn my-4' onClick={handleInductionSubmit}>Submit</Button>
                                        </div>
                                }
                            </Row>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InductionForm