import React, { useState, useEffect } from "react";
import { Button, Col, Row, Form, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";


const OrganizationSetting = ({ settingData, fetchCandidateDetails }) => {

    const [inputState, setInputState] = useState({
        organization_name: '',
        organization_email_id: '',
        organization_mobile_no: '',
        organization_whatsapp_no: '',
    })

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (settingData) {
            handleInputChange(
                {
                    organization_name: settingData?.organization_name,
                    organization_email_id: settingData?.organization_email_id,
                    organization_mobile_no: settingData.organization_mobile_no,
                    organization_whatsapp_no: settingData.organization_whatsapp_no,
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
        if (!inputState.organization_name) {
            return toast.warn('Please Enter Organization Name')
        }
        if (!inputState.organization_email_id) {
            return toast.warn('Please Enter Organization Email Id')
        }
        if (!inputState.organization_mobile_no) {
            return toast.warn('Please Enter Organization Mobile Number')
        }
        if (!inputState.organization_whatsapp_no) {
            return toast.warn('Please Enter Organization WhatsApp Number')
        }
        setLoading(true);

        let Payloads = {
            "organization_name": inputState.organization_name,
            "organization_email_id": inputState.organization_email_id,
            "organization_mobile_no": inputState.organization_mobile_no,
            "organization_whatsapp_no": inputState.organization_whatsapp_no,
        }



        axios.post(`${config.API_URL}addOrganizationDetails`, Payloads, apiHeaderToken(config.API_TOKEN))
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



    return (
        <>
            <Col className="p-3">
                <Form>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="address">
                                <Form.Label>Organization Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder="Organization Name"
                                    value={inputState?.organization_name}
                                    onChange={(e) => handleInputChange({ organization_name: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="defaultCity">
                                <Form.Label>Organization Email id</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Organization Email id"
                                    value={inputState?.organization_email_id}
                                    onChange={(e) => handleInputChange({ organization_email_id: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="organization_mobile_no">
                                <Form.Label>Organization Mobile No</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Organization Mobile No"
                                    value={inputState?.organization_mobile_no}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*$/.test(value)) {
                                            if(value?.length < 11){
                                                handleInputChange({ organization_mobile_no: value });
                                            }
                                        }
                                    }}
                                />

                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="organization_whatsapp_no">
                                <Form.Label>Organization WhatsApp Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Organization WhatsApp Number"
                                    value={inputState?.organization_whatsapp_no}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*$/.test(value)) {
                                            if(value?.length < 11){
                                                handleInputChange({ organization_whatsapp_no: value });
                                            }
                                        }
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

export default OrganizationSetting