// AppointmentLetter.jsx
import React from 'react';

const AppointmentLetter = ({
    projectName = '',
    date = '',
    employeeName = '',
    relationship = 'S/O',
    address = '',
    designation = '',
    project = '',
    location = '',
    joiningDate = '',
    contractExpiryDate = '',
    reportingTo = '',
    reportingLocation = '',
    annualGrossSalary = '',
    basicSalary = '',
    monthlyGross = '',
    pfContribution = '',
    workmenCompensation = '',
    gratuity = '',
    totalCTC = ''
}) => {
    return (
        <div className="appointment-letter" style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.5', fontSize: '12pt' }}>
            <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' }}>
                <p>HLFPPT/HR/<span style={{ backgroundColor: '#ffff00' }}>{projectName}</span>/EC- <span style={{ backgroundColor: '#ffff00' }}>{date}</span></p>
            </div>

            <p><span style={{ backgroundColor: '#ffff00' }}>{employeeName}</span>,</p>
            <p>[<span style={{ backgroundColor: '#ffff00' }}>{relationship}</span>]</p>
            <p><span style={{ backgroundColor: '#ffff00' }}>{address}</span></p>

            <div style={{ textAlign: 'center', fontWeight: 'bold', margin: '30px 0' }}>
                <p style={{ textDecoration: 'underline' }}>SUBJECT: OFFER CUM APPOINTMENT LETTER ON FIXED TERM CONTRACT WITH</p>
                <p style={{ textDecoration: 'underline' }}>HINDUSTAN LATEX FAMILY PLANNING PROMOTION TRUST</p>
            </div>

            <p><strong>Dear <span style={{ backgroundColor: '#ffff00' }}>{employeeName}</span>,</strong></p>

            <p>Welcome to HLFPPT!</p>

            <p style={{ textAlign: 'justify' }}>
                We are pleased to offer you appointment as
                <span style={{ backgroundColor: '#ffff00' }}> {designation}, {project}, {location}</span>
                on a contractual basis for a fixed term with effect from
                <span style={{ backgroundColor: '#ffff00' }}> {joiningDate}</span> to
                <span style={{ backgroundColor: '#ffff00' }}> {contractExpiryDate}</span>
                (or till the completion of the project whichever is earlier) so as to render your services to
                <strong>H</strong>industan <strong>L</strong>atex <strong>F</strong>amily <strong>P</strong>lanning
                <strong>P</strong>romotion <strong>T</strong>rust (abbreviated as HLFPPT). This Appointment offer letter
                will be void in case you fail to join on <span style={{ backgroundColor: '#ffff00' }}>{joiningDate}</span>.
                You will be on probation for a period of <span style={{ backgroundColor: '#ffff00' }}>Six months</span>,
                during which period your performance will be closely watched. In the course of the work, periodic reviews,
                and regularly reporting is required to be made to
                <span style={{ backgroundColor: '#ffff00' }}> {reportingTo}, {reportingLocation}</span>.
            </p>

            <p style={{ textAlign: 'justify' }}>
                Just as it gives us pleasure in bringing you into our fold, we wish to share with you the detailed terms
                and conditions of employment and employee related guidelines applicable to all employees of HLFPPT.
            </p>

            <p>We wish the very best for you in your career with us.</p>

            <p style={{ fontWeight: 'bold' }}>Terms and conditions of employment:</p>

            <ol style={{ textAlign: 'justify' }}>
                <li>
                    It has been communicated and agreed that your appointment is purely on a contractual basis and for the
                    aforesaid fixed period, on expiry of which, your appointment and contract between us will cease and come
                    to an end automatically, without any necessity of our giving you any notice or notice pay and without any
                    liability on our part to pay you any retrenchment or other compensation or other amounts whatsoever.
                    However, based on your performance, and the extension of the project, your contract can be reviewed for
                    further extension. This is however, not obligatory on the part of the organization.
                </li>
                <li>
                    You will have no right or lien on or in respect of the job or position to which you are temporarily
                    appointed or any other job or position either in HLFPPT or in HLL, and that HLFPPT or HLL will not be
                    obliged to in any manner or any account to offer you any regular or permanent employment in such job or
                    position, even if there is any vacancy.
                </li>
                <li>
                    Your appointment is subject to your being certified to be medically fit by any registered medical practitioner.
                </li>
                <li>
                    During your appointment pursuant hereto, you will be required to do work as per the duty hours prescribed
                    for <span style={{ backgroundColor: '#ffff00' }}>{project}</span> based at
                    <span style={{ backgroundColor: '#ffff00' }}> {location}</span>, or as may be advised by us keeping in
                    view the requirements of the organization.
                </li>
                <li>
                    During your appointment as <span style={{ backgroundColor: '#ffff00' }}>{designation}, {project}, {location}</span>
                    for a fixed term you will be entitled for a annual gross salary of
                    <span style={{ backgroundColor: '#ffff00' }}> {annualGrossSalary}</span> per annum.
                </li>
                <li>
                    You will be entitled for PF Contribution at the rate of 12% of the basic salary and an equal amount would
                    be deducted by your basic salary as per the PF rules & regulations, as per break-up given in Annexure.
                </li>
                <li>
                    Since you are not a permanent employee of the Organization, you will not be entitled to any of the
                    Statutory Benefit plans such as LTA, Superannuation etc. The remuneration paid to you by the project is
                    a matter purely between you and the organization and you shall maintain all information regarding your
                    remuneration as personal and confidential.
                </li>
                <li>
                    Your initial posting will be at <span style={{ backgroundColor: '#ffff00' }}>{location}</span> but your
                    services during the period of your assignment are transferable to any other site, etc. of HLFPPT or its
                    Project deployed anywhere in India, in accordance with the project's concerned policy and rules for the
                    time being in force.
                </li>
                <li>
                    Based on your performance, you will be eligible for annual increments in salary, which will be communicated to you.
                </li>
                <li>
                    This appointment is made on the basis of and relying on the particulars and personal data submitted by
                    you at the time of Interview and joining and will be deemed to be void ab initio in the event of any such
                    particulars or data being false or incorrect. You shall inform the Human Resource Department, HLFPPT of
                    any changes in such particulars of the data within <strong>three days of any such change.</strong>
                </li>
                <li>
                    You shall, during the period of your contractual appointment pursuant hereto, devote your whole time and
                    attention to the work entrusted to you and shall not engage yourself directly or indirectly in any other
                    business, work or service.
                </li>
                <li>
                    All information pertaining to the organization / its project, affairs, operations and employees of the
                    organization/project will be deemed to be secret and confidential and shall be maintained as such by you
                    and your appointment pursuant hereto will be subject to your executing with the organization/project on
                    your accepting this offer of temporary appointment, a formal agreement with regard to the maintenance of
                    such secrecy and confidentiality and with regard to intellectual property rights etc. You will also keep
                    us duly informed of any confidentiality agreement entered into by you with your previous employers or any
                    others and keep us indemnified and harmless against any breach thereof by you and any consequences of any
                    such breach.
                </li>
                <li>
                    You will abide by all the applicable Service Rules and Regulations of HLFPPT/its Project, including its
                    personal conduct guidelines, in force from time to time, which you are deemed to have read, understood
                    and agreed. The organization will have the right to vary or modify the same or all or any of the terms
                    and conditions of your temporary appointment at any time, which will be binding on you, in the former case
                    upon such variation or modification being made, and in the later case on our giving you notice of such
                    variation of modification.
                </li>
                <li>
                    Your appointment and service pursuant hereto may be terminated by either of us by giving to each other
                    <span style={{ backgroundColor: '#ffff00', textDecoration: 'underline' }}> One-month</span> written notice
                    or by paying <span style={{ backgroundColor: '#ffff00', textDecoration: 'underline' }}>One-month</span>
                    Salary (Basic plus HRA) in lieu of such notice. However, in event of your giving such notice to the
                    organization, we shall have the right to accept the same from the date prior to the expiry of the notice
                    period. On acceptance of any notice of termination by the organization, you shall not be entitled to withdraw.
                </li>
                <li>
                    Notwithstanding anything herein contained, in the event of any breach by you of any of the terms and
                    conditions herein contained or of any Rules and Regulations of the organization, we will have the right
                    to terminate your appointment and service without any notice or notice pay or compensation whatsoever.
                </li>
                <li>
                    The tribunals and courts in Trivandrum will have the exclusive jurisdiction in respect of all matters
                    pertaining to your contractual agreement with HLFPPT.
                </li>
                <li>
                    Please sign on all the pages of the duplicate copy of the letter in token of your acceptance of the
                    terms and conditions herein contained and return it to us.
                </li>
            </ol>

            <p>Thanking You,</p>
            <p>Yours Sincerely,</p>

            <div style={{ marginTop: '50px' }}>
                <p>For <strong>HINDUSTAN LATEX FAMILY PLANNING PROMOTION TRUST</strong>,</p>
                <div style={{ marginTop: '30px' }}>
                    <p><strong>Awanish Awasthi</strong></p>
                    <p><strong>Associate National Lead- HR & Admin</strong></p>
                </div>
            </div>

            <div style={{ marginTop: '80px', borderTop: '1px solid #000', paddingTop: '20px' }}>
                <p>
                    I, _____________________________, have joined on _____________________solemnly declare that I have read
                    and understood thoroughly the rules of service and terms of appointment of my service, and I do hereby
                    agree with all terms as above and I shall abide by all general rules of service which are now or hereafter
                    to be in force and accordingly I accept the appointment of service with HLFPPT.
                </p>
                <p>Name: <span style={{ backgroundColor: '#ffff00' }}>{employeeName}</span></p>
                <p>Date: ________________ (Signature)</p>
            </div>

            {/* Annexure */}
            <div style={{ pageBreakBefore: 'always', marginTop: '40px' }}>
                <p style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Annexure</p>
                <p style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Detailed Salary Structure:</p>

                <p>Name: <span style={{ backgroundColor: '#ffff00' }}>{employeeName}</span></p>
                <p>Designation: <span style={{ backgroundColor: '#ffff00' }}>{designation}</span></p>

                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Monthly Component</th>
                            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Amount (in Rs.)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid #000', padding: '8px' }}><strong>Basic</strong></td>
                            <td style={{ border: '1px solid #000', padding: '8px' }}>
                                <span style={{ backgroundColor: '#ffff00' }}>{basicSalary}</span>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #000', padding: '8px' }}><strong>Monthly Gross</strong></td>
                            <td style={{ border: '1px solid #000', padding: '8px' }}>
                                <span style={{ backgroundColor: '#ffff00' }}>{monthlyGross}</span>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #000', padding: '8px' }}><strong>Annual Gross</strong></td>
                            <td style={{ border: '1px solid #000', padding: '8px' }}>
                                <span style={{ backgroundColor: '#ffff00' }}>{annualGrossSalary}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ textDecoration: 'underline', fontWeight: 'bold', marginTop: '30px' }}>Additional Benefits:</p>

                <p>
                    Company's Contribution towards PF (per annum) @ 12%....................................Rs.
                    <span style={{ backgroundColor: '#ffff00' }}>{pfContribution}</span>
                </p>
                <p>
                    Workmen Compensation Annual Premium....................................................Rs.
                    <span style={{ backgroundColor: '#ffff00' }}>{workmenCompensation}</span>
                </p>
                <p>
                    Gratuity @ 4.81% of Basic (Per annum) - Notional Pay...................................Rs.
                    <span style={{ backgroundColor: '#ffff00' }}>{gratuity}</span>
                </p>

                <p style={{ fontWeight: 'bold', marginTop: '20px' }}>
                    Total Annual Impact (CTC).......................................................................Rs.
                    <span style={{ backgroundColor: '#ffff00' }}>{totalCTC}</span>
                </p>

                <div style={{ marginTop: '50px' }}>
                    <p>Yours Sincerely,</p>
                    <p>For HLFPPT,</p>
                    <p><strong>Awanish Awasthi</strong></p>
                    <p><strong>Associate National Lead- HR & Admin</strong></p>
                </div>
            </div>
        </div>
    );
};

export default AppointmentLetter;