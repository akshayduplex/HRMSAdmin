import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Form from "react-bootstrap/Form";
import Chip from "@mui/material/Chip";
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
import { toast } from "react-toastify";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import './QuillEditor.css'; // Import your custom CSS file



const JobTitleDepartment = ({ formData, handleAllInputChange }) => {

    const dispatch = useDispatch();
    const { department_ddl } = useSelector((state) => state.department);
    const { projects_dropdown } = useSelector((state) => state.project);
    const { job_type_ddl } = useSelector((state) => state.job_type);
    const TagsList = useSelector((state) => state.city_list_globle.tabsList);
    const BenefitsList = useSelector((state) => state.city_list_globle.benefitsListApi);
    const EducationList = useSelector((state) => state.city_list_globle.educationList);

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);

    const [personName1, setPersonName1] = useState([]);
    const [personName2, setPersonName2] = useState([]);
    const [personName3, setPersonName3] = useState([]);
    const [names, setTagName] = useState([]);
    const [tags, setTags] = useState([]);
    const [Key, setEducation] = useState([]);

    const handleChangeSelect1 = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName1(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
        handleAllInputChange({ tags: value })
    };

    useEffect(() => {
        dispatch(fetchTagListSuggestions());
        dispatch(fetchBenefitsListSuggestions());
        dispatch(fetchEducationListSuggestions());
    }, [dispatch])


    const handleChangeSelect2 = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName2(
            typeof value === "string" ? value.split(",") : value
        );
        handleAllInputChange({ benefits: value })
    };

    const handleChangeSelect3 = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName3(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
        handleAllInputChange({ educations: value })
    };

    const handleDelete1 = (chipToDelete) => () => {
        setPersonName1((chips) => chips.filter((chip) => chip !== chipToDelete));
    };

    const handleDelete2 = (chipToDelete) => () => {
        setPersonName2((chips) => chips.filter((chip) => chip !== chipToDelete));
    };

    const handleDelete3 = (chipToDelete) => () => {
        setPersonName3((chips) => chips.filter((chip) => chip !== chipToDelete));
    };


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
    const [files, setFile] = useState(null);
    const [departmentList, setDepartmentList] = useState([]);

    // handle the files 
    useEffect(() => {
        if (department_ddl.length === 0) {
            dispatch(fetchDepartmentDropDownList());
        }
        if (departmentList.length === 0) {
            setDepartmentList(department_ddl);
        }
        /**fetch Job Type**/
        if (job_type_ddl.length === 0) {
            dispatch(fetchJobTypeDropDownList());
        }
        if (jobTypeList.length === 0) {
            setJobTypeList(job_type_ddl);
        }

    }, [dispatch, department_ddl, departmentList, setDepartmentList, jobTypeList, job_type_ddl]);


    const loadOptions = async (inputValue) => {
        if (!formData.project_id) {
            return [];
        }
        let dropdownResult = projects_dropdown.find((key) => key._id === formData.project_id);
        const result = dropdownResult?.location
            .filter((key) =>
                key.name.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map((key) => {
                return {
                    label: key.name,
                    value: key.name,
                };
            });
        return result;
    };

    const SalaryRangeLoadOption = async (inputValue) => {
        const result = await dispatch(fetchSalaryRangeSuggestions(inputValue)).unwrap();
        return result;
    };




    return (
        <>
            <div className="mt-4 createjob_form">
                <Form.Group controlId="formFile" className="">
                    <Form.Label className="text-start w-100">
                        Upload Manpower Requisition form
                    </Form.Label>
                    <div className="customfile_upload">
                        <input type="file" className="cstmfile" accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={(event) => {
                                const file = event.target.files[0];
                                if (file) {
                                    handleAllInputChange({ filename: file })
                                }
                            }}
                        />
                    </div>
                </Form.Group>
                <div className="sitecard  mt-3">
                    <div className="dtlheadr p-0 w-100 flex-column gap-3 justify-content-start align-items-start">
                        <h4 className="subhdng">
                            Job title & department details
                        </h4>
                        <Form className="row w-100 gy-3 gx-5">
                            <Form.Group
                                className="col-lg-12"
                                controlId="exampleForm.ControlInput1"
                            >
                                <Form.Label className="w-100 text-start">
                                    Job Title
                                </Form.Label>
                                <Form.Control onChange={(e) => { handleAllInputChange({ 'job_title': e.target.value }) }} value={formData.job_title} type="text" placeholder="Enter Job Title" />
                            </Form.Group>
                            <Form.Group className="col-lg-6">
                                <Form.Label className="w-100 text-start">
                                    Department
                                </Form.Label>
                                <Form.Select aria-label="Default select example" defaultValue={formData.department}
                                    onChange={(e) => { handleAllInputChange({ 'department': e.target.value }) }}>
                                    <option> Select the Department </option>
                                    {departmentList && departmentList.map((item, index) => (
                                        <option key={index} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="col-lg-6">
                                <Form.Label className="w-100 text-start">
                                    Job Type
                                </Form.Label>
                                <Form.Select aria-label="Default select example" defaultValue={formData.job_type}
                                    onChange={(e) => { handleAllInputChange({ 'job_type': e.target.value }) }}
                                >
                                    <option value="">Select the Job Type</option>
                                    {jobTypeList && jobTypeList.map((item, index) => (
                                        <option key={index} value={item.name}>
                                            {item.name}
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
                                    if(value?.length <= 10){
                                        handleAllInputChange({ 'experience': e.target.value })
                                    }
                                 }} value={formData.experience} type="text" placeholder="Enter exp. 2 Year(s)" />
                            </Form.Group>
                            <Form.Group className="col-lg-6">
                                <Form.Label className="w-100 text-start">
                                    Job location
                                </Form.Label>
                                <AsyncSelect
                                    placeholder="Select Location..."
                                    cacheOptions
                                    loadOptions={loadOptions}
                                    onChange={(option) => {
                                        const value = option ? option.value : null;
                                        const id = option ? option.id : null;
                                        let data = [
                                            {
                                                id: id,
                                                name: value
                                            }
                                        ]
                                        handleAllInputChange({ location: data });
                                    }}
                                    value={formData.location ? { value: formData.location[0]?.name, label: formData.location[0]?.name } : null}
                                    onInputChange={(inputValue) => {
                                        return inputValue
                                    }}
                                    onFocus={() => {
                                        if (!formData.project_id) {
                                            return toast.warning('Please select a project first!')
                                        }
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className="col-lg-6">
                                <div className="d-flex flex-row align-items-end">
                                    <div className="w-100">
                                        <Form.Label className="w-100 text-start">
                                            Salary Range
                                        </Form.Label>
                                        <AsyncSelect
                                            placeholder="Select Salary Range....."
                                            cacheOptions
                                            loadOptions={SalaryRangeLoadOption}
                                            onChange={(option) => {
                                                const value = option ? option.value : null;
                                                handleAllInputChange({ salary_range: value });
                                            }}
                                            value={formData.salary_range ? { value: formData.salary_range, label: formData.salary_range } : null}
                                            onInputChange={(inputValue) => inputValue}
                                            defaultOptions
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
                                className="col-lg-12"
                                controlId="exampleForm.ControlInput1"
                            >
                                <Form.Label className="w-100 text-start">Tag</Form.Label>
                                <Select
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
                                </Select>
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

                            <div className="position-relative">
                                    <ReactQuill
                                        value={formData.description}
                                        onChange={(value) => handleAllInputChange({ description: value })}
                                        // style={{ height: '400px' , border: '2px solid #ccc',}}
                                        placeholder="Enter description"
                                        className="custom-quill"
                                    />
                                <button className="save_tempbtn">
                                    Save this as template
                                </button>
                            </div>

                            <Form.Group
                                className="col-lg-12 "
                                controlId="exampleForm.ControlInput1"
                            >
                                <Form.Label className="w-100 text-start">Benefits</Form.Label>
                                <Select
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
                                </Select>
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
                                <Select
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
                                </Select>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            </div>
            <JobTemplateModal show={show} onHide={() => setShow(false)} />
        </>
    );
}

export default JobTitleDepartment;