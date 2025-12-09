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
import { Tooltip } from "@mui/material";
import GoBackButton from "../goBack/GoBackButton";
import { IoIosArrowBack } from "react-icons/io";



const MprFormValidation = () => {
    // get the mpr form Validation
    const [id, setId] = useState("");
    const [utm, setUtm] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [UrlDetails, setUrl] = useState(null);
    const [text, setText] = useState('')
    const params = useParams();
    const [open, setOpen] = useState(false);
    const navigation = useNavigate();
    const [isFormVisibale, setIsFormVissible] = useState(true);
    const [showExpiration, setShowExpiration] = useState(false);
    const [searchParams] = useSearchParams();



    const handleCloseModal = () => {
        setOpen(true);
    }

    const [value, setValue] = useState("Approved");

    const handleChange = (e) => {
        setValue(e.target.value);
    };

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
                        "_id": UrlDetails?.[0],
                    }
                    setLoading(true)
                    let response = await axios.post(`${config.API_URL}getRequisitionDataByIdViaMail`, Payloads, apiHeaderToken(UrlDetails?.[3]));
                    if (response.status === 200) {
                        setData(response.data?.data);
                        if (response?.data?.data?.activity_data?.find(item => item.designation === (UrlDetails && UrlDetails?.[2]) && item.status !== "Pending")) {
                            setIsFormVissible(false);
                        }
                    }
                    setLoading(false)
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setLoading(false)
                }
            })()
        }
    }, [UrlDetails])

    useEffect(() => {
        if (UrlDetails) {
            let Token = UrlDetails?.[3];
            CheckLogin(Token)
        }
    }, [UrlDetails])

    console.log( UrlDetails , 'this is approval note doc id' )

    //  Handle Submit the FeedBack ->>>>>>>>>>>
    const handleSubmitFeedBack = (e) => {
        e.preventDefault();
        if (!value) {
            return toast.warn("Please Select the Status");
        }
        if (!text) {
            return toast.warn("Please Add Comment")
        }

        let Payloads = {
            "_id": UrlDetails[0],
            "designation": UrlDetails[2],
            "status": value,
            "comment": text,
            "hod_name": UrlDetails[1],
            "employee_doc_id": UrlDetails[5]
        }

        console.log( Payloads , 'this is payloads' )

        axios.post(`${config.API_URL}approveRejectRequisitionForm`, Payloads , apiHeaderToken(UrlDetails?.[3]))
            .then((response) => {
                if (response.status === 200) {
                    toast.success(response.data?.message)
                    setText("")
                    setValue("")
                    setIsFormVissible(false)

                } else {
                    toast.error(response.data?.message)
                    setIsFormVissible(true)
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message)
                setIsFormVissible(true)
            })
    }

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

    // const HandleToCloseTab = () => {
    //     window.close();
    // };


    return (
        <>
            <div className="container">
                <div className="mprdwrapper">
                    <div className="mprdatas statuscard">
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
                        <div className="mprlogo">
                            <img src={logo} alt="logo" />
                        </div>
                        {
                            loading ?
                                <div className="d-flex align-content-center justify-content-center">
                                    <div className="spinner-border text-primary" role="status" />
                                </div> :
                                !isFormVisibale ?
                                    <div className="d-flex align-content-center justify-content-center">
                                        <img src={'/ThankYou.png'} alt="logo" />
                                    </div>
                                    :
                                    !data && data?.length < 0 ?
                                        <div className="d-flex align-content-center justify-content-center">
                                            <p>No Data Found</p>
                                        </div> :
                                        <div className="mprtext">
                                            <h4>Manpower Requisition Data </h4>
                                            <div className="manpwr_data_row row">
                                                <div className="col-sm-4 manpwr_data_colm">
                                                    <h6>MPR Number</h6>
                                                    <p>{data?.title}</p>
                                                </div>
                                                <div className="col-sm-4 manpwr_data_colm">
                                                    <h6>Vacancy Under Project</h6>
                                                    <p>{data?.project_name}</p>
                                                </div>
                                                <div className="col-sm-4 manpwr_data_colm">
                                                    <h6>Designation</h6>
                                                    <p>{data?.designation_name}</p>
                                                </div>
                                                <div className="col-sm-4 manpwr_data_colm">
                                                    <h6>Department</h6>
                                                    <p>{data?.department_name}</p>
                                                </div>
                                                <div className="col-sm-4 manpwr_data_colm">
                                                    <h6>Type of Opening</h6>
                                                    <p>{data?.type_of_opening}</p>
                                                </div>
                                                <div className="col-sm-4 manpwr_data_colm">
                                                    <h6>CTC Proposed per Annum</h6>
                                                    <p>{data?.ctc_per_annum}</p>
                                                </div>
                                                <div className="col-sm-4 manpwr_data_colm">
                                                    <h6>CTC Proposed (Monthly)</h6>
                                                    <p>{data?.ctc_per_month}</p>
                                                </div>
                                                <div className="col-sm-4 manpwr_data_colm">
                                                    <h6>Grade</h6>
                                                    <p>{data?.grade}</p>
                                                </div>
                                                <div className="col-sm-4 manpwr_data_colm">
                                                    <h6>Minimum Experience</h6>
                                                    <p>{data?.minimum_experience} Year(s)</p>
                                                </div>
                                                <div className="col-sm-4 manpwr_data_colm">
                                                    <h6>Maximum Experience</h6>
                                                    <p>{data?.maximum_experience} Year(s)</p>
                                                </div>
                                                <div className="col-sm-4 manpwr_data_colm">
                                                    <h6>No. of Vacancies</h6>
                                                    <p>{data?.no_of_vacancy}</p>
                                                </div>
                                                <div className="col-sm-4 manpwr_data_colm">
                                                    <h6>Place of Posting</h6>
                                                    {data?.place_of_posting?.length > 4 ? (
                                                        <Tooltip
                                                            title={data.place_of_posting
                                                                .slice(4)
                                                                .map(item => item.location_name)
                                                                .join(', ')}
                                                            arrow
                                                        >
                                                            <p>
                                                                {data.place_of_posting
                                                                    .slice(0, 4)
                                                                    .map(item => item.location_name)
                                                                    .join(', ')}
                                                                , <span style={{ color: 'blue', cursor: 'pointer' }}>+{data.place_of_posting.length - 4} more</span>
                                                            </p>
                                                        </Tooltip>
                                                    ) : (
                                                        <p>
                                                            {data?.place_of_posting?.map(item => item.location_name).join(', ')}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="col-sm-4 manpwr_data_colm">
                                                    <h6>Reporting Structure</h6>
                                                    <p>{data?.reporting_structure}</p>
                                                </div>
                                                <div className="col-sm-4 manpwr_data_colm">
                                                    <h6>Time frame to fill the vacancy</h6>
                                                    <p>{data?.vacancy_frame} Days</p>
                                                </div>
                                                {
                                                    data?.requisition_form ?
                                                        <div className="col-sm-4 manpwr_data_colm">
                                                            <h6>Manpower Requisition Document</h6>
                                                            <Button className="text-center mb-2 buttonSizeOf " onClick={handleCloseModal}>View Document</Button>
                                                        </div> :
                                                        <div className="col-sm-4 mb-2 manpwr_data_colm">
                                                            <h6>Manpower Requisition Document</h6>
                                                            <span >Document Pending</span>
                                                        </div>
                                                }

                                                <div className="col-sm-4 manpwr_data_colm">
                                                    <h6>Duration</h6>
                                                    <p>{data?.project_duration}</p>
                                                </div>

                                                <div className="col-sm-12 manpwr_data_colm">
                                                    <h6>Job Description</h6>
                                                    <p dangerouslySetInnerHTML={{ __html: data?.job_description }} />
                                                </div>
                                                <div className="col-sm-12 manpwr_data_colm">
                                                    <h6>Qualification</h6>
                                                    <p dangerouslySetInnerHTML={{ __html: data?.qualification }} />
                                                </div>
                                                <div className="col-sm-12 manpwr_data_colm">
                                                    <h6>Skills</h6>
                                                    <p dangerouslySetInnerHTML={{ __html: data?.skills }} />
                                                </div>
                                            </div>
                                            <div className="statusform">
                                                <div className="fieldwrp">
                                                    <Form.Label>
                                                        Status
                                                    </Form.Label>
                                                    <FormControl>
                                                        <RadioGroup
                                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                                            name="controlled-radio-buttons-group"
                                                            value={value}
                                                            onChange={handleChange}
                                                            className="d-flex justify-content-start gap-4 flex-row"
                                                        >
                                                            <FormControlLabel
                                                                value="Approved"
                                                                control={<Radio />}
                                                                label="Approve"
                                                            />
                                                            <FormControlLabel
                                                                value="Reject"
                                                                control={<Radio />}
                                                                label="Reject"
                                                            />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </div>
                                                <div className="fieldwrp">
                                                    <Form.Label>
                                                        Comment
                                                    </Form.Label>
                                                    <FormControl className="w-100">
                                                        <textarea className="form-control" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write your comment" rows={3}></textarea>
                                                    </FormControl>
                                                </div>
                                                <button type="button" onClick={handleSubmitFeedBack} class="mt-4 formbtn btn btn-primary">Submit</button>
                                            </div>
                                        </div>
                        }
                    </div>
                </div>
            </div>

            {/* Models */}

            <Modal show={open} onHide={() => setOpen(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Document Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ height: '100%', overflow: 'auto' }}>
                        {(() => {
                            const fileExtension = data?.requisition_form?.split('.').pop().toLowerCase();

                            if (fileExtension === 'pdf') {
                                return (
                                    // <embed
                                    //     src={config.IMAGE_PATH + data?.requisition_form}
                                    //     type="application/pdf"
                                    //     width="100%"
                                    //     height="100%"
                                    //     style={{ minHeight: '400px', borderRadius: '5px' }}
                                    // />

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
            </Modal>


            <Modal show={showExpiration} centered>
                <Modal.Header>
                    <Modal.Title>Session Expired</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    We noticed your session has expired. Please click to create a new link and continue seamlessly.
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button variant="primary" onClick={HandleToCloseTab}> Close </Button> */}
                </Modal.Footer>
            </Modal>
        </>
    )

}


export default MprFormValidation