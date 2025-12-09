import React, { useState } from 'react';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Link } from 'react-router-dom';
import { MdEditDocument } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
// import vieww from "../images/tv.png";
import EditAssetsModal from "./Modals/EditAssetsModal.js"
import ViewAssetsModal from "./Modals/ViewAssetsModal.js"
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa6';
import AddAssetsModal from './Modals/AddAssetsModal.js';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import { DeleteAssetsById } from '../../slices/AssetsSlice/assets.js';
import { CiWarning } from 'react-icons/ci';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});




export default function AssignedAssetsTable({ paginationModel, setPaginationModel }) {
    const { assignCount, assetsRecord } = useSelector((state) => state.assets)
    const navigate = useNavigate();
    const [assetsData, setAssetsData] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const dispatch = useDispatch();

    // Handle the Pagination 
    const handlePaginationModelChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);

    const handleShow1 = (data) => {
        setShow1(true)
        setAssetsData(data)
    };
    const handleShow2 = (data) => {
        setAssetsData(data)
        setShow2(true);
    }

    const handleDelete = (data) => {
        setShowDelete(true)
        setAssetsData(data)
    }


    const rows = assetsRecord.status === 'success' && assetsRecord.data?.length > 0
        ? assetsRecord.data?.map((item, index) => {
            return {
                id: index + 1 + paginationModel?.page * paginationModel?.pageSize,
                assetInfo: {
                    deviceSrNo: item?.serial_no || 'N/A',
                    assetName: item?.asset_name || 'N/A',
                    status: item?.assign_status || 'N/A',
                    assetType: item?.asset_type || 'N/A',
                },
                empInfo: {
                    empName: item?.current_employee?.name ?? "N/A",
                    empId: item?.current_employee?.code ?? "N/A",
                    empDocId: item?.current_employee?.employee_doc_id ?? "N/A",
                },
                "Assigned Date": item?.current_employee?.assign_date ? moment(item?.current_employee?.assign_date).format('DD/MM/YYYY') : 'N/A',
                "Assigned Date": item?.current_employee?.assign_date ? moment(item?.current_employee?.assign_date).format('DD/MM/YYYY') : 'N/A',
                "Return Date": "-",
                data: item
            }
        }) : [];

    const handleToNavigate = (id) => {
        localStorage.setItem("onBoardingId", id);
        navigate('/people-profile?tab=assets')
    }


    const DeleteAssets = () => {
        let payload = { "_id": assetsData?._id }
        dispatch(DeleteAssetsById(payload)).unwrap()
            .then((res) => {
                setShowDelete(false)
            })
    }

    const columns = [
        { field: "id", headerName: "Sno.", width: 50 },

        {
            field: "deviceSrNo.",
            headerName: "Device Srno.",
            type: "number",
            width: 200,
            renderCell: (params) => (
                <div className="asttd">
                    <p>{params.row?.assetInfo?.deviceSrNo}</p>
                </div>
            ),
        },
        {
            field: "assetName.",
            headerName: "Asset Name.",
            type: "text",
            width: 200,
            renderCell: (params) => (
                <div className="asttd">
                    <p>{params.row?.assetInfo?.assetName}</p>
                </div>
            ),
        },
        {
            field: "assetType.",
            headerName: "Asset/Device Type",
            type: "text",
            width: 120,
            renderCell: (params) => (
                <div className="asttd">
                    <p>{params.row?.assetInfo?.assetType}</p>
                </div>
            ),
        },
        {
            field: "empName",
            headerName: "Employee Name",
            width: 180,
            renderCell: (params) => (
                <div className="asttd">
                    {
                        params.row?.empInfo?.empName !== 'N/A' ?
                            // <Link to="/candidate-profile"><p>{params.row?.empInfo?.empName}</p></Link>
                            <p onClick={() => handleToNavigate(params.row?.empInfo?.empDocId)} className="color-blue" style={{ cursor: 'pointer' }} >{params.row?.empInfo?.empName}</p>

                            : <p className="color-blue">{params.row?.empInfo?.empName}</p>
                    }
                </div>
            ),
        },
        {
            field: "empId",
            headerName: "Employee Id",
            width: 120,
            renderCell: (params) => (
                <div className="asttd" style={{ cursor: 'pointer' }}>
                    {
                        params.row?.empInfo?.empId !== 'N/A' ?
                            <p className="color-blue" onClick={() => handleToNavigate(params.row?.empInfo?.empDocId)}>{params.row?.empInfo?.empId}</p>
                            : <p className="color-blue">{params.row?.empInfo?.empId}</p>
                    }
                </div>
            ),
        },
        {
            field: "status.",
            headerName: "Status",
            type: "text",
            width: 160,
            renderCell: (params) => (
                <div className="asttd">
                    <span className={`asst_status ${(params.row?.assetInfo?.status) === 'Assigned' ? 'bg_dgreen' : 'bg_magenta'}`}>{params.row?.assetInfo?.status}</span>
                </div>
            ),
        },
        {
            field: "Assigned Date",
            headerName: "Assigned Date",
            type: "number",
            width: 120,
        },
        {
            field: "Return Date",
            headerName: "Return Date",
            type: "number",
            width: 120,
        },

        {
            field: "Action",
            headerName: "Action",
            width: 160,
            renderCell: (params) => (
                <div className="assttblbtns d-flex align-items-center">
                    <div className="" onClick={(e) => handleShow2(params.row?.data)}>
                        {/* <img src={vieww} /> */}
                        <FaEye color='#167a2b' />
                        <span>View</span>
                    </div>
                    <div className={`${(params.row?.assetInfo?.status) === 'Assigned' ? 'inactive' : 'astactive'}`} onClick={(e) => {
                        if (params.row?.assetInfo?.status === 'Unassigned') {
                            handleShow1(params.row?.data)
                        } else {
                            e.preventDefault()
                        }
                    }}>
                        <MdEditDocument className="" />
                        <span>Edit</span>
                    </div>
                    <div className={`${(params.row?.assetInfo?.status) === 'Assigned' ? 'inactive' : 'dltactive'}`} onClick={(e) => {
                        if (params.row?.assetInfo?.status === 'Unassigned') {
                            handleDelete(params.row?.data);
                        } else {
                            e.preventDefault();
                        }
                    }}
                    >
                        <RiDeleteBin6Line />
                        <span>Delete</span>
                    </div>
                </div>
            ),
        }

    ];

    let rowHeight = 60;
    let tableHeght = Math.max(rows?.length * rowHeight + 100, 400);

    return (
        <>
            <div className="w-100">
                <DataGrid
                    rows={rows}
                    columns={columns}
                    headerClassName="custom-header-class"
                    rowHeight={60}
                    paginationModel={paginationModel}
                    onPaginationModelChange={handlePaginationModelChange}
                    pageSizeOptions={[10, 20, 40, 50, 80]}
                    disableRowSelectionOnClick
                    paginationMode="server"
                    rowCount={assignCount?.status === 'success' ? assignCount?.total?.data : 0}
                    loading={assetsRecord?.status === 'loading'}
                    sx={{
                        height: tableHeght
                    }}
                />
            </div>
            <AddAssetsModal show={show1} onHide={() => setShow1(false)} assetsData={assetsData} />
            <ViewAssetsModal show={show2} onHide={() => setShow2(false)} assetsData={assetsData} />


            <Dialog
                open={showDelete}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setShowDelete(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Delete Assets"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-requisition-description">
                        Are you sure ? you want to delete <strong>{assetsData && assetsData?.asset_name}</strong> , This is Serial No  <strong>{assetsData && assetsData?.serial_no}</strong> of Assets .
                        <p><span><CiWarning color='#c40d0a' /></span> This action cannot be undone.</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button className='apprvbtn' onClick={() => setShowDelete(false)}>Disagree</button>
                    <button className='danderBtb' onClick={DeleteAssets}>Agree</button>
                </DialogActions>
            </Dialog>
        </>
    )
}

