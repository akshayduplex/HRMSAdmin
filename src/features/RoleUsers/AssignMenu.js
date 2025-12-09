import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import FormControl from "@mui/material/FormControl";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AllHeaders from "../partials/AllHeaders";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap";
import GoBackButton from "../goBack/GoBackButton";
import { useParams } from "react-router-dom";
import { Checkbox, FormControlLabel } from '@mui/material';
import { styled } from '@mui/system';
import { useRef } from "react";

const useDebounce = (callback, delay) => {
    const timer = useRef();

    const debouncedCallback = (...args) => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
            callback(...args);
        }, delay);
    };

    return debouncedCallback;
};

const AnimatedCheckbox = styled(Checkbox)(({ theme }) => ({
    '&.MuiCheckbox-root': {
      position: 'relative',
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        transform: 'scale(1.2) rotate(5deg)',
      },
    },
    '&.Mui-checked': {
      color: theme?.palette?.primary?.main || '#1976d2',
      animation: 'rotateChecked 0.5s ease-in-out both',
    },
    '@keyframes rotateChecked': {
      '0%': {
        transform: 'rotate(0deg)',
      },
      '50%': {
        transform: 'rotate(20deg)',
      },
      '100%': {
        transform: 'rotate(0deg)',
      },
    },
    '@keyframes pulse': {
      '0%': {
        transform: 'scale(1)',
        opacity: 0.7,
      },
      '50%': {
        transform: 'scale(1.6)',
        opacity: 0,
      },
      '100%': {
        transform: 'scale(1)',
        opacity: 0,
      },
    },
}));

const CustomNoRowsOverlay = () => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            fontSize: "16px",
            color: "gray",
            bgcolor: "background.default",
        }}
    >
        <Typography>No Data Available</Typography>
    </Box>
);

const CustomSkeletonOverlay = () => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            bgcolor: "background.paper",
        }}
    >
        <Skeleton variant="rectangular" width="100%" height="100%" />
    </Box>
);

