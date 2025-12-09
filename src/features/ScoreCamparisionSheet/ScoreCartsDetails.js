import React, { useMemo, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Avatar,
    Tabs,
    Tab,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { Print as PrintIcon } from '@mui/icons-material';

const ScoreComparisonSheet = ({ scoreDetails , selectedJob }) => {

    const [selectedId, setSelectedId] = useState(scoreDetails[0]?.employee_doc_id);
    // Track checked candidates by _id
    const [checkedCandidates, setCheckedCandidates] = useState([]);

    const candidates = useMemo(() => {
        return scoreDetails.find((rec) => rec.employee_doc_id === selectedId);
    }, [scoreDetails, selectedId]);

    // When interviewer changes, reset checked list to none checked
    React.useEffect(() => {
        if (candidates && candidates.candidate_list) {
            setCheckedCandidates([]);
        }
    }, [selectedId, candidates]);

    // Select all checkbox logic
    const isAllChecked = candidates && candidates.candidate_list && checkedCandidates.length === candidates.candidate_list.length && candidates.candidate_list.length > 0;
    const isIndeterminate = candidates && candidates.candidate_list && checkedCandidates.length > 0 && checkedCandidates.length < candidates.candidate_list.length;
    const handleCheckAll = (e) => {
        if (e.target.checked) {
            setCheckedCandidates(candidates.candidate_list.map(c => c._id));
        } else {
            setCheckedCandidates([]);
        }
    };

    const handleCheckCandidate = (id) => {
        setCheckedCandidates(prev =>
            prev.includes(id)
                ? prev.filter(cid => cid !== id)
                : [...prev, id]
        );
    };

    const handleInterviewerChange = (_e, val) => {
        setSelectedId(val);
    };

    const makeDynamicHTML = (data, checkedIds) => {
        // Only print checked candidates
        const filteredCandidates = data?.candidate_list?.filter(c => checkedIds.includes(c._id));
        let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Interview Score Sheet</title>
            <style>
                @media print {
                    body { margin: 0; }
                }
                body {
                    font-family: Arial, sans-serif;
                    margin: 10px;
                    background-color: #f5f5f5;
                }
                .container {
                    background-color: white;
                    padding: 10px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                    font-size: 10px;
                }
                
                th, td {
                    border: 1px solid #000;
                    padding: 4px;
                    text-align: center;
                    vertical-align: middle;
                    height: 40px;
                }
                
                th {
                    background-color: #ddeeff;
                    font-weight: bold;
                    font-size: 9px;
                    padding: 2px;
                }
                
                .serial-cell {
                    width: 40px;
                    background-color: #f5f5f5;
                    font-weight: bold;
                }
                
                .candidate-cell {
                    text-align: left;
                    padding-left: 8px;
                    width: 120px;
                }
                
                .empty-col {
                    width: 50px;
                }
                
                .job-position {
                    width: 100px;
                }
                
                .job-offered {
                    width: 100px;
                }
                
                .evaluation-score {
                    width: 80px;
                }
                
                .team-review {
                    width: 60px;
                }
                
                .comments {
                    width: 80px;
                }
                
                .total {
                    width: 50px;
                }
                
                .result {
                    width: 80px;
                }
                
                .remarks {
                    width: 100px;
                }
                
                .signature-section {
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }

                .signature-row {
                    display: flex;
                    gap: 2rem;
                    margin: 1.5rem 0;
                }

                .signature-field {
                    flex: 1;
                }

                .signature-label {
                    font-weight: bold;
                    display: block;
                    margin-bottom: 0.5rem;
                }

                .signature-input {
                    position: relative;
                    height: 1.25rem;
                }
                .signature-input::before { left: 0; }
                .signature-input::after  { right: 0; }

                .signature-input img {
                    max-height: 100%;
                    object-fit: contain;
                } 
            </style>
        </head>
        <body>   
            <div class="container">   
                <h2 style="text-align: center; font-size: 16px; font-weight: bold;"> ${selectedJob?.label || ""} </h2>
                <table>
                    <thead>
                        <tr>
                            <th class="serial-cell">S/No</th>
                            <th class="candidate-cell">Name of the Candidate</th>
                            <th class="empty-col"></th>
                            <th class="job-position">Job Match (5)</th>
                            <th class="job-offered">Job Knowledge(10)</th>
                            <th class="evaluation-score">Creative problem solving capacity (10)</th>
                            <th class="team-review">Team Player (5)</th>
                            <th class="comments">Communication Skill (10)</th>
                            <th class="total">Exposure to Job Profile (10)</th>
                            <th class="result">Total</th>
                            <th class="result">Grand Total</th>
                            <th class="remarks">Remarks( If any)</th>
                        </tr>
                    </thead>
                    <tbody>
                         
                        ${filteredCandidates?.map((candidate, index) => `
                                <tr style="background-color: #e6f2ff;">
                                    <td class="serial-cell">${index + 1}</td>
                                    <td class="candidate-cell"> ${candidate?.name} </td>
                                    <td>${data?.employee_name}</td>
                                    <td>${candidate?.rating_data?.job_match}</td>
                                    <td>${candidate?.rating_data?.job_knowledge}</td>
                                    <td>${candidate?.rating_data?.creative_problem_solving}</td>
                                    <td>${candidate?.rating_data?.team_player}</td>
                                    <td>${candidate?.rating_data?.communication_skill}</td>
                                    <td>${candidate?.rating_data?.exposure_to_job_profile}</td>
                                    <td>${candidate?.rating_data?.total_rating}</td>
                                    <td>${candidate?.rating_data?.total_rating}</td>
                                    <td> ${candidate?.rating_data?.comment} </td>
                                </tr>
                            `
        ).join('')
            }

                    </tbody>
                </table>
              <div class="signature-section" style="margin-top: 20px;">
                <!-- First row: Name & Email -->
                <div class="signature-row">
                    <div class="signature-field">
                    <label class="signature-label">Name</label>
                    <div class="signature-input">
                        ${data?.employee_name || ''}
                    </div>
                    </div>
                    <div class="signature-field">
                    <label class="signature-label">Email ID</label>
                    <div class="signature-input">
                        ${data?.employee_email || ''}
                    </div>
                    </div>
                </div>

                <!-- Second row: Designation & Signature -->
                <div class="signature-row">
                    <div class="signature-field">
                    <label class="signature-label">Designation</label>
                    <div class="signature-input">
                        ${data?.employee_designation || ''}
                    </div>
                    </div>
                    <div class="signature-field">
                    <label class="signature-label">Signature</label>
                    <div class="" style="height:60px; width:100px;">
                        ${data?.employee_signature
                ? `<img src="${data.employee_signature}" crossOrigin="anonymous" alt="Signature" style="height:50px; width:100%"/>`
                :  'N/A'}
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </body>
        </html>
        `;
        return html;
    }

    const handlePrint = (data) => {
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(makeDynamicHTML(data, checkedCandidates));
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 400);
    };

    // State & handlers for Update Designation dialog
    const [designationDialogOpen, setDesignationDialogOpen] = useState(false);
    const [designationInput, setDesignationInput] = useState('');
    const [printTargetData, setPrintTargetData] = useState(null);

    const openDesignationDialog = (data) => {
        setPrintTargetData(data);
        setDesignationInput(data?.employee_designation || '');
        setDesignationDialogOpen(true);
    };

    const handleDialogPrint = (useUpdated = false) => {
        setDesignationDialogOpen(false);
        const dataToPrint = useUpdated && printTargetData ? { ...printTargetData, employee_designation: designationInput } : printTargetData;
        // fallback to current candidates if something missing
        handlePrint(dataToPrint || candidates);
    };


    return (
        <Card sx={{ width: '100%' }}>

            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

                <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    <Box sx={{
                        borderRight: 1,
                        borderColor: 'divider',
                        width: '160px', // smaller sidebar
                        minWidth: '120px', // allow even smaller
                        overflowY: 'auto',
                        pr: 0.5,
                        mr: 1
                    }}>
                        <Tabs
                            orientation="vertical"
                            value={selectedId}
                            onChange={handleInterviewerChange}
                            sx={{
                                '& .MuiTabs-indicator': { left: 0, width: '3px' },
                                '& .MuiTab-root': {
                                    alignItems: 'flex-start',
                                    textTransform: 'none',
                                    py: 1.2, // increase vertical padding for height
                                    minHeight: 48, // increased min height for better look
                                    fontSize: '12px',
                                    textAlign: 'left',
                                    px: 0.5,
                                }
                            }}
                        >
                            {scoreDetails && scoreDetails.map((rec) => (
                                <Tab
                                    key={rec.employee_doc_id}
                                    value={rec.employee_doc_id}
                                    icon={
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', minWidth: 0, marginLeft: '5px' }}>
                                            <Avatar sx={{ bgcolor: '#34209b', width: 24, height: 24, fontSize: '13px', mr: 1 }}>{rec.employee_name.charAt(0)}</Avatar>
                                        </Box>
                                    }
                                    iconPosition="start"
                                    label={
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', lineHeight: 1.1 }}>
                                                {rec.employee_name} , ({rec.employee_code})
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px', lineHeight: 1 }}>
                                                {rec.employee_email}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px', lineHeight: 1 }}>
                                                {rec.employee_mobile_no}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{
                                        minHeight: 'auto',
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        '&.Mui-selected': {
                                            backgroundColor: deepPurple[50],
                                            fontWeight: 'bold'
                                        },
                                        pl: 0.5, // ensure icon starts at left
                                        pr: 0.5,
                                        gap: 0.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                    }}
                                />
                            ))}
                        </Tabs>
                    </Box>

                    {/* Right: Scores Table */}
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                        {/* Table */}
                        <TableContainer component={Paper} sx={{
                            flex: 1, boxShadow: 2, minHeight: 200,
                            maxHeight: 350,
                        }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#34209b' }}>
                                        <TableCell padding="checkbox" sx={{ backgroundColor: '#34209b', textAlign: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={isAllChecked}
                                                ref={el => { if (el) el.indeterminate = isIndeterminate; }}
                                                onChange={handleCheckAll}
                                                style={{ width: 14, height: 14 }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '10px', color: '#fff', backgroundColor: '#34209b' }}>Sr. No</TableCell>
                                        <TableCell sx={{ fontSize: '10px', color: '#fff', backgroundColor: '#34209b' }}>Candidate</TableCell>
                                        <TableCell sx={{ fontSize: '10px', color: '#fff', backgroundColor: '#34209b' }}>Job Match (5)</TableCell>
                                        <TableCell sx={{ fontSize: '10px', color: '#fff', backgroundColor: '#34209b' }}>Knowledge (20)</TableCell>
                                        <TableCell sx={{ fontSize: '10px', color: '#fff', backgroundColor: '#34209b' }}>Problem Solving (10)</TableCell>
                                        <TableCell sx={{ fontSize: '10px', color: '#fff', backgroundColor: '#34209b' }}>Team Player (5)</TableCell>
                                        <TableCell sx={{ fontSize: '10px', color: '#fff', backgroundColor: '#34209b' }}>Communication (10)</TableCell>
                                        <TableCell sx={{ fontSize: '10px', color: '#fff', backgroundColor: '#34209b' }}>Exposure (10)</TableCell>
                                        <TableCell sx={{ fontSize: '10px', color: '#fff', backgroundColor: '#34209b' }}>Total</TableCell>
                                        {/* <TableCell sx={{ fontSize: '10px', color: '#fff', backgroundColor: '#34209b' }}>Grand Total</TableCell>
                                        <TableCell sx={{ fontSize: '10px', color: '#fff', backgroundColor: '#34209b' }}>Remarks</TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {candidates && candidates?.candidate_list && candidates?.candidate_list?.map((cand, idx) => {
                                        return (
                                            <TableRow key={cand?._id} hover sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                                <TableCell padding="checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={checkedCandidates.includes(cand._id)}
                                                        onChange={() => handleCheckCandidate(cand._id)}
                                                        style={{ width: 14, height: 14 }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ fontSize: '10px' }}>{idx + 1}</TableCell>
                                                <TableCell sx={{ width: '220px', maxWidth: '220px', overflow: 'visible', fontSize: '10px' }}>
                                                    <Tooltip
                                                        title={
                                                            <Box>
                                                                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '11px', color: '#f5f5f5' }}>{cand.name}</Typography>
                                                                <Typography variant="caption" sx={{ fontSize: '10px' }}>Applied Job: {cand.job_name}</Typography><br />
                                                                <Typography variant="caption" sx={{ fontSize: '10px' }}>Mobile: {cand.mobile_no}</Typography><br />
                                                                <Typography variant="caption" sx={{ fontSize: '10px' }}>Email: {cand.email}</Typography>
                                                            </Box>
                                                        }
                                                        arrow
                                                        placement="bottom"
                                                        componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    bgcolor: '#34209b',
                                                                    color: 'white',
                                                                    fontSize: '0.85rem',
                                                                    padding: '8px 12px',
                                                                    borderRadius: '4px',
                                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                                    '& .MuiTooltip-arrow': {
                                                                        color: '#34209b',
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        <Box>
                                                            <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '11px' }}>{cand.name}</Typography>
                                                            <Typography variant="caption" sx={{ fontSize: '10px' }}>{cand.email}</Typography>
                                                        </Box>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell sx={{ fontSize: '10px' }}>{cand?.rating_data?.job_match}</TableCell>
                                                <TableCell sx={{ fontSize: '10px' }}>{cand?.rating_data?.job_knowledge}</TableCell>
                                                <TableCell sx={{ fontSize: '10px' }}>{cand?.rating_data?.creative_problem_solving}</TableCell>
                                                <TableCell sx={{ fontSize: '10px' }}>{cand?.rating_data?.team_player}</TableCell>
                                                <TableCell sx={{ fontSize: '10px' }}>{cand?.rating_data?.communication_skill}</TableCell>
                                                <TableCell sx={{ fontSize: '10px' }}>{cand?.rating_data?.exposure_to_job_profile}</TableCell>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '10px' }}>{cand?.rating_data?.total_rating}</TableCell>
                                                {/* <TableCell sx={{ fontWeight: 600, fontSize: '10px' }}>{cand?.rating_data?.rating}</TableCell>
                                                <TableCell sx={{ fontSize: '10px' }}>{cand.state}</TableCell> */}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {checkedCandidates.length > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                                <Tooltip
                                    title="Print Sheet"
                                    arrow
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: '#34209b',
                                                color: 'white',
                                                fontSize: '0.85rem',
                                                padding: '8px 12px',
                                                borderRadius: '4px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                '& .MuiTooltip-arrow': {
                                                    color: '#34209b',
                                                },
                                            },
                                        },
                                    }}
                                >
                                    <IconButton
                                        onClick={() => openDesignationDialog(candidates)}
                                        aria-label="Print"
                                        sx={{
                                            bgcolor: 'rgba(25, 118, 210, 0.08)',
                                            '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.15)' },
                                            color: '#34209b',
                                            boxShadow: 2,
                                        }}
                                    >
                                        <PrintIcon sx={{ color: '#34209b', fontSize: 22 }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                        {/* Update Designation Dialog */}
                        <Dialog open={designationDialogOpen} onClose={() => setDesignationDialogOpen(false)}>
                            <DialogTitle>Update Designation?</DialogTitle>
                            <DialogContent>
                                <Typography variant="body2" sx={{ mb: 1 }}>Edit designation to appear on the printed sheet.</Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={designationInput}
                                    onChange={(e) => setDesignationInput(e.target.value)}
                                    placeholder="Designation"
                                />
                            </DialogContent>
                            <DialogActions>
                                {/* <Button onClick={() => { setDesignationDialogOpen(false); handlePrint(printTargetData || candidates); }} size="small">Print without update</Button> */}
                                <Button onClick={() => handleDialogPrint(true)} variant="contained" size="small">Print</Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Box>

            </CardContent>

        </Card>
    );
};

export default ScoreComparisonSheet;