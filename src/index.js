import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'bootstrap/dist/css/bootstrap.min.css';
import "animate.css/animate.compat.css"
import 'aos/dist/aos.css';

import './css/attendance.css';

import './css/index.css';
import './css/hr.css';
import './css/payroll.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
