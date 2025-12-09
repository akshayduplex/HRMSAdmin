
import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import GoBackButton from '../goBack/GoBackButton';
import AllHeaders from '../partials/AllHeaders';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken, apiHeaderTokenMultiPart } from '../../config/api_header';
import { Button, Col, Container, Form, Nav, Spinner, Tab } from 'react-bootstrap';
import WebSetting from './WebSetting';
import AddressSetting from './AddressSetting';
import SmsTemplateSetting from './SMSEmailTemplateSetting';
import { toast } from 'react-toastify';
import SMSSetting from './SMSMessaginSetting';
import OrganizationSetting from './OrganizationSetting';
import ManagmentSetting from './ManagmentSetting';
import SocialMediaSetting from './SocialMediasLinks';
import ThemeSetting from './ThemSetting';





const SystemSetting = () => {

    const [settingData, setSettingData] = useState(null);
    const [googlePlaceApi, setGooglePlaceApi] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCandidateDetails = () => {
        axios.get(`${config.API_URL}/getAllSettingData`, apiHeaderToken(config.API_TOKEN))
            .then((response) => {
                if (response.status === 200) {
                    setSettingData(response.data?.data);
                    setGooglePlaceApi(response.data?.data?.google_places_api)
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        fetchCandidateDetails();
    }, [])

    const UpdateGoogleApiKey = () => {
        if (!googlePlaceApi) {
            return toast.warn('Please Enter the Api Key');
        }
        setLoading(true)
        axios.post(`${config.API_URL}addGooglePlacesApi`, { "google_places_api": googlePlaceApi }, apiHeaderToken(config.API_TOKEN))
            .then((res) => {
                if (res.status === 200) {
                    toast.success(res.data?.message)
                } else {
                    toast.error(res.data?.message)
                }
                setLoading(false)
            })
            .catch((err) => {
                toast.error(err.message || err.response.data?.message || "Something Went Wrong");
                setLoading(false)
            })
    }


    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className='dflexbtwn'>
                        <div className='sitecard w-100'>
                            <Container fluid>
                                <Row className="">
                                    <Col>
                                        <h4>System Settings</h4>
                                    </Col>
                                </Row>
                                <Tab.Container defaultActiveKey="web-setting">
                                    <Row>
                                        <Col md={3} className="p-3">
                                            <Nav variant="pills success" className="flex-column gap-2">
                                                <Nav.Item>
                                                    <Nav.Link eventKey="web-setting">General Setting</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="address-setting">Corporate Office</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="support-setting">Organizations Setting</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="smtp-mail-setting">SMTP Mail Setting</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="google-place-apis">Google Place APIs</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="sms-apis">SMS APIs Setting</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="managment-setting">CEO & Default HR Details</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="social-setting">Social Media Links</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="theme-setting">Letter head setting</Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                        </Col>

                                        <Col md={9} className="p-3">
                                            <Tab.Content>
                                                <Tab.Pane eventKey="web-setting">
                                                    <h5>General Setting</h5>
                                                    <WebSetting settingData={settingData} fetchCandidateDetails={fetchCandidateDetails} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="address-setting">
                                                    <h5>Corporate Office</h5>
                                                    <AddressSetting settingData={settingData} fetchCandidateDetails={fetchCandidateDetails} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="support-setting">
                                                    <h5>Organizations Setting</h5>
                                                    <OrganizationSetting settingData={settingData} fetchCandidateDetails={fetchCandidateDetails} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="smtp-mail-setting">
                                                    <h5>SMTP Mail Setting</h5>
                                                    <SmsTemplateSetting settingData={settingData} fetchCandidateDetails={fetchCandidateDetails} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="google-place-apis">
                                                    <h5>Google Places Apis</h5>
                                                    <Col className="p-3">
                                                        <Form>
                                                            <Row className="mb-3">
                                                                <Col md={6}>
                                                                    <Form.Group controlId="address">
                                                                        <Form.Label>Enter Api keys</Form.Label>
                                                                        <Form.Control
                                                                            as='textarea'
                                                                            placeholder="Enter Api keys"
                                                                            value={googlePlaceApi}
                                                                            onChange={(e) => setGooglePlaceApi(e.target.value)}
                                                                        />
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                            <Button variant="success" className="mt-3" disabled={loading} onClick={UpdateGoogleApiKey}>
                                                                {loading ? 'Loading...' : 'Update'}
                                                            </Button>
                                                        </Form>
                                                    </Col>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey={'sms-apis'}>
                                                    <h5>SMS APIs Setting</h5>
                                                    <SMSSetting settingData={settingData} fetchCandidateDetails={fetchCandidateDetails} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey={'managment-setting'}>
                                                    <h5>CEO & Default HR Details</h5>
                                                    <ManagmentSetting settingData={settingData} fetchCandidateDetails={fetchCandidateDetails} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey={'social-setting'}>
                                                    <h5>Social Media Link</h5>
                                                    <SocialMediaSetting settingData={settingData} fetchCandidateDetails={fetchCandidateDetails} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey={'theme-setting'}>
                                                    <h5>Letter head setting</h5>
                                                    <ThemeSetting settingData={settingData} fetchCandidateDetails={fetchCandidateDetails} />
                                                </Tab.Pane>
                                            </Tab.Content>
                                        </Col>
                                    </Row>
                                </Tab.Container>
                            </Container>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SystemSetting;
