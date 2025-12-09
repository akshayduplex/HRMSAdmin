
import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import GoBackButton from '../goBack/GoBackButton';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import AllHeaders from '../partials/AllHeaders';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken, apiHeaderTokenMultiPart } from '../../config/api_header';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { GetDesignationList } from "../slices/DesignationDropDown/designationDropDown";
import { useDispatch } from "react-redux";
import { FetchProjectListDropDown, FetchProjectListDropDownOnScroll, FetchProjectLocationStateVise } from "../slices/ProjectListDropDown/ProjectListDropdownSlice";
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import { useNavigate } from 'react-router-dom';
import { Col, InputGroup, Modal, Spinner } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { ManPowerAcquisitionsSlice } from '../slices/JobSortLIstedSlice/SortLIstedSlice';
import moment from 'moment';
import { AiOutlineCalendar, AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { filter } from 'lodash';
import { AsyncPaginate } from 'react-select-async-paginate';



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

const customStylesLocation = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#D2C9FF',
        },
        minHeight: '100px', // Increase height of the select box
        // width: '300px', // Increase width of the select box
        paddingLeft: '10px',
        textAlign: 'left',
    }),
    menu: (provided) => ({
        ...provided,
        borderTop: 'none',
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
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#29166F',
        borderRadius: '5px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#fff',
        fontSize: '14px',
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: '#fff',
        '&:hover': {
            backgroundColor: '#4CAF50', // Hover effect on the remove button
            color: '#fff',
        },
    }),
};

