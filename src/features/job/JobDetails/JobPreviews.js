import React from "react";
import { BsBriefcase, BsBuildings } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { GiSandsOfTime } from "react-icons/gi";
import { RiTimelineView } from "react-icons/ri";
import moment from "moment/moment";
import { CiUser } from "react-icons/ci";
import { FcDepartment } from "react-icons/fc";
import { CamelCases, changeJobTypeLabel } from "../../../utils/common";
import LocationOnIcon from '@mui/icons-material/LocationOn';




export default function JobPreview({ data }) {

    console.log( data , 'this is data from the job changes Data here ' )

    return (
        <>
            {/* <div className="maininnerSec"> */}
                {/* <div className="privew-innerSec">
                    <div className="details-privew">
                        <h4>{data.job_title}</h4>
                        <div className="innderdetails jobtags">
                            {
                                data.tags.length !== 0 &&
                                data.tags.map((key, index) => {
                                    return (
                                        <span className={`${index % 2 === 0 ? "bg_redlt" : "bg-pink"}`}>{key?.name}</span>
                                    )
                                })
                            }
                        </div>
                        <div className="d-flex gap-5">
                            <p className="text-start">
                                <BsBuildings /> {data?.project_name}
                            </p>
                            <p className="text-start">
                                <CiUser /> Sanctioned Position(s): {data?.total_vacancy}
                            </p>
                            <p className="text-start">
                                <BsBriefcase />  {data?.designation}
                            </p>
                            <p className="text-start">
                                <FcDepartment />  {data?.department}
                            </p>
                        </div>
                    </div>
                    <div className="priew-submit">
                        <button className="submitbtn px-5">
                            <FaCheckCircle /> Submit
                        </button>
                    </div>
                </div> */}
            {/* </div> */}
            <div className="jobdetailsSecmain">
                <h6>Job Details</h6>
                <div className="jobdetailsInner">
                    <div className="Jobtypes">
                        <span>Job Type</span>
                        <p>
                            <RiTimelineView /> { changeJobTypeLabel(data.job_type) }
                        </p>
                    </div>
                    <div className="Jobtypes">
                        <span>MPR Type</span>
                        <p>
                            <RiTimelineView /> { CamelCases(data?.requisition_form_opening_type) || "N/A"  }{" "} { data?.requisition_form_opening_type === 'new' && 'Opening' }
                        </p>
                    </div>
                    <div className="Jobtypes">
                        <span>Salary Range</span>
                        <p>
                            <LiaRupeeSignSolid /> {data.salary_range}
                        </p>
                    </div>
                    <div className="Jobtypes">
                        <span>Deadline</span>
                        <p>
                            <GiSandsOfTime /> {moment(data.deadline).format("DD MMM YYYY")}
                        </p>
                    </div>
                </div>

                <div className="healthmain-Sec">
                    <h6>Benefits</h6>
                    <div className="health-Sec">
                        {
                            data.benefits.length !== 0
                            && data.benefits.map((key, index) => {
                                return (
                                    <div key={index} className="Jobtypes">
                                        <p>{key?.name}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                
                <div className="healthmain-Sec">
                    <h6>Location</h6>
                    <div className="health-Sec flex-wrap gap-2">
                        {
                            data.location.length !== 0
                            && data.location.map((key, index) => {
                                return (
                                    <div key={index} className="Jobtypes">
                                        <p><LocationOnIcon /> {key?.name}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <div className="mt-3" dangerouslySetInnerHTML={{ __html: data.description }}>
                </div>
            </div>
        </>
    );
}
