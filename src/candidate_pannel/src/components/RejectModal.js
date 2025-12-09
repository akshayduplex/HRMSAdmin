import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import config from "../config/Config";
import { apiHeaderToken } from "../config/ApiHeaders";
import axios from "axios";


const RejectModal = (props) => {
    const [comment, setComment] = useState("");
    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            candidate_id: props?.rejectProp?.candidateId,
            applied_job_id: props?.rejectProp?.jobId,
            interviewer_id: props?.rejectProp?.interviewerId,
            status: "Reject",
            comment: comment
        };
        try {
            let response = await axios.post(`${config.API_URL}acceptRejectInterview`, payload, apiHeaderToken(config.API_TOKEN));
            console.log(response)
            props?.setModaltoast({
                status: true,
                message: response.data.message
            })
            setComment('')
            props?.onHide(true)
            props.handleSubmit()
            props?.setRejectProp({})
        } catch (error) {
            console.error(error);
            props?.setModaltoast({
                status: true,
                message: error?.response.data.message
            })
        }
    };

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Reject
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4">
                <div className="col-sm-12">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3 ratetxtarea" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Reason for rejection</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        aria-label="With textarea"
                                        placeholder="Enter Reason"
                                        value={comment}
                                        onChange={handleCommentChange}
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
                </div>
            </Modal.Body>

        </Modal>
    );
};

export default RejectModal;
