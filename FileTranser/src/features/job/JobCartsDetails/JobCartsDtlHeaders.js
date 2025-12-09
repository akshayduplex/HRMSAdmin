import React, { useEffect } from 'react';
import { FiCalendar } from "react-icons/fi";
import { GiSandsOfTime } from "react-icons/gi";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { useSelector , useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { CamelCases, DateFormate } from '../../../utils/common';
import { GetJobListById } from '../../slices/AtsSlices/getJobListSlice';
import moment from 'moment';

const JobDtlHeader = () => {
    const { id } = useParams();
    const jobDetails = useSelector((state) => state.getJobsList.getJobListById);
    const dispatch = useDispatch();

    useEffect(() => {
       dispatch(GetJobListById(id));
    } , [dispatch , id])


    return (
        <>
            <div className="detailsbox actvjb_hdr mb-4">
                <div className="dtlheadr">
                    <div className="job_postn">
                        <span className="work_loc">{jobDetails.status === 'success' && CamelCases(jobDetails.data.working) }</span>
                        <h3> {jobDetails.status === 'success' && jobDetails.data.job_title } </h3>
                        <p><span> {jobDetails.status === 'success' && jobDetails.data.location[0]?.name } </span></p>
                    </div>
                    <div className='jbsum_dtls dflexbtwn'>
                        <div className="job_summry">
                            <div className="jbsum">
                                <span>Job Type</span>
                                <p><FiCalendar />{jobDetails.status === 'success' && jobDetails.data.job_type }</p>
                            </div>
                            <div className="jbsum">
                                <span>Salary Range</span>
                                <p><MdOutlineCurrencyRupee /> {jobDetails.status === 'success' && jobDetails.data.salary_range }</p>
                            </div>
                            <div className="jbsum">
                                <span>Deadline</span>
                                <p><GiSandsOfTime /> {jobDetails.status === 'success' && moment(jobDetails.data.deadline).format("DD MMM YYYY") } </p>
                            </div>
                        </div>
                        <div className="apply_share">
                            <div className="d-flex flex-column gap-2">
                                <Link className='detaibtn' to={`/job-details/${jobDetails.status === 'success' && jobDetails.data._id}`}>View Detail</Link>
                                <span className="datetime">
                                   {jobDetails.status === 'success' && DateFormate(jobDetails.data.deadline)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JobDtlHeader;
