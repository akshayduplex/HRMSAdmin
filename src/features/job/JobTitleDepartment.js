import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import { CiCalendar } from "react-icons/ci";
import { Link } from "react-router-dom";
import AsyncSelect from "react-select/async";
import JobTemplateModal from "./JobTemplateModal"
import { fetchDepartmentDropDownList } from '../slices/departmentSlice';
import { fetchJobTypeDropDownList } from '../slices/jobTypesSlice';
import { fetchSalaryRangeSuggestions } from "../masters/locations/locationSliceGloble";
import { fetchTagListSuggestions } from "../masters/locations/locationSliceGloble";
import { fetchBenefitsListSuggestions } from "../masters/locations/locationSliceGloble";
import { fetchEducationListSuggestions } from "../masters/locations/locationSliceGloble";
import { FetchProjectRegionDropDown, FetchProjectDivisionDropDown, FetchProjectLocationDropDown } from "../slices/ProjectListDropDown/ProjectListDropdownSlice";
import { toast } from "react-toastify";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import './QuillEditor.css'; // Import your custom CSS file
import { ManPowerAcquisitionsSlice } from "../slices/JobSortLIstedSlice/SortLIstedSlice";
import Select from 'react-select';
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { AddJobTemplate, JobTemplateList } from "../slices/TemplateSlice/Template";






