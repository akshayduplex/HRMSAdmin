import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { styled } from "@mui/system";
import StepConnector from "@mui/material/StepConnector";
import Stepper from "@mui/material/Stepper";
import { stepConnectorClasses } from "@mui/material/StepConnector";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import GoBackButton from "../goBack/GoBackButton";
import JobTitleDepartment from "./JobTitleDepartment"
import JobFormat from "./JobFormat"
import JobPreview from "./JobPreview"
import AllHeaders from "../partials/AllHeaders";
import { fetchProjectsDropDown } from '../slices/projectSlice';
import config from "../../config/config";
import { toast } from "react-toastify";
import { ManPowerAcquisitionsSingleRecords, ManPowerAcquisitionsSlice } from "../slices/JobSortLIstedSlice/SortLIstedSlice";
import { useSearchParams } from "react-router-dom";
import { GetJobListById } from "../slices/AtsSlices/getJobListSlice";
import moment from "moment";
import { addDaysAndFormatDate } from "../../utils/common";


const CreateJob = () => {
  const [shower, setShower] = useState(false);
  const [preview, setPreview] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [projectDesignation, setDesignation] = useState([]);
  const { department_ddl } = useSelector((state) => state.department);
  const [MPRList, setMPRList] = useState([]);
  const [loadingMrp, setLoadingMrp] = useState(false);
  const [mprInputValue, setMprInputValue] = useState('');
  const [isTypingMpr, setIsTypingMpr] = useState(false);
  const [searchParams] = useSearchParams();
  const [locationRequisitionForm , setLocation] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const dispatch = useDispatch();


  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleShower = () => {
    if (!formData.project_id && !formData.project_name) {
      return toast.warning('Please Select the Project');
    }
    if (!formData.job_title) {
      return toast.warning('Please Select the Job title');
    }
    if (!formData.job_type) {
      return toast.warning('Please Select the Job type');
    }
    if (!formData.department) {
      return toast.warning('Please Select the department');
    }
    if (!formData.salary_range) {
      return toast.warning('Please Select the Salary Range');
    }
    if (!formData.deadline) {
      return toast.warning('Please Select the Deadline');
    }
    if (formData.location.length === 0) {
      return toast.warning('Please Select the Location');
    }
    if (!formData.experience) {
      return toast.warning('Please Select the Experience');
    }
    if (formData.region.length === 0) {
      return toast.warning('Please Select the Region');
    }
    if(formData.division.length <= 0){
      return toast.warning('Please Select the Division');
    }

    if(!formData.assessment_status){
      return toast.warning('Please Select the Assessment Status');
    }

    setShower(true);
    handleNext();
  };
  const handleShowerPrev = () => {
    setShower(false);
    handleBack();
  };
  const handlePreview = () => {
    setShower(false);
    setPreview(true);
    handleNext();
  };
  const handlePreviewback = () => {
    setShower(true);
    setPreview(false);
    handleBack();
  };

  /***********Form Data set from here ****************/
  const [formData, setFormData] = useState({
    benefits: [],
    company: config.COMPANY_NAME,
    deadline: "",
    department: "",
    department_id: '',
    description: "",
    educations: [],
    experience: "",
    filename: null,
    form_personal_data: [],
    form_profile: [],
    form_social_links: [],
    job_title: "",
    job_type: "",
    location: [],
    project_id: "",
    project_name: "",
    salary_range: "",
    status: "Published",
    tags: [],
    working: "onsite",
    designation: '',
    designation_id: '',
    TotalVacancy: '',
    ctcAmount: '',
    division: [],
    region: [],
    requisition_form_id: '',
    requisition_form_title: '',
    id: '',
    assessment_status:''
  });

  const handleAllInputChange = (valueObj) => {
    for (let property in valueObj) {
      formData[property] = valueObj[property];
    }
    setFormData({
      ...formData
    });
  };


  useEffect(() => {
    if (searchParams.get('id')) {
      (async () => {
        try {
          let response = await dispatch(GetJobListById(searchParams.get('id'))).unwrap();
          if (response) {
            const processedLocation = response.location.map(loc => ({
              value: loc._id || loc?.id, // Using _id or loc_id as the id
              label: loc.name // Getting the name directly
            }));

            const formattedDeadline = moment(response.deadline).format('YYYY-MM-DD');

            handleAllInputChange({
              project_id: response.project_id,
              project_name: response.project_name,
              department: response.department,
              department_id: response.department_id,
              designation: response.designation,
              designation_id: response.designation_id,
              job_title: response.job_title,
              job_type: response.job_type,
              experience: response.experience,
              location: processedLocation,
              salary_range: response.salary_range,
              deadline: formattedDeadline,
              description: response.description,
              benefits: response.benefits, // Adjust if you need to map this
              educations: response.educations, // Adjust if you need to map this
              company: response.company,
              tags: response.tags,
              working: response.working,
              status: response.status,
              requisition_form_id: response.requisition_form_id,
              requisition_form_title: response.requisition_form_title,
              TotalVacancy: response?.total_vacancy,
              assessment_status:response?.assessment_status,
              division: response?.division_list?.map((item) => {
                return {
                  value: item?.id || item?.div_id,
                  label: item?.name
                }
              }),
              form_personal_data: response?.form_personal_data,
              form_profile: response?.form_profile,
              form_social_links: response?.form_social_links,
              id: response?._id,
              region:response?.region_list?.map((item) => {
                 return {
                     value:item?.region_id,
                     label:item?.name
                 }
              }),              
            });
          }
        } catch (error) {
          console.log(error)
        }

      })()
    }

  }, [searchParams]);


  const { projects_dropdown } = useSelector((state) => state.project);


  /********** Get Project List **********/
  // here logs the product dropdown there  
  useEffect(() => {
    if (projects_dropdown.length === 0) {
      dispatch(fetchProjectsDropDown());
    }
    if (projectList.length === 0) {
      setProjectList(projects_dropdown);
    }

  }, [dispatch, projectList, projects_dropdown, setProjectList]);

  const handleProjectChange = (event, value) => {

    const selectedProject = projectList.find(project => project.title === value.title);
    setMPRList([])
    setMprInputValue('') // Clear MPR input when project changes
    setIsTypingMpr(false) // Reset typing flag
    if (selectedProject) {
      const project_id = selectedProject._id;
      const project_name = selectedProject.title;
      setDesignation(selectedProject?.budget_estimate_list)
      handleAllInputChange({ 
        project_id, 
        project_name,
        requisition_form_id: '',
        requisition_form_title: ''
      });
    }
  };

  const selectedProject = projectList.find(
    (project) => project.title === formData.project_name
  );

  const DesignationSelected = projectDesignation?.find(
    (designation) => designation.designation === formData.designation
  )
  // handle Designation DropDown => 
  const handleDesignationDropDown = (event, value) => {
    if (!formData?.project_id) {
      toast.warn('Please Select the Project First');
      return [];
    }
    const selectedDropDown = projectDesignation.find(project => project?.designation === value.designation);
    if (selectedDropDown) {
      handleAllInputChange({ 
        designation: selectedDropDown?.designation, ctcAmount: selectedDropDown?.ctc, designation_id: selectedDropDown.designation_id });
    }
  }
  // handle Department Changes ---
  const handleDepartmentChange = (event, value) => {
    handleAllInputChange({ department_id: value?._id, department: value?.name })
  }

  /********************* Fetch the Mpr records from the OnMenu Open from the server ***********/
  const fetchMprRecords = async (inputValue = '') => {
    if (!formData.project_id) {
      toast.warn("Please Select the Project")
      return
    }
    setLoadingMrp(true)
    let Payloads = {
      "keyword": inputValue,
      "page_no": "1",
      "per_page_record": "10", 
      "scope_fields": ["_id","title"],
      "status": "",
      "project_id": formData?.project_id,
    }
    try {
      let response = await dispatch(ManPowerAcquisitionsSlice(Payloads)).unwrap();
      if (response) {
        setMPRList(response?.data ? response?.data : [])
      }
    } catch (error) {
      console.error("Error fetching MPR records:", error);
    }
    setLoadingMrp(false)
  }

  /********************* Debounced search for MPR records ***********/
  useEffect(() => {
    if (!formData.project_id) return;
    
    const debounceTimer = setTimeout(() => {
      fetchMprRecords(mprInputValue);
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceTimer);
  }, [mprInputValue, formData.project_id]);

  /********************* Sync input value with selected MPR ***********/
  useEffect(() => {
    // Only sync if user is not actively typing and there's a selected value
    if (!isTypingMpr && formData.requisition_form_id) {
      if (formData.requisition_form_title && formData.requisition_form_title !== mprInputValue) {
        setMprInputValue(formData.requisition_form_title);
      }
    } else if (!formData.requisition_form_id && !isTypingMpr) {
      // Clear input if no selection and not typing
      setMprInputValue('');
    }
  }, [formData.requisition_form_id, formData.requisition_form_title, isTypingMpr]);
  /********************* Fetch the Mpr Handle changes from the Acquisition Form List **********/
  const handleMPRListChange = async (event, data) => {
    setLocation([]);
    let value = await dispatch(ManPowerAcquisitionsSingleRecords({_id:data?._id})).unwrap();
    const selectedDropDown = projectDesignation.find(project => project?.designation === value?.designation_name);
    if (selectedDropDown) {
      handleAllInputChange({ designation: selectedDropDown?.designation, ctcAmount: selectedDropDown?.ctc, designation_id: selectedDropDown.designation_id });
    }
    // set the Location Name
    setLocation(value?.place_of_posting?.map((item) => {
      return {
          value:item?.location_id,
          label:item?.location_name
      }
    }))

    handleAllInputChange({ 
      requisition_form_id: value?._id,
      requisition_form_title: value?.title,
      department_id: value?.department_id,
      department: value?.department_name,
      TotalVacancy: value?.no_of_vacancy,
      description: value?.job_description + value?.qualification + value?.skills ,
      salary_range: value.ctc_per_annum , 
      experience: value.maximum_experience + " " + 'Year',
      deadline:addDaysAndFormatDate(value?.raised_on , value?.vacancy_frame),
      location:value?.place_of_posting?.map((item) => {
        return {
            value:item?.location_id,
            label:item?.location_name
        }
      })
    })
  }


  /********** Get Project List **********/

  return (
    <>
      {/* <AllHeaders /> */}
      <div className="maincontent">
        <div className="container mx-1000" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="hrhdng">
            <h2>Create Job</h2>
          </div>
          <div className="d-flex flex-row gap-5 align-items-center">
            {!shower && !preview ? (
              <Box sx={{ width: '100%', display: "flex", gap: 2, flexWrap: "wrap" }}>
                <FormControl sx={{ flex: 1, marginBottom: 2 }}>
                  <Autocomplete
                    id="project-select"
                    options={projectList}
                    getOptionLabel={(option) => option?.title || ""}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Project" variant="outlined" />
                    )}
                    value={selectedProject || null}
                    onChange={handleProjectChange}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionDisabled={(option) => option.title === ''}
                    key={(option) => option._id}
                    disableClearable
                  />
                </FormControl>
                <FormControl sx={{ flex: 1, marginBottom: 2 }}>
                  <Autocomplete
                    id="Mrp-select"
                    options={MPRList}
                    getOptionLabel={(option) => option?.title || ""}
                    renderInput={(params) => (
                      <TextField {...params} label="Select MPR" variant="outlined" />
                    )}
                    value={MPRList.find(item => item._id === formData?.requisition_form_id) || null}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        // Immediately update input and stop typing mode
                        setMprInputValue(newValue.title || '');
                        setIsTypingMpr(false);
                        handleMPRListChange(event, newValue);
                      }
                    }}
                    inputValue={mprInputValue}
                    onInputChange={(event, newInputValue, reason) => {
                      // Only update when user is actively typing
                      if (reason === 'input') {
                        setIsTypingMpr(true);
                        setMprInputValue(newInputValue);
                      }
                    }}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionDisabled={(option) => option?.title === ''}
                    onOpen={() => {
                      if (!mprInputValue) {
                        fetchMprRecords('');
                      }
                    }}
                    loading={loadingMrp}
                    disableClearable
                    filterOptions={(x) => x}
                  />
                </FormControl>

                <FormControl sx={{ flex: 1, marginBottom: 2 }}>
                  <Autocomplete
                    id="designation-select"
                    options={projectDesignation}
                    getOptionLabel={(option) => option?.designation || ""}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Designation" variant="outlined" />
                    )}
                    value={DesignationSelected || { designation: formData.designation } || null}
                    onChange={handleDesignationDropDown}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionDisabled={(option) => option.designation === ''}
                    key={(option) => option._id}
                    disableClearable
                  />
                </FormControl>
                <FormControl sx={{ flex: 1, marginBottom: 2 }}>
                  <Autocomplete
                    id="Department-select"
                    options={department_ddl ? department_ddl : []}
                    getOptionLabel={(option) => option?.name || ""}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Department" variant="outlined" />
                    )}
                    value={{ name: formData.department, _id: formData.department_id } || null}
                    onChange={handleDepartmentChange}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionDisabled={(option) => option.name === ''}
                    key={(option) => option._id}
                    disableClearable
                  />
                </FormControl>
              </Box>

            ) : null}
          </div>
          <div className="mt-4 jobsteps">
            <Box sx={{ width: "100%" }}>
              <Stepper
                activeStep={activeStep}
                connector={<ColorlibConnector />}
                alternativeLabel
              >
                {/* Your steps */}
                <Step>
                  <StepLabel StepIconComponent={CustomStepIcon}>
                    <h6>Create Job</h6>
                    <span>Create Job with details</span>
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel StepIconComponent={CustomStepIcon}>
                    <h6>Format</h6>
                    <span>Set application format</span>
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel StepIconComponent={CustomStepIcon}>
                    <h6>Preview & Submit</h6>
                    <span>Preview & submit your job</span>
                  </StepLabel>
                </Step>
              </Stepper>
            </Box>
          </div>
          {!shower && !preview ? (
            <>
              <JobTitleDepartment
                formData={formData}
                handleAllInputChange={handleAllInputChange}
                projectDesignation={projectDesignation}
                DesignationSelected={DesignationSelected}
                handleDesignationDropDown={handleDesignationDropDown}
                handleDepartmentChange={handleDepartmentChange}
                locationRequisitionForm={locationRequisitionForm}
              />

              <div className="d-flex justify-content-end my-3 ">
                <button className="btn job_next" onClick={handleShower}>
                  Next <FaArrowRight className="ps-1" />
                </button>
              </div>
            </>
          ) : null}
          {shower ? (
            <div className="mt-4 ">
              <JobFormat formData={formData} handleAllInputChange={handleAllInputChange} />
              <div className="d-flex justify-content-between my-3 ">
                <button
                  className="btn job_prev"
                  onClick={handleShowerPrev}
                >
                  <FaArrowLeft className="pe-1" /> Previous
                </button>
                <button
                  className="btn job_next"
                  onClick={handlePreview}
                >
                  Next <FaArrowRight className="ps-1" />
                </button>
              </div>
            </div>
          ) : null}
          {preview ? (
            <div className="sitecard mt-4 p-0">
              <JobPreview formData={formData} handleAllInputChange={handleAllInputChange} />
              <div className="d-flex justify-content-start my-3 ms-5">
                <button className="btn job_prev" onClick={handlePreviewback}>
                  <FaArrowLeft className="pe-1" /> Previous
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default CreateJob;




const completedSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 23 23"
      fill="none"
    >
      <path
        d="M23 11.5C23 17.8513 17.8513 23 11.5 23C5.14873 23 0 17.8513 0 11.5C0 5.14873 5.14873 0 11.5 0C17.8513 0 23 5.14873 23 11.5ZM8.73782 11.5C8.73782 13.0255 9.97449 14.2622 11.5 14.2622C13.0255 14.2622 14.2622 13.0255 14.2622 11.5C14.2622 9.97449 13.0255 8.73782 11.5 8.73782C9.97449 8.73782 8.73782 9.97449 8.73782 11.5Z"
        fill="#30A9E2"
      />
    </svg>
  );
}

const activeSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 23 23"
      fill="none"
    >
      <path
        d="M23 11.5C23 17.8513 17.8513 23 11.5 23C5.14873 23 0 17.8513 0 11.5C0 5.14873 5.14873 0 11.5 0C17.8513 0 23 5.14873 23 11.5ZM8.73782 11.5C8.73782 13.0255 9.97449 14.2622 11.5 14.2622C13.0255 14.2622 14.2622 13.0255 14.2622 11.5C14.2622 9.97449 13.0255 8.73782 11.5 8.73782C9.97449 8.73782 8.73782 9.97449 8.73782 11.5Z"
        fill="#30A9E2"
      />
    </svg>
  );
}

const pendingSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 23 23"
      fill="none"
    >
      <path
        d="M23 11.5C23 17.8513 17.8513 23 11.5 23C5.14873 23 0 17.8513 0 11.5C0 5.14873 5.14873 0 11.5 0C17.8513 0 23 5.14873 23 11.5ZM8.73782 11.5C8.73782 13.0255 9.97449 14.2622 11.5 14.2622C13.0255 14.2622 14.2622 13.0255 14.2622 11.5C14.2622 9.97449 13.0255 8.73782 11.5 8.73782C9.97449 8.73782 8.73782 9.97449 8.73782 11.5Z"
        fill="#EBEBEB"
      />
    </svg>
  );
}

const CustomStepIcon = ({ active, completed }) => {
  if (completed) {
    return completedSVG();
  } else if (active) {
    return activeSVG();
  } else {
    return pendingSVG();
  }
};



const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 20,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgba(48, 169, 226, 1) 0%,rgba(48, 169, 226, 1) 50%,rgba(48, 169, 226, 1) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgba(48, 169, 226, 1) 0%,rgba(48, 169, 226, 1) 50%,rgba(48, 169, 226, 1) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));