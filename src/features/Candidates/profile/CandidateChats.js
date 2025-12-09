import React, { useEffect, useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import { TfiEmail } from "react-icons/tfi";
import Accordion from 'react-bootstrap/Accordion';
import { FiBarChart } from "react-icons/fi";
import { InputGroup, Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import { IoChatboxEllipsesOutline, IoChatbubbleEllipsesOutline, IoSend } from 'react-icons/io5';
import { toast } from 'react-toastify';
import axios from 'axios';
import config from '../../../config/config';
import { apiHeaderToken } from '../../../config/api_header';
import { useSelector, useDispatch } from "react-redux";
import { FetchCandidatesListById } from "../../slices/AppliedJobCandidates/JobAppliedCandidateSlice";
import { useParams } from 'react-router-dom';
import { FaRocketchat } from 'react-icons/fa';




export default function CandidateChats() {

    const [chat, setChatDiscussion] = useState('');
    const candidateRecords = useSelector((state) => state.appliedJobList.AppliedCandidateList)
    const loginDetails = JSON.parse(localStorage.getItem('admin_role_user')) || {}
    const [DiscussionList, setDiscussionList] = useState({})
    const [loading, setLoading] = useState(false);
    const [HasMore, setHasMore] = useState(false);
    const [records, setRecords] = useState(10)
    const [show , NotShow] = useState(false);
    const { id } = useParams();



    const FetchChatHistory = async () => {
        try {
            // http://localhost:8080/v1/admin/CandidateDiscussionList
            let Payloads = {
                "candidate_id": id ?? '',
                "page_no": "1",
                "per_page_record": records
            }
            let response = await axios.post(`${config.API_URL}CandidateDiscussionList`, Payloads, apiHeaderToken(config.API_TOKEN))
            if (response.status === 200) {
                setDiscussionList(response.data?.data);
                if(response.data?.data?.length >= records){
                    NotShow(true)
                }else {
                    NotShow(false)
                }
            }else if (response.status === 204){
                setDiscussionList(null)
            }
            setLoading(false)
            setHasMore(false)
        } catch (error) {
            setLoading(false)
            setHasMore(false)
            setDiscussionList(null)
        }
    }


    useEffect(() => {
        if (id) {
            FetchChatHistory();
        }
    }, [id, records])

    const AddChatsDiscussion = async () => {
        if (!chat) {
            return toast.warn("Please Enter the Description")
        }
        setLoading(true)
        let Payloads = {
            "candidate_id": candidateRecords?.data?._id ?? '',
            "project_id": candidateRecords?.data?.project_id ?? '',
            "candidate_name": candidateRecords?.data?.name ?? '',
            "discuss_with": loginDetails?.name,
            "subject": `Reminder from ${candidateRecords?.data?.name}`,
            "discussion": chat
        }
        try {
            let response = await axios.post(`${config.API_URL}addCandidateDiscussion`, Payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                toast.success(response?.data?.message)
                FetchChatHistory();
            } else {
                toast.error(response?.data?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message)
        }
    }

    const hasMoreData = () => {
        setHasMore(true)
        setRecords((prev) => prev + 2);
    };



    return (
        <>
            <div className="row my-3" data-aos="fade-in" data-aos-duration="3000">
                <div className="col-lg-12">
                    <div className="sitecard h-100 p-0 pt-4">
                        <div className="infobox borderbtm">
                            <div className="px-4 w-100">
                                <h5>Add Candidate Discussion </h5>
                                <div className="timeline_srch m-lg-2">
                                    <Row>
                                        <Col md={8}>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text id="basic-addon1"> <IoChatboxEllipsesOutline /></InputGroup.Text>
                                                <Form.Control
                                                    placeholder="Enter Description"
                                                    aria-label="Enter Description"
                                                    aria-describedby="basic-addon1"
                                                    value={chat}
                                                    onChange={(e) => setChatDiscussion(e.target.value)}
                                                />
                                            </InputGroup>
                                        </Col>
                                        <Col md={4}>
                                            <Button disabled={loading} variant='success' onClick={AddChatsDiscussion}>
                                                {
                                                    loading ? <Spinner animation="border" role="status" /> : <IoSend />
                                                }
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                        <div className="timelinewrap px-4 w-100">
                            <div className="timeline_row">
                                <div className="dateline">
                                    <h6>Discussion History</h6>
                                </div>
                                {
                                    DiscussionList && DiscussionList?.length > 0 ?
                                        (
                                            DiscussionList.map((item, index) => (
                                                <div className="evntrow" key={index}>
                                                    <div className="evnttxt">
                                                        <div className="evnt_icon">
                                                            <span className="bg_dpurple">
                                                                <IoChatbubbleEllipsesOutline />
                                                            </span>
                                                        </div>
                                                        <div className="evntabt">
                                                            <h6>Discussion with {item?.discuss_with || 'N/A'}</h6>
                                                            <Accordion defaultActiveKey={index === 0 ? `${index}` : null}>
                                                                <Accordion.Item eventKey={`${index}`}>
                                                                    <Accordion.Header></Accordion.Header>
                                                                    <Accordion.Body>
                                                                        <p>{item?.discussion || 'No discussion available'}</p>
                                                                    </Accordion.Body>
                                                                </Accordion.Item>
                                                            </Accordion>
                                                        </div>
                                                    </div>
                                                    <div className="evntdate">
                                                        <p>{item?.add_date || 'Date not available'}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) :
                                        (
                                            <div className="d-flex align-items-center justify-content-center mb-4">
                                                <div className="text-center">
                                                    <span className=""> No Any Conversation Initiated  </span>
                                                </div>
                                            </div>
                                        )
                                }
                                { show && (
                                    <div className="evntrow justify-content-center">
                                        <Button className='text-center' disabled={HasMore} onClick={hasMoreData}> { HasMore ? 'Loading...' : 'View More' }</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

