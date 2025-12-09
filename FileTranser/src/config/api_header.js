const apiHeaderToken = ( token )=>{
    return {
        headers: {
            'Content-Type': 'application/json',
            'hrms_secret_key': `Bearer ${token}` 
        }
    }
  }

  const apiHeaderTokenMultiPart = ( token )=>{
    return {
        headers: {
            'Content-Type': 'multipart/form-data',
            'hrms_secret_key': `Bearer ${token}` 
        }
    }
  }

  
  export { apiHeaderToken, apiHeaderTokenMultiPart };