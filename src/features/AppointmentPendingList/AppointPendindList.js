import * as React from 'react';
import { useEffect } from 'react';
import {
    Box,
    Stack,
    Typography,
    Tooltip,
    IconButton,
    Chip,
    Skeleton,
    TextField,
    useTheme,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from 'react-toastify';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import GoBackButton from '../goBack/GoBackButton';
import { CamelCases, CustomChangesJobType } from '../../utils/common';
import axios from 'axios';
import SearchInput from '../CeoDashboard/SearchBox';

function StatusChip({ value }) {
    const colorMap = {
        Pending: 'warning',
        Approved: 'success',
        Rejected: 'error',
    };

    // Handle case where value might be an object
    let statusValue = value;
    if (typeof value === 'object' && value !== null) {
        statusValue = value.status || value.appointment_letter_verification_status || 'Pending';
    }

    return <Chip label={statusValue} color={colorMap[statusValue] || 'default'} variant="soft" />;
}


export default function AppointmentApprovalAdmin() {
    const [rows, setRows] = React.useState([]);
    const [activeRow, setActiveRow] = React.useState(null);
    const [search, setSearch] = React.useState('');
    const [remarkModalOpen, setRemarkModalOpen] = React.useState(false);
    const [currentRowId, setCurrentRowId] = React.useState(null);
    const [currentAction, setCurrentAction] = React.useState(null); // 'approve' or 'reject'
    const [remarkText, setRemarkText] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const theme = useTheme();
    const [approvalData, setApprovalData] = React.useState(null);

    const getPendingCandidatesList = async () => {
        try {
            setLoading(true);
            let payload = { "page_no": "1", "per_page_record": "1000", "keyword": "" }
            const response = await axios.post(`${config.API_URL}getCandidateAppointmentEmailList`, payload, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200 && Array.isArray(response.data?.data)) {
                // setRows(response.data);
                setApprovalData(response.data?.data)
                console.log('Fetched pending candidates:', response.data);

            } else {
                console.error('Unexpected response format:', response);
                setApprovalData(null);
            }
        } catch (error) {
            console.error('Error fetching pending candidates:', error);
            setApprovalData(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getPendingCandidatesList();
    }, []);

    const updateStatus = (id, status, row) => {
        // Instead of directly updating, open remark modal with action context
        setCurrentRowId(id);
        setCurrentAction(status.toLowerCase()); // 'approve' or 'reject'
        setActiveRow(row);
        setRemarkText(''); // Clear previous remark
        setRemarkModalOpen(true);
    };

    const openRemarkModal = (rowId, currentRemark = '', action = null) => {
        setCurrentRowId(rowId);
        setCurrentAction(action);
        setRemarkText(currentRemark);
        setRemarkModalOpen(true);
    };

    const closeRemarkModal = () => {
        setRemarkModalOpen(false);
        setCurrentRowId(null);
        setCurrentAction(null);
        setRemarkText('');
    };

    const saveRemark = async () => {
        if (!currentRowId || !currentAction || !activeRow) return;
        try {
            // Here you would make the actual API call for approve/reject
            const response = await axios.post(`${config.API_URL}approveRejectAppointmentLetter`, {
                candidate_id: activeRow.cand_doc_id || activeRow.id,
                status: currentAction === 'approve' ? 'Approve' : 'Reject', // 'approve' or 'reject'
                remark: remarkText,
                approval_note_id: activeRow.approval_note_id,
                approval_note_doc_id: activeRow._id
            }, apiHeaderToken(config.API_TOKEN));

            if (response.status === 200) {
                // Refresh the data from server instead of updating local state
                await getPendingCandidatesList();
                toast.success(`${currentAction === 'approve' ? 'Approved' : 'Rejected'} successfully!`);
                closeRemarkModal();
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(error?.response?.data?.message || error?.message || 'Something went wrong');
        }
    };

    const filtered = React.useMemo(() => {
        if (!approvalData || !Array.isArray(approvalData)) return [];

        let filteredData = approvalData.map((item, index) => {
            return {
                id: index + 1,
                ...item
            }
        });

        if (!search) return filteredData;

        const q = search.toLowerCase();
        return filteredData.filter((r) =>
            [
                r.project_name,
                r.job_designation,
                r.approval_note_id,
                r.name,
                r.email,
                r.job_type,
                r.appointment_letter_verification_status,
            ]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q))
        );
    }, [approvalData, search]);

    const columns = React.useMemo(() => [
        { field: 'id', headerName: 'ID', width: 50 },
        {
            field: 'approval_note_id',
            headerName: 'Approval Note ID',
            width: 240,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center', height: '100%', width: '100%' }}>
                    <Tooltip title={params?.row?.approval_note_id || ''} arrow>
                        <a
                            href={`/approval-candidate-list/${params?.row?._id}`}
                            target='_blank'
                            style={{
                                textDecoration: "none",
                                display: "block",
                                maxWidth: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                color: "#1976d2",
                                whiteSpace: "nowrap"
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 600,
                                    width: "100%",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    color: "#1976d2 !important",
                                    cursor: "pointer"
                                }}
                            >
                                {params?.row?.approval_note_id || ''}
                            </Typography>
                        </a>
                    </Tooltip>
                    <Tooltip title={CamelCases(params?.row?.mpr_offer_type) || ''} arrow>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {CamelCases(params?.row?.mpr_offer_type) || ''}
                        </Typography>
                    </Tooltip>
                </Box>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => <StatusChip value={params?.row?.appointment_letter_verification_status || ''} />,
        },
        {
            field: 'project_name',
            headerName: 'Project Name / Designation',
            width: 280,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center', height: '100%', width: '100%' }}>
                    <Tooltip title={params?.row?.project_name || ''} arrow>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {params?.row?.project_name || ''}
                        </Typography>
                    </Tooltip>
                    <Tooltip title={params?.row?.job_designation || ''} arrow>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {params?.row?.job_designation || ''}
                        </Typography>
                    </Tooltip>
                </Box>
            ),
        },
        {
            field: 'name',
            headerName: 'Candidate Details',
            width: 250,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center', height: '100%', width: '100%' }}>
                    <Tooltip title={params?.row?.name || ''} arrow>
                        <a
                            href={`candidate-profile/${params?.row?.cand_doc_id}?job_id=${params?.row?.job_id}`}
                            target='_blank'
                            style={{
                                textDecoration: "none",
                                display: "block",
                                maxWidth: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                color: "#1976d2",
                                whiteSpace: "nowrap"
                            }}
                        >
                            <Typography
                                variant="subtitle2"

                                sx={{
                                    fontWeight: 600,
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    color: "#1976d2 !important",
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {params?.row?.name || ''}
                            </Typography>
                        </a>
                    </Tooltip>
                    <Tooltip title={params?.row?.email || ''} arrow>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {params?.row?.email || ''}
                        </Typography>
                    </Tooltip>
                    <Tooltip title={params?.row?.job_type || ''} arrow>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {CustomChangesJobType(params?.row?.job_type) || ''}
                        </Typography>
                    </Tooltip>
                </Box>
            ),
        },
        {
            field: 'job_title',
            headerName: 'Job Title',
            width: 300,
            renderCell: (params) => (
                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
                    <Tooltip title={params?.row?.job_title || ''} arrow placement="top">
                        <Typography
                            variant="body2"
                            sx={{
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer'
                            }}
                        >
                            {params?.row?.job_title || ''}
                        </Typography>
                    </Tooltip>
                </Box>
            ),
        },
    ], [approvalData, theme])

    // Skeleton loading component
    const SkeletonTable = () => (
        <Box sx={{ height: 440, width: '100%', bgcolor: 'background.paper', borderRadius: 2 }}>
            <DataGrid
                rows={[]}
                columns={columns}
                hideFooter
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                disableRowSelectionOnClick
                sx={{
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: theme.palette.primary.dark,
                        color: '#fff',
                    },
                    '& .MuiDataGrid-row': {
                        backgroundColor: 'transparent',
                    }
                }}
            />
            {/* Skeleton rows overlay */}
            <Box sx={{
                position: 'absolute',
                top: 57, // Height of header
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                zIndex: 1
            }}>
                {[...Array(3)].map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            height: 100,
                            px: 2,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            backgroundColor: 'background.paper'
                        }}
                    >
                        <Skeleton variant="text" width={50} height={20} />
                        <Box sx={{ mx: 2 }} flex={1}>
                            <Skeleton variant="circular" width={32} height={32} />
                            <Skeleton variant="circular" width={32} height={32} sx={{ ml: 1 }} />
                        </Box>
                        <Box sx={{ mx: 2, flex: 1 }}>
                            <Skeleton variant="text" width="80%" height={16} />
                            <Skeleton variant="text" width="60%" height={14} sx={{ mt: 0.5 }} />
                        </Box>
                        <Box sx={{ mx: 2, flex: 1 }}>
                            <Skeleton variant="text" width="90%" height={16} />
                            <Skeleton variant="text" width="70%" height={14} sx={{ mt: 0.5 }} />
                        </Box>
                        <Box sx={{ mx: 2, flex: 1 }}>
                            <Skeleton variant="text" width="85%" height={16} />
                            <Skeleton variant="text" width="65%" height={14} sx={{ mt: 0.5 }} />
                            <Skeleton variant="text" width="75%" height={14} sx={{ mt: 0.5 }} />
                        </Box>
                        <Box sx={{ mx: 2, flex: 1 }}>
                            <Skeleton variant="text" width="95%" height={16} />
                        </Box>
                        <Skeleton variant="rectangular" width={100} height={32} sx={{ mx: 2 }} />
                    </Box>
                ))}
            </Box>
        </Box>
    );

    return (
        <div className="maincontent">
            <div className="container">
                <GoBackButton />
                <div className="mb-4 d-flex justify-content-between">
                    <h3>Appointment Letter Approval(s)</h3>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }} alignItems="flex-end" justifyContent={'flex-end'}>
                        {/* <TextField
                        size="small"
                        label="Search"
                        placeholder="Search by project, candidate, email, status…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ minWidth: 250 }}
                    /> */}


                        <Box sx={{
                            maxWidth: 250,
                            minWidth: 250,
                        }}>
                            <SearchInput
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onClear={() => setSearch('')}
                            />
                        </Box>

                        <Button
                            variant="contained"
                            size="medium"
                            onClick={() => setSearch('')}
                            sx={{ ml: 2 }}
                            disabled={search === ''}
                        >
                            Reset
                        </Button>

                    </Stack>
                </div>


                <Box sx={{ height: 600, width: '100%', bgcolor: 'background.paper', borderRadius: 2, position: 'relative' }}>
                    {loading ? (
                        <SkeletonTable />
                    ) : (
                        <DataGrid
                            rows={filtered || []}
                            columns={columns}
                            pageSize={10}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 10 },
                                },
                            }}
                            pageSizeOptions={[5, 10, 20, 40, 50]}
                            rowHeight={80}
                            components={{ Toolbar: GridToolbar }}
                            disableRowSelectionOnClick
                            sx={{
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: theme.palette.primary.dark,
                                    color: '#fff',
                                },
                            }}
                        />
                    )}
                </Box>
                {/* Remark Modal */}
                <Dialog
                    open={remarkModalOpen}
                    onClose={closeRemarkModal}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        {currentAction === 'approve' ? 'Approve' : 'Reject'} Appointment Letter
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            {currentAction === 'approve'
                                ? 'Please provide a reason for approving this appointment letter:'
                                : 'Please provide a reason for rejecting this appointment letter:'}
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Remark / Reason"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={remarkText}
                            onChange={(e) => setRemarkText(e.target.value)}
                            placeholder={`Enter your reason for ${currentAction === 'approve' ? 'approving' : 'rejecting'} this appointment letter...`}
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeRemarkModal}>Cancel</Button>
                        <Button
                            onClick={saveRemark}
                            variant="contained"
                            color={currentAction === 'approve' ? 'success' : 'error'}
                            disabled={!remarkText.trim()}
                        >
                            {currentAction === 'approve' ? 'Approve' : 'Reject'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}
