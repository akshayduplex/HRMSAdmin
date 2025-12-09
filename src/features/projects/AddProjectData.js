import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { FaInfoCircle, FaUserTie } from "react-icons/fa";
import { CiCalendar } from "react-icons/ci";
import Button from 'react-bootstrap/Button';
import { showAlert } from '../alert/alertSlice';
import Loader from '../loader/Loader';
import { CiImageOn } from "react-icons/ci";


import GoBackButton from '../goBack/GoBackButton';
import AllHeaders from '../partials/AllHeaders';
import { getHumanReadableDate } from '../../utils/common';
import { addProject, updateProject, fetchProjectById } from '../slices/projectSlice';
import { fetchHolidayListByDateRange } from '../slices/holidaysSlice';
import { searchLocation } from '../slices/locationsSlice';
import Select from 'react-select';
import config from '../../config/config';
import { toast } from 'react-toastify';
import { DaysDiff } from '../../utils/common';
import { GetEmployeeListDropDown } from '../slices/EmployeeSlices/EmployeeSlice';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select'




const customStylesLocation = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#D2C9FF',
        },
        // height: '44px', // Increase height of the select box
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
        borderRadius: '3.5px',
        height: '25px',
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

// Custom Option component to show the icon in dropdown options
const customOption = (props) => {
    return (
        <components.Option {...props}>
            👨‍💼 {props.data.label}
        </components.Option>
    );
};

// Custom SingleValue component to show the icon in the selected value
const customSingleValue = (props) => {
    return (
        <components.SingleValue {...props}>
            👨‍💼 {props.data.label}
        </components.SingleValue>
    );
};