export default function AssignMenus() {
    const [data, setData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checkAll, setCheckAll] = useState(false);
    const [permission, setPermisstion] = useState({
        permissions: [{ slug: "", access: "" }],
    });
    let { id } = useParams();

    const UpdatePerMission = async (payloads) => {
        try {
            let response = await axios.post(`${config.API_URL}assignMenuPermission`, payloads, apiHeaderToken(config.API_TOKEN))
            if (response.data.status) {
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }

    const debouncedUpdatePermissions = useDebounce(UpdatePerMission, 500);


    const handlePermissionChange = async (e, menuSlug, accessType) => {
        const isChecked = e.target.checked;

        setPermisstion((prevState) => {
            const permissions = [...prevState?.permissions];

            const permissionIndex = permissions.findIndex(
                (item) => item.slug === menuSlug
            );

            if (isChecked) {
                if (permissionIndex === -1) {
                    permissions.push({
                        slug: menuSlug,
                        access: accessType === "assign" ? ["read"] : [accessType],
                    });
                } else {
                    if (!permissions[permissionIndex].access.includes(accessType)) {
                        permissions[permissionIndex].access.push(accessType);
                    }
                    if (accessType === "assign" && !permissions[permissionIndex].access.includes("read")) {
                        permissions[permissionIndex].access.push("read");
                    }
                }
            } else {
                if (accessType === "assign") {
                    if (permissionIndex !== -1) {
                        permissions.splice(permissionIndex, 1);
                    }
                } else {
                    if (permissionIndex !== -1) {
                        permissions[permissionIndex].access = permissions[permissionIndex].access.filter(
                            (access) => access !== accessType
                        );
                        if (permissions[permissionIndex].access.length === 0) {
                            permissions.splice(permissionIndex, 1);
                        }
                    }
                }
            }
            setUserData((prevUserData) => {
                const updatedPermissions = permissions.map((perm) => ({
                    slug: perm.slug,
                    access: perm.access,
                }));
                return {
                    ...prevUserData,
                    permissions: updatedPermissions,
                };
            });

            let payloads = {
                "_id": userData?._id,
                "permissions": permissions
            }
            UpdatePerMission(payloads)
            return { permissions };
        });
    };

  

    const handleCheckAll = (e) => {
        const isChecked = e.target.checked;
        setCheckAll(isChecked);
    
        setPermisstion((prevState) => {
            const permissions = [...prevState?.permissions];
    
            if (isChecked) {
                data.forEach((item) => {
                    const permissionIndex = permissions.findIndex(
                        (perm) => perm.slug === item.slug
                    );
    
                    if (permissionIndex === -1) {
                        permissions.push({
                            slug: item.slug,
                            access: ["read", "write"],
                        });
                    } else {
                        permissions[permissionIndex].access = Array.from(
                            new Set([
                                ...permissions[permissionIndex].access,
                                "read",
                                "write",
                            ])
                        );
                    }
                });
            } else {
                permissions.length = 0;
            }
    
            setUserData((prevUserData) => {
                const updatedPermissions = permissions.map((perm) => ({
                    slug: perm.slug,
                    access: perm.access,
                }));
                return {
                    ...prevUserData,
                    permissions: updatedPermissions,
                };
            });
    
            let payloads = {
                _id: userData?._id,
                permissions: permissions,
            };
            
            debouncedUpdatePermissions(payloads);
    
            return { permissions };
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (id) {
            (async () => {
                try {
                    let payloads = {
                        "_id": id,
                    }
                    let response = await axios.post(`${config.API_URL}getRoleUserById`, payloads, apiHeaderToken(config.API_TOKEN));
                    if (response.data.status) {
                        setUserData(response.data.data)

                        if (response.data.data.permissions && Array.isArray(response.data.data.permissions)) {
                            setPermisstion({
                                permissions: response.data.data.permissions.map((item) => ({
                                    slug: item.slug,
                                    access: item.access,
                                })),
                            });
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            })()
        }
    }, [id])

    const fetchData = async () => {
        try {
            setLoading(true);
            let payloads = {
                keyword: "",
                page_no: "1",
                per_page_record: "10000",
            };
            let response = await axios.post(
                `${config.API_URL}getMenuList`,
                payloads,
                apiHeaderToken(config.API_TOKEN)
            );
            if (response.status === 200) {
                setData(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const rows = useMemo(() => {
        return data && data.length > 0
            ? data.map((item, index) => {
                return {
                    id: index + 1, // Incremental ID
                    _id: item?._id,
                    menuList: item?.slug || "N/A", // Static value
                    user: item,
                    PageName:item?.name || "N/A",
                    writePermission: item,
                    readPermission: item,
                    AllChecked: item
                };
            })
            : [];
    }, [data]);

    const columns = useMemo(() => {
        return [
        { field: "id", headerName: "Serial No.", type: "string", width: 150 },
        { field: "PageName", headerName: "Menu List(s)", type: "string", width: 250 },
        {
            field: "user",
            headerName: "Assign Menu",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="lineBreack">
                        <Form.Group controlId={`checkbox-${params.id}-assign`}>
                            <Form.Check
                                type="checkbox"
                                label="Assign"
                                checked={
                                    userData?.permissions?.length > 0 &&
                                    userData?.permissions.some((item) => item.slug === params?.row?.menuList)
                                }
                                onChange={(e) => handlePermissionChange(e, params?.row?.menuList, "assign")}
                            />
                        </Form.Group>
                    </div>
                );
            },
        },
        {
            field: "readPermission",
            headerName: "Read",
            width: 200,
            renderCell: (params) => {
                // Check if the current menu has "read" permission
                const hasReadPermission = userData?.permissions.some(
                    (item) => item.slug === params.row.menuList && item.access.includes("read")
                );
                return (
                    <div className="lineBreack">
                        <Form.Group controlId={`checkbox-${params.id}`}>
                            <Form.Check
                                type="checkbox"
                                label="Read"
                                custom
                                checked={hasReadPermission}
                                onChange={(e) => handlePermissionChange(e, params.row.menuList, "read")}
                                disabled={
                                    !userData?.permissions?.some((item) => item.slug === params?.row?.menuList)
                                }
                            />
                        </Form.Group>
                    </div>
                );
            },
        },
        {
            field: "writePermission",
            headerName: "Write",
            width: 80,
            renderCell: (params) => {
                return (
                    <div className="lineBreack">
                        <Form.Group controlId={`checkbox-${params.id}-write`}>
                            <Form.Check
                                type="checkbox"
                                label="Write"
                                checked={
                                    userData?.permissions?.length > 0 &&
                                    userData?.permissions.some(
                                        (item) => item.slug === params?.row?.menuList && item.access.includes("write")
                                    )
                                }
                                onChange={(e) => handlePermissionChange(e, params?.row?.menuList, "write")}
                                disabled={
                                    !userData?.permissions?.some((item) => item.slug === params?.row?.menuList)
                                }
                            />
                        </Form.Group>
                    </div>
                );
            },
        },
    ];
    } , [userData])

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className='dflexbtwn'>
                        <div className="hrhdng">
                            <h2 className="">Assign Menu</h2>
                        </div>
                        <div className='pagename'>
                        <FormControlLabel
                                control={<AnimatedCheckbox checked={checkAll} onChange={handleCheckAll} />}
                                label="Check All"
                            />
                        </div>
                    </div>
                    <div className={"mainprojecttable"}>
                        <Box sx={{ minHeight: 300 }}>
                            <DataGrid
                                rows={rows} // Make sure rows is populated
                                columns={columns}
                                headerClassName="custom-header-class"
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 10 },
                                    },
                                }}
                                pageSizeOptions={[10, 20]}
                                rowHeight={65}
                                components={{
                                    NoRowsOverlay: CustomNoRowsOverlay,
                                    LoadingOverlay: CustomSkeletonOverlay,
                                }}
                                disableColumnSelector
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
        </>
    );
}
