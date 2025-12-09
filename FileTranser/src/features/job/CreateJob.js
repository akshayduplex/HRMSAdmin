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


const CreateJob = () => {
  const [shower, setShower] = useState(false);
  const [preview, setPreview] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

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
    working: "onsite"
  });

  const handleAllInputChange = (valueObj) => {
    for (let property in valueObj) {
      formData[property] = valueObj[property];
    }
    setFormData({
      ...formData
    });
  };


  const dispatch = useDispatch();
  const { projects_dropdown } = useSelector((state) => state.project);


  /********** Get Project List **********/
  const [projectList, setProjectList] = useState([]);
  // here logs the product dropdown there  
  useEffect(() => {
    if (projects_dropdown.length === 0) {
      dispatch(fetchProjectsDropDown());
    }
    if (projectList.length === 0) {
      setProjectList(projects_dropdown);
    }

  }, [dispatch, projectList, projects_dropdown, setProjectList]);

  console.log(projectList , 'this is Project LIst data');

  const handleProjectChange = (event, value) => {
    const selectedProjectName = event.target.value;
    const selectedProject = projectList.find(project => project.title === value.title);

    console.log(selectedProject , 'this is selected dropdown , ')

    if (selectedProject) {
      const project_id = selectedProject._id;
      const project_name = selectedProject.title;
      handleAllInputChange({ project_id, project_name });
    }
  };

  const selectedProject = projectList.find(
    (project) => project.title === formData.project_name
  );

  /********** Get Project List **********/

  return (
    <>
      <AllHeaders />
      <div className="maincontent">
        <div className="container mx-1000" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="d-flex flex-row gap-5 align-items-center">
            <div className="hrhdng">
              <h2>Create Job</h2>
            </div>
            {!shower && !preview ? (
              <Box sx={{ minWidth: 800, display: "flex", gap: 2, flexWrap: "wrap" }}>
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
                    id="designation-select"
                    options={projectList}
                    getOptionLabel={(option) => option?.title || ""}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Designation" variant="outlined" />
                    )}
                    value={selectedProject || null}
                    onChange={handleProjectChange}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionDisabled={(option) => option.title === ''}
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
              <JobTitleDepartment formData={formData} handleAllInputChange={handleAllInputChange} />

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