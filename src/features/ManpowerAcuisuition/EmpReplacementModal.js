import React, { useEffect, useMemo, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Grid,
    Tooltip,
    Popover,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Chip,
    CircularProgress
} from '@mui/material';
import { Edit, Save, Cancel, Add, Delete, CheckCircle, Send, CancelOutlined } from '@mui/icons-material';
import { AsyncPaginate } from 'react-select-async-paginate';
import { useDispatch } from 'react-redux';
import { GetEmployeeListDropDownScroll } from '../slices/EmployeeSlices/EmployeeSlice';
import { toast } from 'react-toastify';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import axios from 'axios';


const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#D2C9FF',
        },
        height: '44px',
    }),
    menu: (provided) => ({
        ...provided,
        borderTop: '1px solid #D2C9FF',
        zIndex: 4,
    }),
    option: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid #D2C9FF',
        color: state.isSelected ? '#fff' : '#000',
        backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#80CBC4' : provided.backgroundColor,
        '&:hover': {
            backgroundColor: '#80CBC4',
            color: '#fff',
        },
    }),
};

const EmployeeReplacementModal = ({ open, setOpen, data, setModalData, handleSaveAndClose }) => {
    //   const [open, setOpen] = useState(true);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [priority, setPriority] = useState(1);
    const [editPriorityId, setEditPriorityId] = useState(null);
    const [tempPriority, setTempPriority] = useState('');
    const dispatch = useDispatch();
    const [staticDesignation, setStaticDesignation] = useState('');
    const [hasChanges, setHasChanges] = useState(false);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
    const [sendingEmailLoading, setSendingEmailLoading] = useState('');
    const userDetails = useMemo(() => {
        return JSON.parse(localStorage.getItem('admin_role_user')) || {}
    }, [])


    const [deleteAnchorEl, setDeleteAnchorEl] = useState(null);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    const handleDeleteClick = (event, empId) => {
        setDeleteAnchorEl(event.currentTarget);
        setEmployeeToDelete(empId);
    };

    const handleDeleteConfirm = () => {
        if (employeeToDelete) {
            let RemovedRecords = data?.activity_data?.filter((item) => item?.designation !== employeeToDelete.designation);
            setModalData(prev => ({ ...prev, activity_data: RemovedRecords }))
            setDeleteAnchorEl(null);
            setEmployeeToDelete(null);
            setHasChanges(true);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteAnchorEl(null);
        setEmployeeToDelete(null);
    };

    const handleAddEmployee = () => {
        if (!selectedEmployee) return toast.warn("Please Select the Replacement Employee");
        if (!staticDesignation) return toast.warn("Please Select the Replacement Designation");
        if (!priority) return toast.warn("Please Add the Valid Priority ( should be Greater Than 0 )");
        setHasChanges(true);

        let matchFound = false;

        let UpdatedRecords = data?.activity_data?.map((item) => {
            if (item.designation === staticDesignation) {
                matchFound = true;
                return {
                    ...item,
                    name: selectedEmployee.label,
                    designation: staticDesignation,
                    priority: priority,
                    employee_designation: selectedEmployee?.designation,
                    employee_doc_id: selectedEmployee?.value
                };
            } else {
                return item;
            }
        });

        if (!matchFound) {
            UpdatedRecords.push({
                name: selectedEmployee.label,
                designation: staticDesignation,
                priority: priority,
                employee_designation: selectedEmployee?.designation,
                employee_doc_id: selectedEmployee?.value
            });
        }

        console.log(UpdatedRecords, 'UpdatedRecords');

        setModalData(prev => ({ ...prev, activity_data: UpdatedRecords }))
        setSelectedEmployee('');
        setStaticDesignation('');
        setPriority(1);
        handleSaveAndClose('NO' , {...data, activity_data: UpdatedRecords});
    };

    useEffect(() => {
        return () => {
            setSelectedEmployee('');
            setStaticDesignation('');
            setPriority(1);
            setEditPriorityId(null)
            setTempPriority(null)
            setHasChanges(false)
            setShowSaveConfirmation(false)
        }
    }, [open])

    const handleEditPriority = (id, currentPriority) => {
        setEditPriorityId(id);
        setTempPriority(currentPriority);
    };

    const handleSavePriority = (emp) => {

        setHasChanges(true);

        let UpdatedRecords = data?.activity_data?.map((item) => {
            if (item.designation === emp.designation) {
                // Update matching item with new values
                return {
                    ...item,
                    priority: tempPriority,
                };
            } else {
                return item;
            }
        });

        setModalData(prev => ({ ...prev, activity_data: UpdatedRecords }))

        setEditPriorityId(null);
        setTempPriority('')
    };

    const handleCloseEditModal = () => {
        if (hasChanges) {
            setShowSaveConfirmation(true);
        } else {
            setOpen(false)
        }
    };

    const HandleSendSingleMPR = async (empDoc = '', type) => {
        if (!data) {
            toast.error('Internal Server Error contact to developers');
            return
        }

        console.log(data, 'this is Data');
        try {
            setSendingEmailLoading(empDoc)
            let paylods = {
                "mpr_doc_id": data?._id,
                "project_id": data?.project_id,
                "employee_doc_id": empDoc,
                "add_by_name": userDetails?.name,
                "add_by_mobile": userDetails?.mobile_no,
                "add_by_designation": userDetails?.designation,
                "add_by_email": userDetails?.email
            }
            let response = await axios.post(`${config.API_URL}${empDoc === 'CEO' ? 'sendRequisitionApprovalEmailToCeo' : 'sendRequisitionApprovalEmailToSingleEmployee'}`, paylods, apiHeaderToken(config.API_TOKEN))
            if (response.status === 200) {
                toast.success(response?.data?.message);
            } else {
                toast.error(response?.data?.message)
            }
        } catch (error) {
            const apiMessage = error?.response?.data?.message;

            // normalize into a string:
            let text;
            if (typeof apiMessage === 'string') {
                text = apiMessage;
            } else if (apiMessage && typeof apiMessage === 'object') {
                // try a few common fields, or fall back to the first value
                text =
                    apiMessage.error ||
                    apiMessage.detail ||
                    Object.values(apiMessage).find(v => typeof v === 'string') ||
                    JSON.stringify(apiMessage);
            } else {
                text = error?.message;
            }

            toast.error(text || 'Something went wrong');

        } finally {
            setSendingEmailLoading('')
        }
    }

    const handleCancelEdit = () => {
        setEditPriorityId(null);
        setTempPriority('')
    };

    const projectLoadOptionPageNations = async (inputValue, loadedOptions, { page }) => {
        const payload = {
            keyword: inputValue,
            page_no: page.toString(),
            per_page_record: "10",
            scope_fields: ["employee_code", "name", "email", "mobile_no", "_id", 'designation'],
            profile_status: "Active"
        };

        const result = await dispatch(GetEmployeeListDropDownScroll(payload)).unwrap();

        return {
            options: result, // must be array of { label, value } objects
            hasMore: result.length >= 10, // if true, next page will load
            additional: {
                page: page + 1
            }
        };
    };

    const handleEmployeeChanges = (option) => {
        setSelectedEmployee(option)
    }

    const nonApproved = useMemo(() => {
        return data?.activity_data?.filter(emp => emp && !['Approved' , 'Reject'].includes(emp.status)) || [];
    }, [data?.activity_data]);

    const minPriority = useMemo(() => {
        if (nonApproved.length === 0) return 1; // Default to 1 if no non-approved employees
        return Math.min(...nonApproved.map(emp => Number(emp.priority) || Infinity));
    }, [nonApproved]);



    return (
        <>
            <Modal open={open}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 900,
                    maxHeight: '97vh',
                    overflow: 'auto',   // This will add scrollbars when content overflows
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2
                }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
                        Setup MPR Approval Level
                    </Typography>

                    {/* Employee Selection Section */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>

                        <Grid item xs={5}>
                            <AsyncPaginate
                                placeholder="Select Employee"
                                value={selectedEmployee}
                                loadOptions={projectLoadOptionPageNations}
                                onChange={handleEmployeeChanges}
                                debounceTimeout={300}
                                isClearable
                                styles={customStyles}
                                additional={{
                                    page: 1
                                }}
                                classNamePrefix="react-select"
                            />
                        </Grid>

                        <Grid item xs={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="designation-label">Designation</InputLabel>
                                <Select
                                    labelId="designation-label"
                                    id="designation-select"
                                    value={staticDesignation}
                                    label="Designation"
                                    onChange={(e) => setStaticDesignation(e.target.value)}
                                >
                                    {/* <MenuItem value="CEO">CEO</MenuItem> */}
                                    <MenuItem value="HR">HR</MenuItem>
                                    <MenuItem selected value="HOD">HOD</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={2}>
                            <TextField
                                label="Priority"
                                type="text"
                                value={priority}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (!isNaN(value)) {
                                        setPriority(value);
                                    }
                                }}
                                fullWidth
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={2}>
                            <Button
                                variant="contained"
                                onClick={handleAddEmployee}
                                fullWidth
                                startIcon={<Add />}
                                size="small"
                                sx={{ height: 40 }}
                            >
                                ADD
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Employee Listing Table */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Employee List
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxHeight: 300, overflow: 'auto' }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#34209b', color: '#fff' }}>Sr.No</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#34209b', color: '#fff' }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#34209b', color: '#fff' }}>Designation</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#34209b', color: '#fff' }}>Priority</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#34209b', color: '#fff' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data && Array.isArray(data?.activity_data) && data?.activity_data?.filter((item) => item !== null).sort((a, b) => {
                                    const priorityA = Number(a?.priority) || Infinity;
                                    const priorityB = Number(b?.priority) || Infinity;
                                    return priorityA - priorityB;
                                })?.map((emp, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{emp.name}</TableCell>
                                        <TableCell>{emp.designation}</TableCell>
                                        <TableCell>
                                            {editPriorityId === index ? (
                                                <TextField
                                                    type="text"
                                                    value={tempPriority}
                                                    onChange={(e) => {
                                                        const value = Number(e.target.value);
                                                        if (!isNaN(value)) {
                                                            setTempPriority(value);
                                                        }
                                                    }}
                                                    inputProps={{ min: 1 }}
                                                    size="small"
                                                    sx={{ width: 70 }}
                                                    autoFocus
                                                />
                                            ) : (
                                                emp.priority || "0"
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editPriorityId === index ? (
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <Tooltip
                                                        title="Save Priority"
                                                        arrow
                                                        placement="bottom"
                                                        componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    bgcolor: 'primary.main',
                                                                    color: 'common.white',
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleSavePriority(emp)}
                                                            color="primary"
                                                            sx={{
                                                                p: 0.5,
                                                                // Force color inheritance to child SVG
                                                                '& .MuiSvgIcon-root': {
                                                                    color: 'inherit !important'
                                                                }
                                                            }}
                                                        >
                                                            <Save fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip
                                                        title="Cancel Edit"
                                                        arrow
                                                        placement="bottom"
                                                        componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    bgcolor: 'error.main',
                                                                    color: 'common.white',
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            onClick={handleCancelEdit}
                                                            color="error"
                                                            sx={{
                                                                p: 0.5,
                                                                // Force color inheritance to child SVG
                                                                '& .MuiSvgIcon-root': {
                                                                    color: 'inherit !important'
                                                                }
                                                            }}
                                                        >
                                                            <Cancel fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            ) : (
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>

                                                    {
                                                        sendingEmailLoading === emp?.employee_doc_id ?
                                                            <Tooltip
                                                                title="Sending Email..."
                                                                arrow
                                                                placement="bottom"
                                                                componentsProps={{
                                                                    tooltip: {
                                                                        sx: {
                                                                            bgcolor: 'info.main',
                                                                            color: 'common.white',
                                                                        },
                                                                    },
                                                                }}
                                                            >
                                                                <IconButton
                                                                    size="small"
                                                                    sx={{ p: 0.5 }}
                                                                >
                                                                    <CircularProgress
                                                                        size={18}
                                                                        thickness={5}
                                                                        color="inherit"    // will pick up the IconButton’s color
                                                                    />
                                                                </IconButton>
                                                            </Tooltip> : null
                                                    }

                                                    {
                                                        !sendingEmailLoading && emp?.type !== 'raised' && emp?.designation !== 'CEO' && !['Approved' , 'Reject'].includes(emp.status) &&
                                                        <Tooltip
                                                            title="Edit Priority"
                                                            arrow
                                                            placement="bottom"
                                                            componentsProps={{
                                                                tooltip: {
                                                                    sx: {
                                                                        bgcolor: 'info.main',
                                                                        color: 'common.white',
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            <IconButton
                                                                size="small"
                                                                sx={{ p: 0.5 }}
                                                                onClick={() => handleEditPriority(index, emp.priority)}
                                                            >
                                                                <Edit fontSize="small" color="info" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }

                                                    {
                                                        !sendingEmailLoading && emp?.designation !== 'CEO' && !['Approved' , 'Reject'].includes(emp.status) &&
                                                        <Tooltip
                                                            title="Delete Employee"
                                                            arrow
                                                            placement="bottom"
                                                            componentsProps={{
                                                                tooltip: {
                                                                    sx: {
                                                                        bgcolor: 'error.main',
                                                                        color: 'common.white',
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            <IconButton
                                                                size="small"
                                                                sx={{ p: 0.5 }}
                                                                onClick={(e) => handleDeleteClick(e, emp)}
                                                            >
                                                                <Delete fontSize="small" color="error" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }


                                                    {
                                                        emp?.designation !== 'CEO' && emp?.employee_doc_id && !sendingEmailLoading && !['Approved' , 'Reject'].includes(emp.status) && Number(emp.priority) === minPriority &&
                                                        <Tooltip
                                                            title="Send Email"
                                                            arrow
                                                            placement="bottom"
                                                            componentsProps={{
                                                                tooltip: {
                                                                    sx: {
                                                                        bgcolor: 'info.main',
                                                                        color: 'common.white',
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            <IconButton
                                                                size="small"
                                                                sx={{ p: 0.5 }}
                                                                onClick={() => HandleSendSingleMPR(emp?.employee_doc_id)}
                                                            >
                                                                <Send
                                                                    fontSize="small"
                                                                    color={Number(emp.priority) <= 2 ? "primary" : "info"} // blue for high priority
                                                                />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }

                                                    {
                                                        emp?.designation === 'CEO' && !sendingEmailLoading && !['Approved' , 'Reject'].includes(emp.status) && Number(emp.priority) === minPriority &&
                                                        <Tooltip
                                                            title="Send Email to CEO Sir."
                                                            arrow
                                                            placement="bottom"
                                                            componentsProps={{
                                                                tooltip: {
                                                                    sx: {
                                                                        bgcolor: 'info.main',
                                                                        color: 'common.white',
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            <IconButton
                                                                size="small"
                                                                sx={{ p: 0.5 }}
                                                                onClick={() => HandleSendSingleMPR(emp.designation)}
                                                            >
                                                                <Send
                                                                    fontSize="small"
                                                                    color={Number(emp.priority) <= 2 ? "primary" : "info"} // blue for high priority
                                                                />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }

                                                    {['Approved' , 'Reject'].includes(emp.status) && (
                                                        <Chip
                                                            label={emp.status}
                                                            icon={emp.status === 'Approved' ? <CheckCircle /> : <CancelOutlined />}
                                                            color={emp.status === 'Approved' ? 'success' : 'error'}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    )}

                                                </Box>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {data && Array.isArray(data?.activity_data) && data?.activity_data.length === 0 && (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 100,
                            border: '1px dashed #ccc',
                            borderRadius: 1,
                            mt: 1
                        }}>
                            <Typography variant="body2" color="textSecondary">
                                No employees added yet
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ minWidth: 100 }}
                            onClick={() => {
                                if (!hasChanges) {
                                    return setOpen(false)
                                } else {
                                    handleSaveAndClose('' , data)
                                }
                            }}
                        >
                            Save
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => handleCloseEditModal()}
                            sx={{ minWidth: 100 }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>

            </Modal>

            <Popover
                open={Boolean(deleteAnchorEl)}
                anchorEl={deleteAnchorEl}
                onClose={handleDeleteCancel}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Are you sure you want to delete this employee?
                    </Typography>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteConfirm}
                        sx={{ mr: 1 }}
                    >
                        Delete
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleDeleteCancel}
                    >
                        Cancel
                    </Button>
                </Box>
            </Popover>

            {/* Unsaved Changes Confirmation */}
            <Dialog open={showSaveConfirmation} onClose={() => setShowSaveConfirmation(false)}>
                <DialogTitle>Unsaved Changes</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You have unsaved changes. Do you want to save them before closing?
                        <br />
                        <strong>If you close without saving, your changes will be lost.</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowSaveConfirmation(false)}>Cancel</Button>
                    <Button onClick={() => {
                        setShowSaveConfirmation(false)
                        setOpen(false)
                    }}
                        color="error">
                        Close Without Saving
                    </Button>
                    <Button onClick={() => handleSaveAndClose('' , data)} variant="contained" color="primary">
                        Save and Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EmployeeReplacementModal;