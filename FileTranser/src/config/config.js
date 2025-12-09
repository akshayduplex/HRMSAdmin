import logo from '../images/logo.png';

let config = {}
//Development
// config['BASE_URL'] = 'http://domain.com/';
// config['API_URL'] = 'http://localhost:8080/v1/admin/';
// config['IMAGE_PATH'] = 'http://localhost:8080/public/uploads/';

//Live
config['BASE_URL'] = 'https://api-hrms.dtsmis.in:3008/';
config['API_URL'] = 'https://api-hrms.dtsmis.in:3008/v1/admin/';
config['PANEL_URL'] = 'https://api-hrms.dtsmis.in:3008/'
config['IMAGE_PATH'] = 'https://api-hrms.dtsmis.in:3008/public/uploads/';
config['API_TOKEN'] = 'Bearer 744b365cde7bd714a928d5a04167a117';
// config['BASE_URL'] = 'https://151c-2405-201-6013-583c-606f-eda3-68c8-db23.ngrok-free.app/';
// config['API_URL'] = 'https://151c-2405-201-6013-583c-606f-eda3-68c8-db23.ngrok-free.app/v1/admin/';
// config['PANEL_URL'] = 'https://151c-2405-201-6013-583c-606f-eda3-68c8-db23.ngrok-free.app/'
// config['IMAGE_PATH'] = 'https://151c-2405-201-6013-583c-606f-eda3-68c8-db23.ngrok-free.app/';
// config['API_TOKEN'] = 'Bearer 744b365cde7bd714a928d5a04167a117';

config['LOGO_PATH'] = logo;

config['COMPANY_NAME'] = 'HRMS WEB APP';  
config['PANEL_NAME'] = 'HR Login';
config['HELP_URL'] = 'support';
config['PRIVACY_URL'] = 'privacy-policy';
config['TERMS_URL'] = 'terms-conditions';
config['COMPANY_NAME'] = 'HLFPPT Pvt Ltd.';

export default config;