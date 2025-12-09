import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

const BootstrapProgressBar = ({ value, actualvalue }) => {
    return (
        <>
            <div className='barbox'>
                <ProgressBar now={value} />
                <label>{actualvalue}</label>
            </div>
        </>
    );
};

export default BootstrapProgressBar;
