import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import config from "./config/config";
import CandidateConfig from "./candidate_pannel/src/config/Config";
import axios from "axios";

const ExpiredAlert = () => {
    const navigate = useNavigate();
    const location = useLocation(); 

    const [tokenStatus, setTokenStatus] = useState(false);
    const [redirectCountdown, setRedirectCountdown] = useState(10); // Countdown timer

    // console.log( CandidateConfig , 'this is Candidate Panel Config' );
    // console.log( config , 'this is  Config' );

    const CheckLogin = async () => {
        try {
            let response = await axios.post(`${config.API_URL}verifyExistingToken`, {
                token: config.API_TOKEN,
            });
            if (response.status === 200) {
                setTokenStatus(false); 
            } else {
                setTokenStatus(false);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setTokenStatus(true);
            }
        }
    };

    useEffect(() => {
        CheckLogin();
    }, [location]);

    useEffect(() => {
        if (tokenStatus) {
            const interval = setInterval(() => {
                setRedirectCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        handleLogout(); // Automatically redirect
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [tokenStatus]);

    const handleLogout = () => {
        localStorage.removeItem("admin_role_user");
        setTokenStatus(false);
        navigate("/login");
    };

    return (
        <>
            <Modal show={tokenStatus} centered className="sessionmodal">
                <Modal.Header>
                    <Modal.Title>Session Expired</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Your session has expired. You will be redirected to the login page in {redirectCountdown} seconds.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleLogout}>
                        Login Now
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ExpiredAlert;
