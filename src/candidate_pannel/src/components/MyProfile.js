
import React from "react";
import GoBackButton from "./Goback";
// import { CgProfile } from "react-icons/cg";
import candidate from "../images/profile.png"
import { FaLinkedin } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
// import config from "../config/Config";
const MyProfile = () => {
    const myProfile = JSON.parse(localStorage.getItem('employeeLogin'));
    // const candidatePhoto = photo && photo !== '' ? `${config.IMAGE_PATH}${photo}` : null;
    //   const candidatePhoto = photo && photo !== '' ? `${config.IMAGE_PATH}${photo}` : candidate;
    return (
        <>
            <div className="maincontent">
                <div className="container">
                    <GoBackButton />
                    <div className="">
                        <h3>My Profile</h3>
                    </div>
                    {myProfile ? (
                        <div className="profilepage_wrap">
                            <div className="centerprofile">
                                <div className="profile-photo">
                                    <img src={candidate} alt="profile"/>
                                </div>
                                <h4 className="name">{myProfile.name}</h4>
                                <div className="prfl_social">
                                    <ul className="social">
                                        <li><a href=" "><FaLinkedin /></a></li>
                                        <li><a href=" "><RiTwitterXFill /></a></li>
                                        <li><a href=" "><FaFacebook /></a></li>
                                        <li><a href=" "><FaInstagram /></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="employ_info">
                                <div className="emply_dtlbox">
                                    <h6>Employee ID</h6>
                                    <p>2021-10101000</p>
                                </div>
                                <div className="emply_dtlbox">
                                    <h6>Contact No.</h6>
                                    <p>{myProfile.mobile_no}</p>
                                </div>
                                <div className="emply_dtlbox">
                                    <h6>Email ID</h6>
                                    <p>{myProfile.email}</p>
                                </div>
                                <div className="emply_dtlbox">
                                    <h6>Designation</h6>
                                    <p>Lead - HR</p>
                                </div>
                                <div className="emply_dtlbox">
                                    <h6>Location</h6>
                                    <p>Noida, Uttar Pradesh</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>No profile data available.</p>
                    )}
                </div>
            </div>
        </>
    )
}
export default MyProfile;
