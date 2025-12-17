import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import GoBackButton from "./Goback";
import StepConnector from "@mui/material/StepConnector";
import Stepper from "@mui/material/Stepper";
import { styled } from "@mui/system";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { stepConnectorClasses } from "@mui/material/StepConnector";
import Box from "@mui/material/Box";
import GeneralInfo from "./General-info";
import Form from "react-bootstrap/Form";
import { CiCalendar } from "react-icons/ci";
import FormGroup from "@mui/material/FormGroup";
import VerifyDocsModal from "./Verify-docs-modal";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import {
  addEmployeeGeneralInfo,
  addEmployeeEducationInfo,
  addEmployeeExperienceInfo,
  addEmployeeClassificationInfo,
  addEmployeePfInfo,
  addEmployeeAddressInfo,
  getDepartmentList,
  getLocationList,
  getOccupationList,
  getDivisionList,
  getDispensaryList,
  getBankList,
  getRegionList,
  getStateList,
  getEmployeeById,
  getProjectList,
} from "./helper/Api_Helper";
import { FetchCandidatesListById } from "../features/slices/AppliedJobCandidates/JobAppliedCandidateSlice";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import EmpImportModal from "./UplodsBulkEmpModal/UplodsEmpModal";
import DocumentModalForUploads from "./UploadsDocumentOnboading";
import axios from "axios";
import config from "../config/config";

const steps = [
  "General Info",
  "Educational Info",
  "Previous Experience Info",
  "Classification",
  "TDS/PF/ESI/PT Details",
  "Contact & Addition Info",
];

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

