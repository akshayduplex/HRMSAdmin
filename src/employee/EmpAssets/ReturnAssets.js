import React, { useEffect, useState } from 'react';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import { CiCalendar } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderTokenMultiPart } from '../../config/api_header';
import { fetchEmployeeAssetsRecords } from '../../features/slices/AssetsSlice/assets';
import { useDispatch } from 'react-redux';

const ReturnAssets = (props) => {
    const [images, setImages] = useState([]);
    const dispatch = useDispatch()
    const loginUsers = JSON.parse(localStorage.getItem('admin_role_user')) || {}
    const [loading , isLoading] = useState(false);




    const { asset , userData , onHide  }  = props

    console.log( asset , 'this is Records'  )

    const [returnAssets, setReturnAssets] = useState({
        assets_name: '',
        assets_serial_no: '',
        assets_return_status: '',
        return_date: null,
        return_condition_desc: ''
    });

    const handleReturnChanges = (obj) => {
        setReturnAssets((prev) => ({
            ...prev,
            ...obj,
        }));
    };

    useEffect(() => {
        if(asset){
            handleReturnChanges(
                {
                    assets_name: asset?.asset_name,
                    assets_serial_no:asset?.serial_no,
                }
            )
        }
    } , [asset])

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

    // Handle image deletion
    const handleDelete = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        URL.revokeObjectURL(images[index].url); // Revoke object URLs to avoid memory leaks
        setImages(updatedImages);
    };

    // Handle Return Assets submit
    const handleReturnSubmit = async () => {
        const { assets_name, assets_serial_no, assets_return_status, return_date, return_condition_desc } = returnAssets;
        // Validate fields
        if (!assets_name) return toast.warn("Please enter the asset name");
        if (!assets_serial_no) return toast.warn("Please enter the serial number");
        if (!assets_return_status) return toast.warn("Please select the return status");
        if (!return_date) return toast.warn("Please select the return date");
        if (!return_condition_desc) return toast.warn("Please describe the condition or fault");
        if (images.length === 0) return toast.warn("Please upload at least one image");


        // returnAssetFromEmployee
        // {"asset_id":"6757da503ac091e232e48174","assets_images":[],"return_date":"22-July-2024","return_condition":"Good condition","return_condition_status":"Good"}
        let formData = new FormData();
        formData.append("asset_id",asset?.asset_id)
        formData.append("return_date",return_date)
        formData.append("return_condition",return_condition_desc)
        formData.append("return_condition_status",assets_return_status)
        formData.append("return_requiest_by_name" , loginUsers?.name)
        formData.append("return_requiest_by_id" , loginUsers?._id)
        formData.append("return_requiest_by_designation" , loginUsers?.designation)
        formData.append("return_requiest_by_mobile_no" , loginUsers?.mobile_no)
        formData.append("return_requiest_by_email" , loginUsers?.email)
        images.forEach((item, index) => {
            formData.append(`assets_images`, item.file);
        });
        isLoading(true)
        try {
            let response = await axios.post(`${config.API_URL}returnAssetFromEmployee` , formData , apiHeaderTokenMultiPart(config.API_TOKEN));
            if(response.status === 200){
                toast.success(response.data?.message)
                isLoading(false)
                handleReturnChanges({
                    assets_name: '',
                    assets_type: '',
                    assets_seriol_no: '',
                    assets_image: [],
                    assets_return_status: '',
                    return_condition_desc: '',
                })
                let payload = {
                    "employee_doc_id": userData?._id,
                    "page_no": "1",
                    "per_page_record": "1000",
                    "filter_keyword": "",
                    "is_count": "no"
                }
                dispatch(fetchEmployeeAssetsRecords(payload))
                setImages([]);
                onHide();


            }else {
                toast.error(response.data?.message)
                isLoading(false)
            }
        } catch (error) {
            toast.error(error.response.data.message || error.message || "Someting Went Wrong");
            isLoading(false)
        }

    };

    return (
        <Modal {...props} size="lg" className="jobtemp_modal offermodal">
            <Modal.Header className="" closeButton>
                <Modal.Title>
                    <h4>Return Asset</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column gap-3">
                    <div className="row">
                        <Form.Group className="col-lg-6" controlId="">
                            <Form.Label>Asset Name</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    placeholder="Enter asset name"
                                    value={returnAssets.assets_name}
                                    readOnly
                                    onChange={(e) => handleReturnChanges({ assets_name: e.target.value })}
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="col-lg-6" controlId="">
                            <Form.Label>Device Serial Number*</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    placeholder="Enter serial number"
                                    value={returnAssets.assets_serial_no}
                                    readOnly
                                    onChange={(e) => handleReturnChanges({ assets_serial_no: e.target.value })}
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="col-lg-6 mt-4" controlId="exampleForm.ControlInput1">
                            <Form.Label>Return Status</Form.Label>
                            <Form.Select
                                value={returnAssets.assets_return_status}
                                onChange={(e) => handleReturnChanges({ assets_return_status: e.target.value })}
                            >
                                <option value="">Select Status</option>
                                <option value="Good">Good</option>
                                <option value="Minor Damage">Minor Damage</option>
                                <option value="Major Damage">Major Damage</option>
                                <option value="Faulty">Faulty</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="col-lg-6 mt-4 position-relative" controlId="formGridEmail">
                            <Form.Label>Return Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={returnAssets.return_date}
                                onChange={(e) => handleReturnChanges({ return_date: e.target.value })}
                            />
                            <CiCalendar />
                        </Form.Group>
                        <Form.Group controlId="formFile" className="col-lg-12 mt-4">
                            <Form.Label>Return Condition or Fault</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    className="textareaa"
                                    as="textarea"
                                    placeholder="Describe condition or fault"
                                    rows={4}
                                    value={returnAssets.return_condition_desc}
                                    onChange={(e) => handleReturnChanges({ return_condition_desc: e.target.value })}
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group controlId="formFile" className="col-lg-12 mt-4">
                            <Form.Label className="text-start w-100">
                                Return Condition Images <span>(jpg, png format)</span>
                            </Form.Label>
                            <div className="customfile_upload asstupload">
                                <input type="file" className="cstmfile" accept='.jpg,.jpeg,.png' multiple onChange={handleFileChange} />
                            </div>
                        </Form.Group>
                        <div className="assets_imgwrap">
                            {images.map((image, index) => (
                                <div key={index} style={{ position: "relative" }}>
                                    <img src={image.url} alt={`Preview ${index + 1}`} />
                                    <button onClick={() => handleDelete(index)} className="dlt_asstimg">
                                        <RiDeleteBin6Line />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="priew-submit btn-center">
                            <button className="submitbtn px-5" disabled={loading} onClick={handleReturnSubmit}>
                                <FaCheckCircle /> { loading ? 'Loading' : 'Submit' }
                            </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ReturnAssets;
