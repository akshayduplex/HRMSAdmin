import React from 'react';
import { useNavigate  } from 'react-router-dom';
import { BiArrowBack } from "react-icons/bi";

const GoBackButton = () => {
    const navigate = useNavigate ();

    const goBack = () => {
        navigate(-1); ;
    };

    return (
        <div className="backbtn mt-3 mb-2">
            <button onClick={goBack}><BiArrowBack /> </button>
        </div>
    );
};

export default GoBackButton;
