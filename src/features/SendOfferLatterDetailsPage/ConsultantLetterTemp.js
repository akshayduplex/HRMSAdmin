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
    const currentDate = data?.currentDate || getCurrentDate();
    const footerColor = data.webSettingData?.footer_color || '#3caf40';
    return (
        <div style={letterStyles.page}>
            {/* Watermark */}
            <DocumentWatermark webSettingData={data?.webSettingData} />

            {/* Simple Header - only logo with line */}
            <LetterHeader webSettingData={data?.webSettingData} />

            {/* Title */}
            <div style={letterStyles.center}>
                <h2 style={{ margin: '20px 0 10px 0', fontSize: '14pt' }}>
                    Terms of Contract for Appointment as
                </h2>
                <h2 style={{ margin: '0 0 20px 0', fontSize: '14pt', textDecoration: 'underline', }}>{data?.designation}</h2>
            </div>

            {/* Main Content */}
            <div style={letterStyles.justify}>
                <p style={{ marginBottom: '20px' }}>
                    <strong>ARTICLES OF AGREEMENT</strong> made this day, the <span style={{ paddingRight: '5px' }}> {data?.joiningDate} </span> between {data?.employeeName}
                    resident of {data?.relativeName}, At- {data?.address},
                    hereinafter called the Party, of the one part and the <strong>Hindustan Latex
                        Family Planning Promotion Trust (HLFPPT)</strong> B-14 A, IInd Floor, Sector - 62, Gautam Budh
                    Nagar, Noida-201301, hereinafter called the Trust, of the other part.
                </p>

                <p style={{ marginBottom: '20px' }}>
                    WHEREAS the Trust has engaged the Party as <strong>Consultant</strong>, on contract basis
                    and Party has agreed to serve the Trust in that capacity on the terms and conditions
                    hereinafter contained.
                </p>

                <p style={{ marginBottom: '30px' }}>
                    <strong>NOW THESE PRESENT WITNESS AND THE Parties hereto respectively agree as follows: -</strong>
                </p>

                <ol style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                    {/* Terms 1-7 */}
                    <li style={{ marginBottom: '10px' }}>
                        The party of the first part shall remain in the service of the Trust as
                        <strong> Consultant</strong> from <span style={{ paddingRight: '5px' }}>{data?.joiningDate} </span> to
                        {data?.contractExpiryDate} or till the completion of the project
                        whichever is earlier (hereinafter called 'contractual period') subject to the
                        provisions herein contained.
                    </li>

                    <li style={{ marginBottom: '10px' }}>
                        The Party has agreed to perform duties as per the job description set out in
                        <strong> Appendix - I</strong> hereto, which shall constitute an integral part of
                        this Agreement.
                    </li>

                    <li style={{ marginBottom: '10px' }}>
                        During the period of contract, while functioning as <strong>Consultant</strong>, the
                        Party will be entitled to the consultancy fee as set out in the <strong>Appendix - II</strong>
                        hereto which shall constitute an integral part of this Agreement.
                    </li>

                    <li style={{ marginBottom: '10px' }}>
                        The appointment of the Party is purely on a contract basis and the Party will not be
                        entitled to any claims, rights, interests or further benefits in terms of regularization
                        or consideration of further appointment to the said post or any other post under the
                        Trust.
                    </li>

                    <li style={{ marginBottom: '10px' }}>
                        During the period of employment pursuant hereto, the party shall devote his/her whole
                        time and attention to the work entrusted to his/her and shall not engage directly or
                        indirectly in any other business, work or services.
                    </li>

                    <li style={{ marginBottom: '10px' }}>
                        The services of the Party shall stand automatically terminated at the expiry of contract
                        period, without any necessity of the Trust giving any notice or notice pay to the Party
                        and without any liability on part of the Trust to pay any retrenchment or other
                        compensation or other amounts to the Party.
                    </li>

                    <li style={{ marginBottom: '10px' }}>
                        Notwithstanding anything contained herein above, the consultancy services of the Party
                        may be terminated at any time by the Trust without any notice or notice pay or
                        consultancy fee whatsoever, if the Party is found to be guilty of any insubordination,
                        intemperance or other misconduct or of any breach or non-performance.
                    </li>
                </ol>

                {/* Footer for FIRST PAGE - Full text + signature */}
                <FooterWithTextAndSignature
                    webSettingData={data?.webSettingData}
                    showSignature={true}
                />
            </div>

            {/* Page Break for remaining terms (Page 2) */}
            <div style={{ pageBreakBefore: 'always' }}>
                {/* Watermark for second page */}
                <DocumentWatermark webSettingData={data?.webSettingData} />

                {/* Header for second page */}
                <LetterHeader webSettingData={data?.webSettingData} />

                <div style={letterStyles.justify}>
                    <ol start="8">
                        <li style={{ marginBottom: '10px' }}>
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

                    <p style={{ marginBottom: '40px' }}>
                        In witness thereof, the Party and the authorized signatory of the Trust have hereunto set
                        their hands the day and year first above written.
                    </p>

                    {/* Signatures Table */}
                    <table style={{ ...letterStyles.table, marginTop: '40px' }}>
                        <tbody>
                            <tr>
                                <td colSpan={2} style={{ ...letterStyles.td, textAlign: 'center', fontWeight: 'bold' }}>
                                    For the Trust:
                                </td>
                                <td colSpan={2} style={{ ...letterStyles.td, textAlign: 'center', fontWeight: 'bold' }}>
                                    For the Party:
                                </td>
                            </tr>
                            <tr>
                                <td style={{ ...letterStyles.td }}>
                                    <div>Signature:</div>
                                    <img
                                        src={config.IMAGE_PATH + data?.webSettingData?.hod_hr_signature}
                                        alt="HR Signature"
                                        style={{ width: '120px', height: '50px', objectFit: 'contain' }}
                                    />
                                </td>
                                <td style={letterStyles.td}></td>
                                <td style={letterStyles.td}>Signature:</td>
                                <td style={letterStyles.td}></td>
                            </tr>
                            <tr>
                                <td style={letterStyles.td}>Name:</td>
                                <td style={letterStyles.td}><strong>Awanish Awasthi</strong></td>
                                <td style={letterStyles.td}>Name:</td>
                                <td style={letterStyles.td}>{data?.employeeName}</td>
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
                                <td colSpan={2} style={{ ...letterStyles.td, textAlign: 'center' }}>
                                    <WitnessSignature witnessNumber={1} />
                                </td>
                                <td colSpan={2} style={{ ...letterStyles.td, textAlign: 'center' }}>
                                    <WitnessSignature witnessNumber={2} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div style={{ height: '3px', backgroundColor: footerColor, marginBottom: '15px' }} />

            {/* Page Break for Appendix I (Page 3) */}
            <div style={{ pageBreakBefore: 'always' }}>
                <div style={pageStyle}>
                    {/* Watermark */}
                    <DocumentWatermark webSettingData={data?.webSettingData} />

                    {/* Header */}
                    <LetterHeader webSettingData={data?.webSettingData} />

                    {/* Page Content */}
                    <div style={{ ...letterStyles.justify }}>
                        <div style={letterStyles.center}>
                            <h2 style={{ margin: '0 0 30px 0', fontSize: '14pt' }}>Appendix-I</h2>
                            <h3 style={{ margin: '0 0 20px 0', fontSize: '12pt' }}>
                                Agreement between HLFPPT and {data?.employeeName}
                            </h3>
                            <h4 style={{ margin: '0', textDecoration: 'underline' }}>
                                Terms of reference for the post of Consultant
                            </h4>
                        </div>
                        <div style={{ ...letterStyles.justify, marginTop: '30px' }}>
                            <h5 style={{ margin: '20px 0 10px 0' }}>
                                Consultancy fee
                            </h5>
                            <p style={{ marginBottom: '10px' }}>
                                The party shall be paid a consultancy fee of <strong>Rs.
                                    {data?.feeAmount} (Rupees {data?.feeAmountWords})</strong> per
                                {data?.paymentType?.toLowerCase() === 'month' ? ' month' : ' day'}
                                against submission of invoice and Time Sheet.
                            </p>
                            <p style={{ marginBottom: '20px' }}>
                                The month being defined as minimum of {data?.workingDays} working days per
                                calendar month.
                            </p>

                            <h5 style={{ margin: '20px 0 10px 0' }}>
                                TDS
                            </h5>
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


            {/* Page Break for Appendix II (Page 4) */}
            <div style={{ pageBreakBefore: 'always' }}>
                <div style={pageStyle}>
                    <DocumentWatermark webSettingData={data?.webSettingData} />
                    <LetterHeader webSettingData={data?.webSettingData} />

                    <div style={{ ...letterStyles.justify }}>
                        <div style={letterStyles.center}>
                            <h2 style={{ margin: '0 0 30px 0', fontSize: '14pt' }}>Appendix-II</h2>
                            <h3 style={{ margin: '0 0 20px 0', fontSize: '12pt' }}>
                                Agreement between HLFPPT and {data?.employeeName}
                            </h3>
                            <h4 style={{ margin: '0', textDecoration: 'underline' }}>
                                Agreed Consultancy fee for the post of <strong>Consultant</strong>
                            </h4>
                        </div>
                        <div style={{ ...letterStyles.justify, marginTop: '30px' }}>
                            <p style={{ marginBottom: '20px' }}>
                                The normal place of work for the Party will be at {data?.location}  but
                                his/her services during the period will be available to any other sites of HLFPPT or its
                                projects deployed anywhere in India, in accordance with the concerned projects policy and
                                rules for the time being in force.
                            </p>

                            <h5 style={{ margin: '20px 0 10px 0', textDecoration: 'underline' }}>
                                Terms of reference for Consultant ({data?.designation})
                            </h5>
                            <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                                {/* <li style={{ marginBottom: '5px' }}>•</li>
                        <li style={{ marginBottom: '5px' }}>•</li>
                        <li style={{ marginBottom: '5px' }}>•</li> */}
                            </ul>

                            <h5 style={{ margin: '30px 0 10px 0', textDecoration: 'underline' }}>
                                Reporting
                            </h5>
                            <p style={{ marginBottom: '20px' }}>
                                The party will report on day-to-day activities to the {data?.reportingTo},
                                {data?.location} who will be responsible for monitoring and evaluating
                                his/her performance.
                            </p>

                            <h5 style={{ margin: '30px 0 10px 0', textDecoration: 'underline' }}>
                                Relationship of the Parties
                            </h5>
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

                            <div style={{ textAlign: 'center', margin: '30px 0' }}>
                                <p>***********</p>
                            </div>
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

        </div>
    );
};

export default ConsultantLetter;