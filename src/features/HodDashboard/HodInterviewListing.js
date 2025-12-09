import React, { useEffect, useState } from 'react';
import GoBackButton from '../goBack/GoBackButton';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import { Button, Card, Col, Row, Modal, Form } from 'react-bootstrap';
import { InfinitySpin } from 'react-loader-spinner';
import SearchInput from '../CeoDashboard/SearchBox';
import FeedbackModels from '../Candidates/profile/FeedBackModles';
import NoRecordsFound from './RecordsNotfound';
import moment from 'moment';
import { toast } from 'react-toastify';
// import { ButtonBase } from '@mui/material';

const DeBouncingForSearch = (search) => {

    const [DebounceKey, setDeBounceKey] = useState('');

    useEffect(() => {

        let timer = setTimeout(() => {
            setDeBounceKey(search);

        }, 500);

        return () => {
            clearTimeout(timer);
        }

    }, [search])

    return DebounceKey
}

const ListOfInterviewedCandidateOfHod = () => {

    const [candidate, setCandidate] = useState(null)
    const [searchParams] = useSearchParams()
    const [loader, setLoader] = useState(false)
    const [paginations, setPaginations] = useState(12);
    const [hasMoreStatus, setHasMoreStatus] = useState(false);
    const [search, setSearch] = useState('');
    const searchParamswithData = DeBouncingForSearch(search)
    const userDetails = JSON.parse(localStorage.getItem('admin_role_user')) || {}
    const [initialLoading, setInitLoding] = useState(true);
    const [show, setModalShow] = useState(false);
    const [selectedData, setSelectedData] = useState(null)
    const [interviewDetails, setSelectedInterviewDetails] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedRejectData, setSelectedRejectData] = useState(null);

    const FetchCandidateRecords = async () => {
        try {
            const type = searchParams.get('type')
            const payloads = {
                "employee_doc_id": userDetails?.employee_doc_id,
                "keyword": searchParamswithData,
                "page_no": "1",
                "per_page_record": paginations,
                "scope_fields": [],
                "filter_type": type,
                "job_id": ""
            }

            setLoader(true)

            const response = await axios.post(`${config.API_URL}getApplyJobListHod`, payloads, apiHeaderToken(config.API_TOKEN))

            if (response.status === 200) {
                setCandidate(response.data.data)
                setInitLoding(false)
            }

        } catch (error) {

            console.log(error)

        }
        finally {
            setLoader(false)
        }
    }

    useEffect(() => {

        if (searchParams.get('type')) {

            FetchCandidateRecords()

        }
    }, [searchParams, paginations, searchParamswithData])

    const hasMore = () => {
        let increasePageSize = paginations + 9
        setPaginations(increasePageSize)
    }


    console.log(candidate, 'this is candidate interview date');

    const handleAccept = async (data , status) => {
        // setLoader(true);
        let appliedJob = data?.applied_jobs?.find((item) => item?.job_id === data?.job_id)
        const payload = {
            candidate_id:data?._id,
            applied_job_id:appliedJob?._id,
            interviewer_id: appliedJob?.interviewer?.find((item) => item?.employee_id === userDetails?.employee_doc_id )?._id ,
            status: status, // "Accept",
            comment: ""
        };

        try {
            let response = await axios.post(`${config.API_URL}acceptRejectInterview`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            FetchCandidateRecords()
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message || error?.message || "Something went wrong");
        }
    };

    const handleRejectClick = (data) => {
        setSelectedRejectData(data);
        setShowRejectModal(true);
        setRejectionReason('');
    };

    const handleRejectConfirm = async () => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
        }

        const payload = {
            candidate_id: selectedRejectData?._id,
            applied_job_id: selectedRejectData?.applied_jobs?.find((item) => item?.job_id === selectedRejectData?.job_id)?._id,
            interviewer_id: selectedRejectData?.applied_jobs?.find((item) => item?.job_id === selectedRejectData?.job_id)?.interviewer?.find((item) => item?.employee_id === userDetails?.employee_doc_id )?._id,
            status: "Reject",
            comment: rejectionReason
        };

        try {
            let response = await axios.post(`${config.API_URL}acceptRejectInterview`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            FetchCandidateRecords();
            setShowRejectModal(false);
            setSelectedRejectData(null);
            setRejectionReason('');
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message || error?.message || "Something went wrong");
        }
    };

    const handleRejectCancel = () => {
        setShowRejectModal(false);
        setSelectedRejectData(null);
        setRejectionReason('');
    };

    useEffect(() => {
        if (candidate?.length) {

            let total = candidate?.length

            if (paginations <= total) {
                setHasMoreStatus(true)
            } else {
                setHasMoreStatus(false)
            }
        }
    }, [candidate?.length])

    const handleShowModal = (data) => {
        setSelectedData(data)
        setModalShow(true)
        let interviewDetails = data?.applied_jobs?.find((item) => item?.job_id === data?.job_id)?.interviewer?.find((item) => item?.employee_id === userDetails?.employee_doc_id)
        setSelectedInterviewDetails(interviewDetails)
    }

    const handleModalClose = () => {
        setModalShow(false)
        setSelectedData(null)
        setSelectedInterviewDetails(null)
    }


    return (
        <>
            {/* <CeoNavbarComponent /> */}

            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className='dflexbtwn'>
                        <div className='pagename'>
                            <h3>List of Interview(s) Candidates</h3>
                            <p> Interview(s) Candidates {searchParams.get('type')} Feedback Lisitng  </p>
                        </div>

                        <div className='pb-3 cardsearch'>
                            <SearchInput
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onClear={() => setSearch('')}
                            />
                        </div>
                    </div>

                    <Row xs={1} md={2} lg={3} className="g-4">

                        {
                            initialLoading && loader ? <Col className="d-flex align-content-center justify-content-center">
                                <InfinitySpin
                                    visible={true}
                                    width="200"
                                    color="#4fa94d"
                                    ariaLabel="infinity-spin-loading"
                                /> </Col> :
                                candidate && candidate?.length > 0 ? candidate?.map((item, idx) => {
                                    return (
                                        <>
                                            <Col key={item._id || idx}>
                                                <Card className="h-100 mprcards">
                                                    <Card.Body>
                                                        <Card.Title className="mb-2 h6"> <span className='colorbluesite'>Applied for:</span> <span className='text-sitecolor'>{item?.job_title}</span> </Card.Title>
                                                        <div className='cardtxt'>
                                                            <p><strong>Candidate Name:</strong> <span>{item?.name}</span></p>
                                                            <p><strong>Email:</strong> <span>{item?.email}</span></p>
                                                            <p><strong>Mobile Number:</strong> <span>{item?.mobile_no}</span></p>
                                                            <p><strong>Applied Date:</strong> <span>{item?.add_date}</span></p>
                                                            <p><strong>Interview Date:</strong> <span>{moment.utc(item?.applied_jobs?.find((data) => data?.job_id === item?.job_id)?.interview_date).local().format('DD/MM/YYYY , h:mm A')}</span></p>
                                                            {/* <p><strong>Batch ID:</strong> <span>{item?.batch_id || "N/A"}</span></p> */}
                                                            <p><strong>Current Designation:</strong> <span>{item?.designation}</span></p>
                                                            <p><strong>Project Name:</strong> <span>{item?.project_name}</span></p>
                                                            {/* <p><strong>Experience:</strong> <span>{item?.total_experience}</span></p>
                                                            <p><strong>Location:</strong> <span>{item?.location}</span></p>
                                                            <p><strong>Current CTC:</strong> <span>{item?.current_ctc} LPA</span></p>
                                                            <p><strong>Expected CTC:</strong> <span>{item?.expected_ctc} LPA</span></p>
                                                            <p><strong>Notice Period:</strong> <span>{item?.notice_period} Days</span></p> */}
                                                        </div>
                                                        {
                                                            searchParams.get('type') === 'PendingFeedback' &&
                                                            <Button type='button' className="mt-2" size='sm' variant="outline-primary" onClick={() => { handleShowModal(item) }}>
                                                                Add Review
                                                            </Button>
                                                        }
                                                        {
                                                            searchParams.get('type') === 'Upcoming' && !['Accept' , 'Reject'].includes(item?.applied_jobs?.find((data) => data?.job_id === item?.job_id)?.interviewer?.find((item) => item?.employee_id === userDetails?.employee_doc_id )?.status) && (
                                                                <>
                                                                    <div className="d-flex gap-2">
                                                                        <Button type='button' className="mt-2" size='sm' variant="outline-primary" onClick={() => { handleAccept(item , "Accept") }}>
                                                                            Accept
                                                                        </Button>

                                                                        <Button type='button' className="mt-2" size='sm' variant="outline-danger" onClick={() => { handleRejectClick(item) }}>
                                                                            Reject
                                                                        </Button>
                                                                    </div>
                                                                </>
                                                            )
                                                        }
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </>
                                    )
                                }) :
                                    (
                                        <Col sm={12} className='w-100'>
                                            <NoRecordsFound />
                                        </Col>
                                    )
                        }
                        {
                            hasMoreStatus && (
                                <Col sm={12} className='apprvloadmrbtn w-100 text-center mb-4'>
                                    <Button type='button' onClick={hasMore} disabled={loader}>
                                        {loader ? 'Loading...' : "View More"}
                                    </Button>
                                </Col>
                            )
                        }
                    </Row>
                </div>
            </div>
            <FeedbackModels show={show} onHide={() => setModalShow(false)} selectedData={selectedData} interviewsDetails={interviewDetails} isHod={true} fetchCandidateRecords={FetchCandidateRecords} />
            
            {/* Rejection Modal */}
            <Modal show={showRejectModal} onHide={handleRejectCancel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Reject Interview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Reason for Rejection <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Please provide a detailed reason for rejecting this interview..."
                            value={rejectionReason}
                            style={{ height: "150px" }}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleRejectCancel}>
                        Cancel
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleRejectConfirm}
                        disabled={!rejectionReason.trim()}
                    >
                        Confirm Rejection
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


export default ListOfInterviewedCandidateOfHod;
