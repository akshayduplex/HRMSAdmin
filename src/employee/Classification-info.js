import React from "react";
import Form from "react-bootstrap/Form";
import { CiCalendar } from "react-icons/ci";



export default function Classification_info() {

    return (
        <>
            <div className="mt-3 gy-3 align-items-end" data-aos="fade-in" data-aos-duration="3000">
                <Form>
                    <div className="row">
                        <Form.Group
                            className="mb-4 col-6"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>
                                Date of Joining
                            </Form.Label>
                            <div className="datebox d-flex flex-row gap-5">
                                <Form.Control
                                    type="date"
                                    placeholder="Abc Pvt. Ltd."
                                />
                                <CiCalendar />
                            </div>
                        </Form.Group>
                        <Form.Group
                            className="mb-4 col-6"
                            controlId="exampleForm.ControlInput14"
                        >
                            <Form.Label>
                                Probation Completion Date
                            </Form.Label>
                            <div className="datebox d-flex flex-row gap-5">
                                <Form.Control
                                    type="date"
                                    placeholder="Abc Pvt. Ltd."
                                />
                                <CiCalendar />
                            </div>
                        </Form.Group>
                        <Form.Group
                            className="mb-4 col-6"
                            controlId="exampleForm.ControlInput13"
                        >
                            <Form.Label>
                                Designation
                            </Form.Label>
                            <div className="d-flex flex-row gap-5">
                                <Form.Select defaultValue="Choose...">
                                    <option>Engineer</option>
                                    <option>Sr. Engineer</option>
                                </Form.Select>
                            </div>
                        </Form.Group>
                        <Form.Group
                            className="mb-4 col-6"
                            controlId="exampleForm.ControlInput13"
                        >
                            <Form.Label>
                                Branch
                            </Form.Label>
                            <div className="d-flex flex-row gap-5 text-start">
                                <Form.Select defaultValue="Choose...">
                                    <option>Gail - Odisha</option>
                                    <option>Bhel - Uttrakhand</option>
                                </Form.Select>
                            </div>
                        </Form.Group>
                        <Form.Group
                            className="mb-4 col-6"
                            controlId="exampleForm.ControlInput2"
                        >
                            <Form.Label>
                                Occupation
                            </Form.Label>
                            <div className="d-flex flex-row gap-5 text-start">
                                <Form.Select defaultValue="Choose...">
                                    <option>Engineer</option>
                                    <option>Sr. Engineer</option>
                                </Form.Select>
                            </div>
                        </Form.Group>
                        <Form.Group
                            className="mb-4 col-6"
                            controlId="exampleForm.ControlInput23"
                        >
                            <Form.Label>
                                Salary Structure
                            </Form.Label>
                            <div className="d-flex flex-row gap-5 text-start">

                                <Form.Select defaultValue="Choose...">
                                    <option>Salary Strc1</option>
                                    <option>Salary Strc2</option>
                                </Form.Select>
                            </div>
                        </Form.Group>
                        <Form.Group
                            className="mb-4 col-6"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>
                                Department
                            </Form.Label>
                            <div className="d-flex flex-row gap-5 text-start">
                                <Form.Select defaultValue="Choose...">
                                    <option>Engineer</option>
                                    <option>Sr. Engineer</option>
                                </Form.Select>
                            </div>
                        </Form.Group>
                        <Form.Group
                            className="mb-4 col-6"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>
                                Attendance
                            </Form.Label>
                            <div className="d-flex flex-row gap-5 text-start">
                                <Form.Select defaultValue="Choose...">
                                    <option>Attendance - Six days</option>
                                    <option>Attendance - Five days</option>
                                </Form.Select>
                            </div>
                        </Form.Group>
                        <Form.Group
                            className="mb-4 col-6"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>
                                Division
                            </Form.Label>
                            <div className="d-flex flex-row gap-5 text-start">
                                <Form.Select defaultValue="Choose...">
                                    <option>Engineer</option>
                                    <option>Sr. Engineer</option>
                                </Form.Select>
                            </div>
                        </Form.Group>

                        <Form.Group
                            className="mb-4 col-6"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>
                                Grade
                            </Form.Label>
                            <div className="d-flex flex-row gap-5 text-start">
                                <Form.Select defaultValue="Choose...">
                                    <option>NMG</option>
                                    <option>NMG2</option>
                                </Form.Select>
                            </div>
                        </Form.Group>
                    </div>
                </Form>
            </div>
        </>
    );
}
