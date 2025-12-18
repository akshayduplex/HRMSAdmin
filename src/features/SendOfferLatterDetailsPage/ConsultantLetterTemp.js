// ConsultantLetter.jsx
import React from 'react';

const ConsultantLetter = ({
    designation = '',
    joiningDate = '',
    employeeName = '',
    relationship = 'S/O',
    address = '',
    contractExpiryDate = '',
    location = '',
    state = '',
    reportingDesignation = '',
    reportingLocation = '',
    consultancyFee = '',
    feePeriod = 'per month',
    workingDays = '',
    witness1Name = '',
    witness1Address = '',
    witness2Name = '',
    witness2Address = ''
}) => {
    return (
        <div className="consultant-letter" style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.5', fontSize: '12pt' }}>
            <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' }}>
                <p>Terms of Contract for Appointment as</p>
                <p>Consultant ({designation})</p>
            </div>

            <p style={{ textAlign: 'justify' }}>
                Articles of Agreement made this day, the <span style={{ backgroundColor: '#ffff00' }}>{joiningDate}</span>
                between <span style={{ backgroundColor: '#ffff00' }}>{employeeName}</span> resident of
                [{relationship}:, At- <span style={{ backgroundColor: '#ffff00' }}>{address}</span>],
                hereinafter called the Party, of the one part and the Hindustan Latex Family Planning Promotion Trust
                (HLFPPT) B-14 A, IInd Floor, Sector - 62, Gautam Budh Nagar, Noida-201301, hereinafter called the Trust,
                of the other part.
            </p>

            <p style={{ textAlign: 'justify' }}>
                WHEREAS the Trust has engaged the Party as <strong>Consultant,</strong> on contract basis and Party has agreed
                to serve the Trust in that capacity on the terms and conditions hereinafter contained.
            </p>

            <p style={{ textAlign: 'justify' }}>
                NOW THESE PRESENT WITNESS AND THE Parties hereto respectively agree as follows: -
            </p>

            <ol style={{ textAlign: 'justify' }}>
                <li>
                    The party of the first part shall remain in the service of the Trust as <strong>Consultant</strong> from
                    <span style={{ backgroundColor: '#ffff00' }}> {joiningDate}</span> to
                    <span style={{ backgroundColor: '#ffff00' }}> {contractExpiryDate}</span> or till the completion of the
                    project whichever is earlier (hereinafter called 'contractual period') subject to the provisions herein contained.
                </li>
                <li>
                    The Party has agreed to perform duties as per the job description set out in <strong>Appendix - I</strong> hereto,
                    which shall constitute an integral part of this Agreement.
                </li>
                <li>
                    During the period of contract, while functioning as <strong>Consultant,</strong> the Party will be entitled
                    to the consultancy fee as set out in the <strong>Appendix - II</strong> hereto which shall constitute an
                    integral part of this Agreement.
                </li>
                <li>
                    The appointment of the Party is purely on a contract basis and the Party will not be entitled to any claims,
                    rights, interests or further benefits in terms of regularization or consideration of further appointment to
                    the said post or any other post under the Trust.
                </li>
                <li>
                    During the period of employment pursuant hereto, the party shall devote his/her whole time and attention
                    to the work entrusted to his/her and shall not engage directly or indirectly in any other business, work or services.
                </li>
                <li>
                    The services of the Party shall stand automatically terminated at the expiry of contract period, without
                    any necessity of the Trust giving any notice or notice pay to the Party and without any liability on part
                    of the Trust to pay any retrenchment or other compensation or other amounts to the Party.
                </li>
                <li>
                    Notwithstanding anything contained herein above, the consultancy services of the Party may be terminated
                    at any time by the Trust without any notice or notice pay or consultancy fee whatsoever, if the Party is
                    found to be guilty of any insubordination, intemperance or other misconduct or of any breach or non-performance.
                </li>
                <li>
                    The party acknowledges that in the course of its operations, HLFPPT has developed and gathered extensive
                    data, information, procedures, processes methods and system of a confidential and proprietary nature including,
                    without limitation, information or evaluations to grant applications and distributions, contract persons,
                    programs of HLFPPT, research data, planning data, development data, experience data, business processes,
                    methods, know-how and other confidential information, knowledge or data used or useful in conducting the
                    operations of HLFPPT (collectively, the "Confidential information"); that the disclosure there if is being
                    made by HLFPPT to the party only because of the position of trust and confidence to the restrictions contained
                    herein; that all such confidential information is the sole Property of HLFPPT that strict protection of the
                    confidential information is necessary to the successful continuation information is necessary to the successful
                    continuation of the operations of the HLFPPT and that unauthorized use or disclosure of the confidential
                    information would irreparably harm HLFPPT, the party of the first part agrees that the party will not directly
                    or indirectly divulge, disclosure or use at any time, either during the terms of this agreement or at any time
                    thereafter, any confidential information, unless consultant shall first have secured the written consent of
                    HLFPPT or unless such disclosure or use is both necessary in the performances of the services and specifically
                    authorized pursuant to HLFPPT written publication policy, as the same may be revised from time to time.
                </li>
                <li>
                    Either of the parties hereto have the right to terminate this Agreement without assigning any reasons
                    provided that a written notice of one month is given to the other party. Both the parties may, in lieu
                    of the written notice, give the other party a sum equivalent to the amount of a fee for one month or
                    shorter notice than one month with the sum equivalent to the amount of her monthly fee for the period
                    of which such notice falls short of one month.
                </li>
                <li>
                    The tribunals and courts in Trivandrum will have the exclusive jurisdiction in respect of all matters
                    pertaining to contractual agreement between the Trust and the Party.
                </li>
            </ol>

            <p style={{ textAlign: 'justify' }}>
                In witness thereof, the Party and the authorized signatory of the Trust have hereunto set their hands
                the day and year first above written.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '30px' }}>
                <tr>
                    <td style={{ width: '50%', verticalAlign: 'top', padding: '10px' }}>
                        <p><strong>For the Trust:</strong></p>
                        <p style={{ marginTop: '50px' }}>Signature</p>
                        <p>Name: <strong>Awanish Awasthi</strong></p>
                        <p>Designation: <strong>Associate National Lead--HR & Admin</strong></p>
                        <p>Dated:</p>
                    </td>
                    <td style={{ width: '50%', verticalAlign: 'top', padding: '10px' }}>
                        <p><strong>For the Party:</strong></p>
                        <p style={{ marginTop: '50px' }}>Signature:</p>
                        <p>Name: <span style={{ backgroundColor: '#ffff00' }}>{employeeName}</span></p>
                        <p>Designation in the Trust: <span style={{ backgroundColor: '#ffff00' }}>Consultant({designation})</span></p>
                        <p>Dated:</p>
                    </td>
                </tr>
                <tr>
                    <td style={{ padding: '10px', borderTop: '1px solid #000' }}>
                        <p><strong>Witness 1</strong></p>
                        <p>Signature</p>
                        <p>Name: <span style={{ backgroundColor: '#ffff00' }}>{witness1Name}</span></p>
                        <p>Address: <span style={{ backgroundColor: '#ffff00' }}>{witness1Address}</span></p>
                        <p>Dated:</p>
                    </td>
                    <td style={{ padding: '10px', borderTop: '1px solid #000' }}>
                        <p><strong>Witness 2</strong></p>
                        <p>Signature</p>
                        <p>Name: <span style={{ backgroundColor: '#ffff00' }}>{witness2Name}</span></p>
                        <p>Address: <span style={{ backgroundColor: '#ffff00' }}>{witness2Address}</span></p>
                        <p>Dated:</p>
                    </td>
                </tr>
            </table>

            {/* Appendix I */}
            <div style={{ pageBreakBefore: 'always', marginTop: '40px' }}>
                <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    <p>Appendix-I</p>
                    <p>Agreement between HLFPPT</p>
                    <p>and</p>
                    <p><span style={{ backgroundColor: '#ffff00' }}>{employeeName}</span></p>
                    <p>Terms of reference for the post of Consultant</p>
                </div>

                <p style={{ textAlign: 'justify' }}>
                    The normal place of work for the Party will be at
                    <span style={{ backgroundColor: '#ffff00' }}> {location}, {state}</span> but his/her services
                    during the period will be available to any other sites of HLFPPT or its projects deployed
                    anywhere in India, in accordance with the concerned projects policy and rules for the time being in force.
                </p>

                <div style={{ textAlign: 'center', fontWeight: 'bold', margin: '20px 0' }}>
                    <p>Terms of reference for Consultant ({designation})</p>
                </div>

                <div style={{ textAlign: 'center', fontWeight: 'bold', margin: '20px 0' }}>
                    <p>2 Reporting</p>
                </div>

                <p style={{ textAlign: 'justify' }}>
                    The party will report on day-to-day activities to the
                    <span style={{ backgroundColor: '#ffff00' }}> {reportingDesignation}, {reportingLocation}</span>
                    who will be responsible for monitoring and evaluating his/her performance.
                </p>

                <p style={{ textAlign: 'center', fontWeight: 'bold', margin: '20px 0' }}>
                    3 Relationship of the Parties
                </p>

                <p style={{ textAlign: 'justify' }}>
                    This Agreement and any rights hereunder can neither be assigned nor subcontracted by the Party to a third party.
                </p>

                <p style={{ textAlign: 'justify' }}>
                    The Party is in no way a legal representative or agent or employee or subordinate of the Trust for any
                    purpose whatsoever and the Party has no right or authority to assume or create, in writing or otherwise,
                    any obligation of any kind, express or implied, or enter into any agreement in the name of or on behalf
                    of the Trust.
                </p>

                <p style={{ textAlign: 'center', fontWeight: 'bold', margin: '20px 0' }}>
                    *****************
                </p>
            </div>

            {/* Appendix II */}
            <div style={{ pageBreakBefore: 'always', marginTop: '40px' }}>
                <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    <p>Appendix-II</p>
                    <p>Agreement between HLFPPT</p>
                    <p>and</p>
                    <p><span style={{ backgroundColor: '#ffff00' }}>{employeeName}</span></p>
                    <p>Agreed Consultancy fee for the post of <strong>Consultant</strong></p>
                </div>

                <p style={{ textAlign: 'center', fontWeight: 'bold', margin: '20px 0' }}>
                    Consultancy fee
                </p>

                <p style={{ textAlign: 'justify' }}>
                    The party shall be paid a consultancy fee of
                    <span style={{ backgroundColor: '#ffff00' }}> {consultancyFee}</span>
                    <span style={{ backgroundColor: '#ffff00' }}> {feePeriod}</span> against submission of invoice and Time Sheet.
                    The month being defined as minimum of <span style={{ backgroundColor: '#ffff00' }}>{workingDays}</span>
                    working days per calendar month.
                </p>

                <p style={{ textAlign: 'center', fontWeight: 'bold', margin: '20px 0' }}>
                    TDS
                </p>

                <p style={{ textAlign: 'justify' }}>
                    The Trust shall deduct income tax at source (TDS) as per Income Tax Act, which shall be deposited
                    from the remuneration of the Party.
                </p>

                <p style={{ textAlign: 'center', fontWeight: 'bold', margin: '20px 0' }}>
                    *********
                </p>
            </div>
        </div>
    );
};

export default ConsultantLetter;