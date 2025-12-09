
import { React, useState, useEffect, useCallback } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DeleteAndRemoved, MarkAsInterviewCompleted, ShortListCandidates } from "../slices/JobSortLIstedSlice/SortLIstedSlice";
import { FetchCandidatesListById } from "../slices/AppliedJobCandidates/JobAppliedCandidateSlice";
import { useDispatch } from "react-redux";
import StepConnector from "@mui/material/StepConnector";
import { styled } from '@mui/system';
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { stepConnectorClasses } from "@mui/material/StepConnector";
import { Link, useSearchParams } from 'react-router-dom';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import { changeJobTypeLabel, DateFormate } from "../../utils/common";
import moment from "moment";
import { useParams } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { InputGroup, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { FaRegClock } from "react-icons/fa6";
import { LiaRupeeSignSolid } from "react-icons/lia";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import { CiCircleRemove } from "react-icons/ci";
import { debounce } from "lodash";

//const steps = ["Applied", "Shortlisted", "Interview", "Offer", "Hired"];

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
        width: 3,
        height: 1,
        border: 0,
        backgroundColor:
            theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
        borderRadius: 1,
    },
}));


const CustomStepIcon = ({ active, completed }) => {
    if (completed) {
        return <CheckCircleIcon color="primary" />;
    } else if (active) {
        return <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
            <path d="M23 11.5C23 17.8513 17.8513 23 11.5 23C5.14873 23 0 17.8513 0 11.5C0 5.14873 5.14873 0 11.5 0C17.8513 0 23 5.14873 23 11.5ZM8.73782 11.5C8.73782 13.0255 9.97449 14.2622 11.5 14.2622C13.0255 14.2622 14.2622 13.0255 14.2622 11.5C14.2622 9.97449 13.0255 8.73782 11.5 8.73782C9.97449 8.73782 8.73782 9.97449 8.73782 11.5Z" fill="#30A9E2" />
        </svg>;
    } else {
        return <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
            <path d="M23 11.5C23 17.8513 17.8513 23 11.5 23C5.14873 23 0 17.8513 0 11.5C0 5.14873 5.14873 0 11.5 0C17.8513 0 23 5.14873 23 11.5ZM8.73782 11.5C8.73782 13.0255 9.97449 14.2622 11.5 14.2622C13.0255 14.2622 14.2622 13.0255 14.2622 11.5C14.2622 9.97449 13.0255 8.73782 11.5 8.73782C9.97449 8.73782 8.73782 9.97449 8.73782 11.5Z" fill="#EBEBEB" />
        </svg>;
    }
};


