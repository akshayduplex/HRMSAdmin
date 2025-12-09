

import logo from '../images/logo.png';

let user = JSON.parse(localStorage.getItem('employeeLogin')) || {};

let config = {}
config['API_TOKEN'] = `${user?.token}`;

// sk-ws-01-9bbdQ58nldYs4ModU2ah3QLieefffsMFaKHWM3LhSm-sWWd8hTo_MnyeUoEpkvKm2SVYvy0w4qlejT9Nt3LhUadZnnKM_Q


// Stagging server Configuration
// config['BASE_URL'] = 'https://hrmsapis.dtsmis.in/';
// config['API_URL'] = 'https://hrmsapis.dtsmis.in/v1/employee/';
// config['CANDIDATE_URL'] = 'https://hrmsapis.dtsmis.in/v1/candidate/';
// config['PANEL_URL'] = 'https://hrmsapis.dtsmis.in/'
// config['IMAGE_PATH'] = 'https://hrmsapis.dtsmis.in/public/uploads/';
// config['IMAGE_PATH_EMP'] = 'https://hrmsapis.dtsmis.in/public/emp_uploads/';
// config['GLOB_API_URL'] = 'https://hrmsapis.dtsmis.in/v1/global/';
// config['LOGO_PATH'] = logo;

// Duplex server Configuration
// config['BASE_URL'] = 'https://syshrms.duplextech.com/';
// config['API_URL'] = 'https://hrapi.duplextech.com/v1/employee/';
// config['GLOB_API_URL'] = 'https://hrapi.duplextech.com/v1/global/';
// config['IMAGE_PATH'] = 'https://hrapi.duplextech.com/public/uploads/';
// config['CANDIDATE_URL'] = 'https://hrapi.duplextech.com/v1/candidate/';
// config['API_TOKEN'] = 'Bearer 744b365cde7bd714a928d5a04167a117';
// config['FRONT_URL'] = 'https://career.duplextech.com/';
// config['LOGO_PATH'] = 'https://res.cloudinary.com/duplex-tech/image/upload/v1689317653/newDuplex/setting/eviirl8exl9agdov3ej6.png'

// config['LOGO_PATH'] = logo;

config['COMPANY_NAME'] = 'HRMS WEB APP';  
config['PANEL_NAME'] = 'HR Login';
config['HELP_URL'] = 'support';
config['PRIVACY_URL'] = 'privacy-policy';
config['TERMS_URL'] = 'terms-conditions';
config['COMPANY_NAME'] = 'HLFPPT HRMS';

// Live server Configuration
config['BASE_URL'] = 'https://hrapi.hlfppt.org/';
config['API_URL'] = 'https://hrapi.hlfppt.org/v1/employee/';
config['PANEL_URL'] = 'https://hrapi.hlfppt.org/'
config['IMAGE_PATH'] = 'https://hrapi.hlfppt.org/public/uploads/';
config['API_TOKEN'] = 'Bearer 744b365cde7bd714a928d5a04167a117';
config['GLOB_API_URL'] = 'https://hrapi.hlfppt.org/v1/global/';
config['LOGO_PATH'] = logo;

export default config;