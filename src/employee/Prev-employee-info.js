import React, { useState } from 'react';
import Form from "react-bootstrap/Form";
import { CiCalendar } from "react-icons/ci";

function Prev_employee_info() {
    const [fileFields, setFileFields] = useState([{ id: 0, file: null }]);
    // Function to handle adding a new file input field
    const handleAddFileField = () => {
        setFileFields([...fileFields, { id: fileFields.length, file: null }]);
    };

    // Function to handle removing a file input field
    const handleRemoveFileField = (id) => {
        setFileFields(fileFields.filter((field) => field.id !== id));
    };

    return (
        <>
            {fileFields.map((field) => (
                <div className={`mb-4 certificationblock-${field.id}`} key={field.id}>

                    <div className="row mt-3 gy-3 align-items-end">
                        <div className="col-5">
                            <Form>
                                <Form.Group
                                    className="mb-4"
                                    controlId="exampleForm.ControlInput1"
                                >
                                    <Form.Label>
                                        Previous Employer Name
                                    </Form.Label>
                                    <div className="d-flex flex-row gap-5">
                                        <Form.Control
                                            type="text"
                                            placeholder="Abc Pvt. Ltd."
                                        />
                                    </div>
                                </Form.Group>
                                <Form.Group
                                    className="mt-1"
                                    controlId="exampleForm.ControlInput1"
                                >
                                    <Form.Label>
                                        From
                                    </Form.Label>
                                    <div className="datebox d-flex flex-row gap-5">
                                        <Form.Control type="date" placeholder="60.35" />
                                        <CiCalendar />
                                    </div>
                                </Form.Group>
                            </Form>
                        </div>
                        <div className="col-5">
                            <Form>
                                <Form.Group
                                    className="mb-4"
                                    controlId="exampleForm.ControlInput1"
                                >
                                    <Form.Label>
                                        Designation
                                    </Form.Label>
                                    <div className="d-flex flex-row gap-5">
                                        <Form.Control
                                            type="text"
                                            placeholder="Junior Engineer"
                                        />
                                    </div>
                                </Form.Group>
                                <Form.Group
                                    className="mt-1"
                                    controlId="exampleForm.ControlInput1"
                                >
                                    <Form.Label>
                                        To
                                    </Form.Label>
                                    <div className="datebox d-flex flex-row gap-2 ">
                                        <Form.Control type="date" />
                                        <CiCalendar />
                                    </div>
                                </Form.Group>
                            </Form>
                        </div>
                    </div>
                    <button className='subtbtn' type='button' onClick={() => handleRemoveFileField(field.id)}>-</button>
                </div>

            ))}
            <button className='addbtn' type='button' onClick={handleAddFileField}>+</button>

        </>
    );
}
export default Prev_employee_info;
