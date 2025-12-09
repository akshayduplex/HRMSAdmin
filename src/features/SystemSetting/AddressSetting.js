import React, { useState, useEffect } from "react";
import { Button, Col, Row, Form, InputGroup } from "react-bootstrap";
import { FiGlobe } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import ReactQuill from "react-quill";
import moment from 'moment-timezone';
import { current } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";


const AddressSetting = ({ settingData, fetchCandidateDetails }) => {

    const [inputState, setInputState] = useState({
        office_address: '',
        office_city: '',
        office_longitude: '',
        office_latitude: '',
        currency: '',
        timezone: '',
        office_map_iframe: '',
    })
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (settingData) {
            handleInputChange(
                {
                    office_address: settingData?.office_address,
                    office_city: settingData?.office_city,
                    office_longitude: settingData.office_longitude,
                    office_latitude: settingData.office_latitude,
                    currency: settingData.currency,
                    timezone: settingData?.time_zone,
                    office_map_iframe: settingData.office_map_iframe
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

    const timezones = moment.tz.names();

    // let Paylods = {
    //     "office_address": "Duplex Technology Services Sf2 Aadhar shila Lucknow",
    //     "office_city": "Lucknow", "office_latitude": "80.9008",
    //     "office_longitude": "59.90060608",
    //     "office_latitude": '',
    //     "office_map_iframe": "iframe data",
    //     "currency": "INR",
    //     "time_zone": "Asia/Kolkata"
    // }

    const UpdateAddress = (event) => {
        event.preventDefault();
        if (!inputState.office_address) {
            return toast.warn('Please Enter the Office Address')
        }
        if (!inputState.office_city) {
            return toast.warn('Please Enter the Office city name')
        }
        if (!inputState.office_latitude) {
            return toast.warn('Please Enter the latitude')
        }
        if (!inputState.office_longitude) {
            return toast.warn('Please Enter the Office longitude')
        }
        if (!inputState.timezone) {
            return toast.warn('Please Choose the Timezone')
        }
        if (!inputState.currency) {
            return toast.warn('Please Enter Currency code')
        }

        setLoading(true);

        let Payloads = {
            "office_address": inputState.office_address,
            "office_city": inputState.office_city,
            "office_latitude": inputState.office_latitude,
            "office_longitude": inputState.office_longitude,
            "office_map_iframe": inputState.office_map_iframe,
            "currency": inputState.currency,
            "time_zone": inputState.timezone
        }
        axios.post(`${config.API_URL}addOrganizationAddressDetails`, Payloads, apiHeaderToken(config.API_TOKEN))
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
                                <Form.Label>Office Address</Form.Label>
                                <Form.Control
                                    as='textarea'
                                    placeholder="Enter Office Address"
                                    value={inputState?.office_address}
                                    onChange={(e) => handleInputChange({ office_address: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="defaultCity">
                                <Form.Label>Office City</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Office City"
                                    value={inputState?.office_city}
                                    onChange={(e) => handleInputChange({ office_city: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="latitude">
                                <Form.Label>Latitude</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={inputState.office_latitude}
                                    placeholder="Latitude"
                                    onChange={(e) => handleInputChange({ office_latitude: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="longitude">
                                <Form.Label>Longitude</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Longitude"
                                    value={inputState.office_longitude}
                                    onChange={(e) => handleInputChange({ office_longitude: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>


                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="timezone">
                                <Form.Label>System Timezone</Form.Label>
                                <Form.Select value={inputState.timezone} onChange={(event) => handleInputChange({ timezone: event.target.value })}>
                                    {timezones.map((timezone, index) => {
                                        const offset = moment.tz(timezone).utcOffset();
                                        const formattedOffset = `${offset >= 0 ? '+' : ''}${Math.floor(Math.abs(offset) / 60)}:${Math.abs(offset) % 60}`;
                                        return (
                                            <option key={index} value={timezone}>
                                                {timezone} - GMT {formattedOffset}
                                            </option>
                                        );
                                    })}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="Currency">
                                <Form.Label>Currency</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Currency Code"
                                    value={inputState.currency}
                                    onChange={(e) => handleInputChange({ currency: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group controlId="address">
                                <Form.Label>Office Map Iframe</Form.Label>
                                <Form.Control
                                    as='textarea'
                                    placeholder="Enter The Link"
                                    value={inputState.office_map_iframe}
                                    onChange={(e) => handleInputChange({ office_map_iframe: e.target.value })}
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

export default AddressSetting