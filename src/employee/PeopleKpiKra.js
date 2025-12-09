import React, { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import './quillCss.css';
import Form from "react-bootstrap/Form";
import { CiCalendar } from "react-icons/ci";
import Table from "react-bootstrap/Table";
import { Container, Spinner } from 'react-bootstrap';
import { Button } from "react-bootstrap";
import axios from "axios";
import config from "../config/config";
import { apiHeaderToken } from "../config/api_header";
import { toast } from "react-toastify";
import './kpikra.css'

const PeopleKPIKRA = ({ data, getEmployeeListFun }) => {
    const [rows, setRows] = useState(null);
    const [session, setSession] = useState(null);
    const [update, setUpdate] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAddRow = () => {
        setRows([...rows, { textKRA: '', textKPI: '', weightage: '', target: '' }]);
    };

    const [years, setYears] = useState([]);

    useEffect(() => {
        if (session) {
            const updatedRows = data?.kpi_kra?.filter((key) => key.session_year === session).map((item) => ({
                textKRA: item.kra,
                textKPI: item.kpi,
                weightage: item.weightage,
                target: item.target
            }));
            if (updatedRows?.length > 0) {
                setRows(updatedRows);
            } else {
                setRows([{ textKRA: '', textKPI: '', weightage: '', target: '' }])
            }
        } else {
            setRows([{ textKRA: '', textKPI: '', weightage: '', target: '' }])
        }
    }, [session]);

    const getFinancialYears = async () => {
        try {
            let Paylods = {
                "keyword": "",
                "page_no": "1",
                "per_page_record": "10",
                "scope_fields": ["_id", "name"],
                "status": "Active"
            }
            let response = await axios.post(`${config.API_URL}getFinancialYearList`, Paylods, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                setYears(response.data?.data)
            } else {
                setYears([])
            }
        } catch (error) {
            console.log(error);
            setYears([]);
        }
    }

    useEffect(() => {
        getFinancialYears()
    }, [])


    const handleRemoveRow = (index) => {
        const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
        setRows(updatedRows);
    };

    const handleChange = (index, field, value) => {
        setRows((prevRows) => {
            const updatedRows = [...prevRows];
            updatedRows[index] = { ...updatedRows[index], [field]: value };
            return updatedRows;
        });
    };

    console.log(rows, 'this is rows records')

    const handleSaveKPI_KRA_JD = async () => {
        let dataNew = rows?.map((key, index) => {
            return {
                sno: index + 1,
                kra: key?.textKRA,
                kpi: key?.textKPI,
                weightage: key?.weightage,
                target: key?.target
            }
        })
        let Paylods = {
            "_id": data?._id,
            "session_year": session,
            "kpi_kra_data": dataNew
        }

        if (!session) {
            return toast.warn("Please Choose the Session Year");
        }

        let checkEmpty = rows.every(row => {
            return Object.values(row).every(value => value !== null && value !== '');
        });
        if (!checkEmpty) {
            return toast.warn("Please Fill all the fields");
        }

        console.log(Paylods, 'this is Paylods data from the server');
        setLoading(true);

        axios.post(`${config.API_URL}updateKpiKraBulkData`, Paylods, apiHeaderToken(config.API_TOKEN))
            .then((res) => {
                if (res.data.status) {
                    toast.success(res.data.message);
                    getEmployeeListFun()
                    setLoading(false)
                } else {
                    toast.error(res.data.message);
                    setLoading(false)
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error("Failed to update");
                setLoading(false)
            })
    };


    return (
        <>
            <div className="row my-3" data-aos="fade-in" data-aos-duration="3000">
                <div className="col-lg-12">
                    <div className="sitecard pr-0">
                        <div className="ps-3 mb-3">
                            <div className="position-relative w-smaller rounded-3">
                                <Form.Select className="ps-4" onChange={(e) => setSession(e.target.value)}>
                                    <option value="">Select Session Year</option>
                                    {
                                        years && years?.length > 0
                                        && years?.map((value, index) => {
                                            return (
                                                <option value={`${value?.name}`}>{value?.name}</option>
                                            )
                                        })
                                    }
                                </Form.Select>
                                <div className="cal-icon">
                                    <CiCalendar />
                                </div>
                            </div>
                        </div>

                        <div className="d-flex flex-column gap-2 mt-1 w-100 kratable">
                            <Table className="w-100">
                                <thead>
                                    <tr>
                                        <th>Srno.</th>
                                        <th>KRA Description</th>
                                        <th>KPI (Smart)</th>
                                        <th>Weightage (%)</th>
                                        <th>Target (%)</th>
                                        {/* <th>+</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows && rows?.map((row, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="srno" style={{ width: '40px', height: '40px', lineHeight: '35px' }}>
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td>
                                                <ReactQuill
                                                    value={row?.textKRA}
                                                    onChange={(value) => handleChange(index, 'textKRA', value)}
                                                    placeholder="Enter KRA description"
                                                    className="custom-quill"
                                                    style={{ width: '350px' }} // Adjust height as needed
                                                />
                                            </td>
                                            <td>
                                                <ReactQuill
                                                    value={row?.textKPI}
                                                    onChange={(value) => handleChange(index, 'textKPI', value)}
                                                    placeholder="Enter KPI description"
                                                    className="custom-quill"
                                                    style={{ width: '350px' }}
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="30"
                                                    value={row?.weightage}
                                                    onChange={(e) => handleChange(index, 'weightage', e.target.value)}
                                                    className=""
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="100"
                                                    value={row.target}
                                                    onChange={(e) => handleChange(index, 'target', e.target.value)}
                                                    className=""
                                                />
                                            </td>
                                            <td className="d-flex flex-column addremv">
                                                <Button variant="primary" onClick={handleAddRow} className="mb-2 adbtn">+</Button>
                                                {index > 0 && (
                                                    <Button variant="danger" onClick={() => handleRemoveRow(index)}>-</Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <div className="text-center position-relative">
                            {
                                loading ?
                                    <Button className="btn btn-primary mt-3 w-25">
                                        <Spinner animation="border" variant="light" />
                                    </Button>
                                    :
                                    <Button onClick={handleSaveKPI_KRA_JD} className="btn btn-primary mt-3 w-25">
                                        Save
                                    </Button>
                            }
                        </div>
                    </div>

                </div>
                <Container className="table-container p-0 kpikratable mt-4">
                    <h5 className="text-start mb-4 ps-4 pt-4">KPI/KRA History</h5>
                    <Table hover responsive>
                        <thead className="table-header">
                            <tr>
                                <th>Sr no.</th>
                                <th>Financial Year</th>
                                <th>KRA Description</th>
                                <th>KPI (Smart)</th>
                                <th className="text-center">Weightage (%)</th>
                                <th className="text-center">Target (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data && data?.kpi_kra && data?.kpi_kra?.length > 0 &&
                                data?.kpi_kra.map((key) => {
                                    return (
                                        <tr>
                                            <td className="text-center">{key?.sno}</td>
                                            <td>{key?.session_year}</td>
                                            <td dangerouslySetInnerHTML={{ __html: key?.kra }}></td>
                                            <td dangerouslySetInnerHTML={{ __html: key?.kpi }}></td>
                                            <td className="text-center">{key?.weightage}%</td>
                                            <td className="text-center">{key?.target}%</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Container>

            </div>
        </>
    );
};

export default PeopleKPIKRA;