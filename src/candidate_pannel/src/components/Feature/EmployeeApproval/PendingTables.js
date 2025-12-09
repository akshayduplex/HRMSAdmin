import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Tooltip, IconButton, useTheme, Grid, Typography, Chip } from '@mui/material';
import { Delete, CheckCircle, Pending, InfoOutlined, Cancel } from '@mui/icons-material';
import { useMemo } from 'react';
import { motion } from 'framer-motion';


export default function PendingApprovalsDataGrid({ approvalRecords, onDelete, onApprove, status }) {
    const theme = useTheme();

    const userDetails = useMemo(() => {
        return JSON.parse(localStorage.getItem('employeeLogin')) || {};
    }, [])

    const handleRedirectOnApprovalPage = (e, data) => {
        e.preventDefault();
        const CombineString = `${data._id}|${userDetails?.name}|HOD|${userDetails?.token}|${userDetails?.designation}|${userDetails?._id}`;
        const encodedToken = btoa(CombineString);
        setTimeout(() => {
            const url = `/mprFrm/${encodedToken}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        }, 1000);
    };


    const rows = useMemo(() => {
        return approvalRecords ? approvalRecords.map((record, index) => {
            return {
                id: index + 1,
                approvalNumber: record?.title,
                project: record,
                department: record?.department_name,
                duration: record?.project_duration,
                openingType: record?.fund_type,
                vacancies: record?.vacancy_frame,
                place: record?.place_of_posting
            }
        }) : []
    }, [approvalRecords])

    const columns = useMemo(() => {

        return [
            { field: 'id', headerName: 'ID', width: 70 },
            {
                field: 'actions',
                headerName: 'Actions',
                width: 140,
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
            { field: 'approvalNumber', headerName: 'Approval ID', width: 160 },
            {
                field: 'project',
                headerName: 'Project / Designations',
                width: 280,
                renderCell: (params) => {
                    const { project_name, designation_name } = params.row?.project;
                    return (
                        <Grid container direction="column" spacing={0.5}>
                            <Grid item>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    {project_name}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                    {Array.isArray(designation_name) ? designation_name.join(', ') : designation_name}
                                </Typography>
                            </Grid>
                        </Grid>
                    );
                }
            },
            { field: 'department', headerName: 'Department', width: 200 },
            { field: 'duration', headerName: 'Project Durations', width: 150 },
            { field: 'openingType', headerName: 'Opening Type', width: 130 },
            {
                field: 'place',
                headerName: 'Place of Posting',
                width: 180,
                renderCell: (params) => {
                    const locations = params.row.place || [];
                    const names = locations.map(loc => loc.location_name);
                    const first = names[0] || '';
                    const truncated = first.length > 20 ? first.slice(0, 20) + '...' : first;
                    return (
                        <Tooltip
                            title={names.join(', ')}
                            arrow
                            componentsProps={{
                                tooltip: { sx: { backgroundColor: theme.palette.info.dark, fontSize: '0.8rem' } },
                                arrow: { sx: { color: theme.palette.info.dark } }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'help' }}>
                                <Typography variant="body2" sx={{ color: theme.palette.text.primary, mr: 0.5 }}>
                                    {truncated}
                                </Typography>
                                <InfoOutlined fontSize="small" sx={{ color: theme.palette.info.main }} />
                            </Box>
                        </Tooltip>
                    );
                }
            },
            { field: 'vacancies', headerName: 'No Of Vacancy', width: 130, type: 'number' },
        ];

    }, [theme.palette.error.main, theme.palette.grey, theme.palette.info.dark, theme.palette.info.main, theme.palette.success.main, theme.palette.text.primary, theme.palette.text.secondary, status])

    return (
        <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
                rows={rows || []}
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
                sx={{
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: theme.palette.primary.dark,
                        color: '#fff',
                    },
                }}
            />
        </Box>
    );
}
