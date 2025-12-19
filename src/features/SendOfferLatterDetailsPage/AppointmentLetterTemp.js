// AppointmentLetter.jsx
import React from 'react';
import { letterStyles, LetterHeader, LetterFooter, Highlight } from './components/LetterComponents';

export const AppointmentLetter = ({ data }) => {
    // Format date properly
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const documentDate = data?.date ? formatDate(data.date) : formatDate(new Date());

    return (
        <div style={{
            ...letterStyles.page,
            padding: '15mm 20mm', // Reduced top padding for print optimization
            width: '210mm',
            height: 'auto',
            minHeight: '297mm'
        }}>
            {/* Main container for print layout */}
            <div style={{ height: '100%' }}>
                {/* Page 1 */}
                <div style={{
                    minHeight: '267mm', // A4 height minus padding
                    marginBottom: '0',
                    position: 'relative'
                }}>
                    {/* Header - Print optimized */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '15px',
                        borderBottom: '2px solid #000',
                        paddingBottom: '8px'
                    }}>
                        <h3 style={{
                            margin: '0 0 5px 0',
                            fontSize: '16pt',
                            fontFamily: "'Times New Roman', Times, serif",
                            fontWeight: 'bold',
                            color: '#000'
                        }}>
                            {data?.webSettingData?.meta_title || 'HINDUSTAN LATEX FAMILY PLANNING PROMOTION TRUST'}
                        </h3>
                        <p style={{
                            margin: '0',
                            fontSize: '10pt',
                            fontFamily: "'Times New Roman', Times, serif",
                            color: '#000'
                        }}>
                            {data?.webSettingData?.office_address || 'B-14 A, IInd Floor, Sector - 62, Gautam Budh Nagar, Noida-201301'}
                        </p>
                    </div>

                    {/* Reference and Date */}
                    <div style={{
                        textAlign: 'right',
                        marginTop: '10px',
                        marginBottom: '25px',
                        fontSize: '11pt',
                        fontFamily: "'Times New Roman', Times, serif"
                    }}>
                        <p style={{ margin: '0 0 5px 0' }}>
                            <strong>HLFPPT/HR/<Highlight text={data?.projectName} />/EC-<Highlight text={data?.ecNumber} /></strong>
                        </p>
                        <p style={{ margin: '0' }}>
                            <strong>Date: <Highlight text={documentDate} /></strong>
                        </p>
                    </div>

                    {/* Recipient Address */}
                    <div style={{
                        marginBottom: '30px',
                        fontSize: '11pt',
                        fontFamily: "'Times New Roman', Times, serif"
                    }}>
                        <p style={{ margin: '0 0 5px 0' }}>
                            <strong><Highlight text={data?.employeeName} />,</strong>
                        </p>
                        <p style={{ margin: '0 0 5px 0' }}>
                            <strong>W/O, S/O, D/O- <Highlight text={data?.relativeName} /></strong>
                        </p>
                        <p style={{ margin: '0 0 15px 0' }}>
                            <strong>Address- <Highlight text={data?.address} /></strong>
                        </p>
                    </div>

                    {/* Subject Line */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '25px',
                        fontFamily: "'Times New Roman', Times, serif"
                    }}>
                        <h2 style={{
                            textDecoration: 'underline',
                            margin: '0 0 5px 0',
                            fontSize: '12pt',
                            fontWeight: 'bold'
                        }}>
                            SUBJECT: OFFER CUM APPOINTMENT LETTER ON FIXED TERM CONTRACT WITH
                        </h2>
                        <h2 style={{
                            textDecoration: 'underline',
                            margin: '0',
                            fontSize: '12pt',
                            fontWeight: 'bold'
                        }}>
                            HINDUSTAN LATEX FAMILY PLANNING PROMOTION TRUST
                        </h2>
                    </div>

                    {/* Salutation */}
                    <div style={{
                        marginBottom: '15px',
                        fontSize: '11pt',
                        fontFamily: "'Times New Roman', Times, serif"
                    }}>
                        <p style={{ margin: '0 0 10px 0' }}>
                            <strong>Dear <Highlight text={`Mr./Ms. ${data?.employeeName}`} />,</strong>
                        </p>
                    </div>

                    {/* Welcome Paragraph */}
                    <div style={{
                        marginBottom: '15px',
                        textAlign: 'justify',
                        fontSize: '11pt',
                        fontFamily: "'Times New Roman', Times, serif",
                        lineHeight: '1.5'
                    }}>
                        <p style={{ margin: '0 0 15px 0' }}>
                            <strong>Welcome to HLFPPT!</strong>
                        </p>

                        <p style={{ margin: '0 0 15px 0' }}>
                            We are pleased to offer you appointment as <strong><Highlight text={data?.designation} /></strong>,
                            <strong><Highlight text={data?.projectName} /></strong>, <strong><Highlight text={data?.location} /></strong>
                            on a contractual basis for a fixed term with effect from <strong><Highlight text={formatDate(data?.joiningDate)} /></strong>
                            to <strong><Highlight text={formatDate(data?.contractExpiryDate)} /></strong> (or till the completion of the project
                            whichever is earlier) so as to render your services to <strong>Hindustan Latex Family Planning Promotion Trust</strong>
                            (abbreviated as HLFPPT). This Appointment offer letter will be void in case you fail to join on
                            <strong><Highlight text={formatDate(data?.joiningDate)} /></strong>. You will be on probation for a period of
                            <strong><Highlight text="Six months" /></strong>, during which period your performance will be closely watched.
                            In the course of the work, periodic reviews, and regularly reporting is required to be made to
                            <strong><Highlight text={data?.reportingTo} /></strong>, <strong><Highlight text={data?.location} /></strong>.
                        </p>

                        <p style={{ margin: '15px 0 15px 0' }}>
                            Just as it gives us pleasure in bringing you into our fold, we wish to share with you the
                            detailed terms and conditions of employment and employee related guidelines applicable to
                            all employees of HLFPPT.
                        </p>

                        <p style={{ margin: '15px 0 20px 0' }}>
                            We wish the very best for you in your career with us.
                        </p>

                        {/* Terms and Conditions Title */}
                        <h3 style={{
                            textDecoration: 'underline',
                            margin: '20px 0 10px 0',
                            fontSize: '12pt',
                            fontWeight: 'bold'
                        }}>
                            Terms and conditions of employment:
                        </h3>
                    </div>

                    {/* Terms and Conditions List - First 4 items */}
                    <div style={{
                        textAlign: 'justify',
                        fontSize: '11pt',
                        fontFamily: "'Times New Roman', Times, serif",
                        lineHeight: '1.5'
                    }}>
                        <ol style={{ paddingLeft: '25px', margin: '0' }}>
                            <li style={{ marginBottom: '12px' }}>
                                It has been communicated and agreed that your appointment is purely on a contractual
                                basis and for the aforesaid fixed period, on expiry of which, your appointment and
                                contract between us will cease and come to an end automatically, without any necessity
                                of our giving you any notice or notice pay and without any liability on our part to
                                pay you any retrenchment or other compensation or other amounts whatsoever. However,
                                based on your performance, and the extension of the project, your contract can be
                                reviewed for further extension. This is however, not obligatory on the part of the
                                organization.
                            </li>

                            <li style={{ marginBottom: '12px' }}>
                                You will have no right or lien on or in respect of the job or position to which you are
                                temporarily appointed or any other job or position either in HLFPPT or in HLL, and that
                                HLFPPT or HLL will not be obliged to in any manner or any account to offer you any
                                regular or permanent employment in such job or position, even if there is any vacancy.
                            </li>
                        </ol>
                    </div>
                </div>

                {/* Page Break for Page 2 */}
                <div style={{
                    pageBreakBefore: 'always',
                    height: '297mm',
                    paddingTop: '15mm',
                    position: 'relative'
                }}>
                    {/* Continue Terms and Conditions */}
                    <div style={{
                        textAlign: 'justify',
                        fontSize: '11pt',
                        fontFamily: "'Times New Roman', Times, serif",
                        lineHeight: '1.5',
                        paddingTop: '20px'
                    }}>
                        <ol start="3" style={{ paddingLeft: '25px', margin: '0' }}>
                            <li style={{ marginBottom: '12px' }}>
                                Your appointment is subject to your being certified to be medically fit by any registered
                                medical practitioner.
                            </li>

                            <li style={{ marginBottom: '12px' }}>
                                During your appointment pursuant hereto, you will be required to do work as per the duty
                                hours prescribed for <strong><Highlight text={data?.projectName} /></strong> based at
                                <strong><Highlight text={data?.location} /></strong>, or as may be advised by us keeping
                                in view the requirements of the organization.
                            </li>

                            <li style={{ marginBottom: '12px' }}>
                                During your appointment as <strong><Highlight text={data?.designation} /></strong>,
                                <strong><Highlight text={data?.projectName} /></strong>, <strong><Highlight text={data?.location} /></strong>
                                for a fixed term you will be entitled for a annual gross salary of
                                <strong><Highlight text={data?.annualGrossSalaryWords} /></strong> per annum.
                            </li>

                            <li style={{ marginBottom: '12px' }}>
                                You will be entitled for PF Contribution at the rate of 12% of the basic salary and an
                                equal amount would be deducted by your basic salary as per the PF rules & regulations,
                                as per break-up given in Annexure.
                            </li>

                            <li style={{ marginBottom: '12px' }}>
                                Since you are not a permanent employee of the Organization, you will not be entitled to
                                any of the Statutory Benefit plans such as LTA, Superannuation etc. The remuneration
                                paid to you by the project is a matter purely between you and the organization and you
                                shall maintain all information regarding your remuneration as personal and confidential.
                            </li>

                            <li style={{ marginBottom: '12px' }}>
                                Your initial posting will be at <strong><Highlight text={data?.location} /></strong> but
                                your services during the period of your assignment are transferable to any other site, etc.
                                of HLFPPT or its Project deployed anywhere in India, in accordance with the project's
                                concerned policy and rules for the time being in force.
                            </li>
                        </ol>
                    </div>
                </div>

                {/* Page Break for Page 3 */}
                <div style={{
                    pageBreakBefore: 'always',
                    height: '297mm',
                    paddingTop: '15mm',
                    position: 'relative'
                }}>
                    {/* Continue Terms and Conditions */}
                    <div style={{
                        textAlign: 'justify',
                        fontSize: '11pt',
                        fontFamily: "'Times New Roman', Times, serif",
                        lineHeight: '1.5',
                        paddingTop: '20px'
                    }}>
                        <ol start="9" style={{ paddingLeft: '25px', margin: '0 0 20px 0' }}>
                            <li style={{ marginBottom: '12px' }}>
                                Based on your performance, you will be eligible for annual increments in salary, which
                                will be communicated to you.
                            </li>

                            <li style={{ marginBottom: '12px' }}>
                                This appointment is made on the basis of and relying on the particulars and personal
                                data submitted by you at the time of Interview and joining and will be deemed to be
                                void ab initio in the event of any such particulars or data being false or incorrect.
                                You shall inform the Human Resource Department, HLFPPT of any changes in such particulars
                                of the data within <strong>three days</strong> of any such change.
                            </li>

                            <li style={{ marginBottom: '12px' }}>
                                You shall, during the period of your contractual appointment pursuant hereto, devote
                                your whole time and attention to the work entrusted to you and shall not engage yourself
                                directly or indirectly in any other business, work or service.
                            </li>

                            <li style={{ marginBottom: '12px' }}>
                                All information pertaining to the organization / its project, affairs, operations and
                                employees of the organization/project will be deemed to be secret and confidential and
                                shall be maintained as such by you and your appointment pursuant hereto will be subject
                                to your executing with the organization/project on your accepting this offer of temporary
                                appointment, a formal agreement with regard to the maintenance of such secrecy and
                                confidentiality and with regard to intellectual property rights etc. You will also keep
                                us duly informed of any confidentiality agreement entered into by you with your previous
                                employers or any others and keep us indemnified and harmless against any breach thereof
                                by you and any consequences of any such breach.
                            </li>

                            <li style={{ marginBottom: '12px' }}>
                                You will abide by all the applicable Service Rules and Regulations of HLFPPT/its Project,
                                including its personal conduct guidelines, in force from time to time, which you are deemed
                                to have read, understood and agreed. The organization will have the right to vary or modify
                                the same or all or any of the terms and conditions of your temporary appointment at any time,
                                which will be binding on you, in the former case upon such variation or modification being
                                made, and in the later case on our giving you notice of such variation of modification.
                            </li>
                        </ol>
                    </div>
                </div>

                {/* Page Break for Page 4 */}
                <div style={{
                    pageBreakBefore: 'always',
                    height: '297mm',
                    paddingTop: '15mm',
                    position: 'relative'
                }}>
                    {/* Continue Terms and Conditions */}
                    <div style={{
                        textAlign: 'justify',
                        fontSize: '11pt',
                        fontFamily: "'Times New Roman', Times, serif",
                        lineHeight: '1.5',
                        paddingTop: '20px'
                    }}>
                        <ol start="14" style={{ paddingLeft: '25px', margin: '0 0 20px 0' }}>
                            <li style={{ marginBottom: '12px' }}>
                                Your appointment and service pursuant hereto may be terminated by either of us by giving
                                to each other <strong><Highlight text="One- month" /></strong> written notice or by paying
                                <strong><Highlight text="One- month" /></strong> Salary (Basic plus HRA) in lieu of such
                                notice. However, in event of your giving such notice to the organization, we shall have
                                the right to accept the same from the date prior to the expiry of the notice period. On
                                acceptance of any notice of termination by the organization, you shall not be entitled to
                                withdraw.
                            </li>

                            <li style={{ marginBottom: '12px' }}>
                                Notwithstanding anything herein contained, in the event of any breach by you of any of the
                                terms and conditions herein contained or of any Rules and Regulations of the organization,
                                we will have the right to terminate your appointment and service without any notice or
                                notice pay or compensation whatsoever.
                            </li>

                            <li style={{ marginBottom: '12px' }}>
                                The tribunals and courts in <strong>Trivandrum</strong> will have the exclusive jurisdiction
                                in respect of all matters pertaining to your contractual agreement with HLFPPT.
                            </li>

                            <li style={{ marginBottom: '20px' }}>
                                Please sign on all the pages of the duplicate copy of the letter in token of your acceptance
                                of the terms and conditions herein contained and return it to us.
                            </li>
                        </ol>

                        {/* Closing */}
                        <p style={{ margin: '30px 0 10px 0' }}>
                            Thanking You,
                        </p>

                        <p style={{ margin: '20px 0 20px 0' }}>
                            Yours Sincerely,
                        </p>

                        <p style={{ margin: '0 0 10px 0' }}>
                            For <strong>HINDUSTAN LATEX FAMILY PLANNING PROMOTION TRUST</strong>,
                        </p>

                        {/* Signature Section */}
                        <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                            <div style={{ float: 'left', width: '50%' }}>
                                <p style={{ margin: '0 0 5px 0' }}>
                                    <strong>Awanish Awasthi</strong>
                                </p>
                                <p style={{ margin: '0' }}>
                                    Associate National Lead- HR & Admin
                                </p>
                            </div>

                            <div style={{ float: 'right', width: '45%', borderTop: '1px solid black', paddingTop: '10px' }}>
                                <p style={{ margin: '0 0 10px 0', fontSize: '10pt', fontStyle: 'italic' }}>
                                    I, <strong><Highlight text={data?.employeeName} /></strong>, have joined on
                                    <strong><Highlight text={formatDate(data?.joiningDate)} /></strong> solemnly declare that
                                    I have read and understood thoroughly the rules of service and terms of appointment of
                                    my service, and I do hereby agree with all terms as above and I shall abide by all
                                    general rules of service which are now or hereafter to be in force and accordingly I
                                    accept the appointment of service with HLFPPT.
                                </p>
                                <p style={{ margin: '10px 0 5px 0' }}>
                                    Name: <strong><Highlight text={data?.employeeName} /></strong>
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Date: __________________</span>
                                    <span>(Signature)</span>
                                </div>
                            </div>
                            <div style={{ clear: 'both' }}></div>
                        </div>
                    </div>

                    {/* Page Break for Annexure Page (Page 5) */}
                    <div style={{
                        pageBreakBefore: 'always',
                        height: '297mm',
                        paddingTop: '15mm',
                        position: 'relative'
                    }}>
                        {/* Annexure Header */}
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <h2 style={{
                                textDecoration: 'underline',
                                margin: '0',
                                fontSize: '14pt',
                                fontFamily: "'Times New Roman', Times, serif",
                                fontWeight: 'bold'
                            }}>
                                Annexure
                            </h2>
                        </div>

                        {/* Detailed Salary Structure */}
                        <div style={{ marginBottom: '30px' }}>
                            <h3 style={{
                                textDecoration: 'underline',
                                margin: '0 0 20px 0',
                                fontSize: '12pt',
                                fontFamily: "'Times New Roman', Times, serif",
                                fontWeight: 'bold'
                            }}>
                                Detailed Salary Structure:
                            </h3>

                            <div style={{
                                fontSize: '11pt',
                                fontFamily: "'Times New Roman', Times, serif",
                                marginBottom: '20px'
                            }}>
                                <p style={{ margin: '0 0 10px 0' }}>
                                    <strong>Name:</strong> <Highlight text={data?.employeeName} />
                                </p>
                                <p style={{ margin: '0 0 20px 0' }}>
                                    <strong>Designation:</strong> <Highlight text={data?.designation} />
                                </p>
                            </div>

                            {/* Salary Table */}
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                marginBottom: '30px',
                                fontSize: '11pt',
                                fontFamily: "'Times New Roman', Times, serif"
                            }}>
                                <tbody>
                                    <tr>
                                        <td style={{ border: '1px solid black', padding: '10px', width: '70%' }}>
                                            <strong>Monthly Component</strong>
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '10px', width: '30%', textAlign: 'right' }}>
                                            <strong>Amount (in Rs.)</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid black', padding: '10px' }}>
                                            <strong>Basic</strong>
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '10px', textAlign: 'right' }}>
                                            <Highlight text={data?.basicSalary} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid black', padding: '10px' }}>
                                            <strong>Monthly Gross</strong>
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '10px', textAlign: 'right' }}>
                                            <Highlight text={data?.monthlyGross} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid black', padding: '10px' }}>
                                            <strong>Annual Gross (Round Off)</strong>
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '10px', textAlign: 'right' }}>
                                            <Highlight text={data?.annualGross} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Additional Benefits */}
                            <div style={{ marginBottom: '40px' }}>
                                <h4 style={{
                                    textDecoration: 'underline',
                                    margin: '0 0 20px 0',
                                    fontSize: '11pt',
                                    fontFamily: "'Times New Roman', Times, serif",
                                    fontWeight: 'bold'
                                }}>
                                    Additional Benefits:
                                </h4>

                                <div style={{
                                    fontSize: '11pt',
                                    fontFamily: "'Times New Roman', Times, serif",
                                    lineHeight: '2'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Company's Contribution towards PF (per annum) @ 12%</span>
                                        <span>Rs. <Highlight text={data?.pfAmount} /></span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Workmen Compensation Annual Premium</span>
                                        <span>Rs. <Highlight text={data?.workmenComp || '00.00'} /></span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Gratuity @ 4.81% of Basic (Per annum) - Notional Pay</span>
                                        <span>Rs. <Highlight text={data?.gratuity} /></span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginTop: '20px',
                                        paddingTop: '10px',
                                        borderTop: '2px solid black',
                                        fontWeight: 'bold'
                                    }}>
                                        <span>Total Annual Impact (CTC)</span>
                                        <span>Rs. <Highlight text={data?.totalCTC} /></span>
                                    </div>
                                </div>
                            </div>

                            {/* Annexure Signatory */}
                            <div style={{ marginTop: '60px' }}>
                                <p style={{ margin: '0 0 20px 0' }}>
                                    Yours Sincerely,
                                </p>

                                <p style={{ margin: '0 0 10px 0' }}>
                                    For <strong>HLFPPT</strong>,
                                </p>

                                <div style={{ marginTop: '30px' }}>
                                    <p style={{ margin: '0 0 5px 0' }}>
                                        <strong>Awanish Awasthi</strong>
                                    </p>
                                    <p style={{ margin: '0' }}>
                                        Associate National Lead- HR & Admin
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer for print */}
                        <div style={{
                            position: 'absolute',
                            bottom: '15mm',
                            left: '20mm',
                            right: '20mm',
                            borderTop: '1px solid #ccc',
                            paddingTop: '10px',
                            fontSize: '9pt',
                            color: '#666',
                            textAlign: 'center'
                        }}>
                            <p style={{ margin: '0 0 5px 0' }}>
                                {data?.webSettingData?.meta_title || 'Hindustan Latex Family Planning Promotion Trust'}
                            </p>
                            <p style={{ margin: '0 0 5px 0', fontSize: '8pt' }}>
                                Corporate Office: {data?.webSettingData?.office_address || 'B-14 A, IInd Floor, Sector - 62, Gautam Budh Nagar, Noida-201301'}
                            </p>
                            <p style={{ margin: '0', fontSize: '8pt' }}>
                                Tel: {data?.webSettingData?.organization_mobile_no || 'N/A'} |
                                Email: {data?.webSettingData?.organization_email_id || 'N/A'} |
                                Website: {data?.webSettingData?.website_link?.replace("https://hrms.", "https://") || 'N/A'}
                            </p>
                            <p style={{ margin: '10px 0 0 0', fontSize: '8pt' }}>
                                Page 5 of 5 | Generated on: {formatDate(new Date())}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};