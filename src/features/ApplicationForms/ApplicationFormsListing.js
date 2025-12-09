import React, { useState } from 'react';
// import GoBackButton from './';
import GoBackButton from '../goBack/GoBackButton.js';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';





export default function ApplicationFormListing() {
    const [show, setShow] = useState(false);


    const columns = [
        { field: 'id', headerName: 'S.No.', width: 80 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <div style={{ display: 'flex', gap: 8 }}>
                    <Tooltip title="Print" arrow componentsProps={{
                        tooltip: {
                            sx: {
                                bgcolor: '#1976d2',
                                color: 'white',
                                fontSize: '0.75rem',
                                '& .MuiTooltip-arrow': { color: '#1976d2' }
                            }
                        }
                    }}>
                        <IconButton size="small" onClick={() => window.print()}>
                            <PrintIcon sx={{ color: '#1976d2' }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit" arrow componentsProps={{
                        tooltip: {
                            sx: {
                                bgcolor: '#388e3c',
                                color: 'white',
                                fontSize: '0.75rem',
                                '& .MuiTooltip-arrow': { color: '#388e3c' }
                            }
                        }
                    }}>
                        <IconButton size="small" onClick={() => alert('Edit action')}>
                            <EditIcon sx={{ color: '#388e3c' }} />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        },
        { field: 'candidateName', headerName: 'Candidate Name', width: 180 },
        { field: 'appliedJob', headerName: 'Applied Job', width: 180 },
        { field: 'projectName', headerName: 'Project Name', width: 180 },
        { field: 'designation', headerName: 'Designation', width: 150 },
        { field: 'department', headerName: 'Department', width: 150 },
        { field: 'offerPost', headerName: 'Offer Post', width: 150 },
        { field: 'applicationForm', headerName: 'Application Form', width: 180 },
    ];

    const rows = [
        {
            id: 1,
            candidateName: 'John Doe',
            appliedJob: 'Software Engineer',
            projectName: 'HRMS Portal',
            designation: 'Developer',
            department: 'IT',
            offerPost: 'Full Time',
            applicationForm: 'Form A',
        },
        {
            id: 2,
            candidateName: 'Jane Smith',
            appliedJob: 'UI/UX Designer',
            projectName: 'Recruitment App',
            designation: 'Designer',
            department: 'Design',
            offerPost: 'Contract',
            applicationForm: 'Form B',
        },
        // Add more static rows as needed
    ];

    return (
        <>
            <div className="maincontent">
                <div className="container" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div class="dflexbtwn">
                        <div class="hrhdng">
                            <h2>Application Form Listing</h2>
                            <p></p>
                        </div>
                        {/* <div className='d-flex gap-2'>
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                defaultValue={option}
                                loadOptions={EmployeeLoadOption}
                                value={selectedOption}
                                onMenuOpen={EmplooyListOpenMenu}
                                placeholder="Choose Employee To Assign."
                                onChange={handleEmployeeChange}
                                classNamePrefix="react-select"
                                styles={customStyles}
                            />
                            <button className="bg_purplbtn" onClick={handleShow}>Add Asset</button>
                        </div> */}
                    </div>

                    <div className="d-flex justify-content-between align-items-end mb-4">
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            headerClassName="custom-header-class"
                            rowHeight={60}
                            pageSizeOptions={[10, 20, 40, 50, 80]}
                            disableRowSelectionOnClick
                            paginationMode="server"
                            sx={{ height: 400 }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
