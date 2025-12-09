import React, { useState } from "react";
import { useEffect } from "react";
import config from "../../config/config";
import logo from '../../images/logo.png'
// import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import { apiHeaderToken } from "../../config/api_header";
import { toast } from "react-toastify";
import { useParams, useSearchParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import moment from "moment";
import { Button as ButtonBase } from "@mui/material";
import { FaRegEye } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import { CamelCases, changeJobTypeLabel, CustomChangesJobType, formatDateToWeekOf, validateTheJobPortal } from "../../utils/common";
import { RateReview } from "@mui/icons-material";
import ReviewFeedBackModal from "./FeedBackModal";
import GoBackButton from "../goBack/GoBackButton";
import { IoIosArrowBack } from "react-icons/io";



const ApproveOfferValidation = () => {
    // get the mpr form Validation
    const [id, setId] = useState("");
    const [utm, setUtm] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [UrlDetails, setUrl] = useState(null);
    const [text, setText] = useState('')
    const params = useParams();
    const [open, setOpen] = useState(false);
    const [openFeedBack, setOpenFeedBack] = useState(false);
    const [feedbackData, setFeedbackData] = useState(null);
    const [IsLoading, setIsLoading] = useState(false);
    const navigation = useNavigate();
    const [isFormVisibale, setIsFormVissible] = useState(true);
    const [showExpiration, setShowExpiration] = useState(false);
    const [approvalDetails, setApprovalDetails] = useState(null)


    const [searchParams] = useSearchParams()

    const handleCloseModal = () => {
        setOpen(true);
    }

    const [value, setValue] = useState("Approved");

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleOpenApproveModal = (item) => {
        setData(item)
        setOpen(true);
    }

    useEffect(() => {
        const url = new URL(`${config.API_URL}mprFrm/${params?.id}`);
        const urlFirstParts = url.pathname.split("/");
        const mprFrmIndex = urlFirstParts.indexOf("mprFrm");
        const mprDocDetails = urlFirstParts[mprFrmIndex + 1];
        try {
            const data = atob(mprDocDetails);
            if (data && typeof data !== 'undefined') {
                setUrl(data?.split('|'))
            }
        } catch (error) {
            console.error("Error decoding Base64 string:", error);
        }
    }, [params?.id]);

    useEffect(() => {
        if (UrlDetails) {
            (async () => {
                try {
                    let Payloads = {
                        "candidate_id": UrlDetails?.[1],
                        "applied_job_id": UrlDetails?.[2],
                        "employee_id": UrlDetails?.[3],
                        "status": UrlDetails?.[5]
                    }
                    setLoading(true)
                    let response = await axios.post(`${config.API_URL}approveJobOfferByEmployee`, Payloads, apiHeaderToken(UrlDetails[UrlDetails?.length - 1]));
                    if (response.status === 200) {
                        setLoading(false)
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setLoading(false)
                }
            })()
        }
    }, [UrlDetails])

    /**
     * @description Get Approval Details By Doc Id and Token
     * @param {*} id 
     * @param {*} token 
     */
    const getApprovalMemberListById = (id, token) => {
        const payload = {
            "approval_note_doc_id": id,
            "scope_fields": []
        }
        setLoading(true)
        axios.post(`${config.API_URL}getAppraisalNoteById`, payload, apiHeaderToken(token))
            .then((res) => {
                if (res.status === 200) {
                    setApprovalDetails(res.data?.data)
                    setLoading(false)
                } else {
                    console.log(res.data)
                    setLoading(false)
                }
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    /**
     * @description check the Token is Expiration -
     * @param {*} token 
     */

    const CheckLogin = async (token) => {
        try {
            let response = await axios.post(`${config.API_URL}verifyExistingToken`, {
                token: token,
            });
            if (response.status === 200) {
                setShowExpiration(false);
            } else {
                setShowExpiration(false);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setShowExpiration(true);
            }
        }
    };

    useEffect(() => {
        if (UrlDetails) {
            let [approval_note_doc_id, emp_doc_id, token] = UrlDetails;
            if (token) {
                CheckLogin(token)
            }
            if (approval_note_doc_id && token) {
                getApprovalMemberListById(approval_note_doc_id, token)
            }
        }
    }, [UrlDetails])


    const handleApprovalSumit = async (e) => {
        e.preventDefault();
        if (!text) {
            return toast.warn("Please Enter Remark")
        }
        if (!value) {
            return toast.warn("Please Select Status")
        }

        let paylods = {
            "approval_note_doc_id": UrlDetails[0],
            "employee_id": UrlDetails[1],
            "candidate_id": data?.cand_doc_id,
            "status": value,
            "remark": text
        }

        try {
            let response = await axios.post(`${config.API_URL}approveApprovalNoteByEmployee`, paylods, apiHeaderToken(UrlDetails[2]))
            if (response.status === 200) {
                toast.success(response.data?.message)
                getApprovalMemberListById(UrlDetails[0], UrlDetails[2])
                setOpen(false);
                setText('')
                setValue('Approval')
            } else {
                toast.error(response.data?.message)
            }
        } catch (error) {
            toast.error(error?.response.data?.message || error.message || 'Someting Went Wrong');
        }
    }

    // handle view Approval Ratting
    const handleViewRatting = (data) => {
        if (data?.cand_doc_id) {
            FetchCandidatesListById(data?.cand_doc_id)
            setOpenFeedBack(true);
        }
    }

    /**
     * @description Fetch the Candidate Records by Id
     */

    const FetchCandidatesListById = async (id) => {
        try {
            let Payloads = {
                _id: id,
                scope_fields: ["job_id", "applied_jobs"]
            }
            setIsLoading(true);
            let response = await axios.post(`${config.API_URL}getCandidateById`, Payloads, apiHeaderToken(UrlDetails[2]))
            if (response.status === 200) {
                setFeedbackData(response.data?.data)
                setIsLoading(false);
            } else {
                setFeedbackData(null)
                setIsLoading(false);
            }
        } catch (error) {
            setFeedbackData(null)
            setIsLoading(false);
        }
    }


    console.log( approvalDetails  , 'this is approval note' );

    return (
        <>
            <div className="container">
                {
                    searchParams.get('goback') === 'yes' && 
                  <>
                   <div className="go-back-container">
                    <button className="go-back-button" onClick={() => navigation(-1)}>
                      <IoIosArrowBack className="back-icon" />
                      Go Back
                    </button>
                   </div>
                    <div className="destopGoback">
                        <GoBackButton />
                    </div>
                  </>
              
                }
                {
                    loading ?
                        <div className="d-flex align-content-center justify-content-center">
                            <div className="spinner-border text-primary" role="status" />
                        </div> :
                        <div className="approvalNote">
                            {/* <img src={'/offer.png'} alt="logo" /> */}
                            <>
                                <table style={{ width: 800, maxWidth: 800, margin: "0 auto" }} center="">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <table
                                                    style={{
                                                        padding: 10,
                                                        width: "100%",
                                                        borderBottom: "1px solid #34209B"
                                                    }}
                                                >
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ textAlign: "left", padding: 10 }}>
                                                                <img src="https://hlfppt.org/wp-content/themes/hlfppt/images/logo.png" alt="logo" />
                                                            </td>
                                                            <td style={{ float: "right" }}>
                                                                <table style={{ padding: 0, width: "100%" }}>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{ textAlign: "center" }}>
                                                                                <table style={{ borderCollapse: "collapse" }}>
                                                                                    <tbody>
                                                                                        {/* <tr>
                                                                                            <td
                                                                                                style={{
                                                                                                    border: "1px solid #000",
                                                                                                    fontSize: 14,
                                                                                                    padding: 8,
                                                                                                    textAlign: "left",
                                                                                                    fontWeight: 500
                                                                                                }}
                                                                                            >
                                                                                                New Position {approvalDetails && ['replacement'].includes(approvalDetails?.mpr_offer_type) ? "☑" : ""}
                                                                                            </td>
                                                                                            <td
                                                                                                style={{
                                                                                                    border: "1px solid #000",
                                                                                                    fontSize: 14,
                                                                                                    padding: 8,
                                                                                                    textAlign: "left",
                                                                                                    fontWeight: 500
                                                                                                }}
                                                                                            >
                                                                                                {approvalDetails && CamelCases(approvalDetails?.mpr_offer_type)} {approvalDetails && ['new'].includes(approvalDetails?.mpr_offer_type) ? "☑" : ""}
                                                                                            </td>
                                                                                        </tr> */}
                                                                                        <tr>
                                                                                            <td
                                                                                                style={{
                                                                                                    border: "1px solid #000",
                                                                                                    fontSize: 14,
                                                                                                    padding: 8,
                                                                                                    textAlign: "left",
                                                                                                    fontWeight: 500
                                                                                                }}
                                                                                            >
                                                                                                Project
                                                                                            </td>
                                                                                            <td
                                                                                                style={{
                                                                                                    border: "1px solid #000",
                                                                                                    fontSize: 14,
                                                                                                    padding: 8,
                                                                                                    textAlign: "left",
                                                                                                    fontWeight: 500
                                                                                                }}
                                                                                            >
                                                                                                {approvalDetails && CamelCases(approvalDetails?.mpr_fund_type)}
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td
                                                                                                style={{
                                                                                                    border: "1px solid #000",
                                                                                                    fontSize: 14,
                                                                                                    padding: 8,
                                                                                                    textAlign: "left",
                                                                                                    fontWeight: 500
                                                                                                }}
                                                                                            >
                                                                                                Job Portal
                                                                                            </td>
                                                                                            <td
                                                                                                style={{
                                                                                                    border: "1px solid #000",
                                                                                                    fontSize: 14,
                                                                                                    padding: 8,
                                                                                                    textAlign: "left",
                                                                                                    fontWeight: 500
                                                                                                }}
                                                                                            >
                                                                                                ( {approvalDetails && CamelCases(validateTheJobPortal(approvalDetails?.applied_from)?.join(','))} )
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr style={{}}>
                                                            <td style={{ textAlign: 'end', width: '56%' }}>
                                                                <h4 style={{ marginTop: 0, width: "100%", marginBottom: 0 }}>
                                                                    Approval Note
                                                                </h4>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}>
                                                    <p style={{ margin:0, fontWeight: 600 }}>
                                                       Approval Note ID: {approvalDetails && approvalDetails?.approval_note_id}
                                                    </p>
                                                    <p style={{ margin:0, fontWeight: 600 }}>
                                                       Date: {approvalDetails && moment(approvalDetails?.approval_date ? approvalDetails?.approval_date :  approvalDetails?.add_date).format("MMMM DD, YYYY")}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                        {/* <tr>
                                            <td>
                                                <h3
                                                    style={{ width: "90%", textAlign: "center", margin: "0 auto 10px" }}
                                                >
                                                    Sub: {approvalDetails && approvalDetails?.job_designation} , {approvalDetails && approvalDetails?.project_name}.
                                                </h3>
                                            </td>
                                        </tr> */}
                                        <tr>
                                            <td>
                                                <p>
                                                    It has been proposed to appoint following candidate(s) is/are (selected by the undermentioned panel) as per the details given below:
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p
                                                    style={{
                                                        textDecoration: "underline",
                                                        color: "#000",
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    Interviewer Panel List
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                    <tbody>
                                                        <tr>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #000",
                                                                    fontSize: 14,
                                                                    padding: 8,
                                                                    textAlign: "left",
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                Sr. No.
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #000",
                                                                    fontSize: 14,
                                                                    padding: 8,
                                                                    textAlign: "left",
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                Name
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #000",
                                                                    fontSize: 14,
                                                                    padding: 8,
                                                                    textAlign: "left",
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                Designation
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #000",
                                                                    fontSize: 14,
                                                                    padding: 8,
                                                                    textAlign: "left",
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                Mode of interview
                                                            </td>
                                                        </tr>
                                                        {
                                                            approvalDetails && approvalDetails?.interviewer_list?.length > 0 ?
                                                                [...new Map(
                                                                    approvalDetails.interviewer_list.map(item => [item.emp_doc_id, item])
                                                                ).values()]
                                                                    ?.map((item, index) => {
                                                                        return (
                                                                            <tr key={item?.name}>
                                                                                <td
                                                                                    style={{
                                                                                        border: "1px solid #000",
                                                                                        fontSize: 14,
                                                                                        padding: 8,
                                                                                        textAlign: "left",
                                                                                        fontWeight: 500
                                                                                    }}
                                                                                >
                                                                                    {index + 1}
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        border: "1px solid #000",
                                                                                        fontSize: 14,
                                                                                        padding: 8,
                                                                                        textAlign: "left",
                                                                                        fontWeight: 500
                                                                                    }}
                                                                                >
                                                                                    {item?.name}
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        border: "1px solid #000",
                                                                                        fontSize: 14,
                                                                                        padding: 8,
                                                                                        textAlign: "left",
                                                                                        fontWeight: 500
                                                                                    }}
                                                                                >
                                                                                    {item?.designation}
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        border: "1px solid #000",
                                                                                        fontSize: 14,
                                                                                        padding: 8,
                                                                                        textAlign: "left",
                                                                                        fontWeight: 500
                                                                                    }}
                                                                                >
                                                                                    {approvalDetails?.interview_type === 'Online' ? 'Virtual' : "On-site"} Interview
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    }) :
                                                                <tr>
                                                                    <td colSpan={4} className="text-center">Record Not Found</td>
                                                                </tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <br></br>
                                        <tr>
                                            <td>
                                                <p>
                                                    The shortlisted candidate(s) was/ were also reviewed by CEO. Based on the evaluation of candidate(s) interviewed, the below mentioned candidate(s) is/ are proposed for selection.
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p
                                                    style={{
                                                        textDecoration: "underline",
                                                        color: "#000",
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    Candidates List for the “{approvalDetails && approvalDetails?.project_name}”
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                    <tbody>
                                                        <tr>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #000",
                                                                    fontSize: 14,
                                                                    padding: 8,
                                                                    textAlign: "left",
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                Sr. No.
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #000",
                                                                    fontSize: 14,
                                                                    padding: 8,
                                                                    textAlign: "left",
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                Name
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #000",
                                                                    fontSize: 14,
                                                                    padding: 8,
                                                                    textAlign: "left",
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                Designation
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #000",
                                                                    fontSize: 14,
                                                                    padding: 8,
                                                                    textAlign: "left",
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                Proposed Location
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #000",
                                                                    fontSize: 14,
                                                                    padding: 8,
                                                                    textAlign: "left",
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                Proposed CTC per {approvalDetails?.candidate_list[0]?.payment_type ? approvalDetails?.candidate_list[0]?.payment_type : "Annum"}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #000",
                                                                    fontSize: 14,
                                                                    padding: 8,
                                                                    textAlign: "left",
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                Proposed Date of joining{" "}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #000",
                                                                    fontSize: 14,
                                                                    padding: 8,
                                                                    textAlign: "left",
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                Contract Period (UPTO)
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #000",
                                                                    fontSize: 14,
                                                                    padding: 8,
                                                                    textAlign: "left",
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                Employment Nature
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #000",
                                                                    fontSize: 14,
                                                                    padding: 8,
                                                                    textAlign: "left",
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                Status{" "}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #000",
                                                                    fontSize: 14,
                                                                    padding: 8,
                                                                    textAlign: "left",
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                Action {" "}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #000",
                                                                    fontSize: 14,
                                                                    padding: 8,
                                                                    textAlign: "left",
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                Type of Position
                                                            </td>
                                                        </tr>
                                                        {
                                                            approvalDetails && approvalDetails?.candidate_list?.length > 0 ?
                                                                approvalDetails?.candidate_list?.map((item, index) => {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #000",
                                                                                    fontSize: 14,
                                                                                    padding: 8,
                                                                                    textAlign: "left",
                                                                                    fontWeight: 500
                                                                                }}
                                                                            >
                                                                                {index + 1}
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #000",
                                                                                    fontSize: 14,
                                                                                    padding: 8,
                                                                                    textAlign: "left",
                                                                                    fontWeight: 500
                                                                                }}
                                                                            >
                                                                                {item?.name}
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #000",
                                                                                    fontSize: 14,
                                                                                    padding: 8,
                                                                                    textAlign: "left",
                                                                                    fontWeight: 500
                                                                                }}
                                                                            >
                                                                                {approvalDetails && approvalDetails?.job_designation}
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #000",
                                                                                    fontSize: 14,
                                                                                    padding: 8,
                                                                                    textAlign: "left",
                                                                                    fontWeight: 500
                                                                                }}
                                                                            >
                                                                                {item?.proposed_location ? item?.proposed_location : 'Noida'}
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #000",
                                                                                    fontSize: 14,
                                                                                    padding: 8,
                                                                                    textAlign: "left",
                                                                                    fontWeight: 500
                                                                                }}
                                                                            >
                                                                                Rs.{item?.offer_ctc}/- per {item?.payment_type ? item?.payment_type : "Annum"}
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #000",
                                                                                    fontSize: 14,
                                                                                    padding: 8,
                                                                                    textAlign: "left",
                                                                                    fontWeight: 500
                                                                                }}
                                                                            >
                                                                                {formatDateToWeekOf(item?.onboarding_date)}{" "}
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #000",
                                                                                    fontSize: 14,
                                                                                    padding: 8,
                                                                                    textAlign: "left",
                                                                                    fontWeight: 500
                                                                                }}
                                                                            >
                                                                                {moment(item?.job_valid_date).format("DD-MM-YYYY")}{" "} or till the completion of project
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #000",
                                                                                    fontSize: 14,
                                                                                    padding: 8,
                                                                                    textAlign: "left",
                                                                                    fontWeight: 500
                                                                                }}
                                                                            >
                                                                                {CamelCases(CustomChangesJobType(item?.job_type))}
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #000",
                                                                                    fontSize: 14,
                                                                                    padding: 8,
                                                                                    textAlign: "left",
                                                                                    fontWeight: 500
                                                                                }}
                                                                            >
                                                                                {item?.interview_shortlist_status === 'Waiting' ? "Waitlisted" : item?.interview_shortlist_status}
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #000",
                                                                                    fontSize: 11,
                                                                                    padding: 7,
                                                                                    textAlign: "left",
                                                                                    fontWeight: 600,
                                                                                }}
                                                                            >
                                                                                <div className="d-flex flex-column gap-2">

                                                                                    <span style={{ marginBottom: '1rem' }}>
                                                                                        <ButtonBase
                                                                                            variant="contained"
                                                                                            color="info"
                                                                                            startIcon={<RateReview />}
                                                                                            onClick={() => handleViewRatting(item)}
                                                                                            style={{
                                                                                                fontSize: 11,
                                                                                                padding: 7,
                                                                                                textAlign: "left",
                                                                                                fontWeight: 600
                                                                                            }}
                                                                                        >
                                                                                            Rating
                                                                                        </ButtonBase>
                                                                                    </span>

                                                                                    {
                                                                                        item?.approval_history?.find((item) => item?.emp_doc_id === UrlDetails[1] && item?.approval_status === 'Approved')
                                                                                            ?
                                                                                            <span style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', color: 'green', fontSize: '16px' }}>
                                                                                                <span className="material-icons" style={{ marginRight: '8px' }}><FiCheckCircle color="#28a745" size={18} />
                                                                                                </span>
                                                                                                Approved
                                                                                            </span>
                                                                                            :
                                                                                            item?.approval_history?.find((item) => item?.emp_doc_id === UrlDetails[1] && item?.approval_status === 'Rejected')
                                                                                                ? <span style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', color: 'red', fontSize: '16px' }}>
                                                                                                    <span className="material-icons" style={{ marginRight: '8px' }}> <MdCancel color="red" size={18} />
                                                                                                    </span>
                                                                                                    Rejected
                                                                                                </span> :
                                                                                                <span>
                                                                                                    <ButtonBase
                                                                                                        variant="contained"
                                                                                                        color="success"
                                                                                                        startIcon={<CheckCircleIcon />}
                                                                                                        onClick={() => handleOpenApproveModal(item)}
                                                                                                        style={{
                                                                                                            fontSize: 11,
                                                                                                            padding: 7,
                                                                                                            textAlign: "left",
                                                                                                            fontWeight: 600
                                                                                                        }}
                                                                                                    >
                                                                                                        Approve
                                                                                                    </ButtonBase>
                                                                                                </span>
                                                                                    }

                                                                                </div>
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #000",
                                                                                    fontSize: 14,
                                                                                    padding: 8,
                                                                                    textAlign: "left",
                                                                                    fontWeight: 500
                                                                                }}
                                                                            >
                                                                                {approvalDetails?.mpr_offer_type === 'new' ? CamelCases(approvalDetails?.mpr_offer_type) + " " + "Position" : CamelCases(approvalDetails?.mpr_offer_type) || 'N/A'}
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                }) : <tr>
                                                                    <td colSpan={10} className="text-center">Record Not Found</td>
                                                                </tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p>Submitted for your kind approval, please</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <table style={{ padding: "20px 0", width: "100%" }}>
                                                    <tbody>
                                                        <tr>
                                                            <td><strong className="text-decoration-underline">Recommended By</strong></td>
                                                        </tr>
                                                        <tr>
                                                            {
                                                                approvalDetails &&
                                                                approvalDetails?.panel_members_list?.length > 0 &&
                                                                approvalDetails?.panel_members_list
                                                                    .filter((item) => item.designation !== 'CEO' && item.emp_doc_id !== 'NA')
                                                                    .sort((a, b) => a.priority - b.priority)
                                                                    .reduce((resultArray, item, index) => {
                                                                        const chunkIndex = Math.floor(index / 2);
                                                                        if (!resultArray[chunkIndex]) {
                                                                            resultArray[chunkIndex] = [];
                                                                        }
                                                                        resultArray[chunkIndex].push(item);
                                                                        return resultArray;
                                                                    }, [])
                                                                    .map((row, rowIndex) => (
                                                                        <tr key={rowIndex} style={{ marginBottom: '20px', marginLeft: '18%', display: 'flex', justifyContent: 'space-between' }}>
                                                                            {row.map((item, colIndex) => (
                                                                                <>
                                                                                    <td
                                                                                        key={colIndex}
                                                                                        style={{
                                                                                            padding: '10px 20px',
                                                                                            // textAlign: rowIndex === 0 ? 'left' : 'right',
                                                                                            // borderBottom: '1px solid #ddd',
                                                                                            textAlign: 'start'
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            item?.signature && !['', 'Pending'].includes(item?.approval_status) ? (
                                                                                                <span
                                                                                                    style={{
                                                                                                        fontSize: 15,
                                                                                                        display: 'block',
                                                                                                        textAlign: colIndex === 0 ? 'start' : 'end',
                                                                                                    }}
                                                                                                >
                                                                                                    <img src={config.IMAGE_PATH + item?.signature} alt="signature" height={50} width={100} />
                                                                                                </span>
                                                                                            ) : (
                                                                                                <span
                                                                                                    style={{
                                                                                                        fontSize: 15,
                                                                                                        display: 'block',
                                                                                                        height: 50, // Ensures the same space is used
                                                                                                        width: 60,
                                                                                                        textAlign: colIndex === 0 ? 'start' : 'end',
                                                                                                    }}
                                                                                                >
                                                                                                    {/* Blank space */}
                                                                                                </span>
                                                                                            )
                                                                                        }
                                                                                        <span
                                                                                            style={{
                                                                                                fontSize: 14,
                                                                                                color: '#000',
                                                                                                display: 'block',
                                                                                                fontWeight: 600,
                                                                                                textAlign: colIndex === 0 ? 'start' : 'end',
                                                                                            }}
                                                                                        >
                                                                                            {item?.designation === 'CEO' ? "Sharad Agarwal" : item?.name}
                                                                                        </span>
                                                                                        <span
                                                                                            style={{
                                                                                                fontSize: 15,
                                                                                                display: 'inline-block',
                                                                                                // marginRight: 40,
                                                                                                textAlign: colIndex === 0 ? 'start' : 'end',
                                                                                            }}
                                                                                        >
                                                                                            {item?.designation === 'CEO' ? "Chief Executive Officer" : item?.designation}
                                                                                        </span>
                                                                                        {/* <span
                                                                                        style={{
                                                                                            fontSize: 15,
                                                                                            display: 'block',
                                                                                            // marginRight: 40,
                                                                                            textAlign: colIndex === 0 ? 'start' : 'end',
                                                                                        }}
                                                                                    >
                                                                                        {item?.approval_status}
                                                                                    </span> */}
                                                                                        {/* {

                                                                                            item?.approved_date
                                                                                            &&
                                                                                            <span
                                                                                                style={{
                                                                                                    fontSize: 15,
                                                                                                    display: 'block',
                                                                                                    // marginRight: 40,
                                                                                                    textAlign: colIndex === 0 ? 'start' : 'end',
                                                                                                }}
                                                                                            >
                                                                                                {moment(item?.approved_date).format("DD/MM/YYYY")}
                                                                                            </span>
                                                                                        } */}
                                                                                    </td>
                                                                                </>
                                                                            ))}
                                                                        </tr>
                                                                    ))
                                                            }
                                                        </tr>
                                                        <tr>
                                                            <td><strong className="text-decoration-underline">Approved By</strong></td>
                                                        </tr>
                                                        <tr>
                                                            {
                                                                approvalDetails &&
                                                                approvalDetails?.panel_members_list?.length > 0 &&
                                                                approvalDetails?.panel_members_list
                                                                    .filter((item) => item.designation === 'CEO' && item.emp_doc_id === 'NA')
                                                                    .reduce((resultArray, item, index) => {
                                                                        const chunkIndex = Math.floor(index / 2);
                                                                        if (!resultArray[chunkIndex]) {
                                                                            resultArray[chunkIndex] = [];
                                                                        }
                                                                        resultArray[chunkIndex].push(item);
                                                                        return resultArray;
                                                                    }, [])
                                                                    .map((row, rowIndex) => (
                                                                        <tr key={rowIndex} style={{ marginBottom: '20px', marginLeft: '18%', display: 'flex', justifyContent: 'space-between' }}>
                                                                            {row.map((item, colIndex) => (
                                                                                <>
                                                                                    <td
                                                                                        key={colIndex}
                                                                                        style={{
                                                                                            padding: '10px 20px',
                                                                                            // textAlign: rowIndex === 0 ? 'left' : 'right',
                                                                                            // borderBottom: '1px solid #ddd',
                                                                                            textAlign: 'start'
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            item?.signature && !['', 'Pending'].includes(item?.approval_status) ? (
                                                                                                <span
                                                                                                    style={{
                                                                                                        fontSize: 15,
                                                                                                        display: 'block',
                                                                                                        textAlign: colIndex === 0 ? 'start' : 'end',
                                                                                                    }}
                                                                                                >
                                                                                                    <img src={config.IMAGE_PATH + item?.signature} alt="signature" height={50} width={100} />
                                                                                                </span>
                                                                                            ) : (
                                                                                                <span
                                                                                                    style={{
                                                                                                        fontSize: 15,
                                                                                                        display: 'block',
                                                                                                        height: 50, // Ensures the same space is used
                                                                                                        width: 60,
                                                                                                        textAlign: colIndex === 0 ? 'start' : 'end',
                                                                                                    }}
                                                                                                >
                                                                                                    {/* Blank space */}
                                                                                                </span>
                                                                                            )
                                                                                        }
                                                                                        <span
                                                                                            style={{
                                                                                                fontSize: 14,
                                                                                                color: '#000',
                                                                                                display: 'block',
                                                                                                fontWeight: 600,
                                                                                                textAlign: colIndex === 0 ? 'start' : 'end',
                                                                                            }}
                                                                                        >
                                                                                            {item?.name === '' ? "Respected Sir" : item?.name}
                                                                                        </span>
                                                                                        <span
                                                                                            style={{
                                                                                                fontSize: 15,
                                                                                                display: 'inline-block',
                                                                                                // marginRight: 40,
                                                                                                textAlign: colIndex === 0 ? 'start' : 'end',
                                                                                            }}
                                                                                        >
                                                                                            {item?.designation === 'CEO' ? "Chief Executive Officer" : item?.designation}
                                                                                        </span>
                                                                                        {/* <span
                                                                                        style={{
                                                                                            fontSize: 15,
                                                                                            display: 'block',
                                                                                            // marginRight: 40,
                                                                                            textAlign: colIndex === 0 ? 'start' : 'end',
                                                                                        }}
                                                                                    >
                                                                                        {item?.approval_status}
                                                                                    </span> */}
                                                                                    </td>
                                                                                </>
                                                                            ))}
                                                                        </tr>
                                                                    ))
                                                            }
                                                        </tr>

                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </>
                        </div>
                }
            </div>

            {/* <Modal show={open} onHide={() => setOpen(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Document Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ height: '100%', overflow: 'auto' }}>
                        {(() => {
                            const fileExtension = data?.requisition_form?.split('.').pop().toLowerCase();

                            if (fileExtension === 'pdf') {
                                return (
                                    <iframe
                                        src={config.IMAGE_PATH + data?.requisition_form}
                                        title="Document Preview"
                                        style={{ width: '100%', height: '400px', borderRadius: '5px' }}
                                    />
                                );
                            }

                            if (fileExtension === 'doc' || fileExtension === 'docx') {
                                return (
                                    <iframe
                                        src={`https://docs.google.com/viewer?url=${config.IMAGE_PATH + data?.requisition_form}&embedded=true`}
                                        title="Document Preview"
                                        style={{ width: '100%', height: '400px', borderRadius: '5px' }}
                                    />
                                );
                            }

                            return (
                                <p>
                                    Unsupported file format. Please{' '}
                                    <a href={config.IMAGE_PATH + data?.requisition_form} download>
                                        download the file
                                    </a>.
                                </p>
                            );
                        })()}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal> */}

            <Modal show={open} onHide={() => setOpen(false)} size="md" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Approval Status</Modal.Title>
                </Modal.Header>
                <Modal.Body className="h-auto">
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Remarks</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={6}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            style={{ height: '100px' }}
                        />
                    </Form.Group>
                    <FormControl>
                        <Form.Label>Status</Form.Label>
                        <RadioGroup
                            row
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="Approved"
                            name="radio-buttons-group"
                            value={value}
                            onChange={handleChange}
                        >
                            <FormControlLabel
                                value="Approved"
                                control={<Radio />}
                                label="Approve"
                            />
                            <FormControlLabel
                                value="Rejected"
                                control={<Radio />}
                                label="Reject"
                            />
                        </RadioGroup>
                    </FormControl>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        CLOSE
                    </Button>
                    <ButtonBase
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={handleApprovalSumit}
                    >
                        Submit
                    </ButtonBase>
                </Modal.Footer>
            </Modal>

            <Modal show={showExpiration} centered>
                <Modal.Header>
                    <Modal.Title>Session Expired</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    We noticed your session has expired. Please click to create a new link and continue seamlessly.
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

            <ReviewFeedBackModal openFeedBack={openFeedBack} setOpenFeedBack={setOpenFeedBack} feedbackData={feedbackData} IsLoading={IsLoading} />
        </>
    )

}


export default ApproveOfferValidation