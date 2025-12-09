const apiHeaderToken = ( token )=>{
    return {
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}` ,
            'origin':'http://localhost'
        }
    }
  }

  const apiHeaderTokenMultiPart = ( token )=>{
    return {
        headers: {
            'Content-Type': 'multipart/form-data',
            'authorization': `Bearer ${token}` ,
            'origin':'http://localhost'
        }
    }
  }

  
  export { apiHeaderToken , apiHeaderTokenMultiPart }