const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: "#fff !important",
        borderColor: state.isFocused
            ? "#D2C9FF"
            : state.isHovered
                ? "#80CBC4"
                : provided.borderColor,
        boxShadow: state.isFocused ? "0 0 0 1px #D2C9FF" : "none",
        "&:hover": {
            borderColor: "#D2C9FF",
        },
        // maxWidth: '%',
        //   width: "200px",
        minHeight: "44px",
        // borderTopLeftRadius: '0',
        // borderBottomLeftRadius: '0'
    }),
    menu: (provided) => ({
        ...provided,
        borderTop: "1px solid #D2C9FF",
    }),
    option: (provided, state) => ({
        ...provided,
        borderBottom: "1px solid #D2C9FF",
        color: state.isSelected ? "#fff" : "#000000",
        backgroundColor: state.isSelected
            ? "#4CAF50"
            : state.isFocused
                ? "#80CBC4"
                : provided.backgroundColor,
        "&:hover": {
            backgroundColor: "#80CBC4",
            color: "#fff",
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
        minHeight: "44px", // Increase height of the select box
        // width: '300px', // Increase width of the select box
        // paddingLeft: '10px',
        // textAlign: 'left',
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
        borderRadius: '3px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 7px',
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



const JobTitleDepartment = ({ formData, handleAllInputChange, projectDesignation, DesignationSelected, handleDesignationDropDown, handleDepartmentChange, locationRequisitionForm }) => {

    const dispatch = useDispatch();
    const { department_ddl } = useSelector((state) => state.department);
    const { job_type_ddl } = useSelector((state) => state.job_type);
    const TagsList = useSelector((state) => state.city_list_globle.tabsList);
    const BenefitsList = useSelector((state) => state.city_list_globle.benefitsListApi);
    const EducationList = useSelector((state) => state.city_list_globle.educationList);


    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const [names, setTagName] = useState([]);
    const [tags, setTags] = useState([]);
    const [Key, setEducation] = useState([]);

    useEffect(() => {
        dispatch(fetchTagListSuggestions());
        dispatch(fetchBenefitsListSuggestions());
        dispatch(fetchEducationListSuggestions());
    }, [dispatch])

    const JobStatusList = [
        {
            label: 'On Consultant', value: 'OnContract'
        },
        {
            label: 'On Role', value: 'OnRole'
        },
        {
            label: 'Empaneled', value: 'empaneled'
        }
    ]


    useEffect(() => {
        if (TagsList.status === 'success') {
            setTagName(TagsList.data);
        }
        if (BenefitsList.status === 'success') {
            setTags(BenefitsList.data);
        }
        if (EducationList.status === 'success') {
            setEducation(EducationList.data);
        }
    }, [TagsList, names, tags, BenefitsList, EducationList])

    const [jobTypeList, setJobTypeList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    // handle the files 
    useEffect(() => {
        if (department_ddl.length === 0) {
            dispatch(fetchDepartmentDropDownList());
        }
        else if (departmentList.length === 0) {
            setDepartmentList(department_ddl);
        }
        /**fetch Job Type**/
        else if (job_type_ddl.length === 0) {
            dispatch(fetchJobTypeDropDownList());
        }else if (jobTypeList.length === 0)
        {
            setJobTypeList(job_type_ddl);
        }

    }, [dispatch, department_ddl, departmentList, setDepartmentList, jobTypeList, job_type_ddl]);


    const handleLocationChanges = (option) => {
        handleAllInputChange({ location: option });
    }

    // Tags selected for multiselect - 
    const [tagOptions, setTagOptions] = useState([]);

    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        if (selectedTags.length <= 0 && formData.tags?.length > 0) {
            let result = formData.tags?.map((value) => {
                return {
                    value: value?._id,
                    label: value?.name
                }
            })
            setSelectedTags(result)
        }
    }, [formData])

    const tagLoadDefaultOptions = async () => {
        const result = await dispatch(fetchTagListSuggestions('')).unwrap();
        setTagOptions(result)
    };

    const tagLoadOption = async (inputValue) => {
        const result = await dispatch(fetchTagListSuggestions(inputValue)).unwrap();
        return result;
    };

    const handleMultiSelectChangesTags = (value) => {
        setSelectedTags(value);
        let result = value.map((item) => ({
            name: item?.label,
            _id: item?.value,
        }));
        handleAllInputChange({ tags: result })
    }

    // Benefits multiselect fun ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const [benefitsOptions, setBenefitsOptions] = useState([]);

    const [selectedBenefits, setSelectedBenefits] = useState([]);

    useEffect(() => {
        if (selectedBenefits.length <= 0 && formData.benefits?.length > 0) {
            let result = formData.benefits?.map((value) => {
                return {
                    value: value?._id,
                    label: value?.name
                }
            })
            setSelectedBenefits(result)
        }
    }, [formData, selectedBenefits.length])

    const benefitsLoadDefaultOptions = async () => {
        const result = await dispatch(fetchBenefitsListSuggestions('')).unwrap();
        setBenefitsOptions(result)
    };

    const benefitsLoadOption = async (inputValue) => {
        const result = await dispatch(fetchBenefitsListSuggestions(inputValue)).unwrap();
        return result;
    };

    const handleMultiSelectChangesBenefits = (value) => {
        setSelectedBenefits(value);
        let result = value.map((item) => ({
            name: item?.label,
            _id: item?.value,
        }));
        handleAllInputChange({ benefits: result })
    }

    /************** Education Multiselect dropdown ******************/
    const [eductionOptions, setEductionOptions] = useState([]);

    const [selectedEducations, setSelectedEducations] = useState([]);

    useEffect(() => {
        if (selectedEducations.length <= 0 && formData.educations?.length > 0) {
            let result = formData.educations?.map((value) => {
                return {
                    value: value?._id,
                    label: value?.name
                }
            })
            setSelectedEducations(result)
        }
    }, [formData, selectedEducations.length])


    const eductionLoadDefaultOptions = async () => {
        const result = await dispatch(fetchEducationListSuggestions('')).unwrap();
        setEductionOptions(result)
    };

    const eductionLoadOption = async (inputValue) => {
        const result = await dispatch(fetchEducationListSuggestions(inputValue)).unwrap();
        return result;
    };

    const handleMultiSelectChangesEduction = (value) => {
        setSelectedEducations(value);
        let result = value.map((item) => ({
            name: item?.label,
            _id: item?.value,
        }));
        handleAllInputChange({ educations: result })
    }

    /********************** Get the Division List DropDown ***********/
    const [option, setOptions] = useState([]);
    const divisionLoadOption = async (input) => {
        const result = await dispatch(FetchProjectDivisionDropDown(input)).unwrap();
        return result;
    }

    const divisionMenuOpen = async () => {
        const result = await dispatch(FetchProjectDivisionDropDown('')).unwrap();
        setOptions(result);
    }

    const handleDivisionChanges = (option) => {
        handleAllInputChange({ division: option })
    }
    /********************** Get the Region  List DropDown ***********/
    const regionLoadOption = async (input) => {
        const result = await dispatch(FetchProjectRegionDropDown(input)).unwrap();
        return result;
    }
    const regionMenuOpen = async () => {
        const result = await dispatch(FetchProjectRegionDropDown('')).unwrap();
        setOptions(result);
    }

    const handleRegionChanges = (option) => {
        handleAllInputChange({ region: option })
    }

    const handleTemplateSave = async (e) => {
        e.preventDefault();
        if (!formData.job_title) return toast.warn("Please Enter the Job Title");
        if (!formData.designation) return toast.warn("Please Choose the Designation");
        if (!formData.department) return toast.warn("Please Choose the Department");
        if (!formData.description) return toast.warn("Please enter the Job Description");

        let payloads = {
            "title": formData.job_title,
            "designation_id": formData.designation_id,
            "designation_name": formData.designation,
            "department_id": formData.department_id,
            "department_name": formData.department,
            "description": formData.description,
            "status": "Active"
        }

        dispatch(AddJobTemplate(payloads)).unwrap()
            .then((response) => {
                console.log(response)
                if (response.status) {
                    toast.success(response.message);
                    dispatch(JobTemplateList({
                        "page_no": "1",
                        "keyword": '',
                        "per_page_record": "10",
                        "department_id": "",
                        "department_name": "",
                        "scope_fields": []
                    }))
                } else {
                    toast.error(response.message);
                }
            })
            .catch((err) => {
                console.log(err, 'this is Error From the server');
                toast.error(err.message);
            })
    }




    return (
        <>
            <div className="mt-4 createjob_form">

                <div className="sitecard  mt-3">
                    <div className="dtlheadr p-0 w-100 flex-column gap-3 justify-content-start align-items-start">
                        <h4 className="subhdng">
                            Job title & department details
                        </h4>
                        <Form className="row w-100 gy-3 gx-5">
                            <Form.Group
                                className="col-lg-6"
                                controlId="exampleForm.ControlInput1"
                            >
                                <Form.Label className="w-100 text-start">
                                    Job Title
                                </Form.Label>
                                <Form.Control
                                    onChange={(e) => { handleAllInputChange({ 'job_title': e.target.value }) }}
                                    value={formData.job_title}
                                    type="text"
                                    placeholder="Enter Job Title"
                                />
                            </Form.Group>
                            <Form.Group
                                className="col-lg-6"
                                controlId="exampleForm.ControlInput1"
                            >
                                <Form.Label className="w-100 text-start">
                                    No of Opening
                                </Form.Label>
                                <Form.Control
                                    onChange={(e) => { handleAllInputChange({ 'TotalVacancy': e.target.value }) }}
                                    value={formData.TotalVacancy}
                                    type="text"
                                    placeholder="No of Opening"
                                />
                            </Form.Group>

                            <Form.Group className="col-lg-6">
                                <Form.Label className="w-100 text-start">
                                    Job Type
                                </Form.Label>
                                <Form.Select aria-label="Default select example" value={formData.job_type} defaultValue={formData.job_type}
                                    onChange={(e) => { handleAllInputChange({ 'job_type': e.target.value }) }}
                                >
                                    <option value="">Select the Job Type</option>
                                    {JobStatusList && JobStatusList.map((item, index) => (
                                        <option key={index} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="col-lg-6">
                                <Form.Label className="w-100 text-start">
                                    Experience Level
                                </Form.Label>
                                <Form.Control onChange={(e) => {
                                    let value = e.target.value;
                                    if (value?.length <= 10) {
                                        handleAllInputChange({ 'experience': e.target.value })
                                    }
                                }} value={formData.experience} type="text" placeholder="Enter exp. 2 Year(s)" />
                            </Form.Group>
                            <Form.Group className="col-lg-6">
                                <Form.Label className="w-100 text-start">
                                    Job Location
                                </Form.Label>
                                <Select
                                    placeholder="Select Location..."
                                    options={Array.isArray(locationRequisitionForm) ? locationRequisitionForm : []}  // This should be an array of location options
                                    isMulti
                                    onChange={handleLocationChanges}
                                    value={formData.location || null}
                                    isSearchable
                                    styles={customStylesLocation}
                                />
                            </Form.Group>

                            {/* Adding here Division  */}
                            <Form.Group className="col-lg-6">
                                <Form.Label className="w-100 text-start">
                                    Division
                                </Form.Label>
                                <AsyncSelect
                                    placeholder="Choose Division"
                                    defaultOptions
                                    isMulti
                                    defaultValue={option}
                                    loadOptions={divisionLoadOption}
                                    onMenuOpen={divisionMenuOpen}
                                    onChange={handleDivisionChanges}
                                    value={formData.division || null}
                                    styles={customStylesLocation}
                                />
                            </Form.Group>

                            {/* Add Region */}
                            <Form.Group className="col-lg-6">
                                <Form.Label className="w-100 text-start">
                                    Region
                                </Form.Label>
                                <AsyncSelect
                                    placeholder="Choose Region"
                                    defaultOptions
                                    isMulti
                                    defaultValue={option}
                                    loadOptions={regionLoadOption}
                                    onMenuOpen={regionMenuOpen}
                                    onChange={handleRegionChanges}
                                    value={formData.region || null}
                                    styles={customStylesLocation}
                                />
                            </Form.Group>

                            <Form.Group className="col-lg-6">
                                <div className="d-flex flex-row align-items-end">
                                    <div className="w-100">
                                        <Form.Label className="w-100 text-start">
                                            Salary Range
                                        </Form.Label>
                                        {/* <AsyncSelect
                                            placeholder="Select Salary Range....."
                                            cacheOptions
                                            defaultOptions
                                            // defaultValue={salaryOptions}
                                            // onMenuOpen={SalaryDefaultOptions}
                                            loadOptions={SalaryRangeLoadOption}
                                            onChange={(option) => {
                                                const value = option ? option.value : null;
                                                handleAllInputChange({ salary_range: value });
                                            }}
                                            value={formData.salary_range ? { value: formData.salary_range, label: formData.salary_range } : null}
                                            onInputChange={(inputValue) => inputValue}
                                            styles={customStyles}
                                        /> */}
                                        <Form.Control
                                            onChange={(e) => { handleAllInputChange({ 'salary_range': e.target.value }) }}
                                            value={formData.salary_range}
                                            type="text"
                                            placeholder="Enter Salary Range....."
                                        />

                                    </div>
                                </div>
                            </Form.Group>
                            <Form.Group className="col-lg-6" controlId="exampleForm.ControlInput1">
                                <Form.Label className="w-100 text-start">
                                    End Date
                                </Form.Label>

                                <div className="datebox">
                                    <Form.Control type="date" placeholder="Jan 01, 2024" onChange={(e) => {
                                        handleAllInputChange({ deadline: e.target.value })
                                    }}
                                        value={formData.deadline}
                                    />
                                    <CiCalendar />
                                </div>

                            </Form.Group>
                            <Form.Group
                                className="col-lg-6"
                                controlId="exampleForm.ControlInput1"
                            >
                                <Form.Label className="w-100 text-start">Tag</Form.Label>
                                {/* <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    multiple
                                    value={formData.tags}
                                    onChange={handleChangeSelect1}
                                    className="w-100"
                                    renderValue={(selected) => (
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip
                                                    key={value}
                                                    label={value}
                                                    onDelete={handleDelete1(value)}
                                                    style={{ margin: "2px" }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {names.map((name, index) => (
                                        <MenuItem key={index} value={name}>
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select> */}
                                <AsyncSelect
                                    isMulti
                                    loadOptions={tagLoadOption}
                                    defaultOptions
                                    value={selectedTags}
                                    defaultValue={tagOptions}
                                    onMenuOpen={tagLoadDefaultOptions}
                                    onChange={(option) => handleMultiSelectChangesTags(option)}
                                    onBlur={formData?.onBlur}
                                    onInputChange={(inputValue) => inputValue}
                                    classNamePrefix="react-select"
                                    styles={customStylesLocation}
                                    placeholder='Type Tags...'
                                />
                            </Form.Group>

                            {/* Added Featur To chek AssesMent Status */}
                            <Form.Group  className="col-lg-6">
                                <Form.Label className="w-100 text-start">Assessment Status</Form.Label>
                                <Form.Select value={formData?.assessment_status} onChange={(e) => {
                                    handleAllInputChange({assessment_status:e.target.value})
                                }}>
                                    <option value="" selected>Choose Status</option>
                                    <option value="enable">enable</option>
                                    <option value="disable">disable</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
                <div className="sitecard  mt-3">
                    <div className="dtlheadr p-0 w-100 flex-column gap-3 justify-content-start align-items-start">
                        <h4 className="subhdng">
                            Job details & responsibilities
                        </h4>
                        <Form className="row w-100 gy-3 gx-5">
                            <span className="d-flex justify-content-end align-items-end gap-3 flex-row">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <rect width="24" height="24" fill="white" />
                                    <path
                                        d="M13.5 22.5H3C2.60218 22.5 2.22064 22.342 1.93934 22.0607C1.65804 21.7794 1.5 21.3978 1.5 21V10.5C1.5 10.1022 1.65804 9.72064 1.93934 9.43934C2.22064 9.15804 2.60218 9 3 9H13.5C13.8978 9 14.2794 9.15804 14.5607 9.43934C14.842 9.72064 15 10.1022 15 10.5V21C15 21.3978 14.842 21.7794 14.5607 22.0607C14.2794 22.342 13.8978 22.5 13.5 22.5ZM3 10.5V21H13.5V10.5H3Z"
                                        fill="#30A9E2"
                                    />
                                    <path
                                        d="M18.75 17.25H17.25V6.75H6.75V5.25H17.25C17.6478 5.25 18.0294 5.40804 18.3107 5.68934C18.592 5.97064 18.75 6.35218 18.75 6.75V17.25Z"
                                        fill="#30A9E2"
                                    />
                                    <path
                                        d="M22.5 12H21V3H12V1.5H21C21.3978 1.5 21.7794 1.65804 22.0607 1.93934C22.342 2.22064 22.5 2.60218 22.5 3V12Z"
                                        fill="#30A9E2"
                                    />
                                </svg>
                                <Link to="#" className="mb-0 fw-medium color-blue" onClick={handleShow}>
                                    Select from templates
                                </Link>
                            </span>

                            <div className="position-relative texteditor_jd">
                                <ReactQuill
                                    value={formData.description}
                                    onChange={(value) => handleAllInputChange({ description: value })}
                                    placeholder="Enter description"
                                    className="custom-quills"
                                />
                                <button className="save_tempbtn" onClick={handleTemplateSave}>
                                    Save this as template
                                </button>
                            </div>

                            {/* reset the Column data from the server */}

                            <Form.Group
                                className="col-lg-12 "
                                controlId="exampleForm.ControlInput1"
                            >
                                <Form.Label className="w-100 text-start">Benefits</Form.Label>
                                {/* <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    multiple
                                    value={formData.benefits}
                                    onChange={handleChangeSelect2}
                                    className="w-100 "
                                    renderValue={(selected) => (
                                        <Box
                                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                                        >
                                            {selected.map((value) => (
                                                <Chip
                                                    key={value}
                                                    label={value}
                                                    onDelete={handleDelete2(value)}
                                                    style={{ margin: "2px" }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {tags.map((name, index) => (
                                        <MenuItem key={index} value={name}>
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select> */}
                                <AsyncSelect
                                    isMulti
                                    loadOptions={benefitsLoadOption}
                                    defaultOptions
                                    value={selectedBenefits}
                                    defaultValue={benefitsOptions}
                                    onMenuOpen={benefitsLoadDefaultOptions}
                                    onChange={(option) => handleMultiSelectChangesBenefits(option)}
                                    onBlur={formData?.onBlur}
                                    classNamePrefix="react-select"
                                    styles={customStylesLocation}
                                    placeholder='Type Benefits...'
                                />
                            </Form.Group>
                        </Form>
                    </div>
                </div>
                <div className="sitecard  mt-3">
                    <div className="dtlheadr p-0 w-100 flex-column gap-3 justify-content-start align-items-start">
                        <h4 className="subhdng">Education</h4>
                        <Form className="row w-100 gy-3 gx-5">
                            <Form.Group
                                className="col-lg-12"
                                controlId="exampleForm.ControlInput1"
                            >
                                <Form.Label className="w-100 text-start">
                                    Enter Key Word
                                </Form.Label>
                                {/* <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    multiple
                                    value={formData.educations}
                                    onChange={handleChangeSelect3}
                                    className="w-100"
                                    renderValue={(selected) => (
                                        <Box
                                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                                        >
                                            {selected.map((value) => (
                                                <Chip
                                                    key={value}
                                                    label={value}
                                                    onDelete={handleDelete3(value)}
                                                    style={{ margin: "2px" }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {Key.map((name, index) => (
                                        <MenuItem key={index} value={name}>
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select> */}
                                <AsyncSelect
                                    isMulti
                                    loadOptions={eductionLoadOption}
                                    value={selectedEducations}
                                    defaultOptions
                                    defaultValue={eductionOptions}
                                    onMenuOpen={eductionLoadDefaultOptions}
                                    onChange={(option) => handleMultiSelectChangesEduction(option)}
                                    //onBlur={formData?.onBlur}
                                    classNamePrefix="react-select"
                                    styles={customStylesLocation}
                                    placeholder='Type Eduction...'
                                    menuPlacement="top" // Set the dropdown to open above the input
                                />
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            </div>
            <JobTemplateModal show={show} onHide={() => setShow(false)} handleAllInputChange={handleAllInputChange} />
        </>
    );
}

export default JobTitleDepartment;