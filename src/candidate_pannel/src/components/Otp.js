import React, { useState, useEffect } from "react";
import ReplayIcon from '@mui/icons-material/Replay';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from "axios";
import config from "../config/Config";
import { apiHeaderToken } from "../config/ApiHeaders";
import Spinner from 'react-bootstrap/Spinner';

const OTPBox = ({ email }) => {
    const [otp, setOtp] = useState(new Array(4).fill(""));
    const [otpValid, setOtpValid] = useState(false);
    const [text, setText] = useState('Verify');
    const [timer, setTimer] = useState(60);
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();

    const login_device = window.navigator.userAgent;

    useEffect(() => {
        let countdown;
        if (timer > 0) {
            countdown = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        clearInterval(countdown);
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }
        return () => clearInterval(countdown);
    }, [timer]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (otp.includes("")) {
            //toast("Please enter a 4-digit OTP");
            toast.error("Please enter a 4-digit OTP", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            
            return;
        }

        const payload = { email_id: email, otp: otp.join(''), login_device: login_device };
        setLoader(true);
        try {
            let response = await axios.post(`${config.API_URL}verifyLoginOtp`, payload, apiHeaderToken(config.API_TOKEN));
            console.log(response.data)

            if (response.data) {
                let userId = response.data.data;
                setOtpValid(true);
                window.sessionStorage.setItem('employeeLogin',JSON.stringify(userId))

                setTimeout(() => {
                    navigate("/upcoming");
                    
                }, 1000);
            } else {
                setText('Verify');
                toast("Invalid OTP");

            }
        } catch (error) {
            console.error(error);
            //toast("OTP Not Matched");
            toast.error("OTP Not Matched", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
        } finally {
            setLoader(false);
        }
    };

    // ResendOtp
    const ResendOtp = async () => {
        const payload = { email_id: email };

        setLoader(true);

        try {
            let response = await axios.post(`${config.API_URL}loginWithEmail`, payload, apiHeaderToken(config.API_TOKEN));
            console.log(response.data);
            toast.success(response.data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setTimer(60); 
        } catch (error) {
            console.error(error);
            toast("Invalid Login Details");
        } finally {
            setLoader(false);
        }
    };

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }

        // Reset the OTP valid state when the OTP changes
        setOtpValid(false);
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (otp[index] === "") {
                if (e.target.previousSibling) {
                    e.target.previousSibling.focus();
                }
            } else {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            }
        }
    };

    return (
        <>
            <Form className="logform" onSubmit={handleSubmit}>
                <Form.Label>Enter OTP sent to your email ID</Form.Label> <br />
                {otp.map((data, index) => {
                    return (
                        <input className="otp-field" type="text"
                            name="otp" maxLength="1" key={index} value={data}
                            onChange={e => handleChange(e.target, index)}
                            onKeyDown={e => handleKeyDown(e, index)}
                            onFocus={e => e.target.select()}
                        />
                    );
                })}
                <p className="resend mt-3">
                    {timer > 0 ? (
                        <>
                            Resend in <span className="timer">{timer} sec</span>
                        </>
                    ) : (
                        <>
                            Resend OTP in <span className="timer" onClick={ResendOtp}><ReplayIcon /></span>
                        </>
                    )}
                </p>
                <div className="btnright btnicon mt-4">
                    {otpValid && <CheckCircleIcon />}
                    <Button type="submit" className="formbtn" variant="primary">
                        {loader ? (
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                        ) : (
                            <>{text}</>
                        )}
                    </Button>
                </div>
                <ToastContainer />
            </Form>
        </>
    );
};

export default OTPBox;














