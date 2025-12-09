
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
// import { GetDesignationList } from "../slices/DesignationDropDown/designationDropDown";
import { useDispatch } from "react-redux";
import { FetchProjectListDropDown, FetchProjectLocationDropDown, FetchProjectList, FetchProjectLocationStateVise } from "../slices/ProjectListDropDown/ProjectListDropdownSlice";
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import { useNavigate } from 'react-router-dom';
import { Modal, Spinner } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import moment from 'moment';


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



const RQFormData = () => {
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
    const [reporting, setReporting] = useState(null);
    const [days, setDays] = useState('');
    const [description, setDescription] = useState('');
    const [qualification, setQualification] = useState('');
    const [skills, setSkills] = useState('');
    const [img, setImg] = useState('');
    const [resedDate, setRaisedDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const [UrlDetails, setUrl] = useState(null);
    const [visible, setVisible] = useState(true);
    const params = useParams();
    const [showExpiration, setShowExpiration] = useState(false);
    const [designationLoading , setDesignationLoding] = useState(false)
    const [locatioOption , setLocationOption] = useState(null);
    const [fund , setFundType] = useState('Funded')

    const navigation = useNavigate();

    //  handle project_estimated list 
    const [projectEstimatedList, setProjectEstimated] = useState([]);


    useEffect(() => {

        if (params?.id) {
            const url = new URL(`${config.API_URL}rqForm/${params?.id}`);
            const urlFirstParts = url.pathname.split("/");
            const mprFrmIndex = urlFirstParts.indexOf("rqForm");
            const mprDocDetails = urlFirstParts[mprFrmIndex + 1];
            try {
                const data = atob(mprDocDetails);
                if (data && typeof data !== 'undefined') {
                    setUrl(data?.split('|'))
                }
            } catch (error) {
                console.error("Error decoding Base64 string:", error);
            }
        }
    }, [params?.id]);

    useEffect(() => {
        if (UrlDetails) {
            let [projectId, ...rest] = UrlDetails;
            dispatch(FetchProjectList({ projectId: projectId, token: UrlDetails[UrlDetails?.length - 1] })).unwrap()
                .then((response) => {
                    setProjectEstimated(response?.length > 0 && response[0]?.budget_estimate_list?.map((item, index) => {
                        return {
                            label: item.designation,
                            value: item.designation,
                            id: item.designation_id ? item.designation_id : null,
                            no_of_vacancy: item?.no_of_positions ?? 0,
                            ctc: item?.ctc
                        }
                    }))
                    setVacancyProject({ label: response[0]?.title, value: response[0]?._id })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [dispatch, UrlDetails])

    const CheckLogin = async (token) => {
        try {
            let response = await axios.post(`${config.API_URL}verifyExistingToken`, {
                token: token,
            });
            if (response.status === 200) {
                setShowExpiration(false);
            } else {
                setShowExpiration(false);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setShowExpiration(true);
            }
        }
    };

    useEffect(() => {
        if (UrlDetails) {
            let Token = UrlDetails[UrlDetails?.length - 1];
            CheckLogin(Token)
        }
    }, [UrlDetails])

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

        setLoading(true)
        let [projectId, userId, name, email, mobile, userDesignation, ...rest] = UrlDetails


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
        formData.append('raised_by', name);
        formData.append('raised_by_designation', userDesignation);
        formData.append('raised_by_mobile', mobile);
        formData.append('fund_type', fund);

        try {
            // const response = await axios.post(`${config.API_URL}AddRequisitionData`, formData, apiHeaderTokenMultiPart(UrlDetails[UrlDetails.length-1]));
            const response = await axios.post(`${config.API_URL}AddRequisitionDataFromFront`, formData, apiHeaderTokenMultiPart(UrlDetails[UrlDetails.length - 1]));
            setLoading(false);
            if (response.status === 200) {
                toast.success(response.data?.message);
                setVisible(false);
            } else {
                toast.error(response.data.data?.message);
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            toast.error(error.response.data.message ?? error.response.data.error.message ?? error.message);
        }
    };

    /****************** Get Designation List here  ****************/

    const handleProjectDesignationChange = (option) => {
        setDesignation(option);
        setAnnumCTC(option?.ctc);
        setVacancies(option?.no_of_vacancy)
        setMonthlyCTC(parseInt(parseInt(option?.ctc) / 12))
    };

    /****************** Get getDepartment List here  ****************/

    const getDepartment = async () => {
        const payload = { 
            status: 'Active',
            "page_no": "1",
            "per_page_record":"1000",
         };
        try {
            let response = await axios.post(`${config.API_URL}getDepartmentList`, payload, apiHeaderToken(UrlDetails[UrlDetails?.length - 1]));
            const options = response?.data?.data?.map(dept => ({ value: dept?._id, label: dept?.name }));
            setDepartment(options);
        } catch (error) {
            console.error(error);
        }
    };

    const getLocation = async () => {
        try {
            const Payloads ={
                "keyword":'',
                "page_no":"1",
                "per_page_record":'1000'
                ,"scope_fields":[],
                "status":'Active'
            }
            const response = await axios.post(
                `${config.API_URL}getLocationWithStateList`,
                Payloads,
                apiHeaderToken(UrlDetails[UrlDetails?.length - 1])
            );
            if (response.data.status) {
                let result = response.data.data;
                setLocationOption(result?.map((item) => {
                    return {
                        value: item?._id,
                        label: `${item?.name} , ${item?.state}`
                    }
                }))
            } else {
                return [];
            }
        } catch (error) {
            return []
        }
    }

        /****************** Get Grade List here  ****************/

    const getGradeList = async () => {
        const payload = { 
            status: 'Active',
            "page_no": "1",
            "per_page_record":"1000",
         };
        try {
            let response = await axios.post(`${config.API_URL}getGradeList`, payload, apiHeaderToken(UrlDetails[UrlDetails?.length - 1]));
            const options = response?.data?.data?.map(dept => ({ value: dept?.name, label: dept?.name }));
            setGrade(options);
        } catch (error) {
            console.error(error);
        }
    };

    /********************* Get the District List DropDown ******************/
    // const districtLoadOption = async (input) => {
    //     const result = await dispatch(FetchProjectLocationStateVise(input)).unwrap();
    //     return result?.map((item) => {
    //         return {
    //             value: item?._id,
    //             label: `${item?.name} , ${item?.state}`
    //         }
    //     })
    // }

    // const districtMenuOpen = async () => {
    //     const result = await dispatch(FetchProjectLocationStateVise('')).unwrap();
    //     setOptions(result?.map((item) => {
    //         return {
    //             value: item?._id,
    //             label: `${item?.name} , ${item?.state}`
    //         }
    //     }));
    // }

    const handleDistrictChanges = (option) => {
        setPosting(option)
    }

    // Get Designation List
    const GetDesignationList = async () => {
        try {
            const Payloads = {
                "keyword": '',
                "page_no": "1",
                "per_page_record": '1000'
                , "scope_fields": ["_id", "name"],
                "status": 'Active'
            }
            setDesignationLoding(true)

            if (UrlDetails) {
                const response = await axios.post(
                    `${config.API_URL}getDesignationList`,
                    Payloads,
                    apiHeaderToken(UrlDetails[UrlDetails?.length - 1])
                );
                if (response.data.status) {
                    setDesignationLoding(false) 
                    setOptions(response.data.data.map(key => ({
                        value: key.name,
                        label: key.name,
                        id: key._id
                    })))
                } else {
                    setDesignationLoding(false)
                    return [];
                }
            } else {
                setDesignationLoding(false)
                return [];
            }
       } catch (error) {
            setDesignationLoding(false)
            return []
        }
    }

    useEffect(() => {
        if(UrlDetails){
            getDepartment()
            getGradeList()
            GetDesignationList()
            getLocation()
        }
    }, [UrlDetails])


    return (
        <>
            <div className="maincontentRqForm">

                {
                    !visible ?
                        <div className='container'>
                            <div className='row'>
                                <img style={{ height: '90vh', width: '95vw' }} src='/AddingTheImage.png' alt='Thank you For Submission'></img>
                            </div>
                        </div>

                        :
                        <div className="container" data-aos="fade-in" data-aos-duration="3000">
                            <div className='dflexbtwn'>
                                <div className='pagename'>
                                    <h3>Manpower Requisition Form</h3>
                                    <p>Requisition raise request for  ({vacancyProject?.label})</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='sitecard'>
                                    <Form className='requistn_form' onSubmit={handleSubmit}>
                                        <Row>
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
                                    </div> */}
                                            <div className='mb-3 col-sm-6'>
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
                                            <div className='mb-3 col-sm-6'>
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
                                                <Form.Label>Minimum Experience (Years)</Form.Label>
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
                                                {/* <AsyncSelect
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
                                                /> */}

                                                <Select
                                                    options={option}
                                                    placeholder="Reporting Structure"
                                                    isSearchable
                                                    value={reporting}
                                                    onChange={(option) => {
                                                        setReporting(option)
                                                    }}
                                                    // onInputChange={HandleDesignationLoadOption}
                                                    // onMenuOpen={DesignationMenuOpen}
                                                    isLoading={designationLoading}
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
                                                <Select
                                                    cacheOptions
                                                    isMulti
                                                    options={locatioOption}
                                                    // loadOptions={districtLoadOption}
                                                    value={posting}
                                                    isSearchable
                                                    // onMenuOpen={districtMenuOpen}
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
                                                        Upload Manpower Requisition Document (.Pdf , .Doc , .Docx Only)
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
                }

            </div>


            <Modal show={showExpiration} centered>
                <Modal.Header>
                    <Modal.Title>Session Expired</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    We noticed your session has expired. Please click to create a new link and continue seamlessly.
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button variant="primary" onClick={HandleToCloseTab}> Close </Button> */}
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default RQFormData;
