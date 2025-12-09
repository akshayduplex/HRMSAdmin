
import React, { useState } from "react";
import logo from './images/logo.png';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import OTPBox from "./components/Otp";
import config from "./config/Config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiHeaderToken } from "./config/ApiHeaders";
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner';

const Login = () => {
  const [firstDivVisible, setFirstDivVisible] = useState(true);
  const [secondDivVisible, setSecondDivVisible] = useState(false);
  const [className, setClassName] = useState('');
  const [email_id, setEmail_id] = useState('');
  const [loader, setLoader] = useState(false)

  const showSecondDiv = () => {
    setFirstDivVisible(false);
    setSecondDivVisible(true);
    setClassName('highlight');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email_id) {
      //toast("Please enter your email ID");
      toast.error("Please enter your email ID", {
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

    const payload = { email_id: email_id };

    setLoader(true);

    try {
      let response = await axios.post(`${config.API_URL}loginWithEmail`, payload, apiHeaderToken(config.API_TOKEN));
      console.log(response.data);
      showSecondDiv();
      // toast("Login is Successfully !");
    } catch (error) {
      console.error(error);
      toast.error("Invalid Login Details", {
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

  return (
    <>
      <div className="container">
        <div className="loginwrapper">
          <div className={`logincard ${className}`}>
            <div className="leftlogin">
              <img src={logo} alt="logo" />
              <h5>Interview Panel</h5>
            </div>
            <div className="rightlogin">
              <h3>Employee Login</h3>
              {firstDivVisible && (
                <Form className="logform" onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Enter Email ID</Form.Label>
                    <div className="inputwrp">
                      <Form.Control
                        type="email"
                        placeholder="xyz@gmail.com"
                        value={email_id}
                        onChange={(e) => setEmail_id(e.target.value)}

                      />
                      <MailOutlineIcon />
                    </div>
                  </Form.Group>
                  <Button className="mt-4 formbtn btnright" variant="primary" type="submit" disabled={loader}>
                    {loader ? <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    </> : "Login"}
                  </Button>
                </Form>
              )}
              {secondDivVisible && (
                <OTPBox email={email_id} />
              )}
            </div>
          </div>
          <div className="sitelinks">
            <ul>
              <li><a href="/">Help</a></li>
              <li><a href="/">Privacy</a></li>
              <li><a href="/">Terms</a></li>
            </ul>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Login;






