import React, { useEffect, useState } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { Link } from 'react-router-dom';
import { FaInfoCircle } from "react-icons/fa";
import { useSelector } from 'react-redux';
import moment from 'moment';
import Dropdown from "react-bootstrap/Dropdown";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiFeedbackLine } from "react-icons/ri";
import { Button, InputGroup } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import Rating from 'react-rating';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { FaRegClock } from 'react-icons/fa';
import { GrSubtractCircle } from "react-icons/gr";
import { FaRegThumbsUp } from "react-icons/fa";
import axios from "axios";
import { apiHeaderToken } from "../../../config/api_header";
import { toast } from "react-toastify";
import config from "../../../config/config";
import { FetchAppliedCandidateDetails } from '../../slices/AppliedJobCandidates/JobAppliedCandidateSlice';
import { DeleteAndRemoved } from '../../slices/JobSortLIstedSlice/SortLIstedSlice';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaBriefcase, FaFileContract } from 'react-icons/fa';
import ConfirmationModal from './ConfirmationModel';
import { LiaRupeeSignSolid } from "react-icons/lia";
import CircularProgress from '@mui/material/CircularProgress';




export default function InterviewTable({ PageStatus, filterText }) {
    const [visible, setVisible] = useState(false);
    const AppliedJobs = useSelector((state) => state.appliedJobList.AppliedCandidate)
    const [show, setShow] = useState(false);
    const [skillRating, setSkillRating] = useState(0);
    const [commnicationRating, setCommnicatioRating] = useState(0);
    const [rating, setRating] = useState(0);
    const { id } = useParams();
    const dispatch = useDispatch();

    // handle recommendation models
    const [showRecommendation, setRecommendation] = useState(false);
    const [jobStatus, setJobStatus] = useState('');
    const [recommendation, CommentRecommendation] = useState('');

    // confirmation models
    const [confirm, setConfirm] = useState(false);
    const [option, setOption] = useState(null);

    // close the recommendation dropdown
    const handleRecommendationClose = () => setRecommendation(false);
    // handle close confirmation
    const handleConfirmClose = () => {
        setConfirm(false)
    };

    const handleSaveConfirmation = () => {
        
        if(option){
            let payloads = {
                "candidate_id": option?.candidateInfo.candidate_id,
                "applied_job_id": option?.candidateInfo.applied_job_id,
                "status": "Rejected"
            }
            dispatch(DeleteAndRemoved(payloads))
                .unwrap()
                .then((response) => {
                        dispatch(FetchAppliedCandidateDetails(id));
                        setConfirm(false)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    // console.log(AppliedJobs, 'this is applied job details');
    const [selectedData, setSelectedData] = useState(null);
    const [HoverId , setHover] = useState(1);
    const [comment, setComment] = useState('');
    const [date, setDate] = useState('');
    const [RecommendationData, SetRecommendationData] = useState(null);
    const [offerModel , setOfferModel] = useState(false);
    const [offerData , setOfferData] = useState(null);
    const [offerDate , setOfferDate] = useState(null);
    const [offerDesignation , setOfferDesignation] = useState('');
    const [offerCTC , setOfferCTC] = useState('');

    const [interviewId, setInterviewId] = useState('');
    const getUserDetails = JSON.parse(localStorage.getItem('admin_role_user')) ?? {};
    const rows = AppliedJobs.status === 'success' && AppliedJobs.data.length !== 0
        ? AppliedJobs.data
            .filter(value => value.form_status === PageStatus)  // Filter based on PageStatus
            .map((value, index) => ({
                id: index + 1,
                candidateInfo: {
                    name: value.name,
                    id: value._id,
                    status: value.applied_jobs[0]?.interviewer[0]?.status,
                    recommendation: value.applied_jobs[0]?.recommendation,
                    candidate_id: value._id,
                    applied_job_id: value.applied_jobs[0]?._id
                },
                value: value,
                interviewerInfo: {
                    interviewers: value.applied_jobs[0]?.interviewer[0]?.employee_name,
                },
                feedBack: {
                    data:[]
                },
                "Interview Date": moment(value.applied_jobs[0]?.interview_date).format("DD/MM/YYYY"),
                "Interviewer": value.applied_jobs[0]?.interviewer?.map((interviewer) => interviewer?.employee_name).join(', ').slice(0, 15) + "...." || [],
                "Round": value.applied_jobs[0]?.stage,
                "Rating": value.applied_jobs[0]?.interviewer[0]?.rating,
                "Notice Period": value.notice_period
            }))
        : [];

        console.log(rows , 'this is row Detials here to manges the detials ')
    const columns = [
        { field: "id", headerName: "Sno.", width: 50 },
        {
            field: "candidateName",
            headerName: "Candidate Name",
            width: 160,
            renderCell: (params) => (
                <Link to={`/candidate-profile/${params.row?.candidateInfo?.id}`}><p className="color-blue">{params.row?.candidateInfo?.name}</p></Link>
            ),
        },
        {
            field: "Interview Date",
            headerName: "Interview Date",
            width: 140,
        },
        {
            field: "Interviewer",
            headerName: "Interviewer(s)",
            width: 160,
        },
        {
            field: "Round",
            headerName: "Round",
            type: "number",
            width: 80,
        },
        {
            field: "Rating",
            headerName: "Rating",
            type: "number",
            width: 80,
        },
        {
            field: "Recommendation",
            headerName: "Recommendation",
            type: "number",
            width: 150,
            renderCell: (params) => (
                <div className="recomd_tag" style={{ cursor: 'pointer' }}>
                    <span className={`recomnded_tag ${(params.row?.candidateInfo?.recommendation) === 'Further Interview' ? 'bg_purple' : (params.row?.candidateInfo?.recommendation) === 'No Hire' ? 'bg_redlt' : 'bg_greenlt'}`}>{params.row?.candidateInfo?.recommendation === '' ? "No Comment added" : params.row?.candidateInfo?.recommendation}</span>
                </div>
            ),
        },
        {
            field: "Status",
            headerName: "Status",
            type: "number",
            width: 130,
            renderCell: (params) => (
                <span className={`${(params.row?.candidateInfo?.status) === 'Rejected' ? 'color-red' : ''}`}>
                    {params.row?.candidateInfo?.status}
                </span>
            ),
        },
        {
            field: "Feedback By",
            headerName: "Feedback By",
            type: "number",
            width: 180,
            renderCell: (params) => (
                <>
                    <div className="feedbackwrap">
                        <span>{params.row?.interviewerInfo?.interviewers}</span>
                        <span onMouseEnter={() => {
                            setVisible(true)
                            setHover(params.row?.id)
                        }} onMouseLeave={() => setVisible(false)}><FaInfoCircle /></span>
                    </div>
                    <div className="tooltip-containerr">
                        {(visible && (params.row?.id) === HoverId) &&
                            <div className="tooltipp">
                                {/* <p>{params.row?.interviewerInfo?.Interviewer_1 + params.row?.feedBack?.comment_1 + params.row?.interviewerInfo?.Interviewer_2 + params.row?.feedBack?.comment_2}</p> */}
                                <p>
                                    {/* <span>Arun: “Interpersonal skill are great. Technically sound.”</span>
                                    <span>Sameer: “Matching the skill sets we required. Considering for CEO round”</span> */}
                                    {
                                        params.row?.value?.applied_jobs[0]?.interviewer?.map((value) => {
                                            if(value?.feedback_status === 'Approved'){
                                                return (
                                                    <span>{value?.employee_name}: “{value?.comment}”</span>
                                                )
                                            }
                                            return null
                                        })
                                    }
                                </p>
                            </div>}
                    </div>
                </>
            ),
        },
        {
            width: 30,
            renderCell: (params) => (
                <div className="d-flex flex-column justify-content-end align-items-center">
                    <div className="h-100 buttnner">
                        <Dropdown className="tbl_dropdown">
                            <Dropdown.Toggle>
                                <BsThreeDotsVertical className="fs-5" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="py-2 min-widther mt-2">
                                <Dropdown.Item href={`/candidate-profile/${params.row?.candidateInfo?.id}`}>
                                    <div className="d-flex">
                                        <RiFeedbackLine />
                                        <span>Feedback</span>
                                    </div>
                                </Dropdown.Item>
                                <Dropdown.Item onClick={(e) => handleRecomtationModel(e, params.row)}> {/* Add handler for recommendation */}
                                    <div className="d-flex">
                                        <FaRegThumbsUp />  {/* Recommendation icon */}
                                        <span>Recommendation</span>
                                    </div>
                                </Dropdown.Item>
                                <Dropdown.Item onClick={(e) => handleShowOfferModel(e, params.row)}> {/* Add handler for recommendation */}
                                    <div className="d-flex">
                                        <FaFileContract />  {/* Recommendation icon */}
                                        <span>Offer</span>
                                    </div>
                                </Dropdown.Item>
                                <Dropdown.Item onClick={(e) => handleReject(e, params.row)}> {/* Add handler for recommendation */}
                                    <div className="d-flex">
                                        <GrSubtractCircle />  {/* Recommendation icon */}
                                        <span>Reject</span>
                                    </div>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            ),
        },
        // {
        //     field: "Action",
        //     headerName: "Action",
        //     type: "number",
        //     width: 130,
        //     renderCell: (params) => (
        //         <span className='offerbtn' onClick={handleShowOfferModel}>
        //             Send Offer
        //         </span>
        //     ),
        // },
    ];

    const handleFeedback = (e, data) => {
        e.preventDefault();
        setSelectedData(data);
        setShow(true);
    }

    const handleClose = () => setShow(false);

    // handle submit feedback data 
    const handleSubmitFeedBack = (e) => {
        e.preventDefault();
        let payloads = {
            "candidate_id": selectedData?.value?._id,
            "applied_job_id": selectedData?.value?.applied_jobs[0]?._id,
            "interviewer_id": interviewId,
            "comment": comment,
            "rating": rating,
            "communication": commnicationRating,
            "skills": skillRating,
            "feedback_date": date,
            "add_by": getUserDetails?.name
        }
        axios.post(`${config.API_URL}saveFeedback`, payloads, apiHeaderToken(config.API_TOKEN))
            .then((response) => {
                if (response.status === 200) {
                    handleClose()
                    setComment('');
                    setCommnicatioRating(0);
                    setDate('');
                    setRating(0);
                    return toast.success(response.data.message)
                }
            })
            .catch(err => {
                toast.error(err.response.data.message)
            })
    }

    const handleRecomtationModel = (e, data) => {
        e.preventDefault();
        setRecommendation(true)
        SetRecommendationData(data)
    }

    const handleReject = (e, data) => {
        setConfirm(true);
        e.preventDefault();
        setOption(data)
    }

    // handleSubmit recommendation
    const hanldeSubmitRecommendation = (e) => {
        e.preventDefault()
        let payloads = {
            "candidate_id": RecommendationData?.value?._id,
            "applied_job_id": RecommendationData?.value?.applied_jobs[0]?._id,
            "recommendation": recommendation,
            "interview_status": jobStatus
        }
        axios.post(`${config.API_URL}saveRecommendationStatus`, payloads, apiHeaderToken(config.API_TOKEN))
            .then((response) => {
                if (response.status === 200) {
                    toast.success(response.data.message);
                    setJobStatus('');
                    CommentRecommendation('')
                    handleRecommendationClose();
                    dispatch(FetchAppliedCandidateDetails(id));
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message)
            })
    }

    const filteredRows = rows.filter((row) =>
        row.candidateInfo?.name.toLowerCase().includes(filterText.toLowerCase())
    );

    // handle show the offer later models
    const handleShowOfferModel = (e , data) => {
        e.preventDefault();
        setOfferModel(true);
        setOfferData(data)
        setOfferDesignation(data?.value?.designation)
        setOfferCTC()
    }

    const handleCloseOfferModels = () => setOfferModel(false);

    const handleSendOfferLatter = () => {

        let payloads = {
            "candidate_id": offerData?.value?._id,
            "applied_job_id": offerData?.value?.applied_jobs[0]?._id,
            "onboard_date":offerDate,
            "offer_ctc":offerCTC
        }

        axios.post(`${config.API_URL}offerJob`, payloads, apiHeaderToken(config.API_TOKEN))
        .then((response) => {
            if (response.status === 200) {
                setOfferCTC('');
                setOfferDate(null);
                handleCloseOfferModels();
                dispatch(FetchAppliedCandidateDetails(id));
                return toast.success(response.data.message)
            }
        })
        .catch(err => {
            toast.error(err.response.data.message)
        })
    }

    return (
        <>
            <div className="w-100">
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    headerClassName="custom-header-class"
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[10, 20]}
                    checkboxSelection
                    components={{
                        NoRowsOverlay: () => (
                          <div style={{ padding: '10px' }}>
                            {AppliedJobs.status === 'loading' ? <CircularProgress /> : 'No rows'}
                          </div>
                        ),
                        LoadingOverlay: CircularProgress,
                    }}
                    loading={AppliedJobs.status === 'loading'}
                />
            </div>

            {/* add recomentation model */}
            <Modal
                show={showRecommendation}
                onHide={handleRecommendationClose}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Recommendation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4">
                    <div className="col-sm-12">
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3 ratetxtarea" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Add Recommendation</Form.Label>
                                        <Form.Control as="textarea" aria-label="With textarea" value={recommendation} onChange={(e) => {
                                            CommentRecommendation(e.target.value);
                                        }} placeholder="Enter Comment" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3 custom-select" controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Set Status</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={jobStatus}
                                            onChange={(e) => setJobStatus(e.target.value)}
                                            className="custom-select-class" // Add your custom class here
                                        >
                                            <option value="">Choose...</option>
                                            <option value={'Pending'}>Pending</option>
                                            <option value={'Confirmed'}>Confirmed</option>
                                            <option value={'Rejected'}>Rejected</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                        <div className="text-center " onClick={hanldeSubmitRecommendation}>
                            <button type="button" class="sitebtn mt-4 btn btn-primary ratebtn"> <CheckCircleIcon /> Submit </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* confirmation models */}
            <ConfirmationModal
                open={confirm}
                onClose={handleConfirmClose}
                onConfirm={handleSaveConfirmation}
                title="Reject Confirmation"
                content="Are you sure you want Reject this Candidate?"
            />

            {/* Offer models */}
            <Modal
                show={offerModel}
                onHide={handleCloseOfferModels}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Send Offer
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
                                            <Form.Control type="text" placeholder="Please choose the CTC" value={offerCTC} onChange={(e) => {
                                                const value = e.target.value;
                                                // Regular expression to match digits only
                                                const regex = /^\d*$/;
                                                // Check if the value matches the regular expression
                                                if (regex.test(value)) {
                                                  setOfferCTC(value);
                                                }
                                                // setOfferCTC(e.target.value)
                                            }} />
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
    )
}

