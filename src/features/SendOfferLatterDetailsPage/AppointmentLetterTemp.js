// AppointmentLetter.jsx
import React from 'react';
import { letterStyles, LetterHeader, FooterWithTextAndSignature, FooterWithSignatureOnly, DocumentWatermark } from './components/LetterComponents';
import config from '../../config/config';
import { formatDate } from '../../utils/common';
export const AppointmentLetter = ({ data }) => {
    const documentDate = data?.date ? formatDate(data.date) : formatDate(new Date());
    const footerColor = data.webSettingData?.footer_color || '#3caf40';
    // Format currency for salary display
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '0';
        const num = Number(amount);
        return num.toLocaleString('en-IN', {
            maximumFractionDigits: 0
        });
    };

    // Function to calculate annual amount
    const calculateAnnual = (monthly) => {
        const monthlyNum = Number(monthly) || 0;
        return monthlyNum * 12;
    };

    // Check if salary breakup data exists
    const hasSalaryBreakup = data?.salaryBreakup && !data.salaryBreakup.isEmpanelledOrConsultant;
    const salaryData = hasSalaryBreakup ? data.salaryBreakup : null;
    return (
        <div style={{
            ...letterStyles.page,
            ...letterStyles.AppointmentTextStyle,
            padding: '0',
            width: '210mm',
            height: 'auto',
            minHeight: '297mm',
            position: 'relative',
        }}>
            {/* PAGE 1 */}
            <div style={{
                minHeight: '297mm',
                padding: '15mm 20mm',
                position: 'relative'
            }}>
                <DocumentWatermark webSettingData={data?.webSettingData} />

                {/* Header on Page 1 */}
                <LetterHeader webSettingData={data?.webSettingData} />

                {/* Reference and Date */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '25px',
                        fontSize: '10pt',
                    }}
                >
                    <div>
                        <strong>
                            HLFPPT/HR/{data?.projectName}/EC-{data?.ecNumber}
                        </strong>
                    </div>
                    <div>
                        <strong>
                            Date: {documentDate}
                        </strong>
                    </div>
                </div>

                {/* Recipient Address */}
                <div style={{ marginBottom: '40px' }}>
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                        {data?.employeeName},
                    </p>

                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                        W/O, S/O, D/O- {data?.relativeName}
                    </p>

                    <p style={{ margin: '0 0 25px 0', fontWeight: 'bold' }}>
                        Address- {data?.address}
                    </p>
                </div>

                {/* EXTRA GAP BEFORE SUBJECT */}
                <div style={{ height: '25px' }}></div>

                {/* Subject Line */}
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <p
                        style={{
                            margin: '0 0 5px 0',
                            fontWeight: 'bold',
                            textDecoration: 'underline',
                        }}
                    >
                        SUBJECT: OFFER CUM APPOINTMENT LETTER ON FIXED TERM CONTRACT WITH
                    </p>

                    <p
                        style={{
                            margin: '0',
                            fontWeight: 'bold',
                            textDecoration: 'underline',
                        }}
                    >
                        HINDUSTAN LATEX FAMILY PLANNING PROMOTION TRUST
                    </p>
                </div>

                {/* Salutation */}
                <div style={{ marginBottom: '20px' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>
                        Dear Mr./Ms. {data?.employeeName},
                    </p>
                </div>

                {/* Welcome Paragraph */}
                <div style={{
                    marginBottom: '15px',
                    textAlign: 'justify',
                    lineHeight: '1.5'
                }}>
                    <p style={{ margin: '0 0 15px 0' }}>
                        <strong>Welcome to HLFPPT!</strong>
                    </p>

                    <p style={{ margin: '0 0 15px 0' }}>
                        We are pleased to offer you appointment as <strong>{data?.designation}</strong>, <strong>{data?.projectName}</strong>, <strong>{data?.location}</strong> on a contractual basis for a fixed term with effect from <strong>{formatDate(data?.joiningDate)}</strong> to <strong>{formatDate(data?.contractExpiryDate)}</strong> (or till the completion of the project whichever is earlier) so as to render your services to <strong>Hindustan Latex Family Planning Promotion Trust</strong> (abbreviated as HLFPPT). This Appointment offer letter will be void in case you fail to join on <strong>{formatDate(data?.joiningDate)}</strong>. You will be on probation for a period of <strong>Six months</strong>, during which period your performance will be closely watched. In the course of the work, periodic reviews, and regularly reporting is required to be made to <strong>{data?.reportingTo}</strong>, <strong>{data?.location}</strong>.
                    </p>

                    <p style={{ margin: '15px 0 15px 0' }}>
                        Just as it gives us pleasure in bringing you into our fold, we wish to share with you the detailed terms and conditions of employment and employee related guidelines applicable to all employees of HLFPPT.
                    </p>

                    <p style={{ margin: '15px 0 20px 0' }}>
                        We wish the very best for you in your career with us.
                    </p>

                    {/* Terms and Conditions Title */}
                    <h3 style={{
                        textDecoration: 'none',
                        margin: '20px 0 10px 0',
                        fontSize: '10pt'
                    }}>
                        Terms and conditions of employment:
                    </h3>
                </div>

                {/* Terms and Conditions List - First 2 items */}
                <div style={{ textAlign: 'justify', lineHeight: '1.5' }}>
                    <ol style={{ paddingLeft: '25px', margin: '0' }}>
                        <li style={{ marginBottom: '12px' }}>
                            It has been communicated and agreed that your appointment is purely on a contractual basis and for the aforesaid fixed period, on expiry of which, your appointment and contract between us will cease and come to an end automatically, without any necessity of our giving you any notice or notice pay and without any liability on our part to pay you any retrenchment or other compensation or other amounts whatsoever. However, based on your performance, and the extension of the project, your contract can be reviewed for further extension. This is however, not obligatory on the part of the organization.
                        </li>

                        <li style={{ marginBottom: '12px' }}>
                            You will have no right or lien on or in respect of the job or position to which you are temporarily appointed or any other job or position either in HLFPPT or in HLL, and that HLFPPT or HLL will not be obliged to in any manner or any account to offer you any regular or permanent employment in such job or position, even if there is any vacancy.
                        </li>
                    </ol>
                </div>

                {/* Footer with Text and Signature - ONLY on Page 1 */}
                <div style={{
                    position: 'absolute',
                    bottom: '15mm',
                    left: '20mm',
                    right: '20mm'
                }}>
                    <FooterWithTextAndSignature
                        webSettingData={data?.webSettingData}
                        showSignature={true}
                    />
                </div>
            </div>

            {/* PAGE 2 - Page Break */}
            <div style={{
                pageBreakBefore: 'always',
                minHeight: '297mm',
                padding: '15mm 20mm',
                position: 'relative'
            }}>
                <DocumentWatermark webSettingData={data?.webSettingData} />

                {/* Header on Page 2 */}
                <LetterHeader webSettingData={data?.webSettingData} />

                {/* Continue Terms and Conditions */}
                <div style={{ textAlign: 'justify', lineHeight: '1.5' }}>
                    <ol start="3" style={{ paddingLeft: '25px', margin: '0' }}>
                        <li style={{ marginBottom: '12px', paddingTop: '45px' }}>
                            Your appointment is subject to your being certified to be medically fit by any registered medical practitioner.
                        </li>

                        <li style={{ marginBottom: '12px' }}>
                            During your appointment pursuant hereto, you will be required to do work as per the duty hours prescribed for <strong>{data?.projectName}</strong> based at <strong>{data?.location}</strong>, or as may be advised by us keeping in view the requirements of the organization.
                        </li>

                        <li style={{ marginBottom: '12px' }}>
                            During your appointment as <strong>{data?.designation}</strong>, <strong>{data?.projectName}</strong>, <strong>{data?.location}</strong> for a fixed term you will be entitled for a annual gross salary of  <strong> {salaryData ?
                                `Rs. ${formatCurrency(salaryData.totalCTOAnnual)} (${data?.annualGrossSalaryWords})` :
                                `${data?.annualGrossSalaryWords}`
                            } </strong> per annum.
                        </li>

                        <li style={{ marginBottom: '12px' }}>
                            You will be entitled for PF Contribution at the rate of 12% of the basic salary and an equal amount would be deducted by your basic salary as per the PF rules & regulations, as per break-up given in Annexure.
                        </li>

                        <li style={{ marginBottom: '12px' }}>
                            Since you are not a permanent employee of the Organization, you will not be entitled to any of the Statutory Benefit plans such as LTA, Superannuation etc. The remuneration paid to you by the project is a matter purely between you and the organization and you shall maintain all information regarding your remuneration as personal and confidential.
                        </li>

                        <li style={{ marginBottom: '12px' }}>
                            Your initial posting will be at <strong>{data?.location}</strong> but your services during the period of your assignment are transferable to any other site, etc. of HLFPPT or its Project deployed anywhere in India, in accordance with the project's concerned policy and rules for the time being in force.
                        </li>

                        <li style={{ marginBottom: '12px' }}>
                            Based on your performance, you will be eligible for annual increments in salary, which will be communicated to you.
                        </li>

                        <li style={{ marginBottom: '12px' }}>
                            This appointment is made on the basis of and relying on the particulars and personal data submitted by you at the time of Interview and joining and will be deemed to be void ab initio in the event of any such particulars or data being false or incorrect. You shall inform the Human Resource Department, HLFPPT of any changes in such particulars of the data within <strong>three days</strong> of any such change.
                        </li>
                        <li style={{ marginBottom: '12px' }}>
                            You shall, during the period of your contractual appointment pursuant hereto, devote your whole time and attention to the work entrusted to you and shall not engage yourself directly or indirectly in any other business, work or service.
                        </li>

                        <li style={{ marginBottom: '12px' }}>
                            All information pertaining to the organization / its project, affairs, operations and employees of the organization/project will be deemed to be secret and confidential and shall be maintained as such by you and your appointment pursuant hereto will be subject to your executing with the organization/project on your accepting this offer of temporary appointment, a formal agreement with regard to the maintenance of such secrecy and confidentiality and with regard to intellectual property rights etc. You will also keep us duly informed of any confidentiality agreement entered into by you with your previous employers or any others and keep us indemnified and harmless against any breach thereof by you and any consequences of any such breach.
                        </li>
                    </ol>
                </div>

                {/* Footer with Signature Only - Page 2 */}
                <div style={{
                    position: 'absolute',
                    bottom: '15mm',
                    left: '20mm',
                    right: '20mm'
                }}>
                    <FooterWithSignatureOnly
                        webSettingData={data?.webSettingData}
                        showSignature={true}
                    />
                </div>
            </div>

            {/* PAGE 3 - Page Break */}
            <div style={{
                pageBreakBefore: 'always',
                minHeight: '297mm',
                padding: '15mm 20mm',
                position: 'relative'
            }}
            >
                <DocumentWatermark webSettingData={data?.webSettingData} />

                {/* Header */}
                <LetterHeader webSettingData={data?.webSettingData} />

                {/* Terms and Conditions */}
                <div style={{ textAlign: 'justify', lineHeight: '1.5' }}>
                    <ol start="13" style={{ paddingLeft: '25px', marginBottom: '20px' }}>
                        <li style={{ marginBottom: '12px', paddingTop: '45px' }}>
                            You will abide by all the applicable Service Rules and Regulations of
                            HLFPPT/its Project, including its personal conduct guidelines, in force
                            from time to time, which you are deemed to have read, understood and
                            agreed. The organization will have the right to vary or modify the same
                            or all or any of the terms and conditions of your temporary appointment
                            at any time, which will be binding on you.
                        </li>

                        <li style={{ marginBottom: '12px' }}>
                            Your appointment and service pursuant hereto may be terminated by either
                            of us by giving to each other <strong>One-month</strong> written notice or
                            by paying <strong>One-month</strong> Salary (Basic plus HRA) in lieu of
                            such notice.
                        </li>

                        <li style={{ marginBottom: '12px' }}>
                            Notwithstanding anything herein contained, in the event of any breach by
                            you of any of the terms and conditions herein contained or of any Rules
                            and Regulations of the organization, we will have the right to terminate
                            your appointment and service without any notice or compensation.
                        </li>

                        <li style={{ marginBottom: '12px' }}>
                            The tribunals and courts in <strong>Trivandrum</strong> will have the
                            exclusive jurisdiction in respect of all matters pertaining to your
                            contractual agreement with HLFPPT.
                        </li>

                        <li>
                            Please sign on all the pages of the duplicate copy of the letter in token
                            of your acceptance of the terms and conditions herein contained and
                            return it to us.
                        </li>
                    </ol>

                    {/* Closing */}
                    <p>Thanking You,</p>

                    <p style={{ marginTop: '10px' }}>Yours Sincerely,</p>

                    <p>
                        For <strong>HINDUSTAN LATEX FAMILY PLANNING PROMOTION TRUST</strong>,
                    </p>

                    <p style={{ marginTop: '20px', marginBottom: '5px' }}>
                        <strong>Awanish Awasthi</strong>
                    </p>
                    <p style={{ fontWeight: 'bold' }}>Associate National Lead- HR &amp; Admin</p>
                    <img
                        src={config.IMAGE_PATH + data?.webSettingData?.hod_hr_signature}
                        alt="HR Signature"
                        style={{ width: '120px', height: '50px', objectFit: 'contain' }}
                    />
                    {/* Declaration Section */}
                    <p
                        style={{
                            marginTop: '40px',
                            textAlign: 'justify'
                        }}
                    >
                        I, <strong>{data?.employeeName}</strong>, have joined on{' '}
                        <strong>{formatDate(data?.joiningDate)}</strong> solemnly declare that I
                        have read and understood thoroughly the rules of service and terms of
                        appointment of my service, and I do hereby agree with all terms as above
                        and I shall abide by all general rules of service which are now or
                        hereafter to be in force and accordingly I accept the appointment of
                        service with HLFPPT.
                    </p>

                    {/* Employee Signature */}
                    <div style={{ marginTop: '30px' }}>
                        <p>
                            <strong>Name:</strong> {data?.employeeName}
                        </p>
                        <table style={{ width: '100%', marginTop: '30px' }}>
                            <tbody>
                                <tr>
                                    <td style={{ textAlign: 'left' }}>
                                        <strong>Date:</strong> ______________________
                                    </td>

                                    <td style={{ textAlign: 'right' }}>
                                        <div
                                            style={{
                                                width: '150px',
                                                marginLeft: 'auto',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    borderTop: '1px solid #000',
                                                    marginBottom: '4px',
                                                }}
                                            ></div>
                                            <div>(Signature)</div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style={{ height: '3px', backgroundColor: footerColor, marginTop: '45px' }} />
                </div>
            </div>

            {/* PAGE 4 - Page Break (Annexure) */}
            <div style={{
                pageBreakBefore: 'always',
                height: '297mm',
                padding: '15mm 20mm',
                position: 'relative',
                fontSize: '10pt',
                lineHeight: '1.4',
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}>
                <DocumentWatermark webSettingData={data?.webSettingData} />

                {/* Header on Page 4 */}
                <LetterHeader webSettingData={data?.webSettingData} />

                {/* Annexure Content */}
                <div>
                    {/* Annexure Header */}
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{
                            textDecoration: 'underline',
                            margin: '0',
                            fontSize: '12pt',
                            fontWeight: 'bold'
                        }}>
                            Annexure
                        </h2>
                    </div>

                    {/* Detailed Salary Structure */}
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{
                            textDecoration: 'underline',
                            margin: '0 0 15px 0',
                            fontSize: '10pt',
                            fontWeight: 'bold'
                        }}>
                            Detailed Salary Structure:
                        </h3>

                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ margin: '0 0 10px 0' }}>
                                <strong>Name:</strong> {data?.employeeName}
                            </p>
                            <p style={{ margin: '0 0 20px 0' }}>
                                <strong>Designation:</strong> {data?.designation}
                            </p>
                        </div>
                        {data?.description && (
                            <div dangerouslySetInnerHTML={{ __html: data.description }} />
                        )}

                        {!data?.description && hasSalaryBreakup && (
                            <>
                                {/* Monthly Salary Table */}
                                <table style={{
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    marginBottom: '20px',
                                    breakInside: 'avoid',
                                    pageBreakInside: 'avoid'
                                }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f2f2f2', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                                            <th style={{
                                                border: '1px solid #ddd',
                                                padding: '10px',
                                                textAlign: 'left',
                                                fontWeight: 'bold'
                                            }}>
                                                Monthly Component
                                            </th>
                                            <th style={{
                                                border: '1px solid #ddd',
                                                padding: '10px',
                                                textAlign: 'right',
                                                fontWeight: 'bold'
                                            }}>
                                                Amount (in Rs.)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Basic */}
                                        <tr>
                                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                                <strong>Basic</strong>
                                            </td>
                                            <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>
                                                {formatCurrency(salaryData.basic)}
                                            </td>
                                        </tr>

                                        {/* HRA */}
                                        {salaryData.hra > 0 && (
                                            <tr>
                                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                                    <strong>HRA</strong>
                                                </td>
                                                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>
                                                    {formatCurrency(salaryData.hra)}
                                                </td>
                                            </tr>
                                        )}

                                        {/* Children Hostel AI */}
                                        {salaryData.childrenHostelAI > 0 && (
                                            <tr>
                                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                                    <strong>Children Hostel AI</strong>
                                                </td>
                                                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>
                                                    {formatCurrency(salaryData.childrenHostelAI)}
                                                </td>
                                            </tr>
                                        )}

                                        {/* Transport */}
                                        {salaryData.transport > 0 && (
                                            <tr>
                                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                                    <strong>Transport</strong>
                                                </td>
                                                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>
                                                    {formatCurrency(salaryData.transport)}
                                                </td>
                                            </tr>
                                        )}

                                        {/* Medical */}
                                        {salaryData.medical > 0 && (
                                            <tr>
                                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                                    <strong>Medical</strong>
                                                </td>
                                                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>
                                                    {formatCurrency(salaryData.medical)}
                                                </td>
                                            </tr>
                                        )}

                                        {/* Special */}
                                        {salaryData.special > 0 && (
                                            <tr>
                                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                                    <strong>Special</strong>
                                                </td>
                                                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>
                                                    {formatCurrency(salaryData.special)}
                                                </td>
                                            </tr>
                                        )}

                                        {/* Gross Monthly Row */}
                                        <tr style={{ backgroundColor: '#e8f4ff' }}>
                                            <td style={{
                                                border: '1px solid #ddd',
                                                padding: '10px',
                                                fontWeight: 'bold'
                                            }}>
                                                <strong>Gross Monthly</strong>
                                            </td>
                                            <td style={{
                                                border: '1px solid #ddd',
                                                padding: '10px',
                                                textAlign: 'right',
                                                fontWeight: 'bold'
                                            }}>
                                                {formatCurrency(salaryData.grossMonthly)}
                                            </td>
                                        </tr>

                                        {/* Employer Contributions Section */}
                                        <tr>
                                            <td style={{
                                                border: '1px solid #ddd',
                                                padding: '10px',
                                                fontStyle: 'italic'
                                            }}>
                                                Employer Contributions:
                                            </td>
                                            <td style={{ border: '1px solid #ddd', padding: '10px' }}></td>
                                        </tr>

                                        {/* PF Employer */}
                                        {salaryData.pfEmployer > 0 && (
                                            <tr>
                                                <td style={{ border: '1px solid #ddd', padding: '10px', paddingLeft: '20px' }}>
                                                    PF (Employer) @ 12%
                                                </td>
                                                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>
                                                    {formatCurrency(salaryData.pfEmployer)}
                                                </td>
                                            </tr>
                                        )}

                                        {/* Gratuity */}
                                        {salaryData.gratuity > 0 && (
                                            <tr>
                                                <td style={{ border: '1px solid #ddd', padding: '10px', paddingLeft: '20px' }}>
                                                    Gratuity @ 4.81%
                                                </td>
                                                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>
                                                    {formatCurrency(salaryData.gratuity)}
                                                </td>
                                            </tr>
                                        )}

                                        {/* Employer Benefit (ESIC/Mediclaim/Workmen) */}
                                        {salaryData.employerBenefitAmount > 0 && (
                                            <tr>
                                                <td style={{ border: '1px solid #ddd', padding: '10px', paddingLeft: '20px' }}>
                                                    {salaryData.employerBenefitType === 'esic' ? 'ESIC (Employer)' :
                                                        salaryData.employerBenefitType === 'mediclaim' ? 'Mediclaim' :
                                                            salaryData.employerBenefitType === 'workmen' ? 'Workmen Compensation' :
                                                                salaryData.employerBenefitTitle || 'Other Benefit'}
                                                </td>
                                                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>
                                                    {formatCurrency(salaryData.employerBenefitAmount)}
                                                </td>
                                            </tr>
                                        )}

                                        {/* CTC Monthly */}
                                        <tr style={{ backgroundColor: '#e8ffe8' }}>
                                            <td style={{
                                                border: '1px solid #ddd',
                                                padding: '10px',
                                                fontWeight: 'bold'
                                            }}>
                                                <strong>CTC (Monthly)</strong>
                                            </td>
                                            <td style={{
                                                border: '1px solid #ddd',
                                                padding: '10px',
                                                textAlign: 'right',
                                                fontWeight: 'bold'
                                            }}>
                                                {formatCurrency(salaryData.ctcMonthly)}
                                            </td>
                                        </tr>

                                        {/* Reimbursements if any */}
                                        {salaryData.reimbursementsMonthly > 0 && (
                                            <tr>
                                                <td style={{
                                                    border: '1px solid #ddd',
                                                    padding: '10px',
                                                    fontStyle: 'italic'
                                                }}>
                                                    Reimbursements (Monthly):
                                                </td>
                                                <td style={{
                                                    border: '1px solid #ddd',
                                                    padding: '10px',
                                                    textAlign: 'right'
                                                }}>
                                                    {formatCurrency(salaryData.reimbursementsMonthly)}
                                                </td>
                                            </tr>
                                        )}

                                        {/* Total CTO Monthly */}
                                        <tr style={{ backgroundColor: '#fff0e8', borderTop: '2px solid #ddd' }}>
                                            <td style={{
                                                border: '1px solid #ddd',
                                                padding: '10px',
                                                fontWeight: 'bold',
                                                fontSize: '12pt'
                                            }}>
                                                <strong>Total CTO (Monthly)</strong>
                                            </td>
                                            <td style={{
                                                border: '1px solid #ddd',
                                                padding: '10px',
                                                textAlign: 'right',
                                                fontWeight: 'bold',
                                                fontSize: '12pt'
                                            }}>
                                                {formatCurrency(salaryData.totalCTOMonthly)}
                                            </td>
                                        </tr>

                                        {/* Total CTO Annual */}
                                        <tr style={{ backgroundColor: '#fff0e8' }}>
                                            <td style={{
                                                border: '1px solid #ddd',
                                                padding: '10px',
                                                fontWeight: 'bold',
                                                fontSize: '12pt'
                                            }}>
                                                <strong>Total Annual Impact (CTC)</strong>
                                            </td>
                                            <td style={{
                                                border: '1px solid #ddd',
                                                padding: '10px',
                                                textAlign: 'right',
                                                fontWeight: 'bold',
                                                fontSize: '12pt'
                                            }}>
                                                {formatCurrency(salaryData.totalCTOAnnual)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Additional Benefits Section */}
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{
                                        textDecoration: 'underline',
                                        fontSize: '10pt',
                                        fontWeight: 'bold',
                                        margin: '0 0 10px 0'
                                    }}>
                                        Additional Benefits:
                                    </div>

                                    <div style={{ lineHeight: '2' }}>
                                        {/* PF Annual */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Company's Contribution towards PF (per annum) @ 12%</span>
                                            <span>Rs. {formatCurrency(calculateAnnual(salaryData.pfEmployer))}</span>
                                        </div>

                                        {/* Employer Benefit Annual */}
                                        {salaryData.employerBenefitAmount > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>
                                                    {salaryData.employerBenefitType === 'esic' ? 'ESIC (Employer) Annual Contribution' :
                                                        salaryData.employerBenefitType === 'mediclaim' ? 'Mediclaim Annual Premium' :
                                                            salaryData.employerBenefitType === 'workmen' ? 'Workmen Compensation Annual Premium' :
                                                                (salaryData.employerBenefitTitle || 'Other Employer Benefit') + ' Annual Amount'}
                                                </span>
                                                <span>Rs. {formatCurrency(calculateAnnual(salaryData.employerBenefitAmount))}</span>
                                            </div>
                                        )}

                                        {/* Gratuity Annual */}
                                        {salaryData.gratuity > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Gratuity @ 4.81% of Basic (Per annum) - Notional Pay</span>
                                                <span>Rs. {formatCurrency(calculateAnnual(salaryData.gratuity))}</span>
                                            </div>
                                        )}

                                        {/* Total CTC Annual */}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginTop: '20px',
                                            paddingTop: '10px',
                                            borderTop: '2px solid black',
                                            fontWeight: 'bold'
                                        }}>
                                            <span>Total Annual Impact (CTC)</span>
                                            <span>Rs. {formatCurrency(salaryData.totalCTOAnnual)}</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Fallback to static data if no salary breakdown */}
                        {!data?.description && !hasSalaryBreakup && (
                            <>
                                {/* Original static salary table */}
                                <table style={{
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    marginBottom: '20px'
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
                                                {data?.basicSalary || '0'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid black', padding: '10px' }}>
                                                <strong>Monthly Gross</strong>
                                            </td>
                                            <td style={{ border: '1px solid black', padding: '10px', textAlign: 'right' }}>
                                                {data?.monthlyGross || '0'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid black', padding: '10px' }}>
                                                <strong>Annual Gross (Round Off)</strong>
                                            </td>
                                            <td style={{ border: '1px solid black', padding: '10px', textAlign: 'right' }}>
                                                {data?.annualGross || '0'}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Original Additional Benefits */}
                                <div
                                    style={{
                                        marginBottom: '20px',
                                        fontSize: '10pt',
                                        breakInside: 'avoid',
                                        pageBreakInside: 'avoid'
                                    }}
                                >
                                    <div
                                        style={{
                                            textDecoration: 'underline',
                                            fontSize: '10pt',
                                            fontWeight: 'bold',
                                            margin: '0 0 10px 0'
                                        }}
                                    >
                                        Additional Benefits:
                                    </div>

                                    <div style={{ lineHeight: '1.6' }}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontWeight: 'bold',
                                                marginBottom: '6px'
                                            }}
                                        >
                                            <span>Company's Contribution towards PF (per annum) @ 12%</span>
                                            <span>Rs. {data?.pfAmount || '00.00'}</span>
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontWeight: 'bold',
                                                marginBottom: '6px'
                                            }}
                                        >
                                            <span>Workmen Compensation Annual Premium</span>
                                            <span>Rs. {data?.workmenComp || '00.00'}</span>
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontWeight: 'bold',
                                                marginBottom: '10px'
                                            }}
                                        >
                                            <span>Gratuity @ 4.81% of Basic (Per annum) - Notional Pay</span>
                                            <span>Rs. {data?.gratuity || '00.00'}</span>
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginTop: '10px',
                                                paddingTop: '6px',
                                                borderTop: '1.5px solid black',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            <span>Total Annual Impact (CTC)</span>
                                            <span>Rs. {data?.totalCTC || '0'}</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Annexure Signatory */}
                        <div style={{ marginTop: '15px', fontWeight: 'bold' }}>
                            <p style={{ margin: '0 0 5px 0' }}>
                                Yours Sincerely,
                            </p>

                            <p style={{ margin: '0 0 5px 0' }}>
                                For <strong>HLFPPT</strong>,
                            </p>

                            <div style={{ marginTop: '5px' }}>
                                <p style={{ margin: '0 0 5px 0' }}>
                                    <strong>Awanish Awasthi</strong>
                                </p>
                                <p style={{ margin: '0' }}>
                                    Associate National Lead- HR & Admin
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer with Signature Only - Page 4 */}
                <div style={{
                    position: 'absolute',
                    bottom: '5mm',
                    left: '20mm',
                    right: '20mm'
                }}>
                    <FooterWithSignatureOnly
                        webSettingData={data?.webSettingData}
                        showSignature={true}
                    />
                </div>
            </div>
        </div>
    );
};