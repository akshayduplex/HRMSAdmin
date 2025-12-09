import React from "react";
import Table from 'react-bootstrap/Table';

export default function TodayInterview() {
   

    return (
        <>

            <div className=''>
                <Table className='interviewtable'>
                    <thead>
                        <tr>
                            <th>Srn</th>
                            <th>Candidate Details</th>
                            <th>Interview Detail</th>
                            <th>Date & Time</th>
                            <th>Interviewer</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <p>1</p>
                            </td>
                            <td>
                                <div className="tbltext">
                                    <p>Ansul Awasthi</p>
                                    <p>1st Round</p>
                                    <p>One-on-One</p>
                                </div>
                            </td>
                            <td>
                                <div className="tbltext">
                                    <p> Sale Associate  </p>
                                    <p>Online</p>
                                </div>
                            </td>
                            <td>
                                <div className="tbltext">
                                    <p> 15/4/2024  </p>
                                    <p>10:30 am</p>
                                </div>
                            </td>
                            <td>
                                <div className="interviewr_name">
                                    <p> Anjali S  </p>
                                </div>
                            </td>
                            <td>
                                <div className="tablebtns">
                                    <button className="transbtn assgnbtn">Join Interview</button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>2</p>
                            </td>
                            <td>
                                <div className="tbltext">
                                    <p>Ansul Awasthi</p>
                                    <p>1st Round</p>
                                    <p>One-on-One</p>
                                </div>
                            </td>
                            <td>
                                <div className="tbltext">
                                    <p> Sale Associate  </p>
                                    <p>Online</p>
                                </div>
                            </td>
                            <td>
                                <div className="tbltext">
                                    <p> 15/4/2024  </p>
                                    <p>10:30 am</p>
                                </div>
                            </td>
                            <td>
                                <div className="interviewr_name">
                                    <p> Anjali S  </p>
                                    <p>Ankit R</p>
                                    <p>Tarun</p>
                                </div>
                            </td>
                            <td>
                                <div className="tablebtns">
                                    <button className="transbtn assgnbtn">Join Interview</button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>3</p>
                            </td>
                            <td>
                                <div className="tbltext">
                                    <p>Ansul Awasthi</p>
                                    <p>2nd Round</p>
                                    <p>One-on-One</p>
                                </div>
                            </td>
                            <td>
                                <div className="tbltext">
                                    <p> Sale Associate</p>
                                    <p>Online</p>
                                </div>
                            </td>
                            <td>
                                <div className="tbltext">
                                    <p> 15/4/2024 </p>
                                    <p>10:30 am</p>
                                </div>
                            </td>
                            <td>
                                <div className="interviewr_name">
                                    <p>Ankit R</p>
                                    <p>Tarun</p>
                                </div>
                            </td>
                          
                            <td>
                                <div className="tablebtns">
                                    <button className="transbtn assgnbtn">Join Interview</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>

        </>
    );
}
