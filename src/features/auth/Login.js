import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './authSlice';
import { useNavigate } from 'react-router-dom';

import config from '../../config/config';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Loader from '../loader/Loader';
import { toast } from 'react-toastify';


const Login = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { loading, error } = useSelector((state) => state.auth);

  // when page in mount clear the All session and exsting cookkes and localstore

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      return toast.warning('Please Enter Email ID')
    } else {
      dispatch(login({ email_id: email })).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success(result.payload.message || "OTP has been send your Registered Email Id")
          navigate('/verify-otp');
        } else {
          return toast.warning(error ? error : result.payload.message)
        }
      });
    }
  };


  return (
    <>
      <div className="container">
        <div className="loginwrapper">
          <div className={`logincard`}>
            <div className="leftlogin">
              <img src={config.LOGO_PATH} alt="logo" />
              <h5>HRMS Portal</h5>
            </div>
            <div className="rightlogin">
              <h3>Login Here</h3>
              <Form className="logform" >
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Enter Email ID</Form.Label>
                  <div className="inputwrp">
                    <Form.Control type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder={`xyz@domain.com`} />
                    <MailOutlineIcon />
                  </div>
                </Form.Group>
                <Button onClick={handleSubmit} disabled={loading} className="mt-4 formbtn btnright" variant="primary" type="submit">
                  {loading ? <Loader /> : 'Login'}
                </Button>
              </Form>
            </div>
          </div>
          <div className="sitelinks">
            <ul>
              <li><a href={config.HELP_URL}>Help</a></li>
              <li><a href={config.PRIVACY_URL}>Privacy</a></li>
              <li><a href={config.TERMS_URL}>Terms</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