export default function Onboarding() {
  const [educationDataSecondArray, setEducationDataSecondArray] = useState([]);
  const candidateRecords = useSelector((state) => state.appliedJobList.AppliedCandidateList)
  const dispatch = useDispatch();

  const [projectName, setProjectName] = useState();
  const [candidateData, setCandidateData] = useState([]);
  const [projectLocation, setprojectLocation] = useState([]);
  const [departmentsOptions, setDepartmentsOptions] = useState([]);
  const [projectBudgetEstimateData, setprojectBudgetEstimate] = useState([]);
  const [occupationOptions, setOccupationOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [dispensaryOptions, setDispensaryOptions] = useState([]);
  const [bankListOptions, setbankListOptions] = useState([]);
  const [regionListOptions, setRegionListOptions] = useState([]);
  const [residenceListOptions, setResidenceListOptions] = useState([]);
  const [permanentListOptions, setPermanentListOptions] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [employeeEamil, setEmployeeEamil] = useState("");
  const [searchParams] = useSearchParams();
  const [openImport, setOpenImport] = useState(false);
  const [Document, setDocument] = useState(null);
  const [occuptionOptin, setOccupationOption] = useState(null)

  // General Information Save Code
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("employeeFormData");
    return savedData ? JSON.parse(savedData) : {};
  });

  const [educationData, setEducationData] = useState([
    { degree: "High School", year: "", marks: "" },
    { degree: "Intermediate", year: "", marks: "" },
    { degree: "Graduation", year: "", marks: "" },
    { degree: "Post Graduation", year: "", marks: "" },
  ]);

  const [certifications, setCertifications] = useState([
    { id: 0, degree: "", marks: "", year: "" },
  ]);

  const [prefileFields, setPrefileFields] = useState([
    {
      employer_name: "",
      from_date: "",
      designation: "",
      to_date: "",
      id: 0,
    },
  ]);

  const [clfFormData, setClfFormData] = useState(() => {
    // Load initial data from localStorage or set defaults
    const savedData = localStorage.getItem("clfFormData");
    return savedData ? JSON.parse(savedData) : {};
  });

  const [PfInfoFormData, setPfInfoFormData] = useState(() => {
    // Load initial data from localStorage or set defaults
    const savedData = localStorage.getItem("PfInfoFormData");
    return savedData ? JSON.parse(savedData) : {};
  });

  const [residenceFormData, setResidenceFormData] = useState({
    residence_no: "",
    road_street: "",
    locality_area: "",
    city_district: "",
    state_name: "",
    pin_code: "",
    both_address_same: ''
  });

  const [permanentFormData, setPermanentFormData] = useState({
    residence_no: "",
    road_street: "",
    locality_area: "",
    city_district: "",
    state_name: "",
    pin_code: "",
  });

  const [isSameAddress, setIsSameAddress] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  let DocumentStatus = searchParams.get('candidate_id') && searchParams.get('type') === 'new';

  useEffect(() => {
    if (searchParams.get('candidate_id') && searchParams.get('type') === 'new') {
      localStorage.removeItem('onBoardingId')
      localStorage.removeItem('onBoardingLocation')
      localStorage.removeItem('onBoardingbudget_estimate_list')
      dispatch(FetchCandidatesListById(searchParams.get('candidate_id')));
    }
  }, [dispatch, searchParams])

  const dateOfBirthFormate = (dateString) => {
    console.log(`${dateString?.year}-${dateString?.month}-${dateString?.date}`, 'this is date');
    let actialDateFormate = moment(`${dateString?.year}-${dateString?.month}-0${dateString?.date}`).format('YYYY-MM-DD');
    return actialDateFormate;
  };


  useEffect(() => {

    if (candidateRecords.status === 'success') {
      const data = candidateRecords.data;
      let candidatedJobAppliedDetails = data?.applied_jobs?.find((item) => item.job_id === data?.job_id)
      setCandidateData(data);
      const selectedData = {
        name: data.name,
        email: data.email,
        alt_email: data.alt_email,
        mobile_no: data.mobile_no,
        aadhaar_no: data.aadhaar_no,
        date_of_birth: data.date_of_birth && formatDate(data.date_of_birth) || dateOfBirthFormate(data?.applicant_form_data?.dob),
        employee_type: ['OnRole', 'on Role'].includes(data.job_type) ? 'onRole' : ['empanelled'].includes(data.job_type) ? 'emPanelled' : 'onContract',
        father_name: data.father_name || data?.applicant_form_data?.father_hushband_name,
        employee_code: data.employee_code || candidatedJobAppliedDetails?.id_card_details?.employee_code,
        gender: data.gender || data?.applicant_form_data?.gender === 'male' ? 'Male' : 'Female',
        marital_status: data.marital_status || data?.applicant_form_data?.marital_status === 'single' ? 'Single' : 'Married',
        valid_till: data?.applied_jobs?.filter((item) => item.job_id === data?.job_id)[0]?.job_valid_till && formatDate(data?.applied_jobs?.filter((item) => item.job_id === data?.job_id)[0]?.job_valid_till),
        project_id: data.project_id,
        project_name: data.project_name,
        designation: data?.applied_jobs?.filter((item) => item.job_id === data?.job_id)[0]?.job_designation,
        designation_id: data?.applied_jobs?.filter((item) => item.job_id === data?.job_id)[0]?.job_designation_id,
        batch_id: (data?.applied_jobs?.filter((item) => item.job_id === data?.job_id)[0]?.batch_id && data?.applied_jobs?.filter((item) => item.job_id === data?.job_id)[0]?.batch_id) || data?.batch_id
      };
      setDocument(data?.onboarding_docs)
      setProjectName(data.project_id);
      // Merge the selected candidate data with formData
      setFormData((prevData) => ({
        ...prevData,
        ...selectedData,
      }));
      // console.log( candidatedJobAppliedDetails , 'this is Details of Candidate applied job details' )
      let updateBranchInCandidate = [candidatedJobAppliedDetails?.proposed_location]
      const clfData = {
        joining_date: formatDate(data?.applied_jobs?.filter((item) => item.job_id === data?.job_id)[0]?.onboard_date),
        // region: data.region,
        // division: data.division,
        // grade: data.grade,
        department: data?.department,
        branch: updateBranchInCandidate,
        isBrachUpdateFromCandidate: true
      };
      setClfFormData(clfData);
      /************ AutoFill the Experience and Education */
      let educatetionFielads =
        data?.education?.length > 0 ? data?.education :
          data?.applicant_form_data?.qualification?.length > 0 ?
            data?.applicant_form_data?.qualification?.map((edu) => ({
              degree: edu.degree,
              year: edu.passing_year,
              marks: edu?.marks ? edu?.marks : 0,
            })) : [];

      const educationData = educatetionFielads?.map((edu, index) => ({
        id: index,
        degree: edu.degree,
        year: moment(edu.to_date).year(),
        marks: edu?.marks ? edu?.marks : 0,
      }));

      if (educationData.length <= 0) {
        setCertifications([{ id: 0, degree: "", year: "", marks: "" }])
      } else {
        setCertifications(educationData);
      }

      let expiriaceDataWithEmpORCandidate =
        data?.experience?.length > 0 ? data?.experience :
          data?.applicant_form_data?.employment_history?.length > 0 ?
            data?.applicant_form_data?.employment_history?.map((exp) => ({
              company: exp?.org_name,
              designation: exp?.designation,
              from_date: formatDate(exp.duration_from),
              to_date: formatDate(exp.duration_to),
            }))
            : [];
      // Format and set prefile fields
      const formattedPrefileFields = expiriaceDataWithEmpORCandidate?.map((field) => ({
        employer_name: field?.company,
        designation: field?.designation,
        from_date: formatDate(field.from_date),
        to_date: formatDate(field.to_date),
      }));

      if (formattedPrefileFields.length <= 0) {
        setPrefileFields([{
          employer_name: "",
          from_date: "",
          designation: "",
          to_date: "",
          id: 1, // A unique ID to help manage the field
        },])
      } else {
        setPrefileFields(formattedPrefileFields);
      }
    }
  }, [candidateRecords.data, candidateRecords.status])

  /*********************** Fetch The Candidate Records **************************/
  const fetchCandidateData = async () => {
    try {
      const myId = localStorage.getItem("onBoardingId");
      const response = await getEmployeeById({ _id: myId, scope_fields: [] });
      const data = response.data;
      setCandidateData(data);
      const selectedData = {
        name: data.name,
        email: data.email,
        alt_email: data.alt_email,
        mobile_no: data.mobile_no,
        aadhaar_no: data.aadhaar_no,
        date_of_birth: formatDate(data.date_of_birth),
        employee_type: data.employee_type,
        father_name: data.father_name,
        employee_code: data.employee_code,
        gender: data.gender,
        marital_status: data.marital_status,
        valid_till: formatDate(data?.valid_till),
        project_id: data.project_id,
        project_name: data.project_name,
        designation: data.designation,
        designation_id: data?.designation_id,
        batch_id: data?.batch_id || ""
      };
      setProjectName(data.project_id);
      // Merge the selected candidate data with formData
      setFormData((prevData) => ({
        ...prevData,
        ...selectedData,
      }));

      // handle save the data
      const educationData = data.education_data?.map((edu, index) => ({
        id: index,
        degree: edu.degree_certificates,
        year: edu.passing_year,
        marks: edu.marks,
      }));

      if (educationData.length <= 0) {
        setCertifications([{ id: 0, degree: "", year: "", marks: "" }])
      } else {
        setCertifications(educationData);
      }

      // Format and set prefile fields
      const formattedPrefileFields = data.experience_info?.map((field) => ({
        ...field,
        from_date: formatDate(field.from_date),
        to_date: formatDate(field.to_date),
      }));

      if (formattedPrefileFields.length <= 0) {
        setPrefileFields([{
          employer_name: "",
          from_date: "",
          designation: "",
          to_date: "",
          id: 1, // A unique ID to help manage the field
        },])
      } else {
        setPrefileFields(formattedPrefileFields);
      }


      // Set clfFormData with additional fields
      const clfData = {
        joining_date: formatDate(data.joining_date),
        probation_complete_date: formatDate(data.probation_complete_date),
        appraisal_date: formatDate(data.appraisal_date),
        designation: data.designation,
        branch: data.branch,
        occupation: data.occupation,
        department: data.department,
        attendance: data.attendance,
        region: data.region,
        division: data.division,
        grade: data.grade,
      };

      setClfFormData(clfData);

      // Set pfInfoFormData with additional fields
      const pfData = {
        esi_number: data.esi_number || "",
        pf_number: data.pf_number || "",
        pf_effective_from: formatDate(data.pf_effective_from),
        pan_number: data.pan_number || "",
        bank_account_type: data.bank_account_type || "",
        bank_branch: data.bank_branch || "",
        esi_dispensary: data.esi_dispensary || "",
        pf_department_no: data.pf_department_no || "",
        uan_number: data.uan_number || "",
        bank_name: data.bank_name || "",
        bank_account_number: data.bank_account_number || "",
        ifsc_code: data.ifsc_code || "",
      };

      setPfInfoFormData(pfData);

      // Set residenceFormData and permanentFormData
      const presentAddressData = data.permanent_address || {};
      const residenceData = data.present_address || {};

      setResidenceFormData({
        residence_no: residenceData.residence_no || "",
        road_street: residenceData.road_street || "",
        locality_area: residenceData.locality_area || "",
        city_district: residenceData.city_district || "",
        state_name: residenceData.state_name || "",
        pin_code: residenceData.pin_code || "",
        both_address_same: data.both_address_same,
      });

      setIsSameAddress(data.both_address_same === 'Yes' ? true : false)

      setPermanentFormData({
        residence_no: presentAddressData.residence_no || "",
        road_street: presentAddressData.road_street || "",
        locality_area: presentAddressData.locality_area || "",
        city_district: presentAddressData.city_district || "",
        state_name: presentAddressData.state_name || "",
        pin_code: presentAddressData.pin_code || "",
      });

    } catch (error) {
      console.error("Error fetching candidate data", error);
    }
  };

  useEffect(() => {
    const myId = localStorage.getItem("onBoardingId");
    if (myId) {
      fetchCandidateData();
    }
  }, []);

  /*************** Project List Designation Here ****************/

  const [projectList, setProjectList] = useState([]);

  /****************** Add the Project Location Data from the server *********/

  useEffect(() => {
    const fetchProjectList = async () => {
      try {
        const response = await getProjectList(projectName, "Active");
        const projectData = response.data;


        if (projectData.length > 0) {
          const project = projectData[0];
          setProjectList(projectData)

          // Save location and budget_estimate_list to localStorage
          localStorage.setItem(
            "onBoardingLocation",
            JSON.stringify(project.location)
          );
          localStorage.setItem(
            "onBoardingbudget_estimate_list",
            JSON.stringify(project.budget_estimate_list)
          );
          // Set the state
          setprojectLocation(project.location);
          setprojectBudgetEstimate(project.budget_estimate_list);
        } else {
          console.warn("No project data available.");
        }
      } catch (error) {
        console.error("Error fetching Project data", error);
      }
    };

    // Call the function
    if (projectName) {
      fetchProjectList();
    }
  }, [projectName]);

  useEffect(() => {
    // Save formData to localStorage whenever it changes
    localStorage.setItem("employeeFormData", JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "email") {
      setEmployeeEamil(value);
    }
  };

  const handleNext = async () => {
    // Define the required fields
    const requiredFields = [
      "employee_type",
      "employee_code",
      "valid_till",
      "name",
      "father_name",
      "email",
      "mobile_no",
      "gender",
      "marital_status",
    ];

    // Check for any missing required fields
    const missingFields = requiredFields.filter((field) => !formData[field]);

    // Check if mobile number is exactly 10 digits
    if (formData.mobile_no && formData.mobile_no.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits.");
      return; // Stop execution if mobile number validation fails
    }

    if (missingFields.length > 0) {
      // Display an error message for the first missing field
      toast.error(
        `Please fill in the required field: ${missingFields[0].replace(
          "_",
          " "
        )}`
      );
      return; // Stop execution if validation fails
    }

    try {
      // Save data to the API before proceeding to the next step
      let response;
      if (searchParams.get('candidate_id') && searchParams.get('job_id')) {
        response = await addEmployeeGeneralInfo(formData, searchParams.get('job_id'), searchParams.get('candidate_id'));
      } else {
        response = await addEmployeeGeneralInfo(formData);
      }

      // console.log(response , 'this is response Data')
      if (response?.status) {
        // Save onBoardingId to localStorage and move to the next step
        localStorage.setItem("onBoardingId", response.data);

        const projectLocations = localStorage.getItem("onBoardingLocation");

        setprojectLocation(JSON.parse(projectLocations));

        toast.success(response.message);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      // toast.error("An error occurred while saving the data.");
    }
  };

  const fetchStateList = async (inputKey) => {
    try {
      const response = await getStateList(inputKey);

      if (response && Array.isArray(response.data)) {
        setStateList(response.data.map((e) => {
          return {
            value: e.name,
            label: e.name
          }
        }));
      } else {
        setStateList([]);
      }
    } catch (error) {
      setStateList([]);
    }
  };
  // General Information Save Code
  useEffect(() => {
    // Call fetchRegionList when component mounts
    fetchStateList("");
  }, []); // Empty dependency array ensures this runs once on mount

  const fetchRegionList = async (inputValue) => {
    try {
      // Replace with your API call
      const response = await getRegionList(inputValue);

      if (response.data && Array.isArray(response.data)) {
        setRegionListOptions(response.data.map((key) => {
          return {
            label: key.name,
            value: key.name
          }
        }));
      } else {
        setRegionListOptions([]);
      }
    } catch (error) {
      setRegionListOptions([]);
    }
  };

  const fetchBankList = async (inputValue) => {
    try {
      // Replace with your API call
      const response = await getBankList(inputValue);

      if (response.data && Array.isArray(response.data)) {
        setbankListOptions(response.data.map((e) => {
          return {
            label: e.name,
            value: e.name
          }
        }));
      } else {
        setbankListOptions([]);
      }
    } catch (error) {
      setbankListOptions([]);
    }
  };

  const fetchdispensary = async (inputValue) => {
    try {
      // Replace with your API call
      const response = await getDispensaryList(inputValue);

      if (response.data && Array.isArray(response.data)) {
        setDispensaryOptions(response.data);
      } else {
        setDispensaryOptions([]);
      }
    } catch (error) {
      setDispensaryOptions([]);
    }
  };

  const fetchDivision = async (inputValue) => {
    try {
      // Replace with your API call
      const response = await getDivisionList(inputValue);

      if (response.data && Array.isArray(response.data)) {
        setDivisionOptions(response.data);
      } else {
        setDivisionOptions([]);
      }
    } catch (error) {
      setDivisionOptions([]);
    }
  };

  const fetchOccupations = async (inputValue) => {
    // if (inputValue.length < 2) {
    //   setOccupationOptions([]);
    //   return;
    // }
    try {
      // Replace with your API call
      const response = await getOccupationList(inputValue);

      if (response.data && Array.isArray(response.data)) {
        setOccupationOptions(response.data?.map((key) => {
          return { value: key.name, label: key?.name }
        }));
      } else {
        setOccupationOptions([]);
      }
    } catch (error) {
      setOccupationOptions([]);
    }
  };

  const fetchDepartments = async (inputValue) => {
    try {
      // Replace with your API call
      const response = await getDepartmentList(inputValue);

      if (response.data && Array.isArray(response.data)) {
        setDepartmentsOptions(response.data?.map((key) => {
          return {
            value: key?.name,
            label: key?.name
          }
        }));
      } else {
        setDepartmentsOptions([]);
      }
    } catch (error) {
      setDepartmentsOptions([]);
    }
  };

  const fetchLocationList = async (inputValue) => {
    try {
      // Replace with your API call
      const response = await getLocationList(inputValue);

      if (response.data && Array.isArray(response.data)) {
        setResidenceListOptions(response.data.map((e) => {
          return {
            value: e.name,
            label: e.name
          }
        }));
      } else {
        setResidenceListOptions([]);
      }
    } catch (error) {
      setResidenceListOptions([]);
    }
  };

  const fetchLocationPermanentList = async (inputValue) => {
    if (inputValue.length < 2) {
      setPermanentListOptions([]);
      return;
    }
    try {
      // Replace with your API call
      const response = await getLocationList(inputValue);

      if (response.data && Array.isArray(response.data)) {
        setPermanentListOptions(response.data);
      } else {
        setPermanentListOptions([]);
      }
    } catch (error) {
      setPermanentListOptions([]);
    }
  };

  const isValidYear = (year) => {
    return /^\d{4}$/.test(year);
  };

  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  // const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Add the Stepper as custom Solution
  let stepperType = localStorage.getItem('stepsCount') ?? null;

  const [activeStep, setActiveStep] = useState(0);
  // set the Stepper base on the types and 

  useEffect(() => {
    if (stepperType && stepperType !== 'undefined') {
      setActiveStep(parseInt(stepperType));
    }
  }, [stepperType]);

  // only removed the Items base on the Condonation

  useEffect(() => {

    return () => {
      localStorage.removeItem('stepsCount')
    }
  }, [])

  useEffect(() => {
    // Save formData to localStorage whenever it changes
    localStorage.setItem("clfFormData", JSON.stringify(clfFormData));
  }, [clfFormData]);

  //  Division
  const handleDispensaryChange = (e) => {
    const value = e.target.value;
    fetchdispensary(value);
    setPfInfoFormData((prevData) => ({
      ...prevData,
      esi_dispensary: value,
    }));
  };

  const handleDispensaryOptionClick = (esi_dispensary) => {
    setPfInfoFormData((prevData) => ({
      ...prevData,
      esi_dispensary: esi_dispensary,
    }));
    setDispensaryOptions([]); // Clear the options after selection
  };

  const [resionStateOption, setResionOption] = useState(null)

  useEffect(() => {
    if (clfFormData.region) {
      setResionOption({ value: clfFormData.region, label: clfFormData.region })
    }
  }, [clfFormData.region])

  const handleRegionListChange = (option) => {
    setResionOption(option)
    setClfFormData((prevData) => ({
      ...prevData,
      region: option?.value,
    }));
  };

  const handleRegionInputChange = (input) => {
    fetchRegionList(input);
  }

  const [bankSelectOption, setBankSelectOption] = useState(null);
  useEffect(() => {
    if (PfInfoFormData.bank_name) {
      setBankSelectOption({ value: PfInfoFormData.bank_name, label: PfInfoFormData.bank_name });
    }
  }, [PfInfoFormData])


  const handleBankListChange = (option) => {
    setBankSelectOption(option)
    setPfInfoFormData((prevData) => ({
      ...prevData,
      bank_name: option?.value,
    }));
  };

  const handleBankListOptionClick = (bank_name) => {
    fetchBankList(bank_name);
  };

  //  Division
  const handleDivisionChange = (e) => {
    const value = e.target.value;
    setClfFormData((prevData) => ({
      ...prevData,
      division: value,
    }));
  };

  const handleDivisionOptionClick = (division) => {
    setClfFormData((prevData) => ({
      ...prevData,
      division: division,
    }));
    setDivisionOptions([]); // Clear the options after selection
  };


  const handleOccupationOptionClick = (occupation) => {
    setClfFormData((prevData) => ({
      ...prevData,
      occupation: occupation,
    }));
    setOccupationOptions([]); // Clear the options after selection
  };


  // Add the Fetch Occupation Dropdown using the Loads option data from the server
  // fetch the occupations data in 
  useEffect(() => {
    fetchOccupations("");
    fetchDepartments("");
    fetchRegionList("");
    fetchDivision("");
    fetchdispensary("");
    fetchBankList("");
    fetchLocationList("");
  }, [])


  const handleInputChangeOccuption = (input) => {
    setTimeout(() => {
      fetchOccupations(input);
    }, 500);
  }

  const handleOccupationChange = (option) => {
    setOccupationOption(option)
    setClfFormData((prevData) => ({
      ...prevData,
      occupation: option?.label,
    }));
  }

  /************************ Handle Department Data formate ***************/
  const [DepartMentOption, setDepartmentChooseOption] = useState(null);

  useEffect(() => {
    if (clfFormData.occupation) {
      setOccupationOption({ value: clfFormData.occupation, label: clfFormData.occupation })
    }
    if (clfFormData.department) {
      setDepartmentChooseOption({ value: clfFormData.department, label: clfFormData.department })
    }

  }, [clfFormData])


  const handleDepartmentChange = (option) => {
    setDepartmentChooseOption(option)
    setClfFormData((prevData) => ({
      ...prevData,
      department: option?.value,
    }));
  }

  const handleDepartMentInputChange = (input) => {
    fetchDepartments(input);
  }


  const handleDepartmentOptionClick = (department) => {
    setClfFormData((prevData) => ({
      ...prevData,
      department: department,
    }));
    setDepartmentsOptions([]); // Clear the options after selection
  };

  // Branch

  const clfHandleInputChange = (e) => {
    const { name, value } = e.target || {};
    if (name && value !== undefined) {
      setClfFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      console.warn("Unexpected event target:", e.target);
    }
  };

  const saveClassification = async () => {
    try {
      const myId = localStorage.getItem("onBoardingId");
      const obj1 = { _id: myId };
      const payload = { ...obj1, ...clfFormData };

      // Save data to the API before proceeding to the next step
      const response = await addEmployeeClassificationInfo(payload);

      if (response.status) {
        // Data
        localStorage.setItem("onBoardingId", response.data);
        toast.success(response.message);

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };
  // Classification Code

  // Pf Info Code
  const validatePfInfoForm = () => {
    const requiredFields = [
      "pan_number",
      "bank_branch",
      "bank_account_number",
      "ifsc_code",
    ];
    // Function to capitalize the first letter of each word
    const capitalizeFirstLetter = (str) => {
      return str
        .split("_")
        ?.map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    };
    // Check if any required field is empty
    for (const field of requiredFields) {
      if (!PfInfoFormData[field]) {
        const fieldName = capitalizeFirstLetter(field);
        toast.error(`${fieldName} is required`);
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    // Save formData to localStorage whenever it changes
    localStorage.setItem("PfInfoFormData", JSON.stringify(PfInfoFormData));
  }, [PfInfoFormData]);

  const PfInfohandleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle only the bank_account_number field
    if (name === "bank_account_number") {
      // Allow only numbers
      const numericValue = value.replace(/[^0-9]/g, "");

      // Update the form data with the numeric value
      setPfInfoFormData((prevData) => ({
        ...prevData,
        [name]: numericValue,
      }));
    } else {
      // Handle other fields as usual
      setPfInfoFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const savePfInfo = async () => {
    // Validate form data
    if (!validatePfInfoForm()) {
      return; // Stop execution if validation fails
    }
    try {
      const myId = localStorage.getItem("onBoardingId");
      const obj1 = { _id: myId };
      const payload = { ...obj1, ...PfInfoFormData };
      // Save data to the API before proceeding to the next step
      const response = await addEmployeePfInfo(payload);
      if (response.status) {
        // Data
        localStorage.setItem("onBoardingId", response.data);
        toast.success(response.message);

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };
  // Pf Info Code

  // residenceListOptions
  // setResidenceListOptions

  // Residence location
  const [district, setDistrict] = useState(null);

  const handleResidenceChange = (e) => {
    setDistrict(e)
    setResidenceFormData((prevData) => ({
      ...prevData,
      city_district: e.value,
    }));
  };

  const handleresidenceOptionClick = (city_district) => {
    fetchLocationList(city_district);
  };

  // Permanent location
  const [permanentDistrict, setPermanentDistrict] = useState(null);
  const handlePermanentChange = (value) => {
    setPermanentDistrict(value)
    setPermanentFormData((prevData) => ({
      ...prevData,
      city_district: value.value,
    }));
  };

  const handlepermanentOptionClick = (city_district) => {
    setPermanentFormData((prevData) => ({
      ...prevData,
      city_district: city_district,
    }));
    setPermanentListOptions([]); // Clear the options after selection
  };

  const addresshandleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    setResidenceFormData((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }));

    if (name === "both_address_same") {
      setIsSameAddress(checked);
    }
  };

  const [state_name, setState_name] = useState(null);

  useEffect(() => {
    if (residenceFormData.city_district) {
      setDistrict({ value: residenceFormData.city_district, label: residenceFormData.city_district })
    }
    if (residenceFormData.state_name) {
      setState_name({ value: residenceFormData.state_name, label: residenceFormData.state_name })
    }
    if (permanentFormData.city_district) {
      setPermanentDistrict({ value: permanentFormData.city_district, label: permanentFormData.city_district })
    }
    if (permanentFormData.state_name) {
      setParmanetsState({ value: permanentFormData.state_name, label: permanentFormData.state_name })
    }

  }, [residenceFormData, permanentFormData])

  const handleAddressState = (option) => {
    setState_name(option)
    setResidenceFormData((prevData) => ({
      ...prevData,
      "state_name": option.value,
    }));
  }

  const handleInputStateChanges = (keywords) => {
    fetchStateList(keywords)
  }

  const permanenthandleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    setPermanentFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [parmanetsState, setParmanetsState] = useState(null);

  const handleAddressStateParmanets = (option) => {
    setParmanetsState(option)
    setPermanentFormData((prevData) => ({
      ...prevData,
      "state_name": option.value,
    }));
  }

  // useEffect(() => {
  //   localStorage.setItem(
  //     "residenceFormData",
  //     JSON.stringify(residenceFormData)
  //   );
  // }, [residenceFormData]);

  // useEffect(() => {
  //   localStorage.setItem(
  //     "permanentFormData",
  //     JSON.stringify(permanentFormData)
  //   );
  // }, [permanentFormData]);

  useEffect(() => {
    if (isSameAddress) {
      setPermanentFormData({ ...residenceFormData });
    }
  }, [isSameAddress, residenceFormData]);

  const saveresidence = async () => {
    const myId = localStorage.getItem("onBoardingId");
    const obj1 = { _id: myId };
    // Check if residenceFormData contains 'both_address_same'
    const { ...residenceData } = residenceFormData;
    // Set the permanent_address based on the 'both_address_same' property
    // const bothAddressSameString = permanentFormData.both_address_same
    //   ? "Yes"
    //   : "No";
    const { both_address_same, ...paramanets } = permanentFormData;

    const payload = {
      ...obj1,
      present_address: residenceData,
      permanent_address: paramanets,
      both_address_same: isSameAddress ? 'Yes' : 'No',
    };
    try {
      // Save data to the API before proceeding to the next step
      const response = await addEmployeeAddressInfo(payload);

      if (response.status) {

        localStorage.setItem("onBoardingId", response.data);
        toast.success(response.message);
        if (searchParams.get('approval_note_id') && searchParams.get('candidate_id')) {
          navigate(`/salary?candidate_id=${searchParams.get('candidate_id')}&approval_note_id=${searchParams.get('approval_note_id')}`);
        } else {
          navigate(`/salary`);
        }

      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };
  // residence Code

  // Education Data  Save Code

  const [finalResult, setFinalResult] = useState([]);

  const handleEducationInputChange = (e, index, field) => {
    const value = e.target.value;

    if (field === "year") {
      // Remove any non-digit characters
      const numericValue = value.replace(/\D/g, "");
      // Check if the value exceeds 4 digits
      if (numericValue.length > 4) {
        toast.error("Year must be 4 digits or less.");
      }
      // Update state with the validated value
      const updatedEducationData = [...educationData];
      updatedEducationData[index][field] = numericValue;
      setEducationData(updatedEducationData);
    } else {
      const updatedEducationData = [...educationData];
      updatedEducationData[index][field] = value;
      setEducationData(updatedEducationData);
    }
  };

  const handleCertificationInputChange = (e, index, field) => {
    const value = e.target.value;

    if (field === "year") {
      // Remove any non-digit characters
      const numericValue = value.replace(/\D/g, "");

      // Check if the value exceeds 4 digits
      if (numericValue.length > 4) {
        toast.error("Year must be 4 digits or less.");
      }

      // Update state with the validated value
      const updatedCertifications = [...certifications];
      updatedCertifications[index][field] = numericValue;
      setCertifications(updatedCertifications);
    } else {
      const updatedCertifications = [...certifications];
      updatedCertifications[index][field] = value;
      setCertifications(updatedCertifications);
    }
  };

  const handleAddCertification = () => {
    setCertifications([
      ...certifications,
      { id: certifications.length, degree: "", marks: "", year: "" },
    ]);
  };

  const handleRemoveCertification = (id) => {
    setCertifications(certifications.filter((cert) => cert.id !== id));
  };

  // Merge educationData and certifications into finalResult
  useEffect(() => {
    const combinedData = [
      ...certifications?.map(({ degree, marks, year }) => ({
        degree,
        marks,
        year,
      })),
    ];
    setFinalResult(combinedData);
  }, [certifications]);

  const saveEducation = async () => {
    try {
      const myId = localStorage.getItem("onBoardingId");
      // Save data to the API before proceeding to the next step
      const payload = { _id: myId, education: finalResult };
      const response = await addEmployeeEducationInfo(payload);
      if (response.status) {
        // data
        localStorage.setItem("onBoardingId", response.data);
        toast.success(response.message);

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        toast.error(response.message);
      }
      // Move to the next step only if the API call is successful
      //     setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch (error) {
      console.error("Error saving data:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    localStorage.removeItem('stepsCount')
  };
  // Education Data  Save Code

  // Experience Data Save Code

  const handlePreInputChange = (e, index, field) => {
    const { value } = e.target;
    const updatedPrefileFields = [...prefileFields];
    updatedPrefileFields[index] = {
      ...updatedPrefileFields[index],
      [field]: value,
    };
    setPrefileFields(updatedPrefileFields);
  };

  const handleAddFileField = () => {
    setPrefileFields([
      ...prefileFields,
      {
        employer_name: "",
        from_date: "",
        designation: "",
        to_date: "",
        id: prefileFields.length + 1, // Increment the ID
      },
    ]);
  };

  const ExphandleRemoveFileField = (id) => {
    setPrefileFields(prefileFields.filter((field) => field.id !== id));
  };

  const SavePrevExp = async () => {
    try {
      const myId = localStorage.getItem("onBoardingId");

      // Save data to the API before proceeding to the next step
      const payload = { _id: myId, experience: prefileFields };
      const response = await addEmployeeExperienceInfo(payload);
      if (response.status) {
        // data
        toast.success(response.message);

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      // Handle the error (e.g., show an error message to the user)
    }
  };
  // Experience Data Save Code

  const options = projectLocation?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  // Remove duplicates from options and create a Set for quick lookup
  const uniqueOptions = options ? [
    ...new Map(options.map(option => [option.label, option])).values()
  ] : [];

  const availableOptionsMap = new Map(uniqueOptions.map(option => [option.label, option]));

  const HandleBranchChange = (selectedOptions) => {
    // Extract only the labels from the selected options
    const selectedLabels = selectedOptions
      ? selectedOptions.map((option) => option.label)
      : [];
    // Update the state with the array of labels
    setClfFormData((prevData) => ({
      ...prevData,
      branch: selectedLabels,
      isBrachUpdateFromCandidate: false // Reset candidate flag when user makes changes
    }));
  };

  const downloadFile = () => {
    const fileUrl = '/Hrms_Employee_import_format.xlsx';
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = 'Hrms_Employee_import_format.xlsx';
    anchor.click();
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem("PfInfoFormData");
    }
  }, [])

  const [openOnBoardDoc, setOpenOnboardDoc] = useState(false);

  // console.log(projectBudgetEstimateData)
  return (
    <>
      {/* <AllHeaders /> */}
      <div className="maincontent">
        <div className="container" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="d-flex justify-content-between">
            <div className="hrhdng">
              <h2>Employee Onboarding</h2>
            </div>
            <div className="hrhdng d-flex gap-2">
              {/* <button className="create-job btn" onClick={(e) => setOpenImport(true)}>Import Employee</button> */}
              <Link to='/import-employee' className="create-job btn"> Import Employee </Link>
              <Link to='/import-salary' className="create-job btn"> Import Salary </Link>
              {/* <button className="create-job btn" onClick={downloadFile}>Download Format</button> */}
            </div>
          </div>
          <div className="onboarding_forms">
            <div className="card card-border rounded-4 py-4 mt-4">
              <div className="card-body w90">
                <Box sx={{ width: "100%" }}>
                  <Stepper
                    className="onboard_steps"
                    activeStep={activeStep}
                    connector={<ColorlibConnector />}
                    alternativeLabel
                  >
                    {/* Your steps */}
                    {steps?.map((label, index) => (
                      <Step key={label}>
                        {" "}
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
                {activeStep === 0 ? (
                  <>
                    <GeneralInfo
                      formData={formData}
                      designationData={projectBudgetEstimateData}
                      handleInputChange={handleInputChange}
                      projectListData={projectList}
                      // setprojectBudgetEstimate={setprojectBudgetEstimate}
                      setProjectLists={setProjectList}
                      setProjectNameId={setProjectName}
                    />
                    <div className="d-flex justify-content-end mt-5">
                      <div class="read-btn mt-3">
                        <button class="px-5 btn" onClick={handleNext}>
                          Save & Educational Info
                        </button>
                      </div>
                    </div>
                  </>
                ) : null}
                {activeStep === 1 ? (
                  <>
                    {/* Education Information */}
                    <div
                      className="row mt-3 gy-3 align-items-center"
                      data-aos="fade-in"
                      data-aos-duration="3000"
                    >
                      <div className="col-5">

                      </div>

                    </div>

                    {/* Certification Information */}
                    <div className="certifications_row gy-3">
                      {certifications?.map((cert, index) => (
                        <div
                          className={`row mb-4 certificationblock-${cert.id}`}
                          key={cert.id}
                        >
                          <div className="col-5">
                            <Form.Group
                              controlId={`certificationName-${cert.id}`}
                            >
                              <Form.Label> Degree / Certification </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Excel Certification"
                                value={cert.degree}
                                onChange={(e) =>
                                  handleCertificationInputChange(
                                    e,
                                    index,
                                    "degree"
                                  )
                                }
                              />
                            </Form.Group>
                          </div>
                          <div className="col-5">
                            <div className="d-flex flex-row gap-4 align-items-end">
                              <div>
                                <Form.Label> Marks / Grade </Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="70.12"
                                  value={cert.marks}
                                  onChange={(e) =>
                                    handleCertificationInputChange(
                                      e,
                                      index,
                                      "marks"
                                    )
                                  }
                                  maxLength={5}
                                />
                              </div>
                              <div>
                                <Form.Label>Year</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="2022"
                                  value={cert.year}
                                  onChange={(e) =>
                                    handleCertificationInputChange(
                                      e,
                                      index,
                                      "year"
                                    )
                                  }
                                  maxLength={4}
                                  pattern="\d{4}"
                                />
                              </div>
                            </div>
                          </div>
                          <button
                            className="addbtn me-2"
                            type="button"
                            onClick={handleAddCertification}
                          >
                            +
                          </button>
                          <button
                            className="subtbtn"
                            type="button"
                            onClick={() => handleRemoveCertification(cert.id)}
                          >
                            -
                          </button>
                        </div>
                      ))}

                    </div>
                    <div className="d-flex justify-content-between mt-5">
                      <div class="mt-3">
                        <button class="tbtn btn prevbtn" onClick={handleBack}>
                          {" "}
                          Previous{" "}
                        </button>
                      </div>
                      <div class="read-btn mt-3">
                        <button class="px-5 btn" onClick={saveEducation}>
                          Save & Pervious Experience
                        </button>
                      </div>
                    </div>
                  </>
                ) : null}
                {activeStep === 2 ? (
                  <>
                    <div className="carifications_row">
                      {/* {prefileFields.map((field) => ( */}
                      {prefileFields?.map((preffile, index) => (
                        <div
                          className={`mb-4 certificationblock--${preffile.id}`}
                          key={preffile.id}
                        >
                          <div className="row mt-3 gy-3 align-items-end">
                            <div className="col-5">
                              <Form>
                                <Form.Group
                                  className="mb-4"
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Label>
                                    Previous Employer Name
                                  </Form.Label>
                                  <div className="d-flex flex-row gap-5">
                                    <Form.Control
                                      type="text"
                                      placeholder="Abc Pvt. Ltd."
                                      name="employer_name"
                                      value={preffile.employer_name}
                                      onChange={(e) =>
                                        handlePreInputChange(
                                          e,
                                          index,
                                          "employer_name"
                                        )
                                      }
                                    />
                                  </div>
                                </Form.Group>
                                <Form.Group
                                  className="mt-1"
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Label>From</Form.Label>
                                  <div className="datebox d-flex flex-row gap-5">
                                    <Form.Control
                                      type="date"
                                      placeholder="60.35"
                                      name="from_date"
                                      value={preffile.from_date}
                                      onChange={(e) =>
                                        handlePreInputChange(
                                          e,
                                          index,
                                          "from_date"
                                        )
                                      }
                                    />
                                    <CiCalendar />
                                  </div>
                                </Form.Group>
                              </Form>
                            </div>
                            <div className="col-5">
                              <Form>
                                <Form.Group
                                  className="mb-4"
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Label>Designation</Form.Label>
                                  <div className="d-flex flex-row gap-5">
                                    <Form.Control
                                      type="text"
                                      placeholder="Junior Engineer"
                                      name="designation"
                                      value={preffile.designation}
                                      onChange={(e) =>
                                        handlePreInputChange(
                                          e,
                                          index,
                                          "designation"
                                        )
                                      }
                                    />
                                  </div>
                                </Form.Group>
                                <Form.Group
                                  className="mt-1"
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Label>To</Form.Label>
                                  <div className="datebox d-flex flex-row gap-2 ">
                                    <Form.Control
                                      type="date"
                                      name="to_date"
                                      value={preffile.to_date}
                                      onChange={(e) =>
                                        handlePreInputChange(
                                          e,
                                          index,
                                          "to_date"
                                        )
                                      }
                                    />
                                    <CiCalendar />
                                  </div>
                                </Form.Group>
                              </Form>
                            </div>
                          </div>
                          {
                            index !== 0 &&
                            <button
                              className="subtbtn"
                              type="button"
                              onClick={() =>
                                ExphandleRemoveFileField(preffile.id)
                              }
                            >
                              -
                            </button>
                          }

                        </div>
                      ))}
                      <button
                        className="addbtn"
                        type="button"
                        onClick={handleAddFileField}
                      >
                        +
                      </button>
                      {/* <Prev_employee_info /> */}
                    </div>
                    <div className="d-flex justify-content-between mt-5">
                      <div class="mt-3">
                        <button class="tbtn btn prevbtn" onClick={handleBack}>
                          Previous
                        </button>
                      </div>
                      <div class="read-btn  mt-3">
                        <button class=" px-5 btn" onClick={SavePrevExp}>
                          Save & Pervious Experience
                        </button>
                      </div>
                    </div>
                  </>
                ) : null}
                {activeStep === 3 ? (
                  <>
                    <div
                      className="mt-3 gy-3 align-items-end"
                      data-aos="fade-in"
                      data-aos-duration="3000"
                    >
                      <Form>
                        <div className="row">
                          <Form.Group
                            className="mb-4 col-6"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>Date of Joining</Form.Label>
                            <div className="datebox d-flex flex-row gap-5">
                              <Form.Control
                                type="date"
                                name="joining_date"
                                value={clfFormData.joining_date || ""}
                                onChange={clfHandleInputChange}
                              />
                              <CiCalendar />
                            </div>
                          </Form.Group>
                          <Form.Group
                            className="mb-4 col-6"
                            controlId="exampleForm.ControlInput14"
                          >
                            <Form.Label>Probation Completion Date</Form.Label>
                            <div className="datebox d-flex flex-row gap-5">
                              <Form.Control
                                type="date"
                                name="probation_complete_date"
                                value={
                                  clfFormData.probation_complete_date || ""
                                }
                                onChange={clfHandleInputChange}
                              />
                              <CiCalendar />
                            </div>
                          </Form.Group>
                          <Form.Group
                            className="mb-4 col-6"
                            controlId="exampleForm.ControlInput14"
                          >
                            <Form.Label>Appraisal Date</Form.Label>
                            <div className="datebox d-flex flex-row gap-5">
                              <Form.Control
                                type="date"
                                name="appraisal_date"
                                value={clfFormData.appraisal_date || ""}
                                onChange={clfHandleInputChange}
                              />
                              <CiCalendar />
                            </div>
                          </Form.Group>


                          <Form.Group
                            className="mb-4 col-6"
                            controlId="exampleForm.ControlInput13"
                          >
                            <Form.Label>Place of Posting</Form.Label>
                            <div className=" text-start">
                              <Select
                                id="projectLocation"
                                isMulti
                                options={uniqueOptions}
                                // value={options.filter((option) =>clfFormData.branch.includes(option.label) )}
                                value={
                                  // For candidate data (editing existing)
                                  clfFormData?.isBrachUpdateFromCandidate && clfFormData?.branch?.[0]
                                    ? availableOptionsMap.get(clfFormData?.branch[0]) ? [availableOptionsMap.get(clfFormData?.branch[0])] : [{ label: clfFormData?.branch[0], value: clfFormData?.branch[0] }]
                                    : // For user-selected options (current state) - remove duplicates
                                    Array.isArray(clfFormData?.branch) && clfFormData?.branch?.length > 0
                                      ? [...new Set(clfFormData.branch)].map((branch) =>
                                        availableOptionsMap.get(branch) || { label: branch, value: branch }
                                      )
                                      : // For existing employee data (editing saved employee)
                                      clfFormData?.branch && !Array.isArray(clfFormData?.branch)
                                        ? availableOptionsMap.get(clfFormData?.branch) || { label: clfFormData?.branch, value: clfFormData?.branch }
                                        : // Default: no selection
                                        null
                                }
                                onChange={HandleBranchChange}
                                placeholder="Select locations..."
                              />
                            </div>
                          </Form.Group>
                          {/* Cooption data to changes Data */}
                          <Form.Group
                            className="mb-4 col-6 position-relative"
                            controlId="exampleForm.ControlInput13"
                          >
                            <Form.Label>Occupation</Form.Label>

                            <Select
                              name="occupation"
                              value={occuptionOptin}
                              onChange={handleOccupationChange}
                              options={occupationOptions}
                              onInputChange={handleInputChangeOccuption}
                              isSearchable={true} // Enable search functionality
                              placeholder="Occupation"
                              styles={customStyles}
                            />
                          </Form.Group>
                          {/* Department Dropdown Changes Data */}
                          <Form.Group
                            className="mb-4 col-6 position-relative"
                            controlId="exampleForm.ControlInput13"
                          >
                            <Form.Label>Department</Form.Label>


                            {/* Department DropDown for test Data */}
                            <Select
                              name="Department"
                              value={DepartMentOption}
                              onChange={handleDepartmentChange}
                              options={departmentsOptions}
                              onInputChange={handleDepartMentInputChange}
                              isSearchable={true} // Enable search functionality
                              placeholder="Department"
                              styles={customStyles}
                            />
                          </Form.Group>
                          <Form.Group
                            className="mb-4 col-6"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>Attendance</Form.Label>
                            <div className="d-flex flex-row gap-5 text-start">
                              <Form.Select
                                name="attendance"
                                value={clfFormData.attendance || "Choose..."}
                                onChange={clfHandleInputChange}
                              >
                                <option value="">Choose...</option>
                                <option value="6">Attendance - Six days</option>
                                <option value="5">
                                  Attendance - Five days
                                </option>
                              </Form.Select>
                            </div>
                          </Form.Group>
                          <Form.Group
                            className="mb-4 col-6 position-relative"
                            controlId="exampleForm.ControlInput13"
                          >
                            <Form.Label>Region</Form.Label>

                            <Select
                              name="region"
                              value={resionStateOption}
                              onChange={handleRegionListChange}
                              options={regionListOptions}
                              onInputChange={handleRegionInputChange}
                              isSearchable={true} // Enable search functionality
                              placeholder="region"
                              styles={customStyles}
                            />
                          </Form.Group>
                          <Form.Group
                            className="mb-4 col-6 position-relative"
                            controlId="exampleForm.ControlInput13"
                          >
                            <Form.Label>Division</Form.Label>
                            <Form.Select
                              name="division"
                              value={clfFormData.division}
                              onChange={handleDivisionChange}
                              placeholder="Search for a division..."
                            >
                              <option value="">Select Division</option>
                              {
                                divisionOptions.length > 0 &&
                                divisionOptions.map((option) => {
                                  return <option value={option.name}>{option.name}</option>
                                })
                              }
                            </Form.Select>
                          </Form.Group>
                          <Form.Group
                            className="mb-4 col-6"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>Grade</Form.Label>
                            <div className="d-flex flex-row gap-5 text-start">
                              <Form.Select
                                name="grade"
                                value={clfFormData.grade || "Choose..."}
                                onChange={clfHandleInputChange}
                              >
                                <option value="">Choose...</option>
                                <option value="NMG">NMG</option>
                                <option value="Grade 1">Grade 1</option>
                                <option value="Grade 2">Grade 2</option>
                                <option value="Grade 3">Grade 3</option>
                                <option value="Grade 4">Grade 4</option>
                                <option value="Grade 5">Grade 5</option>
                                <option value="Grade 6">Grade 6</option>
                                <option value="Grade 7">Grade 7</option>
                                <option value="Grade 8">Grade 8</option>
                              </Form.Select>
                            </div>
                          </Form.Group>
                        </div>
                      </Form>
                    </div>

                    <div className="d-flex justify-content-between mt-5">
                      <div class="mt-3">
                        <button class="tbtn btn prevbtn" onClick={handleBack}>
                          Previous
                        </button>
                      </div>
                      <div class="read-btn  mt-3">
                        <button class="px-5 btn" onClick={saveClassification}>
                          Save & Pervious Experience
                        </button>
                      </div>
                    </div>
                  </>
                ) : null}
                {activeStep === 4 ? (
                  <>
                    <div
                      className="row mt-3 gy-3 align-items-end"
                      data-aos="fade-in"
                      data-aos-duration="3000"
                    >
                      <div className="col-6 ">
                        <Form>
                          <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>ESI Number</Form.Label>
                            <div className="d-flex flex-row gap-5">
                              <Form.Control
                                type="text"
                                placeholder="Enter ESI number"
                                name="esi_number"
                                value={PfInfoFormData.esi_number || ""}
                                onChange={PfInfohandleInputChange}
                              />
                            </div>
                          </Form.Group>
                          <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>PF Number</Form.Label>
                            <div className="d-flex flex-row gap-5">
                              <Form.Control
                                type="text"
                                maxLength={22}
                                placeholder="Enter PF number"
                                name="pf_number"
                                value={PfInfoFormData.pf_number || ""}
                                onChange={PfInfohandleInputChange}
                              />
                            </div>
                          </Form.Group>
                          <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>PF Effective from</Form.Label>
                            <div className="datebox d-flex flex-row gap-5">
                              <Form.Control
                                type="date"
                                placeholder="Enter PF number"
                                name="pf_effective_from"
                                value={PfInfoFormData.pf_effective_from || ""}
                                onChange={PfInfohandleInputChange}
                              />
                              <CiCalendar />
                            </div>
                          </Form.Group>

                          <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>TDS Detail (Pan Number)</Form.Label>
                            <div className="d-flex flex-row gap-5">
                              <Form.Control
                                type="text"
                                maxLength={10}
                                placeholder="BTEEK556728"
                                name="pan_number"
                                value={PfInfoFormData.pan_number || ""}
                                onChange={PfInfohandleInputChange}
                              />
                            </div>
                          </Form.Group>
                          <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput13"
                          >
                            <Form.Label>Bank Account Type</Form.Label>
                            <div className="d-flex flex-row gap-5 text-start">
                              <Form.Select
                                defaultValue="Choose..."
                                name="bank_account_type"
                                value={
                                  PfInfoFormData.bank_account_type ||
                                  "Choose..."
                                }
                                onChange={PfInfohandleInputChange}
                              >
                                <option value="">Choose...</option>
                                <option value="Current">Current</option>
                                <option value="Saving">Saving</option>
                              </Form.Select>
                            </div>
                          </Form.Group>
                          <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput13"
                          >
                            <Form.Label>Bank Branch</Form.Label>
                            <div className="d-flex flex-row gap-5 text-start">

                              <Form.Control
                                type="text"
                                placeholder="Kapoorthala, Lucknow "
                                name="bank_branch"
                                value={PfInfoFormData.bank_branch || ""}
                                onChange={PfInfohandleInputChange}
                              />
                            </div>
                          </Form.Group>
                        </Form>
                      </div>
                      <div className="col-6 ">
                        <Form>
                          <Form.Group
                            className="mb-4 position-relative"
                            controlId="exampleForm.ControlInput13"
                          >
                            <Form.Label>ESI Dispensary</Form.Label>
                            <Form.Control
                              type="text"
                              name="esi_dispensary"
                              value={PfInfoFormData.esi_dispensary}
                              onChange={handleDispensaryChange}
                              placeholder="Enter ESI Dispensary"
                            >
                            </Form.Control>
                          </Form.Group>

                          <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>PF number Dept. File</Form.Label>
                            <div className="d-flex flex-row gap-5">
                              <Form.Control
                                type="text"
                                placeholder="Enter PF Dept. number"
                                name="pf_department_no"
                                value={PfInfoFormData.pf_department_no || ""}
                                onChange={PfInfohandleInputChange}
                              />
                            </div>
                          </Form.Group>
                          <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>UAN number</Form.Label>
                            <div className="d-flex flex-row gap-5">
                              <Form.Control
                                type="text"
                                maxLength={12}
                                placeholder="Enter UAN number"
                                name="uan_number"
                                value={PfInfoFormData.uan_number || ""}
                                onChange={PfInfohandleInputChange}
                              />
                            </div>
                          </Form.Group>

                          <Form.Group
                            className="mb-4  position-relative"
                            controlId="exampleForm.ControlInput13"
                          >
                            <Form.Label>Bank Name</Form.Label>

                            <Select
                              name="bank_name"
                              value={bankSelectOption}
                              onChange={handleBankListChange}
                              options={bankListOptions}
                              onInputChange={handleBankListOptionClick}
                              isSearchable={true} // Enable search functionality
                              placeholder="Select bank...."
                              styles={customStyles}
                            />
                          </Form.Group>
                          <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>Bank Account number</Form.Label>
                            <div className="d-flex flex-row gap-5">
                              <Form.Control
                                type="text"
                                placeholder="Enter Bank Account number"
                                name="bank_account_number"
                                value={PfInfoFormData.bank_account_number || ""}
                                onChange={PfInfohandleInputChange}
                              />
                            </div>
                          </Form.Group>
                          <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>IFSC Code</Form.Label>
                            <div className="d-flex flex-row gap-5">
                              <Form.Control
                                type="text"
                                maxLength={11}
                                placeholder="Enter IFSC Code"
                                name="ifsc_code"
                                value={PfInfoFormData.ifsc_code || ""}
                                onChange={PfInfohandleInputChange}
                              />
                            </div>
                          </Form.Group>
                        </Form>
                      </div>
                    </div>
                    {/* <Tds_info /> */}
                    <div className="d-flex justify-content-between mt-5">
                      <div class="mt-3">
                        <button class="tbtn btn prevbtn" onClick={handleBack}>
                          Previous
                        </button>
                      </div>
                      <div class="read-btn mt-3">
                        <button class=" px-5 btn" onClick={savePfInfo}>
                          Saves & Pervious Experience
                        </button>
                      </div>
                    </div>
                  </>
                ) : null}
                {activeStep === 5 ? (
                  <>
                    {/* <Contact_info /> */}
                    <div
                      className=" mt-3 gy-3 align-items-end"
                      data-aos="fade-in"
                      data-aos-duration="3000"
                    >
                      <Form>
                        <div className="row">
                          {/* Residence Form Fields */}
                          <Form.Group
                            className="col-6 mb-4"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>Residence No.</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="1/222"
                              name="residence_no"
                              value={residenceFormData.residence_no || ""}
                              onChange={addresshandleInputChange}
                            />
                          </Form.Group>
                          {/* Residecial Road Street Feeds */}
                          <Form.Group
                            className="col-6 mb-4"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>Road / Street</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Mayur Vihar"
                              name="road_street"
                              value={residenceFormData.road_street || ""}
                              onChange={addresshandleInputChange}
                            />
                          </Form.Group>
                          {/* Location Aresa */}
                          <Form.Group
                            className="col-6 mb-4"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>Locality / Area</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Sector 62"
                              name="locality_area"
                              value={residenceFormData.locality_area || ""}
                              onChange={addresshandleInputChange}
                            />
                          </Form.Group>
                          {/* City Discrict */}
                          <Form.Group
                            className="col-6 mb-4 position-relative"
                            controlId="exampleForm.ControlInput13"
                          >
                            <Form.Label>City / District</Form.Label>

                            <Select
                              name="Search for a city / district"
                              value={district}
                              onChange={handleResidenceChange}
                              options={residenceListOptions}
                              onInputChange={handleresidenceOptionClick}
                              isSearchable={true} // Enable search functionality
                              placeholder="Search for a city / district...."
                              styles={customStyles}
                            />
                          </Form.Group>
                          {/* State Name */}
                          <Form.Group
                            className="col-6 mb-4"
                            controlId="exampleForm.ControlInput13"
                          >
                            <Form.Label>State</Form.Label>

                            <Select
                              name="Search for a city / district"
                              value={state_name}
                              onChange={handleAddressState}
                              options={stateList}
                              onInputChange={handleInputStateChanges}
                              isSearchable={true} // Enable search functionality
                              placeholder="Search for a city / state...."
                              styles={customStyles}
                            />
                          </Form.Group>
                          {/* Pin Code */}
                          <Form.Group
                            className="col-6 mb-4"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>Pincode</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="222222"
                              maxLength={6}
                              name="pin_code"
                              value={residenceFormData.pin_code || ""}
                              onChange={addresshandleInputChange}
                            />
                          </Form.Group>

                          {/* Here the Check Box To Check the Same or Not */}
                          <div className="col-12 mb-4">
                            <FormGroup>
                              <Form.Check
                                type="checkbox"
                                id="chk1"
                                label="Use Present Address as Permanent Address"
                                name="both_address_same"
                                checked={
                                  isSameAddress
                                }
                                onChange={addresshandleInputChange}
                              />
                            </FormGroup>
                          </div>

                          {/* Permanent Form Fields */}
                          <Form.Group
                            className="col-6 mb-4"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>Residence No.</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="1/222"
                              name="residence_no"
                              value={permanentFormData.residence_no || ""}
                              onChange={permanenthandleInputChange}
                              disabled={isSameAddress} // Disable if checkbox is checked
                            />
                          </Form.Group>
                          <Form.Group
                            className="col-6 mb-4"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>Road / Street</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Mayur Vihar"
                              name="road_street"
                              value={permanentFormData.road_street || ""}
                              onChange={permanenthandleInputChange}
                              disabled={isSameAddress} // Disable if checkbox is checked
                            />
                          </Form.Group>
                          <Form.Group
                            className="col-6 mb-4"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>Locality / Area</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Sector 62"
                              name="locality_area"
                              value={permanentFormData.locality_area || ""}
                              onChange={permanenthandleInputChange}
                              disabled={isSameAddress} // Disable if checkbox is checked
                            />
                          </Form.Group>

                          <Form.Group
                            className="col-6 mb-4 position-relative"
                            controlId="exampleForm.ControlInput13"
                          >
                            <Form.Label>City / District</Form.Label>


                            <Select
                              name="Search for a city / district"
                              value={permanentDistrict}
                              onChange={handlePermanentChange}
                              options={residenceListOptions}
                              onInputChange={handleresidenceOptionClick}
                              isSearchable={true} // Enable search functionality
                              placeholder="Search for a city / district...."
                              styles={customStyles}
                              isDisabled={isSameAddress}
                            />

                          </Form.Group>
                          <Form.Group
                            className="col-6 mb-4"
                            controlId="exampleForm.ControlInput13"
                          >
                            <Form.Label>State</Form.Label>

                            <Select
                              name="Search for a city / district"
                              value={parmanetsState}
                              onChange={handleAddressStateParmanets}
                              options={stateList}
                              onInputChange={handleInputStateChanges}
                              isSearchable={true} // Enable search functionality
                              placeholder="Search for a city / state...."
                              styles={customStyles}
                              isDisabled={isSameAddress}
                            />
                          </Form.Group>
                          <Form.Group
                            className="col-6 mb-4"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>Pincode</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="22XX20"
                              maxLength={6}
                              name="pin_code"
                              value={permanentFormData.pin_code || ""}
                              onChange={permanenthandleInputChange}
                              disabled={isSameAddress} // Disable if checkbox is checked
                            />
                          </Form.Group>
                        </div>
                      </Form>

                      {
                        DocumentStatus ?
                          (
                            <div className="col-12">
                              <div className="position-relative doc_attach_box">
                                <Form.Control
                                  type="text"
                                  className="w-100"
                                  placeholder="Document(s) Attached"
                                  disabled
                                />
                                <div className="verfy_btnwrp">
                                  <div className="position-relative read-btn">
                                    {!show === true ? (
                                      <p
                                        className="vrfybtn border-0 rounded-2 px-3 position-relative py-2"
                                        onClick={handleShow}
                                      >
                                        Verify Documents
                                      </p>
                                    ) : (
                                      <p className="verifiedbtn border-0 rounded-2 px-5 btn-success position-relative py-2">
                                        <Form.Control
                                          type="text"
                                          className="w-100"
                                          placeholder="Document(s) Attached"
                                          disabled
                                        />
                                        <div className="d-flex flex-row gap-1 align-items-center">
                                          <FaRegCheckCircle />
                                          Verified
                                        </div>
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="docs_icon">
                                  <IoDocumentAttachOutline />
                                </div>
                              </div>
                            </div>
                          ) :
                          (
                            // <div className="col-12">
                            //   <button className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2" onClick={(e) => setOpenOnboardDoc(true) } style={{ height: '44px' }}>
                            //     <FaUpload />
                            //     View / Upload Documents
                            //   </button>
                            // </div>
                            null
                          )
                      }


                    </div>
                    <div className="d-flex justify-content-between mt-5">
                      <div class="mt-3">
                        <button class="tbtn btn prevbtn" onClick={handleBack}>
                          Previous
                        </button>
                      </div>
                      <div class="read-btn mt-3">
                        {/* <Link to="/salary"> */}
                        <button class="px-5 btn" onClick={saveresidence}>
                          Define Salary
                        </button>
                        {/* </Link> */}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>


      <VerifyDocsModal
        empMail={employeeEamil}
        Document={Document}
        candidate={candidateData}
        fetchRecords={fetchCandidateData}
        show={show}
        onHide={() => setShow(false)}
      />

      <DocumentModalForUploads open={openOnBoardDoc} handleClose={() => setOpenOnboardDoc(false)} />

      <EmpImportModal show={openImport} handleClose={setOpenImport} />
    </>
  );
}
//
