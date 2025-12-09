import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Tooltip, IconButton, useTheme, Typography, Chip, Grid } from '@mui/material';
import { Delete, CheckCircle } from '@mui/icons-material';
import { useMemo } from 'react';
import moment from 'moment';
import { motion } from 'framer-motion';


export default function ApprovalDataDataGrid({ ApprovalData, status, loading }) {
    const theme = useTheme();

    const userDetails = useMemo(() => {
        return JSON.parse(localStorage.getItem('employeeLogin')) || {};
    }, [])

    const rows = useMemo(() => {
        return ApprovalData ? ApprovalData.map((record, index) => {
            return {
                id: index + 1,
                approvalNumber: record?.approval_note_id,
                project: record,
                department: record?.department_name,
                openingType: record?.mpr_fund_type,
                vacancies: record?.no_of_candidates,
                dateSent: moment(record?.add_date).format("DD/MM/YYYY"),
            }
        }) : []
    }, [ApprovalData])


    const handleRedirectOnApprovalPage = (e, data) => {
        e.preventDefault();
        const CombineStringApprove = `${data?._id}|${userDetails?._id}|${userDetails?.token}`;

        const encodedToken = btoa(CombineStringApprove);
        setTimeout(() => {
            const url = `/offerApprovalForm/${encodedToken}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        }, 1000);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: ({ id, row }) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {
                        status === 'Approved' ?
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Chip label="Approved" color="success" size="small" />
                            </motion.div>
                            : (
                                <>
                                    <Tooltip
                                        title={row.status === 'Approved' ? 'Already Approved' : 'Approve'}
                                        arrow
                                        componentsProps={{
                                            tooltip: {
                                                sx: {
                                                    backgroundColor: row.status === 'Approved'
                                                        ? theme.palette.grey[500]
                                                        : theme.palette.success.main,
                                                    fontSize: '0.8rem',
                                                }
                                            },
                                            arrow: {
                                                sx: {
                                                    color: row.status === 'Approved'
                                                        ? theme.palette.grey[500]
                                                        : theme.palette.success.main,
                                                }
                                            }
                                        }}
                                    >
                                        <span>
                                            <IconButton
                                                size="medium"
                                                disabled={row.status === 'Approved'}
                                                onClick={(e) => handleRedirectOnApprovalPage(e, row?.project)}
                                                sx={{
                                                    transition: 'transform 0.3s',
                                                    '&:hover': row.status !== 'Approved'
                                                        ? { transform: 'scale(1.2)', backgroundColor: 'rgba(76,175,80,0.1)' }
                                                        : {},
                                                }}
                                            >
                                                <CheckCircle
                                                    fontSize="medium"
                                                    sx={{
                                                        color: row.status === 'Approved'
                                                            ? theme.palette.grey[500]
                                                            : theme.palette.success.main,
                                                    }}
                                                />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </>
                            )
                    }
                </Box>
            )
        },
        { field: 'approvalNumber', headerName: 'Approval ID', width: 250, renderCell: (params) => (
            <Typography variant="body2" sx={{ 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap',
                maxWidth: '100%'
            }}>
                {params.value}
            </Typography>
        ) },
        {
            field: 'project',
            headerName: 'Project / Designations',
            width: 240,
            renderCell: (params) => {
                const { project_name, job_designation: designation_name } = params.row?.project;
                return (
                    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 'bold',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                width: '100%',
                                minWidth: 0
                            }}
                        >
                            {project_name}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                width: '100%',
                                minWidth: 0
                            }}
                        >
                            {Array.isArray(designation_name) ? designation_name.join(', ') : designation_name}
                        </Typography>
                    </Box>
                );
            }
        },
        { field: 'vacancies', headerName: 'No Of Candidate', width: 150 , renderCell: (params) => (
            <Typography variant="body2" sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%'
            }}>
                {params.value}
            </Typography>
        ) },
        { field: 'dateSent', headerName: 'Added Date And Time', width: 200, renderCell: (params) => (
            <Typography variant="body2" sx={{ 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap',
                maxWidth: '100%'
            }}>
                {params.value}
            </Typography>
        ) }
    ];

    return (
        <Box sx={{ height: 450, width: '100%' }}>
            <DataGrid
                rows={rows || []}
                columns={columns}
                initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                pageSizeOptions={[5, 10, 20, 40, 50]}
                pagination
                rowHeight={80}
                loading={loading}
                components={{ Toolbar: GridToolbar }}
                sx={{
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#34209b',
                        color: '#fff',
                    },
                }}
            />
        </Box>
    );
}
