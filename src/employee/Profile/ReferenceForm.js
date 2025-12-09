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
import { apiHeaderToken } from "../../config/api_header";


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


const ReferenceForm = ({ employeeDoc, setReferenceFormEdit ,  getEmployeeListFun }) => {


    const dispatch = useDispatch();
    const [option, setOption] = useState(null);
    const [designation, setDesignation] = useState(null);
    const [InductionState, setInductionState] = useState({
        candidateFullName: null,
        referenceDate: '',
        RefereeName: '',
        KnowReferee: '',
        capacityEmp: '',
        designation_description: '',
        fromDate: null,
        performance: 'Excellent',
        performanceResign: '',
        performanceExcellenceAreas: "",
        chanceToReEmployee: 'Yes',
        ResignFormNotEmployed: "",
        AdditionalComment: '',
        ReferenceCheckerName: '',
        ReferenceCheckerDesignation: null,
        referenceBy: '',
        refereeContactId: '',
    })
    const [loading , setLoading] = useState(false);


    const HandleChanges = (obj) => {
        setInductionState(prev => (
            {
                ...prev,
                ...obj
            }
        ))
    }

    // check the Reference check Re-fill form Data
    useEffect(() => {
        if (employeeDoc?.reference_check_form_data) {
            HandleChanges({
                candidateFullName: employeeDoc.reference_check_form_data?.name_Of_candidate,
                referenceDate: employeeDoc.reference_check_form_data?.date,
                RefereeName: employeeDoc.reference_check_form_data?.referee_name,
                referenceBy: employeeDoc.reference_check_form_data?.mode_of_reference,
                KnowReferee: employeeDoc.reference_check_form_data?.how_long_you_know,
                capacityEmp: employeeDoc.reference_check_form_data?.in_what_capacity,
                nameOfOrganization: employeeDoc.reference_check_form_data?.name_of_organization,
                refereeContactId: employeeDoc.reference_check_form_data?.mentioned_contact_id,
                designation_description: employeeDoc.reference_check_form_data?.worked_with_you_organization,
                fromDate: employeeDoc.reference_check_form_data?.worked_with_you_from_date,
                performance: employeeDoc.reference_check_form_data?.overall_work_performance,
                performanceResign: employeeDoc.reference_check_form_data?.why_data,
                performanceExcellenceAreas: employeeDoc.reference_check_form_data?.person_excelled,
                chanceToReEmployee: employeeDoc.reference_check_form_data?.re_employ_status,
                ResignFormNotEmployed: employeeDoc.reference_check_form_data?.re_employ_data,
                AdditionalComment: employeeDoc.reference_check_form_data?.comment,
                ReferenceCheckerName: employeeDoc.reference_check_form_data?.reference_checker_name,
                ReferenceCheckerDesignation: {
                    value: employeeDoc.reference_check_form_data?.reference_checker_designation,
                    label: employeeDoc.reference_check_form_data?.reference_checker_designation
                },
            })

            setDesignation({
                value: employeeDoc.reference_check_form_data?.designation_for_applied,
                label: employeeDoc.reference_check_form_data?.designation_for_applied
            })
        }
    }, [employeeDoc])

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
    const handleReferenceCheckerDesignation = (option) => {
        HandleChanges({ ReferenceCheckerDesignation: option });
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!InductionState.candidateFullName) {
            return toast.warn('Please Enter the Candidate name');
        }
        if (!InductionState.referenceDate) {
            return toast.warn('Please Choose the Date');
        }
        if (!designation) {
            return toast.warn('Please Choose the Designation For Applied');
        }
        if (!InductionState.RefereeName) {
            return toast.warn('Please Enter Referee(s) Name');
        }
        if (!InductionState.nameOfOrganization) {
            return toast.warn('Please Enter Name of Organizations');
        }
        if (!InductionState.referenceBy) {
            return toast.warn('Please Choose Mode of Reference Check');
        }
        if (!InductionState.refereeContactId) {
            return toast.warn('Please Enter Reference Contact Id');
        }
        if (!InductionState.KnowReferee) {
            return toast.warn('Please Enter How Long You know Him / Her ');
        }
        if (!InductionState.capacityEmp) {
            return toast.warn('Please Enter In What Capacity ');
        }
        if (!InductionState.designation_description) {
            return toast.warn('Please Enter I Understand That He / She Worked with you Organization As A ');
        }
        if (!InductionState.fromDate) {
            return toast.warn('Please Choose the From Date');
        }
        if (!InductionState.performance) {
            return toast.warn('Please Choose the Work Performance');
        }
        if (!InductionState.performanceResign) {
            return toast.warn('Please Enter the Performance Region');
        }
        if (!InductionState.performanceExcellenceAreas) {
            return toast.warn('Please Enter the Excellence Areas');
        }
        if (!InductionState.chanceToReEmployee) {
            return toast.warn('Please Choose the re-employee');
        }
        if (!InductionState.ResignFormNotEmployed) {
            return toast.warn('Please Enter the re-employee Region');
        }
        if (!InductionState.ReferenceCheckerName) {
            return toast.warn('Please Enter Reference Checker name');
        }
        if (!InductionState.ReferenceCheckerDesignation) {
            return toast.warn('Please Enter Reference Designation');
        }

        setLoading(true)


        let Payloads = {
            "employee_doc_id": employeeDoc?._id,
            "name_Of_candidate": InductionState.candidateFullName,
            "date": InductionState.referenceDate,
            "designation_for_applied": designation?.label,
            "referee_name": InductionState.RefereeName,
            "name_of_organization": InductionState.nameOfOrganization,
            "mode_of_reference": InductionState.referenceBy,
            "mentioned_contact_id": InductionState.refereeContactId,
            "how_long_you_know": InductionState.KnowReferee,
            "in_what_capacity": InductionState.capacityEmp,
            "worked_with_you_organization": InductionState.designation_description,
            "worked_with_you_from_date": InductionState.fromDate,
            "overall_work_performance": InductionState.performance,
            "why_data": InductionState.performanceResign,
            "person_excelled": InductionState.performanceExcellenceAreas,
            "re_employ_status": InductionState.chanceToReEmployee,
            "re_employ_data": InductionState.ResignFormNotEmployed,
            "comment": InductionState.AdditionalComment,
            "reference_checker_name": InductionState.ReferenceCheckerName,
            "reference_checker_designation": InductionState.ReferenceCheckerDesignation?.value
        }

        try {
            let response = await axios.post(`${config.API_URL}addReferenceCheckData`, Payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                toast.success(response?.data?.message);
                getEmployeeListFun()
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }

        setLoading(false)
    }


    return (
        <>
            <div className="InductionForm">
                <div className='dflexbtwn'>
                    <div className='pagename'>
                        <h3>Reference Check Form</h3>
                        <p>Candidate Reference Check</p>
                    </div>
                    {
                        employeeDoc && employeeDoc?.reference_check_form_status === 'Complete' &&
                        (
                            <div className='pagename'>
                                <Button onClick={setReferenceFormEdit}>Reference Form Details</Button>
                            </div>
                        )
                    }
                </div>
                <div className='row'>
                    <div className='sitecard'>
                        <Form className='requistn_form'>
                            <Row>
                                <div className='mb-3 col-sm-4'>
                                    <Form.Label>Name Of Candidate</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Full Name"
                                        value={InductionState.candidateFullName}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[A-Za-z\s]*$/.test(value)) {
                                                HandleChanges({ candidateFullName: value });
                                            }
                                        }}
                                    />
                                </div>
                                <div className='mb-3 col-sm-4 position-relative'>
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                        type="Date"
                                        placeholder="Choose Date"
                                        value={InductionState.referenceDate}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            HandleChanges({ referenceDate: value })
                                        }}
                                    />
                                </div>
                                <div className='mb-3 col-sm-4'>
                                    <Form.Label>Designation For Applied</Form.Label>
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
                            </Row>
                            <Row>
                                <div className='mb-3 col-sm-4'>
                                    <Form.Label>Referee(s) Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Referee(s) Name"
                                        value={InductionState.RefereeName}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[A-Za-z\s]*$/.test(value)) {
                                                HandleChanges({ RefereeName: value });
                                            }
                                        }}
                                    />
                                </div>
                                <div className='mb-3 col-sm-4'>
                                    <Form.Label>Name Of Organization</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Name Of Organization"
                                        value={InductionState.nameOfOrganization}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[A-Za-z\s]*$/.test(value)) {
                                                HandleChanges({ nameOfOrganization: value });
                                            }
                                        }}
                                    />
                                </div>
                            </Row>
                            <Row>
                                <div className='mb-3 col-sm-4'>
                                    <Form.Label>Mode of Reference Check (Phone / Email)</Form.Label>
                                    <Form.Select
                                        value={InductionState.referenceBy}
                                        onChange={(e) => {
                                            HandleChanges({ referenceBy: e.target.value });
                                        }}
                                    >
                                        <option value="">Select Mode</option>
                                        <option value="Phone">Phone</option>
                                        <option value="Email">Email</option>
                                    </Form.Select>
                                </div>
                                <div className='mb-3 col-sm-4'>
                                    <Form.Label>Mentioned Contact Id</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Contact Id"
                                        value={InductionState.refereeContactId}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            HandleChanges({ refereeContactId: value });
                                        }}
                                    />
                                </div>
                            </Row>

                            <Row>
                                <div className='mb-3 col-sm-6'>
                                    <Form.Label>1. How Long You know Him / Her ?</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Write the Description....."
                                        value={InductionState.KnowReferee}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            HandleChanges({ KnowReferee: value });
                                        }}
                                    />
                                </div>
                                <div className='mb-3 col-sm-6'>
                                    <Form.Label>2. In What Capacity</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Description....."
                                        value={InductionState.capacityEmp}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            HandleChanges({ capacityEmp: value });

                                        }}
                                    />
                                </div>
                            </Row>
                            <Row>
                                <div className='mb-3 col-sm-6'>
                                    <Form.Label>3. I Understand That He / She Worked with you Organization As A</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Description..."
                                        value={InductionState.designation_description}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            HandleChanges({ designation_description: value });
                                        }}
                                    />
                                </div>
                                <div className='mb-3 col-sm-6 position-relative'>
                                    <Form.Label>4. From </Form.Label>
                                    <Form.Control
                                        type="Date"
                                        placeholder="From Date"
                                        value={InductionState.fromDate}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            HandleChanges({ fromDate: value });

                                        }}
                                    />
                                </div>
                            </Row>

                            <Row>
                                <div className='mb-3 col-sm-12'>
                                    <div className="mt-3">
                                        <Form.Label >5. How would you describe his/her overall work performance - Excellence , Good  , Average or Poor and Why </Form.Label>
                                        <div className="d-flex flex-row gap-5">
                                            <input
                                                type="radio"
                                                name="performance"
                                                value="Excellent"
                                                checked={InductionState.performance === 'Excellent'}
                                                onChange={(e) => HandleChanges({ performance: e.target.value })}
                                            /> Excellent
                                            <input
                                                type="radio"
                                                name="performance"
                                                value="Good"
                                                checked={InductionState.performance === 'Good'}
                                                onChange={(e) => HandleChanges({ performance: e.target.value })}
                                            /> Good
                                            <input
                                                type="radio"
                                                name="performance"
                                                value="Average"
                                                checked={InductionState.performance === 'Average'}
                                                onChange={(e) => HandleChanges({ performance: e.target.value })}
                                            /> Average
                                            <input
                                                type="radio"
                                                name="performance"
                                                value="Poor"
                                                checked={InductionState.performance === 'Poor'}
                                                onChange={(e) => HandleChanges({ performance: e.target.value })}
                                            /> Poor
                                        </div>


                                    </div>
                                    <div className="mt-3">
                                        <Form.Label className="">Why</Form.Label>
                                        <div className="mb-3 col-sm-12">
                                            <ReactQuill
                                                value={InductionState.performanceResign}
                                                onChange={(value) => HandleChanges({ performanceResign: value })}
                                                placeholder="Enter description"
                                                className="custom-quills"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <Form.Label className="">6. Are There any specific areas where the person excelled ? ( List )</Form.Label>
                                        <div className="mb-3 col-sm-12">
                                            <ReactQuill
                                                value={InductionState.performanceExcellenceAreas}
                                                onChange={(value) => HandleChanges({ performanceExcellenceAreas: value })}
                                                placeholder="Enter description"
                                                className="custom-quills"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <Form.Label >7. Would you re-employ this person if you were given the opportunity? if `No` why not ? YES </Form.Label>
                                        <div className="d-flex flex-row gap-5">
                                            <Form.Check
                                                type="radio"
                                                label="Yes"
                                                name="formHorizontalRadios"
                                                id="formHorizontalRadios1"
                                                value={InductionState.chanceToReEmployee}
                                                checked={InductionState.chanceToReEmployee === 'Yes'}
                                                onChange={() => HandleChanges({ chanceToReEmployee: "Yes" })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="No"
                                                name="formHorizontalRadios"
                                                id="formHorizontalRadios2"
                                                value={InductionState.chanceToReEmployee}
                                                checked={InductionState.chanceToReEmployee === 'No'}
                                                onChange={() => HandleChanges({ chanceToReEmployee: "No" })}
                                            />

                                        </div>
                                        <div className="mb-3 col-sm-12 mt-2">
                                            <ReactQuill
                                                value={InductionState.ResignFormNotEmployed}
                                                onChange={(value) => HandleChanges({ ResignFormNotEmployed: value })}
                                                placeholder="Enter description"
                                                className="custom-quills"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <Form.Label className="">8. Additional Comment (Optional)</Form.Label>
                                        <div className="mb-3 col-sm-12">
                                            <ReactQuill
                                                value={InductionState.AdditionalComment}
                                                onChange={(value) => HandleChanges({ AdditionalComment: value })}
                                                placeholder="Enter description"
                                                className="custom-quills"
                                            />
                                        </div>
                                    </div>

                                </div>
                            </Row>

                            <Row>
                                <div className='mb-3 col-sm-6'>
                                    <Form.Label>Name if Reference Checker</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Reference Checker Name"
                                        value={InductionState.ReferenceCheckerName}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            HandleChanges({ ReferenceCheckerName: value })
                                        }}
                                    />
                                </div>

                                <div className='mb-3 col-sm-6'>
                                    <Form.Label>Designation</Form.Label>
                                    <AsyncSelect
                                        placeholder="Designation"
                                        defaultOptions
                                        defaultValue={option}
                                        value={InductionState.ReferenceCheckerDesignation}
                                        loadOptions={projectDesignationLoadOption}
                                        onMenuOpen={handleMenuOpenDesignationDropdown}
                                        onChange={(option) => handleReferenceCheckerDesignation(option)}
                                        classNamePrefix="react-select"
                                        styles={customStyles}
                                    />
                                </div>
                            </Row>
                            <Row>
                                <div className='m-auto text-center'>
                                    <Button type="submit" onClick={handleSubmit} className='btn manpwbtn my-4 position-relative' disabled={loading}>
                                        {
                                            loading ? <Spinner animation="border" role="status"></Spinner> : 'Submit'
                                        }
                                    </Button>
                                </div>
                            </Row>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReferenceForm



