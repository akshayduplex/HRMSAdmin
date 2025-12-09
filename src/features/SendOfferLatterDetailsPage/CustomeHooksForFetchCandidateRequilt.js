import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiHeaderToken } from '../../config/api_header';
import config from '../../config/config';

const useUserDetails = (userId) => {
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!userId) {
                return;
            }

            try {

                const response = await axios.post(
                    `${config.API_URL}getRoleUserById`,
                    {"_id":userId , scope_fields:['special_permissions'] },
                    apiHeaderToken(config.API_TOKEN)
                );

                if (response.status === 200) {
                    setUserDetails(response.data?.data);
                } else {
                }
            } catch (error) {

                console.log( error );

            } 
        };

        fetchUserDetails();
    }, [userId]);
    return {
        userDetails,
    };
};

export default useUserDetails;