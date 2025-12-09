import React from 'react';
import PayrollDoughnut from './PaylodsDoutnus';

const StepsFive = () => {
    return (
        <>
            <div className='steppr_content_wrap' data-aos="fade-in" data-aos-duration="3000">
                <h4>Payroll Submitted for <span>Project</span></h4>
                <div className='row'>
                    <div className='col-sm-4'>
                        <div className='pay_succard'>
                            <h4>₹ 11,67,000.00</h4>
                            <span>Total Payroll</span>
                        </div>
                    </div>
                    <div className='col-sm-4'>
                        <div className='pay_succard'>
                            <h4>29 March 2024</h4>
                            <span>Payroll Draft Date</span>
                        </div>
                    </div>
                    <div className='col-sm-4'>
                        <div className='pay_succard'>
                            <h4>10 April 2024</h4>
                            <span>Payroll Payment Date</span>
                        </div>
                    </div>
                </div>
                <div className='sitecard'>
                    <h4>Complete Payroll Report</h4>
                    <div className='chart_btn'>
                        <PayrollDoughnut />
                        <div className='report_bt'>
                            <button>View Full Report</button>
                        </div>
                    </div>
                </div>
                <div className='finalbtn'>
                    <button className='sitebluebtn'>Finish Payroll</button>
                </div>
            </div>
        </>
    );
};

export default StepsFive;
