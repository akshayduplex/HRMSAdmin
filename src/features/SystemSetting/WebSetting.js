import React, { useEffect, useState } from "react";
import { Button, Col, Row, Form, InputGroup } from "react-bootstrap";
import { FiGlobe } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderTokenMultiPart } from "../../config/api_header";


const WebSetting = ({ settingData, fetchCandidateDetails }) => {

    const [placeholderFile, setPlaceholderFile] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [waterMarkFile, setWaterMarkFile] = useState(null);
    const [title, setTitle] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [webSiteLink, setWebsiteLink] = useState('');
    const [jonPortalLink, setJonPortalLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [wantHrms, setWantHrms] = useState(false);

    useEffect(() => {

        if (settingData) {
            setTitle(settingData?.site_title)
            setMetaTitle(settingData?.meta_title)
            setMetaDescription(settingData?.meta_description)
            setWebsiteLink(settingData?.website_link)
            setJonPortalLink(settingData?.job_portal_link)
            setWantHrms(settingData?.want_hrms || false);
        }

    }, [settingData])

    const onDropPlaceholder = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setPlaceholderFile(file);
    };

    const { getRootProps: getPlaceholderRootProps, getInputProps: getPlaceholderInputProps, isDragActive: isPlaceholderActive } = useDropzone({
        onDrop: onDropPlaceholder,
        accept: {
            "image/png": [],
            "image/jpeg": [],
            "image/jpg": [],
            "image/webp": [],
        },
        maxFiles: 1,
    });

    // Handlers for Logo Image
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

    const onDropWaterMark = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setWaterMarkFile(file);
    };

    const { getRootProps: getWaterMarkRootProps, getInputProps: getWaterMarkInputProps, isDragActive: isWaterMarkActive } = useDropzone({
        onDrop: onDropWaterMark,
        accept: {
            "image/png": [],
            "image/jpeg": [],
            "image/jpg": [],
            "image/webp": [],
        },
        maxFiles: 1,
    });

    // Reset both fields
    const resetFiles = () => {
        setPlaceholderFile(null);
        setLogoFile(null);
        setWaterMarkFile(null);
    };

    const handleUploads = async () => {
        if (!title) {
            return toast.warn('Please Enter the site Title')
        }
        if (!metaTitle) {
            return toast.warn('Please Enter the Meta Title')
        }
        if (!metaDescription) {
            return toast.warn('Please Enter the Meta Description')
        }

        let formData = new FormData();
        formData.append('site_title', title);
        formData.append('meta_title', metaTitle);
        formData.append('meta_description', metaDescription);
        formData.append('favicon_file', placeholderFile);
        formData.append('logo_file', logoFile);
        formData.append('water_mark_file', waterMarkFile);
        formData.append('website_link', webSiteLink);
        formData.append('job_portal_link', jonPortalLink);
        formData.append('want_hrms', wantHrms);


        setLoading(true)

        axios.post(`${config.API_URL}addWebSettingData`, formData, apiHeaderTokenMultiPart(config.API_TOKEN))
            .then((res) => {
                if (res.status === 200) {
                    toast.success(res.data?.message)
                } else {
                    toast.error(res.data?.message)
                }
                setLoading(false)
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message || 'Something went wrong')
                setLoading(false)
            })
    }


    return (
        <>
            <Col className="p-3">
                <Form>
                    <Row className="mb-3 gap-2">
                        <Col md={12}>
                            <Form.Group controlId="address">
                                <Form.Label>Site Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Site Title"
                                    value={title}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        setTitle(value);
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group controlId="meta-description">
                                <Form.Label>Meta Title</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Enter meta title"
                                    value={metaTitle}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        setMetaTitle(value);
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group controlId="meta-description">
                                <Form.Label>Meta Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Enter meta description"
                                    value={metaDescription}
                                    onChange={(e) => {
                                        let value = e.target.value;

                                        setMetaDescription(value);
                                    }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="meta-description">
                                <Form.Label>Website Link</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Website Link"
                                    value={webSiteLink}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        setWebsiteLink(value);
                                    }}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="meta-description">
                                <Form.Label>Job Portal Link</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Job Portal Link"
                                    value={jonPortalLink}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        setJonPortalLink(value);
                                    }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6} className="mt-3">
                            <Form.Group controlId="logo-upload">
                                <Form.Label>Web Logo</Form.Label>
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
                                    (logoFile || (settingData && settingData?.logo_image)) && (
                                        <div className="mt-3">
                                            <div className="mt-2">
                                                {/* Show image preview based on the file or existing logo */}
                                                <img
                                                    src={
                                                        logoFile
                                                            ? URL.createObjectURL(logoFile) // Show the preview of the selected file
                                                            : settingData?.logo_image
                                                                ? `${config.IMAGE_PATH}${settingData.logo_image}` // Fallback to the existing logo
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

                        <Col md={6} className="mt-3">
                            <Form.Group controlId="placeholder-upload">
                                <Form.Label>Favicon Icon</Form.Label>
                                <div
                                    {...getPlaceholderRootProps()}
                                    style={{
                                        border: "2px dashed #007bff",
                                        padding: "20px",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        background: isPlaceholderActive ? "#e9ecef" : "#fff",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input {...getPlaceholderInputProps()} />
                                    {isPlaceholderActive ? (
                                        <p>Drop the file here...</p>
                                    ) : (
                                        <p>Drag and drop a file here, or click to select</p>
                                    )}
                                </div>
                                {(placeholderFile || (settingData && settingData?.fav_icon_image)) && (
                                    <div className="mt-3">
                                        <div className="mt-2">
                                            <img
                                                src={
                                                    placeholderFile
                                                        ? URL.createObjectURL(placeholderFile)
                                                        : settingData?.fav_icon_image
                                                            ? `${config.IMAGE_PATH}${settingData.fav_icon_image}`
                                                            : null
                                                }
                                                alt="Water Mark Image"
                                                style={{ maxWidth: "100%", height: "100px", objectFit: "contain" }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </Form.Group>
                        </Col>

                        <Col md={6} className="mt-3">
                            <Form.Group controlId="placeholder-upload">
                                <Form.Label>Watermark Image</Form.Label>
                                <div
                                    {...getWaterMarkRootProps()}
                                    style={{
                                        border: "2px dashed #007bff",
                                        padding: "20px",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        background: isWaterMarkActive ? "#e9ecef" : "#fff",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input {...getWaterMarkInputProps()} />
                                    {isWaterMarkActive ? (
                                        <p>Drop the file here...</p>
                                    ) : (
                                        <p>Drag and drop a file here, or click to select</p>
                                    )}
                                </div>
                                {(waterMarkFile || (settingData && settingData?.water_mark_file)) && (
                                    <div className="mt-3">
                                        <div className="mt-2">
                                            <img
                                                src={
                                                    waterMarkFile
                                                        ? URL.createObjectURL(waterMarkFile)
                                                        : settingData?.water_mark_file
                                                            ? `${config.IMAGE_PATH}${settingData.water_mark_file}`
                                                            : null
                                                }
                                                alt="Water Mark Image"
                                                style={{ maxWidth: "100%", height: "100px", objectFit: "contain" }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </Form.Group>
                        </Col>
                        <Row className="mt-3">
                            <Col md={6}>
                                <Form.Group controlId="want-hrms">
                                    <Form.Check
                                        type="checkbox"
                                        label="Enable HRMS"
                                        checked={wantHrms}
                                        onChange={(e) => setWantHrms(e.target.checked)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* <Col md={6}>
                            <Form.Group controlId="web-logo">
                                <Form.Label>Favicon Icon</Form.Label>
                                <div
                                    {...getRootProps()}
                                    style={{
                                        border: "2px dashed #007bff",
                                        padding: "20px",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        background: isDragActive ? "#e9ecef" : "#fff",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    {isDragActive ? (
                                        <p>Drop the file here...</p>
                                    ) : (
                                        <p>Drag and drop a file here, or click to select</p>
                                    )}
                                </div>
                                {selectedFile && (
                                    <Form.Text className="text-muted mt-2">
                                        Selected File: {selectedFile.name}
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </Col> */}
                        {/* <Col md={4}>
                            <Form.Group controlId="web-logo">
                                <Form.Label>Placeholder Image</Form.Label>
                                <div
                                    {...getRootProps()}
                                    style={{
                                        border: "2px dashed #007bff",
                                        padding: "20px",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        background: isDragActive ? "#e9ecef" : "#fff",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    {isDragActive ? (
                                        <p>Drop the file here...</p>
                                    ) : (
                                        <p>Drag and drop a file here, or click to select</p>
                                    )}
                                </div>
                                {selectedFile && (
                                    <Form.Text className="text-muted mt-2">
                                        Selected File: {selectedFile.name}
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </Col> */}
                    </Row>

                    <Button variant="success text-center" disabled={loading} className="mt-3" onClick={handleUploads}>
                        {loading ? 'Loading...' : 'Update Web Setting'}
                    </Button>
                </Form>
            </Col>
        </>
    )
}

export default WebSetting