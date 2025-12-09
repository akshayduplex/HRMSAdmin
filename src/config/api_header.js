const apiHeaderToken = (token) => {

    let user = JSON.parse(localStorage.getItem('admin_role_user')) || {};
    let emp_login = JSON.parse(localStorage.getItem('employeeLogin')) || {};

    const tokenFrom = user?.token ? `${user?.token}` : emp_login?.token;

    return {
        headers: {
            'Content-Type': 'application/json',
            // 'hrms_secret_key': `Bearer ${token}` ,
            'authorization': `Bearer ${token || tokenFrom}`,
            'origin': 'http://localhost'
        }
    }
}

const apiHeaderTokenMultiPart = (token) => {
    let user = JSON.parse(localStorage.getItem('admin_role_user')) || {};
    let emp_login = JSON.parse(localStorage.getItem('employeeLogin')) || {};
    const tokenFrom = user?.token ? `${user?.token}` : emp_login?.token;
    return {
        headers: {
            'Content-Type': 'multipart/form-data',
            // 'hrms_secret_key': `Bearer ${token}` ,
            'authorization': `Bearer ${token || tokenFrom}`,
            'origin': 'http://localhost'
        }
    }
}


export { apiHeaderToken, apiHeaderTokenMultiPart };