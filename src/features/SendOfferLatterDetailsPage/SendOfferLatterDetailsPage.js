
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Row from 'react-bootstrap/Row';
import GoBackButton from '../goBack/GoBackButton';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken, apiHeaderTokenMultiPart } from '../../config/api_header';
import { Button, Col, Container, Form, Nav, Spinner, Tab } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Skeleton,
    Box,
    Chip
} from '@mui/material';
import moment from 'moment';
import { changeJobTypeLabel } from '../../utils/common';
import SendOfferJoiningModal from './SendOfferAndJoiningDateModal';

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import BadgeIcon from '@mui/icons-material/Badge';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { BiArrowBack } from 'react-icons/bi';
import ReferenceCheckModal from './ReferenceCheckForm';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import ReferenceCheckApprovalModal from './ReferenceApprovalModal';
import useUserDetails from './CustomeHooksForFetchCandidateRequilt';
import EmailApprovalCheckStatus from './EmailApprovalCheck';
import { FaEye, FaFileDownload, FaClock } from 'react-icons/fa';
import OfferTimelineStepper from './components/OfferTimelineStepper';
import { Grid } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';



// Add these helper functions/constants
const getTooltipStyle = (bgColor) => ({
    tooltip: {
        sx: {
            fontSize: '0.75rem',
            padding: '8px 8px',
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

// Update the action config
const actionConfig = {
    offer: {
        title: "Offer Letter",
        bgColor: '#2e7d32',
        buttonBg: 'rgba(46, 125, 50, 0.08)',
        buttonHover: 'rgba(46, 125, 50, 0.12)',
        icon: MailOutlineIcon,
        iconColor: 'success'
    },
    joining: {
        title: "Joining Kit",
        bgColor: '#0288d1',
        buttonBg: 'rgba(2, 136, 209, 0.08)',
        buttonHover: 'rgba(2, 136, 209, 0.12)',
        icon: BadgeIcon,
        iconColor: 'info'
    },
    appointment: {
        title: "Appointment Letter",
        bgColor: '#5e35b1',
        buttonBg: 'rgba(94, 53, 177, 0.08)',
        buttonHover: 'rgba(94, 53, 177, 0.12)',
        icon: EventNoteIcon,
        iconColor: 'warning'
    },
    referenceCheck: {
        title: "Reference Check",
        bgColor: '#c62828', // red tone for clear differentiation
        buttonBg: 'rgba(198, 40, 40, 0.08)',
        buttonHover: 'rgba(198, 40, 40, 0.12)',
        icon: ContactPhoneIcon, // suitable icon for reference checks
        iconColor: 'error'
    },
    joiningIntimationMail: {
        title: "Joining Intimation",
        bgColor: '#1565c0',
        buttonBg: 'rgba(21, 101, 192, 0.08)',
        buttonHover: 'rgba(21, 101, 192, 0.12)',
        icon: MailOutlineIcon,
        iconColor: 'primary'
    },
};

const ActionButton = ({ type, onClick, candidate }) => {
    const config = actionConfig[type];
    const Icon = config.icon;

    let title = config.title;
    let buttonDisabled = false;


    if (type === 'appointment') {
        const appointmentLetterStatus = candidate?.document_status?.appointment_letter;
        const joiningKitStatus = candidate?.document_status?.joining_kit;
        const offerLatter = candidate?.document_status?.offer_letter;

        buttonDisabled =
            appointmentLetterStatus === 'generated' &&
            (joiningKitStatus === 'mailsent' || joiningKitStatus === 'Skipped') &&
            (offerLatter === 'mailsent' || offerLatter === 'Skipped');

        if (
            appointmentLetterStatus === 'pending' &&
            (joiningKitStatus === 'mailsent' || joiningKitStatus === 'Skipped') &&
            (offerLatter === 'mailsent' || offerLatter === 'Skipped')
        ) {
            title = "Generate Appointment Letter";
        } else if (
            appointmentLetterStatus === 'generated' &&
            (!candidate?.appointment_letter_verification_status?.status ||
                candidate?.appointment_letter_verification_status?.status === 'Pending')
        ) {
            title = "Appointment Letter Approval Pending";
        } else if (
            appointmentLetterStatus === 'generated' &&
            candidate?.appointment_letter_verification_status?.status === 'Reject'
        ) {
            title = "Appointment Letter Rejected";
        }
    }

    return (
        <Tooltip
            title={title}
            arrow
            placement="top"
            componentsProps={getTooltipStyle(config.bgColor)}
        >
            <IconButton
                size="small"
                sx={{
                    backgroundColor: config.buttonBg,
                    '&:hover': { backgroundColor: config.buttonHover }
                }}
                onClick={() => onClick(config.title, candidate)}
                disabled={buttonDisabled}
            >
                <Icon fontSize="small" color={config.iconColor} />
            </IconButton>
        </Tooltip>
    );
};


const SendOfferLatterForApprovalCandidate = () => {
    const [approval, setApprovalData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [referenceStatus, setReferenceStatus] = useState('')
    const [referenceCheckModalOpen, setReferenceCheckModalOpen] = useState(false);
    const [openCheckApprovedInEmail, setOpenCheckApprovedInEmail] = useState(false);
    const [CandidateData, setCandidateData] = useState({});
    const [showTimeline, setShowTimeline] = useState({});
    const Navigate = useNavigate()

    const { id } = useParams()
    const [open, setOpen] = useState(false);
    const [referechCheckApprovalModal, setApprovalCheckModal] = useState(false);

    const [modalData, setModalData] = useState({
        modal_title: '',
        modal_data: null,
        approval_note_doc_id: null,
    })

    const RoleUserDetails = useMemo(() => {
        return JSON.parse(localStorage.getItem("admin_role_user") || {});
    }, [])

    const { userDetails } = useUserDetails(RoleUserDetails?._id)

    const toggleTimeline = (candidateId) => {
        setShowTimeline(prev => ({
            ...prev,
            [candidateId]: !prev[candidateId]
        }));
    };

    const GetApprovalNodeDetailsById = React.useCallback(async (id) => {
        if (!id) return;
        setLoading(true)
        try {
            let payload = {
                "approval_note_doc_id": id,
                "scope_fields": []
            }
            let response = await axios.post(`${config.API_URL}getAppraisalNoteById`, payload, apiHeaderToken(config.API_TOKEN))

            if (response.status === 200) {
                setApprovalData(response.data.data);
            }

            setLoading(false)

        } catch (error) {
            console.log(error?.message)
            setLoading(false)
        }
    }, []);

    useEffect(() => {
        if (id) {
            GetApprovalNodeDetailsById(id)
        }
    }, [id, GetApprovalNodeDetailsById])

    const fetchAgainApprovalDetails = useCallback(() => {
        if (id) {
            GetApprovalNodeDetailsById(id);
        }
    }, [GetApprovalNodeDetailsById, id])

    const showSendOfferAndJoining = async (title, data) => {
        if (!title) {
            return toast.warn("Something Went Wrong")
        }
        setModalData({
            modal_title: title,
            modal_data: data,
            approval_note_doc_id: id,
        })
        setOpen(true);
    }

    const OpenReferenceModal = (candidate_data, status) => {
        setCandidateData(candidate_data)
        setReferenceCheckModalOpen(true)
        setReferenceStatus(status)
    }

    const OpenReferenceApprovalModal = (candidate_data, approval_check_status) => {
        setApprovalCheckModal(true);
        setCandidateData(candidate_data)
        setReferenceStatus(approval_check_status)
    }

    const CheckApprovedInEmailStatus = (candidate_data, approval_check_status) => {
        setCandidateData(candidate_data)
        setReferenceStatus(approval_check_status)
        setOpenCheckApprovedInEmail(true)
    }

    /**
     * handle the Navigation in that Onboarding process
     */
    const handleNavigate = (candidateRecords) => {
        window.location.href = `/onboarding?type=new&candidate_id=${candidateRecords?.cand_doc_id}&job_id=${approval?.job_id}&approval_note_id=${approval?._id}`
    }

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <div className="backbtn mt-3 mb-2">
                        <button onClick={(e) => {
                            e.preventDefault();
                            let locationName = localStorage.getItem('approval_node_location');
                            if (locationName) {
                                localStorage.removeItem("approval_node_location")
                                window.location.href = locationName;
                            } else {
                                window.location.href = '/candidate-listing?type=approval-total'
                            }
                        }}><BiArrowBack /> </button>
                    </div>
                    <div className='dflexbtwn'>
                        <div className='sitecard w-100'>
                            <Container fluid>
                                <Row className="mb-3">
                                    <Col>
                                        <h5>Candidate(s) List For Approval ID {loading ? "..." : approval?.approval_note_id || ""}</h5>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} md={12} lg={12}>
                                        <TableContainer component={Paper} elevation={0}>
                                            <Table sx={{ minWidth: 650, '& .MuiTableCell-root': { fontSize: '0.75rem', padding: '8px 12px' } }} aria-label="candidate table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{
                                                            backgroundColor: '#34209b',
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.7rem',
                                                            padding: '6px 8px'
                                                        }}>Sr. No.</TableCell>
                                                        <TableCell sx={{
                                                            backgroundColor: '#34209b',
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.7rem',
                                                            padding: '6px 8px'
                                                        }}>Name / Email / Job Type</TableCell>
                                                        <TableCell sx={{
                                                            backgroundColor: '#34209b',
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.7rem',
                                                            padding: '6px 8px'
                                                        }}>Project Name / Designation / Job Title</TableCell>
                                                        <TableCell sx={{
                                                            backgroundColor: '#34209b',
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.7rem',
                                                            padding: '6px 8px'
                                                        }}>CTC Amount</TableCell>
                                                        <TableCell sx={{
                                                            backgroundColor: '#34209b',
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.7rem',
                                                            padding: '6px 8px'
                                                        }}>Onboarding Date / Contract End</TableCell>
                                                        <TableCell align="center" sx={{
                                                            backgroundColor: '#34209b',
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.7rem',
                                                            padding: '6px 8px'
                                                        }}>Timeline</TableCell>
                                                        <TableCell align="center" sx={{
                                                            backgroundColor: '#34209b',
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.7rem',
                                                            padding: '6px 8px'
                                                        }}>Actions</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {loading ? (
                                                        // Loading state
                                                        [...Array(3)].map((_, index) => (
                                                            <TableRow key={`loading-${index}`}>
                                                                {[...Array(7)].map((_, cellIndex) => (
                                                                    <TableCell key={`loading-cell-${cellIndex}`}>
                                                                        <Skeleton animation="wave" />
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        ))
                                                    ) : !approval?.candidate_list?.length ? (
                                                        // Empty state
                                                        <TableRow>
                                                            <TableCell
                                                                colSpan={7}
                                                                align="center"
                                                                sx={{
                                                                    py: 8,
                                                                    color: 'text.secondary',
                                                                    fontSize: '1rem'
                                                                }}
                                                            >
                                                                No candidates found
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        // Existing table content
                                                        approval?.candidate_list?.map((candidate, index) => (
                                                            <React.Fragment key={candidate.cand_doc_id || index}>
                                                                <TableRow
                                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                >
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell>
                                                                        <div className='d-flex flex-column gap-2'>
                                                                            <Link to={`/candidate-profile/${candidate?.cand_doc_id}?job_id=${approval?.job_id}`}><span>{candidate.name}</span></Link>
                                                                            <span>{candidate.email}</span>
                                                                            <span>{changeJobTypeLabel(candidate.job_type)}</span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className='d-flex flex-column gap-2'>
                                                                            <span>{approval.project_name}</span>
                                                                            <span>{approval.job_designation}</span>
                                                                            <span>{approval.job_title}</span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>{candidate.offer_ctc || '0'} / {candidate?.payment_type}</TableCell>
                                                                    <TableCell>
                                                                        <div className='d-flex flex-column gap-2'>
                                                                            <span>{moment(candidate.onboarding_date).format('DD/MM/YYYY')}</span>
                                                                            <span>{moment(candidate.job_valid_date).format('DD/MM/YYYY')}</span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <div className='d-flex justify-content-center align-items-center gap-2'>
                                                                            <Tooltip
                                                                                title={showTimeline[candidate.cand_doc_id] ? "Hide Timeline" : "Show Timeline"}
                                                                                arrow
                                                                                placement="top"
                                                                                componentsProps={getTooltipStyle('#1976d2')}
                                                                            >
                                                                                <IconButton
                                                                                    size="small"
                                                                                    onClick={() => toggleTimeline(candidate.cand_doc_id)}
                                                                                    sx={{
                                                                                        backgroundColor: showTimeline[candidate.cand_doc_id] ? '#1976d2' : '#f5f5f5',
                                                                                        color: showTimeline[candidate.cand_doc_id] ? 'white' : '#1976d2',
                                                                                        '&:hover': {
                                                                                            backgroundColor: showTimeline[candidate.cand_doc_id] ? '#1565c0' : '#e3f2fd'
                                                                                        },
                                                                                        fontSize: '0.75rem'
                                                                                    }}
                                                                                >
                                                                                    <FaClock size={15} />
                                                                                </IconButton>
                                                                            </Tooltip>

                                                                            {
                                                                                Array.isArray(candidate?.reference_check) && candidate.reference_check.length > 0 && (
                                                                                    <Tooltip
                                                                                        title="Reference Check Details"
                                                                                        arrow
                                                                                        placement="bottom"
                                                                                        componentsProps={getTooltipStyle('#34209b')}
                                                                                    >
                                                                                        <Link to={`/referral-check-details/${candidate.cand_doc_id}?approval_id=${approval._id}`}>
                                                                                            <IconButton
                                                                                                size="small"
                                                                                                sx={{
                                                                                                    backgroundColor: '#34209b',
                                                                                                    '&:hover': { backgroundColor: '#a69cd8ff' }
                                                                                                }}
                                                                                                className="text-white"
                                                                                            // to={`/referral-check-details/${candidate.cand_doc_id}`}
                                                                                            >
                                                                                                <ContactPhoneIcon fontSize="small" size="small" color="#9c91cfff" />
                                                                                            </IconButton>
                                                                                        </Link>
                                                                                    </Tooltip>
                                                                                )
                                                                            }
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Box
                                                                            sx={{
                                                                                display: 'flex',
                                                                                justifyContent: 'center',
                                                                                alignItems: 'center',
                                                                                gap: 1
                                                                            }}
                                                                        >
                                                                            <ActionButton
                                                                                type="joiningIntimationMail"
                                                                                onClick={showSendOfferAndJoining}
                                                                                candidate={candidate}
                                                                            />
                                                                            {/* Case 1: Show Offer Button if no reference check exists */}
                                                                            {Array.isArray(candidate?.reference_check) &&
                                                                                candidate.reference_check.length === 0 &&
                                                                                Array.isArray(candidate?.verification_skip_data) &&
                                                                                !candidate.verification_skip_data.some(r => r.referenceStatus === 'previous') &&
                                                                                !candidate.verification_skip_data.some(r => r.referenceStatus === 'current')
                                                                                && (
                                                                                    <ActionButton
                                                                                        type="referenceCheck"
                                                                                        onClick={() => OpenReferenceApprovalModal(candidate, 'previous')}
                                                                                        candidate={candidate}
                                                                                    />
                                                                                )
                                                                            }

                                                                            {/* Case 2: Reference exists and all docs pending */}
                                                                            {(candidate?.reference_check || ((candidate?.is_verification_skipped || candidate?.verification_skip_data?.some(r => r.referenceStatus === 'previous')) && (candidate?.is_verification_skipped === 'Yes' || candidate?.verification_skip_data?.some(r => r.referenceStatus === 'previous')))) &&
                                                                                (Array.isArray(candidate?.reference_check) || (candidate?.verification_skip_data?.some(r => r.referenceStatus === 'previous'))) &&
                                                                                (candidate?.reference_check?.some((item) => item?.referenceStatus === 'previous') || (candidate?.verification_skip_data?.some(r => r.referenceStatus === 'previous'))) &&
                                                                                candidate.document_status?.offer_letter === "pending" &&
                                                                                candidate.document_status?.joining_kit === "pending" &&
                                                                                candidate.document_status?.appointment_letter === "pending" && (
                                                                                    <ActionButton
                                                                                        type="offer"
                                                                                        // onClick={() => OpenReferenceModal(candidate)}
                                                                                        onClick={showSendOfferAndJoining}
                                                                                        candidate={candidate}
                                                                                    />
                                                                                )}
                                                                            {/* Case 3: Offer sent, Joining pending */}
                                                                            {(candidate?.reference_check || (candidate?.verification_skip_data?.some(r => r.referenceStatus === 'previous'))) &&
                                                                                (Array.isArray(candidate?.reference_check) || (candidate?.verification_skip_data?.some(r => r.referenceStatus === 'previous'))) &&
                                                                                (candidate?.reference_check?.some((item) => item?.referenceStatus === 'previous') || (candidate?.verification_skip_data?.some(r => r.referenceStatus === 'previous'))) &&
                                                                                ["mailsent", 'uploaded', 'Skipped'].includes(candidate.document_status?.offer_letter) &&
                                                                                candidate.document_status?.joining_kit === "pending" && (
                                                                                    <ActionButton
                                                                                        type="joining"
                                                                                        onClick={showSendOfferAndJoining}
                                                                                        candidate={candidate}
                                                                                    />
                                                                                )}
                                                                            {/* Case 4: Joining sent, Appointment pending */}
                                                                            {(candidate?.reference_check || (candidate?.verification_skip_data?.some(r => ['previous', 'current'].includes(r.referenceStatus)))) &&
                                                                                (Array.isArray(candidate?.reference_check) || (candidate?.verification_skip_data?.some(r => ['previous', 'current'].includes(r.referenceStatus)))) &&
                                                                                (candidate?.reference_check?.some((item) => item?.referenceStatus === 'previous') || (candidate?.is_verification_skipped && candidate?.is_verification_skipped === 'Yes')) &&
                                                                                ["mailsent", 'uploaded', 'Skipped'].includes(candidate.document_status?.joining_kit) &&
                                                                                (candidate.document_status?.appointment_letter === "pending" || candidate.document_status?.appointment_letter === "generated" || candidate.document_status?.appointment_letter === "approved") && (
                                                                                    <ActionButton
                                                                                        type="appointment"
                                                                                        onClick={() => {
                                                                                            const noCurrent =
                                                                                                Array.isArray(candidate.reference_check) &&
                                                                                                !candidate.reference_check.some(r => r.referenceStatus === 'current') &&
                                                                                                Array.isArray(candidate.verification_skip_data) &&
                                                                                                !candidate.verification_skip_data.some(r => r.referenceStatus === 'current');
                                                                                            const hasCurrent =
                                                                                                Array.isArray(candidate.reference_check) &&
                                                                                                !candidate.reference_check.some(r => r.referenceStatus === 'hrhead') &&
                                                                                                Array.isArray(candidate.verification_skip_data) &&
                                                                                                !candidate.verification_skip_data.some(r => r.referenceStatus === 'hrhead');
                                                                                            const CurrentApproved =
                                                                                                Array.isArray(candidate.reference_check) &&
                                                                                                candidate.reference_check.some(r => r.referenceStatus === 'current') &&
                                                                                                Array.isArray(candidate.verification_skip_data) &&
                                                                                                !candidate.verification_skip_data.some(r => r.referenceStatus === 'current') &&
                                                                                                candidate.reference_check.some(r => r.referenceStatus === 'current' && r.verification_status === 'Pending');

                                                                                            if (noCurrent) {
                                                                                                // Step: open “current” modal
                                                                                                return OpenReferenceModal(candidate, 'current');
                                                                                            }

                                                                                            if (hasCurrent && !CurrentApproved) {
                                                                                                // Step: HR‑Head review
                                                                                                return OpenReferenceApprovalModal(candidate, 'hrhead');
                                                                                            }

                                                                                            if (CurrentApproved && hasCurrent) {
                                                                                                return CheckApprovedInEmailStatus(candidate, 'current')
                                                                                            }

                                                                                            // Otherwise: skip straight to send-offer/joining
                                                                                            return showSendOfferAndJoining('Appointment Letter', candidate);
                                                                                        }}

                                                                                        // onClick={showSendOfferAndJoining}
                                                                                        candidate={candidate}
                                                                                    />
                                                                                )}
                                                                            {candidate?.reference_check &&
                                                                                Array.isArray(candidate?.reference_check) &&
                                                                                ["mailsent", "complete", 'uploaded', 'Skipped'].includes(candidate.document_status?.offer_letter) &&
                                                                                ["mailsent", "complete", 'uploaded', 'Skipped'].includes(candidate.document_status?.joining_kit) &&
                                                                                ["mailsent", "complete", 'uploaded'].includes(candidate.document_status?.appointment_letter) && (
                                                                                    <Button
                                                                                        variant="outlined"
                                                                                        color="success"
                                                                                        size="small"
                                                                                        onClick={() => handleNavigate(candidate)}
                                                                                    // disabled
                                                                                    >
                                                                                        <span style={{
                                                                                            fontSize: '0.7rem', textTransform: 'none',
                                                                                            fontWeight: 'bold'
                                                                                        }}>Onboard</span>
                                                                                    </Button>
                                                                                )}
                                                                        </Box>
                                                                    </TableCell>
                                                                </TableRow>
                                                                {showTimeline[candidate.cand_doc_id] && (
                                                                    <TableRow>
                                                                        <TableCell colSpan={7} sx={{ padding: '8px', backgroundColor: '#f8f9fa' }}>
                                                                            <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                                                                                <OfferTimelineStepper
                                                                                    candidateData={candidate}
                                                                                    compact={true}
                                                                                />
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </React.Fragment>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Col>
                                    {/* <Col xs={4} md={4} lg={4}>
                                        <OfferTimelineStepper candidateData={approval} />
                                    </Col> */}
                                </Row>
                            </Container>
                        </div>
                    </div>
                </div>
            </div>
            <SendOfferJoiningModal open={open} setOpen={setOpen} modalData={modalData} fetchAgainApprovalDetails={fetchAgainApprovalDetails} roleUserDetails={userDetails} />
            <ReferenceCheckModal open={referenceCheckModalOpen} onClose={() => setReferenceCheckModalOpen(false)} Candidate={CandidateData} fetchAgainApprovalDetails={fetchAgainApprovalDetails} referenceStatus={referenceStatus} roleUserDetails={userDetails} />
            <EmailApprovalCheckStatus open={openCheckApprovedInEmail} onClose={() => setOpenCheckApprovedInEmail(false)} Candidate={CandidateData} fetchAgainApprovalDetails={fetchAgainApprovalDetails} referenceStatus={referenceStatus} roleUserDetails={userDetails} />
            <ReferenceCheckApprovalModal open={referechCheckApprovalModal} onClose={() => setApprovalCheckModal(false)} approvalDetails={approval && approval} candidateDetails={CandidateData} fetchAgainApprovalDetails={fetchAgainApprovalDetails} roleUserDetails={userDetails} referenceStatus={referenceStatus} />
        </>
    );
};

export default SendOfferLatterForApprovalCandidate;