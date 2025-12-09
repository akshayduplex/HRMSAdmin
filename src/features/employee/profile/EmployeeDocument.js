import React from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { CiCalendar } from "react-icons/ci";


export default function EmployeeDocument() {
    return (
        <>
            <div className="row my-3" data-aos="fade-in" data-aos-duration="3000">
                <div className="col-lg-12">
                    <div className="sitecard pr-0 h-100 ps-0 pt-4">
                        <div className="d-flex flex-column gap-2">
                            <div className="ps-3">
                                <div className="position-relative w-smaller card-border rounded-3">
                                    <Form.Select className="ps-4">
                                        <option>2023</option>
                                        <option>2024</option>
                                    </Form.Select>
                                    <div className="cal-icon">
                                        <CiCalendar />
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-column gap-2 mt-1 scroller-content w-100 smalldata infobox">
                                <Table className="candd_table">
                                    <thead>
                                        <tr>
                                            <th className="text-center fw-medium">S.No</th>
                                            <th className="text-center fw-medium">
                                                Document Name
                                            </th>
                                            <th className="text-center fw-medium">
                                                Category
                                            </th>
                                            <th className="text-center fw-medium">
                                                Attached Date
                                            </th>
                                            <th className="text-center fw-medium">
                                                Verified By
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Aadhar front</td>
                                            <td>KYC</td>
                                            <td>23/04/2024</td>
                                            <td>Anshul Awasthi</td>
                                        </tr>
                                        <tr>
                                            <td>1</td>
                                            <td>Aadhar front</td>
                                            <td>KYC</td>
                                            <td>23/04/2024</td>
                                            <td>Anshul Awasthi</td>
                                        </tr>
                                        <tr>
                                            <td>1</td>
                                            <td>Aadhar front</td>
                                            <td>KYC</td>
                                            <td>23/04/2024</td>
                                            <td>Anshul Awasthi</td>
                                        </tr>
                                        <tr>
                                            <td>1</td>
                                            <td>Aadhar front</td>
                                            <td>KYC</td>
                                            <td>23/04/2024</td>
                                            <td>Anshul Awasthi</td>
                                        </tr>
                                        <tr>
                                            <td>1</td>
                                            <td>Aadhar front</td>
                                            <td>KYC</td>
                                            <td>23/04/2024</td>
                                            <td>Anshul Awasthi</td>
                                        </tr>
                                        <tr>
                                            <td>1</td>
                                            <td>Aadhar front</td>
                                            <td>KYC</td>
                                            <td>23/04/2024</td>
                                            <td>Anshul Awasthi</td>
                                        </tr>
                                        <tr>
                                            <td>1</td>
                                            <td>Aadhar front</td>
                                            <td>KYC</td>
                                            <td>23/04/2024</td>
                                            <td>Anshul Awasthi</td>
                                        </tr>
                                        <tr>
                                            <td>1</td>
                                            <td>Aadhar front</td>
                                            <td>KYC</td>
                                            <td>23/04/2024</td>
                                            <td>Anshul Awasthi</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
