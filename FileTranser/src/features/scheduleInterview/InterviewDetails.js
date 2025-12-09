import React, { useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Form from "react-bootstrap/Form";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { setInterviewType, setInterviewLink  , setInterviewStage , setInterviewHost , GetEmployeeList , setInterviewers , removeInterviewer} from "../slices/ScheduleInterviews/ScehduleInterviews";
import { useDispatch, useSelector } from "react-redux";
import {  useSearchParams  } from "react-router-dom";
import { toast } from "react-toastify";

import InputGroup from "react-bootstrap/InputGroup";
import moment from "moment";
import { CamelCases } from "../../utils/common";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function InterviewDetail({ onPrevios }) {
  const dispatch = useDispatch();
  const { interviewType, interviewLink , interviewStage  , interviewHost , getInterviewerList , interviewDate , interviewTime , interviewDuration , interviewers} = useSelector((state) => state.interview)
  const jobDetails = useSelector((state) => state.getJobsList.getJobListById);

  const [deleteChip, setDeleteChip] = useState();
  const [selectedStage, setSelectedStage] = useState("1");
  const [selectedChips, setSelectedChips] = useState([]);
  const [selectedOption, setSelectedOption] = useState("one1");
  const [validationError, setValidationError] = useState('');

  const [searchParams] = useSearchParams();

  const userId = searchParams.get('userId'); 
  const appliedJobId = searchParams.get('applied-job-id');


  useEffect(() => {
       dispatch(GetEmployeeList());
  } , [dispatch])

  // add the selected cips data 
  useEffect(() => {
     let arr = interviewers.map((key) => key.employee_name);
     setSelectedChips(arr);
  } , [interviewers])

  const names = getInterviewerList.status === 'success'
  ? getInterviewerList.data?.map(item => item.name) || []
  : [];
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleChange = (e) => {
    dispatch(setInterviewType(e.target.value));
  };

  const handleChangeStage = (e) => {
    setSelectedStage(e.target.value);
  };

  const handleChangeChips = (event) => {
    const selectedValues = event.target.value;
    setSelectedChips(selectedValues);
    setDeleteChip(selectedValues);
    const interview = getInterviewerList.data.find(key => key.name === selectedValues[selectedValues.length-1]);
    dispatch(setInterviewers({employee_name:interview?.name , employee_id:interview?._id , designation:interview?.designation }))
  };

  const handleScheduleInterviews = (e) => {
     e.preventDefault();
     let Paylods = { 
      "candidate_id":userId,
      "applied_job_id":appliedJobId, 
      "interview_host":interviewHost,
      "stage":interviewStage,
      "google_meet_link":interviewLink,
      "interview_type":"Online",
      "interview_duration":interviewDuration,
      "interview_date":moment(interviewDate).format("DD-MMMM-YYYY")+" "+interviewTime,
      "interviewer":interviewers
    }
     axios.post(`${config.API_URL}scheduleInterView` , Paylods , apiHeaderToken(config.API_TOKEN))
     .then((response) => {
         console.log(response.data.data)
         if(response.status === 200){
            toast.success(response.data.message)
         }
     })
     .catch(err => {
       console.log(err.response.data.message)
       toast.error(err.response.data.message)
     })
  }

  // validate Link
  const validateLink = (value) => {
    // Basic URL validation regex
    const urlPattern = new RegExp('^(https?:\\/\\/)?' + // Protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // Domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // Port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // Query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // Fragment locator
    return !!urlPattern.test(value);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
  
    if (interviewType === 'Online' && !validateLink(value)) {
      setValidationError('Please enter a valid URL');
    } else {
      setValidationError('');
    }
  
    dispatch(setInterviewLink(value));
  };

  const HandleDelete = (chipToDelete) => {
    // Filter out the chip to be deleted
    const updatedChips = selectedChips.filter((chip) => chip !== chipToDelete);
    dispatch(removeInterviewer(chipToDelete))
    setSelectedChips(updatedChips);
  };
  return (
    <div className="my-4">
      <div className="row intervw_form">
        <div className="col-lg-6">
          <div className="job_postn d-flex flex-row justify-content-start gap-4 align-items-center">
            <Form.Label htmlFor="basic-url" className="text-start fs-6 m-0">
              Interview Type
            </Form.Label>
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={interviewType}
                onChange={handleChange}
                className="d-flex justify-content-start gap-4 flex-row"
              >
                <FormControlLabel
                  value="Online"
                  control={<Radio />}
                  label="Online"
                />
                <FormControlLabel
                  value="Offline"
                  control={<Radio />}
                  label="Offline"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="d-flex flex-column gap-3 mt-3">
            {
                interviewType === 'Online' &&
              <div>
              <Form.Label htmlFor="basic-url" className="text-start w-100 fs-6">
                Enter Google Meet Link
              </Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  id="basic-url"
                  aria-describedby="basic-addon3"
                  placeholder="Enter Link"
                  required={interviewType === 'Online'}
                  value={interviewLink}
                  onChange={handleInputChange}
                />
              </InputGroup>
              {validationError && <div className="text-danger">{validationError}</div>}
            </div>
            }
            <div>
              <Form.Label htmlFor="basic-url" className="text-start w-100 fs-6">
                Interview Stage
              </Form.Label>
              <InputGroup className="mb-3">
                <Form.Select aria-label="Default select example" value={interviewStage} onChange={(e) => {
                   dispatch(setInterviewStage(e.target.value))
                }}>
                  <option>Select the Interview Stage</option>
                  <option value="1st Round">1st round</option>
                  <option value="2nd Round">2nd round</option>
                  <option value="3rd Round">3rd round</option>
                </Form.Select>
              </InputGroup>
            </div>
            <div className="d-flex flex-row gap-2">
              <div
                className={
                  interviewHost === "One-To-One"
                    ? "selected-card card w-100 my-2"
                    : "unselected-card card w-100 my-2"
                }
                onClick={() => dispatch(setInterviewHost("One-To-One"))}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-center align-items-center flex-column gap-2 h-100">
                    <div className="peopler">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 15 15"
                        fill="none"
                      >
                        <rect
                          width="13.6092"
                          height="13.6092"
                          transform="translate(0.695312 0.505737)"
                          fill="#BFE7FA"
                        />
                        <path
                          d="M7.49994 2.2069C7.92051 2.2069 8.33164 2.33161 8.68133 2.56527C9.03102 2.79892 9.30357 3.13103 9.46452 3.51958C9.62546 3.90814 9.66757 4.33569 9.58552 4.74818C9.50347 5.16067 9.30095 5.53957 9.00356 5.83695C8.70617 6.13434 8.32728 6.33686 7.91479 6.41891C7.5023 6.50096 7.07475 6.45885 6.68619 6.29791C6.29764 6.13696 5.96553 5.86441 5.73188 5.51472C5.49822 5.16503 5.37351 4.7539 5.37351 4.33333C5.37351 3.76937 5.59754 3.2285 5.99633 2.82972C6.39511 2.43093 6.93598 2.2069 7.49994 2.2069ZM7.49994 1.35632C6.91115 1.35632 6.33557 1.53092 5.846 1.85804C5.35644 2.18516 4.97487 2.6501 4.74954 3.19408C4.52422 3.73806 4.46527 4.33664 4.58013 4.91412C4.695 5.4916 4.97854 6.02206 5.39488 6.4384C5.81122 6.85474 6.34167 7.13828 6.91916 7.25314C7.49664 7.36801 8.09522 7.30906 8.6392 7.08373C9.18317 6.85841 9.64812 6.47684 9.97524 5.98727C10.3024 5.49771 10.477 4.92213 10.477 4.33333C10.477 3.54378 10.1633 2.78657 9.60501 2.22827C9.04671 1.66997 8.2895 1.35632 7.49994 1.35632Z"
                          fill="#155674"
                        />
                        <path
                          d="M11.7528 13.2644H10.9022V11.1379C10.9022 10.8587 10.8472 10.5822 10.7404 10.3242C10.6335 10.0662 10.4769 9.83177 10.2794 9.63432C10.082 9.43686 9.84755 9.28023 9.58956 9.17336C9.33157 9.0665 9.05505 9.0115 8.77581 9.0115H6.22408C5.66012 9.0115 5.11925 9.23553 4.72046 9.63432C4.32168 10.0331 4.09764 10.574 4.09764 11.1379V13.2644H3.24707V11.1379C3.24707 10.3484 3.56072 9.59117 4.11902 9.03287C4.67731 8.47457 5.43453 8.16092 6.22408 8.16092H8.77581C9.56536 8.16092 10.3226 8.47457 10.8809 9.03287C11.4392 9.59117 11.7528 10.3484 11.7528 11.1379V13.2644Z"
                          fill="#155674"
                        />
                      </svg>
                    </div>
                    <h6>One-to-One</h6>
                    <p>1 host to invite</p>
                  </div>
                </div>
              </div>
              <div className={
                interviewHost === "Panel"
                  ? "selected-card card w-100 my-2"
                  : "unselected-card card w-100 my-2"
              }
                onClick={() => 
                  dispatch(setInterviewHost("Panel"))}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-center align-items-center flex-column gap-2 h-100">
                    <div className="peopler">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <g clip-path="url(#clip0_159_5713)">
                          <rect
                            width="13.4253"
                            height="13.4253"
                            transform="translate(0.287109 0.390869)"
                            fill="#BFE7FA"
                          />
                          <path
                            d="M13.2932 12.9771H12.4542V11.7185C12.4542 11.3847 12.3216 11.0645 12.0855 10.8285C11.8495 10.5925 11.5293 10.4599 11.1955 10.4599H9.51738C9.18357 10.4599 8.86343 10.5925 8.6274 10.8285C8.39136 11.0645 8.25876 11.3847 8.25876 11.7185V12.9771H7.41967V11.7185C7.41967 11.1621 7.64068 10.6286 8.03408 10.2352C8.42747 9.84179 8.96103 9.62078 9.51738 9.62078H11.1955C11.7519 9.62078 12.2854 9.84179 12.6788 10.2352C13.0722 10.6286 13.2932 11.1621 13.2932 11.7185V12.9771Z"
                            fill="#155674"
                          />
                          <path
                            d="M10.3565 5.42538C10.6054 5.42538 10.8487 5.4992 11.0557 5.6375C11.2627 5.7758 11.424 5.97237 11.5193 6.20235C11.6145 6.43233 11.6395 6.6854 11.5909 6.92955C11.5423 7.1737 11.4225 7.39796 11.2464 7.57398C11.0704 7.75 10.8462 7.86988 10.602 7.91844C10.3579 7.967 10.1048 7.94208 9.8748 7.84682C9.64482 7.75156 9.44825 7.59023 9.30995 7.38326C9.17165 7.17628 9.09784 6.93293 9.09784 6.684C9.09784 6.3502 9.23044 6.03006 9.46648 5.79402C9.70251 5.55799 10.0226 5.42538 10.3565 5.42538ZM10.3565 4.5863C9.94157 4.5863 9.536 4.70933 9.19104 4.93983C8.84607 5.17033 8.5772 5.49794 8.41843 5.88125C8.25966 6.26455 8.21812 6.68633 8.29906 7.09324C8.38 7.50016 8.57979 7.87393 8.87316 8.1673C9.16653 8.46067 9.5403 8.66046 9.94722 8.7414C10.3541 8.82234 10.7759 8.7808 11.1592 8.62203C11.5425 8.46326 11.8701 8.19439 12.1006 7.84942C12.3311 7.50446 12.4542 7.09889 12.4542 6.684C12.4542 6.12766 12.2332 5.5941 11.8398 5.2007C11.4464 4.80731 10.9128 4.5863 10.3565 4.5863Z"
                            fill="#155674"
                          />
                          <path
                            d="M6.58059 9.62078H5.74151V8.36216C5.74151 8.02836 5.60891 7.70822 5.37287 7.47219C5.13684 7.23615 4.8167 7.10354 4.48289 7.10354H2.80473C2.47093 7.10354 2.15079 7.23615 1.91475 7.47219C1.67872 7.70822 1.54611 8.02836 1.54611 8.36216V9.62078H0.707031V8.36216C0.707031 7.80582 0.928038 7.27226 1.32143 6.87887C1.71483 6.48547 2.24839 6.26446 2.80473 6.26446H4.48289C5.03924 6.26446 5.5728 6.48547 5.96619 6.87887C6.35959 7.27226 6.58059 7.80582 6.58059 8.36216V9.62078Z"
                            fill="#155674"
                          />
                          <path
                            d="M3.64381 2.06906C3.89274 2.06906 4.13609 2.14288 4.34307 2.28118C4.55004 2.41948 4.71136 2.61605 4.80663 2.84603C4.90189 3.07601 4.92681 3.32908 4.87825 3.57323C4.82969 3.81737 4.70981 4.04164 4.53379 4.21766C4.35777 4.39368 4.13351 4.51355 3.88936 4.56212C3.64521 4.61068 3.39214 4.58576 3.16216 4.4905C2.93218 4.39523 2.73561 4.23391 2.59731 4.02693C2.45901 3.81995 2.38519 3.57661 2.38519 3.32768C2.38519 2.99387 2.5178 2.67374 2.75383 2.4377C2.98987 2.20167 3.31001 2.06906 3.64381 2.06906ZM3.64381 1.22998C3.22893 1.22998 2.82336 1.35301 2.47839 1.58351C2.13343 1.81401 1.86456 2.14162 1.70579 2.52493C1.54702 2.90823 1.50548 3.33001 1.58642 3.73692C1.66736 4.14384 1.86715 4.51761 2.16051 4.81098C2.45388 5.10435 2.82766 5.30414 3.23457 5.38508C3.64149 5.46602 4.06326 5.42447 4.44657 5.26571C4.82987 5.10694 5.15749 4.83807 5.38799 4.4931C5.61849 4.14814 5.74151 3.74257 5.74151 3.32768C5.74151 2.77134 5.52051 2.23778 5.12711 1.84438C4.73372 1.45099 4.20016 1.22998 3.64381 1.22998Z"
                            fill="#155674"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_159_5713">
                            <rect
                              width="13.4253"
                              height="13.4253"
                              fill="white"
                              transform="translate(0.287109 0.390869)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <h6>Panel Interview</h6>
                    <p>More than 1 host to invite</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="custm_multiselect">
            <FormControl className="w-100" sx={{ m: 1 }}>
              <label className="form-label">Select Interviewer</label>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={selectedChips}
                onChange={handleChangeChips}
                inputProps={{ "aria-label": "Without label" }}
                MenuProps={MenuProps}
              >
                {names
                  .filter((name) => !selectedChips.includes(name)) // Filter out selected chips
                  .map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
              </Select>
              <div className="mt-3">
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selectedChips.map((chip) => (
                    <Chip
                      key={chip}
                      label={chip}
                      onDelete={() => HandleDelete(chip)}
                    />
                  ))}
                </Box>
              </div>
            </FormControl>
          </div>
          <div className="mt-4 d-flex flex-row gap-3">
            <button className="sitebtn btnprevinter fullbtn btn-defaulter" onClick={onPrevios}>
              Back
            </button>
            <button className="sitebtn btnblue fullbtn btn-defaulter" onClick={handleScheduleInterviews}>
              Confirm
            </button>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="sitecard rounded-4">
            <div className="interview_summry">
              <div className="d-flex justify-content-start gap-4 flex-column w-100">
                <h3>Interview Schedule brief</h3>
                <ul className="list-unstyled d-flex flex-column gap-3">
                  <li>
                    <div className="d-flex gap-3 justify-content-start">
                      <p className="wide100">Job Post:</p>
                      <p className="color-voilet"> {jobDetails.status === 'success' && jobDetails.data.job_title }, {jobDetails.status === 'success' && CamelCases(jobDetails.data.working)} - {jobDetails.status === 'success' && jobDetails.data.location[0]?.name } </p>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex gap-3 justify-content-start">
                      <p className="wide100">Date & Time:</p>
                      <p className="color-voilet">{moment(interviewDate).format("DD/MM/YYYY")}, {interviewTime}</p>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex gap-3 justify-content-start">
                      <p className="wide100">Duration:</p>
                      <p className="color-voilet">{interviewDuration}</p>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex gap-3 justify-content-start">
                      <p className="wide100">Location:</p>
                      <p className="color-voilet">{jobDetails.status === 'success' && jobDetails.data.location[0]?.name }</p>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex  gap-3  justify-content-start">
                      <p className="wide100">Interview Stage:</p>
                      <p className="color-voilet">{interviewStage}</p>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex  gap-3 justify-content-start">
                      <p className="wide100">Type:</p>
                      <p className="color-voilet">{interviewType}</p>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex  gap-3  justify-content-start">
                      <p className="wide100">Interviewer:</p>
                      <p className="color-voilet">{selectedChips.length !== 0 && selectedChips.join(', ')}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
