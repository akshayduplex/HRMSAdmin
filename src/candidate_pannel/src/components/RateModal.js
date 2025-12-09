import React, { useState, useEffect } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import config from '../../../src/config/config';
import { apiHeaderToken } from '../config/ApiHeaders';
import axios from 'axios';
import { Modal, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import Rating from 'react-rating';
import { FaRegClock } from 'react-icons/fa6';
import moment from 'moment';
import config from '../config/Config';

const RateModal = (props) => {
  const [date, setDate] = useState('');
  const [comment, setComment] = useState('');
  const [commnicationRating, setCommnicatioRating] = useState(0);
  const [JobMatch, setJobMatch] = useState(0);
  const [JobKnowleage, setJobKnowleage] = useState(0);
  const [creaTiveProbuls, setcreaTiveProbuls] = useState(0);
  const [teamPlayes, setteamPlayes] = useState(0);
  const [exposure, setexposure] = useState(0);
  const [ratingOption, setRatingOption] = useState('');
  const [ratingPercentage, setRatingPercentage] = useState('');
  const [manuallyEdited, setManuallyEdited] = useState(false);

  // Reset form function to clear all fields
  const resetForm = () => {
    setComment('');
    setCommnicatioRating(0);
    setJobMatch(0);
    setJobKnowleage(0);
    setteamPlayes(0);
    setexposure(0);
    setcreaTiveProbuls(0);
    setDate('');
    setRatingOption('');
    setRatingPercentage('');
    setManuallyEdited(false);
  };

  const handleSubmitFeedBack = async (e) => {
    e.preventDefault();
    const payload = {
      candidate_id: props?.rateProp?.candidateId,
      applied_job_id: props?.rateProp?.jobId,
      interviewer_id: props?.rateProp?.interviewerId,
      comment: comment,
      feedback_date: date,
      job_match: JobMatch,
      job_knowledge: JobKnowleage,
      creative_problem_solving: creaTiveProbuls,
      team_player: teamPlayes,
      communication_skill: commnicationRating,
      exposure_to_job_profile: exposure,
      hiring_suggestion_status: ratingOption,
      hiring_suggestion_percent: ratingPercentage,
    };

    // let payloads = {
    //         "candidate_id": (selectedData && selectedData?._id),
    //         "applied_job_id": selectedData && selectedData?.applied_jobs?.find((item) => item?.job_id === jobId  || item?.job_id === selectedData?.job_id)?._id,
    //         "interviewer_id": interviewId,
    //         "comment": comment,
    //         "job_match": JobMatch,
    //         "job_knowledge": JobKnowleage,
    //         "creative_problem_solving": creaTiveProbuls,
    //         "team_player": teamPlayes,
    //         "communication_skill": commnicationRating,
    //         "exposure_to_job_profile": exposure,
    //         "add_by": getUserDetails?.name,
    //         "feedback_date": date
    // }

    try {
      const response = await axios.post(`${config.API_URL}saveFeedback`, payload, apiHeaderToken(config.API_TOKEN));
      console.log(response);
      props?.setModaltoast({
        status: true,
        message: response.data.message
      });
      // Reset the form fields after successful submission
      setComment('');
      setCommnicatioRating(0);
      setJobMatch(0);
      setJobKnowleage(0);
      setteamPlayes(0);
      setexposure(0);
      setcreaTiveProbuls(0);
      setDate('');
      setRatingOption('');
      setRatingPercentage('');
      props.onHide();
    } catch (error) {
      console.error(error);
      props?.setModaltoast({
        status: false,
        message: 'An error occurred while submitting feedback. Please try again.'
      });
    }
  };

  // Add useEffect for percentage calculation
  useEffect(() => {
    if (!manuallyEdited) {
        const totalPossiblePoints = 50; // Max possible points (5+10+10+5+10+10)
        const currentTotal = JobMatch + JobKnowleage + creaTiveProbuls + teamPlayes + commnicationRating + exposure;
        const percentage = Math.round((currentTotal / totalPossiblePoints) * 100);
        setRatingPercentage(percentage.toString());
        
        // Auto-select based on percentage
        if (percentage < 40) {
            setRatingOption('rejected');
        } else if (percentage >= 40 && percentage < 65) {
            setRatingOption('waitlisted');
        } else if (percentage >= 65) {
            setRatingOption('suitable');
        }
    }
}, [JobMatch, JobKnowleage, creaTiveProbuls, teamPlayes, commnicationRating, exposure, manuallyEdited]);

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={() => {
        resetForm();
        props.onHide();
      }}
      onExit={resetForm}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Feedback
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-4">
        {/* <div className="col-sm-12">
          <Form onSubmit={handleSubmitFeedBack}>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formSkills">
                  <Form.Label>Skills</Form.Label>
                  <Col>
                  <Rating
                    initialRating={skill}
                    value={skill}
                    onChange={setSkill}
                    fractions={2}
                    fullSymbol={<FaStar color="gold" size={24} />}
                    halfSymbol={<FaStarHalfAlt color="gold" size={24} />}
                    emptySymbol={<FaRegStar color="gold" size={24} />}
                    stop={10}
                  />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formCommunication">
                  <Form.Label>Communication</Form.Label>
                  <Col>
                  <Rating
                    initialRating={communication}
                    value={communication}
                    onChange={setCommunication}
                    fractions={2}
                    fullSymbol={<FaStar color="gold" size={24} />}
                    halfSymbol={<FaStarHalfAlt color="gold" size={24} />}
                    emptySymbol={<FaRegStar color="gold" size={24} />}
                    stop={10}
                  />
                   </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formRating">
                  <Form.Label>Rating</Form.Label>
                  <Col>
                  <Rating
                    initialRating={rating}
                    value={rating}
                    onChange={setRating}
                    fractions={2}
                    fullSymbol={<FaStar color="gold" size={24} />}
                    halfSymbol={<FaStarHalfAlt color="gold" size={24} />}
                    emptySymbol={<FaRegStar color="gold" size={24} />}
                    stop={5}
                  />
                   </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3 position-relative" controlId="formDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3 ratetxtarea" controlId="formComment">
                  <Form.Label>Additional Comment (if any)</Form.Label>
                  <Form.Control
                    as="textarea"
                    aria-label="With textarea"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter Comment"
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="text-center">
              <button type="submit" className="sitebtn mt-4 btn btn-primary ratebtn">
                <CheckCircleIcon /> Submit
              </button>
            </div>
          </Form>
        </div> */}

        <div className="col-sm-12">
          <Form>
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
                <Form.Group className="mb-3" controlId="ratingOption">
                  <Form.Label>Hiring Suggestion</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Rejected"
                      name="ratingOption"
                      value="rejected"setRatingOption
                      checked={ratingOption === 'rejected'}
                      onChange={(e) => {
                        setManuallyEdited(true);
                        setRatingOption(e.target.value);
                        // Set corresponding percentage based on selection
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
                        setManuallyEdited(true);
                        setRatingOption(e.target.value);
                        // Set corresponding percentage based on selection
                        // setRatingPercentage('70'); // Above 65% for suitable
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
                        setManuallyEdited(true);
                        setRatingOption(e.target.value);
                        // Set corresponding percentage based on selection
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
                    <InputGroup>
                      <Form.Control
                        type="number"
                        min="0"
                        max="100"
                        value={ratingPercentage}
                        onChange={(e) => {
                            setManuallyEdited(true);
                            const value = e.target.value;
                            if (value === '' || (value >= 0 && value <= 100)) {
                                setRatingPercentage(value);
                                const percent = Number(value);
                                if (percent < 40) {
                                    setRatingOption('rejected');
                                } else if (percent >= 40 && percent < 65) {
                                    setRatingOption('waitlisted');
                                } else if (percent >= 65) {
                                    setRatingOption('suitable');
                                }
                            }
                        }}
                        placeholder="Enter percentage (0-100)"
                      />
                      <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
            )}
            {/*  add the dropdown for user data  */}
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
          <div className="text-center relative" onClick={handleSubmitFeedBack}>
            <button type="button" class="sitebtn mt-4 btn btn-primary ratebtn"> <CheckCircleIcon /> Submit </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RateModal;
