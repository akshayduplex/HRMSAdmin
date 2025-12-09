import React from "react";
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import StarRating from "./StartRating";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CiCalendar } from "react-icons/ci";

const RateModal = (props) => {
    return (
        <Modal
            {...props}
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
                                <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control type="date" placeholder="name@example.com" />
                                    <CiCalendar />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Rating</Form.Label>
                                    <StarRating />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3 ratetxtarea" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Additional Comment (if any)</Form.Label>
                                    <Form.Control as="textarea" aria-label="With textarea" placeholder="Enter Comment" />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                    <div className="text-center ">
                        <button type="button" class="sitebtn mt-4 btn btn-primary ratebtn"> <CheckCircleIcon/> Submit </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}


export default RateModal;
