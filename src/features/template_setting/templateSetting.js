import React, { useCallback, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import GoBackButton from '../goBack/GoBackButton';
import { Button, Col, Container, Form, Nav, Spinner, Tab } from 'react-bootstrap';
import OfferLetterTemp from './OfferLatterTemp';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import { Badge } from 'react-bootstrap';


const tabStyles = {
    nav: {
        background: '#ffffff',
        borderRadius: '12px',
        padding: '15px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        margin: '10px 0'
    },
    navLink: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        color: '#495057',
        padding: '12px 20px',
        transition: 'all 0.3s ease',
        border: '1px solid transparent', // Changed to transparent
        borderRadius: '8px',
        margin: '0 5px',
        '&:hover': {
            backgroundColor: 'rgba(52, 32, 155, 0.1)',
        }
    },
    activeNavLink: {
        backgroundColor: '#34209b',
        color: 'white',
        border: '2px solid #34209b', // Made border more prominent
        boxShadow: '0 2px 4px rgba(52, 32, 155, 0.2)'
    },
    badge: {
        backgroundColor: '#34209b',
        transition: 'all 0.3s ease',
        padding: '6px 12px',
        borderRadius: '20px'
    },
    activeBadge: {
        backgroundColor: 'white',
        color: '#34209b',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }
};

const TemplateSetting = () => {
    const [activeTab, setActiveTab] = useState("offer");
    const [template, setTemplate] = useState(null);
    const [loadingTemplate, setLoadingTemplate] = useState(false);
    const [jobType , setJobType] = useState(null);
    

    // Tab configuration for cleaner code
    const TABS = [
        { key: "offer", title: "Offer Letter" },
        { key: "joining", title: "Joining Kit" },
        { key: "appointment", title: "Appointment Letter" }
    ];

    const handleFetchTemplate = async (type) => {

        if (!type) return;

        let formType = '';

        switch (type) {
            case 'appointment':
                formType = 'Appointment Letter'
                break;
            case 'offer':
                formType = 'Offer Letter'
                break;
            default:
                formType = 'Joining Kit';
        }

        let payloads = {
            "template_for": formType,
            "page_no": "1",
            "per_page_record": "5",
            "scope_fields": ["job_type", "attachments", "template", "status", "template_for", "add_date" , 'esic_status']
        }

        setLoadingTemplate(true);
        try {
            const response = await axios.post(`${config.API_URL}getTemplateSettingsList`, payloads, apiHeaderToken(config.API_TOKEN));
            console.log("Response:", response);
            if (response.status === 200) {
                setTemplate(response?.data?.data);
                // toast.success(response?.data?.message);
            } else {
                // toast.error(response?.data?.message);
                setTemplate(null);
            }
        } catch (error) {
            console.error("Error fetching templates:", error);
            setTemplate(null);
            // toast.error(error?.response?.data?.message || error?.message || "An error occurred while fetching templates.");
        } finally {
            setLoadingTemplate(false);
        }
    }

    useEffect(() => {

        if (activeTab) {
            handleFetchTemplate(activeTab)
        }

    }, [activeTab]);

    return (
        <div className="maincontent">
            <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                <GoBackButton />
                <div className='dflexbtwn'>
                    <div className='sitecard w-100'>
                        <Container fluid>
                            <Row>
                                <Col>
                                    <h4>Template Setting</h4>
                                </Col>
                            </Row>
                            <Tab.Container
                                activeKey={activeTab}
                                onSelect={(k) => setActiveTab(k)}
                            >
                                <Row>
                                    <Col md={12} className="mb-3">
                                        <Nav variant="pills" className="nav-justified" style={tabStyles.nav}>
                                            {TABS.map((tab) => (
                                                <Nav.Item key={tab.key}>
                                                    <Nav.Link
                                                        eventKey={tab.key}
                                                        className="d-flex align-items-center justify-content-center"
                                                        style={{
                                                            ...tabStyles.navLink,
                                                            ...(activeTab === tab.key && tabStyles.activeNavLink),
                                                            ':hover': {
                                                                backgroundColor: 'rgba(52, 32, 155, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        <span>{tab.title}</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                            ))}
                                        </Nav>
                                    </Col>
                                    <Col md={12}>
                                        <Tab.Content>
                                            {TABS.map((tab) => (
                                                <Tab.Pane key={tab.key} eventKey={tab.key}>
                                                    <OfferLetterTemp
                                                        type={tab.key}
                                                        template={template}
                                                        setTemplate={setTemplate}
                                                        loadingTemplate={loadingTemplate}
                                                        handleFetchTemplate={handleFetchTemplate}
                                                        jobType={jobType}
                                                    />
                                                </Tab.Pane>
                                            ))}
                                        </Tab.Content>
                                    </Col>
                                </Row>
                            </Tab.Container>
                        </Container>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateSetting;