import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { IoDocumentAttachOutline } from "react-icons/io5";
import FormGroup from "@mui/material/FormGroup";
import Verify_docs_modal from "./Verify-docs-modal";
import { FaRegCheckCircle } from "react-icons/fa";


export default function Contact_info() {
    const [show, setShow] = useState(false);
    // const handleClose = () => setShow(false);
   
    const handleShow = () => setShow(true);


    return (
        <>
            <div className=" mt-3 gy-3 align-items-end" data-aos="fade-in" data-aos-duration="3000">
                <Form>
                    <div className="row">
                        <Form.Group className="col-6 mb-4" controlId="exampleForm.ControlInput1">
                            <Form.Label> Residence No. </Form.Label>
                            <div className="d-flex flex-row gap-5">
                                <Form.Control type="text" placeholder="1/222" />
                            </div>
                        </Form.Group>
                        <Form.Group
                            className="col-6 mb-4"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>
                                Road / Street
                            </Form.Label>
                            <div className="d-flex flex-row gap-5">
                                <Form.Control
                                    type="text"
                                    placeholder="Mayur Vihar"
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="col-6 mb-4" controlId="exampleForm.ControlInput1">
                            <Form.Label> Locality / Area </Form.Label>
                            <div className="d-flex flex-row gap-5">
                                <Form.Control type="text" placeholder="Sector 62" />
                            </div>
                        </Form.Group>

                        <Form.Group
                            className="col-6 mb-4"
                            controlId="exampleForm.ControlInput13"
                        >
                            <Form.Label>
                                City / District
                            </Form.Label>
                            <div className="d-flex flex-row gap-5 text-start">
                                <Form.Select defaultValue="Choose...">
                                    <option>Lucknow</option>
                                    <option>Kanpur</option>
                                </Form.Select>
                            </div>
                        </Form.Group>
                        <Form.Group className="col-6 mb-4" controlId="exampleForm.ControlInput13">
                            <Form.Label> State </Form.Label>
                            <div className="d-flex flex-row gap-5 text-start">
                                <Form.Select defaultValue="Choose...">
                                    <option>Lucknow</option>
                                    <option>Kanpur</option>
                                </Form.Select>
                            </div>
                        </Form.Group>

                        <Form.Group
                            className="col-6 mb-4"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>
                                Pincode
                            </Form.Label>
                            <div className="d-flex flex-row gap-5">
                                <Form.Control type="text" placeholder="222222" />
                            </div>
                        </Form.Group>
                        <div className="col-12 mb-4">
                            <FormGroup>
                                <Form.Check
                                    type="checkbox"
                                    id="chk1"
                                    label="Use Present Address as Permanent Address"
                                />
                            </FormGroup>
                        </div>
                        <div className="col-12">
                            <div className="position-relative doc_attach_box">
                                <Form.Control type="text" className="w-100" placeholder="Document(s) Attached" disabled />
                                <div className="verfy_btnwrp">
                                    <div className="position-relative read-btn">
                                        {!show === true ? (
                                            <button type="button"
                                                className="border-0 rounded-2 px-3 position-relative py-2"
                                                onClick={handleShow}
                                            >
                                                Verify Documents
                                            </button>
                                        ) : (
                                            <button className="border-0 rounded-2 px-5 btn-success position-relative py-2">
                                                <div className="d-flex flex-row gap-1 align-items-center">
                                                    <FaRegCheckCircle />
                                                    Verified
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="docs_icon">
                                    <IoDocumentAttachOutline />
                                </div>
                            </div>
                        </div>
                    </div>

                </Form>
            </div>

            <Verify_docs_modal show={show} onHide={() => setShow(false)} />
        </>
    );
}
