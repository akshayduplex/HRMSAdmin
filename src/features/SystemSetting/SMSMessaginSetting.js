import React, { useState, useEffect } from "react";
import { Button, Col, Row, Form, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";


const SMSSetting = ({ settingData, fetchCandidateDetails }) => {

    const [inputState, setInputState] = useState({
        sms_auth_key: '',
        sms_route_id: '',
        sms_sender_id: '',
        sms_enable_status: 'enabled',
    })
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (settingData) {
            handleInputChange(
                {
                    sms_auth_key: settingData?.sms_auth_key,
                    sms_route_id: settingData?.sms_route_id,
                    sms_sender_id: settingData.sms_sender_id,
                    sms_enable_status: settingData.sms_enable_status,
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
        if (!inputState.sms_auth_key) {
            return toast.warn('Please Enter SMS Auth Key')
        }
        if (!inputState.sms_route_id) {
            return toast.warn('Please Enter Rotes Id')
        }
        if (!inputState.sms_sender_id) {
            return toast.warn('Please Enter Sender Id')
        }
        setLoading(true);

        let Payloads = {
            "sms_auth_key": inputState.sms_auth_key,
            "sms_route_id": inputState.sms_route_id,
            "sms_sender_id": inputState.sms_sender_id,
            "sms_enable_status": inputState.sms_enable_status,
        }


        axios.post(`${config.API_URL}addSmsApiDetails`, Payloads, apiHeaderToken(config.API_TOKEN))
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
                                <Form.Label>SMS Auth Key</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder="SMS Auth Key"
                                    value={inputState?.sms_auth_key}
                                    onChange={(e) => handleInputChange({ sms_auth_key: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="defaultCity">
                                <Form.Label>SMS Routes Id</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="SMS Routes Id"
                                    value={inputState?.sms_route_id}
                                    onChange={(e) => handleInputChange({ sms_route_id: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="latitude">
                                <Form.Label>SMS Sender Id</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={inputState.sms_sender_id}
                                    placeholder="SMS Sender Id"
                                    onChange={(e) => handleInputChange({ sms_sender_id: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Col md="auto">
                                <Form.Label className="mb-0">SMS Enable Status</Form.Label>
                            </Col>
                            <Row className="mb-3 align-items-center gap-2 mt-4">
                                <Col md="auto">
                                    <Form.Check
                                        inline
                                        type="radio"
                                        label="Enable"
                                        name="smtp_enable_status"
                                        value="enabled"
                                        checked={inputState.sms_enable_status === 'enabled'}
                                        onChange={(e) => handleInputChange({ sms_enable_status: e.target.value })}
                                    />
                                    <Form.Check
                                        inline
                                        type="radio"
                                        label="Disable"
                                        name="smtp_enable_status"
                                        value="disabled"
                                        checked={inputState.sms_enable_status === 'disabled'}
                                        onChange={(e) => handleInputChange({ sms_enable_status: e.target.value })}
                                    />
                                </Col>
                            </Row>
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

export default SMSSetting