import React, { useEffect, useState } from 'react';
import Table from "react-bootstrap/Table";
import { GrDocumentUser } from "react-icons/gr";
import { GrDocumentTransfer } from "react-icons/gr";
import ReturnAssets from "./ReturnAssets"
import AssignAssets from "./AssignAssets"
import ViewAssigned from "./ViewAssigned"
import ViewReturnAssets from "./ViewReturnAssets"
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeAssetsRecords } from '../../features/slices/AssetsSlice/assets';


export default function EmployeeAssets({ userData }) {

    const { empAssets } = useSelector((state) => state.assets)
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [asset, setAssets] = useState(null);

    const handleShow = () => setShow(true);
    const handleShow1 = (data) => {
        setShow1(true)
        setAssets(data)
    };
    const handleShow2 = (data) => {
        setShow2(true)
        setAssets(data)
    };
    const handleShow3 = (data) => {
        setShow3(true)
        setAssets(data)
    };

    useEffect(() => {
        let payload = {
            "employee_doc_id": userData?._id,
            "page_no": "1",
            "per_page_record": "1000",
            "filter_keyword": "",
            "is_count": "no"
        }
        dispatch(fetchEmployeeAssetsRecords(payload))
    }, [dispatch, userData])

    return (
        <>
            <div className="row my-3" data-aos="fade-in" data-aos-duration="3000">
                <div className="col-lg-12">
                    <div className="sitecard pt-4 p-0 h-100">
                        <div className="borderbtm dflexbtwn">
                            <div className="px-4">
                                <h5>Assets</h5>
                            </div>
                            <div className="addattend px-4">
                                <button className="sitebtn" onClick={handleShow}>Assign Asset</button>
                            </div>
                        </div>

                        <div className="d-flex flex-column gap-2 mt-1 scroller-content w-100 smalldata infobox">
                            <Table hover className="candd_table">
                                <thead>
                                    <tr>
                                        <th>Srno.</th>
                                        <th>Device Srno.</th>
                                        <th>Asset Name</th>
                                        <th>Asset/Device Type</th>
                                        <th>Assigned Date</th>
                                        <th>Return Date</th>
                                        <th>Return Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        empAssets?.status === 'loading' ?
                                            <tr className='text-center'>
                                                <td colSpan={8}> Loading...... </td>
                                            </tr> :
                                            empAssets?.status === 'success' && empAssets?.data?.length > 0 ?
                                                empAssets.data?.map((item, index) => {
                                                    return (
                                                        <tr key={item?.serial_no}>
                                                            <td>{index + 1}</td>
                                                            <td>{item?.serial_no}</td>
                                                            <td>{item?.asset_name}</td>
                                                            <td>{item?.asset_type}</td>
                                                            <td>{item?.assign_date}</td>
                                                            <td>{item?.return_date ? item?.return_date :'-' }</td>
                                                            <td>{item?.return_condition_status ? item?.return_condition_status : '-' }</td>
                                                            <td>
                                                                <div className='asstbtn_wrap'>
                                                                    <button className='assts_btn' onClick={(e) => handleShow2(item)}>
                                                                        <GrDocumentUser />
                                                                        <span>View Assigned</span>
                                                                    </button>
                                                                    {
                                                                        item?.status === 'Assigned' ?
                                                                            <button className='assts_btn rtrn' onClick={(e) => handleShow1(item)}>
                                                                                <GrDocumentTransfer />
                                                                                <span>Return</span>
                                                                            </button>
                                                                            :
                                                                            <button className='assts_btn rtrn' onClick={(e) => handleShow3(item)}>
                                                                                <GrDocumentUser />
                                                                                <span>View Returned</span>
                                                                            </button>
                                                                    }
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                }) :
                                                <tr className='text-center'>
                                                    <td colSpan={8}> No Records Found </td>
                                                </tr>
                                    }
                                </tbody>
                            </Table>
                        </div>


                    </div>
                </div>
            </div>

            <AssignAssets show={show} onHide={() => setShow(false)} userData={userData} />
            <ReturnAssets show={show1} onHide={() => setShow1(false)} asset={asset} userData={userData} />
            <ViewAssigned show={show2} onHide={() => setShow2(false)} asset={asset} />
            <ViewReturnAssets show={show3} onHide={() => setShow3(false)} asset={asset} />

        </>
    );
}
