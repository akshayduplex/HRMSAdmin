import React, { useEffect, useState } from 'react';
import { Table, Modal, Accordion, Row, Col, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import config from '../../../config/config';
import { apiHeaderToken } from '../../../config/api_header';
import { useSelector, useDispatch } from "react-redux";
import { FetchCandidatesListById } from "../../slices/AppliedJobCandidates/JobAppliedCandidateSlice";
import { useParams } from 'react-router-dom';
import { FaRocketchat } from 'react-icons/fa';
import { CiCircleRemove } from 'react-icons/ci';
import moment from 'moment';
import { changeJobTypeLabel } from '../../../utils/common';
import { IconButton, Tooltip } from '@mui/material';
import { useMemo } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Helper function to convert string to camel case
const CamelCases = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};


export default function BoadMemberListing() {

    const candidateRecords = useSelector((state) => state.appliedJobList.AppliedCandidateList)
    const loginDetails = JSON.parse(localStorage.getItem('admin_role_user')) || {}
    const [memberList, setMember] = useState(null);
    const [openModalApprovalHistory, setApprovalHistory] = useState(false);
    const [data, setData] = useState(null);
    const { id } = useParams();

    const getOfferApprovalMemberList = async (candidateId, appliedJobId) => {
        try {
            let payloads = {
                "candidate_doc_id": candidateId,
                "applied_job_id": appliedJobId,
            }
            let response = await axios.post(`${config.API_URL}getApprovalMemberListForCandidate`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                setMember(response.data?.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (candidateRecords?.status === 'success') {
            getOfferApprovalMemberList(candidateRecords?.data?._id, candidateRecords?.data?.applied_jobs?.filter((item) => item.job_id === candidateRecords?.data?.job_id)[0]?._id)
        }
    }, [candidateRecords])

    // tooltips styling 

    const commonIconButtonStyle = useMemo(() => ({
        width: '32px',
        height: '32px',
        padding: '4px',
        borderRadius: '4px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            transform: 'translateY(-2px)',
        }
    }), []);

    const getTooltipStyle = (bgColor) => ({
        tooltip: {
            sx: {
                fontSize: '0.75rem',
                padding: '8px 12px',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                fontWeight: 500,
                bgcolor: bgColor,
                '& .MuiTooltip-arrow': {
                    color: bgColor
                }
            }
        }
    });

    // Handle view approval member list
    const handleViewApprovalHistory = (item) => {
        setData(item);
        setApprovalHistory(true);
    };

    return (
        <>
            <div className="row my-3" data-aos="fade-in" data-aos-duration="3000">
                <div className="col-lg-12">
                    <div className="sitecard h-100 p-0 pt-4">
                        <div className="modaltbl mt-3">
                            <Table hover>
                                <thead>
                                    <tr style={{ fontSize: '12px' }}>
                                        <th>Sno.</th>
                                        <th>Approval ID</th>
                                        <th>Approval Details</th>
                                        <th> Project / Job</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        memberList && Array.isArray(memberList) && memberList?.length > 0 ?
                                            memberList?.map((item, index) => {
                                                return (
                                                    <>
                                                        <tr key={item?._id} style={{ fontSize: '12px' }}>
                                                            <td>{index + 1}</td>
                                                            <td>{<a href={`/approval-candidate-list/${item?._id}`} target="_blank">{item?.approval_note_id}</a>}</td>
                                                            <td>
                                                                <div className='d-flex flex-column align-items-start gap-1'>
                                                                    <span>{item?.candidate_list?.[0]?.proposed_location}</span>
                                                                    <span>{item?.mpr_fund_type}</span>
                                                                    <span>{changeJobTypeLabel(item?.candidate_list?.[0]?.job_type)}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className='d-flex flex-column align-items-start gap-1'>
                                                                    <span>{item?.project_name}</span>
                                                                    <span>{item?.job_title}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <Tooltip
                                                                    title="Approval Member List"
                                                                    arrow
                                                                    placement="top"
                                                                    componentsProps={getTooltipStyle('#1976d2')}
                                                                >
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleViewApprovalHistory(item)}
                                                                        sx={{
                                                                            ...commonIconButtonStyle,
                                                                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                                                            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.15)' }
                                                                        }}
                                                                    >
                                                                        <VisibilityIcon style={{ color: '#1976d2' }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </td>
                                                        </tr>
                                                    </>
                                                )
                                            }) :
                                            <tr className='text-center'>
                                                <td colSpan={6} className='text-center'>No Record Found</td>
                                            </tr>
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>


            <Modal show={openModalApprovalHistory} onHide={() => setApprovalHistory(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Approval History</Modal.Title>
                </Modal.Header>
                <Modal.Body className='h-auto'>
                    <Accordion defaultActiveKey="0" alwaysOpen>
                        {!data ? <h4 className='text-center'> No Records Found </h4> :
                            <Accordion.Item eventKey='0' key='0'>
                                <Accordion.Header>
                                    Candidate Name - {CamelCases(data?.candidate_list?.[0]?.name)}
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Row className='mb-3'>
                                        <Col sm={3}>
                                            <span> <strong style={{ fontSize: '14px', fontWeight: '640' }} >CTC Amount</strong> : <p style={{ fontSize: '14px', fontWeight: '400' }}>{data?.candidate_list?.[0]?.offer_ctc}</p> </span>
                                        </Col>
                                        <Col sm={3}>
                                            <span> <strong style={{ fontSize: '14px', fontWeight: '640' }} >Onboarding Date</strong> : <p style={{ fontSize: '14px', fontWeight: '400' }}> {moment(data?.candidate_list?.[0]?.onboarding_date).format('DD-MM-YYYY')} </p>  </span>
                                        </Col>
                                        <Col sm={3}>
                                            <span> <strong style={{ fontSize: '14px', fontWeight: '640' }}>Contract End Date</strong> : <p style={{ fontSize: '14px', fontWeight: '400' }}> {moment(data?.candidate_list?.[0]?.job_valid_date).format('DD-MM-YYYY')} </p>  </span>
                                        </Col>
                                        <Col sm={3}>
                                            <span> <strong style={{ fontSize: '14px', fontWeight: '640' }}>Employment Nature</strong> : <p style={{ fontSize: '14px', fontWeight: '400' }}>{changeJobTypeLabel(data?.candidate_list?.[0]?.job_type)}</p> </span>
                                        </Col>
                                    </Row>

                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Sr No.</th>
                                                <th>Name</th>
                                                <th>Designation</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                                <th>Remark</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.panel_members_list?.length > 0 ? (
                                                data.panel_members_list?.map((member, idx) => {
                                                    const memberDetails = data?.candidate_list?.[0]?.approval_history?.find(
                                                        (panelMember) => panelMember?.emp_doc_id === member?.emp_doc_id
                                                    );
                                                    return (
                                                        <tr key={idx}>
                                                            <td>{idx + 1}</td>
                                                            <td>{CamelCases(member?.name) || 'N/A'}</td>
                                                            <td>{member?.designation || 'N/A'}</td>
                                                            <td>{memberDetails?.approval_status || 'Pending'}</td>
                                                            <td>
                                                                {memberDetails?.approved_date
                                                                    ? moment(memberDetails?.approved_date).format('DD/MM/YYYY')
                                                                    : 'Pending'}
                                                            </td>
                                                            <td>{memberDetails?.remark || 'Pending'}</td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="text-center">
                                                        No Records Found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </Accordion.Body>
                            </Accordion.Item>
                        }
                    </Accordion>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setApprovalHistory(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

