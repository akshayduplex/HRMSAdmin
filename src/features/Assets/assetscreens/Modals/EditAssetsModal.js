import React from 'react';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import { FaCheckCircle } from "react-icons/fa";

const EditAssetsModal = (props) => {

   
    return (
        <Modal {...props} size="lg" className="jobtemp_modal offermodal">
            <Modal.Header className="" closeButton>
                <Modal.Title>
                    <h4>Edit Asset</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column gap-3">
                    <div className="row">
                        <Form.Group className="col-lg-4" controlId="">
                            <Form.Label>
                                Asset Name
                            </Form.Label>
                            <InputGroup>
                                <Form.Control placeholder="Enter asset name" aria-describedby="" />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="col-lg-4" controlId="">
                            <Form.Label>
                                Device Serial Number*
                            </Form.Label>
                            <InputGroup>
                                <Form.Control placeholder="Enter serial number" aria-describedby="" />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="col-lg-4" controlId="exampleForm.ControlInput1" >
                            <Form.Label>Asset/Device Type </Form.Label>
                            <Form.Select aria-label="Default select example">
                                <option value="1">Engineering</option>
                                <option value="2">Management</option>
                            </Form.Select>
                        </Form.Group>                       
                    </div>
                    <div className="mt-4">
                        <div className="priew-submit btn-center">
                            <button className="submitbtn px-5">
                                <FaCheckCircle /> Submit
                            </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}
export default EditAssetsModal;