export default function Interview_steps({ interviewStep }) {

    const [activeStep, setActiveStep] = useState(0);
    const [isStepperDisabled, setIsStepperDisabled] = useState(false); // State to manage stepper disabled
    const { id } = useParams();
    const [searchParams] = useSearchParams()
    const jobId = searchParams.get('job_id')
    const [offerModel, setOfferModel] = useState(false);
    const [offerData, setOfferData] = useState(null);
    const [offerDate, setOfferDate] = useState(null);
    const [offerDesignation, setOfferDesignation] = useState('');
    const [offerCTC, setOfferCTC] = useState(0);
    const Navigate = useNavigate();
    const [extendOffer, setExtendOffer] = useState(false);
    const [extendData, setextendData] = useState(null);
    const [offerApproveMember, setMember] = useState(null)
    const [selectedMember, setSelectedMember] = useState(null);
    const [option, setOption] = useState(null);
    const [pen, setPen] = useState(false);
    const [addPeriority, setAddPriority] = useState('')
    const [showOther, setShowOthers] = useState(false);
    const [loadingApproval, setLodingApproval] = useState(false)
    const [openSendOfferExtendOffers, setOpenSendOfferExtendOfer] = useState();
    const [offerValidDate, setOfferValidDate] = useState(null);

    const dispatch = useDispatch();
    const getEmployeeRecords = JSON.parse(localStorage.getItem('admin_role_user') ?? {});
    const [loading, setLoding] = useState({
        loading: false,
        label: ''
    })

    // Get Offer Approval Member List
    const getOfferApprovalMemberList = async () => {
        try {
            let payloads = {
                "candidate_id": interviewStep?._id,
                "applied_job_id": interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?._id,
            }
            let response = await axios.post(`${config.API_URL}getJobOfferApprovalMemberList`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                setMember(response.data?.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const debouncedFetch = useCallback(
        debounce((input) => {
            getMemberList(input)
                .then((res) => {
                    setPen(false)
                    setOption(res);
                })
                .catch((err) => {
                    setOption([]);
                });
        }, 500), // Adjust the delay (in milliseconds) as needed
        []
    );
    // handle Menu Open
    const handleMenuOpen = () => {
        setPen(true);
        getMemberList("")
            .then((res) => {
                setPen(false)
                setOption(res)
            })
            .catch(err => {
                setPen(false)
                setOption([])
            })
    }

    useEffect(() => {
        getMemberList("")
            .then((res) => {
                setPen(false)
                setOption(res)
            })
            .catch(err => {
                setPen(false)
                setOption([])
            })
    }, [])

    // handle Input changes 
    const handleInputChange = (input) => {
        if (input) {
            setPen(true);
            debouncedFetch(input);
        } else {
            setPen(false);
            setOption([]);
        }
    };



    const getMemberList = async (input = '') => {
        try {
            let payloads = {
                "keyword": input,
                "page_no": "1",
                "per_page_record": "10",
                "scope_fields": ["employee_code", "name", "email", "mobile_no", "_id", "designation"],
                "profile_status": "Active",
            }
            let response = await axios.post(`${config.API_URL}getEmployeeList`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                return response.data?.data?.map((key) => {
                    return {
                        label: `${key?.name} (${key?.employee_code})`,
                        value: key._id,
                        emp: key
                    }
                })
            } else {
                return [];
            }
        } catch (error) {
            return [];
        }
    }


    const handlePriorityChange = (index, newPriority) => {
        const updatedMembers = offerApproveMember?.map((member, i) =>
            i === index ? { ...member, priority: newPriority } : member
        );
        setMember(updatedMembers);
    };



    const handleCloseOfferModels = () => setOfferModel(false);
    const handleCloseSendOfferExtendOffer = () => setOpenSendOfferExtendOfer(false);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleChange = (option) => {
        setSelectedMember(option)
    }


    const HandleNavigate = () => {
        Navigate(`/onboarding?type=new&candidate_id=${interviewStep?._id}&job_id=${jobId || interviewStep?.job_id}`)
    }

    const handleReject = () => {
        let payloads = {
            "candidate_id": interviewStep?._id,
            "applied_job_id": interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?._id,
            "status": "Rejected"
        }
        dispatch(DeleteAndRemoved(payloads))
            .unwrap()
            .then((response) => {
                // console.log(response , 'this is response Id from the there are some issue reflated the name ')
                if (response.status) {
                    setIsStepperDisabled(true);
                    dispatch(FetchCandidatesListById(id));
                    handleNext()
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };

    const handleMarkAsInterviewComplete = () => {
        let payloads = {
            "candidate_doc_id": interviewStep?._id,
            "applied_job_doc_id": interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?._id,
        }
        dispatch(MarkAsInterviewCompleted(payloads))
            .unwrap()
            .then((response) => {
                if (response.status) {
                    setIsStepperDisabled(true);
                    dispatch(FetchCandidatesListById(id));
                    handleNext()
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };

    /********* Handle the Reject the Point Data from the server  ***********/
    const handleHired = () => {
        let payloads = {
            "candidate_id": interviewStep?._id,
            "applied_job_id": interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId)[0]?._id,
            "status": "Hired"
        }
        dispatch(DeleteAndRemoved(payloads))
            .unwrap()
            .then((response) => {
                if (response.status) {
                    setIsStepperDisabled(true);
                    dispatch(FetchCandidatesListById(id));
                    handleNext()
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };


    const handleShortListCandidate = async () => {
        let payloads = {
            "role_user_id": getEmployeeRecords?._id,
            "candidate_ids": [{ candidate_id: interviewStep?._id, applied_job_id: interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?._id }],
            "status": "Shortlisted",
            "batch_id": ''
        }
        dispatch(ShortListCandidates(payloads))
            .unwrap()
            .then((response) => {
                if (response.status) {
                    dispatch(FetchCandidatesListById(id));
                    handleNext()
                }
            })
            .catch(err => {
                console.log(err);
            })
    }


    const handleShowOfferModel = (e) => {
        setOfferModel(true);
        getOfferApprovalMemberList()
        setOfferData(interviewStep)
        setOfferCTC(interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id)[0]?.offer_ctc || "")
        setOfferDate(
            moment(interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id)[0]?.onboard_date).format('YYYY-MM-DD') || ""
        );
        setOfferValidDate(
            moment(interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id)[0]?.job_valid_till).format('YYYY-MM-DD') || ""
        );
    }


    const ExtendOfferLatter = (e) => {
        setOpenSendOfferExtendOfer(true);
        setOfferData(interviewStep)
        setOfferDesignation(interviewStep?.designation)
        setOfferCTC(interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.offer_ctc)
        setExtendOffer(true);
        setextendData(interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id))
        setOfferDate(
            moment(interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.onboard_date).format('YYYY-MM-DD')
        );
        setOfferValidDate(
            moment(interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.job_valid_till).format('YYYY-MM-DD') || ""
        );
    }


    const SendOfferLatter = (e) => {
        setOpenSendOfferExtendOfer(true);
        setOfferData(interviewStep)
        setOfferDesignation(interviewStep?.designation)
        setOfferCTC(interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.offer_ctc)
        setextendData(interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id))
        setOfferDate(
            moment(interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.onboard_date).format('YYYY-MM-DD')
        );
        setOfferValidDate(
            moment(interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.job_valid_till).format('YYYY-MM-DD') || ""
        );
    }


    const [inListStatus, setInListStatus] = useState(false);
    const handleHandleAddInList = async (status) => {

        let payload = {
            "candidate_data": [
                {
                    "candidate_id": interviewStep?._id,
                    "applied_job_id": interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId)[0]?._id,
                }
            ],
            "status": status,
            "add_by_name": getEmployeeRecords?.name,
            "add_by_mobile": getEmployeeRecords?.mobile_no,
            "add_by_designation": getEmployeeRecords?.designation,
            "add_by_email": getEmployeeRecords?.email
        }

        setInListStatus(true)

        axios.post(`${config.API_URL}moveInterviewCandidateToWaitingOrSelected`, payload, apiHeaderToken(config.API_TOKEN))
            .then((response) => {
                if (response.status === 200) {
                    toast.success(response.data?.message)
                } else {
                    toast.error(response.data?.message)
                }
                setInListStatus(false)
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message || err.message || "someting Went Wrong");
                setInListStatus(false)
            })
    }

    let FindDetails = interviewStep?.applied_jobs?.find(
        (item) => item.job_id === jobId
    ) ?? interviewStep?.applied_jobs?.find(
        (item) => item.job_id === interviewStep?.job_id
    );

    const steps = [
        {
            label: 'Applied',
            // description: moment(interviewStep?.add_date).utc().format('DD/MM/YYYY, h:mm a'),
            description: (
                <>
                    <p>{moment(interviewStep?.add_date).utc().format('DD/MM/YYYY, h:mm a')}</p>
                    {
                        interviewStep && interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.form_status === 'Applied' &&
                        <>
                            <button className="stepbtn bggren" onClick={handleShortListCandidate}> Mark Shortlisted</button>
                            <button className="stepbtn bgred" onClick={() => handleReject()}> Reject</button>
                        </>
                    }
                </>
            ),
            btntext: `Mark Shortlisted`,
            status: interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.form_status
        },
        {
            label: 'Shortlisted',
            description: (
                <>

                    {
                        interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.form_status === 'Shortlisted' &&
                        <>
                            <p>{moment(interviewStep?.updated_on).utc().format('DD/MM/YYYY, h:mm a')}</p>
                            <Link to={`/schedule-interview/${jobId}?userId=${interviewStep?._id}&applied-job-id=${interviewStep && interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId)[0]?._id}`}><button className="stepbtn"> Schedule Interview</button> </Link>
                            <button className="stepbtn bgred" onClick={() => handleReject()}> Reject</button>
                        </>
                    }
                </>
            ),
            btntext: `Schedule for Interview`,
            status: interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.form_status
        },
        {
            label: 'Interview',
            description: (
                <>
                    {
                        interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.form_status === 'Interview' &&
                        <>
                            <div className="d-flex align-items-center justify-content-lg-start flex-wrap gap-2">
                                {
                                    FindDetails?.interview_status === 'Pending' && (
                                        <>
                                            <Link to={`/schedule-interview/${jobId}?userId=${interviewStep?._id}&applied-job-id=${interviewStep && interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId)[0]?._id}`}><button className="stepbtn"> Schedule Interview</button> </Link>
                                            <button className="stepbtn" onClick={() => handleMarkAsInterviewComplete()}> Mark As Completed </button>
                                            <button className="stepbtn bgred" onClick={() => handleReject()}> Reject </button>
                                        </>
                                    )
                                }
                                {
                                    FindDetails?.interview_status === 'Completed' && (
                                        <>

                                            {/* give me Interview have Completed wait for evaluation  */}

                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                <div className="status-indicator completed">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="12" cy="12" r="10" fill="#10B981" />
                                                        <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <div width="fit-content" style={{ maxWidth: '250px' }}>
                                                    <p className="mb-0 small d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill text-white fw-medium"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #29166F 0%, #6366F1 100%)',
                                                            fontSize: '12px',
                                                            boxShadow: '0 2px 8px rgba(41, 22, 111, 0.3)',
                                                            border: 'none'
                                                        }}>
                                                        Interview Completed • Await for the evaluation
                                                        <div className="bg-warning rounded-circle"
                                                            style={{
                                                                width: '6px',
                                                                height: '6px',
                                                                animation: 'pulse 1.5s infinite'
                                                            }}></div>
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                                {/* <button className="stepbtn bggren" disabled={inListStatus} onClick={() => handleHandleAddInList('Waiting')}>  Wait List  </button>
                                <button className="stepbtn bggren" disabled={inListStatus} onClick={() => handleHandleAddInList('Selected')}> Selected </button> */}
                                {/* {
                                    interviewStep?.hiring_status === 'Approved'
                                    &&
                                    <button className="stepbtn bggren " onClick={SendOfferLatter}> Send Offer </button>
                                } */}
                                {/* <button className="stepbtn bgred" onClick={() => handleReject()}> Reject </button> */}
                                {/* <button className="stepbtn bgred" onClick={() => handleReject()}> Reject </button> */}
                            </div>
                        </>
                    }
                </>
            ),
            btntext: interviewStep?.hiring_status === 'Approved'
                ? `Reject` : 'Reject Candidate',
            status: interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.form_status
        },
        {
            label: 'Offer',
            description:
                (
                    <>
                        {
                            interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.form_status === 'Offer' &&
                            <>
                                {/* <button className="stepbtn bggren" onClick={HandleNavigate}> Start Onboarding </button> */}
                                {/* <button className="stepbtn bggren" onClick={handleHired}> Mark Hire </button> */}
                                {
                                    interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.offer_status === 'Accepted'
                                    &&
                                    <button className="stepbtn bggren" onClick={HandleNavigate}> Start Onboarding </button>
                                }
                                <button className="stepbtn bggren" onClick={ExtendOfferLatter}> Extend Offer </button>

                                <button className="stepbtn bgred" onClick={() => handleReject()}> Reject</button>
                            </>
                        }
                    </>
                ),
            btntext: ['Pending', 'Rejected'].includes(interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.offer_status) ? `Reject Candidate` : 'Start Onboarding',
            status: interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.form_status
        },
        {
            label: 'Hired',
            description:
                (
                    <>
                        {
                            interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.form_status === 'Hired'
                            // <>
                            //     <button className="stepbtn bggren" onClick={HandleNavigate}> Start Onboarding </button>

                            //     <button className="stepbtn bgred" onClick={() => handleReject()}> Reject</button>
                            // </>
                        }
                        {/* <button className="stepbtn bgred" onClick={() => handleReject()}> Reject</button> */}
                    </>
                ),
            btntext: `Candidate Hired`,
            status: interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0].form_status
        }
    ]

    useEffect(() => {
        if (interviewStep && interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.form_status) {
            const formStatus = interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.form_status;
            if (formStatus === 'Rejected') {
                setIsStepperDisabled(true); // Disable all future steps if the candidate is rejected
            } else {
                setIsStepperDisabled(false); // Ensure future steps are enabled if not rejected
                const currentStepIndex = steps.findIndex(step => step.label === formStatus);
                if (currentStepIndex !== -1) {
                    setActiveStep(currentStepIndex);
                }
            }
        }
    }, [interviewStep]);

    const handleSendOfferLatter = () => {

        let payloads = {
            "candidate_id": interviewStep?._id,
            "applied_job_id": interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?._id,
            "onboard_date": offerDate,
            "offer_ctc": offerCTC,
            "job_valid_till": offerValidDate
        }

        axios.post(`${config.API_URL}${extendOffer ? 'extendJobOffer' : 'offerJob'}`, payloads, apiHeaderToken(config.API_TOKEN))
            .then((response) => {
                if (response.status === 200) {
                    setOfferCTC('');
                    setOfferDate(null);
                    handleCloseOfferModels();
                    dispatch(FetchCandidatesListById(id));
                    if (!extendOffer) {
                        handleNext()
                        handleNext()
                    }
                    handleCloseSendOfferExtendOffer(false)
                    return toast.success(response.data.message)
                }
            })
            .catch(err => {
                toast.error(err.response.data.message)
            })
    }

    const UpdateJobOfferAmount = () => {

        let payloads = {
            "candidate_id": interviewStep?._id,
            "applied_job_id": interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?._id,
            "onboard_date": offerDate,
            "offer_ctc": offerCTC,
            "job_valid_till": offerValidDate
        }

        setLoding(prev => ({
            ...prev,
            loading: true,
            label: 'SendAmount',
        }));

        axios.post(`${config.API_URL}UpdateJobOfferAmount`, payloads, apiHeaderToken(config.API_TOKEN))
            .then((response) => {
                if (response.status === 200) {
                    dispatch(FetchCandidatesListById(id));
                    setLoding(prev => ({
                        ...prev,
                        loading: false,
                        label: 'SendAmount',
                    }));
                    return toast.success(response.data.message)
                }
            })
            .catch(err => {
                setLoding(prev => ({
                    ...prev,
                    loading: false,
                    label: 'SendAmount',
                }));
                toast.error(err.response.data.message || err.message || "Someting went wrong");
            })
    }

    const sendOfferApproval = async (item) => {
        try {
            setLodingApproval(true)
            let payloads = {
                "candidate_id": interviewStep?._id,
                "applied_job_id": interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?._id,
                "employee_id": item?.employee_id,
                "add_by_name": getEmployeeRecords?.name,
                "add_by_mobile": getEmployeeRecords?.mobile_no,
                "add_by_designation": getEmployeeRecords?.designation,
                "add_by_email": getEmployeeRecords?.email
            }
            let response = await axios.post(`${config.API_URL}sendJobOfferApprovalMailToMember`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                toast.success(response.data.message);
                getOfferApprovalMemberList()
                setLodingApproval(false)
            } else {
                toast.error(response.data.message);
                setLodingApproval(false)
            }
        } catch (error) {
            toast.error(error?.response.data?.message || error.message || 'Someting Went Wrong');
            setLodingApproval(false)
        }
    }


    const getActionButtonByPriority = (item) => {
        const validMembers = offerApproveMember?.filter(member => member?.priority != null);
        const sortedMembers = validMembers?.sort((a, b) => a.priority - b.priority);
        const lowestPriorityMember = sortedMembers?.find(
            (member) => member.status === "Approved"
        );
        const secondLowestMember = sortedMembers?.find(
            (member) => member.priority > (lowestPriorityMember?.priority || 0) && (member.status === "" || member.status === "Pending")
        );
        if (item?.priority === secondLowestMember?.priority && (item?.status === "" || item?.status === "Pending")) {
            return (
                <Button
                    type="button"
                    className="btn btn-success"
                    style={{ height: '40px', fontSize: '10px', color: 'white' }}
                    onClick={() => sendOfferApproval(item)}
                    disabled={loadingApproval}
                >
                    {loadingApproval ? "Sending Approval.." : "Send Mail"}
                </Button>
            );
        }
        if (item?.status === "Approved") {
            return <span>Already Approved</span>;
        }
        return <span>No Actions Available</span>;
    };


    const handleRemove = (item) => {
        let deletedItem = offerApproveMember?.filter((data) => data?._id !== item?._id)?.map((item) => {
            if (item?.employee_id === 'NA') {
                return {
                    id: item?.employee_id,
                    priority: 0
                }
            }
            return {
                id: item?.employee_id,
                priority: item.priority
            }
        })
        // Delete the member 
        memberAction(deletedItem)
            .then((res) => {
                if (res.status === 200) {
                    setMember(offerApproveMember?.filter((data) => data?._id !== item?._id))
                    getOfferApprovalMemberList()
                }
            })
    }


    const addMember = () => {
        if (!selectedMember) {
            return toast.warn("Please Select the Member");
        }
        if (!addPeriority) {
            return toast.warn("Please Add Priority");
        }
        let newData = {
            employee_id: selectedMember?.emp?._id,
            employee_code: selectedMember?.emp?.employee_code,
            designation: selectedMember?.emp?.designation,
            name: selectedMember?.label,
            email: selectedMember?.emp?.email,
            status: '',
            priority: addPeriority
        };

        // Called the here Api After that update the member =;
        let payload = offerApproveMember?.map((item) => {
            if (item?.employee_id === 'NA') {
                return {
                    id: item?.employee_id,
                    priority: 0
                }
            }
            return {
                id: item?.employee_id,
                priority: item.priority
            }
        })
        memberAction([...payload, { id: selectedMember?.emp?._id, priority: parseInt(addPeriority) }])
            .then((res) => {
                if (res.status === 200) {
                    getOfferApprovalMemberList()
                    setSelectedMember(null)
                    setAddPriority("")
                }
            })
    };


    const handleUpdateMember = async () => {
        let payload = offerApproveMember?.map((item) => {
            if (item?.employee_id === 'NA') {
                return {
                    id: item?.employee_id,
                    priority: 0
                }
            }
            return {
                id: item?.employee_id,
                priority: item.priority
            }
        })
        await memberAction(payload)
        getOfferApprovalMemberList()
    }

    const memberAction = async (memberList) => {
        try {

            let paylods = {
                "candidate_id": interviewStep?._id,
                "applied_job_id": interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?._id,
                "employee_ids": memberList,
                "add_by_name": getEmployeeRecords?.name,
                "add_by_mobile": getEmployeeRecords?.mobile_no,
                "add_by_designation": getEmployeeRecords?.designation,
                "add_by_email": getEmployeeRecords?.email
            }
            let response = await axios.post(`${config.API_URL}addJobOfferApprovalMember`, paylods, apiHeaderToken(config.API_TOKEN))
            if (response.status === 200) {
                toast.success(response.data?.message)
                return response
            } else {
                toast.error(response.data?.message)
                return response
            }
        } catch (error) {
            toast.error(error?.response.data?.message || error.message || 'Someting Went Wrong');
            return error?.response.data?.message || error.message || 'Someting Went Wrong';
        }
    }


    return (
        <>
            <div className="steps_interviewrap sitecard pr-0 ps-0 mb-3 position-relative">
                <div className="d-flex flex-column steps_intervw_hdr gap-1 px-3">
                    <div className="location">
                        <span>{interviewStep && changeJobTypeLabel(interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId)[0]?.job_type)}</span>
                    </div>
                    <h4 className="mb-0">{interviewStep && interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId)[0]?.job_title}</h4>
                    <div className="dflexbtwn">
                        <span> {interviewStep && interviewStep?.location} </span>
                        <span>{interviewStep && DateFormate(interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId)[0]?.add_date)}</span>
                    </div>
                </div>
                <Box sx={{ width: "100%" }} className="px-3">
                    <Stepper
                        activeStep={activeStep}
                        connector={<ColorlibConnector />}
                        orientation="vertical"
                        disabled={isStepperDisabled}
                    >
                        {/* Your steps */}
                        {steps.map((step, index) => (
                            <Step key={step.label} active={activeStep === index} completed={activeStep > index} >
                                <StepLabel StepIconComponent={CustomStepIcon}>
                                    <h6 style={{ color: activeStep === index ? '#30A9E2' : '#ccc' }}>{step.label === 'Offer' ? `${step.label} ${interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id)[0]?.offer_status ? `(${interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id)[0]?.offer_status})` : ''}` : step.label}</h6>
                                    <span className={activeStep === index ? 'allw' : 'notallw'}> {step.description}</span>
                                    <br />
                                    {
                                        // Safely check for 'Rejected' status and 'Applied' label
                                        (interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.form_status === "Rejected" && step.label === 'Applied') &&
                                        <span style={{ color: 'red !important' }}><p style={{ color: 'red' }}>Candidate Rejected</p></span>
                                    }
                                </StepLabel>
                                <StepContent>
                                    <div className="read-btn">
                                        {/* href={step.label === 'Shortlisted' && `/schedule-interview/${interviewStep?.job_id}?userId=${interviewStep?._id}&applied-job-id=${interviewStep && interviewStep?.applied_jobs[0]?._id}`} */}

                                        {
                                            step.label === 'Shortlisted' ?
                                                <Button className="btn">
                                                    <Link className="text-white" to={`/schedule-interview/${jobId || interviewStep?.job_id}?userId=${interviewStep?._id}&applied-job-id=${interviewStep && interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?._id}`}>{step.btntext}</Link>
                                                </Button>
                                                :
                                                <Button className="btn"
                                                    onClick={(e) => {
                                                        // handleNext(e, step.status)
                                                        if (step.status === 'Applied') {
                                                            handleShortListCandidate()
                                                        }
                                                        if (step.status === 'Interview') {
                                                            if (interviewStep?.hiring_status === 'Approved'
                                                            ) {
                                                                // SendOfferLatter();
                                                                handleReject()
                                                            } else {
                                                                handleReject()
                                                            }
                                                        }
                                                        if (step.status === 'Offer') {
                                                            // HandleNavigate();
                                                            if (['Pending', 'Rejected'].includes(interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.offer_status)) {
                                                                handleReject()
                                                            } else {
                                                                HandleNavigate();
                                                            }
                                                        }
                                                        // if (step.status === 'Hired') {
                                                        //     HandleNavigate();
                                                        // }
                                                        // if (step.status === 'Interview') {
                                                        //     // handleShowOfferModel();
                                                        //     SendOfferLatter();
                                                        // }
                                                    }}
                                                    sx={{ mt: 1, mr: 1 }}
                                                    disabled={isStepperDisabled || interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.form_status === "Hired"}
                                                >
                                                    {
                                                        Array.isArray(interviewStep?.applied_jobs) &&
                                                            interviewStep.applied_jobs.length > 0 &&
                                                            interviewStep?.applied_jobs?.filter((item) => item.job_id === jobId || interviewStep?.job_id === item.job_id)[0]?.form_status === "Rejected"
                                                            ? <span className='text-danger'>Candidate Rejected</span>
                                                            : step.btntext
                                                    }
                                                </Button>
                                        }
                                    </div>
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </div>

            {/* Send Offer Amount For Aproval */}
            <Modal
                show={offerModel}
                onHide={handleCloseOfferModels}
                size={showOther ? "lg" : "md"}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Set Offer Amount For Approval</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        showOther &&
                        <div className="col-sm-12">
                            <Form>
                                <Row>
                                    <Col sm={3}>
                                        <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Date of Onboarding</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <FaRegClock />
                                                </InputGroup.Text>
                                                <Form.Control type="date" placeholder="Select a date" value={offerDate} onChange={(e) => {
                                                    setOfferDate(e.target.value)
                                                }} />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Contract End Date</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <FaRegClock />
                                                </InputGroup.Text>
                                                <Form.Control type="date" placeholder="Select a date" value={offerValidDate} onChange={(e) => {
                                                    setOfferValidDate(e.target.value)
                                                }} />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput1">
                                            <Form.Label>CTC Per annum</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <LiaRupeeSignSolid />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Please Enter the CTC"
                                                    value={offerCTC}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^\d*$/.test(value)) {
                                                            setOfferCTC(value); // Update only if the value contains digits only
                                                        }
                                                    }}
                                                    onKeyPress={(e) => {
                                                        // Prevent any non-digit key presses
                                                        if (!/[0-9]/.test(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={3}>
                                        <button style={{ marginTop: '36px', width: "140px" }} type="button" class="btn btn-success onHoverColor" onClick={UpdateJobOfferAmount}> <CheckCircleIcon /> Submit </button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    }
                    {/*  IF I'll not the Offers  */}
                    {
                        !showOther &&
                        <div className="col-sm-12">
                            <Form>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Date of Onboarding</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <FaRegClock />
                                                </InputGroup.Text>
                                                <Form.Control type="date" placeholder="Select a date" value={offerDate} onChange={(e) => {
                                                    setOfferDate(e.target.value)
                                                }} />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Contract End Date</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <FaRegClock />
                                                </InputGroup.Text>
                                                <Form.Control type="date" placeholder="Select a date" value={offerValidDate} onChange={(e) => {
                                                    setOfferValidDate(e.target.value)
                                                }} />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput1">
                                            <Form.Label>CTC Per annum</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <LiaRupeeSignSolid />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Please Enter the CTC"
                                                    value={offerCTC}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^\d*$/.test(value)) {
                                                            setOfferCTC(value); // Update only if the value contains digits only
                                                        }
                                                    }}
                                                    onKeyPress={(e) => {
                                                        // Prevent any non-digit key presses
                                                        if (!/[0-9]/.test(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                            <div className="text-center " onClick={UpdateJobOfferAmount}>
                                <button type="button" class="sitebtn mt-4 btn btn-primary ratebtn"> <CheckCircleIcon /> Submit </button>
                            </div>
                        </div>
                    }


                    {/* Choose Employee For Approval */}
                    {
                        showOther &&
                        <div className="col-sm-12">
                            <Row>
                                <Col sm={4}>
                                    <Select
                                        options={option}
                                        placeholder="Select Member"
                                        isSearchable
                                        value={selectedMember}
                                        onChange={handleChange}
                                        onInputChange={handleInputChange}
                                        onMenuOpen={handleMenuOpen}
                                        isLoading={pen}
                                        styles={customStyles}
                                    />
                                </Col>
                                <Col sm={4}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Priority"
                                        value={addPeriority}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            if (/^\d*$/.test(newValue)) {
                                                setAddPriority(newValue) // Parse or fallback to empty
                                            }
                                        }}
                                        className="form-control"
                                    />
                                </Col>
                                <Col sm={4}>
                                    <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput1">
                                        <button type="button" class="sitebtn btn btn-primary ratebtn" onClick={addMember}> <CheckCircleIcon /> Add Member </button>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>
                    }


                    {
                        showOther && (
                            <>
                                <div className="modaltbl mt-3">
                                    <Table hover>
                                        <thead>
                                            <tr>
                                                <th>Sno.</th>
                                                <th>Panel Member</th>
                                                <th>Priority</th>
                                                <th>Status</th>
                                                <th>Send Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                offerApproveMember && offerApproveMember?.length > 0 ?
                                                    offerApproveMember?.map((item, index) => {
                                                        return (
                                                            <tr key={item?.employee_doc_id}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    <div className='d-flex flex-column align-items-start gap-1'>
                                                                        <span>{item?.employee_code}</span>
                                                                        <span>{item?.name}</span>
                                                                        <span>{item?.designation}</span>
                                                                    </div>
                                                                </td>
                                                                <td width={'18%'}>
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={item?.priority}
                                                                        readOnly={(item?.status === "Approved" || item?.status === "Pending")}
                                                                        onChange={(e) => {
                                                                            const newValue = e.target.value;
                                                                            if (/^\d*$/.test(newValue)) {
                                                                                handlePriorityChange(index, parseInt(newValue, 10) || ""); // Parse or fallback to empty
                                                                            }
                                                                        }}
                                                                        className="form-control w-50"
                                                                    />
                                                                </td>
                                                                <td>{item?.status || "-"}</td>
                                                                <td>{item?.send_mail_date ? moment(item?.send_mail_date).format('DD/MM/YYYY') : 'N/A'}</td>
                                                                <td>
                                                                    <div className="d-flex gap-2">
                                                                        <span className="" style={{ height: '44px' }}>{getActionButtonByPriority(item)}</span>
                                                                        {
                                                                            item?.status === "" &&
                                                                            <OverlayTrigger
                                                                                placement="top" // Tooltip position: 'top', 'bottom', 'left', or 'right'
                                                                                overlay={
                                                                                    <Tooltip id={`tooltip-delete-${item.id || Math.random()}`}>
                                                                                        Delete Member
                                                                                    </Tooltip>
                                                                                }
                                                                            >
                                                                                <span onClick={() => handleRemove(item)} style={{ cursor: 'pointer' }}>
                                                                                    <CiCircleRemove size={25} color="red" />
                                                                                </span>
                                                                            </OverlayTrigger>
                                                                        }
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                    :
                                                    <tr className='text-center'>
                                                        <td colSpan={6} className='text-center'>No Record Found</td>
                                                    </tr>
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                                <div className="col-sm-12 text-center">
                                    <button style={{ marginTop: '36px' }} type="button" class="sitebtn btn btn-primary ratebtn" onClick={handleUpdateMember}> <CheckCircleIcon /> Update </button>
                                </div>
                            </>
                        )
                    }



                </Modal.Body>
            </Modal>

            <Modal
                show={openSendOfferExtendOffers}
                onHide={handleCloseSendOfferExtendOffer}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {extendOffer ? 'Extend Joining Date' : 'Send Offer'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4">
                    <div className="col-sm-12">
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Date of Onboarding</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FaRegClock />
                                            </InputGroup.Text>
                                            <Form.Control type="date" placeholder="Select a date" value={offerDate} onChange={(e) => {
                                                setOfferDate(e.target.value)
                                            }} />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3 custom-select" controlId="exampleForm.ControlSelect1">
                                        <Form.Label> Designation </Form.Label>
                                        <Form.Control
                                            type='text'
                                            value={offerDesignation}
                                            onChange={(e) => setOfferDesignation(e.target.value)}
                                            readOnly
                                        >
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput1">
                                        <Form.Label>CTC Per annum</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <LiaRupeeSignSolid />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Please Enter the CTC"
                                                value={offerCTC}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*$/.test(value)) {
                                                        setOfferCTC(value); // Update only if the value contains digits only
                                                    }
                                                }}
                                                onKeyPress={(e) => {
                                                    // Prevent any non-digit key presses
                                                    if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                readOnly
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                        <div className="text-center " onClick={handleSendOfferLatter}>
                            <button type="button" class="sitebtn mt-4 btn btn-primary ratebtn"> <CheckCircleIcon /> Submit </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

