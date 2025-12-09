import React, { useEffect, useState } from "react";
import { Button, InputGroup } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import Rating from 'react-rating';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { FaRegClock } from 'react-icons/fa';
import axios from "axios";
import { apiHeaderToken } from "../../../config/api_header";
import config from "../../../config/config";
import { toast } from "react-toastify";
import { FetchCandidatesListById } from "../../slices/AppliedJobCandidates/JobAppliedCandidateSlice";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import moment from "moment";


const FeedbackModels = ({ show, onHide, selectedData, interviewsDetails , isHod , fetchCandidateRecords}) => {
    const [skillRating, setSkillRating] = useState(0);
    const [rating, setRating] = useState(0);
    const [commnicationRating, setCommnicatioRating] = useState(0);
    const [JobMatch, setJobMatch] = useState(0);
    const [JobKnowleage, setJobKnowleage] = useState(0);
    const [creaTiveProbuls, setcreaTiveProbuls] = useState(0);
    const [teamPlayes, setteamPlayes] = useState(0);
    const [exposure, setexposure] = useState(0);
    const getUserDetails = JSON.parse(localStorage.getItem('admin_role_user')) ?? {};
    const { id } = useParams();
    const dispatch = useDispatch();
    const [interviewId, setInterviewId] = useState('');
    const [comment, setComment] = useState('');
    const [date, setDate] = useState('');
    const [searchParams] = useSearchParams()
    const jobId = searchParams.get('job_id')
    const [ratingOption, setRatingOption] = useState('');
    const [ratingPercentage, setRatingPercentage] = useState('');

    // Track if percentage was manually edited
    const [manuallyEdited, setManuallyEdited] = useState(false);

    // Track participation status
    const [isParticipated, setIsParticipated] = useState(true);

    // Calculate total percentage whenever ratings change
    useEffect(() => {
        // Only auto-calculate if not manually edited
        if (!manuallyEdited) {
            const totalPossiblePoints = 50; // Sum of max ratings (5+10+10+5+10+10)
            const currentTotal = JobMatch + JobKnowleage + creaTiveProbuls + teamPlayes + commnicationRating + exposure;
            const percentage = Math.round((currentTotal / totalPossiblePoints) * 100);
            setRatingPercentage(percentage.toString());
        }

        // Auto-select status based on percentage ranges
        const percent = Number(ratingPercentage);
        if (percent < 40) {
            setRatingOption('rejected');
        } else if (percent >= 40 && percent < 65) {
            setRatingOption('waitlisted');
        } else if (percent >= 65) {
            setRatingOption('suitable');
        }
    }, [JobMatch, JobKnowleage, creaTiveProbuls, teamPlayes, commnicationRating, exposure, manuallyEdited, ratingPercentage]);

    const resetForm = () => {
        setComment('');
        setCommnicatioRating(0);
        setSkillRating(0);
        setJobMatch(0);
        setJobKnowleage(0);
        setteamPlayes(0);
        setexposure(0);
        setcreaTiveProbuls(0);
        setDate(moment().format("YYYY-MM-DD")); // Reset to current date
        setRating(0);
        setRatingOption('');
        setRatingPercentage('');
        setManuallyEdited(false);
        setInterviewId(''); // Reset interviewer selection
        setIsParticipated(true); // Reset participation status
    };



    useEffect(() => {
        if (interviewsDetails) {
            setInterviewId(interviewsDetails?._id)
        }
    }, [interviewsDetails])


    useEffect(() => {
        if (show) {
            setDate(moment().format("YYYY-MM-DD"))
        }
    }, [show])

    const handleSubmitFeedBack = (e) => {
        e.preventDefault();

        // Basic validation
        if (!comment.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        if (isParticipated) {
            // Full feedback submission for participated candidates
            let payloads = {
                "candidate_id": (selectedData && selectedData?._id),
                "applied_job_id": selectedData && selectedData?.applied_jobs?.find((item) => item?.job_id === jobId || item?.job_id === selectedData?.job_id)?._id,
                "interviewer_id": interviewId,
                "comment": comment,
                "job_match": JobMatch,
                "job_knowledge": JobKnowleage,
                "creative_problem_solving": creaTiveProbuls,
                "team_player": teamPlayes,
                "communication_skill": commnicationRating,
                "exposure_to_job_profile": exposure,
                "hiring_suggestion_status": ratingOption,
                "hiring_suggestion_percent": ratingPercentage,
                "add_by_name": getUserDetails?.name,
                "add_by": getUserDetails?.name,
                "add_by_mobile": getUserDetails?.mobile_no,
                "add_by_designation": getUserDetails?.designation,
                "add_by_email": getUserDetails?.email,
                "feedback_date": date,
                "participated": true
            }
            axios.post(`${config.API_URL}saveFeedback`, payloads, apiHeaderToken(config.API_TOKEN))
                .then((response) => {
                    if (response.status === 200) {
                        onHide()
                        resetForm()
                        if(isHod){
                            fetchCandidateRecords()
                        }else{
                            dispatch(FetchCandidatesListById(id))
                        }
                        setIsParticipated(true)
                        return toast.success(response.data.message)
                    }
                })
                .catch(err => {
                    toast.error(err.response.data.message)
                })
        } else {
            // Simple feedback submission for non-participated candidates
            let payloads = {
                "candidate_id": (selectedData && selectedData?._id),
                "applied_job_id": selectedData && selectedData?.applied_jobs?.find((item) => item?.job_id === jobId || item?.job_id === selectedData?.job_id)?._id,
                "interviewer_id": interviewId,
                "comment": comment,
                "participated": false,
                "non_participation_reason": comment,
                "add_by": getUserDetails?.name,
                "add_by_name": getUserDetails?.name,
                "add_by_mobile": getUserDetails?.mobile_no,
                "add_by_designation": getUserDetails?.designation,
                "add_by_email": getUserDetails?.email,
                "feedback_date": date
            }
            

            axios.post(`${config.API_URL}saveSkippedInterviewCandidateFeedback`, payloads, apiHeaderToken(config.API_TOKEN))
                .then((response) => {
                    if (response.status === 200) {
                        onHide()
                        resetForm()
                        if(isHod){
                            fetchCandidateRecords()
                        }else{
                            dispatch(FetchCandidatesListById(id))
                        }
                        setIsParticipated(true)
                        return toast.success(response.data.message)
                    }
                })
                .catch(err => {
                    toast.error(err.response.data.message || err?.message)
            })
        }
    }

    return (
        <Modal
            show={show}
            onHide={() => {
                onHide();
                resetForm();
            }}
            onExit={resetForm}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Feedback
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4">

                <div className="col-sm-12">
                    <div className="row">
                        <div className="col-sm-12">
                            <Form.Group className="mb-3">
                                <Form.Label>Did the candidate participate in the interview?</Form.Label>
                                <div>
                                    <Form.Check
                                        inline
                                        type="radio"
                                        id="participated-yes"
                                        label="Yes"
                                        name="participation"
                                        value="yes"
                                        checked={isParticipated === true}
                                        onChange={() => setIsParticipated(true)}
                                    />
                                    <Form.Check
                                        inline
                                        type="radio"
                                        id="participated-no"
                                        label="No"
                                        name="participation"
                                        value="no"
                                        checked={isParticipated === false}
                                        onChange={() => setIsParticipated(false)}
                                    />
                                </div>
                            </Form.Group>
                        </div>
                    </div>
                    <Form>
                        {/* Interview selection - show for both participated and non-participated */}
                        {/* <Row>
                            <Col>
                                <Form.Group className="mb-3 custom-select" controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Select Interview</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={interviewId}
                                        onChange={(e) => setInterviewId(e.target.value)}
                                        className="custom-select-class"
                                    >
                                        <option value="">Select Interviewer</option>
                                        {
                                            selectedData && selectedData?.applied_jobs?.find((item) => item?.job_id === jobId || item?.job_id === selectedData?.job_id)?.interviewer.length !== 0 && selectedData?.applied_jobs?.find((item) => item?.job_id === jobId || item?.job_id === selectedData?.job_id)?.interviewer?.filter((inter) => inter?.feedback_status !== 'Approved')?.map((value, index) => {
                                                return (
                                                    <option key={value?._id} value={value?._id}>{value?.employee_name}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row> */}

                        {/* Show detailed rating form only if participated */}
                        {isParticipated ? (
                            <>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>Job Match</Form.Label>
                                            {/* <StarRating /> */}
                                            <Col>
                                                <Rating
                                                    initialRating={JobMatch}
                                                    onChange={(rate) => setJobMatch(rate)}
                                                    fractions={2} // Allows 0.5 increments
                                                    fullSymbol={<FaStar color="gold" size={24} />}
                                                    halfSymbol={<FaStarHalfAlt color="gold" size={24} />}
                                                    emptySymbol={<FaRegStar color="gold" size={24} />}
                                                    stop={5} // Maximum rating is 10
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>Job Knowledge</Form.Label>
                                            {/* <StarRating /> */}
                                            <Col>
                                                <Rating
                                                    initialRating={JobKnowleage}
                                                    onChange={(rate) => setJobKnowleage(rate)}
                                                    fractions={2} // Allows 0.5 increments
                                                    fullSymbol={<FaStar color="gold" size={24} />}
                                                    halfSymbol={<FaStarHalfAlt color="gold" size={24} />}
                                                    emptySymbol={<FaRegStar color="gold" size={24} />}
                                                    stop={10} // Maximum rating is 10
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>Creative Problem Solving Capacity</Form.Label>
                                            {/* <StarRating /> */}
                                            <Col>
                                                <Rating
                                                    initialRating={creaTiveProbuls}
                                                    onChange={(rate) => setcreaTiveProbuls(rate)}
                                                    fractions={2} // Allows 0.5 increments
                                                    fullSymbol={<FaStar color="gold" size={24} />}
                                                    halfSymbol={<FaStarHalfAlt color="gold" size={24} />}
                                                    emptySymbol={<FaRegStar color="gold" size={24} />}
                                                    stop={10} // Maximum rating is 10
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>Team Player</Form.Label>
                                            {/* <StarRating /> */}
                                            <Col>
                                                <Rating
                                                    initialRating={teamPlayes}
                                                    onChange={(rate) => setteamPlayes(rate)}
                                                    fractions={2} // Allows 0.5 increments
                                                    fullSymbol={<FaStar color="gold" size={24} />}
                                                    halfSymbol={<FaStarHalfAlt color="gold" size={24} />}
                                                    emptySymbol={<FaRegStar color="gold" size={24} />}
                                                    stop={5} // Maximum rating is 10
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>Communication Skill</Form.Label>
                                            {/* <StarRating /> */}
                                            <Col>
                                                <Rating
                                                    initialRating={commnicationRating}
                                                    onChange={(rate) => setCommnicatioRating(rate)}
                                                    fractions={2} // Allows 0.5 increments
                                                    fullSymbol={<FaStar color="gold" size={24} />}
                                                    halfSymbol={<FaStarHalfAlt color="gold" size={24} />}
                                                    emptySymbol={<FaRegStar color="gold" size={24} />}
                                                    stop={10} // Maximum rating is 10
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>Exposure To Job Profile </Form.Label>
                                            {/* <StarRating /> */}
                                            <Col>
                                                <Rating
                                                    initialRating={exposure}
                                                    onChange={(rate) => setexposure(rate)}
                                                    fractions={2} // Allows 0.5 increments
                                                    fullSymbol={<FaStar color="gold" size={24} />}
                                                    halfSymbol={<FaStarHalfAlt color="gold" size={24} />}
                                                    emptySymbol={<FaRegStar color="gold" size={24} />}
                                                    stop={10} // Maximum rating is 10
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Date</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <FaRegClock />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="date"
                                                    placeholder="Select a date"
                                                    value={date}
                                                    onChange={(e) => {
                                                        setDate(e.target.value);
                                                    }} />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3 custom-select" controlId="exampleForm.ControlSelect1">
                                            <Form.Label>Select Interviews</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={interviewId}
                                                onChange={(e) => setInterviewId(e.target.value)}
                                                className="custom-select-class" // Add your custom class here
                                            >
                                                {
                                                    selectedData && selectedData?.applied_jobs?.find((item) => item?.job_id === jobId || item?.job_id === selectedData?.job_id)?.interviewer.length !== 0 && selectedData?.applied_jobs?.find((item) => item?.job_id === jobId || item?.job_id === selectedData?.job_id)?.interviewer?.filter((inter) => inter?.feedback_status !== 'Approved')?.map((value, index) => {
                                                        return (
                                                            <>
                                                                <option value={value?._id}>{value?.employee_name}</option>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Rating Options */}
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="ratingOption">
                                            <Form.Label>Hiring Suggestion</Form.Label>
                                            {/* <div className="text-muted mb-2" style={{fontSize: '0.8rem'}}>
                                        Auto-selected based on percentage: 
                                        <br/>
                                        Below 40% → Rejected | 40-64% → Waitlisted | 65% or above → Suitable
                                    </div> */}
                                            <div>
                                                {/* Always show all options */}
                                                <Form.Check
                                                    inline
                                                    type="radio"
                                                    label="Rejected"
                                                    name="ratingOption"
                                                    value="rejected"
                                                    checked={ratingOption === 'rejected'}
                                                    onChange={(e) => {
                                                        setRatingOption(e.target.value);
                                                    }}
                                                />
                                                <Form.Check
                                                    inline
                                                    type="radio"
                                                    label="Waitlisted"
                                                    name="ratingOption"
                                                    value="waitlisted"
                                                    checked={ratingOption === 'waitlisted'}
                                                    onChange={(e) => {
                                                        setRatingOption(e.target.value);
                                                    }}
                                                />
                                                <Form.Check
                                                    inline
                                                    type="radio"
                                                    label="Suitable"
                                                    name="ratingOption"
                                                    value="suitable"
                                                    checked={ratingOption === 'suitable'}
                                                    onChange={(e) => {
                                                        setRatingOption(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Conditional Rating Percentage Input */}
                                {(
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="ratingPercentage">
                                                {/* <Form.Label>
                                            Rating Percentage 
                                            {ratingOption === 'suitable' && ' (> 70%)'}
                                            {ratingOption === 'waitlisted' && ' (55% - 70%)'}
                                        </.Label> */}
                                                <InputGroup>
                                                    <Form.Control
                                                        type="text"
                                                        min="0"
                                                        max="100"
                                                        placeholder={
                                                            ratingOption === 'suitable'
                                                                ? "Enter percentage (e.g., 75)"
                                                                : "Enter percentage (e.g., 60)"
                                                        }
                                                        value={ratingPercentage}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            // Allow only digits (no letters, symbols, etc.)
                                                            if (/^\d*$/.test(value)) {
                                                                const num = Number(value);
                                                                // Allow empty string or 0-100 range
                                                                if (value === '' || (num >= 0 && num <= 100)) {
                                                                    setRatingPercentage(value);
                                                                    setManuallyEdited(true); // Mark as manually edited
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <InputGroup.Text>%</InputGroup.Text>
                                                    {/* {manuallyEdited && (
                                                <Button 
                                                    variant="outline-secondary"
                                                    onClick={() => {
                                                        const totalPossiblePoints = 50;
                                                        const currentTotal = JobMatch + JobKnowleage + creaTiveProbuls + teamPlayes + commnicationRating + exposure;
                                                        const percentage = Math.round((currentTotal / totalPossiblePoints) * 100);
                                                        setRatingPercentage(percentage.toString());
                                                        setManuallyEdited(false);
                                                    }}
                                                >
                                                    Reset
                                                </Button>
                                            )} */}
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                )}

                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3 ratetxtarea" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Additional Comment (if any)</Form.Label>
                                            <Form.Control as="textarea" aria-label="With textarea" value={comment} onChange={(e) => {
                                                setComment(e.target.value);
                                            }} placeholder="Enter Comment" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </>
                        ) : (
                            /* Show simple comment form when not participated */
                            <>

                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3 custom-select" controlId="exampleForm.ControlSelect1">
                                            <Form.Label>Select Interviews</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={interviewId}
                                                onChange={(e) => setInterviewId(e.target.value)}
                                                className="custom-select-class" // Add your custom class here
                                            >
                                                {
                                                    selectedData && selectedData?.applied_jobs?.find((item) => item?.job_id === jobId || item?.job_id === selectedData?.job_id)?.interviewer.length !== 0 && selectedData?.applied_jobs?.find((item) => item?.job_id === jobId || item?.job_id === selectedData?.job_id)?.interviewer?.filter((inter) => inter?.feedback_status !== 'Approved')?.map((value, index) => {
                                                        return (
                                                            <>
                                                                <option value={value?._id}>{value?.employee_name}</option>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3 ratetxtarea" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Comment</Form.Label>
                                            <Form.Control as="textarea" aria-label="With textarea" value={comment} onChange={(e) => {
                                                setComment(e.target.value);
                                            }} placeholder="Enter reason for not participating" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </>
                        )}

                    </Form>
                    <div className="text-center relative">
                        <button type="button" className="sitebtn mt-4 btn btn-primary ratebtn absolute" onClick={handleSubmitFeedBack}>
                            <CheckCircleIcon /> Submit
                        </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default FeedbackModels;




