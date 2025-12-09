import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";

const SmsTemplateSetting = ({ settingData, fetchCandidateDetails }) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const [inputData, setInputData] = useState({
    from_email_id: "",
    reply_to_email_id: "",
    sms_email_password: "",
    sms_user_name: '',
    smtp_enable_status: 'enabled',
    sms_host: "",
    sms_port: "",
    sms_email_content_type: "HTML",
    sms_encryption: "SSL",
    email_test: "",
  });

  const [loading, setLoading] = useState(false);

  // Using Refs for form field focus
  const emailRef = useRef(null);
  const emailRpRef = useRef(null);
  const passwordRef = useRef(null);
  const hostRef = useRef(null);
  const portRef = useRef(null);
  const contentTypeRef = useRef(null);
  const encryptionRef = useRef(null);
  const testRef = useRef(null);

  // Update state based on the entire object
  const handleInputChange = (updatedData) => {
    setInputData(prevState => ({
      ...prevState,
      ...updatedData,
    }));
  };

  // Pre-fill data from settingData when it changes
  useEffect(() => {
    if (settingData) {
      handleInputChange({
        sms_user_name: settingData.smtp_username || '',
        sms_email_password: settingData.smtp_password || '',
        from_email_id: settingData.smtp_from_mail || '',
        reply_to_email_id: settingData.smtp_reply_mail || '',
        sms_host: settingData.smtp_host || '',
        sms_port: settingData.smtp_port || '',
        sms_email_content_type: settingData.smtp_email_content_type || 'HTML',
        sms_encryption: settingData.smtp_encryption_type || 'SSL',
        smtp_enable_status: settingData.smtp_enable_status || 'enabled'
      });
    }
  }, [settingData]);

  console.table(inputData, 'Input Data');

  const SmsSettingSummation = (event) => {
    event.preventDefault();

    if (!inputData.sms_user_name) {
      return toast.warn('Please Enter the User Name');
    }

    if (!emailRegex.test(inputData.from_email_id)) {
      emailRef.current.focus();
      return toast.warn('Please Enter a Valid Email Id');
    }
    if (!emailRegex.test(inputData.reply_to_email_id)) {
      emailRpRef.current.focus();
      return toast.warn('Please Enter a Valid Email Id');
    }

    if (!inputData.sms_email_password || inputData.sms_email_password.length < 5) {
      passwordRef.current.focus();
      return toast.warn('Password must be at least 5 characters long');
    }
    if (
      !inputData.sms_port || // Ensure port is provided
      !/^\d+$/.test(inputData.sms_port) || // Ensure port is numeric
      inputData.sms_port < 1 || // Ensure port is within the valid range
      inputData.sms_port > 65535
    ) {
      portRef.current.focus();
      return toast.warn('Please Enter a Valid Port Number between 1 and 65535');
    }
    if (!inputData.sms_host) {
      return toast.warn('Please Enter the SMS Host');
    }
    if (!inputData.sms_email_content_type) {
      return toast.warn('Please Choose the Email Content Type');
    }
    if (!inputData.sms_encryption) {
      return toast.warn('Please Choose the Email Encryption');
    }

    let Payloads = {
      "smtp_host": inputData.sms_host,
      "smtp_port": inputData.sms_port,
      "smtp_username": inputData.sms_user_name, 
      "smtp_password": inputData.sms_email_password, 
      "smtp_from_mail": inputData.from_email_id,
      "smtp_reply_mail": inputData.reply_to_email_id,
      "smtp_encryption_type": inputData.sms_encryption,
      "smtp_email_content_type": inputData.sms_email_content_type,
      "smtp_enable_status": inputData?.smtp_enable_status,
    };

    setLoading(true);

    axios.post(`${config.API_URL}addSmtpDetails`, Payloads, apiHeaderToken(config.API_TOKEN))
      .then((res) => {
        if (res.status) {
          toast.success(res.data?.message);
        } else {
          toast.error(res.data?.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || 'Something Went Wrong');
        setLoading(false);
      });
  };

  return (
    <Col className="p-3">
      <Form>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="address">
              <Form.Label>SMTP User Name</Form.Label>
              <Form.Control
                type="text"
                ref={emailRef}
                placeholder="Enter User Name"
                value={inputData.sms_user_name}
                onChange={(e) => handleInputChange({ sms_user_name: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="sms_email_password">
              <Form.Label>SMTP Email Password</Form.Label>
              <Form.Control
                type="text"
                ref={passwordRef}
                placeholder="SMTP Email Password"
                value={inputData.sms_email_password}
                onChange={(e) => handleInputChange({ sms_email_password: e.target.value })}
                isInvalid={inputData.sms_email_password && inputData.sms_email_password.length < 5}
              />
              <Form.Control.Feedback type="invalid">
                Password must be at least 5 characters long.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="address">
              <Form.Label>From Email Id</Form.Label>
              <Form.Control
                type="text"
                ref={emailRef}
                placeholder="From Email Id"
                value={inputData.from_email_id}
                onChange={(e) => handleInputChange({ from_email_id: e.target.value })}
                isInvalid={inputData.from_email_id && !emailRegex.test(inputData.from_email_id)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email address.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group controlId="defaultCity">
              <Form.Label>Reply To Email</Form.Label>
              <Form.Control
                type="text"
                ref={emailRpRef}
                placeholder="Reply To Email"
                value={inputData.reply_to_email_id}
                onChange={(e) => handleInputChange({ reply_to_email_id: e.target.value })}
                isInvalid={inputData.reply_to_email_id && !emailRegex.test(inputData.reply_to_email_id)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email address.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="SMTPHost">
              <Form.Label>SMTP Host</Form.Label>
              <Form.Control
                type="text"
                placeholder="SMTP Host"
                value={inputData.sms_host}
                onChange={(e) => handleInputChange({ sms_host: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="SMTPPort">
              <Form.Label>SMTP Port (TLS:587, SSL:465)</Form.Label>
              <Form.Control
                type="text"
                ref={portRef}
                placeholder="SMTP Port"
                value={inputData.sms_port}
                onChange={(e) => {
                  if (e.target.value?.length <= 6) {
                    handleInputChange({ sms_port: e.target.value });
                  }
                }}
                isInvalid={inputData.sms_port && (!/^\d+$/.test(inputData.sms_port) || inputData.sms_port < 1 || inputData.sms_port > 65535)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid port number between 1 and 65535.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3 mt-3">
          <Col md={4}>
            <Form.Group controlId="emailContentType">
              <Form.Label>SMTP Email Content Type</Form.Label>
              <Form.Select
                value={inputData.sms_email_content_type}
                onChange={(e) => handleInputChange({ sms_email_content_type: e.target.value })}
              >
                <option value="HTML">HTML</option>
                <option value="Text">Text</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="encryption">
              <Form.Label >SMTP Encryption</Form.Label>
              <Form.Select
                value={inputData.sms_encryption}
                onChange={(e) => handleInputChange({ sms_encryption: e.target.value })}
              >
                <option value="SSL">SSL</option>
                <option value="TLS">TLS</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4} >
            <Row className="mb-3 align-items-center gap-2">
              <Col md="auto">
                <Form.Label className="mb-0">SMTP Status:</Form.Label>
              </Col>
              <Col md="auto">
                <Form.Check
                  inline
                  type="radio"
                  label="Enable"
                  name="smtp_enable_status"
                  value="enabled"
                  checked={inputData.smtp_enable_status === 'enabled'}
                  onChange={(e) => handleInputChange({ smtp_enable_status: e.target.value })}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Disable"
                  name="smtp_enable_status"
                  value="disabled"
                  checked={inputData.smtp_enable_status === 'disabled'}
                  onChange={(e) => handleInputChange({ smtp_enable_status: e.target.value })}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <hr />

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="testEmail">
              <Form.Label>Test Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Test Email"
                value={inputData.email_test}
                onChange={(e) => handleInputChange({ email_test: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={2} style={{ marginTop: "2.3rem" }}>
            <Button>Test</Button>
          </Col>
        </Row>

        <Button variant="success" disabled={loading} className="mt-3" onClick={SmsSettingSummation}>
          {loading ? 'Loading..' : 'Update'}
        </Button>
      </Form>
    </Col>
  );
};

export default SmsTemplateSetting;
