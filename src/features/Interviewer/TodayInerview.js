import React from "react";
import Table from 'react-bootstrap/Table';
import { useSelector } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import { InfinitySpin } from 'react-loader-spinner'


export default function TodayInterview() {
    const { InterviewsList } = useSelector((state) => state.interviewList);

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
                        {
                            InterviewsList?.status === 'loading' ?
                                <tr style={{ height: '100px' }}>
                                    <td colSpan="100%" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                        {/* <div className="d-flex align-content-center justify-content-center"> */}
                                            <InfinitySpin
                                                visible={true}
                                                width="200"
                                                color="#34209b"
                                                ariaLabel="infinity-spin-loading"
                                            />
                                    </td>
                                </tr> :
                                InterviewsList?.status === 'success' && InterviewsList?.data?.length > 0
                                    ? InterviewsList?.data.map((item, index) => {
                                        return (
                                            <tr>
                                                <td>
                                                    <p>{index + 1}</p>
                                                </td>
                                                <td>
                                                    <div className="tbltext">
                                                        <p>{item?.name}</p>
                                                        <p>{item?.applied_jobs[0]?.stage}</p>
                                                        <p>{item?.applied_jobs[0]?.interview_host}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="tbltext">
                                                        <p>{item?.job_title}</p>
                                                        <p>{item?.applied_jobs[0]?.interview_type}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="tbltext">
                                                        <p>{moment(item?.applied_jobs[0]?.interview_date).format('DD/MM/YYYY')}  </p>
                                                        <p>{moment(item?.applied_jobs[0]?.interview_date).utc().format('hh:mm A')}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    {
                                                        item?.applied_jobs[0]?.interviewer?.map((value, index) => {
                                                            return (
                                                                <>

                                                                    <div className="interviewr_name">
                                                                        <p> {value?.employee_name}  </p>
                                                                    </div>
                                                                </>
                                                            )
                                                        })
                                                    }
                                                </td>
                                                {
                                                    item?.applied_jobs[0]?.interview_type === 'Online' ?
                                                        <td>
                                                            <div className="tablebtns">
                                                                {/* <button className="transbtn assgnbtn">Join Interview</button> */}
                                                                <a href={item?.applied_jobs[0]?.google_meet_link} className="transbtn assgnbtn" target="_blank" rel="noopener noreferrer">
                                                                    Join Interview
                                                                </a>
                                                            </div>
                                                        </td>
                                                        :
                                                        <td>
                                                            <div className="tablebtns">
                                                                <button disabled className="transbtn assgnbtn">Join Interview</button>
                                                            </div>
                                                        </td>
                                                }
                                            </tr>
                                        )
                                    }) :
                                    <tr style={{ height: '100px' }}>
                                        <td colSpan="100%" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            No records found
                                        </td>
                                    </tr>
                        }
                    </tbody>
                </Table>
            </div>

        </>
    );
}
