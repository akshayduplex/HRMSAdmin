import React, { useEffect, useState } from "react";
import { IoIosArrowRoundUp, IoIosSearch } from "react-icons/io";
import CountUp from "react-countup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import CeoNavbarComponent from "./CeoNavbar";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";
import moment from "moment";
import { TimeZone } from "../../utils/common";




const CeoDashboard = () => {

    const [totalRecords, setTotalRecords] = useState(null);
    const loginUsers = JSON.parse(localStorage.getItem('admin_role_user')) ?? {};

    useEffect(() => {

        (async () => {
            try {

                let response = await axios.get(`${config.API_URL}dashboardCeo`, apiHeaderToken(config.API_TOKEN))

                if (response.status === 200) {
                    setTotalRecords(response.data?.data);
                }

            } catch (error) {

                console.log(error)

            }
        })()
    }, [])

    const GrettingMessage = () => {
        const currentHour = moment().hour();
        let greeting;
        if (currentHour < 12) {
            greeting = 'Good Morning';
        } else if (currentHour < 18) {
            greeting = 'Good Afternoon';
        } else {
            greeting = 'Good Evening';
        }
        return greeting;
    }


    return (
        <>

            {/* <CeoNavbarComponent /> */}

            <div className="maincontent">
                <div className="container" data-aos="fade-in" data-aos-duration="3000">
                    {/* <GoBackButton /> */}
                    <div className='row'>
                        <div className='datewish my-4'>
                            <p className='makeResponsiveInData'>{moment().format('dddd, DD MMMM YYYY')} <span> Checkin: {TimeZone(loginUsers?.last_login)}</span></p>
                            <h3>{GrettingMessage()} , {loginUsers?.name} Sir</h3>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="hrhdng">
                            <h2 className="">MPR Approval(s)</h2>
                            <p className="mb-0 text-start">
                                MPR Approval Status And Data
                            </p>
                        </div>
                    </div>
                    {/*  Cart System  */}
                    <div className=" ceocrdwrap atscard_wrap d-flex flex-row gap-3">
                        <div className="card rounded-3 card-border w-100 ceocards">
                            <Link to="/ceo-mpr-list?type=listByCeo">
                                <div className="card-body">
                                    <h6 className="smallsubhdng">
                                        Total MPR
                                    </h6>
                                    <div className="d-flex justify-content-between mt-3 align-items-center position-relative">
                                        <div className="d-flex flex-column align-items-start">
                                            <h2><CountUp end={totalRecords && totalRecords?.total_mpr} duration={5} /></h2>
                                            <p className="crdtxt mb-0 d-flex flex-row gap-1">
                                                <span className="text-success">
                                                    <IoIosArrowRoundUp />
                                                    0
                                                </span>
                                                vs last month
                                            </p>
                                        </div>
                                        <div className="card-sec-color">
                                            <div className="card-bg"></div>
                                            <div className="card-main">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="currentcolor"
                                                >
                                                    <rect width="16" height="16" fill="#d2c9ff " />
                                                    <path d="M15 4H14V8H15V4Z" fill="#161616" />
                                                    <path d="M12.5 2.5H11.5V8H12.5V2.5Z" fill="#161616" />
                                                    <path d="M10 5H9V8H10V5Z" fill="#161616" />
                                                    <path
                                                        d="M8 15H7V12C6.99956 11.6023 6.84139 11.221 6.56018 10.9398C6.27897 10.6586 5.89769 10.5004 5.5 10.5H3.5C3.10231 10.5004 2.72103 10.6586 2.43982 10.9398C2.15861 11.221 2.00044 11.6023 2 12V15H1V12C1.00078 11.3372 1.26442 10.7018 1.7331 10.2331C2.20177 9.76442 2.8372 9.50078 3.5 9.5H5.5C6.1628 9.50078 6.79823 9.76442 7.2669 10.2331C7.73558 10.7018 7.99922 11.3372 8 12V15Z"
                                                        fill="#161616"
                                                    />
                                                    <path
                                                        d="M4.5 4.5C4.79667 4.5 5.08668 4.58797 5.33336 4.7528C5.58003 4.91762 5.77229 5.15189 5.88582 5.42597C5.99935 5.70006 6.02906 6.00166 5.97118 6.29264C5.9133 6.58361 5.77044 6.85088 5.56066 7.06066C5.35088 7.27044 5.08361 7.4133 4.79264 7.47118C4.50166 7.52906 4.20006 7.49935 3.92597 7.38582C3.65189 7.27229 3.41762 7.08003 3.2528 6.83336C3.08797 6.58668 3 6.29667 3 6C3 5.60218 3.15804 5.22064 3.43934 4.93934C3.72064 4.65804 4.10218 4.5 4.5 4.5ZM4.5 3.5C4.00555 3.5 3.5222 3.64662 3.11107 3.92133C2.69995 4.19603 2.37952 4.58648 2.1903 5.04329C2.00108 5.50011 1.95157 6.00277 2.04804 6.48773C2.1445 6.97268 2.3826 7.41814 2.73223 7.76777C3.08186 8.1174 3.52732 8.3555 4.01227 8.45196C4.49723 8.54843 4.99989 8.49892 5.45671 8.3097C5.91352 8.12048 6.30397 7.80005 6.57867 7.38893C6.85338 6.9778 7 6.49445 7 6C7 5.6717 6.93534 5.34661 6.8097 5.04329C6.68406 4.73998 6.49991 4.46438 6.26777 4.23223C6.03562 4.00009 5.76002 3.81594 5.45671 3.6903C5.15339 3.56466 4.8283 3.5 4.5 3.5Z"
                                                        fill="#161616"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="card rounded-3 card-border w-100 upcoming ceocards">
                            <Link to="/ceo-mpr-list?type=ApprovedByCeo">
                                <div className="card-body">
                                    <h6 className="smallsubhdng">
                                        Approved
                                    </h6>
                                    <div className="d-flex justify-content-between mt-3 align-items-center position-relative">
                                        <div className="d-flex flex-column align-items-start">
                                            <h2><CountUp end={totalRecords && totalRecords?.total_approved_mpr} duration={5} /></h2>
                                            <p className="crdtxt  mb-0 d-flex flex-row gap-1">
                                                <span className="crdtxt text-success">
                                                    <IoIosArrowRoundUp />
                                                    0
                                                </span>
                                                vs last month
                                            </p>
                                        </div>
                                        <div className="card-sec-color">
                                            <div className="card-bg"></div>
                                            <div className="card-main">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="currentcolor"
                                                >
                                                    <rect width="16" height="16" fill="#FCD1FF" />
                                                    <path
                                                        d="M6 2C6.49445 2 6.9778 2.14662 7.38893 2.42133C7.80005 2.69603 8.12048 3.08648 8.3097 3.54329C8.49892 4.00011 8.54843 4.50277 8.45196 4.98773C8.3555 5.47268 8.1174 5.91814 7.76777 6.26777C7.41814 6.6174 6.97268 6.8555 6.48773 6.95196C6.00277 7.04843 5.50011 6.99892 5.04329 6.8097C4.58648 6.62048 4.19603 6.30005 3.92133 5.88893C3.64662 5.4778 3.5 4.99445 3.5 4.5C3.5 3.83696 3.76339 3.20107 4.23223 2.73223C4.70107 2.26339 5.33696 2 6 2ZM6 1C5.30777 1 4.63108 1.20527 4.0555 1.58986C3.47993 1.97444 3.03133 2.52107 2.76642 3.16061C2.50151 3.80015 2.4322 4.50388 2.56725 5.18282C2.7023 5.86175 3.03564 6.48539 3.52513 6.97487C4.01461 7.46436 4.63825 7.7977 5.31718 7.93275C5.99612 8.0678 6.69985 7.99849 7.33939 7.73358C7.97893 7.46867 8.52556 7.02007 8.91014 6.4445C9.29473 5.86892 9.5 5.19223 9.5 4.5C9.5 3.57174 9.13125 2.6815 8.47487 2.02513C7.8185 1.36875 6.92826 1 6 1Z"
                                                        fill="#161616"
                                                    />
                                                    <path
                                                        d="M11 15H10V12.5C10 11.837 9.73661 11.2011 9.26777 10.7322C8.79893 10.2634 8.16304 10 7.5 10H4.5C3.83696 10 3.20107 10.2634 2.73223 10.7322C2.26339 11.2011 2 11.837 2 12.5V15H1V12.5C1 11.5717 1.36875 10.6815 2.02513 10.0251C2.6815 9.36875 3.57174 9 4.5 9H7.5C8.42826 9 9.3185 9.36875 9.97487 10.0251C10.6313 10.6815 11 11.5717 11 12.5V15Z"
                                                        fill="#161616"
                                                    />
                                                    <path d="M16 2H11V3H16V2Z" fill="#161616" />
                                                    <path d="M16 4.5H11V5.5H16V4.5Z" fill="#161616" />
                                                    <path d="M14.5 7H11V8H14.5V7Z" fill="#161616" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="card rounded-3 card-border w-100 newer ceocards">
                            <Link to="/ceo-mpr-list?type=PendingByCeo">
                                <div className="card-body">
                                    <h6 className="smallsubhdng">
                                        Approval Pending
                                    </h6>
                                    <div className="d-flex justify-content-between mt-3 align-items-center position-relative">
                                        <div className="d-flex flex-column align-items-start">
                                            <h2><CountUp end={totalRecords && totalRecords?.total_pending_mpr} duration={5} /></h2>
                                            <p className="crdtxt mb-0 d-flex flex-row gap-1">
                                                <span className="text-success">
                                                    <IoIosArrowRoundUp />
                                                    0
                                                </span>
                                                vs last month
                                            </p>
                                        </div>
                                        <div className="card-sec-color">
                                            <div className="card-bg"></div>
                                            <div className="card-main">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="currentcolor"
                                                >
                                                    <rect width="16" height="16" fill="#C1FFDE" />
                                                    <path
                                                        d="M13 10C14.1046 10 15 9.10457 15 8C15 6.89543 14.1046 6 13 6C11.8954 6 11 6.89543 11 8C11 9.10457 11.8954 10 13 10Z"
                                                        fill="#161616"
                                                    />
                                                    <path
                                                        d="M11 15H10V12.5C10 11.837 9.73661 11.2011 9.26777 10.7322C8.79893 10.2634 8.16304 10 7.5 10H4.5C3.83696 10 3.20107 10.2634 2.73223 10.7322C2.26339 11.2011 2 11.837 2 12.5V15H1V12.5C1 11.5717 1.36875 10.6815 2.02513 10.0251C2.6815 9.36875 3.57174 9 4.5 9H7.5C8.42826 9 9.3185 9.36875 9.97487 10.0251C10.6313 10.6815 11 11.5717 11 12.5V15Z"
                                                        fill="#161616"
                                                    />
                                                    <path
                                                        d="M6 2C6.49445 2 6.9778 2.14662 7.38893 2.42133C7.80005 2.69603 8.12048 3.08648 8.3097 3.54329C8.49892 4.00011 8.54843 4.50277 8.45196 4.98773C8.3555 5.47268 8.1174 5.91814 7.76777 6.26777C7.41814 6.6174 6.97268 6.8555 6.48773 6.95196C6.00277 7.04843 5.50011 6.99892 5.04329 6.8097C4.58648 6.62048 4.19603 6.30005 3.92133 5.88893C3.64662 5.4778 3.5 4.99445 3.5 4.5C3.5 3.83696 3.76339 3.20107 4.23223 2.73223C4.70107 2.26339 5.33696 2 6 2ZM6 1C5.30777 1 4.63108 1.20527 4.0555 1.58986C3.47993 1.97444 3.03133 2.52107 2.76642 3.16061C2.50151 3.80015 2.4322 4.50388 2.56725 5.18282C2.7023 5.86175 3.03564 6.48539 3.52513 6.97487C4.01461 7.46436 4.63825 7.7977 5.31718 7.93275C5.99612 8.0678 6.69985 7.99849 7.33939 7.73358C7.97893 7.46867 8.52556 7.02007 8.91014 6.4445C9.29473 5.86892 9.5 5.19223 9.5 4.5C9.5 3.57174 9.13125 2.6815 8.47487 2.02513C7.8185 1.36875 6.92826 1 6 1Z"
                                                        fill="#161616"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
                        <div className="hrhdng">
                            <h2 className="">Approval(s) Note</h2>
                            <p className="mb-0 text-start">
                                 Approval Note Status And Data
                            </p>
                        </div>
                    </div>

                    <div className="ceocrdwrap atscard_wrap d-flex flex-row gap-3">
                        <div className="card rounded-3 card-border w-100 ceocards">
                            <Link to="/ceo-approval-note?type=listByCeo">
                                <div className="card-body">
                                    <h6 className="smallsubhdng">
                                        Total Approval(s) Notes
                                    </h6>
                                    <div className="d-flex justify-content-between mt-3 align-items-center position-relative">
                                        <div className="d-flex flex-column align-items-start">
                                            <h2><CountUp end={totalRecords && totalRecords?.total_approval_notes} duration={5} /></h2>
                                            <p className="crdtxt mb-0 d-flex flex-row gap-1">
                                                <span className="text-success">
                                                    <IoIosArrowRoundUp />
                                                    0
                                                </span>
                                                vs last month
                                            </p>
                                        </div>
                                        <div className="card-sec-color">
                                            <div className="card-bg"></div>
                                            <div className="card-main">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="currentcolor"
                                                >
                                                    <rect width="16" height="16" fill="#d2c9ff " />
                                                    <path d="M15 4H14V8H15V4Z" fill="#161616" />
                                                    <path d="M12.5 2.5H11.5V8H12.5V2.5Z" fill="#161616" />
                                                    <path d="M10 5H9V8H10V5Z" fill="#161616" />
                                                    <path
                                                        d="M8 15H7V12C6.99956 11.6023 6.84139 11.221 6.56018 10.9398C6.27897 10.6586 5.89769 10.5004 5.5 10.5H3.5C3.10231 10.5004 2.72103 10.6586 2.43982 10.9398C2.15861 11.221 2.00044 11.6023 2 12V15H1V12C1.00078 11.3372 1.26442 10.7018 1.7331 10.2331C2.20177 9.76442 2.8372 9.50078 3.5 9.5H5.5C6.1628 9.50078 6.79823 9.76442 7.2669 10.2331C7.73558 10.7018 7.99922 11.3372 8 12V15Z"
                                                        fill="#161616"
                                                    />
                                                    <path
                                                        d="M4.5 4.5C4.79667 4.5 5.08668 4.58797 5.33336 4.7528C5.58003 4.91762 5.77229 5.15189 5.88582 5.42597C5.99935 5.70006 6.02906 6.00166 5.97118 6.29264C5.9133 6.58361 5.77044 6.85088 5.56066 7.06066C5.35088 7.27044 5.08361 7.4133 4.79264 7.47118C4.50166 7.52906 4.20006 7.49935 3.92597 7.38582C3.65189 7.27229 3.41762 7.08003 3.2528 6.83336C3.08797 6.58668 3 6.29667 3 6C3 5.60218 3.15804 5.22064 3.43934 4.93934C3.72064 4.65804 4.10218 4.5 4.5 4.5ZM4.5 3.5C4.00555 3.5 3.5222 3.64662 3.11107 3.92133C2.69995 4.19603 2.37952 4.58648 2.1903 5.04329C2.00108 5.50011 1.95157 6.00277 2.04804 6.48773C2.1445 6.97268 2.3826 7.41814 2.73223 7.76777C3.08186 8.1174 3.52732 8.3555 4.01227 8.45196C4.49723 8.54843 4.99989 8.49892 5.45671 8.3097C5.91352 8.12048 6.30397 7.80005 6.57867 7.38893C6.85338 6.9778 7 6.49445 7 6C7 5.6717 6.93534 5.34661 6.8097 5.04329C6.68406 4.73998 6.49991 4.46438 6.26777 4.23223C6.03562 4.00009 5.76002 3.81594 5.45671 3.6903C5.15339 3.56466 4.8283 3.5 4.5 3.5Z"
                                                        fill="#161616"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>


                        <div className="card rounded-3 card-border w-100 upcoming ceocards">
                            <Link to="/ceo-approval-note?type=ApprovedByCeo">
                              <div className="card-body">
                                    <h6 className="smallsubhdng">
                                      Approved Note
                                    </h6>
                                    <div className="d-flex justify-content-between mt-3 align-items-center position-relative">
                                        <div className="d-flex flex-column align-items-start">
                                        <h2><CountUp end={totalRecords && totalRecords?.total_approved_approval_notes} duration={5} /></h2>
                                        <p className="crdtxt  mb-0 d-flex flex-row gap-1">
                                                <span className="crdtxt text-success">
                                                    <IoIosArrowRoundUp />
                                                    0
                                                </span>
                                                vs last month
                                            </p>
                                        </div>
                                        <div className="card-sec-color">
                                            <div className="card-bg"></div>
                                            <div className="card-main">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="currentcolor"
                                                >
                                                    <rect width="16" height="16" fill="#FCD1FF" />
                                                    <path
                                                        d="M6 2C6.49445 2 6.9778 2.14662 7.38893 2.42133C7.80005 2.69603 8.12048 3.08648 8.3097 3.54329C8.49892 4.00011 8.54843 4.50277 8.45196 4.98773C8.3555 5.47268 8.1174 5.91814 7.76777 6.26777C7.41814 6.6174 6.97268 6.8555 6.48773 6.95196C6.00277 7.04843 5.50011 6.99892 5.04329 6.8097C4.58648 6.62048 4.19603 6.30005 3.92133 5.88893C3.64662 5.4778 3.5 4.99445 3.5 4.5C3.5 3.83696 3.76339 3.20107 4.23223 2.73223C4.70107 2.26339 5.33696 2 6 2ZM6 1C5.30777 1 4.63108 1.20527 4.0555 1.58986C3.47993 1.97444 3.03133 2.52107 2.76642 3.16061C2.50151 3.80015 2.4322 4.50388 2.56725 5.18282C2.7023 5.86175 3.03564 6.48539 3.52513 6.97487C4.01461 7.46436 4.63825 7.7977 5.31718 7.93275C5.99612 8.0678 6.69985 7.99849 7.33939 7.73358C7.97893 7.46867 8.52556 7.02007 8.91014 6.4445C9.29473 5.86892 9.5 5.19223 9.5 4.5C9.5 3.57174 9.13125 2.6815 8.47487 2.02513C7.8185 1.36875 6.92826 1 6 1Z"
                                                        fill="#161616"
                                                    />
                                                    <path
                                                        d="M11 15H10V12.5C10 11.837 9.73661 11.2011 9.26777 10.7322C8.79893 10.2634 8.16304 10 7.5 10H4.5C3.83696 10 3.20107 10.2634 2.73223 10.7322C2.26339 11.2011 2 11.837 2 12.5V15H1V12.5C1 11.5717 1.36875 10.6815 2.02513 10.0251C2.6815 9.36875 3.57174 9 4.5 9H7.5C8.42826 9 9.3185 9.36875 9.97487 10.0251C10.6313 10.6815 11 11.5717 11 12.5V15Z"
                                                        fill="#161616"
                                                    />
                                                    <path d="M16 2H11V3H16V2Z" fill="#161616" />
                                                    <path d="M16 4.5H11V5.5H16V4.5Z" fill="#161616" />
                                                    <path d="M14.5 7H11V8H14.5V7Z" fill="#161616" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* <div className="card rounded-3 card-border w-100 ">
                            <Link to="/ceo-approval-note?type=ApprovedByCeo">
                                <div className="card-body">
                                    <h6 className="smallsubhdng">
                                        Approved Note
                                    </h6>
                                    <div className="d-flex justify-content-between mt-3 align-items-center">
                                        <div className="d-flex flex-column align-items-start">
                                            <h2><CountUp end={totalRecords && totalRecords?.total_approved_approval_notes} duration={5} /></h2>
                                            <p className="crdtxt mb-0 d-flex flex-row gap-1">
                                                <span className="text-success">
                                                    <IoIosArrowRoundUp />
                                                    0
                                                </span>
                                                vs last month
                                            </p>
                                        </div>

                                        <div className="card-sec-color">
                                            <div className="card-bg"></div>
                                            <div className="card-main">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="currentcolor"
                                                >
                                                    <rect width="16" height="16" fill="#FCD1FF" />
                                                    <path
                                                        d="M6 2C6.49445 2 6.9778 2.14662 7.38893 2.42133C7.80005 2.69603 8.12048 3.08648 8.3097 3.54329C8.49892 4.00011 8.54843 4.50277 8.45196 4.98773C8.3555 5.47268 8.1174 5.91814 7.76777 6.26777C7.41814 6.6174 6.97268 6.8555 6.48773 6.95196C6.00277 7.04843 5.50011 6.99892 5.04329 6.8097C4.58648 6.62048 4.19603 6.30005 3.92133 5.88893C3.64662 5.4778 3.5 4.99445 3.5 4.5C3.5 3.83696 3.76339 3.20107 4.23223 2.73223C4.70107 2.26339 5.33696 2 6 2ZM6 1C5.30777 1 4.63108 1.20527 4.0555 1.58986C3.47993 1.97444 3.03133 2.52107 2.76642 3.16061C2.50151 3.80015 2.4322 4.50388 2.56725 5.18282C2.7023 5.86175 3.03564 6.48539 3.52513 6.97487C4.01461 7.46436 4.63825 7.7977 5.31718 7.93275C5.99612 8.0678 6.69985 7.99849 7.33939 7.73358C7.97893 7.46867 8.52556 7.02007 8.91014 6.4445C9.29473 5.86892 9.5 5.19223 9.5 4.5C9.5 3.57174 9.13125 2.6815 8.47487 2.02513C7.8185 1.36875 6.92826 1 6 1Z"
                                                        fill="#161616"
                                                    />
                                                    <path
                                                        d="M11 15H10V12.5C10 11.837 9.73661 11.2011 9.26777 10.7322C8.79893 10.2634 8.16304 10 7.5 10H4.5C3.83696 10 3.20107 10.2634 2.73223 10.7322C2.26339 11.2011 2 11.837 2 12.5V15H1V12.5C1 11.5717 1.36875 10.6815 2.02513 10.0251C2.6815 9.36875 3.57174 9 4.5 9H7.5C8.42826 9 9.3185 9.36875 9.97487 10.0251C10.6313 10.6815 11 11.5717 11 12.5V15Z"
                                                        fill="#161616"
                                                    />
                                                    <path d="M16 2H11V3H16V2Z" fill="#161616" />
                                                    <path d="M16 4.5H11V5.5H16V4.5Z" fill="#161616" />
                                                    <path d="M14.5 7H11V8H14.5V7Z" fill="#161616" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div> */}

                        <div className="card rounded-3 card-border w-100 newer ceocards">
                            <Link to="/ceo-approval-note?type=PendingByCeo">
                                <div className="card-body">
                                    <h6 className="smallsubhdng">
                                        Pending Notes
                                    </h6>
                                    <div className="d-flex justify-content-between mt-3 align-items-center position-relative">
                                        <div className="d-flex flex-column align-items-start">
                                            <h2><CountUp end={totalRecords && totalRecords?.total_pending_approval_notes} duration={5} /></h2>
                                            <p className="crdtxt mb-0 d-flex flex-row gap-1">
                                                <span className="text-success">
                                                    <IoIosArrowRoundUp />
                                                    0
                                                </span>
                                                vs last month
                                            </p>
                                        </div>
                                        <div className="card-sec-color">
                                            <div className="card-bg"></div>
                                            <div className="card-main">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="currentcolor"
                                                >
                                                    <rect width="16" height="16" fill="#C1FFDE" />
                                                    <path
                                                        d="M13 10C14.1046 10 15 9.10457 15 8C15 6.89543 14.1046 6 13 6C11.8954 6 11 6.89543 11 8C11 9.10457 11.8954 10 13 10Z"
                                                        fill="#161616"
                                                    />
                                                    <path
                                                        d="M11 15H10V12.5C10 11.837 9.73661 11.2011 9.26777 10.7322C8.79893 10.2634 8.16304 10 7.5 10H4.5C3.83696 10 3.20107 10.2634 2.73223 10.7322C2.26339 11.2011 2 11.837 2 12.5V15H1V12.5C1 11.5717 1.36875 10.6815 2.02513 10.0251C2.6815 9.36875 3.57174 9 4.5 9H7.5C8.42826 9 9.3185 9.36875 9.97487 10.0251C10.6313 10.6815 11 11.5717 11 12.5V15Z"
                                                        fill="#161616"
                                                    />
                                                    <path
                                                        d="M6 2C6.49445 2 6.9778 2.14662 7.38893 2.42133C7.80005 2.69603 8.12048 3.08648 8.3097 3.54329C8.49892 4.00011 8.54843 4.50277 8.45196 4.98773C8.3555 5.47268 8.1174 5.91814 7.76777 6.26777C7.41814 6.6174 6.97268 6.8555 6.48773 6.95196C6.00277 7.04843 5.50011 6.99892 5.04329 6.8097C4.58648 6.62048 4.19603 6.30005 3.92133 5.88893C3.64662 5.4778 3.5 4.99445 3.5 4.5C3.5 3.83696 3.76339 3.20107 4.23223 2.73223C4.70107 2.26339 5.33696 2 6 2ZM6 1C5.30777 1 4.63108 1.20527 4.0555 1.58986C3.47993 1.97444 3.03133 2.52107 2.76642 3.16061C2.50151 3.80015 2.4322 4.50388 2.56725 5.18282C2.7023 5.86175 3.03564 6.48539 3.52513 6.97487C4.01461 7.46436 4.63825 7.7977 5.31718 7.93275C5.99612 8.0678 6.69985 7.99849 7.33939 7.73358C7.97893 7.46867 8.52556 7.02007 8.91014 6.4445C9.29473 5.86892 9.5 5.19223 9.5 4.5C9.5 3.57174 9.13125 2.6815 8.47487 2.02513C7.8185 1.36875 6.92826 1 6 1Z"
                                                        fill="#161616"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>


                    <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
                        <div className="hrhdng">
                            <h2 className="">Interview(s)</h2>
                            <p className="mb-0 text-start">
                                Interview(s) Status And Data
                            </p>
                        </div>
                    </div>

                    <div className="ceocrdwrap atscard_wrap d-flex flex-row gap-3 mb-5">

                        <div className="card rounded-3 card-border w-100 ceocards">
                            <Link to="/ceo-candidate-listing?type=Completed">
                                <div className="card-body">
                                    <h6 className="smallsubhdng">
                                        Completed Interview
                                    </h6>
                                    <div className="d-flex justify-content-between mt-3 align-items-center position-relative">
                                        <div className="d-flex flex-column align-items-start">
                                            <h2><CountUp end={totalRecords && totalRecords?.total_completed_interview} duration={5} /></h2>
                                            <p className="crdtxt mb-0 d-flex flex-row gap-1">
                                                <span className="text-success">
                                                    <IoIosArrowRoundUp />
                                                    0
                                                </span>
                                                vs last month
                                            </p>
                                        </div>
                                        <div className="card-sec-color">
                                            <div className="card-bg"></div>
                                            <div className="card-main">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="currentcolor"
                                                >
                                                    <rect width="16" height="16" fill="#d2c9ff " />
                                                    <path d="M15 4H14V8H15V4Z" fill="#161616" />
                                                    <path d="M12.5 2.5H11.5V8H12.5V2.5Z" fill="#161616" />
                                                    <path d="M10 5H9V8H10V5Z" fill="#161616" />
                                                    <path
                                                        d="M8 15H7V12C6.99956 11.6023 6.84139 11.221 6.56018 10.9398C6.27897 10.6586 5.89769 10.5004 5.5 10.5H3.5C3.10231 10.5004 2.72103 10.6586 2.43982 10.9398C2.15861 11.221 2.00044 11.6023 2 12V15H1V12C1.00078 11.3372 1.26442 10.7018 1.7331 10.2331C2.20177 9.76442 2.8372 9.50078 3.5 9.5H5.5C6.1628 9.50078 6.79823 9.76442 7.2669 10.2331C7.73558 10.7018 7.99922 11.3372 8 12V15Z"
                                                        fill="#161616"
                                                    />
                                                    <path
                                                        d="M4.5 4.5C4.79667 4.5 5.08668 4.58797 5.33336 4.7528C5.58003 4.91762 5.77229 5.15189 5.88582 5.42597C5.99935 5.70006 6.02906 6.00166 5.97118 6.29264C5.9133 6.58361 5.77044 6.85088 5.56066 7.06066C5.35088 7.27044 5.08361 7.4133 4.79264 7.47118C4.50166 7.52906 4.20006 7.49935 3.92597 7.38582C3.65189 7.27229 3.41762 7.08003 3.2528 6.83336C3.08797 6.58668 3 6.29667 3 6C3 5.60218 3.15804 5.22064 3.43934 4.93934C3.72064 4.65804 4.10218 4.5 4.5 4.5ZM4.5 3.5C4.00555 3.5 3.5222 3.64662 3.11107 3.92133C2.69995 4.19603 2.37952 4.58648 2.1903 5.04329C2.00108 5.50011 1.95157 6.00277 2.04804 6.48773C2.1445 6.97268 2.3826 7.41814 2.73223 7.76777C3.08186 8.1174 3.52732 8.3555 4.01227 8.45196C4.49723 8.54843 4.99989 8.49892 5.45671 8.3097C5.91352 8.12048 6.30397 7.80005 6.57867 7.38893C6.85338 6.9778 7 6.49445 7 6C7 5.6717 6.93534 5.34661 6.8097 5.04329C6.68406 4.73998 6.49991 4.46438 6.26777 4.23223C6.03562 4.00009 5.76002 3.81594 5.45671 3.6903C5.15339 3.56466 4.8283 3.5 4.5 3.5Z"
                                                        fill="#161616"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>


                        <div className="card rounded-3 card-border w-100 upcoming ceocards">
                            <Link to="/ceo-candidate-listing?type=Upcoming">
                                <div className="card-body">
                                    <h6 className="smallsubhdng">
                                        Upcoming Interview
                                    </h6>
                                    <div className="d-flex justify-content-between mt-3 align-items-center position-relative">
                                        <div className="d-flex flex-column align-items-start">
                                            <h2><CountUp end={totalRecords && totalRecords?.total_upcoming_interview} duration={5} /></h2>
                                            <p className="crdtxt mb-0 d-flex flex-row gap-1">
                                                <span className="text-success">
                                                    <IoIosArrowRoundUp />
                                                    0
                                                </span>
                                                vs last month
                                            </p>
                                        </div>

                                        <div className="card-sec-color">
                                            <div className="card-bg"></div>
                                            <div className="card-main">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="currentcolor"
                                                >
                                                    <rect width="16" height="16" fill="#FCD1FF" />
                                                    <path
                                                        d="M6 2C6.49445 2 6.9778 2.14662 7.38893 2.42133C7.80005 2.69603 8.12048 3.08648 8.3097 3.54329C8.49892 4.00011 8.54843 4.50277 8.45196 4.98773C8.3555 5.47268 8.1174 5.91814 7.76777 6.26777C7.41814 6.6174 6.97268 6.8555 6.48773 6.95196C6.00277 7.04843 5.50011 6.99892 5.04329 6.8097C4.58648 6.62048 4.19603 6.30005 3.92133 5.88893C3.64662 5.4778 3.5 4.99445 3.5 4.5C3.5 3.83696 3.76339 3.20107 4.23223 2.73223C4.70107 2.26339 5.33696 2 6 2ZM6 1C5.30777 1 4.63108 1.20527 4.0555 1.58986C3.47993 1.97444 3.03133 2.52107 2.76642 3.16061C2.50151 3.80015 2.4322 4.50388 2.56725 5.18282C2.7023 5.86175 3.03564 6.48539 3.52513 6.97487C4.01461 7.46436 4.63825 7.7977 5.31718 7.93275C5.99612 8.0678 6.69985 7.99849 7.33939 7.73358C7.97893 7.46867 8.52556 7.02007 8.91014 6.4445C9.29473 5.86892 9.5 5.19223 9.5 4.5C9.5 3.57174 9.13125 2.6815 8.47487 2.02513C7.8185 1.36875 6.92826 1 6 1Z"
                                                        fill="#161616"
                                                    />
                                                    <path
                                                        d="M11 15H10V12.5C10 11.837 9.73661 11.2011 9.26777 10.7322C8.79893 10.2634 8.16304 10 7.5 10H4.5C3.83696 10 3.20107 10.2634 2.73223 10.7322C2.26339 11.2011 2 11.837 2 12.5V15H1V12.5C1 11.5717 1.36875 10.6815 2.02513 10.0251C2.6815 9.36875 3.57174 9 4.5 9H7.5C8.42826 9 9.3185 9.36875 9.97487 10.0251C10.6313 10.6815 11 11.5717 11 12.5V15Z"
                                                        fill="#161616"
                                                    />
                                                    <path d="M16 2H11V3H16V2Z" fill="#161616" />
                                                    <path d="M16 4.5H11V5.5H16V4.5Z" fill="#161616" />
                                                    <path d="M14.5 7H11V8H14.5V7Z" fill="#161616" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="card rounded-3 card-border w-100 newer ceocards">
                            <Link to="/ceo-candidate-listing?type=PendingFeedback ">
                                <div className="card-body">
                                    <h6 className="smallsubhdng">
                                        Pending feedbacks
                                    </h6>
                                    <div className="d-flex justify-content-between mt-3 align-items-center position-relative">
                                        <div className="d-flex flex-column align-items-start">
                                            <h2><CountUp end={totalRecords && totalRecords?.total_pending_interview_feedback} duration={5} /></h2>
                                            <p className="crdtxt  mb-0 d-flex flex-row gap-1">
                                                <span className="crdtxt text-success">
                                                    <IoIosArrowRoundUp />
                                                    0
                                                </span>
                                                vs last month
                                            </p>
                                        </div>
                                        <div className="card-sec-color">
                                            <div className="card-bg"></div>
                                            <div className="card-main">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="currentcolor"
                                                >
                                                    <rect width="16" height="16" fill="#C1FFDE" />
                                                    <path
                                                        d="M13 10C14.1046 10 15 9.10457 15 8C15 6.89543 14.1046 6 13 6C11.8954 6 11 6.89543 11 8C11 9.10457 11.8954 10 13 10Z"
                                                        fill="#161616"
                                                    />
                                                    <path
                                                        d="M11 15H10V12.5C10 11.837 9.73661 11.2011 9.26777 10.7322C8.79893 10.2634 8.16304 10 7.5 10H4.5C3.83696 10 3.20107 10.2634 2.73223 10.7322C2.26339 11.2011 2 11.837 2 12.5V15H1V12.5C1 11.5717 1.36875 10.6815 2.02513 10.0251C2.6815 9.36875 3.57174 9 4.5 9H7.5C8.42826 9 9.3185 9.36875 9.97487 10.0251C10.6313 10.6815 11 11.5717 11 12.5V15Z"
                                                        fill="#161616"
                                                    />
                                                    <path
                                                        d="M6 2C6.49445 2 6.9778 2.14662 7.38893 2.42133C7.80005 2.69603 8.12048 3.08648 8.3097 3.54329C8.49892 4.00011 8.54843 4.50277 8.45196 4.98773C8.3555 5.47268 8.1174 5.91814 7.76777 6.26777C7.41814 6.6174 6.97268 6.8555 6.48773 6.95196C6.00277 7.04843 5.50011 6.99892 5.04329 6.8097C4.58648 6.62048 4.19603 6.30005 3.92133 5.88893C3.64662 5.4778 3.5 4.99445 3.5 4.5C3.5 3.83696 3.76339 3.20107 4.23223 2.73223C4.70107 2.26339 5.33696 2 6 2ZM6 1C5.30777 1 4.63108 1.20527 4.0555 1.58986C3.47993 1.97444 3.03133 2.52107 2.76642 3.16061C2.50151 3.80015 2.4322 4.50388 2.56725 5.18282C2.7023 5.86175 3.03564 6.48539 3.52513 6.97487C4.01461 7.46436 4.63825 7.7977 5.31718 7.93275C5.99612 8.0678 6.69985 7.99849 7.33939 7.73358C7.97893 7.46867 8.52556 7.02007 8.91014 6.4445C9.29473 5.86892 9.5 5.19223 9.5 4.5C9.5 3.57174 9.13125 2.6815 8.47487 2.02513C7.8185 1.36875 6.92826 1 6 1Z"
                                                        fill="#161616"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>



                    </div>

                </div>
            </div>
        </>
    )
}


export default CeoDashboard