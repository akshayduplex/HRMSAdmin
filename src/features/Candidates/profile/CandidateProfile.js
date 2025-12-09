import { useEffect, useState } from "react";
import PrintIcon from '@mui/icons-material/Print';
import Table from "react-bootstrap/Table";
import { UploadFile as UploadIcon } from '@mui/icons-material';
import { DeleteOutline as DeleteIcon } from '@mui/icons-material';

import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { CgProfile } from "react-icons/cg";
import GoBackButton from "../../goBack/GoBackButton";
import { FaEye, FaFolderOpen, FaStar, FaUpload } from "react-icons/fa6";
import RateModal from "../../Rating/RatingModels";
import InterviewSteps from "../InterviewSteps";
import CandidateResume from "../CandidateResume";
import AllHeaders from "../../partials/AllHeaders";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FetchCandidatesListById } from "../../slices/AppliedJobCandidates/JobAppliedCandidateSlice";
import config from "../../../config/config";
import moment from "moment";
import { CamelCases, changeJobTypeLabel, DateFormate } from "../../../utils/common";
import FeedbackModels from "./FeedBackModles";
import Accordion from 'react-bootstrap/Accordion';
import { Card, Col, Container, Form, ListGroup, Modal, Row, Spinner, Tabs } from "react-bootstrap";
import Button from '@mui/material/Button';
import ToggleButton from 'react-toggle-button';
import { toast } from "react-toastify";
import axios from "axios";
import { apiHeaderToken, apiHeaderTokenMultiPart } from "../../../config/api_header";
import CandidateChats from "./CandidateChats";
import BoadMemberListing from "./BoadMemberListing";
import { MdOutlineCancel } from "react-icons/md";
import { Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, Skeleton, TextField } from "@mui/material";
import { GridCheckCircleIcon } from "@mui/x-data-grid";
import {
  Tabs as AliasTabs,
  Tab as AliasTab,
  Typography
} from '@mui/material';
import {
  TableContainer as AliasTableContainer,
  Paper as AliasPaper,
  Table as AliasTable,
  TableHead as AliasTableHead,
  TableRow as AliasTableRow,
  TableCell as AliasTableCell,
  TableBody as AliasTableBody,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Visibility as ViewIcon,
  CheckCircleOutline as VerifyIcon,
  HighlightOff as RejectIcon
} from '@mui/icons-material';
import Viewdoc_modal from "../../../employee/View-document";
import ApplicantForm from "./ApplicantForm";
import ApplicationTabs from "./ApplicationTabsForForms";
import AssignInterviews from "./AssignInterviews";
import { GetEmployeeListDropDownScroll } from "../../slices/EmployeeSlices/EmployeeSlice";
import { AsyncPaginate } from "react-select-async-paginate";
import { FaUserEdit } from "react-icons/fa";
import { MarkAsInterviewCompleted } from "../../slices/JobSortLIstedSlice/SortLIstedSlice";

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




function AliasTabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`alias-tabpanel-${index}`}
      aria-labelledby={`alias-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function CandidateProfile() {

  const [imgPreview, setImgPreview] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [docType, setDocType] = useState('')
  const [docName, setDocName] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [loadingSumit, setLodingSumit] = useState(false);
  const [openInterview, setOpenInterview] = useState(false);
  const [InterviewData, setInterviewData] = useState(null)
  const [modalShow, setModalShow] = useState(false);
  const [selectedData, setData] = useState(false);
  const [activeKey, setActiveKey] = useState('first');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_no: '',
    location: '',
    currentEmployer: '',
    designation: '',
    totalExperience: '',
    relevantExperience: '',
    currentCtc: '',
    expectedCtc: '',
    noticePeriod: '',
    lastWorkingDay: '',
    appliedFrom: '',
    referenceEmployee: '',
    fund_type: '',
    job_offer_type: '',
  });

  const { id } = useParams();
  const [searchParams] = useSearchParams()
  const Navigate = useNavigate()

  const jobId = searchParams.get('job_id')
  const candidateRecords = useSelector((state) => state.appliedJobList.AppliedCandidateList)
  const dispatch = useDispatch();
  // Function to change the active tab
  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  useEffect(() => {
    dispatch(FetchCandidatesListById(id));
    setImageLoadError(false); // Reset image error state when candidate changes
  }, [id, dispatch])

  // Update the state with candidate data
  useEffect(() => {
    if (candidateRecords.status === 'success' && candidateRecords.data) {
      setFormData({
        name: candidateRecords.data.name || '',
        email: candidateRecords.data.email || '',
        mobile_no: candidateRecords.data.mobile_no || '',
        location: candidateRecords.data.location || '',
        currentEmployer: candidateRecords.data.current_employer || '',
        designation: candidateRecords.data.designation || '',
        totalExperience: candidateRecords.data.total_experience || '',
        relevantExperience: candidateRecords.data.relevant_experience || '',
        currentCtc: candidateRecords.data.current_ctc || '',
        expectedCtc: candidateRecords.data.expected_ctc || '',
        noticePeriod: candidateRecords.data.notice_period || '',
        lastWorkingDay: candidateRecords.data.last_working_day
          ? moment(candidateRecords.data.last_working_day).format('YYYY-MM-DD')
          : '',
        appliedFrom: candidateRecords.data.applied_from || '',
        referenceEmployee: candidateRecords.data.reference_employee || '',
        fund_type: candidateRecords.data?.applied_jobs?.find((item) => item.job_id === jobId)?.mpr_fund_type || '',
        job_offer_type: candidateRecords.data?.applied_jobs?.find((item) => item.job_id === jobId)?.mpr_job_offer_type || ''
      });
    }
  }, [candidateRecords, jobId]);

  // Update a specific field in formData
  const updateFormData = (key, value) => {
    if (key === 'mobile_no' && value.length > 10) return;
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const generateUniqueId = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const [educationData, setEducationData] = useState([
    { id: generateUniqueId(), institute: '', degree: '', from: '', to: '' },
  ]);

  // Populate education data if available
  useEffect(() => {
    if (
      candidateRecords.status === 'success' &&
      candidateRecords.data?.education?.length > 0
    ) {
      const filledData = candidateRecords.data.education.map((edu, index) => ({
        id: generateUniqueId(),
        degree: edu.degree || '',
        institute: edu.institute || '',
        to: edu.to_date
          ? moment(edu.to_date).format('YYYY-MM-DD')
          : '',
        from: moment(edu.from_date).format('YYYY-MM-DD')
      }));
      setEducationData(filledData);
    }
  }, [candidateRecords]);

  // Add a new blank entry
  const addEducationField = () => {
    setEducationData((prev) => [
      ...prev,
      { id: generateUniqueId(), degree: '', institute: '', from: '', to: '' },
    ]);
  };

  const handleRemoveFileField = (fieldId) => {
    const updatedFields = educationData.filter(field => field.id !== fieldId);
    setEducationData(updatedFields);
  };
  // Update a specific field in a specific entry
  const updateEducationData = (index, key, value) => {
    setEducationData((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      )
    );
  };
  const [interviewsDetails, setInterviewsDetails] = useState(null);

  const handleShowRateModels = (e, data, value) => {
    e.preventDefault()
    setModalShow(true);
    setData(data)
    setInterviewsDetails(value)
  }
  // Handle the Toggle Button As we Expected ->>>>>>>>>>>>

  const handleToggleStatus = async (gradeItem) => {
    const newStatus = gradeItem?.profile_status === 'Active' ? 'Blocked' : 'Active';
    const payload = { candidate_id: gradeItem?._id, profile_status: newStatus };
    try {
      let response = await axios.post(`${config.API_URL}changeCandidateProfileStatus`, payload, apiHeaderToken(config.API_TOKEN));
      if (response.status === 200) {
        dispatch(FetchCandidatesListById(id));
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error("Error updating grade status:", error);
      toast.error(error?.response.data?.message);
    }
  };

  const handleModalOpen = (e, imageUrl) => {
    e.preventDefault();
    setImgPreview(true);
    let ImageData = config.IMAGE_PATH + imageUrl;
    setImageUrl(ImageData)
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!docType) {
      return toast.warn('Please Select the Document Type')
    }
    if (!docName) {
      return toast.warn('Please Select the Document Name')
    }
    if (!file) {
      return toast.warn('Please Select the Document Name');
    }

    setLoading(true);

    let Payloads = {
      "_id": candidateRecords.data?._id,
      "doc_category": docType,
      "sub_doc_category": '',
      "doc_name": docName,
      "filename": file
    }

    if (docType === 'KYC') {
      Payloads.sub_doc_category = 'Document'
    } else if (docType === 'Educational') {
      Payloads.sub_doc_category = 'Marksheet'
    } else if (docType === 'Experience') {
      Payloads.sub_doc_category = 'Experience Latter'
    } else if (docType === 'Certificates') {
      Payloads.sub_doc_category = 'Skill'
    } else if (docType === 'Bank') {
      Payloads.sub_doc_category = 'Bank'
    }

    try {
      let response = await axios.post(`${config.CANDIDATE_URL}uploadKycDocs`, Payloads, apiHeaderTokenMultiPart(config.API_TOKEN))

      if (response.status === 200 && response.data?.status) {
        setLoading(false);
        toast.success(response?.data?.message)
        dispatch(FetchCandidatesListById(id));
      } else {
        toast.warn(response?.data?.message)
        setLoading(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
      setLoading(false);
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docUrl, setDocUrl] = useState('');

  const handleImageClick = (url) => {
    // alert(url);
    setDocUrl(url);
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleEditProfile = () => {
    setShowEdit(true);
    handleTabChange('first')
  }

  const handleCloseEdit = () => {
    setShowEdit(false);
  }

  const updateProfile = async () => {
    let formDatasumit = new FormData();
    formDatasumit.append("_id", candidateRecords?.data?._id)
    formDatasumit.append("job_id", candidateRecords?.data?.job_id)
    formDatasumit.append("job_title", candidateRecords?.data?.job_title)
    formDatasumit.append("job_type", candidateRecords?.data?.job_type)
    formDatasumit.append("project_id", candidateRecords?.data?.project_id)
    formDatasumit.append("project_name", candidateRecords?.data?.project_name)
    formDatasumit.append("name", formData?.name)
    formDatasumit.append("email", formData?.email)
    formDatasumit.append("mobile_no", formData?.mobile_no)
    formDatasumit.append("designation", formData?.designation)
    formDatasumit.append("current_employer", formData?.currentEmployer)
    formDatasumit.append("current_employer_mobile", '')
    formDatasumit.append("location", formData?.location)
    formDatasumit.append("total_experience", formData?.totalExperience)
    formDatasumit.append("relevant_experience", formData?.relevantExperience)
    formDatasumit.append("current_ctc", formData?.currentCtc)
    formDatasumit.append("notice_period", formData?.noticePeriod)
    formDatasumit.append("expected_ctc", formData?.expectedCtc)
    formDatasumit.append("last_working_day", formData?.lastWorkingDay)
    formDatasumit.append("applied_from", formData?.appliedFrom)
    formDatasumit.append("reference_employee", formData?.referenceEmployee)
    formDatasumit.append("department", candidateRecords?.data?.department)
    formDatasumit.append("fund_type", formData?.fund_type)
    formDatasumit.append("job_offer_type", formData?.job_offer_type)
    if (educationData?.length < 1) {

    }
    // if (!formData.fund_type) {
    //   return toast.warn("Please Select the Fund Type");
    // }
    let educationPayloads = educationData
      ?.map((item) => {
        const { institute, degree, from, to } = item;
        if (institute && degree && from && to) {
          return {
            institute,
            degree,
            from_date: from,
            to_date: to,
          };
        }
        return null;
      })
      .filter(Boolean);
    formDatasumit.append("education", JSON.stringify(educationPayloads));
    setLodingSumit(true);
    try {
      let res = await axios.post(`${config.API_URL}editAppliedJob`, formDatasumit, apiHeaderTokenMultiPart(config.API_TOKEN))
      if (res.status === 200) {
        toast.success(res.data?.message)
        setLodingSumit(false)
        dispatch(FetchCandidatesListById(id));
      } else {
        toast.error(res.data?.message)
        setLodingSumit(false)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Someting Went Wrong");
      setLodingSumit(false)
    }
  }

  // make clear button to ok -
  useEffect(() => {
    let jobFilter = localStorage.getItem('jobFilter')
    if (jobFilter) {
      localStorage.setItem('filled', JSON.stringify({ filled: "Yes" }))
    }
  }, [])

  const handleOpenInterviewList = (data) => {
    setOpenInterview(true);
    setInterviewData(data);
  }

  const [openAssignCoEmp, setOpenAssignCoEmp] = useState(false);
  const [selectGroupStage, setSelectGrupStage] = useState(null);

  const AddInterviewerModal = (data) => {
    setOpenAssignCoEmp(true);
    setSelectGrupStage(data)
  }

  // ----------------  Delete Open modal Confirmation ----------------
  const [showDeleteModal, setShowDeleteModal] = useState(false);// show delete modal
  const [interviewToDelete, setInterviewToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  // Function to open the delete confirmation modal


  const handleRemoveInterview = async (interview) => {
    try {

      let payload = {
        "candidate_id": candidateRecords.data?._id,
        "applied_job_id": candidateRecords.data?.applied_jobs?.find((item) => item.job_id === jobId)?._id,
        "interviewer_id": interview?.employee_id,
        "stage": interview?.stage,
      }

      setDeleteLoading(true);

      let response = await axios.post(`${config.API_URL}removeInterviewerFromScheduleInterView`, payload, apiHeaderToken(config.API_TOKEN))
      if (response.status === 200) {
        toast.success(response?.data?.message)
        setShowDeleteModal(false);
        setInterviewToDelete(null);
        setInterviewData((prev) => {
          // Remove only the interviewer with matching employee_id and stage
          return {
            ...prev,
            interviewer: prev.interviewer?.filter(
              (item) => !(item.employee_id === interview.employee_id && item.stage === interview.stage)
            ) || [...prev.interviewer]
          };
        });
        dispatch(FetchCandidatesListById(id));
      } else {
        toast.error(response?.data?.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Someting Went Wrong");
    } finally {
      setDeleteLoading(false);
    }
  };

  let FindDetails = candidateRecords.data?.applied_jobs?.find(
    (item) => item.job_id === jobId
  ) ?? candidateRecords.data?.applied_jobs?.find(
    (item) => item.job_id === candidateRecords.data?.job_id
  );

  const handleDeleteConfirm = async (data) => {
    setShowDeleteModal(true);
    setInterviewToDelete(data)
  }

  const InterviewAccordion = (interviewData = null, appliedData = null) => {

    const handleInterviewNavigate = () => {
      Navigate(`/schedule-interview/${jobId}?userId=${id}&applied-job-id=${appliedData && appliedData?._id}`)
    }

    if (!interviewData) {
      return <> No Record Found </>
    }
    const groupedData = interviewData.reduce((acc, interview) => {
      const { stage, date } = interview;
      if (!acc[stage]) {
        acc[stage] = [];
      }
      acc[stage].push({ ...interview });
      return acc;
    }, {});

    const lastStageKey = Object.keys(groupedData)?.length
      ? Object.keys(groupedData).length - 1
      : "0";
    return (
      <>

        <Accordion defaultActiveKey={lastStageKey.toString()}>
          {Object.keys(groupedData).map((stage, index) => (
            <Accordion.Item eventKey={index.toString()} key={stage}>
              <Accordion.Header>{stage}</Accordion.Header>
              <Accordion.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Interviewer Name</th>
                      <th>Designation</th>
                      <th>Interview Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedData[stage].map((interview, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{interview.employee_name}</td>
                        <td>{interview.designation}</td>
                        <td>{moment.utc(interview.interview_date).format("hh:mm A,  DD/MM/YYYY ")}</td>
                        <td>{interview.status}</td>
                        <td>
                          <Tooltip
                            title="Remove Interviewer"
                            arrow
                            placement="top"
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  bgcolor: '#d32f2f', // danger red
                                  color: 'white',
                                  fontSize: '0.75rem',
                                  padding: '8px 12px',
                                  borderRadius: '4px',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                  '& .MuiTooltip-arrow': {
                                    color: '#d32f2f',
                                  },
                                },
                              },
                            }}
                          >
                            <IconButton
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(211, 47, 47, 0.08)', // light red
                                '&:hover': {
                                  backgroundColor: 'rgba(211, 47, 47, 0.15)',
                                },
                              }}
                              onClick={() => handleDeleteConfirm(interview)}
                            >
                              <DeleteIcon sx={{ color: '#d32f2f' }} />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="d-flex gap-2 justify-content-end">
                  {
                    FindDetails.interview_status === 'Pending' && (
                      <>
                        <Button variant="contained" color="primary" onClick={() => AddInterviewerModal(stage)}>
                          Add Interviewer
                        </Button>

                        <Button variant="contained" color="success" onClick={handleInterviewNavigate}>
                          Re-Schedule
                        </Button>
                      </>
                    )
                  }
                </div>

              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </>
    );
  };

  const [active, setActive] = useState(0);
  const handleChange = (_, newValue) => setActive(newValue);
  const [viewDocumets, setViewDocuments] = useState({
    showViewDocumentModal: false,
    fileName: '',
    fileUrl: null
  })

  const handleOpenFileViewDetails = (FileUrl, FileName) => {
    setViewDocuments({ fileName: FileName, fileUrl: config.IMAGE_PATH + FileUrl, showViewDocumentModal: true })
  }

  const admin_role_user = JSON.parse(localStorage.getItem('admin_role_user'))

  const handleVerify = async (doc, index, type) => {
    if (!doc) {
      return toast.warn('Document Details Messing ( Internal server Error )')
    }
    try {
      // http://localhost:8080/v1/admin/verifyOnBoardDocuments
      let payload = {
        "candidate_doc_id": candidateRecords.data?._id,
        "action": type,
        "onboard_doc_id": doc?._id,
        "add_by_name": admin_role_user?.name,
        "add_by_email": admin_role_user?.email,
        "add_by_mobile": admin_role_user?.mobile_no,
        "add_by_designation": admin_role_user?.designation
      }

      let response = await axios.post(`${config.API_URL}verifyOnBoardDocuments`, payload, apiHeaderToken(config.API_TOKEN))
      if (response.status === 200) {
        toast.success(response?.data?.message)
        dispatch(FetchCandidatesListById(id));
      } else {
        toast.error(response?.data?.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Internal Server Error");
    }
  }

  const [uploading, setUploading] = useState(false);

  const handleUploadsDocuments = async (doc, files) => {

    if (!files) {
      return toast.error('Please select a document to upload')
    }

    try {

      let formData = new FormData();

      formData.append('candidate_id', candidateRecords.data?._id);
      formData.append('approval_note_id', doc?.approval_note_doc_id);
      formData.append('onboard_doc_id', doc?._id);
      formData.append("add_by_name", admin_role_user?.name)
      formData.append("add_by_mobile", admin_role_user?.mobile_no)
      formData.append("add_by_designation", admin_role_user?.designation)
      formData.append("add_by_email", admin_role_user?.email)

      let attachments = [
        {
          doc_name: files.name,
          file_name: files
        }
      ];

      attachments.forEach((att, i) => {
        formData.append(`attachments[${i}][doc_name]`, att.doc_name);
        formData.append(`attachments[${i}][file_name]`, att.file_name);
      });

      let response = await axios.post(`${config.API_URL}uploadOnboardingDocuments`, formData, apiHeaderTokenMultiPart(config.API_TOKEN))
      if (response.status === 200) {
        toast.success(response?.data?.message)
        setTimeout(() => {
          dispatch(FetchCandidatesListById(id));
        }, [800])
      } else {
        toast.error(response?.data?.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Internal Server Error");
    }
  }

  // Add these handler functions
  const handleFileChangeForVerification = (event, doc) => {
    const file = event.target.files[0];
    handleUploadsDocuments(doc, file)
  };

  const handleDelete = async (doc) => {
    try {

      if (!doc) {
        return toast.error('Please select a document to upload')
      }

      let payloads = {
        "approval_note_id": doc?.approval_note_doc_id,
        "candidate_id": candidateRecords.data?._id,
        "onboard_doc_id": doc?._id
      }

      let response = await axios.post(`${config.API_URL}removeOnboardingDocuments`, payloads, apiHeaderToken(config.API_TOKEN))

      if (response.status === 200) {
        toast.success(response.data?.message)
        setTimeout(() => {
          dispatch(FetchCandidatesListById(id));
        }, [800])
      } else {
        toast.error(response.data?.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Internal server Error")
    }
  }

  const HandleNavigate = () => {
    Navigate(`/onboarding?type=new&candidate_id=${candidateRecords.data?._id}&job_id=${jobId}`)
  }

  const [selectedCoEmployee, setSelectedCoEmployee] = useState(null);
  const [loadingAddInterviews, setLoadingAddInterviews] = useState(false);

  const handleAssign = async () => {
    if (selectedCoEmployee) {
      let payloads = {
        "candidate_id": candidateRecords.data?._id,
        "applied_job_id": candidateRecords.data?.applied_jobs?.find((item) => item.job_id === jobId)?._id,
        "interviewer_id": selectedCoEmployee.value,
        "stage": selectGroupStage,
      }
      setLoadingAddInterviews(true);
      try {
        let response = await axios.post(`${config.API_URL}addInterviewerInScheduleInterView`, payloads, apiHeaderToken(config.API_TOKEN));
        if (response.status === 200) {
          toast.success(response.data?.message);
          setOpenAssignCoEmp(false);
          dispatch(FetchCandidatesListById(id));
          setSelectedCoEmployee(null);
          setInterviewData((prev) => (
            {
              ...prev,
              interviewer: [...prev.interviewer, {
                employee_id: selectedCoEmployee.value,
                employee_name: selectedCoEmployee?.label,
                designation: selectedCoEmployee?.designation,
                stage: selectGroupStage,
                interview_date: prev?.interviewer?.length > 0 ? prev?.interviewer[0]?.interview_date : moment().format('YYYY-MM-DD'),
                status: 'Pending',
                _id: response.data?.data?._id || generateUniqueId(),
              }],
            }
          ))
        } else {
          toast.error(response.data?.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message || "Internal Server Error");
      } finally {
        setLoadingAddInterviews(false);
      }
    }
  };

  const projectLoadOptionPageNations = async (inputValue, loadedOptions, { page }) => {

    let payloads = {
      "keyword": inputValue,
      "page_no": page.toString(),
      "per_page_record": "10",
      "scope_fields": ["employee_code", "name", "email", "mobile_no", "_id", 'designation'],
      "profile_status": "Active",
    }

    const result = await dispatch(GetEmployeeListDropDownScroll(payloads)).unwrap();

    return {
      options: result, // must be array of { label, value } objects
      hasMore: result.length >= 10, // if true, next page will load
      additional: {
        page: page + 1
      }
    };
  };

  const handleMarkAsInterviewComplete = () => {
    let payloads = {
      "candidate_doc_id": candidateRecords.data?._id,
      "applied_job_doc_id": candidateRecords.data?.applied_jobs?.filter((item) => item.job_id === jobId || candidateRecords.data?.job_id === item.job_id)[0]?._id,
    }
    dispatch(MarkAsInterviewCompleted(payloads))
      .unwrap()
      .then((response) => {
        if (response.status) {
          dispatch(FetchCandidatesListById(id));
        }
      })
      .catch((err) => {
        console.log(err);
      })
  };

  /**
   * Send Email Notification Feature to Inform the User your Rating is is pending -
   * 
   */

  const [EmailLoading, setSendEmailLoading] = useState('');
  const sendEmail = async (interview_id) => {
    try {
      setSendEmailLoading(interview_id)
      let response = await axios.post(`${config.API_URL}sendRatingMailForCandidate`, {
        "candidate_id": candidateRecords.data?._id,
        "interview_id": interview_id,
        "applied_job_id": candidateRecords.data?.applied_jobs?.filter((item) => item.job_id === jobId || candidateRecords.data?.job_id === item.job_id)[0]?._id,
      }, apiHeaderToken(config.API_TOKEN))
      if (response.status === 200) {
        toast.success(response.data?.message)
        setTimeout(() => {
          dispatch(FetchCandidatesListById(id));
        }, [800])
      } else {
        toast.error(response.data?.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Internal Server Error")
    } finally {
      setSendEmailLoading(false)
    }
  }


  return (
    <>
      {/* <AllHeaders /> */}
      <div className="maincontent">
        <div className="container" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="sitecard">
            <div className="cd_profilebox d-flex">
              <div className="cd_prfleft">
                <div className="prfimg">
                  {
                    candidateRecords.status === 'success' && candidateRecords.data?.photo && !imageLoadError ?
                      <img
                        style={{ maxHeight: '150px', maxWidth: '150px' }}
                        src={`${config.IMAGE_PATH}${candidateRecords.data?.photo}`}
                        alt="candidate images"
                        onError={() => setImageLoadError(true)}
                      />
                      : <CgProfile size={60} style={{ marginBottom: '2rem' }} />
                  }
                  <span className="rat_tag">{candidateRecords.status === 'success' && candidateRecords.data?.complete_profile_status}%</span>
                </div>
                <div className="name_rating">
                  <h4 className="name">{candidateRecords.status === 'success' && candidateRecords.data?.name}</h4>
                  <div className="rat_text">
                    <h6>Feedback Rating</h6>
                    <p className="ratenum">
                      <FaStar />
                      <span>{candidateRecords.status === 'success' && candidateRecords.data?.profile_avg_rating}</span>
                    </p>
                  </div>
                  <div className="rat_text mt-3">
                    <h6><span>{candidateRecords.status === 'success' && candidateRecords.data?.profile_status}</span>
                    </h6>
                    <p className="ratenum">
                      {/* <span>{candidateRecords.status === 'success' && candidateRecords.data?.profile_status}</span> */}
                      <div className=''>
                        <ToggleButton
                          value={candidateRecords.data?.profile_status === 'Active'}
                          onToggle={() => handleToggleStatus(candidateRecords.data)}
                        />
                      </div>
                    </p>
                  </div>
                </div>
              </div>
              <div className="cd_prfright d-flex">
                <div className="cnt_info">
                  <h6>Contact Information</h6>
                  <p>{candidateRecords.status === 'success' && candidateRecords.data?.mobile_no}</p>
                  <p>
                    {candidateRecords.status === 'success' && candidateRecords.data?.email}
                  </p>
                  <p> {candidateRecords.status === 'success' && candidateRecords.data?.location}</p>
                  {/* <ul className="social">
                    {
                      candidateRecords.status === 'success' && candidateRecords.data?.social_links?.length > 0 && candidateRecords.data?.social_links?.map((item) => {
                        return (
                          <>
                            <li>
                              <a href="#">
                                <FaLinkedin />
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <RiTwitterXFill />
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <FaFacebook />
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <FaInstagram />
                              </a>
                            </li>
                          </>
                        )
                      })
                    }
                  </ul> */}
                </div>
                <div className="cnt_info prev_empinfo">
                  <h6>Previous Employer</h6>
                  <p>{candidateRecords.status === 'success' && candidateRecords.data?.current_employer}</p>
                  <p>{candidateRecords.status === 'success' && candidateRecords.data?.designation} </p>
                  <p>
                    <a href="#">-</a>
                  </p>
                  <p>
                    <a href="mailto:">{candidateRecords.status === 'success' && candidateRecords.data?.email}</a>
                  </p>
                </div>
                <div className="position-absolute" style={{ right: '50px' }}>
                  <Button className="animated-button" onClick={handleEditProfile}>
                    <FaUserEdit className="edit-icon" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <Tab.Container id="left-tabs-example" className="mt-3" defaultActiveKey="first" activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
            <Nav variant="pills" className="flex-row postedjobs widthcomp tabsborder justify-content-between width-auto">
              <Nav.Item>
                <Nav.Link eventKey="first">Candidates Info</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="zero">Document</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Interviews</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third">Score Sheet</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="four">Feedback</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="five">Assessment</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="six">Application History</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="seven">Discussion</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="approval_note">Approval Note</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="applicant_form">Application Forms</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="int_process_tabs">
              {
                showEdit ?
                  <Tab.Pane eventKey="first">
                    <div className="row my-3">
                      <div className="col-lg-8">
                        <div className="sitecard pr-0">
                          <div className="infobox">
                            <div className="d-flex justify-content-between w-100">
                              <h5>Update Personal Information</h5>
                              <div className="button-container me-4">
                                <Button className="animated-button" onClick={handleCloseEdit}>
                                  <MdOutlineCancel className="icon" size={20} color="red" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                            {/* <Box> */}
                            {/* Dynamic TextField Inputs */}
                            <div className="row" style={{ width: '94%' }}>
                              {Object.entries(formData).map(([key, value]) => {
                                if (key === 'fund_type') {
                                  return null; // Skip the 'fund_type' field for now; handled separately
                                }

                                if (key === 'job_offer_type') {
                                  return null;
                                }

                                if (key === 'appliedFrom') {
                                  return (
                                    <>
                                      <div className="mt-3 col-sm-6">
                                        <FormControl fullWidth variant="outlined">
                                          <InputLabel>Applied from</InputLabel>
                                          <Select
                                            value={value}
                                            onChange={(e) => updateFormData(key, e.target.value)}
                                            label="Applied from"
                                          >
                                            <MenuItem value="linkedin">Linkedin</MenuItem>
                                            <MenuItem value="Naukri">Naukri</MenuItem>
                                            <MenuItem value="Devnet">Devnet</MenuItem>
                                            <MenuItem value="HLFPPT Career">HLFPPT Career</MenuItem>
                                          </Select>
                                        </FormControl>
                                      </div>
                                    </>
                                  );
                                }

                                return (
                                  <div className="mt-3 col-lg-6" key={key}>
                                    {key === 'lastWorkingDay' ? (
                                      <TextField
                                        type="date" // Specify the type as "date"
                                        variant="outlined"
                                        label="Last Working Day"
                                        value={formData.lastWorkingDay} // Ensure edu.from is in "YYYY-MM-DD" format
                                        onChange={(e) => updateFormData('lastWorkingDay', e.target.value)}
                                        size="small"
                                        InputLabelProps={{
                                          shrink: true, // Ensures the label doesn't overlap the input
                                        }}
                                        fullWidth
                                      />
                                    ) : (
                                      <TextField
                                        variant="outlined"
                                        fullWidth
                                        value={value}
                                        onChange={(e) => updateFormData(key, e.target.value)}
                                        size="small"
                                        label={key
                                          .replace(/([A-Z])/g, ' $1')
                                          .replace(/^./, (str) => str.toUpperCase())}
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Fund Type Select Field */}
                            <div className="row" style={{ width: '94%', marginTop: '2.5rem' }}>

                              <div className="col-sm-6">
                                <FormControl fullWidth variant="outlined">
                                  <InputLabel>Fund Type</InputLabel>
                                  <Select
                                    value={formData.fund_type}
                                    onChange={(e) => updateFormData('fund_type', e.target.value)}
                                    label="Fund Type"
                                  >
                                    <MenuItem value="Funded">Funded</MenuItem>
                                    <MenuItem value="Non-Funded">Non-Funded</MenuItem>
                                  </Select>
                                </FormControl>
                              </div>

                              {/* this is F */}
                              <div className="col-sm-6">
                                <FormControl fullWidth variant="outlined">
                                  <InputLabel>Job offer type</InputLabel>
                                  <Select
                                    value={formData.job_offer_type}
                                    onChange={(e) => updateFormData('job_offer_type', e.target.value)}
                                    label="Job offer type"
                                  >
                                    <MenuItem value="new">New</MenuItem>
                                    <MenuItem value="replacement">Replacement</MenuItem>
                                  </Select>
                                </FormControl>
                              </div>
                            </div>
                            {/* </Box> */}

                            {/* <div className="infobox"> */}
                            <h5 className="mt-3 mb-3">Education</h5>
                            <div className="w-100">
                              {educationData.map((edu, index) => (
                                <div className="row" key={index} style={{ marginBottom: '1rem', width: '96%' }}>

                                  <div className="col-sm-6">
                                    <TextField
                                      variant="outlined"
                                      label="Institution"
                                      value={edu.institute}
                                      onChange={(e) =>
                                        updateEducationData(index, 'institute', e.target.value)
                                      }
                                      size="small"
                                      fullWidth
                                      style={{ marginBottom: '0.5rem' }}
                                    />
                                  </div>


                                  <div className="col-sm-6">
                                    <TextField
                                      variant="outlined"
                                      label="Degree / Certification"
                                      value={edu.degree}
                                      onChange={(e) =>
                                        updateEducationData(index, 'degree', e.target.value)
                                      }
                                      fullWidth
                                      size="small"
                                      style={{ marginBottom: '0.5rem' }}
                                    />
                                  </div>

                                  <div className="mt-3 col-sm-6">
                                    <TextField
                                      type="date" // Specify the type as "date"
                                      variant="outlined"
                                      label="From Date"
                                      value={edu.from} // Ensure edu.from is in "YYYY-MM-DD" format
                                      onChange={(e) => updateEducationData(index, "from", e.target.value)}
                                      size="small"
                                      InputLabelProps={{
                                        shrink: true, // Ensures the label doesn't overlap the input
                                      }}
                                      fullWidth
                                    />
                                  </div>

                                  <div className="mt-3 col-sm-6">
                                    <TextField
                                      type="date" // Specify the type as "date"
                                      variant="outlined"
                                      label="To Date"
                                      value={edu.to} // Ensure edu.from is in "YYYY-MM-DD" format
                                      onChange={(e) => updateEducationData(index, "to", e.target.value)}
                                      size="small"
                                      InputLabelProps={{
                                        shrink: true, // Ensures the label doesn't overlap the input
                                      }}
                                      fullWidth
                                    />
                                  </div>

                                  {
                                    educationData?.length > 1 && (
                                      <div className="appendmore removebtn mt-3">
                                        <button type="button" onClick={() => handleRemoveFileField(edu.id)}>- Remove Education</button>
                                      </div>
                                    )
                                  }

                                </div>
                              ))}

                              <div className="appendmore mt-3" style={{ marginRight: '7%' }}>
                                <button type="button" onClick={addEducationField}>+ Add Education</button>
                              </div>
                              <Row className="text-center" style={{ width: '95%' }}>
                                <Col md={12}>
                                  <button type="button" class="sitebtn btn btn-primary ratebtn" disabled={loadingSumit} onClick={updateProfile}>       {loadingSumit ? (
                                    <>
                                      <CircularProgress size={20} /> Updating...
                                    </>
                                  ) : (
                                    <>
                                      <GridCheckCircleIcon /> Update
                                    </>
                                  )}
                                  </button>
                                </Col>
                              </Row>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <InterviewSteps interviewStep={candidateRecords.status === 'success' && candidateRecords.data} />
                        <CandidateResume resume={candidateRecords.status === 'success' && candidateRecords.data} />
                      </div>
                    </div>
                  </Tab.Pane> :
                  <Tab.Pane eventKey="first">
                    <div className="row my-3">
                      <div className="col-lg-8">
                        <div className="sitecard pr-0">
                          <div className="infobox">
                            <h5>Personal Information</h5>
                            <div className="infotext">
                              <div className="infos">
                                <h6>Current Employer</h6>
                                <p>{candidateRecords.status === 'success' && candidateRecords.data?.current_employer}</p>
                              </div>
                              <div className="infos">
                                <h6>Designation</h6>
                                <p>{candidateRecords.status === 'success' && candidateRecords.data?.designation}</p>
                              </div>
                              <div className="infos">
                                <h6>Experience in Total</h6>
                                <p>{candidateRecords.status === 'success' && candidateRecords.data?.total_experience}</p>
                              </div>
                              <div className="infos">
                                <h6>Relevant Experience</h6>
                                <p>{candidateRecords.status === 'success' && candidateRecords.data?.relevant_experience}</p>
                              </div>
                              <div className="infos">
                                <h6>Current CTC</h6>
                                <p>{candidateRecords.status === 'success' && candidateRecords.data?.current_ctc} LPA</p>
                              </div>
                              <div className="infos">
                                <h6>Expected CTC</h6>
                                <p>{candidateRecords.status === 'success' && candidateRecords.data?.expected_ctc} LPA</p>
                              </div>
                              <div className="infos">
                                <h6>Notice Period</h6>
                                <p>{candidateRecords.status === 'success' && candidateRecords.data?.notice_period} Days</p>
                              </div>
                              <div className="infos">
                                <h6>Last Working day </h6>
                                <p>{candidateRecords.status === 'success' && moment(candidateRecords.data?.last_working_day).format("DD/MM/YYYY")}</p>
                              </div>
                              <div className="infos">
                                <h6>Applied from</h6>
                                <p>{candidateRecords.status === 'success' && candidateRecords.data?.applied_from}</p>
                              </div>
                              <div className="infos">
                                <h6>Reference employee</h6>
                                <p>{candidateRecords.status === 'success' && candidateRecords.data?.reference_employee}</p>
                              </div>
                            </div>

                            <h5>Education</h5>

                            <div className="infotext row">
                              {
                                candidateRecords.status === 'success' && candidateRecords.data?.education !== 0
                                && candidateRecords.data?.education.map((value, index) => {
                                  return (
                                    <>
                                      <div className="infos col-sm-6" key={index}>
                                        <h6>{value.degree}</h6>
                                        <p>{value.institute}</p>
                                        <p>From {moment(value.from_date).format("YYYY")} - {moment(value.to_date).format("YYYY")}</p>
                                      </div>
                                    </>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <InterviewSteps interviewStep={candidateRecords.status === 'success' && candidateRecords.data} />
                        <CandidateResume resume={candidateRecords.status === 'success' && candidateRecords.data} />
                      </div>
                    </div>
                  </Tab.Pane>
              }


              <Tab.Pane eventKey="second">
                <div className="row my-3">
                  <div className="col-lg-8">
                    <div className="sitecard h-100">
                      <div className="infobox">
                        <div className="d-flex flex-column gap-3 mt-1 scroller-content w-100">
                          {
                            candidateRecords.status === 'success' && candidateRecords?.data?.applied_jobs?.length !== 0 ?
                              candidateRecords.data?.applied_jobs?.filter((item) => !['Applied', "Shortlisted"].includes(item?.form_status)).map((item, index) => {
                                return (
                                  <>
                                    <div className="card hr_jobcards card-border me-2" key={index}>
                                      <div className="card-body">
                                        <div className="d-flex flex-column gap-3">
                                          <div className="d-flex justify-content-between">
                                            <div className="d-flex flex-column gap-2">
                                              <div className="location">
                                                <span className="text-start w-100 d-flex">
                                                  {changeJobTypeLabel(item?.job_type)}
                                                </span>
                                              </div>
                                              <h3 className="text-start mb-0">
                                                {item?.job_title}
                                              </h3>
                                              <span className="text-start">
                                                {candidateRecords?.data?.location}
                                              </span>
                                            </div>
                                            {/* button and drop down details here */}
                                            <div className="d-flex flex-row">
                                              <div className="d-flex flex-column gap-2">
                                                <Link to={`/job-details/${item.job_id}`} className="detaibtn">
                                                  View Detail
                                                </Link>
                                                <span className="datetime">
                                                  Applied On: {DateFormate(item.add_date)}
                                                </span>

                                                <span className="datetime">
                                                  Interview Date: {moment.utc(item.interview_date).format("hh:mm A,  DD/MM/YYYY ")}
                                                </span>

                                                <div className={`${FindDetails.interview_status === 'Pending' ? 'd-flex gap-2' : ''}`}>

                                                  {
                                                    FindDetails.interview_status === 'Pending' && (
                                                      <>
                                                        <button className="stepbtn" onClick={() => handleMarkAsInterviewComplete()}> Mark As Completed </button>
                                                      </>
                                                    )
                                                  }
                                                  <button className={`detaibtn ${FindDetails.interview_status !== 'Pending' ? 'w-100' : ''}`} onClick={() => handleOpenInterviewList(item)}>
                                                    Interview list
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )
                              }) : null
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <InterviewSteps interviewStep={candidateRecords.status === 'success' && candidateRecords.data} />
                    <CandidateResume resume={candidateRecords.status === 'success' && candidateRecords.data} />
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="six">
                <div className="row my-3">
                  <div className="col-lg-8">
                    <div className="sitecard h-100">
                      <div className="infobox">
                        <div className="d-flex flex-column gap-3 mt-1 scroller-content w-100">
                          <Accordion>

                            {
                              candidateRecords.status === 'success' && candidateRecords.data?.applied_jobs?.length !== 0 ?
                                candidateRecords.data?.applied_jobs?.map((item, index) => {
                                  return (
                                    <>
                                      <Accordion.Item eventKey={index}>
                                        <Accordion.Header key={index}>{item?.project_name || 'N/A'} | {item?.job_designation || 'N/A'} |  {changeJobTypeLabel(item?.job_type) || 'N/A'} | {changeJobTypeLabel(item?.form_status || "") || 'N/A'}  </Accordion.Header>
                                        <Accordion.Body>
                                          {
                                            item?.profile_details ?
                                              (
                                                <ListGroup style={{ 'fontSize': '13px' }}>
                                                  <ListGroup.Item><strong>Resume File:</strong> {item?.profile_details.resume_file} <span> <Button onClick={(e) => handleModalOpen(e, item?.profile_details.resume_file)} style={{ height: '30px', width: '60px', marginLeft: '10px', fontSize: '13px' }}> View </Button> </span></ListGroup.Item>
                                                  <ListGroup.Item><strong>Designation:</strong> {item?.profile_details.designation}</ListGroup.Item>
                                                  <ListGroup.Item><strong>Total Experience:</strong> {item?.profile_details.total_experience}</ListGroup.Item>
                                                  <ListGroup.Item><strong>Relevant Experience:</strong> {item?.profile_details.relevant_experience}</ListGroup.Item>
                                                  <ListGroup.Item><strong>Location:</strong> {item?.profile_details.location}</ListGroup.Item>
                                                  <ListGroup.Item><strong>Current CTC:</strong> {item?.profile_details.current_ctc} LPA</ListGroup.Item>
                                                  <ListGroup.Item><strong>Expected CTC:</strong> {item?.profile_details.expected_ctc} LPA</ListGroup.Item>
                                                  <ListGroup.Item><strong>Notice Period:</strong> {item?.profile_details.notice_period} Month(s)</ListGroup.Item>
                                                  <ListGroup.Item><strong>Current Employer:</strong> {item?.profile_details.current_employer}</ListGroup.Item>
                                                  <ListGroup.Item><strong>Current Employer Mobile:</strong> {item?.profile_details.current_employer_mobile}</ListGroup.Item>
                                                  <ListGroup.Item><strong>Last Working Day:</strong> {new Date(item?.profile_details.last_working_day).toLocaleDateString()}</ListGroup.Item>
                                                  <ListGroup.Item><strong>Applied From:</strong> {item?.profile_details.applied_from}</ListGroup.Item>
                                                  <ListGroup.Item><strong>Reference Employee:</strong> {item?.profile_details.reference_employee}</ListGroup.Item>
                                                </ListGroup>
                                              )
                                              : "N/A"
                                          }
                                        </Accordion.Body>
                                      </Accordion.Item>
                                    </>
                                  )
                                })
                                : null
                            }
                          </Accordion>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <InterviewSteps interviewStep={candidateRecords.status === 'success' && candidateRecords.data} />
                    <CandidateResume resume={candidateRecords.status === 'success' && candidateRecords.data} />
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="zero">
                <div className="row my-3">
                  <div className="col-lg-12">
                    <div className="sitecard h-100">

                      <Box sx={{ width: '100%' }}>
                        <AliasTabs
                          value={active}
                          onChange={handleChange}
                          variant="fullWidth"
                          aria-label="Aliased inner document tabs"
                          sx={{
                            display: 'flex',
                            borderBottom: '2px solid #ccc',
                            '& .MuiTab-root': {
                              flex: 1,
                              textTransform: 'none',
                              fontWeight: 500,
                              padding: '0.75rem 0',
                              color: '#555',
                            },
                            '& .Mui-selected': {
                              color: '#1976d2',
                              fontWeight: 600,
                            },
                            '& .MuiTabs-indicator': {
                              backgroundColor: '#1976d2',
                              height: '4px',
                            },
                          }}
                        >
                          <AliasTab
                            label="KYC / EDUCATION"
                            id="alias-tab-0"
                            aria-controls="alias-tabpanel-0"
                          />
                          <AliasTab
                            label="Onboarding Documents"
                            id="alias-tab-1"
                            aria-controls="alias-tabpanel-1"
                          />
                        </AliasTabs>

                        {/* Aliased TabPanels */}
                        <AliasTabPanel value={active} index={0}>
                          <div className="document-box">
                            <Row className="mb-4">
                              <div className="d-flex justify-content-around flex-wrap mb-5">
                                <Form.Group controlId="documentType">
                                  <Form.Label>Select Document Type</Form.Label>
                                  <Form.Control
                                    as="select"
                                    value={docType}
                                    onChange={(e) => setDocType(e.target.value)}
                                    style={{ width: '200px' }}
                                  >
                                    <option value="">Choose...</option>
                                    <option value="KYC">KYC</option>
                                    <option value="Educational">Educational</option>
                                    <option value="Experience">Experience</option>
                                    <option value="Certificates">Certificates</option>
                                    <option value="Bank">Bank</option>
                                  </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="documentName">
                                  <Form.Label>Enter Document Name</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Document Name"
                                    value={docName}
                                    onChange={(e) => setDocName(e.target.value)}
                                  />
                                </Form.Group>

                                <Form.Group controlId="fileUpload">
                                  <Form.Label>Choose Document</Form.Label>
                                  <Form.Control
                                    type="file"
                                    accept=".jpeg ,.jpg , .png"
                                    onChange={handleFileChange}
                                  />
                                </Form.Group>

                                <div className="" style={{ marginTop: '37px' }}>
                                  <Button
                                    variant="primary"
                                    type="button"
                                    onClick={() => handleUpload()}
                                    disabled={loading}
                                  >
                                    {loading ? (
                                      <>
                                        <Spinner animation="border" size="sm" /> Uploading...
                                      </>
                                    ) : (
                                      "Upload"
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </Row>

                            {/* Document Listing Table */}
                            {/* <hr />
                          <h4 className="text-center">Document(s)</h4> */}
                            <hr />
                            <Table hover responsive>
                              <thead>
                                <tr>
                                  <th>Type</th>
                                  <th>Name</th>
                                  <th>Size</th>
                                  <th>Date</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {candidateRecords.status === 'success' && candidateRecords.data?.docs?.length > 0 ? candidateRecords.data?.docs?.map((doc, index) => (
                                  <tr key={index}>
                                    <td>{doc.doc_category}</td>
                                    <td className={doc.status === 'upload' ? 'text-danger' : ''}>{doc.doc_name}</td>
                                    <td>{doc.file_size}</td>
                                    <td>{moment(doc.add_date).format('DD/MM/YYYY')}</td>
                                    <td>
                                      <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Tooltip title="View Document" arrow>
                                          <IconButton
                                            onClick={(e) => handleImageClick(`${config.IMAGE_PATH}${doc?.file_name}`)}
                                            size="small"
                                            sx={{ color: '#1976d2' }}
                                          >
                                            <FaEye />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Print Document" arrow>
                                          <IconButton
                                            onClick={(e) => window.open(`${config.IMAGE_PATH}${doc?.file_name}`, '_blank')}
                                            size="small"
                                          >
                                            <PrintIcon fontSize="small" color="success" />
                                          </IconButton>
                                        </Tooltip>
                                      </Box>
                                    </td>
                                  </tr>
                                )) : <tr colSpan={6}>
                                  <td colSpan={6}>No Data Available</td>
                                </tr>}
                              </tbody>
                            </Table>
                          </div>
                        </AliasTabPanel>

                        <AliasTabPanel value={active} index={1}>
                          <Box sx={{ marginTop: 1 }}>
                            {candidateRecords.status === 'loading' ? (
                              <AliasTableContainer component={AliasPaper}
                                sx={{
                                  maxHeight: 600,
                                  overflowY: 'auto',
                                  '& .MuiTableHead-root': {
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 1,
                                  },
                                  '&::-webkit-scrollbar': { width: 8 },
                                  '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: 4 },
                                  '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: 4 },
                                  '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' }
                                }}
                              >
                                <AliasTable aria-label="Loading skeleton">
                                  <AliasTableHead>
                                    <AliasTableRow sx={{ backgroundColor: '#29166F' }}>
                                      {[...Array(7)].map((_, idx) => (
                                        <AliasTableCell key={idx} sx={{ color: '#fff' }}>
                                          <Skeleton variant="text" width={70} sx={{ mx: 'auto', bgcolor: 'rgba(255, 255, 255, 0.5)' }} />
                                        </AliasTableCell>
                                      ))}
                                    </AliasTableRow>
                                  </AliasTableHead>
                                  <AliasTableBody>
                                    {[...Array(5)].map((_, rowIdx) => (
                                      <AliasTableRow key={rowIdx} hover>
                                        {/* Document Name */}
                                        <AliasTableCell>
                                          <Skeleton variant="text" width="60%" />
                                        </AliasTableCell>

                                        {/* Document Type */}
                                        <AliasTableCell>
                                          <Skeleton variant="text" width="50%" />
                                        </AliasTableCell>

                                        {/* Added By/Date */}
                                        <AliasTableCell>
                                          <div className="d-grid">
                                            <Skeleton variant="text" width="70%" />
                                            <Skeleton variant="text" width="50%" />
                                          </div>
                                        </AliasTableCell>

                                        {/* Uploaded By/Date */}
                                        <AliasTableCell>
                                          <div className="d-grid">
                                            <Skeleton variant="text" width="70%" />
                                            <Skeleton variant="text" width="50%" />
                                          </div>
                                        </AliasTableCell>

                                        {/* Sended Document */}
                                        <AliasTableCell align="center">
                                          <Skeleton variant="circular" width={24} height={24} />
                                        </AliasTableCell>

                                        {/* Uploaded Document */}
                                        <AliasTableCell align="center">
                                          <Skeleton variant="circular" width={24} height={24} />
                                        </AliasTableCell>

                                        {/* Actions */}
                                        <AliasTableCell align="center">
                                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                            <Skeleton variant="circular" width={24} height={24} />
                                            <Skeleton variant="circular" width={24} height={24} />
                                            <Skeleton variant="circular" width={24} height={24} />
                                          </Box>
                                        </AliasTableCell>
                                      </AliasTableRow>
                                    ))}
                                  </AliasTableBody>
                                </AliasTable>
                              </AliasTableContainer>) :
                              candidateRecords.status === 'success' && ['Offer', 'Hired'].includes(candidateRecords.data?.applied_jobs?.find((item) => item?.job_id === jobId || candidateRecords.data?.job_id === item?.job_id).form_status) && candidateRecords.data?.onboarding_docs?.length > 0 ? (
                                <AliasTableContainer component={AliasPaper}
                                  sx={{
                                    maxHeight: 600,
                                    overflowY: 'auto',
                                    '& .MuiTableHead-root': {
                                      position: 'sticky',
                                      top: 0,
                                      zIndex: 1,
                                    },
                                    '&::-webkit-scrollbar': {
                                      width: 8,
                                    },
                                    '&::-webkit-scrollbar-track': {
                                      backgroundColor: '#f1f1f1',
                                      borderRadius: 4,
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                      backgroundColor: '#888',
                                      borderRadius: 4,
                                    },
                                    '&::-webkit-scrollbar-thumb:hover': {
                                      backgroundColor: '#555',
                                    }
                                  }}
                                >
                                  <AliasTable aria-label="Onboarding Documents">
                                    <AliasTableHead>
                                      <AliasTableRow sx={{ backgroundColor: '#29166F' }}>
                                        <AliasTableCell sx={{ color: '#fff' }}><strong>Document Name</strong></AliasTableCell>
                                        <AliasTableCell sx={{ color: '#fff' }}><strong>Document Type</strong></AliasTableCell>
                                        <AliasTableCell sx={{ color: '#fff' }}><strong>Added By / Date</strong></AliasTableCell>
                                        {/* <AliasTableCell sx={{ color: '#fff' }}><strong>Added By</strong></AliasTableCell> */}
                                        <AliasTableCell sx={{ color: '#fff' }}><strong>Uploaded By / Date</strong></AliasTableCell>
                                        <AliasTableCell sx={{ color: '#fff' }}><strong>Sent Document(s)</strong></AliasTableCell>
                                        <AliasTableCell sx={{ color: '#fff' }}><strong>Uploaded Document(s)</strong></AliasTableCell>
                                        <AliasTableCell align="center" sx={{ color: '#fff' }}><strong>Actions</strong></AliasTableCell>
                                      </AliasTableRow>
                                    </AliasTableHead>
                                    <AliasTableBody>
                                      {candidateRecords.data?.onboarding_docs.map((doc, idx) => (
                                        <AliasTableRow key={doc.id} hover>
                                          <AliasTableCell>{doc.doc_name}</AliasTableCell>
                                          <AliasTableCell>{doc.doc_category}</AliasTableCell>

                                          <AliasTableCell>
                                            <div className="d-grid">
                                              <span>{doc?.send_file_data?.added_by_data?.name || "N/A"}</span>
                                              <span>{moment(doc?.send_file_data?.add_date).format('DD/MM/YYYY')}</span>
                                            </div>
                                          </AliasTableCell>

                                          <AliasTableCell>
                                            <div className="d-grid">
                                              <span>{doc?.uploaded_file_data?.added_by_data?.name || "N/A"}</span>
                                              <span>{moment(doc?.uploaded_file_data?.add_date).format('DD/MM/YYYY')}</span>
                                            </div>
                                          </AliasTableCell>

                                          <AliasTableCell align="center">
                                            <Tooltip
                                              title="View Send Document"
                                              arrow
                                              componentsProps={{
                                                tooltip: { sx: { bgcolor: '#1976d2', color: '#fff' } },
                                                arrow: { sx: { color: '#1976d2' } }
                                              }}
                                            >
                                              <IconButton
                                                size="small"
                                                onClick={() => handleOpenFileViewDetails(doc.send_file_data?.file_name, doc.doc_name)}
                                                sx={{ color: 'inherit', ml: 1 }}
                                              >
                                                <ViewIcon fontSize="small" sx={{ color: '#1976d2' }} />
                                              </IconButton>

                                            </Tooltip>
                                          </AliasTableCell>

                                          <AliasTableCell align="center">

                                            {
                                              doc.uploaded_file_data?.file_name ?
                                                <Tooltip
                                                  title="View Uploaded Document"
                                                  arrow
                                                  componentsProps={{
                                                    tooltip: { sx: { bgcolor: '#1976d2', color: '#fff' } },
                                                    arrow: { sx: { color: '#1976d2' } }
                                                  }}
                                                >
                                                  <IconButton
                                                    size="small"
                                                    onClick={() => handleOpenFileViewDetails(doc.uploaded_file_data?.file_name, doc.doc_name)}
                                                    sx={{ color: 'inherit', ml: 1 }}
                                                  >
                                                    <ViewIcon fontSize="small" sx={{ color: '#1976d2' }} />
                                                  </IconButton>

                                                </Tooltip> : "Not Uploaded"
                                            }

                                          </AliasTableCell>


                                          {/* <AliasTableCell>{moment(doc?.send_file_data?.add_date).format('DD/MM/YYYY')}</AliasTableCell> */}
                                          <AliasTableCell align="center">
                                            {/* View: blue */}
                                            <Tooltip
                                              title="Upload Document"
                                              arrow
                                              componentsProps={{
                                                tooltip: { sx: { bgcolor: '#FB8C00', color: '#fff' } },
                                                arrow: { sx: { color: '#FB8C00' } }
                                              }}
                                            >
                                              <Box component="label" htmlFor={`upload-file-${doc._id}`}>
                                                <input
                                                  style={{ display: 'none' }}
                                                  id={`upload-file-${doc._id}`}
                                                  type="file"
                                                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                                  onChange={(e) => handleFileChangeForVerification(e, doc)}
                                                />
                                                <IconButton
                                                  component="span"
                                                  size="small"
                                                  disabled={uploading}
                                                  sx={{
                                                    color: 'inherit',
                                                    ml: 1,
                                                    position: 'relative'
                                                  }}
                                                >
                                                  <UploadIcon fontSize="small" sx={{ color: '#2e7d32' }} />
                                                </IconButton>
                                              </Box>
                                            </Tooltip>
                                            {/* {selectedFiles[doc.id] && (
                                              <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleUploadVerification(doc.id)}
                                                disabled={uploading}
                                                sx={{ ml: 1, height: 24 }}
                                              >
                                                {uploading ? 'Uploading...' : 'Confirm Upload'}
                                              </Button>
                                            )} */}
                                            {/* Verify: green */}

                                            {
                                              ['complete'].includes(doc?.status) &&
                                              (
                                                <>
                                                  <Tooltip
                                                    title="Verify Document"
                                                    arrow
                                                    componentsProps={{
                                                      tooltip: { sx: { bgcolor: '#2e7d32', color: '#fff' } },
                                                      arrow: { sx: { color: '#2e7d32' } }
                                                    }}
                                                  >
                                                    <IconButton
                                                      size="small"
                                                      onClick={() => handleVerify(doc, idx, "Accept")}
                                                      sx={{ color: 'inherit', ml: 1 }}
                                                    >
                                                      <VerifyIcon fontSize="small" sx={{ color: '#2e7d32' }} />
                                                    </IconButton>
                                                  </Tooltip>

                                                  {/* Reject: red */}
                                                  <Tooltip
                                                    title="Reject Document"
                                                    arrow
                                                    componentsProps={{
                                                      tooltip: { sx: { bgcolor: '#d32f2f', color: '#fff' } },
                                                      arrow: { sx: { color: '#d32f2f' } }
                                                    }}
                                                  >
                                                    <IconButton
                                                      size="small"
                                                      onClick={() => handleVerify(doc, idx, "Reject")}
                                                      sx={{ color: 'inherit', ml: 1 }}
                                                    >
                                                      <RejectIcon fontSize="small" sx={{ color: '#d32f2f' }} />
                                                    </IconButton>
                                                  </Tooltip>
                                                </>
                                              )
                                            }

                                            {
                                              doc?.status === 'pending' && (
                                                <Tooltip
                                                  title="Delete Document"
                                                  arrow
                                                  componentsProps={{
                                                    tooltip: { sx: { bgcolor: '#f44336', color: '#fff' } },
                                                    arrow: { sx: { color: '#f44336' } }
                                                  }}
                                                >
                                                  <IconButton
                                                    size="small"
                                                    onClick={() => handleDelete(doc)}
                                                    sx={{ ml: 1 }}
                                                  >
                                                    <DeleteIcon fontSize="small" sx={{ color: '#f44336' }} />
                                                  </IconButton>
                                                </Tooltip>
                                              )
                                            }

                                          </AliasTableCell>

                                        </AliasTableRow>
                                      ))}
                                    </AliasTableBody>
                                  </AliasTable>
                                </AliasTableContainer>
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  sx={{ textAlign: 'center', mt: 4 }}
                                >
                                  No Onboarding Documents Available
                                </Typography>
                              )}
                          </Box>

                          {
                            candidateRecords.status === 'success' &&
                            Array.isArray(candidateRecords.data?.onboarding_docs) &&
                            candidateRecords.data.onboarding_docs.length > 0 &&
                            candidateRecords.data.onboarding_docs.every(
                              (item) => item.status === 'verified'
                            )
                            && (
                              <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ my: 2 }}>
                                <Grid item>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    sx={{
                                      px: 4,
                                      py: 1.5,
                                      borderRadius: 2,
                                      textTransform: 'none',
                                      fontWeight: 500,
                                      boxShadow: 2,
                                    }}
                                    onClick={HandleNavigate}
                                  >
                                    Start on Boarding
                                  </Button>
                                </Grid>
                              </Grid>
                            )
                          }
                        </AliasTabPanel>
                      </Box>

                    </div>
                  </div>
                  {/* <div className="col-lg-4">
                    <InterviewSteps interviewStep={candidateRecords.status === 'success' && candidateRecords.data} />
                    <CandidateResume resume={candidateRecords.status === 'success' && candidateRecords.data} />
                  </div> */}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <div className="row my-3">
                  <div className="col-lg-8">
                    <div className="sitecard h-100">
                      <div className="infobox">
                        <div className="gap-2 w-100">
                          {candidateRecords.status === 'success' && candidateRecords.data?.applied_jobs && candidateRecords.data?.applied_jobs.length > 0 ? (
                            <Accordion>
                              {candidateRecords.data?.applied_jobs.map((job, jobIndex) => (
                                <Accordion.Item eventKey={jobIndex.toString()} key={jobIndex}>
                                  <Accordion.Header>
                                    {job?.project_name || job?.job_title || 'N/A'} | {job?.job_designation || 'N/A'} | {job?.job_type || 'N/A'} | {job?.status || 'N/A'}
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    {((job?.interviewer || []).filter(value => value?.feedback_status === 'Approved').length > 0) || ((job?.feedback || []).filter(value => value?.feedback_status === 'Approved').length > 0) ? (
                                      <div className="d-flex flex-column candd_table smalldata">
                                        <Table hover>
                                          <thead>
                                            <tr>
                                              <th>Interviewer Name</th>
                                              <th>Job Match(5)</th>
                                              <th>Job Knowledge(10)</th>
                                              <th>Creative Problem Solving(10)</th>
                                              <th>Team Player(5)</th>
                                              <th>Communication(10)</th>
                                              <th>Exposure(10)</th>
                                              <th>Total</th>
                                              <th>Stage</th>
                                              <th>Hiring Suggestion</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {(job?.interviewer || job?.feedback || []).filter(value => value?.feedback_status === 'Approved').map((value, index) => (
                                              <tr key={index}>
                                                <td>{value?.employee_name || value?.interviewer_name}{value?.designation ? `(${value?.designation})` : ''}</td>
                                                <td>{value?.job_match || '-'}</td>
                                                <td>{value?.job_knowledge || '-'}</td>
                                                <td>{value?.creative_problem_solving || '-'}</td>
                                                <td>{value?.team_player || '-'}</td>
                                                <td>{value?.communication_skill || '-'}</td>
                                                <td>{value?.exposure_to_job_profile || '-'}</td>
                                                <td><strong>{value?.total || '-'}</strong></td>
                                                <td>{value?.stage || '-'}</td>
                                                <td>
                                                  {value?.hiring_suggestion_status ? (
                                                    <div>
                                                      <span className={`badge ${value?.hiring_suggestion_status === 'rejected' ? 'bg-danger' :
                                                        value?.hiring_suggestion_status === 'suitable' ? 'bg-success' :
                                                          'bg-warning'
                                                        }`}>
                                                        {value?.hiring_suggestion_status}
                                                      </span>
                                                      {value?.hiring_suggestion_percent && (
                                                        <small className="d-block mt-1">{value?.hiring_suggestion_percent}%</small>
                                                      )}
                                                    </div>
                                                  ) : '-'}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </Table>
                                      </div>
                                    ) : (
                                      <div className="text-center py-4 text-muted">
                                        <i className="fas fa-clipboard-list fa-3x mb-3"></i>
                                        <h6>No Records Found</h6>
                                        <p>No feedback/interview data available for this job application.</p>
                                      </div>
                                    )}
                                  </Accordion.Body>
                                </Accordion.Item>
                              ))}
                            </Accordion>
                          ) : (
                            <div className="text-center py-5 text-muted">
                              <i className="fas fa-briefcase fa-4x mb-3"></i>
                              <h6>No Job Applications Found</h6>
                              <p>This candidate has not applied for any jobs yet.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <InterviewSteps interviewStep={candidateRecords.status === 'success' && candidateRecords.data} />
                    <CandidateResume resume={candidateRecords.status === 'success' && candidateRecords.data} />
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="four">
                <div className="row my-3">
                  <div className="col-lg-8">
                    <div className="sitecard pr-0 h-100 ps-0 pt-4">
                      <div className="infobox">
                        <h5 className="ms-3">Interview Timeline</h5>
                        <div className="d-flex flex-column gap-2 mt-1 scroller-content candd_table w-100 smalldata">
                          <Table hover>
                            <thead>
                              <tr>
                                <th >Interview Date</th>
                                <th>Interviewer(s)</th>
                                <th>Round</th>
                                <th>Rating</th>
                                <th>Status</th>
                                <th>Comment</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                candidateRecords.status === 'success' && candidateRecords.data?.applied_jobs?.find((item) => item?.job_id === jobId)?.interviewer.map((value, index) => {
                                  return (
                                    <>
                                      <tr key={index}>
                                        <td>{value?.interview_date ? moment(value?.interview_date).format("DD/MM/YYYY") : moment(candidateRecords.data?.applied_jobs?.find((item) => item.job_id === jobId)?.interview_date).format("DD-MMMM-YYYY")}</td>
                                        <td>{value?.employee_name}({value?.designation})</td>
                                        <td>{value?.stage}</td>
                                        <td>{value?.total}</td>
                                        <td>
                                          {
                                            value?.feedback_status === 'Pending'
                                              ?
                                              <div className="d-flex align-items-center flex-column gap-1" onClick={(e) => handleShowRateModels(e, candidateRecords.data, value)}>
                                                <span className={`statused ${value?.feedback_status === 'Pending' ? 'bg_purple' : 'bg_greenlt'} `}>{value?.feedback_status}</span>
                                                <span className="updatedby">Updated by - {value?.added_by}</span>
                                              </div>
                                              : <div className="d-flex align-items-center flex-column gap-1">
                                                <span className={`statused ${value?.hiring_suggestion_status === 'rejected' ? 'bgred' : 'bg_greenlt'} `}>{CamelCases(value?.hiring_suggestion_status) || value?.feedback_status}</span>
                                                <span className="updatedby">Updated by - {value?.added_by}</span>
                                              </div>
                                          }
                                        </td>
                                        <td className="comment">
                                          <p> {
                                          value?.feedback_status === 'Pending' ? 
                                          <button className="btn btn-outline-success" title="Send Email" style={{fontSize:'12px'}} onClick={() => sendEmail(value?._id)}> { EmailLoading === value?._id ? 'Sending...' : 'Send Email' } </button> 
                                          :
                                          value?.comment
                                          } </p>
                                        </td>
                                      </tr>
                                    </>
                                  )
                                })
                              }
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <InterviewSteps interviewStep={candidateRecords.status === 'success' && candidateRecords.data} />
                    <CandidateResume resume={candidateRecords.status === 'success' && candidateRecords.data} />
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="five">
                <div className="row my-3">
                  <div className="col-lg-8">
                    <div className=" pr-0 h-100">
                      <div className="">
                        <div className="d-flex flex-column gap-2 mt-1 scroller-content w-100">
                          <div className="card card-border me-2">
                            <div className="card-body assemntbox">
                              {
                                candidateRecords.status === 'success' && candidateRecords.data?.assessment_result_data?.length > 0
                                  ?
                                  candidateRecords.data?.assessment_result_data?.map((item, index) => {
                                    return (
                                      <>
                                        <h5 className="text-center mb-0">
                                          {item?.type === 'MCQ' ? 'Employee Assessment Test' : 'HLFPPT QA'}
                                        </h5>
                                        <hr className="text-start" />
                                        <div className="d-flex align-items-center mb-4 justify-content-between">
                                          <h5 className="text-start mb-0">
                                            Assessment Status
                                          </h5>
                                          <span className={`${item?.result === "Pass" ? "statuses" : "failedStatus"}`} >
                                            {item?.result}
                                          </span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                          <h5 className="text-start mb-0">
                                            Score
                                          </h5>
                                          <div className="stat-color">
                                            {item?.score?.toFixed(2)}%
                                          </div>
                                        </div>
                                      </>
                                    )
                                  })
                                  :
                                  (<>
                                    <div className="d-flex align-items-center mb-4 justify-content-between">
                                      <h5 className="text-start mb-0">
                                        Assessment Status
                                      </h5>
                                      <span className="statuses">
                                        {candidateRecords.status === 'success' && candidateRecords.data?.assessment_status}
                                      </span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                      <h5 className="text-start mb-0">
                                        Score
                                      </h5>
                                      <div className="stat-color">
                                        {candidateRecords.status === 'success' && candidateRecords.data?.score?.toFixed(2)}%
                                      </div>
                                    </div></>)
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <InterviewSteps interviewStep={candidateRecords.status === 'success' && candidateRecords.data} />
                    <CandidateResume resume={candidateRecords.status === 'success' && candidateRecords.data} />
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="seven">
                {/* <Row className="my-3">
                  <Col md={8}>
                    <CandidateChats />
                  </Col>
                  <Col md={4}>
                    <InterviewSteps interviewStep={candidateRecords.status === 'success' && candidateRecords.data} />
                    <CandidateResume resume={candidateRecords.status === 'success' && candidateRecords.data} />
                  </Col>
                </Row> */}
                <CandidateChats />
              </Tab.Pane>
              <Tab.Pane eventKey="approval_note">
                <Row className="my-3">
                  <Col md={8}>
                    <BoadMemberListing />
                  </Col>
                  <Col md={4}>
                    <InterviewSteps interviewStep={candidateRecords.status === 'success' && candidateRecords.data} />
                    <CandidateResume resume={candidateRecords.status === 'success' && candidateRecords.data} />
                  </Col>
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey='applicant_form'>
                <Row className="my-3">
                  <Col sm={12} md={12} lg={12}>
                    <ApplicationTabs candidate_data={candidateRecords.status === 'success' && candidateRecords.data} />
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
          <FeedbackModels show={modalShow} onHide={() => setModalShow(false)} selectedData={selectedData} interviewsDetails={interviewsDetails} />
        </div>
      </div>


      {/* Open Modal when user Added Document */}
      <Modal
        show={imgPreview}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => setImgPreview(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Resume Preview
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <div className="col-sm-12">
            <div className="uploadrow my-4">
              {imageUrl ? (
                imageUrl.endsWith('.pdf') ? (
                  <embed
                    src={imageUrl}
                    type="application/pdf"
                    className="img-fluid"
                    style={{ width: '100%', height: '500px' }} // Adjust height as needed
                  />
                ) : (
                  <img src={imageUrl} alt="Document" className="img-fluid" />
                )
              ) : (
                <p>No document available</p>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Show the Document Preview */}
      <Modal show={isModalOpen} onHide={handleCloseModal} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ height: '300px', overflow: 'auto' }}>
            <img
              src={docUrl}
              alt="Selected"
              style={{ width: '100%', height: 'auto', borderRadius: '5px' }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* show Interview Data */}

      <Modal show={openInterview} onHide={() => setOpenInterview(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Interview List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              {
                InterviewAccordion(InterviewData && InterviewData?.interviewer, InterviewData && InterviewData)
              }
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outlined" color="error" onClick={() => setOpenInterview(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Assign the Co Employee */}

      <Modal show={openAssignCoEmp} onHide={() => setOpenAssignCoEmp(false)} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>Assign Interviewer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <AsyncPaginate
              placeholder={'Select Interviewer'}
              value={selectedCoEmployee}
              loadOptions={projectLoadOptionPageNations}
              onChange={setSelectedCoEmployee}
              debounceTimeout={300}
              isClearable
              styles={customStyles}
              additional={{
                page: 1
              }}
              classNamePrefix="react-select"
            />
            <Box mt={3} textAlign="right">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAssign}
                disabled={!selectedCoEmployee || loadingAddInterviews}
              >
                {loadingAddInterviews ? "Loading....." : "Assign"}
              </Button>
            </Box>
          </Container>
        </Modal.Body>
      </Modal>

      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove this interviewer?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)} color="primary">Cancel</Button>
          <Button onClick={() => handleRemoveInterview(interviewToDelete)} color="error" disabled={deleteLoading} variant="contained"> {deleteLoading ? 'Loading...' : 'Delete'} </Button>
        </DialogActions>
      </Dialog>

      {/* Assing Interview Modal */}
      {/* Assign Interview Modal - Only Select Employee Dropdown */}

      {/* End here */}
      <Viewdoc_modal show={viewDocumets.showViewDocumentModal} onHide={() => setViewDocuments({ showViewDocumentModal: false })} imageUrl={viewDocumets.fileUrl} docName={viewDocumets.fileName} />

      {/* <AssignInterviews
        open={openAssignCoEmp}
        handleClose={() => setOpenAssignCoEmp(false)}
        addType={'interviewer'}
        assignFn={AddInterviewerInTerview}
      /> */}
    </>
  );
}
