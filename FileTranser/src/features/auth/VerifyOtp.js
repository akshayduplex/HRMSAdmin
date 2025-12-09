import React, { useEffect, useState , useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, verifyOtp } from './authSlice';
import { useNavigate } from 'react-router-dom';

import ReplayIcon from '@mui/icons-material/Replay';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import config from '../../config/config';
import Loader from '../loader/Loader';
import { toast } from 'react-toastify';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const inputsRef = useRef([]);
  const [email, setEmail] = useState('');
  const [className, setClassName] = useState('');
  
  const [text, setText] = useState(''); 
  const [seconds, setSeconds] = useState(59);
  const [showResend, setShowResend] = useState(false);
  
  const [verified, setVerified] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth); 

  const handleVerifyOtp = (e) => {
    e.preventDefault(); 
    
    if( !verified ){
      return toast.warning('Please enter 4 digit OTP')
    }

    let combineOtp = otp.join(''); 
    let apiPayload = {
      email_id: email,
      otp : combineOtp,
      login_device : 'web' 
    }

    dispatch(verifyOtp( apiPayload )).then((result) => { 
        if (result.meta.requestStatus === 'fulfilled') {
          navigate('/dashboard');
        }else{
          return toast.error(error?error:result.payload.message)
        } 
    });
  };


  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextSibling) {
        element.nextSibling.focus();
    }
    if (newOtp.every((digit) => digit !== "")) {
        setVerified(true);
    } else {
        setVerified(false);
    } 
};

useEffect(() => {
  let checkLoginData = localStorage.getItem('admin_check_login');
  if( checkLoginData ){
    setEmail( JSON.parse(checkLoginData).email_id );
  }else{
    navigate('/login');
  } 

  setClassName('highlight');
  setText('Verify');

  const timer = setInterval(() => {
    setSeconds((prevSeconds) => {
      if (prevSeconds > 0) {
        return prevSeconds - 1;
      } else {
        clearInterval(timer);
        setShowResend(true);
        return 0;
      }
    });
  }, 1000);

  return () => clearInterval(timer); 

}, [seconds,navigate]);


const handleResendOTPSubmit = () => {
  if( !email ){
    return toast.warning("Please Enter Email ID")
  }else{
    dispatch(login({ email_id: email })).then((result) => {  
      if (result.meta.requestStatus === 'fulfilled') { 
        return toast.success(result.payload.message)
      }else{
        return toast.error(error?error:result.payload.message)
      }  
    });
 }
};


const handleResend = () => {
  setSeconds(59); 
  if( showResend ){ handleResendOTPSubmit(); } 
  setShowResend(false);
};

const handleKeyDown = (e, index) => {
  if (e.key === 'Backspace' && index > 0 && !e.target.value) {
    inputsRef.current[index - 1].focus();
    const newOtp = [...otp];
    newOtp[index] = '';
    setOtp(newOtp);
  } 
};

  return (
    <>
    <div className="container">
        <div className="loginwrapper">
          <div className={`logincard ${className}`}>
            <div className="leftlogin">
              <img src={config.LOGO_PATH} alt="logo" />
              <h5>{config.PANEL_NAME}</h5>
            </div>
            <div className="rightlogin">
              <h3>{config.PANEL_NAME}</h3> 
                <Form className="logform">
                    <Form.Label>Enter OTP sent to your email ID</Form.Label>  <br />
                    {otp.map((data, index) => {
                        return (
                            <input
                                className="otp-field"
                                type="text"
                                name="otp"
                                maxLength="1"
                                key={index}
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onFocus={e => e.target.select()}
                                ref={(el) => (inputsRef.current[index] = el)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                
                            />
                        );
                    })}
                    <p className="resend mt-3">Resend OTP in <span className="timer">{seconds ? `${seconds} Seconds` : null} { showResend ? <ReplayIcon onClick={handleResend} /> : null }</span> </p>
                    <div className="btnright btnicon mt-4 ">
                    {text === "Verified" ?  <CheckCircleIcon /> : null }
                      
                        <Button onClick={handleVerifyOtp} className="formbtn" variant="primary" disabled={loading} > { loading ? <Loader/> : text } </Button>
                    </div>
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

export default VerifyOtp;