const ManPowerAcquisitions = () => {
    const dispatch = useDispatch();
    const [vacancyProject, setVacancyProject] = useState(null);
    const [designation, setDesignation] = useState(null);
    const [option, setOptions] = useState([]);
    const [department, setDepartment] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [status, setStatus] = useState('new');
    const [annumCTC, setAnnumCTC] = useState('');
    const [monthlyCTC, setMonthlyCTC] = useState('');
    const [grade, setGrade] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [minimumEx, setMinimumEx] = useState('');
    const [maximumEx, setMaximumEx] = useState('');
    const [vacancies, setVacancies] = useState('');
    const [posting, setPosting] = useState([]);
    const [location, setLocation] = useState([]);
    const [reporting, setReporting] = useState('');
    const [days, setDays] = useState('');
    const [description, setDescription] = useState('');
    const [qualification, setQualification] = useState('');
    const [skills, setSkills] = useState('');
    const [img, setImg] = useState('');
    const [resedDate, setRaisedDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const [fund, setFundType] = useState('Funded')
    const [mprSelectedValue, setMprSelectValue] = useState(null);
    const [employee, setemployee] = useState([{
        name: '',
        id: 0
    }])
    const [replacement_date, set_replacement_date] = useState(moment().format('YYYY-MM-DD'))
    const [deadline_date, set_deadline_date] = useState('')
    const [openRepacementModal, setReplacementModalOpen] = useState(false);
    const [mprOptions, setMprOptions] = useState([]);
    const [role, setRole] = useState('');

    const handleChange = (e) => {
        const selectedRole = e.target.value;
        setRole(selectedRole);
    };


    const navigation = useNavigate();

    //  handle project_estimated list 
    const [projectEstimatedList, setProjectEstimated] = useState([]);

    let userDetails = JSON.parse(localStorage.getItem('admin_role_user') ?? {})

    let id = searchParams.get('id')

    useEffect(() => {
        if (id) {
            (async () => {
                try {
                    let payload = { "_id": id }
                    let response = await axios.post(`${config.API_URL}getRequisitionDataById`, payload, apiHeaderToken(config.API_TOKEN));
                    if (response.status === 200) {
                        let data = response.data.data;
                        setVacancyProject({ value: data?.project_id, label: data?.project_name })
                        setDesignation({ value: data?.designation_name, label: data?.designation_name, id: data?.designation_id })
                        setSelectedDepartment({ value: data?.department_id, label: data?.department_name })
                        setStatus(data?.type_of_opening)
                        setAnnumCTC(data?.ctc_per_annum)
                        setRole(data?.mode_of_employment)
                        setMonthlyCTC(data?.ctc_per_month)
                        setSelectedGrade({ value: data?.grade, label: data?.grade });
                        setMinimumEx(data?.minimum_experience)
                        setMaximumEx(data?.maximum_experience)
                        setVacancies(data?.no_of_vacancy)
                        setRaisedDate(moment(data?.raised_on).format('YYYY-MM-DD'))
                        setReporting({ value: data?.reporting_structure, label: data?.reporting_structure, id: data?.reporting_structure_id })
                        setDays(data?.vacancy_frame)
                        setPosting(data?.place_of_posting?.map((item) => {
                            return {
                                label: item.location_name,
                                value: item.location_id,
                                state_id: item?.state_id,
                                state_name: item?.state_name
                            }
                        }))
                        setDescription(data?.job_description)
                        setQualification(data?.qualification)
                        setSkills(data?.skills)
                        setFundType(data?.fund_type)
                        // setImg(data?.requisition_form)
                    }
                } catch (error) {
                    console.log(error);
                }

            })()
        }

    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (!vacancyProject) {
            return toast.warn('Please Choose the Project');
        }
        if (!designation) {
            return toast.warn('Please Choose the Designation');
        }
        if (!selectedDepartment) {
            return toast.warn('Please Select The Department');
        }
        if (!status) {
            return toast.warn('Please Select The type Of Opening');
        }
        if (!annumCTC) {
            return toast.warn('Please Enter the Annum CTC');
        }
        if (!monthlyCTC) {
            return toast.warn('Please Enter the Monthly CTC');
        }
        if (!selectedGrade) {
            return toast.warn('Please Select The Grade');
        }
        if (!minimumEx) {
            return toast.warn('Please Enter the Minimum Experience');
        }
        if (!maximumEx) {
            return toast.warn('Please Enter the Maximum Experience');
        }
        if (!posting) {
            return toast.warn('Please Enter the Posting Location');
        }
        if (!reporting) {
            return toast.warn('Please Select the Reporting structure')
        }

        if (status === 'replacement' && !id) {
            if (!mprSelectedValue) {
                setReplacementModalOpen(true)
                return toast.warn('Please Select the MPR');
            }
            if (!replacement_date) {
                setReplacementModalOpen(true)
                return toast.warn('Please Enter the Replacement Date');
            }
            if (!employee.every(emp => emp.name.trim() !== '')) {
                setReplacementModalOpen(true)
                return toast.warn('Please Enter Employee Name');
            }
            if (!deadline_date) {
                setReplacementModalOpen(true)
                return toast.warn('Please Enter the Deadline Date');
            }
        }

        setLoading(true)

        formData.append('project_id', vacancyProject ? vacancyProject.value : '');
        formData.append('project_name', vacancyProject ? vacancyProject.label : '');
        formData.append('designation_id', designation ? designation.id : '');
        formData.append('designation_name', designation ? designation.value : '');
        formData.append('department_id', selectedDepartment ? selectedDepartment.value : '');
        formData.append('department_name', selectedDepartment ? selectedDepartment.label : '');
        formData.append('type_of_opening', status);
        formData.append('ctc_per_annum', annumCTC);
        formData.append('ctc_per_month', monthlyCTC);
        formData.append('grade', selectedGrade ? selectedGrade.value : '');
        formData.append('minimum_experience', minimumEx);
        formData.append('maximum_experience', maximumEx);
        formData.append('mode_of_employment', role);
        formData.append('no_of_vacancy', vacancies);
        formData.append('place_of_posting', JSON.stringify(posting?.map((loc) => {
            return { location_name: loc.label, location_id: loc.value, state_id: loc.state_id, state_name: loc.state }
        })))
        formData.append('reporting_structure', reporting?.label);
        formData.append('reporting_structure_id', reporting?.id);
        formData.append('vacancy_frame', days);
        formData.append('job_description', description);
        formData.append('qualification', qualification);
        formData.append('status', "Pending");
        formData.append('skills', skills);
        formData.append('filename', img);
        formData.append('raised_on', resedDate);
        formData.append('raised_by', userDetails?.name);
        formData.append('raised_by_designation', userDetails?.designation);
        formData.append('raised_by_mobile', userDetails?.mobile_no);
        formData.append('fund_type', fund);

        if (status === 'replacement') {
            formData.append('replacement_mpr_id', mprSelectedValue?.value);
            formData.append('replacement_mpr_title', mprSelectedValue?.label);
            formData.append('replacement_employee', JSON.stringify(employee?.map((item) => item?.name)));
            formData.append('replacement_date', replacement_date);
            formData.append('replacement_deadline', deadline_date);
        }

        if (id) {
            formData.append('_id', id);
            // AddRequisitionDataWithOldMpr
        }

        try {
            const response = await axios.post(`${config.API_URL}${id ? 'editRequisitionData' : status === 'new' ? 'AddRequisitionData' : "AddRequisitionDataWithOldMpr"}`, formData, apiHeaderTokenMultiPart(config.API_TOKEN));
            setLoading(false);
            if (response.status === 200) {
                toast.success(response.data?.message);
                setVacancyProject(null);
                setDesignation(null);
                setDepartment([]);
                setSelectedDepartment(null);
                setStatus('');
                setAnnumCTC('');
                setMonthlyCTC('');
                setGrade([]);
                setSelectedGrade(null);
                setMinimumEx('');
                setMaximumEx('');
                setVacancies('');
                setPosting([]);
                setLocation([]);
                setReporting('');
                setDays('');
                setDescription('');
                setQualification('');
                setSkills('');
                setImg('');
                setRaisedDate(null);
                setProjectEstimated([]);
                setTimeout(() => {
                    navigation("/manpower-acquisition-list")
                }, 500);
            } else {
                toast.error(response.data.data?.message);
            }
        } catch (error) {
            setLoading(false);
            toast.error(error?.response?.data?.message ?? error?.response?.data?.error?.message ?? error?.message);
        }
    };

    const projectLoadOptionPageNations = async (inputValue, loadedOptions, { page }) => {
        const payload = {
            keyword: inputValue,
            page_no: page.toString(),
            per_page_record: "10",
            scope_fields: ["_id", "title", "budget_estimate_list", "location"],
            status: "Active"
        };

        const result = await dispatch(FetchProjectListDropDownOnScroll(payload)).unwrap();

        return {
            options: result, // must be array of { label, value } objects
            hasMore: result.length >= 10, // if true, next page will load
            additional: {
                page: page + 1
            }
        };
    };


    const projectMenuOpen = async () => {
        const result = await dispatch(FetchProjectListDropDown('')).unwrap();
        setOptions(result);
    };

    const handleProjectChanges = (option) => {
        setDesignation(null)
        setVacancyProject(option);
        setProjectEstimated(option?.budget_estimate_list?.map((item, index) => {
            return {
                label: item.designation,
                value: item.designation,
                id: item.designation_id ? item.designation_id : null,
                no_of_vacancy: item?.no_of_positions ?? 0,
                ctc: item?.ctc
            }
        }))
        setLocation(option?.location?.map((item) => {
            return {
                label: item.name,
                value: item.id,
                state_id: item?.state_id,
                state_name: item?.state_name
            }
        }))
    };

    /****************** Get Designation List here  ****************/

    const handleProjectDesignationChange = (option) => {
        setDesignation(option);
        setAnnumCTC(option?.ctc);
        setMonthlyCTC(parseInt(option?.ctc) ? parseInt(parseInt(option?.ctc) / 12) : '')
        setVacancies(option?.no_of_vacancy)
    };

    /****************** Get getDepartment List here  ****************/

    const getDepartment = async () => {
        const payload = {
            status: 'Active',
            "page_no": "1",
            "per_page_record": "1000",
        };
        try {
            let response = await axios.post(`${config.API_URL}getDepartmentList`, payload, apiHeaderToken(config.API_TOKEN));
            const options = response?.data?.data?.map(dept => ({ value: dept?._id, label: dept?.name }));
            setDepartment(options);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getDepartment()
    }, [])


    const getGradeList = async () => {
        const payload = { status: 'Active' };
        try {
            let response = await axios.post(`${config.API_URL}getGradeList`, payload, apiHeaderToken(config.API_TOKEN));
            const options = response?.data?.data?.map(dept => ({ value: dept?.name, label: dept?.name }));
            setGrade(options);
        } catch (error) {
            console.error(error);
        }
    };

    // Location Load Option Data -------->>>>>>>>>>
    /********************* Get the District List DropDown ******************/
    const districtLoadOption = async (input) => {
        const result = await dispatch(FetchProjectLocationStateVise(input)).unwrap();
        return result?.map((item) => {
            return {
                value: item?._id,
                label: `${item?.name} , ${item?.state}`
            }
        })
    }

    const districtMenuOpen = async () => {
        const result = await dispatch(FetchProjectLocationStateVise('')).unwrap();
        setOptions(result?.map((item) => {
            return {
                value: item?._id,
                label: `${item?.name} , ${item?.state}`
            }
        }));
    }

    const handleDistrictChanges = (option) => {
        setPosting(option)
    }

    // Fetch the Designation And Sets on the Reporting Structure Form

    const HandleDesignationLoadOption = async (input) => {
        const result = await dispatch(GetDesignationList(input)).unwrap();
        return result;
    }
    const DesignationMenuOpen = async () => {
        const result = await dispatch(GetDesignationList('')).unwrap();
        setOptions(result);
    }

    useEffect(() => {
        getGradeList()
    }, [])

    // Open the Replacement Job Modal to Pick the replacement Ares -
    useEffect(() => {
        if (status === 'replacement' && !id) {
            setReplacementModalOpen(true);
        }
    }, [status, id])




    const loadInputChangeMpr = async (input) => {

        if (!vacancyProject) {
            // toast.error('Please select a project');
            return []
        }

        let Payloads = {
            "keyword": input,
            "page_no": "1",
            "per_page_record": "10",
            "scope_fields": [],
            "status": "",
            "project_id": vacancyProject?.value || "",
        }

        let response = await dispatch(ManPowerAcquisitionsSlice(Payloads)).unwrap();

        return response?.data?.map((item) => {
            return {
                value: item?._id,
                label: `${item?.title} , ( ${item?.project_name} , ${item?.designation_name} )`,
                other: item
            }
        }) || [];
    }

    const handleOpenMprMerge = async () => {

        if (!vacancyProject) {
            return toast.error('Please Select the Project')
        }

        if (!designation) {
            return toast.error("Please Select the Designation")
        }

        let Payloads = {
            "keyword": "",
            "page_no": "1",
            "per_page_record": "10000",
            "scope_fields": [],
            "status": "",
            "project_id": vacancyProject?.value || "",
        }

        let response = await dispatch(ManPowerAcquisitionsSlice(Payloads)).unwrap();

        console.log(response.data, 'this is response');


        // setOptions(response?.data?.map((item) => {
        //     return {
        //         value: item?._id,
        //         label: item?.title,
        //         other: item
        //     }
        // }) || [])


        setMprOptions(response?.data?.filter((item) => item?.designation_id === designation?.id).map((item) => {
            return {
                value: item?._id,
                label: `${item?.title} , ( ${item?.project_name} , ${item?.designation_name} )`,
                other: item
            }
        }) || []);
    }

    const handleMprSelectChanges = (option) => {

        setMprSelectValue(option)

        setVacancyProject({ value: option?.other?.project_id, label: option?.other?.project_name })
        setDesignation({ value: option?.other?.designation_name, label: option?.other?.designation_name, id: option?.other?.designation_id })
        setSelectedDepartment({ value: option?.other?.department_id, label: option?.other?.department_name })
        // setStatus(option?.other?.type_of_opening)
        setAnnumCTC(option?.other?.ctc_per_annum)
        setMonthlyCTC(option?.other?.ctc_per_month)
        setSelectedGrade({ value: option?.other?.grade, label: option?.other?.grade });
        setMinimumEx(option?.other?.minimum_experience)
        setMaximumEx(option?.other?.maximum_experience)
        setVacancies(option?.other?.no_of_vacancy)
        setRaisedDate(moment(option?.other?.raised_on).format('YYYY-MM-DD'))
        let dateLine = option?.other?.deadline_date
        if (dateLine && moment(dateLine).isSameOrAfter(moment(), 'day')) {
            set_deadline_date(moment(dateLine).format('YYYY-MM-DD'));
        }
        setReporting({ value: option?.other?.reporting_structure, label: option?.other?.reporting_structure, id: option?.other?.reporting_structure_id })
        setDays(option?.other?.vacancy_frame)
        setPosting(option?.other?.place_of_posting?.map((item) => {
            return {
                label: item.location_name,
                value: item.location_id,
                state_id: item?.state_id,
                state_name: item?.state_name
            }
        }))
        setDescription(option?.other?.job_description)
        setQualification(option?.other?.qualification)
        setSkills(option?.other?.skills)
        setFundType(option?.other?.fund_type)
    }

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className='dflexbtwn'>
                        <div className='pagename'>
                            <h3>Manpower Requisition Form</h3>
                            <p>Requisition raise request</p>
                        </div>
                        <div className='linkbtn'>
                            <Link to='/manpower-acquisition-list'>
                                <button className='purplbtn'>View List</button>
                            </Link>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='sitecard'>
                            <Form className='requistn_form' onSubmit={handleSubmit}>
                                <Row>

                                    <div className='mb-3 col-sm-12 d-flex'>
                                        <div className='mb-3 col-sm-4'>
                                            <Form.Label>Type of Opening</Form.Label>
                                            <div className="d-flex flex-row gap-3 mt-3">
                                                <Form.Check
                                                    type="radio"
                                                    label="New Opening"
                                                    name="formHorizontalRadios"
                                                    id="formHorizontalRadios1"
                                                    value={status}
                                                    checked={status === 'new'}
                                                    onChange={() => setStatus('new')}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    label="Replacement"
                                                    name="formHorizontalRadios"
                                                    id="formHorizontalRadios2"
                                                    value={status}
                                                    checked={status === 'replacement'}
                                                    onChange={() => setStatus('replacement')}
                                                />
                                                {/* <Form.Check
                                                type="radio"
                                                label="Planned Addition budgeted/Non-budgeted"
                                                name="formHorizontalRadios"
                                                id="formHorizontalRadios3"
                                                value={status}
                                                checked={status === 'planned_non_budgeted'}
                                                onChange={() => setStatus('planned_non_budgeted')}
                                            /> */}
                                            </div>
                                        </div>
                                        <div className='mb-3 col-sm-4'>
                                            <Form.Label>Fund Type</Form.Label>
                                            <div className="d-flex flex-row gap-3 mt-3">
                                                <Form.Check
                                                    type="radio"
                                                    label="Funded"
                                                    name="formHorizontalRadios1"
                                                    id="formHorizontalRadios11"
                                                    value={fund}
                                                    checked={fund === 'Funded'}
                                                    onChange={() => setFundType('Funded')}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    label="Non Funded"
                                                    name="formHorizontalRadios11"
                                                    id="formHorizontalRadios21"
                                                    value={fund}
                                                    checked={fund === 'Non Funded'}
                                                    onChange={() => setFundType('Non Funded')}
                                                />
                                                {/* <Form.Check
                                                type="radio"
                                                label="Planned Addition budgeted/Non-budgeted"
                                                name="formHorizontalRadios"
                                                id="formHorizontalRadios3"
                                                value={status}
                                                checked={status === 'planned_non_budgeted'}
                                                onChange={() => setStatus('planned_non_budgeted')}
                                            /> */}
                                            </div>
                                        </div>

                                        <div className='mb-3 col-sm-4'>
                                            <Form.Group controlId="roleSelect">
                                                <Form.Label>Mode Of Employment</Form.Label>
                                                <Form.Select value={role} onChange={handleChange}>
                                                    <option value="">-- Select --</option>
                                                    <option value="OnContract">On Consultant</option>
                                                    <option value="OnRole">On Role</option>
                                                    <option value="Empanelled">Empanelled</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className='mb-3 col-sm-4'>
                                        <Form.Label>Vacancy Under Project</Form.Label>
                                        <AsyncPaginate
                                            placeholder="Select Project"
                                            value={vacancyProject}
                                            loadOptions={projectLoadOptionPageNations}
                                            onChange={(option) => handleProjectChanges(option)}
                                            debounceTimeout={300}
                                            isClearable
                                            styles={customStyles}
                                            additional={{
                                                page: 1
                                            }}
                                            classNamePrefix="react-select"
                                        />
                                    </div>
                                    <div className='mb-3 col-sm-4'>
                                        <Form.Label>Designation</Form.Label>
                                        <Select
                                            placeholder="Designation"
                                            value={designation}
                                            options={projectEstimatedList}
                                            onChange={(option) => handleProjectDesignationChange(option)}
                                            classNamePrefix="react-select"
                                            onMenuOpen={() => {
                                                if (!vacancyProject) {
                                                    toast.error('Please choose the project first');
                                                    return false;  // Prevent the menu from opening
                                                }
                                            }}
                                            isSearchable
                                            styles={customStyles}
                                        />
                                    </div>
                                    <div className='mb-3 col-sm-4'>
                                        <Form.Label>Department</Form.Label>
                                        <Select
                                            styles={customStyles}
                                            options={department}
                                            placeholder="Select Department"
                                            value={selectedDepartment}
                                            onChange={(selectedOption) => setSelectedDepartment(selectedOption)}
                                        />
                                    </div>
                                </Row>
                                <Row>
                                    <div className='mb-3 col-sm-4'>
                                        <Form.Label>CTC Proposed per Annum</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter per annum CTC"
                                            value={annumCTC}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const regex = /^[0-9]*\.?[0-9]*$/; // Regex for numbers with optional decimal
                                                if (regex.test(value)) {
                                                    setAnnumCTC(value); // Update state only if valid number
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className='mb-3 col-sm-4'>
                                        <Form.Label>CTC Proposed (Monthly)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter monthly CTC"
                                            value={monthlyCTC}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const regex = /^[0-9]*\.?[0-9]*$/; // Regex for numbers with optional decimal
                                                if (regex.test(value)) {
                                                    setMonthlyCTC(value); // Update state only if valid number
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className='mb-3 col-sm-4'>
                                        <Form.Label>Grade</Form.Label>
                                        <Select
                                            styles={customStyles}
                                            options={grade}
                                            placeholder="Select Grade"
                                            value={selectedGrade}
                                            onChange={(selectedOption) => setSelectedGrade(selectedOption)}
                                        />
                                    </div>
                                    <div className='mb-3 col-sm-4'>
                                        <Form.Label>Minimum Experience (Years) </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Minimum Experience"
                                            value={minimumEx}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const regex = /^[0-9]*\.?[0-9]*$/; // Regex for numbers with optional decimal
                                                if (regex.test(value)) {
                                                    setMinimumEx(value); // Update state only if valid number
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className='mb-3 col-sm-4'>
                                        <Form.Label>Maximum Experience (Years)</Form.Label>

                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Maximum Experience"
                                            value={maximumEx}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const regex = /^[0-9]*\.?[0-9]*$/; // Regex for numbers with optional decimal
                                                if (regex.test(value)) {
                                                    setMaximumEx(value); // Update state only if valid number
                                                }
                                            }}
                                        />


                                    </div>
                                    <div className='mb-3 col-sm-4'>
                                        <Form.Label>No. of Vacancies</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter no. of openings"
                                            value={vacancies}
                                            onChange={(e) => setVacancies(e.target.value)}
                                        />
                                    </div>
                                    <div className='mb-3 col-sm-4 position-relative'>
                                        <Form.Label>Requisition Raised Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder="Choose the Date"
                                            value={resedDate} // Set the value in 'YYYY-MM-DD' format
                                            onChange={(e) => setRaisedDate(e.target.value)} // Update the value on change
                                        />
                                    </div>
                                    <div className='mb-3 col-sm-4'>
                                        <Form.Label>Reporting Structure</Form.Label>
                                        <AsyncSelect
                                            placeholder="Reporting Structure"
                                            defaultOptions
                                            defaultValue={option}
                                            value={reporting}
                                            loadOptions={HandleDesignationLoadOption}
                                            onMenuOpen={DesignationMenuOpen}
                                            onChange={(option) => {
                                                setReporting(option)
                                            }}
                                            classNamePrefix="react-select"
                                            styles={customStyles}
                                        />
                                    </div>
                                    <div className='mb-3 col-sm-4'>
                                        <Form.Label>Time Frame To Fill The Vacancy</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter no. of days"
                                            value={days}
                                            // onChange={(e) => setDays(e.target.value)}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const regex = /^[0-9]*\.?[0-9]*$/; // Regex for numbers with optional decimal
                                                if (regex.test(value)) {
                                                    setDays(value); // Update state only if valid number
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className='mb-3 col-sm-12'>
                                        <Form.Label>Place of Posting</Form.Label>
                                        <AsyncSelect
                                            cacheOptions
                                            isMulti
                                            defaultOptions
                                            defaultValue={option}
                                            loadOptions={districtLoadOption}
                                            value={posting}
                                            onMenuOpen={districtMenuOpen}
                                            placeholder="Select Location"
                                            onChange={handleDistrictChanges}
                                            classNamePrefix="react-select"
                                            styles={customStylesLocation}
                                        />
                                    </div>
                                    <div className='mb-3 col-sm-12'>
                                        <Form.Label>Job Description</Form.Label>
                                        <ReactQuill
                                            value={description}
                                            onChange={(value) => setDescription(value)}
                                            placeholder="Enter description"
                                            className="custom-quills"
                                        />
                                    </div>
                                    <div className='mb-3 col-sm-12'>
                                        <Form.Label>Qualification</Form.Label>
                                        <ReactQuill
                                            value={qualification}
                                            onChange={(value) => setQualification(value)}
                                            placeholder="Enter description"
                                            className="custom-quills"
                                        />
                                    </div>
                                    <div className='mb-3 col-sm-12'>
                                        <Form.Label>Skills</Form.Label>
                                        <ReactQuill
                                            value={skills}
                                            onChange={(value) => setSkills(value)}
                                            placeholder="Enter description"
                                            className="custom-quills"
                                        />
                                    </div>
                                    <div className='mb-3 col-sm-12'>
                                        <Form.Group controlId="formFile">
                                            <Form.Label className="text-start w-100">
                                                Upload Manpower Requisition Document(.pdf .docs) (Optional)
                                            </Form.Label>
                                            <div className="customfile_upload">
                                                <input
                                                    type="file"
                                                    className="cstmfile w-100"
                                                    // value={img}
                                                    onChange={(e) => setImg(e.target.files[0])}
                                                    accept=".pdf,.doc,.docx"
                                                />
                                            </div>
                                        </Form.Group>
                                    </div>
                                </Row>
                                <Row>
                                    {
                                        loading ?
                                            <div className='m-auto text-center'>
                                                <Button type="button" className='btn manpwbtn my-4'><Spinner animation="border" role="status"></Spinner></Button>
                                            </div> :
                                            <div className='m-auto text-center'>
                                                <Button type="submit" className='btn manpwbtn my-4'>Submit</Button>
                                            </div>
                                    }
                                </Row>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>


            {/* Open Replacement Modal To Open the Modals Data - to Keep the Existing Mpr */}
            <Modal
                show={openRepacementModal}
                onHide={() => setReplacementModalOpen(false)}
                size='lg'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Replacement MPR</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <Form> */}

                    <Row>
                        <Col sm={6} lg={6} md={6} className='mb-3' >
                            <Form.Label>MPR Under Project</Form.Label>
                            <AsyncPaginate
                                placeholder="Select Project"
                                value={vacancyProject}
                                loadOptions={projectLoadOptionPageNations}
                                onChange={(option) => handleProjectChanges(option)}
                                debounceTimeout={300}
                                isClearable
                                styles={customStyles}
                                additional={{
                                    page: 1
                                }}
                                classNamePrefix="react-select"
                            />
                        </Col>

                        <Col sm={6} lg={6} md={6} className='mb-3' >
                            <Form.Label>Designation</Form.Label>
                            <Select
                                placeholder="Designation"
                                value={designation}
                                options={projectEstimatedList}
                                onChange={(option) => handleProjectDesignationChange(option)}
                                classNamePrefix="react-select"
                                onMenuOpen={() => {
                                    if (!vacancyProject) {
                                        toast.error('Please choose the project first');
                                        return false;  // Prevent the menu from opening
                                    }
                                }}
                                isSearchable
                                isClearable
                                styles={customStyles}
                            />
                        </Col>

                        <Col sm={6} lg={6} md={6} className='mb-3' >
                            <Form.Label>Select MPR</Form.Label>
                            <Select
                                placeholder="Select MPR"
                                cacheOptions
                                // defaultOptions
                                options={mprOptions}
                                classNamePrefix="react-select"
                                // loadOptions={loadInputChangeMpr}
                                value={mprSelectedValue}
                                onMenuOpen={handleOpenMprMerge}
                                onChange={handleMprSelectChanges}
                                isSearchable
                                // isClearable
                                styles={customStyles}
                            />
                        </Col>

                        {
                            employee?.map((item, index) => {
                                return (
                                    <>
                                        <Col sm={index === 0 ? 6 : 6} lg={index === 0 ? 6 : 6} md={index === 0 ? 6 : 6} className='mb-3' >

                                            <Form.Group controlId={`extendedInput${index}`} className="">
                                                {
                                                    index === 0 && <Form.Label>Replacement</Form.Label>
                                                }
                                                <InputGroup>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter Employee Name"
                                                        value={item.name}
                                                        onChange={(e) => {
                                                            const updatedEmployee = [...employee];
                                                            updatedEmployee[index].name = e.target.value;
                                                            setemployee(updatedEmployee);
                                                        }}
                                                    />

                                                    <InputGroup.Text className={index === 0 ? 'bg-success' : 'bg-danger'} >
                                                        {
                                                            index === 0 ? <AiOutlinePlus onClick={(e) => {
                                                                setemployee((prev) => {
                                                                    return [...prev, { name: '', id: index + 1 }]
                                                                })
                                                            }} color='white' /> : <AiOutlineMinus onClick={(e) => {
                                                                setemployee((prev) => {
                                                                    return prev.filter((item, i) => i !== index)
                                                                })
                                                            }} color='white' />
                                                        }
                                                    </InputGroup.Text>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                    </>
                                )
                            })
                        }

                    </Row>

                    <Row>
                        <Col sm={6} lg={6} md={6} className='mb-3' >
                            <Form.Group controlId="dateInput" className="mt-3">
                                <Form.Label>Replacement Date</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="date"
                                        value={replacement_date}
                                        onChange={(e) => set_replacement_date(e.target.value)}
                                        defaultValue={Date.now}
                                    />
                                    <InputGroup.Text>
                                        <AiOutlineCalendar color="green" />
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                        </Col>

                        <Col sm={6} lg={6} md={6} className='mb-3' >
                            <Form.Group controlId="deadlineInput" className="mt-3">
                                <Form.Label>Deadline</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="date"
                                        value={deadline_date}
                                        onChange={(e) => set_deadline_date(e.target.value)}
                                    />
                                    <InputGroup.Text>
                                        <AiOutlineCalendar color="green" />
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* <div className='mb-3 col-sm-4'>
                            <Form.Label>Vacancy Under Project</Form.Label>
                            <AsyncSelect
                                placeholder="Select Project"
                                defaultOptions
                                defaultValue={option}
                                value={vacancyProject}
                                loadOptions={projectLoadOption}
                                onMenuOpen={projectMenuOpen}
                                onChange={(option) => handleProjectChanges(option)}
                                classNamePrefix="react-select"
                                styles={customStyles}
                            />
                        </div>
                        <div className='mb-3 col-sm-4'>
                            <Form.Label>Designation</Form.Label>
                            <Select
                                placeholder="Designation"
                                value={designation}
                                options={projectEstimatedList}
                                onChange={(option) => handleProjectDesignationChange(option)}
                                classNamePrefix="react-select"
                                onMenuOpen={() => {
                                    if (!vacancyProject) {
                                        toast.error('Please choose the project first');
                                        return false;  // Prevent the menu from opening
                                    }
                                }}
                                isSearchable
                                styles={customStyles}
                            />
                        </div> */}

                    {/* </Form> */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => setReplacementModalOpen(false)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal >
        </>
    );
};

export default ManPowerAcquisitions;
