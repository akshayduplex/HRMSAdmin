import React from 'react';
import payment from "../../images/payment.png";

const StepFour = () => {
    return (
        <>
            <div className='steppr_content_wrap' data-aos="fade-in" data-aos-duration="3000">
                <h4>Review Payroll</h4>
                <div className='sitecard detail_paymnt'>
                    <div className='dtl_left'>
                        <h3>Detail Payment</h3>
                        <div className='dflexbtwn'>
                            <p>Total Net Payable</p>
                            <p>₹ 11,67,000.00</p>
                        </div>
                        {/* <div className='dflexbtwn'>
                            <p>Total Company Taxes</p>
                            <p>₹ 17,000.00</p>
                        </div> */}
                        <div className='dflexbtwn'>
                            <p>Total Reimbursement</p>
                            <p>₹ 0</p>
                        </div>
                        {/* <div className='dflexbtwn'>
                            <p>Total Company Benefits</p>
                            <p>₹ 25,300.00</p>
                        </div> */}
                        <div className='ttlpay'>
                            <div className='dflexbtwn'>
                                <p>Total Payroll</p>
                                <p>₹ 11,67,000.00</p>
                            </div>
                        </div>
                    </div>
                    <div className='dtl_img'>
                        <div className='sitecard'>
                            <img src={payment} />
                            <h6>Payroll Summary</h6>
                            {/* <a href='#'>View Summary</a> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StepFour;
