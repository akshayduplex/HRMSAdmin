import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Tabs,
    Tab,
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { GridCloseIcon, GridDeleteIcon } from '@mui/x-data-grid';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken, apiHeaderTokenMultiPart } from '../../config/api_header';
import moment from 'moment';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`document-tabpanel-${index}`}
            aria-labelledby={`document-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
        </div>
    );
}

export default function DocumentModal({ open, onClose, data, candidateData }) {
    const [tabIndex, setTabIndex] = useState(0);
    const [OnboardingDoc, setOnboardingDoc] = useState(null);
    const [file, setFile] = useState(null);
    const { id } = useParams();
    const loginUsers = JSON.parse(localStorage.getItem('admin_role_user')) ?? {}


    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const fetCandidateRecords = React.useCallback(async () => {
        try {

            let payload = {
                candidate_id: candidateData?.modal_data?.cand_doc_id,
            }

            let response = await axios.post(`${config.API_URL}getOnboardDocuments`, payload, apiHeaderToken(config.API_TOKEN))

            if (response.status === 200) {
                setOnboardingDoc(response.data?.data)
            } else {
                setOnboardingDoc(null)
            }

        } catch (error) {
            setOnboardingDoc(null)
        }
    }, [candidateData]);

    useEffect(() => {
        if (open && candidateData) {
            fetCandidateRecords()
        }
    }, [open, candidateData, fetCandidateRecords])

    const handleFileUpload = (idx, event, document_id) => {
        const files = Array.from(event.target.files);
        ReplaceCandidateDocuments(document_id, files)
    };

    const ReplaceCandidateDocuments = async (documentId = '', files) => {
        try {

            if (!documentId) {
                return toast.error('Please select a document to upload')
            }

            let formData = new FormData();
            formData.append('candidate_id', candidateData?.modal_data?.cand_doc_id);
            formData.append('approval_note_id', id);
            formData.append('onboard_doc_id', documentId);
            formData.append("add_by_name", loginUsers?.name)
            formData.append("add_by_mobile", loginUsers?.mobile_no)
            formData.append("add_by_designation", loginUsers?.designation)
            formData.append("add_by_email", loginUsers?.email)

            let attachments = [];

            if (files && Array.isArray(files)) {
                attachments = files.map((input) => ({
                    doc_name: input.name,
                    file_name: input
                }));
            }

            attachments.forEach((att, i) => {
                formData.append(`attachments[${i}][doc_name]`, att.doc_name);
                formData.append(`attachments[${i}][file_name]`, att.file_name);
            });

            let response = await axios.post(`${config.API_URL}uploadOnboardingDocuments`, formData, apiHeaderTokenMultiPart(config.API_TOKEN))

            if (response.status === 200) {
                toast.success(response.data?.message)
                fetCandidateRecords();
            } else {
                toast.error(response.data?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Internal server Error")
        }
    }

    const handleDelete = async (documentId) => {
        try {

            if (!documentId) {
                return toast.error('Please select a document to upload')
            }

            let payloads = {
                "approval_note_id": id,
                "candidate_id": candidateData?.modal_data?.cand_doc_id,
                "onboard_doc_id": documentId
            }

            let response = await axios.post(`${config.API_URL}removeOnboardingDocuments`, payloads, apiHeaderToken(config.API_TOKEN))

            if (response.status === 200) {
                toast.success(response.data?.message)
                fetCandidateRecords();
            } else {
                toast.error(response.data?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Internal server Error")
        }
    }


    const renderTable = (documents) => (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell
                        sx={{
                            backgroundColor: '#34209b',
                            color: 'white',
                            fontWeight: 'bold'
                        }}
                    >Document Name</TableCell>
                    <TableCell sx={{
                        backgroundColor: '#34209b',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>Added By</TableCell>
                    <TableCell sx={{
                        backgroundColor: '#34209b',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>Uploaded by</TableCell>
                    <TableCell sx={{
                        backgroundColor: '#34209b',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>Added Date</TableCell>
                    <TableCell sx={{
                        backgroundColor: '#34209b',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {documents && documents.length > 0 ? (
                    documents.map((doc, idx) => (
                        <TableRow key={doc?.add_date}>
                            <TableCell>{doc.doc_name}</TableCell>
                            <TableCell>{doc?.send_file_data?.added_by_data?.name || ""}</TableCell>
                            <TableCell>{doc?.uploaded_file_data?.added_by_data?.name || "N/A"}</TableCell>
                            <TableCell>{moment(doc?.add_date).format('DD/MM/YYYY')}</TableCell>
                            <TableCell>
                                <Tooltip title="View" arrow componentsProps={{
                                    tooltip: {
                                        sx: {
                                            bgcolor: '#1976d2',
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            '& .MuiTooltip-arrow': { color: '#1976d2' }
                                        }
                                    }
                                }}>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        href={doc?.uploaded_file_data && doc?.uploaded_file_data?.file_name ? config.IMAGE_PATH + doc?.uploaded_file_data?.file_name : config.IMAGE_PATH + doc?.send_file_data?.file_name}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </Tooltip>
                                {/* Download Icon */}
                                <Tooltip title="Download" arrow componentsProps={{
                                    tooltip: {
                                        sx: {
                                            bgcolor: '#388e3c',
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            '& .MuiTooltip-arrow': { color: '#388e3c' }
                                        }
                                    }
                                }}>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        href={doc?.uploaded_file_data && doc?.uploaded_file_data?.file_name ? config.IMAGE_PATH + doc?.uploaded_file_data?.file_name : config.IMAGE_PATH + doc?.send_file_data?.file_name}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <DownloadIcon />
                                    </IconButton>
                                </Tooltip>

                                {/* Uploads Button */}
                                <Tooltip title="Upload" arrow componentsProps={{
                                    tooltip: {
                                        sx: {
                                            bgcolor: '#388e3c',
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            '& .MuiTooltip-arrow': { color: '#388e3c' }
                                        }
                                    }
                                }}>
                                    <IconButton
                                        size="small"
                                        color="success"
                                        component="label"
                                    >
                                        <UploadFileIcon />
                                        <input
                                            type="file"
                                            hidden
                                            onChange={(e) => {
                                                handleFileUpload(idx, e, doc?._id);
                                            }}
                                        />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip
                                    title="Delete"
                                    arrow
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: '#d32f2f', // Red 700
                                                color: 'white',
                                                fontSize: '0.75rem',
                                                '& .MuiTooltip-arrow': { color: '#d32f2f' },
                                            },
                                        },
                                    }}
                                >
                                    <IconButton
                                        size="small"
                                        color="error" // Applies red theme from MUI
                                        onClick={() => handleDelete(doc?._id)}
                                    >
                                        <GridDeleteIcon />
                                    </IconButton>
                                </Tooltip>

                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} align="center">
                            Data not available
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            aria-labelledby="document-modal-title"
        >
            <DialogTitle id="document-modal-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Documents
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                        ml: 2,
                    }}
                    size="small"
                >
                    <GridCloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="document tabs">
                    <Tab label="Offer Letter Documents" id="document-tab-0" />
                    <Tab label="Joining Kit Documents" id="document-tab-1" />
                    <Tab label="Appointment Letter Documents" id="document-tab-2" />
                </Tabs>

                <TabPanel value={tabIndex} index={0}>
                    {renderTable(OnboardingDoc && (OnboardingDoc.onboarding_docs?.filter(item => item?.doc_category === 'Offer Letter') || []))}
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    {renderTable(OnboardingDoc && (OnboardingDoc.onboarding_docs?.filter(item => item?.doc_category === 'Joining Kit') || []))}
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                    {renderTable(OnboardingDoc && (OnboardingDoc.onboarding_docs?.filter(item => item?.doc_category === 'Appointment Letter') || []))}
                </TabPanel>
            </DialogContent>
        </Dialog>
    );
}
