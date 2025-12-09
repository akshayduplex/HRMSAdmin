import React, { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AllHeaders from "../partials/AllHeaders";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";
import { Button, Form, FormControl, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ToggleButton from 'react-toggle-button';
import { useNavigate } from "react-router-dom";
import GoBackButton from "../goBack/GoBackButton";




// Custom Skeleton Loader Component
const label = { inputProps: { 'aria-label': 'Switch demo' } };

const CustomNoRowsOverlay = () => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            fontSize: '16px',
            color: 'gray',
            bgcolor: 'background.default',
        }}
    >
        <Typography>No Data Available</Typography>
    </Box>
);

const CustomSkeletonOverlay = () => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            bgcolor: 'background.paper',
        }}
    >
        <Skeleton variant="rectangular" width="100%" height="100%" />
    </Box>
);

export default function RoleUserListing() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [addPermissionRole, setPermissionRole] = useState({
        reference_check_skip: '',
        updateLoading: false
    })


    useEffect(() => {
        async function fetchDataList() {
            await fetchData();
        }
        fetchDataList()
    }, [])

    const handleToggleStatus = async (bankItem) => {
        const newStatus = bankItem.profile_status === 'Active' ? 'Inactive' : 'Active';
        const payload = { _id: bankItem._id, status: newStatus };
        try {
            setData(prevList =>
                prevList.map(item =>
                    item._id === bankItem._id ? { ...item, status: newStatus } : item
                )
            );
            await handleDelete(payload);
        } catch (error) {
            toast.error("Failed to update Bank status");
        }
    };

    const handleDelete = async (payload) => {
        try {
            let response = await axios.post(`${config.API_URL}changeRoleUserProfileStatus`, payload, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                toast.success(response?.data?.message);
                await fetchData();
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            let payloads = {
                "keyword": '',
                "page_no": "1",
                "per_page_record": "10000",
            };
            let response = await axios.post(`${config.API_URL}getRoleUserList`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                setData(response.data.data);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };
    // Add these functions in your component
    const handleShowPermissionModal = (user) => {
        setSelectedUserId(user?._id);
        setShowPermissionModal(true);
        setPermissionRole((prev) => (
            {
                ...prev,
                reference_check_skip: user?.special_permissions?.reference_check_skip || 'no'
            }
        ))
    };

    const handleClosePermissionModal = () => {
        setShowPermissionModal(false);
        setSelectedUserId(null);
        setPermissionRole((prev) => ({
            ...prev,
            reference_check_skip: 'no'
        }))
    };

    const handlePermissionSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                role_doc_id: selectedUserId,
                permissions: addPermissionRole
            };

            setPermissionRole((prev) => (
                {
                    ...prev,
                    updateLoading: true
                }
            ))
            // Add your API call here
            let response = await axios.post(`${config.API_URL}assignSpecialPermission`, payload, apiHeaderToken(config.API_TOKEN));

            if (response.status === 200) {
                toast.success("Permissions updated successfully");
                handleClosePermissionModal();
                await fetchData(); // Refresh the data
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update permissions");
        } finally {
            setPermissionRole((prev) => (
                {
                    ...prev,
                    updateLoading: false
                }
            ))
        }
    };


    const AssignRedirection = (e, id) => {
        e.preventDefault()
        navigate(`/assign-menu/${id}`)
    }

    let rows = data && data?.length > 0 ? data?.map((item, index) => {
        return {
            id: index + 1, // Incremental ID
            _id: item?._id,
            userName: item?.name ? item?.name : 'N/A', // Static value
            email: item.email || 'N/A', // From the object or fallback
            mobile_no: item.mobile_no, // From the object
            designation: item.designation, // From the object
            profile_status: item.profile_status, // From the object
            user: item
        };
    }) : [];

    const columns = [
        { field: 'userName', headerName: 'Role User Name', width: 180 },
        { field: 'email', headerName: 'Email', width: 220 },
        { field: 'mobile_no', headerName: 'Mobile Number', type: 'string', width: 180 },
        {
            field: 'designation',
            headerName: 'Designation',
            width: 180,
            renderCell: (params) => {
                return (
                    <>
                        <div className="lineBreack">
                            {params?.row?.designation}
                        </div>
                    </>
                )
            }
        },
        {
            field: 'profile_status', headerName: 'Profile Status', width: 120,
            renderCell: (params) => {
                const isSwitchChecked = params?.row?.profile_status === 'Active';
                return (
                    <>
                        <div className="lineBreack">
                            <span>{params?.row?.profile_status}</span>
                            <div style={{ marginBottom: '20px' }}>
                                <ToggleButton
                                    value={isSwitchChecked}
                                    onToggle={() => handleToggleStatus(params.row)}
                                    label={params.row.profile_status}
                                />
                            </div>
                        </div>
                    </>
                );
            }
        },
        {
            field: 'Assign Menu',
            headerName: 'Assign Menu',
            width: 150,
            renderCell: (params) => {
                if (params?.row?.user?.permissions?.length > 0) {
                    return (
                        <>
                            <Button
                                className="activeColor"
                                onClick={(e) => AssignRedirection(e, params?.row?._id)}
                            >
                                Menu Assigned
                            </Button>
                        </>
                    );
                } else {
                    return (
                        <>
                            <Button
                                className="linkbtn"
                                onClick={(e) => AssignRedirection(e, params?.row?._id)}
                            >
                                Assign Menu
                            </Button>
                        </>
                    )
                }
            }
        },
        {
            field: 'grantPermission',
            headerName: 'Grant Permission',
            width: 200,
            renderCell: (params) => (
                // <Button
                //     variant="contained"
                //     color="primary"
                //     onClick={() => handleOpenPermissionModal(params.row._id)}
                //     style={{ backgroundColor: '#1976d2', color: 'white' }}
                //     startIcon={<AdminPanelSettings />}
                // >
                //     Permissions
                // </Button>
                <Button
                    className="linkbtn"
                    onClick={(e) => handleShowPermissionModal(params?.row?.user)}
                >
                    Permission
                </Button>
            ),
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => (
                <>
                    <Link to={`/add-role-user?id=${params?.row?._id}`} className="editButton btn btn-primary">Edit</Link>
                </>
            ),
        },
    ];




    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">

                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="hrhdng">
                        <h2 className="">Role Users List</h2>
                    </div>
                    <div className={"w-100 mainprojecttable"}>
                        <Box sx={{ minHeight: 300 }}>
                            <DataGrid
                                rows={rows}  // Make sure rows is populated
                                columns={columns}
                                headerClassName="custom-header-class"
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 10 },
                                    },
                                }}
                                pageSizeOptions={[10, 20]}
                                components={{
                                    NoRowsOverlay: CustomNoRowsOverlay,
                                    LoadingOverlay: CustomSkeletonOverlay,
                                }}
                                disableColumnSelector
                                rowHeight={70}
                                disableDensitySelector
                                disableColumnFilter={false} // Enable column filtering   
                                slots={{ toolbar: GridToolbar }}
                                slotProps={{
                                    toolbar: {
                                        showQuickFilter: true,
                                    },
                                }}
                                sx={{
                                    minHeight: 400,
                                }}
                                loading={loading}
                            />
                        </Box>
                    </div>
                </div>
            </div>



            {/* Grant Permission Modal */}
            <Modal
                show={showPermissionModal}
                onHide={handleClosePermissionModal}
                size="md"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Grant Permissions</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handlePermissionSubmit}>
                    <Modal.Body>

                        <Form.Group className="mb-3">
                            <Form.Label>Reference Check Skip</Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    id="referenceCheckSkip-yes"
                                    label="Yes"
                                    name="referenceCheckSkip"
                                    value="yes"
                                    checked={addPermissionRole.reference_check_skip === 'yes'}
                                    onChange={(e) => setPermissionRole(prev => ({ ...prev, reference_check_skip: e.target.value }))}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    id="referenceCheckSkip-no"
                                    label="No"
                                    name="referenceCheckSkip"
                                    value="no"
                                    checked={addPermissionRole.reference_check_skip === 'no'}
                                    onChange={(e) => setPermissionRole(prev => ({ ...prev, reference_check_skip: e.target.value }))}
                                />
                            </div>
                        </Form.Group>


                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClosePermissionModal}>
                            Close
                        </Button>
                        <Button variant="primary" disabled={addPermissionRole.updateLoading} className="linkbtn" type="submit">
                            {addPermissionRole.updateLoading ? "Loading....." : 'Save Changes'} 
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}