const AddProjectData = () => {

    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [projectStatus, setProjectStatus] = useState('Active');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [managerName, setManagerName] = useState('');
    const [inChargeName, setInChargeName] = useState('');
    const [locationOptions, setLocationOptions] = useState([]);
    const [selectedLocationOptions, setSelectedLocationOptions] = useState([]);
    const [duration, setDuration] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apiToken, setApiToken] = useState('');
    const [holidayList, setHolidayList] = useState([]);
    const [oldFileName, setOldFileName] = useState('');
    const [projectLocationLoading, setProjectLocationLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { error, status } = useSelector((state) => state.project);
    const { userLogin } = useSelector((state) => state.auth);

    console.log(managerName , 'this is ManagerList');
    console.log(inChargeName , 'this is InchargeList');



    //handle file data
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
            event.target.value = null;
            return dispatch(showAlert({ message: 'Only JPG and PNG files are allowed.', type: 'error' }));
        }


        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title) {
            return toast.warning('Please Enter Project Title')
        }
        else if (!selectedLocationOptions) {
            return toast.warning('Please Select Location')
        }
        else if (!managerName) {
            return toast.warning('Please Enter Manager Name')
        }
        else if (!inChargeName) {
            return toast.warning('Please Enter inCharge Name')
        }
        else if (!duration) {
            return toast.warning('Please Enter Project Duration')
        }
        else if (!fromDate) {
            return toast.warning('Please Enter Project Start Date')

        }
        else if (!toDate) {
            return toast.warning('Please Enter Project End Date')
        }

        else {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('manager_data', JSON.stringify(managerName));
            formData.append('in_charge_data', JSON.stringify(inChargeName));
            formData.append('duration', duration);
            formData.append('start_date', fromDate);
            formData.append('end_date', toDate);
            formData.append('filename', file);
            formData.append('old_filename', oldFileName);
            formData.append('status', projectStatus);

            const collectLocationsData = [];
            selectedLocationOptions.forEach(item => {
                console.log(item , 'this is Items');
                collectLocationsData.push({ 'id': item.value, 'name':item.label?.split(',')[0], 'state_name': item.label?.split(',')[1], 'state_id': item.state_id });
            });
            formData.append('location', JSON.stringify(collectLocationsData));
            if (id) {
                formData.append('_id', id);
                dispatch(updateProject({ formData, token: apiToken }))
                    .then((result) => {
                        if (result.meta.requestStatus === 'fulfilled') {
                            getEditRecord(id);
                            // return dispatch(showAlert({ message: error?error:result.payload.message, type: 'success' })) ;
                            return toast.success(error ? error : result.payload.message)
                        } else {
                            // return dispatch(showAlert({ message: error?error:result.payload.message, type: 'error' })) ;
                            return toast.error(error ? error : result.payload.message)
                        }
                    });
            }
            else {

                dispatch(addProject({ formData, token: apiToken }))
                    .then((result) => {
                        if (result.meta.requestStatus === 'fulfilled') {
                            if(result?.payload.status){
                                setTimeout(() => navigate('/projects'), 500);
                                return toast.success(result.payload.message)
                            }else {
                                return toast.error(result.payload.message)
                            }
                        } else {
                            //    return dispatch(showAlert({ message: error?error:result.payload.message, type: 'error' })) ;
                            return toast.error(error ? error : result.payload.message)
                        }
                    });
            }
        }
    }


    useEffect(() => {
        if (status === 'loading') {
            setLoading(true);
        }
        if (userLogin) {
            setApiToken(userLogin.token);
        }
    }, [status, userLogin]);


    /*********  fetch location from database **************/
    const handleChange = (selected) => {
        setSelectedLocationOptions(selected);
    };

    const handleInputSelectChange = (newValue) => {

        if (newValue !== '' && newValue.length > 2) {
            setProjectLocationLoading(true)
            const apiPayload = { 'keyword': newValue, 'page_no': '1', 'per_page_record': '11', 'scope_fields': ["_id", "name", 'state', 'state_id'], 'status': 'Active' }
            dispatch(searchLocation({ params: apiPayload, token: apiToken }))
                .then((result) => {
                    if (result.meta.requestStatus === 'fulfilled' && result.payload.status) {
                        setLocationOptions(result.payload.data.map(option => ({
                            value: option._id,
                            label: `${option.name},${option.state}`,
                            state: option.state,
                            state_id: option.state_id
                        })));
                    }
                });
            setProjectLocationLoading(false);
            return newValue;
        }
    };

    const OnMenuOpen = () => {
        const apiPayload = { 'keyword': '', 'page_no': '1', 'per_page_record': '11', 'scope_fields': ["_id", "name", 'state', 'state_id'], 'status': 'Active' }
        setProjectLocationLoading(true);
        dispatch(searchLocation({ params: apiPayload, token: apiToken }))
            .then((result) => {
                if (result.meta.requestStatus === 'fulfilled' && result.payload.status) {
                    setLocationOptions(result.payload.data.map(option => ({
                        value: option._id,
                        label: `${option.name},${option.state}`,
                        state: option.state,
                        state_id: option.state_id
                    })));
                }
            });
        setProjectLocationLoading(false);
    };

    const handleLocationCreate = (inputValue) => {
        const newOption = { value: inputValue, label: inputValue, state_name: inputValue, state_id: inputValue };
        setLocationOptions(prevOptions => [...prevOptions, newOption]);
        setSelectedLocationOptions(prevSelected => [...prevSelected, newOption]);
    };

    /*********fetch  holiday  list ***********/
    const fetchHolidayListData = useCallback(() => {
        if (fromDate && toDate) {
            const apiPayload = { from_date: fromDate, to_date: toDate, scope_fields: ['name', 'schedule_date', 'year'] };
            dispatch(fetchHolidayListByDateRange({ params: apiPayload, token: apiToken }))
                .then((result) => {
                    if (result.meta.requestStatus === 'fulfilled' && result.payload.status) {
                        setHolidayList(result.payload.data);
                    } else {
                        setHolidayList([]);
                    }
                })
        }
    }, [dispatch, setHolidayList, fromDate, toDate, apiToken]);


    useEffect(() => {
        if (fromDate && toDate) {
            fetchHolidayListData();
        }
    }, [fromDate, toDate, fetchHolidayListData]);

    // update the date
    useEffect(() => {
        if (fromDate && toDate) {
            setDuration(DaysDiff(fromDate, toDate))
        }
    }, [fromDate, toDate])


    /* fetch old image from url and load in preview*/
    const handleFetchImage = useCallback(async (imageUrl) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();

            if (['image/jpeg', 'image/png', 'image/jpg'].includes(blob.type)) {

                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(blob);
            } else {
                setPreview([]);
            }
        } catch (error) {

        }
    }, []);

    /*fetch Single Record From API*/
    const getEditRecord = useCallback(() => {
        const apiPayload = { '_id': id, scope_fields: ['title', 'logo', 'location', 'manager_list', 'status', 'in_charge_list', 'start_date', 'end_date', 'duration'] }
        dispatch(fetchProjectById({ params: apiPayload, token: apiToken }))
            .then((result) => {
                if (result.meta.requestStatus === 'fulfilled' && result.payload.status) {
                    const newDataContainer = result.payload.data;
                    setId(newDataContainer._id);
                    setTitle(newDataContainer.title);
                    setProjectStatus(newDataContainer.status);
                    setManagerName(newDataContainer?.manager_list?.map((item) => { return { emp_doc_id: item?.emp_id, emp_name: item?.emp_name, emp_code: item?.emp_code } }));
                    setSelectedOption(newDataContainer?.manager_list?.map((item) => { return { value: item?.emp_id, label: item?.emp_name, emp_code: item?.emp_code } }));
                    setInChargeName(newDataContainer?.in_charge_list?.map((item) => { return { emp_doc_id: item?.emp_id, emp_name: item?.emp_name, emp_code: item?.emp_code } }));
                    setInCharge(newDataContainer?.in_charge_list?.map((item) => { return { value: item?.emp_id, label: item?.emp_name, emp_code: item?.emp_code } }));
                    setDuration(newDataContainer.duration);
                    setOldFileName(newDataContainer.logo);
                    setFromDate(getHumanReadableDate(newDataContainer.start_date, null, 'YYYY-MM-DD'));
                    setToDate(getHumanReadableDate(newDataContainer.end_date, null, 'YYYY-MM-DD'));
                    if (newDataContainer.location) {
                        setLocationOptions([]);
                        setSelectedLocationOptions([]);
                        newDataContainer.location.forEach(item => {
                            const newOption = { value: item.id, label: `${item.name},${item.state_name}`, state_name: item.state_name, state_id: item.state_id };
                            console.log(newOption , 'location');
                            setLocationOptions(prevOptions => [...prevOptions, newOption]);
                            setSelectedLocationOptions(prevSelected => [...prevSelected, newOption]);
                        });
                    }

                    if (newDataContainer.logo) {
                        handleFetchImage(`${config.IMAGE_PATH}${newDataContainer.logo}`);
                    }

                }
            });
    }, [handleFetchImage, setId, setTitle, setProjectStatus, setManagerName, setInChargeName, setDuration, setOldFileName, setFromDate, setToDate, setLocationOptions, setSelectedLocationOptions, dispatch, apiToken, id]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const docId = params.get('id');
        setId(docId);
        getEditRecord(docId);
    }, [getEditRecord, setId]);

    const [option, setOption] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [Incharge, setInCharge] = useState(null);
    const EmployeeOnLoads = async (input) => {
        let response = await dispatch(GetEmployeeListDropDown(input)).unwrap()
        return response;
    }

    const handleMenuOpenDropDown = async () => {
        let response = await dispatch(GetEmployeeListDropDown('')).unwrap()
        setOption(response)
    }

    const handleProjectMangerChanges = (option) => {
        setSelectedOption(option)
        setManagerName(option?.map((item) => {
            return {
                emp_name: item.label,
                emp_doc_id: item.value,
                emp_code: item?.emp_code
            }
        }))
    }

    const handleInChargeChanges = (option) => {
        setInCharge(option)
        setInChargeName(option?.map((item) => {
            return {
                emp_name: item.label,
                emp_doc_id: item.value,
                emp_code: item?.emp_code
            }
        }))
    }


    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className='row'>
                        <div className='pagename'>
                            <h3>{id ? 'View Project' : 'Add Project'}</h3>
                            <p>Current projects information and tracking</p>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='sitecard'>
                            <div className='projectcard'>
                                <div className='dflexbtwn'>
                                    <h4 className='mb-3'>Project details</h4>
                                </div>
                                <Form>
                                    <div className='row'>
                                        <div className='col-sm-12 mb-3'>
                                            <div className='d-flex position-relative'>
                                                <div className='imgbox'>
                                                    <CiImageOn />
                                                    <p>Choose File</p>
                                                </div>
                                                {preview && (
                                                    <div className='uploadedimg'>
                                                        <img src={preview} alt="Preview" />
                                                    </div>
                                                )}
                                                <div className='cstm_upload_text'>
                                                    <label>Upload Logo</label>
                                                    <span>Max file size 25kb. JPG or PNG format.</span>
                                                    <button onClick={() => document.querySelector('input[type="file"]').click()}> Upload</button>
                                                </div>
                                                <div className='fileup_btnhide'>
                                                    <input type="file" onChange={handleFileChange} accept=".jpg, .jpeg, .png" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-sm-6'>
                                            <div className='mb-3'>
                                                <Form.Label>Project Title</Form.Label>
                                                <Form.Control type="text" onChange={(e) => setTitle(e.target.value)} value={title} placeholder="Enter project title" />
                                            </div>
                                            <div className='mb-3'>
                                                <Form.Label>Project Location</Form.Label>
                                                <Select
                                                    isMulti
                                                    value={selectedLocationOptions}
                                                    onChange={handleChange}
                                                    options={locationOptions}
                                                    onCreateOption={handleLocationCreate}
                                                    onInputChange={handleInputSelectChange}
                                                    onMenuOpen={OnMenuOpen}
                                                    isClearable
                                                    isLoading={projectLocationLoading}
                                                    isSearchable
                                                    styles={customStylesLocation}
                                                />
                                            </div>
                                            <div className='mb-3'>
                                                <Form.Label>Project Manager</Form.Label>
                                                <AsyncSelect
                                                    isMulti
                                                    cacheOptions
                                                    defaultOptions
                                                    defaultValue={option}
                                                    loadOptions={EmployeeOnLoads} // A function that returns the options asynchronously
                                                    value={selectedOption}
                                                    onMenuOpen={handleMenuOpenDropDown}
                                                    onChange={handleProjectMangerChanges}
                                                    isClearable
                                                    isSearchable
                                                    styles={customStylesLocation}
                                                    components={{ Option: customOption, SingleValue: customSingleValue }}
                                                />
                                                {/* <Form.Control type="text" onChange={(e) => setManagerName(e.target.value)} value={managerName} placeholder="Project Manager" /> */}
                                            </div>
                                            <div className='mb-3'>
                                                <Form.Label>Project Head</Form.Label>
                                                <AsyncSelect
                                                    isMulti
                                                    cacheOptions
                                                    defaultOptions
                                                    defaultValue={option}
                                                    loadOptions={EmployeeOnLoads} // A function that returns the options asynchronously
                                                    value={Incharge}
                                                    onMenuOpen={handleMenuOpenDropDown}
                                                    onChange={handleInChargeChanges}
                                                    isClearable
                                                    isSearchable
                                                    styles={customStylesLocation}
                                                />
                                                {/* <Form.Control type="text" onChange={(e) => setInChargeName(e.target.value)} value={inChargeName} placeholder="Project In-charge" /> */}
                                            </div>


                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>From</Form.Label>
                                                    <Form.Control type="date" onChange={(e) => { setFromDate(e.target.value); setToDate(e.target.value); setHolidayList([]); }} value={fromDate} placeholder="dd/mm/yyyy" />
                                                    <CiCalendar />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>To</Form.Label>
                                                    <Form.Control type="date" onChange={(e) => { setToDate(e.target.value); setHolidayList([]); }} min={fromDate} value={toDate} placeholder="dd/mm/yyyy" />
                                                    <CiCalendar />
                                                </Form.Group>
                                            </Row>

                                            <div className='mb-3'>
                                                <Form.Label>Project Duration</Form.Label>
                                                <Form.Control type="text" onChange={(e) => setDuration(e.target.value)} value={duration} placeholder="Project Duration" readOnly/>
                                            </div>
                                            
                                        </div>
                                        <div className='col-sm-6'>
                                            <div className='holidaywrap'>
                                                <label className='form-label'>Listed Holidays in selected project duration <FaInfoCircle /> </label>
                                                <div className='holidaybox'>
                                                    {holidayList && holidayList.map((element, index) => (
                                                        <label htmlFor={`ckb${element._id}`} >
                                                            <input type="checkbox" id={`ckb${element._id}`} checked={id && true} />
                                                            <span>{element.name}- {element.schedule_date}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <p>*Check the dates you want to list as public holiday.</p>
                                            </div>
                                        </div>
                                        <div className='col-sm-12 mb-3'>
                                            <Button onClick={handleSubmit} disabled={loading} className="sitebtn btnblue fullbtn" variant="primary" type="submit">
                                                {loading ? <Loader /> : 'Save Project'}
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddProjectData;
