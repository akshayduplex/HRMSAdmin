import React from "react";
import Table from "react-bootstrap/Table";
import { GoDownload } from "react-icons/go";
import Form from "react-bootstrap/Form";
import { CiCalendar } from "react-icons/ci";
import { Link } from "react-router-dom";


export default function EmployeeCreditHistory() {
    return (
        <>

            <div className="row my-3" data-aos="fade-in" data-aos-duration="3000">
                <div className="col-lg-12">
                    <div className="sitecard pr-0 h-100 ps-0 pt-4">
                        <div className="d-flex flex-column gap-2">
                            <div className="ps-3">
                                <div className="position-relative w-smaller rounded-3">
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
                                <Table hover className="candd_table">
                                    <thead>
                                        <tr>
                                            <th>Pay Month</th>
                                            <th>Total Paid</th>
                                            <th>Deductions</th>
                                            <th>Credit Date</th>
                                            <th>Transaction ID</th>
                                            <th>Pay Slip</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Jan 2023</td>
                                            <td>60,841.00</td>
                                            <td>4,841.00</td>
                                            <td>10/01/2023</td>
                                            <td>Tx101101010</td>
                                            <td>
                                                <Link to="#">
                                                    <GoDownload />
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Jan 2023</td>
                                            <td>60,841.00</td>
                                            <td>4,841.00</td>
                                            <td>10/01/2023</td>
                                            <td>Tx101101010</td>
                                            <td>
                                                <Link to="#">
                                                    <GoDownload />
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Jan 2023</td>
                                            <td>60,841.00</td>
                                            <td>4,841.00</td>
                                            <td>10/01/2023</td>
                                            <td>Tx101101010</td>
                                            <td>
                                                <Link to="#">
                                                    <GoDownload />
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Jan 2023</td>
                                            <td>60,841.00</td>
                                            <td>4,841.00</td>
                                            <td>10/01/2023</td>
                                            <td>Tx101101010</td>
                                            <td>
                                                <Link to="#">
                                                    <GoDownload />
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Jan 2023</td>
                                            <td>60,841.00</td>
                                            <td>4,841.00</td>
                                            <td>10/01/2023</td>
                                            <td>Tx101101010</td>
                                            <td>
                                                <Link to="#">
                                                    <GoDownload />
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Jan 2023</td>
                                            <td>60,841.00</td>
                                            <td>4,841.00</td>
                                            <td>10/01/2023</td>
                                            <td>Tx101101010</td>
                                            <td>
                                                <Link to="#">
                                                    <GoDownload />
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Jan 2023</td>
                                            <td>60,841.00</td>
                                            <td>4,841.00</td>
                                            <td>10/01/2023</td>
                                            <td>Tx101101010</td>
                                            <td>
                                                <Link to="#">
                                                    <GoDownload />
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Jan 2023</td>
                                            <td>60,841.00</td>
                                            <td>4,841.00</td>
                                            <td>10/01/2023</td>
                                            <td>Tx101101010</td>
                                            <td>
                                                <Link to="#">
                                                    <GoDownload />
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Jan 2023</td>
                                            <td>60,841.00</td>
                                            <td>4,841.00</td>
                                            <td>10/01/2023</td>
                                            <td>Tx101101010</td>
                                            <td>
                                                <Link to="#">
                                                    <GoDownload />
                                                </Link>
                                            </td>
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
