import moment from "moment";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useSelector } from "react-redux";
import { InfinitySpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
// import { FaInfoCircle } from "react-icons/fa";
import { Tooltip, tooltipClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FaInfoCircle } from 'react-icons/fa';

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#1e293b', // dark blue-ish
    color: '#fff',
    fontSize: 13,
    borderRadius: 8,
    padding: '8px 12px',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#1e293b',
  },
}));


export default function UpcomingInterview() {
    const { InterviewsList } = useSelector((state) => state.interviewList);
    const [show, setShow] = useState(false);

    return (
        <>
            <div className="">
                <Table className="interviewtable">
                    <thead>
                        <tr>
                            <th>Srn</th>
                            <th>Candidate Details</th>
                            <th>Interview Detail</th>
                            <th>Date & Time</th>
                            <th>Interviewer</th>
                            <th>Status</th>
                            <th>Remark</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {InterviewsList?.status === "loading" ? (
                            <tr style={{ height: "100px" }}>
                                <td
                                    colSpan="100%"
                                    style={{ textAlign: "center", verticalAlign: "middle" }}
                                >
                                    {/* <div className="d-flex align-content-center justify-content-center"> */}
                                    <InfinitySpin
                                        visible={true}
                                        width="200"
                                        color="#34209b"
                                        ariaLabel="infinity-spin-loading"
                                    />
                                    {/* </div> */}
                                </td>
                            </tr>
                        ) : InterviewsList?.status === "success" &&
                            InterviewsList?.data?.length > 0 ? (
                            InterviewsList?.data.map((item, index) => {
                                return (
                                    <>
                                        <tr key={index}>
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
                                                    {/* <p>Online</p> */}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="tbltext">
                                                    <p>
                                                        {moment(
                                                            item?.applied_jobs[0]?.interview_date
                                                        ).format("DD/MM/YYYY")}{" "}
                                                    </p>
                                                    <p>
                                                        {moment(item?.applied_jobs[0]?.interview_date)
                                                            .utc()
                                                            .format("hh:mm A")}
                                                    </p>
                                                </div>
                                            </td>
                                            <td>
                                                {item?.applied_jobs[0]?.interviewer?.map(
                                                    (value, index) => {
                                                        return (
                                                            <>
                                                                <div
                                                                    className="interviewr_name"
                                                                    style={{ marginTop: "12px" }}
                                                                >
                                                                    <p> {value?.employee_name} </p>
                                                                </div>
                                                                {/* <td>
                                                                    <p className={` statustag ${value?.status === 'Accept' ? 'bglgreen' : value?.status === 'Rejected' ? "bglred" : "bglgreen"} `}>{value?.status}</p>
                                                                </td>
                                                                <td>
                                                                    <p className="reasontext">{value?.comment ? value?.comment : "--"}</p>
                                                                </td> */}
                                                            </>
                                                        );
                                                    }
                                                )}
                                            </td>
                                            <td>
                                                {item?.applied_jobs[0]?.interviewer?.map(
                                                    (value, index) => {
                                                        return (
                                                            <>
                                                                <p
                                                                    className={` statustag ${value?.status === "Accept"
                                                                        ? "bglgreen"
                                                                        : value?.status === "Reject"
                                                                            ? "bglred"
                                                                            : "bgPending"
                                                                        } `}
                                                                >
                                                                    {value?.status}
                                                                </p>
                                                                {/* <td>
                                                                    <p className="reasontext">{value?.comment ? value?.comment : "--"}</p>
                                                                </td> */}
                                                            </>
                                                        );
                                                    }
                                                )}
                                            </td>
                                            <td>
                                                {item?.applied_jobs[0]?.interviewer?.map((value, index) => {
                                                    const comment = value?.comment;

                                                    return (
                                                        <div className="resion-text" key={index}>
                                                            <p className="reasontext statustag">
                                                                {comment ? comment.slice(0, 20) + '...' : '--'}
                                                            </p>

                                                            {comment && (
                                                                <CustomTooltip title={comment} placement="top">
                                                                    <span>
                                                                        <FaInfoCircle style={{ marginLeft: '6px', cursor: 'pointer' }} />
                                                                    </span>
                                                                </CustomTooltip>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </td>

                                            <td>
                                                {item?.applied_jobs[0]?.interview_host ===
                                                    "One-To-One" ? (
                                                    <div className="tablebtns">
                                                        <Link
                                                            to={`/schedule-interview/${item?.job_id}?userId=${item?._id}&applied-job-id=${item?.applied_jobs[0]?._id}`}
                                                            className="transbtn assgnbtn"
                                                        >
                                                            Assign Interviewer
                                                        </Link>
                                                    </div>
                                                ) : (
                                                    <div className="tablebtns">
                                                        <button className="transbtn assgnbtn" disabled>
                                                            Assign Interviewer
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    </>
                                );
                            })
                        ) : (
                            <tr style={{ height: "100px" }}>
                                <td
                                    colSpan="100%"
                                    style={{ textAlign: "center", verticalAlign: "middle" }}
                                >
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </>
    );
}
