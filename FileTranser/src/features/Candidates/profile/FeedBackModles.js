import React, { useState } from "react";
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
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";





const FeedbackModels = ({show , onHide , selectedData}) => {
    const [skillRating , setSkillRating] = useState(0);
    const [rating , setRating] = useState(0);
    const [commnicationRating , setCommnicatioRating] = useState(0);
    const getUserDetails = JSON.parse(localStorage.getItem('admin_role_user')) ?? {};
    const { id } = useParams();
    const dispatch = useDispatch();

    const [interviewId , setInterviewId] = useState('');
    const [comment , setComment] = useState('');
    const [date ,setDate] = useState('');
    
    const handleSubmitFeedBack = (e) => {
        e.preventDefault();
        let payloads = {
            "candidate_id":selectedData && selectedData?._id,
            "applied_job_id":selectedData && selectedData?.applied_jobs[0]?._id,
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
                    onHide()
                    setComment('');
                    setCommnicatioRating(0);
                    setSkillRating(0);
                    setDate('');
                    setRating(0);
                    dispatch(FetchCandidatesListById(id))
                    return toast.success(response.data.message)
                }
            })
            .catch(err => {
                toast.error(err.response.data.message)
            })
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
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
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Skills</Form.Label>
                                    {/* <StarRating /> */}
                                    <Col>
                                        <Rating
                                            initialRating={skillRating}
                                            onChange={(rate) => setSkillRating(rate)}
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
                                    <Form.Label>Communication</Form.Label>
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
                                    <Form.Label>Rating</Form.Label>
                                    {/* <Rating /> */}
                                    <Col>
                                        <Rating
                                            initialRating={rating}
                                            onChange={(rate) => setRating(rate)}
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
                                <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Date</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <FaRegClock />
                                        </InputGroup.Text>
                                        <Form.Control type="date" placeholder="Select a date" value={date} onChange={(e) => {
                                            setDate(e.target.value);
                                        }} />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>
                        {/*  add the dropdown for user data  */}
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
                                        <option value="">Choose...</option>
                                        {
                                          selectedData &&  selectedData?.applied_jobs[0]?.interviewer.length !== 0 && selectedData?.applied_jobs[0]?.interviewer?.map((value, index) => {
                                                return (
                                                    <>
                                                        <option value={value?._id}>{value?.employee_name}.</option>
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
                                    <Form.Label>Additional Comment (if any)</Form.Label>
                                    <Form.Control as="textarea" aria-label="With textarea" value={comment} onChange={(e) => {
                                        setComment(e.target.value);
                                    }} placeholder="Enter Comment" />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                    <div className="text-center " onClick={handleSubmitFeedBack}>
                        <button type="button" class="sitebtn mt-4 btn btn-primary ratebtn"> <CheckCircleIcon /> Submit </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default FeedbackModels;




