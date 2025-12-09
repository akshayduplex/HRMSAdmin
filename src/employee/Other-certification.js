import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

function Certification_info() {
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
                <div className={`row mb-4 certificationblock-${field.id}`} key={field.id}>
                    <div className="col-5">
                            <Form.Group
                                className=""
                                controlId="exampleForm.ControlInput1"
                            >
                                <Form.Label>
                                    Certification Name
                                </Form.Label>
                                <div className="d-flex flex-row gap-5">
                                    <Form.Control
                                        type="text"
                                        placeholder="Excel Certification"
                                    />
                                </div>
                            </Form.Group>
                    </div>
                    <div className="col-5">
                        <div className="d-flex flex-row gap-4 align-items-end">
                            <div>
                                <Form.Label>
                                    Grade
                                </Form.Label>
                                <Form.Control type="text" placeholder="70.12" />
                            </div>
                            <div>
                                <Form.Label>
                                    Year
                                </Form.Label>
                                <Form.Control type="text" placeholder="2022" />
                            </div>
                        </div>
                    </div>
                        <button className='subtbtn' type='button' onClick={() => handleRemoveFileField(field.id)}>-</button>
                </div>

            ))}
                <button className='addbtn' type='button' onClick={handleAddFileField}>+</button>
        </>
    );
}


export default Certification_info;

