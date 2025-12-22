// ConsultantLetterTemp.jsx
import React from 'react';
import {
    letterStyles,
    LetterHeader,
    LetterFooter,
    DocumentWatermark,
    WitnessSignature,
    getCurrentDate,
    FooterWithTextAndSignature,
    FooterWithSignatureOnly
} from './components/LetterComponents';
import config from '../../config/config';
import { formatDate } from '../../utils/common';
const footerStyle = {
    position: 'absolute',
    bottom: '25px',
    left: '0',
    right: '0',
};
const pageStyle = {
    minHeight: '1122px',
    position: 'relative',
    // paddingBottom: '120px',
};


export const ConsultantLetter = ({ data }) => {
    const currentDate = formatDate(data?.currentDate) || formatDate(getCurrentDate());
    const footerColor = data.webSettingData?.footer_color || '#3caf40';
    return (
        <div style={letterStyles.page}>
            {/* Watermark */}
            <DocumentWatermark webSettingData={data?.webSettingData} />
            <div style={{ position: 'relative', zIndex: 2 }}>
                {/* Simple Header - only logo with line */}
                <LetterHeader webSettingData={data?.webSettingData} />

                {/* Title */}
                <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', fontSize: '10pt' }}>
                    <p style={{ margin: '20px 0 5px 0', fontWeight: 'bold' }}>
                        Terms of Contract for Appointment as
                    </p>
                    <p style={{ margin: '0 0 20px 0', fontWeight: 'bold' }}>
                        Consultant ({data?.designation})
                    </p>
                </div>

                {/* Main Content */}
                <div style={{
                    textAlign: 'justify'
                }}>
                    <p style={{ marginBottom: '15px' }}>
                        Articles of Agreement made this day, the <strong>{formatDate(data?.joiningDate)}</strong> between
                        <strong> {data?.employeeName}</strong>, resident of S/O/D/O/W/O:
                        <strong> {data?.relativeName}</strong>, At-
                        <strong> {data?.address}</strong>, hereinafter called the <strong>Party</strong>,
                        of the one part and the <strong>Hindustan Latex Family Planning Promotion Trust (HLFPPT)</strong>,
                        {data?.webSettingData?.office_address}, hereinafter called the <strong>Trust</strong>,
                        of the other part.
                    </p>

                    <p style={{ marginBottom: '15px' }}>
                        WHEREAS the Trust has engaged the Party as <strong>Consultant</strong>, on contract basis
                        and the Party has agreed to serve the Trust in that capacity on the terms and conditions
                        hereinafter contained.
                    </p>

                    <p style={{ marginBottom: '15px' }}>
                        NOW THESE PRESENT WITNESS AND THE Parties hereto respectively agree as follows:
                    </p>

                    <ol style={{ paddingLeft: '20px' }}>
                        <li style={{ marginBottom: '10px' }}>
                            The Party of the first part shall remain in the service of the Trust as
                            <strong> Consultant</strong> from <strong>{formatDate(data?.joiningDate)}</strong> to
                            <strong> {formatDate(data?.contractExpiryDate)}</strong> or till the completion of the project,
                            whichever is earlier (hereinafter called the ‘contractual period’), subject to the
                            provisions herein contained.
                        </li>

                        <li style={{ marginBottom: '10px' }}>
                            The Party has agreed to perform duties as per the job description set out in
                            <strong> Appendix – I</strong> here to, which shall constitute an integral part of
                            this Agreement.
                        </li>

                        <li style={{ marginBottom: '10px' }}>
                            During the period of contract, while functioning as <strong>Consultant</strong>,
                            the Party will be entitled to the consultancy fee as set out in
                            <strong> Appendix – II</strong> here to, which shall constitute an integral part of
                            this Agreement.
                        </li>

                        <li style={{ marginBottom: '10px' }}>
                            The appointment of the Party is purely on a contract basis and the Party shall not
                            be entitled to any claims, rights, interests or further benefits in terms of
                            regularization or consideration for further appointment to the said post or any
                            other post under the Trust.
                        </li>

                        <li style={{ marginBottom: '10px' }}>
                            During the period of employment pursuant hereto, the Party shall devote his/her
                            whole time and attention to the work entrusted to him/her and shall not engage
                            directly or indirectly in any other business, work or services.
                        </li>

                        <li style={{ marginBottom: '10px' }}>
                            The services of the Party shall stand automatically terminated at the expiry of the
                            contract period, without any necessity of the Trust giving any notice or notice pay
                            and without any liability on the part of the Trust to pay any retrenchment or other
                            compensation whatsoever.
                        </li>

                        <li style={{ marginBottom: '10px' }}>
                            Notwithstanding anything contained herein above, the consultancy services of the
                            Party may be terminated at any time by the Trust without any notice or notice pay or
                            consultancy fee whatsoever, if the Party is found guilty of any insubordination,
                            intemperance, misconduct, breach or non-performance of duties.
                        </li>
                    </ol>
                    {/* Footer for FIRST PAGE - Full text + signature */}
                    <FooterWithTextAndSignature
                        webSettingData={data?.webSettingData}
                        showSignature={true}
                    />
                </div>
            </div>
            {/* Page Break for remaining terms (Page 2) */}
            <div style={{ pageBreakBefore: 'always' }}>
                {/* Watermark for second page */}
                <div style={pageStyle}>
                    <DocumentWatermark webSettingData={data?.webSettingData} />

                    {/* Header for second page */}
                    <LetterHeader webSettingData={data?.webSettingData} />

                    <div style={letterStyles.justify}>
                        <ol start="8">
                            <li style={{ marginBottom: '10px', paddingTop: '45px' }}>
                                The party acknowledges that in the course of its operations, HLFPPT has developed and
                                gathered extensive data, information, procedures, processes methods and system of a
                                confidential and proprietary nature including, without limitation, information or
                                evaluations to grant applications and distributions, contract persons, programs of
                                HLFPPT, research data, planning data, development data, experience data, business
                                processes, methods, know-how and other confidential information, knowledge or data used
                                or useful in conducting the operations of HLFPPT (collectively, the "Confidential
                                information"); that the disclosure there if is being made by HLFPPT to the party only
                                because of the position of trust and confidence to the restrictions contained herein;
                                that all such confidential information is the sole Property of HLFPPT that strict
                                protection of the confidential information is necessary to the successful continuation
                                information is necessary to the successful continuation of the operations of the HLFPPT
                                and that unauthorized use or disclosure of the confidential information would
                                irreparably harm HLFPPT, the party of the first part agrees that the party will not
                                directly or indirectly divulge, disclosure or use at any time, either during the terms
                                of this agreement or at any time thereafter, any confidential information, unless
                                consultant shall first have secured the written consent of HLFPPT or unless such
                                disclosure or use is both necessary in the performances of the services and
                                specifically authorized pursuant to HLFPPT written publication policy, as the same may
                                be revised from time to time.
                            </li>

                            <li style={{ marginBottom: '10px' }}>
                                Either of the parties hereto have the right to terminate this Agreement without
                                assigning any reasons provided that a written notice of one month is given to the other
                                party. Both the parties may, in lieu of the written notice, give the other party a sum
                                equivalent to the amount of a fee for one month or shorter notice than one month with
                                the sum equivalent to the amount of her monthly fee for the period of which such notice
                                falls short of one month.
                            </li>

                            <li style={{ marginBottom: '20px' }}>
                                The tribunals and courts in Trivandrum will have the exclusive jurisdiction in respect
                                of all matters pertaining to contractual agreement between the Trust and the Party.
                            </li>
                        </ol>

                        <p style={{ marginBottom: '20px' }}>
                            In witness there of, the Party and the authorized signatory of the Trust have hereunto set
                            their hands the day and year first above written.
                        </p>

                        {/* Signatures Table */}
                        <table style={{ ...letterStyles.table, marginTop: '40px', fontFamily: 'Arial, sans-serif', fontSize: '8px' }}>
                            <tbody>
                                <tr>
                                    <td colSpan={2} style={{ ...letterStyles.td, fontWeight: 'bold' }}>
                                        For the Trust:
                                    </td>
                                    <td colSpan={2} style={{ ...letterStyles.td, fontWeight: 'bold' }}>
                                        For the Party:
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ ...letterStyles.td }}>
                                        <div>Signature:</div>
                                        <img
                                            src={config.IMAGE_PATH + data?.webSettingData?.hod_hr_signature}
                                            alt="HR Signature"
                                            style={{ width: '120px', height: '40px', objectFit: 'contain' }}
                                        />
                                    </td>
                                    <td style={letterStyles.td}></td>
                                    <td style={letterStyles.td}>Signature:</td>
                                    <td style={letterStyles.td}></td>
                                </tr>
                                <tr>
                                    <td style={letterStyles.td}>Name:</td>
                                    <td style={{ ...letterStyles.td, fontSize: '10px' }}><strong>Awanish Awasthi</strong></td>
                                    <td style={letterStyles.td}>Name:</td>
                                    <td style={{ ...letterStyles.td, fontSize: '10px' }}>{data?.employeeName}</td>
                                </tr>
                                <tr>
                                    <td style={letterStyles.td}>Designation:</td>
                                    <td style={letterStyles.td}><strong>Associate National Lead–HR & Admin</strong></td>
                                    <td style={letterStyles.td}>Designation in the Trust:</td>
                                    <td style={letterStyles.td}>{`Consultant (${data?.designation})`}</td>
                                </tr>
                                <tr>
                                    <td style={letterStyles.td}>Dated:</td>
                                    <td style={letterStyles.td}>{currentDate}</td>
                                    <td style={letterStyles.td}>Dated:</td>
                                    <td style={letterStyles.td}>{currentDate}</td>
                                </tr>
                                {/* Witness Section */}
                                <tr>
                                    <td colSpan={2} style={{ ...letterStyles.td }}>
                                        <WitnessSignature witnessNumber={1} />
                                    </td>
                                    <td colSpan={2} style={{ ...letterStyles.td }}>
                                        <WitnessSignature witnessNumber={2} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style={{ height: '3px', backgroundColor: footerColor, marginBottom: '15px' }} />
                </div>
            </div>

            {/* Page Break for Appendix I (Page 3) */}
            <div style={{ pageBreakBefore: 'always' }}>
                <div style={pageStyle}>
                    <DocumentWatermark webSettingData={data?.webSettingData} />
                    <LetterHeader webSettingData={data?.webSettingData} />
                    <div style={letterStyles.justify}>
                        {/* Centered Heading Section */}
                        <div style={letterStyles.center}>
                            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                Appendix-I
                            </div>

                            <div style={{ marginBottom: '5px' }}>
                                Agreement between HLFPPT
                            </div>

                            <div style={{ marginBottom: '5px' }}>
                                and
                            </div>

                            <div style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                                {data?.employeeName}
                            </div>

                            <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '30px' }}>
                                Terms of reference for the post of Consultant
                            </div>
                        </div>

                        {/* Body Content */}
                        <p style={{ marginBottom: '20px' }}>
                            The normal place of work for the Party will be at{' '}
                            <strong>{data?.location}</strong> but
                            his/her services during the period will be available to any other sites of
                            HLFPPT or its projects deployed anywhere in India, in accordance with the
                            concerned projects policy and rules for the time being in force.
                        </p>

                        {/* 1. Terms of Reference */}
                        <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>
                            1&nbsp;&nbsp;Terms of reference for Consultant ({data?.designation})
                        </p>

                        <ul style={{ paddingLeft: '25px', marginBottom: '20px', listStyleType: 'disc' }}>
                            <li>&nbsp;</li>
                        </ul>

                        {/* 2. Reporting */}
                        <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>
                            2&nbsp;&nbsp;Reporting
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            The party will report on day-to-day activities to the{' '}
                            <strong>{data?.reportingTo}</strong>,{' '}
                            <strong>{data?.location}</strong> who will be responsible for monitoring and
                            evaluating his/her performance.
                        </p>
                        {/* 3. Relationship */}
                        <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>
                            3&nbsp;&nbsp;Relationship of the Parties
                        </p>

                        <p style={{ marginBottom: '10px' }}>
                            This Agreement and any rights hereunder can neither be assigned nor subcontracted by the
                            Party to a third party.
                        </p>

                        <p style={{ marginBottom: '30px' }}>
                            The Party is in no way a legal representative or agent or employee or subordinate of the
                            Trust for any purpose whatsoever and the Party has no right or authority to assume or
                            create, in writing or otherwise, any obligation of any kind, express or implied, or enter
                            into any agreement in the name of or on behalf of the Trust.
                        </p>

                        {/* Divider */}
                        <div style={{ textAlign: 'center', margin: '30px 0' }}>
                            ***********
                        </div>
                    </div>

                    <div style={footerStyle}>
                        <FooterWithSignatureOnly
                            webSettingData={data?.webSettingData}
                            showSignature={true}
                        />
                    </div>
                </div>
            </div>
            {/* Page Break for Appendix II (Page 4) */}
            <div >
                <div style={pageStyle}>
                    {/* Watermark */}
                    <DocumentWatermark webSettingData={data?.webSettingData} />

                    {/* Header */}
                    <LetterHeader webSettingData={data?.webSettingData} />

                    {/* Page Content */}
                    <div style={{ ...letterStyles.justify }}>
                        <div style={{ textAlign: 'center', lineHeight: '1.8' }}>
                            <h2 style={{ margin: '0', fontSize: '10pt' }}>
                                Appendix-II
                            </h2>
                            <div style={{ marginTop: '25px', fontSize: '10pt' }}>
                                Agreement between HLFPPT
                            </div>
                            <div style={{ margin: '10px 0', fontSize: '10pt' }}>
                                and
                            </div>
                            <div style={{ marginBottom: '25px', fontSize: '10pt', fontWeight: 'bold' }}>
                                {data?.employeeName}
                            </div>
                            <div style={{ margin: '0', textDecoration: 'none', fontSize: '10pt', fontWeight: 'bold' }}>
                                Agreed Consultancy fee for the post of Consultant
                            </div>
                        </div>
                        <div style={{ ...letterStyles.justify, marginTop: '30px' }}>
                            <div style={{ margin: '20px 0 10px 0', fontWeight: 'bold', fontSize: '10pt' }}>
                                Consultancy fee
                            </div>
                            <p style={{ marginBottom: '10px' }}>
                                The party shall be paid a consultancy fee of <strong>Rs.
                                    {data?.feeAmount} (Rupees {data?.feeAmountWords})</strong> per
                                {data?.paymentType?.toLowerCase() === 'month' ? ' month' : ' day'}
                                against submission of invoice and Time Sheet.The month being defined as minimum of {data?.workingDays} working days per
                                calendar month.
                            </p>

                            <div style={{ margin: '20px 0 10px 0', fontWeight: 'bold', fontSize: '10pt' }}>
                                TDS
                            </div>
                            <p style={{ marginBottom: '30px' }}>
                                The Trust shall deduct income tax at source (TDS) as per Income Tax Act, which shall be
                                deposited from the remuneration of the Party.
                            </p>

                            <div style={{ textAlign: 'center', margin: '40px 0' }}>
                                <p>***********</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer pinned to bottom */}
                    <div style={footerStyle}>
                        <FooterWithSignatureOnly
                            webSettingData={data?.webSettingData}
                            showSignature={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultantLetter;