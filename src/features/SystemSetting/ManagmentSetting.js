import React, { useState, useEffect } from "react";
import { Button, Col, Row, Form, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken, apiHeaderTokenMultiPart } from "../../config/api_header";
import TypeSuggestionSelectDesignation from "./DesignationFreeSolo";
import { useDropzone } from "react-dropzone";



const ManagmentSetting = ({ settingData, fetchCandidateDetails }) => {

    const [logoFile, setLogoFile] = useState(null);

    const [inputState, setInputState] = useState({
        ceo_email_id: '',
        default_hr_name: '',
        default_hr_mobile_no: '',
        default_hr_designation: '',
        default_hr_email_id: '',
        ceo_name: '',
        filename: null,
        old_ceo_digital_signature: null,
        hiring_approval_hr_email_id: ''
    })

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (settingData) {
            handleInputChange(
                {
                    ceo_email_id: settingData?.ceo_email_id,
                    default_hr_name: settingData?.default_hr_details?.name,
                    default_hr_mobile_no: settingData?.default_hr_details?.mobile_no,
                    default_hr_designation: settingData?.default_hr_details?.designation,
                    default_hr_email_id: settingData?.default_hr_details.email_id,
                    ceo_name: settingData?.ceo_name,
                    old_ceo_digital_signature: settingData?.ceo_digital_signature,
                    hiring_approval_hr_email_id: settingData?.hiring_approval_hr_email_id
                }
            )
        }
    }, [settingData])

    const handleInputChange = (obj) => {
        setInputState((prev) => (
            {
                ...prev,
                ...obj
            }
        ))
    }

    const UpdateAddress = (event) => {
        event.preventDefault();
        if (!inputState.ceo_email_id) {
            return toast.warn('Please Enter CEO Email Id')
        }
        if (!inputState.default_hr_name) {
            return toast.warn('Please Enter HR Name')
        }
        if (!inputState.default_hr_mobile_no) {
            return toast.warn('Please Enter HR Mobile Number')
        }
        if (!inputState.default_hr_designation) {
            return toast.warn('Please Enter HR  Designation')
        }
        if (!inputState.default_hr_email_id) {
            return toast.warn('Please Enter HR  Email Id')
        }
        setLoading(true);
        const convertToFormData = (payload) => {
            const formData = new FormData();

            // Iterate through the payload object and append each key-value pair to the FormData object
            Object.keys(payload).forEach((key) => {
                formData.append(key, payload[key]);
            });

            return formData;
        };

        // Example usage:
        const Payloads = {
            ceo_email_id: inputState.ceo_email_id,
            default_hr_name: inputState.default_hr_name,
            default_hr_mobile_no: inputState.default_hr_mobile_no,
            default_hr_designation: inputState.default_hr_designation,
            default_hr_email_id: inputState.default_hr_email_id,
            ceo_name: inputState.ceo_name,
            filename: logoFile,
            hiring_approval_hr_email_id: inputState.hiring_approval_hr_email_id
        };

        const formData = convertToFormData(Payloads);


        axios.post(`${config.API_URL}addHrWebSettingData`, formData, apiHeaderTokenMultiPart(config.API_TOKEN))
            .then((res) => {
                if (res.status === 200) {
                    toast.success(res.data?.message)
                } else {
                    toast.error(res.data?.message)
                }
                setLoading(false)
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message || 'Something Went Wrong')
                setLoading(false)
            })
    }

    const onDropLogo = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setLogoFile(file);
    };

    const { getRootProps: getLogoRootProps, getInputProps: getLogoInputProps, isDragActive: isLogoActive } = useDropzone({
        onDrop: onDropLogo,
        accept: {
            "image/png": [],
            "image/jpeg": [],
            "image/jpg": [],
            "image/webp": [],
        },
        maxFiles: 1,
    });



    return (
        <>
            <Col className="p-3">
                <Form>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="address">
                                <Form.Label>CEO Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder="CEO Email ID"
                                    autoComplete="off"
                                    value={inputState?.ceo_name}
                                    onChange={(e) => handleInputChange({ ceo_name: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="address">
                                <Form.Label>CEO Email ID</Form.Label>
                                <Form.Control
                                    type='email'
                                    placeholder="CEO Email ID"
                                    autoComplete="off"
                                    value={inputState?.ceo_email_id}
                                    onChange={(e) => handleInputChange({ ceo_email_id: e.target.value })}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="logo-upload">
                                <Form.Label>CEO Signature</Form.Label>
                                <div
                                    {...getLogoRootProps()}
                                    style={{
                                        border: "2px dashed #007bff",
                                        padding: "20px",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        background: isLogoActive ? "#e9ecef" : "#fff",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input {...getLogoInputProps()} />
                                    {isLogoActive ? (
                                        <p>Drop the file here...</p>
                                    ) : (
                                        <p>Drag and drop a file here, or click to select</p>
                                    )}
                                </div>
                                {
                                    (logoFile || (settingData && settingData?.ceo_digital_signature)) && (
                                        <div className="mt-3">
                                            <div className="mt-2">
                                                {/* Show image preview based on the file or existing logo */}
                                                <img
                                                    src={
                                                        logoFile
                                                            ? URL.createObjectURL(logoFile) // Show the preview of the selected file
                                                            : settingData?.ceo_digital_signature
                                                                ? `${config.IMAGE_PATH}${settingData?.ceo_digital_signature}` // Fallback to the existing logo
                                                                : null // If neither file nor existing logo exists
                                                    }
                                                    alt="Logo Preview"
                                                    style={{ maxWidth: "100%", height: "100px", objectFit: "contain" }}
                                                />
                                            </div>
                                        </div>
                                    )
                                }
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="defaultCity">
                                <Form.Label>HR Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="HR Name"
                                    autoComplete="off"
                                    value={inputState?.default_hr_name}
                                    onChange={(e) => handleInputChange({ default_hr_name: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="organization_mobile_no">
                                <Form.Label>HR Designation</Form.Label>
                                <TypeSuggestionSelectDesignation handleChanges={handleInputChange} designationValue={inputState?.default_hr_designation} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="organization_mobile_no">
                                <Form.Label>HR Email ID</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="HR Email ID"
                                    autoComplete="off"
                                    value={inputState?.default_hr_email_id}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        handleInputChange({ default_hr_email_id: value });
                                    }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="organization_whatsapp_no">
                                <Form.Label>HR Mobile Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="HR Mobile Number"
                                    autoComplete="off"
                                    value={inputState?.default_hr_mobile_no}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*$/.test(value)) {
                                            if (value?.length < 11) {
                                                handleInputChange({ default_hr_mobile_no: value });
                                            }
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="organization_whatsapp_no">
                                <Form.Label>Hiring Approval HR Email ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Hiring Approval HR Email ID"
                                    autoComplete="off"
                                    value={inputState?.hiring_approval_hr_email_id}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        handleInputChange({ hiring_approval_hr_email_id: value });
                                    }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>


                    <Button variant="success" className="mt-3" disabled={loading} onClick={UpdateAddress}>
                        {loading ? 'Loading...' : 'Update'}
                    </Button>
                </Form>

            </Col>
        </>
    )
}

export default ManagmentSetting