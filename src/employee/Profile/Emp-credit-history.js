import React, { useRef } from "react";
import Table from "react-bootstrap/Table";
import { GoDownload } from "react-icons/go";
import Form from "react-bootstrap/Form";
import { CiCalendar } from "react-icons/ci";
import html2pdf from 'html2pdf.js';



export default function Emp_credit_history() {

    const htmlContentRef = useRef();

    // Function to trigger PDF download
    const handleDownloadPDF = () => {
        const element = htmlContentRef.current;

        // Temporarily make the content visible if it's hidden
        element.style.display = 'block';
        // Convert the HTML to PDF
        html2pdf().from(element).set({
            margin: 1,
            filename: 'my-pdf-file.pdf',
            jsPDF: { format: 'a4', orientation: 'portrait' }
        }).save().then(() => {
            element.style.display = 'none';
        });
        
    };
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
                                                <a>
                                                    <GoDownload onClick={handleDownloadPDF} />
                                                </a>
                                            </td>
                                        </tr>
                                        {/* <tr>
                                            <td>Jan 2023</td>
                                            <td>60,841.00</td>
                                            <td>4,841.00</td>
                                            <td>10/01/2023</td>
                                            <td>Tx101101010</td>
                                            <td>
                                                <a>
                                                    <GoDownload />
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Jan 2023</td>
                                            <td>60,841.00</td>
                                            <td>4,841.00</td>
                                            <td>10/01/2023</td>
                                            <td>Tx101101010</td>
                                            <td>
                                                <a>
                                                    <GoDownload />
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Jan 2023</td>
                                            <td>60,841.00</td>
                                            <td>4,841.00</td>
                                            <td>10/01/2023</td>
                                            <td>Tx101101010</td>
                                            <td>
                                                <a>
                                                    <GoDownload />
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Jan 2023</td>
                                            <td>60,841.00</td>
                                            <td>4,841.00</td>
                                            <td>10/01/2023</td>
                                            <td>Tx101101010</td>
                                            <td>
                                                <a>
                                                    <GoDownload />
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Jan 2023</td>
                                            <td>60,841.00</td>
                                            <td>4,841.00</td>
                                            <td>10/01/2023</td>
                                            <td>Tx101101010</td>
                                            <td>
                                                <a>
                                                    <GoDownload />
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Jan 2023</td>
                                            <td>60,841.00</td>
                                            <td>4,841.00</td>
                                            <td>10/01/2023</td>
                                            <td>Tx101101010</td>
                                            <td>
                                                <a>
                                                    <GoDownload />
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Jan 2023</td>
                                            <td>60,841.00</td>
                                            <td>4,841.00</td>
                                            <td>10/01/2023</td>
                                            <td>Tx101101010</td>
                                            <td>
                                                <a>
                                                    <GoDownload />
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Jan 2023</td>
                                            <td>60,841.00</td>
                                            <td>4,841.00</td>
                                            <td>10/01/2023</td>
                                            <td>Tx101101010</td>
                                            <td>
                                                <a>
                                                    <GoDownload />
                                                </a>
                                            </td>
                                        </tr> */}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                        {/* This is userInterFace Data whether to get the records here */}
                    </div>
                </div>
            </div>

            {/* Html template formate here to show the Template formate */}

            <div ref={htmlContentRef} style={{ display: 'none', fontFamily: '"Poppins", sans-serif', color: "#000" }}>
                <table style={{ maxWidth: 1000, margin: "0 auto" }} center="">
                    <tbody>
                        <tr>
                            <td
                                style={{
                                    textAlign: "center",
                                    borderBottom: "1px solid #34209B",
                                    padding: 10
                                }}
                            >
                                <img src="/logo512.png" alt="hlfppt"/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table style={{ marginTop:30 ,  padding: 20, width: "100%" }}>
                                    <tbody>
                                        <tr>
                                            <td />
                                            <td style={{ textAlign: "center" }}>
                                                <h2
                                                    style={{ fontSize: 20, fontStyle: "normal", fontWeight: 600 }}
                                                >
                                                   HLFPPT - Trust Promoted by HLL Lifecare Ltd.
                                                </h2>
                                                <h4
                                                    style={{ marginTop:20, fontSize: 16, fontStyle: "normal", fontWeight: 600 }}
                                                >
                                                   B14 A, Sector-62, Noida
                                                </h4>
                                                <h3
                                                    style={{
                                                        fontSize: 20,
                                                        fontStyle: "normal",
                                                        fontWeight: 600,
                                                        marginTop:20,
                                                        marginBottom:30
                                                    }}
                                                >
                                                    Pay Slip for the month of Sept / 2024
                                                </h3>
                                            </td>
                                            <td />
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table style={{ padding: "0 20px 20px", width: "100%" , marginBottom:20}}>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#585858",
                                                        minWidth: 80,
                                                        display: "inline-block"
                                                    }}
                                                >
                                                    EC No.:
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        display: "inline-block",
                                                        marginRight: 40
                                                    }}
                                                >
                                                    1123
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#585858",
                                                        minWidth: 120,
                                                        display: "inline-block"
                                                    }}
                                                >
                                                    Employee Name:
                                                </span>
                                                <span style={{ fontSize: 14, fontWeight: 500 }}>
                                                    Satendra Kumar
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#585858",
                                                        minWidth: 80,
                                                        display: "inline-block"
                                                    }}
                                                >
                                                    PF No.:
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        display: "inline-block",
                                                        marginRight: 40
                                                    }}
                                                >
                                                    100380214987
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#585858",
                                                        minWidth: 120,
                                                        display: "inline-block"
                                                    }}
                                                >
                                                    ESI No.:
                                                </span>
                                                <span style={{ fontSize: 14, fontWeight: 500 }}>
                                                    3011055385
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#585858",
                                                        minWidth: 80,
                                                        display: "inline-block"
                                                    }}
                                                >
                                                    Pay Days:
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        display: "inline-block",
                                                        marginRight: 40
                                                    }}
                                                >
                                                    24 Days
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#585858",
                                                        minWidth: 120,
                                                        display: "inline-block"
                                                    }}
                                                >
                                                    Designation:
                                                </span>
                                                <span style={{ fontSize: 14, fontWeight: 500 }}>
                                                    Admin Support
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#585858",
                                                        minWidth: 80,
                                                        display: "inline-block"
                                                    }}
                                                >
                                                    Branch:
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        display: "inline-block",
                                                        marginRight: 40
                                                    }}
                                                >
                                                    Corporate - Admin
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#585858",
                                                        minWidth: 120,
                                                        display: "inline-block"
                                                    }}
                                                >
                                                    PAN:
                                                </span>
                                                <span style={{ fontSize: 14, fontWeight: 500 }}>
                                                    BKGPK5639E
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#585858",
                                                        minWidth: 80,
                                                        display: "inline-block"
                                                    }}
                                                >
                                                    UAN:
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        display: "inline-block",
                                                        marginRight: 40
                                                    }}
                                                >
                                                    100380214987
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#585858",
                                                        minWidth: 120,
                                                        display: "inline-block"
                                                    }}
                                                >
                                                    Project:
                                                </span>
                                                <span style={{ fontSize: 14, fontWeight: 500 }}>Corporate</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table
                                    style={{
                                        border: "1px solid #000",
                                        padding: 20,
                                        width: "100%",
                                        borderCollapse: "collapse"
                                    }}
                                >
                                    <tbody>
                                        <tr>
                                            <th
                                                style={{
                                                    padding: 7,
                                                    background: "#D9D9D9",
                                                    fontSize: 14,
                                                    fontWeight: 600
                                                }}
                                            >
                                                Earnings
                                            </th>
                                            <th
                                                style={{
                                                    padding: 7,
                                                    background: "#D9D9D9",
                                                    fontSize: 14,
                                                    fontWeight: 600
                                                }}
                                            >
                                                Theoretical
                                            </th>
                                            <th
                                                style={{
                                                    padding: 7,
                                                    background: "#D9D9D9",
                                                    fontSize: 14,
                                                    fontWeight: 600
                                                }}
                                            >
                                                Amount
                                            </th>
                                            <th
                                                style={{
                                                    padding: 7,
                                                    background: "#D9D9D9",
                                                    fontSize: 14,
                                                    fontWeight: 600
                                                }}
                                            >
                                                Deductions
                                            </th>
                                            <th
                                                style={{
                                                    padding: 7,
                                                    background: "#D9D9D9",
                                                    fontSize: 14,
                                                    fontWeight: 600
                                                }}
                                            >
                                                Amount
                                            </th>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            >
                                                Basic
                                            </td>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            >
                                                12000
                                            </td>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            >
                                                12000
                                            </td>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            >
                                                Employee PF
                                            </td>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            >
                                                1600
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            >
                                                DA
                                            </td>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            >
                                                8000
                                            </td>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            >
                                                8000
                                            </td>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            />
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            />
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            >
                                                HRA
                                            </td>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            >
                                                10000
                                            </td>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            >
                                                8000
                                            </td>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            />
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            />
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            >
                                                Special AL
                                            </td>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            >
                                                5000
                                            </td>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            >
                                                2000
                                            </td>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            />
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            />
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            />
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            />
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            />
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            />
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            />
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderTop: "1px solid #000",
                                                    borderLeft: "1px solid #000",
                                                    fontWeight: 600,
                                                    fontSize: 14
                                                }}
                                            >
                                                Total
                                            </td>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderTop: "1px solid #000",
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            >
                                                35000
                                            </td>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderTop: "1px solid #000",
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            >
                                                30000
                                            </td>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderTop: "1px solid #000",
                                                    borderLeft: "1px solid #000",
                                                    fontWeight: 600,
                                                    fontSize: 14
                                                }}
                                            >
                                                Total
                                            </td>
                                            <td
                                                style={{
                                                    padding: 7,
                                                    borderTop: "1px solid #000",
                                                    borderLeft: "1px solid #000",
                                                    fontSize: 14
                                                }}
                                            >
                                                1600
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table style={{ padding: "40px 0", width: "100%",  marginTop:30}}>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#000",
                                                        minWidth: 80,
                                                        display: "inline-block",
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    Net Pay:
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        display: "inline-block",
                                                        marginRight: 40
                                                    }}
                                                >
                                                    28400.00 INR
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#000",
                                                        minWidth: 80,
                                                        display: "inline-block",
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    In Words:
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        display: "inline-block",
                                                        marginRight: 40
                                                    }}
                                                >
                                                    Twenty eight thousand four hundred only.
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#000",
                                                        display: "inline-block",
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    Signature
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table style={{ paddingTop: 20, width: "100%", marginTop:50 }}>
                                    <tbody>
                                        <tr>
                                            <td
                                                style={{
                                                    textAlign: "center",
                                                    // marginTop:30,
                                                    paddingLeft:10,
                                                    paddingRight:10,
                                                    fontSize: 13,
                                                    fontStyle: "normal",
                                                    fontWeight: 400
                                                }}
                                            >
                                                This is a computer generated Pay Slip Hence does not require
                                                Signature.{" "}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}
