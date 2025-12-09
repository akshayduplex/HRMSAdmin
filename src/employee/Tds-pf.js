import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { CiCalendar } from "react-icons/ci";


export default function Tds_info() {
    const [field, setField] = useState();

    const handleChange = (event) => {
        setField(event.target.value);
    };

    return (
        <>
            <div className="row mt-3 gy-3 align-items-end" data-aos="fade-in" data-aos-duration="3000">
                <div className="col-6 ">
                    <Form>
                        <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>
                                ESI Number
                            </Form.Label>
                            <div className="d-flex flex-row gap-5">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter ESI number"
                                />
                            </div>
                        </Form.Group>
                        <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>
                                PF Number
                            </Form.Label>
                            <div className="d-flex flex-row gap-5">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter PF number"
                                />
                            </div>
                        </Form.Group>
                        <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>
                                PF Effective from
                            </Form.Label>
                            <div className="datebox d-flex flex-row gap-5">
                                <Form.Control
                                    type="date"
                                    placeholder="Enter PF number"
                                />
                                <CiCalendar />
                            </div>
                        </Form.Group>

                        <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>
                                TDS Detail (Pan Number)
                            </Form.Label>
                            <div className="d-flex flex-row gap-5">
                                <Form.Control
                                    type="text"
                                    placeholder="BTEEK556728"
                                />
                            </div>
                        </Form.Group>
                        <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput13"
                        >
                            <Form.Label>
                                Bank Branch
                            </Form.Label>
                            <div className="d-flex flex-row gap-5 text-start">
                                <Form.Select defaultValue="Choose...">
                                    <option>Lucknow</option>
                                    <option>Kanpur</option>
                                </Form.Select>
                            </div>
                        </Form.Group>
                    </Form>
                </div>
                <div className="col-6 ">
                    <Form>
                        <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput13"
                        >
                            <Form.Label>
                                ESI Dispensary
                            </Form.Label>
                            <div className="d-flex flex-row gap-5 text-start">
                                <Form.Select defaultValue="Choose...">
                                    <option>Lucknow</option>
                                    <option>Kanpur</option>
                                </Form.Select>
                            </div>
                        </Form.Group>
                        <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>
                                PF number Dept. File
                            </Form.Label>
                            <div className="d-flex flex-row gap-5">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter PF Dept. number"
                                />
                            </div>
                        </Form.Group>
                        <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>
                                UAN number
                            </Form.Label>
                            <div className="d-flex flex-row gap-5">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter UAN number"
                                />
                            </div>
                        </Form.Group>
                        <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>
                                Bank Account number
                            </Form.Label>
                            <div className="d-flex flex-row gap-5">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Bank Account number"
                                />
                            </div>
                        </Form.Group>
                        <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>
                                IFSC Code
                            </Form.Label>
                            <div className="d-flex flex-row gap-5">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter IFSC Code"
                                />
                            </div>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        </>
    );
}
