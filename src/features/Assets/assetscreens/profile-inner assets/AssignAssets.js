import React, { useState } from 'react';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import { CiCalendar } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";

const ViewAssigned = (props) => {

    const [images, setImages] = useState([]);
    const [images1, setImages1] = useState([]);

    // Handle file selection
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);

        // Create preview URLs for each selected image
        const previewImages = selectedFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        setImages((prevImages) => [...prevImages, ...previewImages]);
    };

    // Handle file selection
    const handleFileChange1 = (event) => {
        const selectedFiles = Array.from(event.target.files);

        // Create preview URLs for each selected image
        const previewImages1 = selectedFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        setImages1((prevImages1) => [...prevImages1, ...previewImages1]);
    };

    // Handle image deletion
    const handleDelete = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);

        // Revoke object URLs to avoid memory leaks
        URL.revokeObjectURL(images[index].url);

        setImages(updatedImages);
    };


    // Handle image deletion
    const handleDelete1 = (index1) => {
        const updatedImages1 = images.filter((_, i) => i !== index1);

        // Revoke object URLs to avoid memory leaks
        URL.revokeObjectURL(images[index1].url);

        setImages1(updatedImages1);
    };

    return (
        <Modal {...props} size="lg" className="jobtemp_modal offermodal">
            <Modal.Header className="" closeButton>
                <Modal.Title>
                    <h4>Assign Asset</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column gap-3">
                    <div className="row">
                        <Form.Group className="col-lg-6" controlId="">
                            <Form.Label>
                                Asset Name
                            </Form.Label>
                            <InputGroup>
                                <Form.Control placeholder="Enter asset name" aria-describedby="" />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="col-lg-6" controlId="">
                            <Form.Label>
                                Device Serial Number*
                            </Form.Label>
                            <InputGroup>
                                <Form.Control placeholder="Enter serial number" aria-describedby="" />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="col-lg-6 mt-4" controlId="exampleForm.ControlInput1" >
                            <Form.Label>Asset/Device Type </Form.Label>
                            <Form.Select aria-label="Default select example">
                                <option value="1">Engineering</option>
                                <option value="2">Management</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="col-lg-6 mt-4 position-relative" controlId="formGridEmail">
                            <Form.Label>Assign Date</Form.Label>
                            <Form.Control type="date" placeholder="dd/mm/yyyy" />
                            <CiCalendar />
                        </Form.Group>
                        <Form.Group controlId="formFile" className="col-lg-12 mt-4">
                            <Form.Label className="text-start w-100">
                                Upload Asset Images <span>(jpg, png format)</span>
                            </Form.Label>
                            <div className="customfile_upload asstupload">
                                <input type="file" className="cstmfile" multiple onChange={handleFileChange} />
                            </div>
                        </Form.Group>


                        <div className='assets_imgwrap'>
                            {images.map((image, index) => (
                                <div key={index} style={{ position: "relative" }}>
                                    <img src={image.url} alt={`Preview ${index + 1}`} />
                                    <button onClick={() => handleDelete(index)} className='dlt_asstimg'> <RiDeleteBin6Line /> </button>
                                </div>
                            ))}
                        </div>


                        <Form.Group controlId="formFile" className="col-lg-12 mt-4">
                            <Form.Label className="text-start w-100">
                                Upload Signed Declaration Form <span>(docx, pdf format)</span>
                            </Form.Label>
                            <div className="customfile_upload asstupload">
                                <input type="file" className="cstmfile" onChange={handleFileChange1} />
                            </div>
                        </Form.Group>
                        <div className='assets_imgwrap'>
                            {images1.map((image1, index1) => (
                                <div key={index1} style={{ position: "relative" }}>
                                    <img src={image1.url} alt={`Preview ${index1 + 1}`} />
                                    <button onClick={() => handleDelete1(index1)} className='dlt_asstimg'> <RiDeleteBin6Line /> </button>
                                </div>
                            ))}
                        </div>
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
export default ViewAssigned;
