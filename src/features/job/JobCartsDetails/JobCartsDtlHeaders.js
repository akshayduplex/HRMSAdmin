import React, { useEffect } from 'react';
import { FiCalendar } from "react-icons/fi";
import { GiSandsOfTime } from "react-icons/gi";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { CamelCases, changeJobTypeLabel, DateFormate } from '../../../utils/common';
import { GetJobListById } from '../../slices/AtsSlices/getJobListSlice';
import moment from 'moment';
import { BsBriefcase, BsBuildings } from 'react-icons/bs';
import { CiUser } from 'react-icons/ci';
import { FcDepartment } from 'react-icons/fc';

const JobDtlHeader = () => {
    const { id } = useParams();
    const jobDetails = useSelector((state) => state.getJobsList.getJobListById);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(GetJobListById(id));
    }, [dispatch, id])


    return (
        <>
            <div className="detailsbox actvjb_hdr mb-4">
                <div className="dtlheadr">
                    <div className="job_postn">
                        <span className="work_loc">{jobDetails.status === 'success' && changeJobTypeLabel(jobDetails.data.job_type)}</span>
                        <h3> {jobDetails.status === 'success' && jobDetails.data.job_title} </h3>
                        <p><span> {jobDetails.status === 'success' && jobDetails.data.location[0]?.name} </span></p>
                        <p><span><BsBuildings /> {jobDetails.status === 'success' && jobDetails.data?.project_name} </span></p>
                    </div>
                    <div className='jbsum_dtls dflexbtwn'>
                        <div className="">

                            <div className='job_summry'>
                                <div className="jbsum">
                                    <span>Job Type</span>
                                    <p><FiCalendar />  {jobDetails.status === 'success' && changeJobTypeLabel(jobDetails.data.job_type)}</p>
                                </div>
                                <div className="jbsum">
                                    <span>Salary Range</span>
                                    <p><MdOutlineCurrencyRupee />  {jobDetails.status === 'success' && jobDetails.data.salary_range}</p>
                                </div>
                                <div className="jbsum">
                                    <span>Deadline</span>
                                    <p><GiSandsOfTime /> {jobDetails.status === 'success' && moment(jobDetails.data.deadline).format("DD MMM YYYY")} </p>
                                </div>
                            </div>


                            <div className="d-flex gap-5 mt-3 jbsum">
                                <p className="text-start jbsum">
                                    <CiUser /> Sanctioned Position(s):  {jobDetails.status === 'success' && jobDetails.data?.total_vacancy}
                                </p>
                                <p className="text-start jbsum">
                                    <BsBriefcase />  {jobDetails.status === 'success' && jobDetails?.data?.designation}
                                </p>
                                <p className="text-start jbsum">
                                    <FcDepartment />  {jobDetails.status === 'success' && jobDetails?.data?.department}
                                </p>
                            </div>

                        </div>
                        <div className="apply_share">
                            <div className="d-flex flex-column gap-2">
                                <Link className='detaibtn' to={`/add-candidate?jobId=${jobDetails.status === 'success' && jobDetails.data._id}`}>+ Add Candidate</Link>

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
