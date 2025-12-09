import React from "react";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { BsBriefcase, BsBuildings } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { isJobExpired } from "../../../utils/common";
import moment from "moment";
import { CiEdit, CiUser } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import NaukariMenu from "./NaukariMenu";

function JobCards({ data }) {

    const [buttonPosition, setButtonPosition] = React.useState({ right: '1%', top: '64%' });

    // Add this useEffect to handle window resize
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) { // Mobile
                setButtonPosition({ position: 'inherit', margin: '1rem 0' });
            } else { // Desktop
                setButtonPosition({ position: 'absolute', right: '1%', top: '64%' });
            }
        };
        // Initial call
        handleResize();
        // Add event listener
        window.addEventListener('resize', handleResize);
        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <div className="card hr_jobcards me-2">
                <div className="card-body">
                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex flex-column gap-1 contenter justify-content-between">
                                <h3 className="text-start jobcrdhdng mb-0">
                                    <Link to={`/job-cards-details/${data._id}`}>{data.job_title}</Link>
                                </h3>
                                <div className="project_location">
                                    <span className="text-start">
                                        <BsBuildings />
                                        {" "}
                                        {data?.project_name}
                                    </span>
                                    <span className="text-start location">
                                        <FaLocationDot />
                                        {" "}
                                        {data?.location[0]?.name}
                                    </span>
                                </div>
                                <div className="project_location">
                                    <span className="text-start location">
                                        <BsBriefcase />
                                        {" "}
                                        {data?.designation}
                                    </span>
                                    <span className="text-start location">
                                        <HiOutlineOfficeBuilding />
                                        {" "}
                                        {data?.department}
                                    </span>
                                    <span className="text-start location">
                                        <CiUser />
                                        {" Sanctioned Position(s): "}
                                        {data?.total_vacancy}
                                    </span>
                                </div>
                            </div>

                            {/* <div style={buttonPosition}>
                                    <NaukariMenu />
                            </div> */}

                            <div className="d-flex flex-row">
                                <div className="d-flex flex-column gap-2">
                                    {
                                        isJobExpired(data?.deadline) &&
                                        <span style={{ color: '#8c2515', borderRadius: '3px' }} className="bg_redlt text-center border-1 p-1">
                                            Expired
                                        </span>
                                    }
                                    <span className="datetime text-center">
                                        {moment(data?.add_date).format('DD/MM/YYYY')}
                                    </span>
                                    <a href={`/create-job?id=${data?._id}`} className="buttonEditorecheck">
                                        <CiEdit size={20} /> Edit
                                    </a>

                                    {
                                        data?.naukari_job_data?.added_on && (
                                            <span className="datetime">
                                                Published On {moment(data?.naukari_job_data?.added_on).format("DD/MM/YYYY")}
                                            </span>
                                        )
                                    }

                                    {
                                        !isJobExpired(data?.deadline) &&
                                        <span style={buttonPosition}>
                                            <NaukariMenu data={data} />
                                        </span>
                                    }

                                </div>
                                {/* <div className="ddbtn buttnner">
                                    <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic">
                                            <HiDotsVertical />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="py-2 job_dropdown min-widther mt-2">
                                            <Dropdown.Item href="#/action-1">
                                                <div className="d-flex flex-row">
                                                    <FiLink />
                                                    <span>Copy Link</span>
                                                </div>
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#/action-2">
                                                <div className="d-flex flex-row">
                                                    <FaRegClone />

                                                    <span>Clone</span>
                                                </div>
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">
                                                <div className="d-flex flex-row">
                                                    <BsArchive />
                                                    <span>Archieve</span>
                                                </div>
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#/action-4">
                                                <div className="d-flex flex-row">
                                                    <RiDeleteBin6Line />
                                                    <span>Delete</span>
                                                </div>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div> */}
                            </div>
                        </div>
                        {/* <div className="d-flex flex-row flex-wrap">
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0">20</h4>
                                <span>Total Candidates</span>
                            </div>
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0 color-purple">12</h4>
                                <span>Review</span>
                            </div>
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0 color-orange">6</h4>
                                <span>Interview</span>
                            </div>
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0 color-blue">3</h4>
                                <span>Offer</span>
                            </div>
                            <div className="d-flex flex-column justify-content-start gap-1 align-items-start jobnums linnner">
                                <h4 className="mb-0 color-green">1</h4>
                                <span>Hire</span>
                            </div>
                        </div> */}
                        <div className="d-flex flex-row flex-wrap">
                            <Link to={`/job-cards-details/${data._id}?type=total`}>
                                <div className="d-flex flex-column justify-content-start align-items-start jobnums linnner">
                                    <h4 className="mb-0">  {data?.form_candidates && data?.form_candidates.find((item) => item.level === 'Total')?.value}</h4>
                                    <span>Total </span>
                                </div>
                            </Link>
                            <Link to={`/job-cards-details/${data._id}?type=new`}>
                                <div className="d-flex flex-column justify-content-start align-items-start jobnums linnner">
                                    <h4 className="mb-0 color-green">  {data?.form_candidates && data?.form_candidates.find((item) => item.level === 'Applied')?.value}</h4>
                                    <span>Applied</span>
                                </div>
                            </Link>
                            <Link to={`/job-cards-details/${data._id}?type=Shortlisted`}>
                                <div className="d-flex flex-column justify-content-start  align-items-start jobnums linnner">
                                    <h4 className="mb-0 color-pink">  {data?.form_candidates && data?.form_candidates.find((item) => item.level === 'Shortlisted')?.value}
                                    </h4>
                                    <span>Shortlisted</span>
                                </div>
                            </Link>
                            <Link to={`/job-cards-details/${data._id}?type=Interview`}>
                                <div className="d-flex flex-column justify-content-start  align-items-start jobnums linnner">
                                    <h4 className="mb-0 color-purple">  {data?.form_candidates && data?.form_candidates.find((item) => item.level === 'Interview')?.value}
                                    </h4>
                                    <span>Interview</span>
                                </div>
                            </Link>
                            <Link to={`/job-cards-details/${data._id}?type=Offered`}>
                                <div className="d-flex flex-column justify-content-start  align-items-start jobnums linnner">
                                    <h4 className="mb-0 color-blue"> {data?.form_candidates && data?.form_candidates.find((item) => item.level === 'Offer')?.value}</h4>
                                    <span>Offered</span>
                                </div>
                            </Link >
                            <Link to={`/job-cards-details/${data._id}?type=Hired`}>
                                <div className="d-flex flex-column justify-content-start  align-items-start jobnums linnner">
                                    <h4 className="mb-0 color-green">  {data?.form_candidates && data?.form_candidates.find((item) => item.level === 'Hired')?.value} </h4>
                                    <span>Hired</span>
                                </div>
                            </Link>
                            <Link to={`/job-cards-details/${data._id}?type=Rejected`}>
                                <div className="d-flex flex-column justify-content-start align-items-start jobnums linnner">
                                    <h4 className="mb-0 color-orange"> {data?.form_candidates && data?.form_candidates.find((item) => item.level === 'Rejected')?.value}</h4>
                                    <span>Rejected</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JobCards;
