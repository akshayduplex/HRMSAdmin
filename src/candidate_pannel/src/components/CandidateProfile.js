
import React, { useEffect, useState } from "react";
import GoBackButton from "./Goback";
import { DateFormate } from "../utils/common";
import { CgProfile } from "react-icons/cg";
import { FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import config from "../config/Config";
import { apiHeaderToken } from "../config/ApiHeaders";
import axios from "axios";

const CandidateProfile = () => {
    const [candidateData, setCandidateData] = useState(null);
    const { _id } = useParams();
    const fetchCandidateData = async () => {
        const payload = { _id, scope_fields: [] };
        try {
            const response = await axios.post(`${config.API_URL}getCandidateById`, payload, apiHeaderToken(config.API_TOKEN));
            setCandidateData(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCandidateData();
    }, []);

    if (!candidateData) {
        return <div>Loading...</div>;
    }

    const {
        name,
        photo,
        email,
        mobile_no,
        location,
        current_employer,
        current_ctc,
        expected_ctc,
        notice_period,
        last_working_day,
        applied_from,
        reference_employee,
        designation,
        total_experience,
        relevant_experience,
        education,
        resume_file,
        social_links
    } = candidateData;

    //const candidatePhoto = photo && photo !== '' ? `${config.IMAGE_PATH}${photo}` : candidate;
    const candidatePhoto = photo && photo !== '' ? `${config.IMAGE_PATH}${photo}` : null;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `${config.IMAGE_PATH}${resume_file}`;
        link.download = resume_file;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const icons = {
        facebook: <FaFacebook />,
        linkedin: <FaLinkedin />,
        twitter: <RiTwitterXFill />,
        instagram: <FaInstagram />
    };

    const parts = resume_file.split('_');
    const shortenedFileName = `${parts[0]}.pdf`;
    const url = `${config.IMAGE_PATH}${resume_file}`;


    return (
        <>
            <div className="maincontent">
                <div className="container">
                    <GoBackButton />
                    <div className="sitecard" data-aos="fade-in" data-aos-duration="3000">
                        <div className="cd_profilebox d-flex">
                            <div className="cd_prfleft">
                                {candidatePhoto ? (
                                    <img
                                        src={candidatePhoto}
                                        alt="Profile"
                                        style={{
                                            width: '120px',
                                            height: '120px',
                                            objectFit: 'cover',
                                            // borderRadius: '50%',
                                            // border: '2px solid #ddd' // optional subtle border
                                        }}
                                    />
                                ) : (
                                    <CgProfile size={50} />
                                )}
                                <h4 className="name">{name}</h4>
                            </div>
                            <div className="cd_prfright d-flex">
                                <div className="cnt_info">
                                    <h6>Contact Information</h6>
                                    <p>{mobile_no}</p>
                                    <p>{email}</p>
                                    <p>{location}</p>
                                    <ul className="social">
                                        {social_links.map(({ brand, link, _id }) => (
                                            <li key={_id}>
                                                <Link to={{ pathname: link }} target="_blank">
                                                    {icons[brand]}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="cnt_info prev_empinfo">
                                    <h6>Contact Information</h6>
                                    <p>{name}</p>
                                    <p>{designation} </p>
                                    <p><a href="tel:{mobile_no}">{mobile_no}</a></p>
                                    <p><a href="mailto:{email}">{email}</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="candidate_info" data-aos="fade-in" data-aos-duration="3000">
                        <h4>Candidate Info</h4>
                        <div className="row">
                            <div className="col-sm-9">
                                <div className="sitecard pr-0">
                                    <div className="infobox" >
                                        <h5>Personal Information</h5>
                                        <div className="infotext">
                                            <div className="infos">
                                                <h6>Current Employer</h6>
                                                <p>{current_employer}</p>
                                            </div>
                                            <div className="infos">
                                                <h6>Designation</h6>
                                                <p>{designation}</p>
                                            </div>
                                            <div className="infos">
                                                <h6>Experience in Total</h6>
                                                <p>{total_experience}</p>
                                            </div>
                                            <div className="infos">
                                                <h6>Relevant Experience</h6>
                                                <p>{relevant_experience}</p>
                                            </div>
                                            <div className="infos">
                                                <h6>Current CTC</h6>
                                                <p>{current_ctc} LPA</p>
                                            </div>
                                            <div className="infos">
                                                <h6>Expected CTC</h6>
                                                <p>{expected_ctc} LPA</p>
                                            </div>
                                            <div className="infos">
                                                <h6>Notice Period</h6>
                                                <p>{notice_period} Days</p>
                                            </div>
                                            <div className="infos">
                                                <h6>Last Working day </h6>
                                                <p>{DateFormate(last_working_day)}</p>
                                            </div>
                                            <div className="infos">
                                                <h6>Applied from</h6>
                                                <p>{applied_from}</p>
                                            </div>
                                            <div className="infos">
                                                <h6>Reference employee</h6>
                                                <p>{reference_employee}</p>
                                            </div>
                                        </div>
                                        <h5>Education</h5>
                                        <div className="infotext">
                                            {education.map((edu, index) => (
                                                <div className="infos" key={index}>
                                                    <h6>{edu.institute}</h6>
                                                    <p>{edu.degree}</p>
                                                    <p>{new Date(edu.add_date).getFullYear()} - {new Date(edu.to_date).getFullYear()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <h5 className="rsmhdng">Submitted Resume</h5>
                                <div className="sitecard cvbox">
                                    <div className="pdfname">
                                        <span className="iconbg"><IoDocumentTextOutline /></span>
                                        <p><a href={url} target="_blank" rel="noopener noreferrer">{shortenedFileName}</a></p>
                                        <span>200 KB</span>
                                    </div>
                                    <button onClick={handleDownload} ><LuDownload /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CandidateProfile;



