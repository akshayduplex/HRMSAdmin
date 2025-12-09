import React, { useState } from 'react';
import Table from "react-bootstrap/Table";
import { GrDocumentUser } from "react-icons/gr";
import { GrDocumentTransfer } from "react-icons/gr";
import ReturnAssets from "./ReturnAssets"
import AssignAssets from "./AssignAssets"
import ViewAssigned from "./ViewAssigned"
import ViewReturnAssets from "./ViewReturnAssets"


export default function EmployeeAssets() {
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);

    const handleShow = () => setShow(true);
    const handleShow1 = () => setShow1(true);
    const handleShow2 = () => setShow2(true);
    const handleShow3 = () => setShow3(true);

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
                                    <tr>
                                        <td>1</td>
                                        <td>58454466</td>
                                        <td>MSI-LPT007</td>
                                        <td>Laptop</td>
                                        <td>22/11/2021</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>
                                            <div className='asstbtn_wrap'>
                                                <button className='assts_btn' onClick={handleShow2}>
                                                    <GrDocumentUser />
                                                    <span>View Assigned</span>
                                                </button>
                                                <button className='assts_btn rtrn' onClick={handleShow1}>
                                                    <GrDocumentTransfer />
                                                    <span>Return</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>58454466</td>
                                        <td>MSI-LPT007</td>
                                        <td>Mouse</td>
                                        <td>22/11/2021</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>
                                            <div className='asstbtn_wrap'>
                                                <button className='assts_btn'>
                                                    <GrDocumentUser />
                                                    <span>View Assigned</span>
                                                </button>
                                                <button className='assts_btn rtrn'>
                                                    <GrDocumentTransfer />
                                                    <span>Return</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>58454466</td>
                                        <td>MSI-LPT007</td>
                                        <td>Laptop</td>
                                        <td>21/11/2021</td>
                                        <td>22/04/2024</td>
                                        <td>Faulty</td>
                                        <td>
                                            <div className='asstbtn_wrap'>
                                                <button className='assts_btn' onClick={handleShow3}>
                                                    <GrDocumentUser />
                                                    <span>View returned asset detail</span>
                                                </button>
                                                <button className='assts_btn retrndisable'>
                                                    <GrDocumentTransfer />
                                                    <span>Return</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                </tbody>
                            </Table>
                        </div>


                    </div>
                </div>
            </div>

            <AssignAssets show={show} onHide={() => setShow(false)} />
            <ReturnAssets show={show1} onHide={() => setShow1(false)} />
            <ViewAssigned show={show2} onHide={() => setShow2(false)} />
            <ViewReturnAssets show={show3} onHide={() => setShow3(false)} />

        </>
    );
}
