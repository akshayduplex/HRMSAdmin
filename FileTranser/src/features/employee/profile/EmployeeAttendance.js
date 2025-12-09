import React, { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ReactCalendar from "react-calendar";
import Form from "react-bootstrap/Form";
import { CiCalendar } from "react-icons/ci";
import Table from "react-bootstrap/Table";
import { MdClose } from "react-icons/md";

export default function EmployeeAttendance() {
    const [open, setOpen] = useState(false);

    const percentage = 90;
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
                                <Table hover className="candd_table attndnc_tbl">
                                    <thead>
                                        <tr>
                                            <th>Month</th>
                                            <th>Total Working Days</th>
                                            <th>Total Present</th>
                                            <th>Total Absent</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr onClick={() => setOpen(!open)}>
                                            <td><p className="color-blue">Jan</p> </td>
                                            <td><p>26</p></td>
                                            <td><p>25</p></td>
                                            <td><p>1</p></td>
                                        </tr>
                                        {open && (
                                            <tr>
                                                <td colSpan="4" className="p-0">
                                                    <div className="monthly_attndence">
                                                        <div className="d-flex justify-content-between flex-row header-collapse py-2">
                                                            <h5 className="w-100 mb-0 ">
                                                                January 2023 Attendance
                                                            </h5>
                                                            <div className="d-flex justify-content-end pe-3" onClick={() => setOpen(!open)}>
                                                                <MdClose />
                                                            </div>
                                                        </div>
                                                        <div className="row container gy-3 my-2">
                                                            <div className="col-lg-6 calendarVal">
                                                                <ReactCalendar disabled={true} />
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div className="d-flex flex-column gap-1 justify-content-center align-items-center my-2">
                                                                    <div className="assementscore" style={{ width:180, height: 180 }} >
                                                                        <CircularProgressbar
                                                                            value={percentage}
                                                                            strokeWidth={10}
                                                                            text={`${percentage}%`}
                                                                        />
                                                                    </div>
                                                                    <p className="atn_hdng">Overall Attendance</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}

                                        <tr>
                                            <td><p className="color-blue">Feb</p></td>
                                            <td><p>26</p></td>
                                            <td><p>25</p></td>
                                            <td><p>1</p></td>
                                        </tr>
                                        <tr>
                                            <td><p className="color-blue">Mar</p></td>
                                            <td><p>26</p></td>
                                            <td><p>25</p></td>
                                            <td><p>1</p></td>
                                        </tr>
                                        <tr>
                                            <td><p className="color-blue">Apr</p></td>
                                            <td><p>26</p></td>
                                            <td><p>25</p></td>
                                            <td><p>1</p></td>
                                        </tr>
                                        <tr>
                                            <td><p className="color-blue">May</p></td>
                                            <td><p>26</p></td>
                                            <td><p>25</p></td>
                                            <td><p>1</p></td>
                                        </tr>
                                        <tr>
                                            <td><p className="color-blue">June</p></td>
                                            <td><p>26</p></td>
                                            <td><p>25</p></td>
                                            <td><p>1</p></td>
                                        </tr>
                                        <tr>
                                            <td><p className="color-blue">July</p></td>
                                            <td><p>26</p></td>
                                            <td><p>25</p></td>
                                            <td><p>1</p></td>
                                        </tr>
                                        <tr>
                                            <td><p className="color-blue">Aug</p></td>
                                            <td><p>26</p></td>
                                            <td><p>25</p></td>
                                            <td><p>1</p></td>
                                        </tr>
                                        <tr>
                                            <td><p className="color-blue">Sep</p></td>
                                            <td><p>26</p></td>
                                            <td><p>25</p></td>
                                            <td><p>1</p></td>
                                        </tr>
                                        <tr>
                                            <td><p className="color-blue">Oct</p></td>
                                            <td><p>26</p></td>
                                            <td><p>25</p></td>
                                            <td><p>1</p></td>
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
