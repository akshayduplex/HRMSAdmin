import config from "../../config/config";
import axios from "axios";
import { apiHeaderToken } from "./My_Helper";
import { toast } from "react-toastify";

let APIURL = config.API_URL;
let GLOB_API_URL = config.GLOB_API_URL;

const handleError = (error) => {
  if (error.response) {
    return {
      status: false,
      message:
        error.response.data.error.message || "Unknown server error occurred.",
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      status: false,
      message: "No response received from the server. Please try again later.",
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      status: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
};

const getLocationList = async (searchKey) => {
  try {
    const response = await axios.post(
      `${APIURL}getLocationList`,
      {
        keyword: searchKey,
        page_no: "1",
        per_page_record: "25",
        scope_fields: ["_id", "name"],
        status: "Active",
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};

const getDesignationList = async (searchKey) => {
  try {
    const response = await axios.post(
      `${APIURL}getDesignationList`,
      {
        keyword: searchKey,
        page_no: "1",
        per_page_record: "25",
        scope_fields: ["_id", "name"],
        status: "Active",
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};

const getOccupationList = async (searchKey) => {
  try {
    const response = await axios.post(
      `${APIURL}getOccupationList`,
      {
        keyword: searchKey,
        page_no: "1",
        per_page_record: "10",
        scope_fields: ["_id", "name"],
        status: "Active",
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};

const getDivisionList = async (searchKey) => {
  try {
    const response = await axios.post(
      `${APIURL}getDivisionList`,
      {
        keyword: searchKey,
        page_no: "1",
        per_page_record: "25",
        scope_fields: ["_id", "name"],
        status: "Active",
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};

const getDispensaryList = async (searchKey) => {
  try {
    const response = await axios.post(
      `${APIURL}getDispensaryList`,
      {
        keyword: searchKey,
        page_no: "1",
        per_page_record: "25",
        scope_fields: ["_id", "name"],
        status: "Active",
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};

const getBankList = async (searchKey) => {
  try {
    const response = await axios.post(
      `${APIURL}getBankList`,
      {
        keyword: searchKey,
        page_no: "1",
        per_page_record: "25",
        scope_fields: ["_id", "name"],
        status: "Active",
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};

const getStateList = async (searchKey) => {
  try {
    const response = await axios.post(
      `${APIURL}getStateList`,
      {
        keyword: searchKey,
        page_no: "1",
        per_page_record: "25",
        scope_fields: ["_id", "name"],
        status: "Active",
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};

const getRegionList = async (searchKey) => {
  try {
    const response = await axios.post(
      `${APIURL}getRegionList`,
      {
        keyword: searchKey,
        page_no: "1",
        per_page_record: "25",
        scope_fields: ["_id", "name"],
        status: "Active",
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};

const getDepartmentList = async (searchKey) => {
  try {
    const response = await axios.post(
      `${APIURL}getDepartmentList`,
      {
        keyword: searchKey,
        page_no: "1",
        per_page_record: "25",
        scope_fields: ["_id", "name"],
        status: "Active",
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};

const getEducationList = async (searchKey) => {
  try {
    const response = await axios.post(
      `${APIURL}getEducationList`,
      {
        keyword: searchKey,
        page_no: "1",
        per_page_record: "25",
        scope_fields: ["_id", "name"],
        status: "Active",
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching education list', error);
    return handleError(error);
  }
};

const getAppliedFromList = async (searchKey) => {
  try {
    const response = await axios.post(
      `${APIURL}getAppliedFromList`,
      {
        keyword: searchKey,
        page_no: "1",
        per_page_record: "25",
        scope_fields: ["_id", "name"],
        status: "Active",
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching education list', error);
    return handleError(error);
  }
};
//
const getEmployeeAllList = async (searchKey, searchQuery, type , projectList , id) => {
  try {
    const response = await axios.post(
      `${APIURL}getEmployeeAllList`,
      {
        keyword: searchQuery,
        page_no: "1",
        per_page_record: "999999",
        scope_fields: ["employee_code" , "name" , "email" , 'mobile_no' , 'alt_mobile_no' , 'joining_date' , 'project_name' , 'branch', 'designation' , 'department' , 'employee_type' , 'batch_id' , 'profile_status' , 'add_date'],
        status: searchKey,
        type : type,
        project_id:projectList?.value ? projectList?.value : id ? id : '',
        project_name:projectList?.label,
        "is_count":"yes"
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};

const getEmployeeRecordsForFilter = async (searchKey, searchQuery, type , projectList , id) => {
    try {
    const response = await axios.post(
      `${APIURL}getEmployeeAllList`,
      {
        keyword: searchQuery,
        page_no: "1",
        per_page_record: "999999",
        scope_fields: [],
        status: searchKey,
        type : type,
        project_id:projectList?.value ? projectList?.value : id ? id : '',
        project_name:projectList?.label 
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
}

const addEmployeeGeneralInfo = async (postData , jon_id , candidate_id) => {
  try {

    let Payloads = {
      job_id:jon_id,
      candidate_id,
      ...postData
    }
    const response = await axios.post(
      `${APIURL}addEmployeeGeneralInfo`,
      Payloads,
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    console.error('Error checking assessment', error);
    toast.error(error.response?.data?.message);
    return handleError(error);
  }
};
const addEmployeeEducationInfo = async (postData) => {
  try {
    // console.log(postData)
    const response = await axios.post(
      `${APIURL}addEmployeeEducationInfo`,
      postData,
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error checking assessment', error);
    return handleError(error);
  }
};
const addEmployeeExperienceInfo = async (postData) => {
  try {
    // console.log(postData)
    const response = await axios.post(
      `${APIURL}addEmployeeExperienceInfo`,
      postData,
      apiHeaderToken()
    );
    //   console.log(response.data)
    return response.data;
  } catch (error) {
    // console.error('Error checking assessment', error);
    return handleError(error);
  }
};

const addEmployeeClassificationInfo = async (postData) => {
  try {
    //  console.log(postData)
    const response = await axios.post(
      `${APIURL}addEmployeeClassificationInfo`,
      postData,
      apiHeaderToken()
    );
    //  console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error checking assessment', error);
    toast.error(error?.response.data.message);
    // return handleError(error?.response);
  }
};
const addEmployeePfInfo = async (postData) => {
  try {
    // console.log(postData)
    const response = await axios.post(
      `${APIURL}addEmployeePfInfo`,
      postData,
      apiHeaderToken()
    );
    // console.log(response.data)
    return response.data;
  } catch (error) {
    // console.error('Error in addEmployeeGeneralInfo:', error);
    return handleError(error);
  }
};

const addEmployeeAddressInfo = async (postData) => {
  try {
    // console.log(postData)
    const response = await axios.post(
      `${APIURL}addEmployeeAddressInfo`,
      postData,
      apiHeaderToken()
    );
    //   console.log(response.data)
    return response.data;
  } catch (error) {
    // console.error('Error checking assessment', error);
    return handleError(error);
  }
};

const addEmployeeSalaryInfo = async (postData) => {
  try {
    const response = await axios.post(
      `${APIURL}addEmployeeSalaryInfo`,
      postData,
      apiHeaderToken()
    );
    //  console.log(response.data)
    return response.data;
  } catch (error) {
    // console.error('Error checking assessment', error);
    return handleError(error);
  }
};

const getEmployeeById = async (postData) => {
  try {
    const response = await axios.post(
      `${APIURL}getEmployeeById`,
      postData,
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error checking assessment', error);
    return handleError(error);
  }
};
const getProjectList = async (inputValue) => {
  try {
    const response = await axios.post(
      `${APIURL}getProjectList`,
      {
        project_id: inputValue ? inputValue : '',
        status:'Active'
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};
const getCandidateByEmailName = async (searchKey) => {
  try {
    const response = await axios.post(
      `${APIURL}getCandidateByEmailName`,
      {
        keyword: searchKey,
        scope_fields: [],
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};
// Graph API's   getProjectList

const getProjectBudgetChart = async (payload) => {
  try {
    const response = await axios.post(
      `${APIURL}getProjectBudgetChart`,
      {
        keyword: '',
        project_id : payload.project_id,
        from_date : payload.from_date,
        to_date : payload.to_date,
        scope_fields: ["_id", "docs", "name", "photo"],
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};

const getProjectWiseVacancyChart = async (project_id , employeeType) => {
  try {
    const response = await axios.post(
      `${APIURL}getProjectWiseVacancyChart`,
      {
        project_id: project_id,
        employee_type:employeeType
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};
const getEmployeeGradeWiseListChart = async (project_id) => {
  try {
    const response = await axios.get(
      `${APIURL}getEmployeeGradeWiseListChart`,
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};
const getHrHiringJobListChart = async (project_id) => {
  try {
    const response = await axios.post(
      `${APIURL}getHrHiringJobListChart`,
      {
        project_id: project_id,
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};
const getEmployeeByTenureChart = async (project_id) => {
  try {
    const response = await axios.post(
      `${APIURL}getEmployeeByTenureChart`,
      {
        project_id: project_id,
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};

const getEmployeeByJobTypeChart = async (project_id) => {
  try {
    const response = await axios.post(
      `${APIURL}getEmployeeByJobTypeChart`,
      {
        project_id: project_id,
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};
const getEmployeeByGenderChart = async (project_id) => {
  try {
    const response = await axios.post(
      `${APIURL}getEmployeeByGenderChart`,
      {
        project_id: project_id,
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};
const getEmployeeByYearWiseSlotChart = async (project_id) => {
  try {
    const response = await axios.post(
      `${APIURL}getEmployeeByYearWiseSlotChart`,
      {
        project_id: project_id,
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};
const getEmployeeByTerminationChart = async (project_id) => {
  try {
    const response = await axios.post(
      `${APIURL}getEmployeeByTerminationChart`,
      {
        project_id: project_id,
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};
const getEmployeeCountForMapChart = async (project_id) => {
  try {
    const response = await axios.post(
      `${APIURL}getEmployeeCountForMapChart`,
      {
        project_id: project_id,
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};

const getEmployeeWithDepartmentWise = async (project_id) => {
  try {
    const response = await axios.post(
      `${APIURL}getEmployeeWithDepartmentWise`,
      {
        project_id: project_id,
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching location list', error);
    return handleError(error);
  }
};
export {
  getLocationList,
  getDesignationList,
  getOccupationList,
  getDivisionList,
  getDispensaryList,
  getBankList,
  getStateList,
  getRegionList,
  getDepartmentList,
  getEducationList,
  getAppliedFromList,
  getEmployeeAllList,
  addEmployeeGeneralInfo,
  addEmployeeEducationInfo,
  addEmployeeExperienceInfo,
  addEmployeeClassificationInfo,
  addEmployeePfInfo,
  addEmployeeAddressInfo,
  addEmployeeSalaryInfo,
  getEmployeeById,
  getProjectList,
  getCandidateByEmailName,
  getProjectBudgetChart,
  getProjectWiseVacancyChart,
  getEmployeeGradeWiseListChart,
  getHrHiringJobListChart,
  getEmployeeByTenureChart,
  getEmployeeByJobTypeChart,
  getEmployeeByGenderChart,
  getEmployeeByYearWiseSlotChart,
  getEmployeeByTerminationChart,
  getEmployeeCountForMapChart,
  getEmployeeWithDepartmentWise,
  getEmployeeRecordsForFilter
};
