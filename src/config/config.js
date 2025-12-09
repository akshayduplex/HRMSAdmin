import logo from '../images/logo.png';

let config = {}

let user = JSON.parse(localStorage.getItem('admin_role_user')) || {};
let emp_login = JSON.parse(localStorage.getItem('employeeLogin')) || {};

config['API_TOKEN'] = user?.token ? `${user?.token}` : emp_login?.token;
config['size'] = 500;

//Stagging Server Config-
config['BASE_URL'] = 'https://hrmsapis.dtsmis.in/';
config['API_URL'] = 'https://hrmsapis.dtsmis.in/v1/admin/';
config['CANDIDATE_URL'] = 'https://hrmsapis.dtsmis.in/v1/candidate/';
config['PANEL_URL'] = 'https://hrmsapis.dtsmis.in/'
config['IMAGE_PATH'] = 'https://hrmsapis.dtsmis.in/public/uploads/';
config['IMAGE_PATH_EMP'] = 'https://hrmsapis.dtsmis.in/public/emp_uploads/';
config['GLOB_API_URL'] = 'https://hrmsapis.dtsmis.in/v1/global/';
config['GOOGLE_MAP_KEY'] = 'AIzaSyDjkMMcPgRXYBLKaUf6finQlPubrbNbvbw';
config['ceo_login'] = ['duplextechnology@gmail.com', 'anil@duplextech.com', 'dts.ramsmujh@gmail.com']
config['REACT_APP_API_DOMAIN'] = 'http://localhost:3001'
config['portal_url'] = 'https://jobs.hlfppt.org/'
config['LOGO_PATH'] = logo;

// duplex URL Configs
// config['BASE_URL'] = 'https://syshrms.duplextech.com/';
// config['API_URL'] = ' https://hrapi.duplextech.com/v1/admin/';
// config['GLOB_API_URL'] = 'https://hrapi.duplextech.com/v1/global/';
// config['IMAGE_PATH'] = 'https://hrapi.duplextech.com/public/uploads/';
// config['CANDIDATE_URL'] = 'https://hrapi.duplextech.com/v1/candidate/';
// config['FRONT_URL'] = ' https://career.duplextech.com/';
// config['LOGO_PATH'] = 'https://res.cloudinary.com/duplex-tech/image/upload/v1689317653/newDuplex/setting/eviirl8exl9agdov3ej6.png'
// config['COMPANY_NAME'] = 'Duplex Technologies Services Pvt. Ltd';  
// config['PANEL_NAME'] = 'Candidate Login';
// config['HELP_URL'] = 'https://duplextech.com/contact-us.html';
// config['PRIVACY_URL'] = 'https://duplextech.com/privacy-policy.html';
// config['TERMS_URL'] = 'https://duplextech.com/terms-and-conditions.html';
// config['GOOGLE_MAP_KEY'] = 'AIzaSyDjkMMcPgRXYBLKaUf6finQlPubrbNbvbw'; 
// config['ceo_login'] = ['duplextechnology@gmail.com']
// config['REACT_APP_API_DOMAIN'] = 'https://hrms.duplextech.com'
// config['portal_url'] = 'https://career.duplextech.com/'
// config['LOGO_PATH'] = logo;

// HRMS Live server config
// config['BASE_URL'] = 'https://hrapi.hlfppt.org/';
// config['API_URL'] = 'https://hrapi.hlfppt.org/v1/admin/';
// config['CANDIDATE_URL'] = 'https://hrapi.hlfppt.org/v1/candidate/';
// config['PANEL_URL'] = 'https://hrapi.hlfppt.org/'
// config['IMAGE_PATH'] = 'https://hrapi.hlfppt.org/public/uploads/';
// config['IMAGE_PATH_EMP'] = 'https://hrapi.hlfppt.org/public/uploads/emp_uploads/';
// config['GLOB_API_URL'] = 'https://hrapi.hlfppt.org/v1/global/';
// config['GOOGLE_MAP_KEY'] = 'AIzaSyDjkMMcPgRXYBLKaUf6finQlPubrbNbvbw';
// config['ceo_login'] = ['duplextechnology@gmail.com' , 'anil@duplextech.com' , 'sagarwal@hlfppt.org']
// config['REACT_APP_API_DOMAIN'] = 'https://hrms.hlfppt.org'
// config['portal_url'] = 'https://jobs.hlfppt.org/'
// config['LOGO_PATH'] = logo;
config['COMPANY_NAME'] = 'HRMS WEB APP';
config['PANEL_NAME'] = 'HRMS Login';
config['HELP_URL'] = 'support';
config['PRIVACY_URL'] = 'privacy-policy';
config['TERMS_URL'] = 'terms-conditions';
config['COMPANY_NAME'] = 'HLFPPT';
config['GOOGLE_MAP_KEY'] = 'AIzaSyDjkMMcPgRXYBLKaUf6finQlPubrbNbvbw';

export default config;
