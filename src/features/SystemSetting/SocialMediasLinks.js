import React, { useState, useEffect } from "react";
import { Button, Col, Row, Form, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";


const SocialMediaSetting = ({ settingData, fetchCandidateDetails }) => {

    const [inputState, setInputState] = useState({
        facebook_link: '',
        instagram_link: '',
        linkedin_link: '',
        twitter_link: '',
        youtube_link: '',
    })

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (settingData) {
            handleInputChange(
                {
                    facebook_link: settingData?.social_media_links?.facebook_link,
                    instagram_link: settingData?.social_media_links?.instagram_link,
                    linkedin_link: settingData?.social_media_links?.linkedin_link,
                    twitter_link: settingData?.social_media_links?.twitter_link,
                    youtube_link: settingData?.social_media_links.youtube_link,
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
        if (!inputState.facebook_link) {
            return toast.warn('Please Enter facebook Link')
        }
        if (!inputState.instagram_link) {
            return toast.warn('Please Enter instagram Link')
        }
        if (!inputState.linkedin_link) {
            return toast.warn('Please Enter linkedin Link')
        }
        if (!inputState.twitter_link) {
            return toast.warn('Please Enter twitter link')
        }
        if (!inputState.youtube_link) {
            return toast.warn('Please Enter youtube link')
        }
        setLoading(true);

        let Payloads = {
            "facebook_link": inputState.facebook_link,
            "instagram_link": inputState.instagram_link,
            "linkedin_link": inputState.linkedin_link,
            "twitter_link": inputState.twitter_link,
            "youtube_link": inputState.youtube_link,
        }


        axios.post(`${config.API_URL}addSocialMediaLinks`, Payloads, apiHeaderToken(config.API_TOKEN))
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
                                <Form.Label>Facebook Link</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder="Facebook Link"
                                    autoComplete="off"
                                    value={inputState?.facebook_link}
                                    onChange={(e) => handleInputChange({ facebook_link: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="defaultCity">
                                <Form.Label>Instagram Link</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="HR Name"
                                    autoComplete="off"
                                    value={inputState?.instagram_link}
                                    onChange={(e) => handleInputChange({ instagram_link: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="defaultCity">
                                <Form.Label>Linkedin Link</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Linkedin Link"
                                    autoComplete="off"
                                    value={inputState?.linkedin_link}
                                    onChange={(e) => handleInputChange({ linkedin_link: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="organization_mobile_no">
                                <Form.Label> Twitter Link </Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Twitter Link"
                                    autoComplete="off"
                                    value={inputState?.twitter_link}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        handleInputChange({ twitter_link: value });
                                    }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="organization_whatsapp_no">
                                <Form.Label>Youtube Link</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="youtube_link"
                                    autoComplete="off"
                                    value={inputState?.youtube_link}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                         handleInputChange({ youtube_link: value })
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

export default SocialMediaSetting