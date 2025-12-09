import React from "react";
import candidate from "../../images/candidate.png";
import { CiCalendar } from "react-icons/ci";
import { useSelector } from "react-redux";

const SideAttendanceProfile = ()=> {
    const { Employee } = useSelector((state) => state.leave)

    return (
        <>
            <div className="sitecard attendce_sideprofile">
                <div className="prfimg_brf">
                    <img src={candidate} className="imgsize" alt="" />
                    <h4 className="name mb-0">{Employee.status === 'succeeded' && Employee.data?.name}</h4>
                    <p>{Employee.status === 'succeeded' && Employee.data?.designation}</p>
                    <p>{Employee.status === 'succeeded' && Employee.data?.employee_code}</p>
                </div>
                <div className="attndc_brief">
                    <div className=" d-flex flex-row justify-content-center align-items-center totalattnd">
                        <CiCalendar size={20} />
                        <h5>{Employee.status === 'succeeded' && Employee.data?.attendance}</h5>
                        <span>Total days</span>
                    </div>
                    <div className="d-flex justify-content-between px-2 w-100 mb-4">
                        <div className="d-flex justify-content-start flex-column mini-det gap-1 align-items-start">
                            <div className="line-blue"></div>
                            <h5>{Employee.status === 'succeeded' && Employee.data?.attendance} Days</h5>
                            <span>Regular</span>
                        </div>
                        <div className="d-flex justify-content-start flex-column mini-det gap-1 align-items-start">
                            <div className="line-blue"></div>
                            <h5>0.00 hours</h5>
                            <span>Overtime</span>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between px-2 w-100">
                        <div className="d-flex justify-content-start flex-column mini-det gap-1 align-items-start">
                            <div className="line-blue"></div>
                            <h5>0.00 Day</h5>
                            <span>PTO</span>
                        </div>
                        <div className="d-flex justify-content-start flex-column mini-det gap-1 align-items-start">
                            <div className="line-blue"></div>
                            <h5>0.00 Day</h5>
                            <span>Holiday</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default SideAttendanceProfile;