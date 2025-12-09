import React, { useState, useEffect } from "react";
import { Button, Col, Row, Form, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderTokenMultiPart } from "../../config/api_header";
import { useDropzone } from "react-dropzone";


const ThemeSetting = ({ settingData, fetchCandidateDetails }) => {

    const [inputState, setInputState] = useState({
        header_color: '#4CAF50',
        footer_color: '#2196F3',
    })

    const [logoFile, setLogoFile] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (settingData) {
            handleInputChange(
                {
                    header_color: settingData?.header_color,
                    footer_color: settingData?.footer_color
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

    const UpdateThemeSettings = (event) => {
        event.preventDefault();
        if (!inputState.header_color) {
            return toast.warn('Please Enter Header Color')
        }
        if (!inputState.footer_color) {
            return toast.warn('Please Enter Footer Color')
        }

        setLoading(true);

        // let Payloads = {
        //     "header_color": inputState.header_color,
        //     "footer_color": inputState.footer_color,
        //     "filename": logoFile
        // }

        let formData = new FormData();
        // if(logoFile) 
        formData.append('filename', logoFile ? logoFile : "");
        formData.append('header_color', inputState.header_color);
        formData.append('footer_color', inputState.footer_color);


        axios.post(`${config.API_URL}addLetterHeadSettingData`, formData, apiHeaderTokenMultiPart(config.API_TOKEN))
            .then((res) => {
                if (res.status === 200) {
                    toast.success(res.data?.message)
                } else {
                    toast.error(res.data?.message)
                }
                setLoading(false)
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message || err?.message  ||'Something Went Wrong')
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
                    <Row className="mb-4">

                        <Col md={12}>
                            <Form.Group controlId="logo-upload">
                                <Form.Label>Letter Head Signature</Form.Label>
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
                                    (logoFile || (settingData && settingData?.hod_hr_signature)) && (
                                        <div className="mt-3">
                                            <div className="mt-2">
                                                {/* Show image preview based on the file or existing logo */}
                                                <img
                                                    src={
                                                        logoFile
                                                            ? URL.createObjectURL(logoFile) // Show the preview of the selected file
                                                            : settingData?.hod_hr_signature
                                                                ? `${config.IMAGE_PATH}${settingData?.hod_hr_signature}` // Fallback to the existing logo
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
                            <Form.Group controlId="header_color">
                                <Form.Label>Header Color</Form.Label>
                                <div className="d-flex align-items-center gap-3">
                                    <Form.Control
                                        type="color"
                                        value={inputState?.header_color}
                                        onChange={(e) => handleInputChange({ header_color: e.target.value })}
                                        style={{ width: '80px', height: '45px', cursor: 'pointer' }}
                                    />
                                    <Form.Control
                                        type="text"
                                        placeholder="#4CAF50"
                                        value={inputState?.header_color}
                                        onChange={(e) => handleInputChange({ header_color: e.target.value })}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                                <Form.Text className="text-muted">
                                    Select a color for the header background
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="footer_color">
                                <Form.Label>Footer Color</Form.Label>
                                <div className="d-flex align-items-center gap-3">
                                    <Form.Control
                                        type="color"
                                        value={inputState?.footer_color}
                                        onChange={(e) => handleInputChange({ footer_color: e.target.value })}
                                        style={{ width: '80px', height: '45px', cursor: 'pointer' }}
                                    />
                                    <Form.Control
                                        type="text"
                                        placeholder="#2196F3"
                                        value={inputState?.footer_color}
                                        onChange={(e) => handleInputChange({ footer_color: e.target.value })}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                                <Form.Text className="text-muted">
                                    Select a color for the footer background
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={12}>
                            <div className="border rounded p-3">
                                <h6 className="mb-3">Preview:</h6>
                                <div className="mb-2">
                                    <div
                                        style={{
                                            backgroundColor: inputState?.header_color,
                                            padding: '15px',
                                            borderRadius: '5px',
                                            color: '#fff',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Header Preview
                                    </div>
                                </div>
                                <div>
                                    <div
                                        style={{
                                            backgroundColor: inputState?.footer_color,
                                            padding: '15px',
                                            borderRadius: '5px',
                                            color: '#fff',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Footer Preview
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Button variant="success" className="mt-3" disabled={loading} onClick={UpdateThemeSettings}>
                        {loading ? 'Saving...' : 'Update Theme'}
                    </Button>
                </Form>
            </Col>
        </>
    )
}

export default ThemeSetting;