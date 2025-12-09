import React, { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import './quillCss.css'
import axios from "axios";
import config from "../config/config";
import { apiHeaderToken } from "./helper/My_Helper";
import { toast } from "react-toastify";

const PeopleKRA = ({ TabType, userData }) => {
    const [text, setText] = useState();

    useEffect(() => {
        if (userData?.jd && TabType === 'jd') {
            setText(userData?.jd)
        }
    }, [TabType, userData])



    const handleSaveKPI_KRA_JD = async () => {

        let payloads = {
            "_id": userData?._id,
            "kpi_kra_jd_data": text,
            "type": TabType,
        }
        try {
            let response = await axios.post(`${config.API_URL}updateKpiKraJdData`, payloads, apiHeaderToken(config.API_TOKEN));
            console.log(response.data, 'response from server')

            if (response.status === 200) {
                toast.success(`${TabType} is Updated successfully`)
            } else {
                toast.error(`${TabType} is not Updated`)
            }

        } catch (error) {
            console.log(error)
        }

    }
    return (
        <>
            <div className="row my-3" data-aos="fade-in" data-aos-duration="3000">
                <div className="col-lg-12">
                    <div className="sitecard pr-0 ">
                        <div className="infobox kpidata">
                            <div className="txteditor_btn">
                                <div className="texteditor">
                                    <ReactQuill
                                        value={text}
                                        onChange={(value) => setText(value)}
                                        placeholder="Enter description"
                                        className="custom-quill"
                                    />
                                </div>
                            </div>
                            <div className="btneditor" onClick={handleSaveKPI_KRA_JD}>
                                <button className="sitebtn">Submit</button>
                            </div>
                            {
                                TabType === 'kra' ?
                                    <h5>KRA of each KPI</h5>
                                    : TabType === 'kpi' ?
                                        <h5>KPI</h5>
                                        :
                                        <h5>JD</h5>
                            }
                            <div className="infos" dangerouslySetInnerHTML={{ __html: text }}>
                                {/* <h6>Correspondence / Documentation</h6>
                                <ul>
                                    <li>
                                        Preparing Contracts, Agreements, Letters, Circulars & Memos
                                    </li>
                                    <li>
                                        Prepare minutes of meeting and circulate to the concerned
                                        departments / personnel’s
                                    </li>
                                </ul>
                                <h6>Correspondence / Documentation</h6>
                                <ul>
                                    <li>
                                        Preparing Contracts, Agreements, Letters, Circulars & Memos
                                    </li>
                                    <li>
                                        Prepare minutes of meeting and circulate to the concerned
                                        departments / personnel’s
                                    </li>
                                </ul> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PeopleKRA;
