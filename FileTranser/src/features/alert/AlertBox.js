import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideAlert } from '../../features/alert/alertSlice';
import '../../css/AlertBox.css';

const ALERT_TIME = 5000;

const AlertBox = () => {
  const dispatch = useDispatch();
  const { message, type, isVisible } = useSelector((state) => state.alert);

  if (!isVisible) return null;

  setTimeout( ()=>{
    dispatch(hideAlert());
  }, ALERT_TIME );

  return (
    <div className={`alert-box ${type}`}>
      <span>{"message"}</span>
      {/* <button onClick={() => dispatch(hideAlert())}>Close</button> */}
    </div>
  );
};

export default AlertBox;
