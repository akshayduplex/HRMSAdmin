import React, { useEffect, useState } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import SalaryStructureModal from "./SalaryStructureModal"
import { FetchAppliedCandidateDetails } from '../slices/AppliedJobCandidates/JobAppliedCandidateSlice';
import { useSelector, useDispatch } from 'react-redux';
import config from '../../config/config';
import axios from 'axios';
import { apiHeaderToken } from '../../config/api_header';
import moment from 'moment';
import Modal from "react-bootstrap/Modal";
import Box from "@mui/material/Box";
import { htmlPrefilter } from 'jquery';
import { useNavigate } from 'react-router-dom';
import { Table } from 'react-bootstrap';

export default function EmployeedetailsTable({ ProjectEmployee, id }) {
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    const [EmployeeList, setEmployeeList] = useState([]);
    const [KPI_KRA, setPRA] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [SalaryShow, setSalary] = useState(false);
    const [SalaryStructure, setSalaryStructure] = useState(null);
    const [showJdModel, setJDModels] = useState(false);
    const [JDData, setJDData] = useState('');
    let navigation = useNavigate();

    const EmployeeData = async (id, designation) => {
        try {
            let payloads = { "keyword": "", "page_no": "1", "per_page_record": "1000", "scope_fields": [], "profile_status": "Active", "project_id": id, "designation": designation }
            let response = await axios.post(`${config.API_URL}getEmployeeList`, payloads, apiHeaderToken(config.API_TOKEN))
            if (response.status === 200) {
                setLoading(false)
                setEmployeeList(response.data.data)
            } else {
                setLoading(false)
                setEmployeeList([])
            }
        } catch (error) {
            setLoading(false)
            setEmployeeList([])
        }
    }

    const handleSalaryShow = (event, salary) => {
        setSalary(true);
        setSalaryStructure(salary)
    }

    useEffect(() => {
        if (ProjectEmployee?._id) {
            EmployeeData(id, ProjectEmployee?.designation)
            setLoading(true);
        }
    }, [ProjectEmployee?._id, ProjectEmployee?.designation, id])


    const groupBySessionYear = (data) => {
        return data.reduce((acc, item) => {
            const year = item.session_year;
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(item);
            return acc;
        }, {});
    };

    const handleShow = (e, data) => {
        e.preventDefault()
        setPRA(groupBySessionYear(data))
        setShow(true);
    };

    const handleJDShow = (e, data, title) => {
        e.preventDefault()
        setJDData(data);
        setTitle(title);
        setJDModels(true);
    }

    const rows = EmployeeList.length !== 0
        ? EmployeeList
            .map((value, index) => (
                {
                    id: index + 1,
                    "EmployeeID": value?.employee_code,
                    employeeInfo: {
                        name: value?.name,
                        status: value?.job_type,
                        designation: value?.designation,
                        email: value?.email,
                        phone: value?.mobile_no,
                    },
                    value: value,
                    projecttInfo: {
                        name: value?.project_name,
                        location: value?.location,
                    },
                    "DOJ": moment(value?.joining_date).format('DD/MM/YYYY'),
                    "Appraisal Date": moment(value?.appraisal_date).format('DD/MM/YYYY'),
                    "Department": value?.department,
                    contractTimeline: {
                        startdate: moment(value?.joining_date).format('DD/MM/YYYY'),
                        enddate: moment(value?.valid_till).format('DD/MM/YYYY'),
                    },
                    kpi_kra: value?.kpi_kra,
                    value: value,
                    salaryStructure: {
                        ctc: value?.ctc_pa,
                    },
                    "Reporting Manager":value?.reporting_manager?.map((item) => item.manager_name).join(' | '),
                    relatedDoc: {
                        doc1: "KPI",
                        doc2: "KRA",
                        doc3: "JD"
                    },
                }))
        : [];
 
    const columns = [
        {
            field: "EmployeeID",
            headerName: "Employee ID.",
            width: 100,
            renderCell: (params) => (
                <p className="color-blue" style={{ cursor: 'pointer' }} onClick={(e) => {
                    e.preventDefault();
                    localStorage.setItem('onBoardingId', params.row?.value?._id)
                    navigation('/people-profile')
                }}>{params.row?.EmployeeID}</p>
            ),
        },
        {
            field: "employeeInfo",
            headerName: "Employee Detail",
            width: 200,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p>{params.row?.employeeInfo?.name}</p>
                    <p>{params.row?.employeeInfo?.email}</p>
                    <p>{params.row?.employeeInfo?.phone}</p>
                    <p>{params.row?.employeeInfo?.designation}</p>
                    <p>{params.row?.employeeInfo?.status}</p>
                </div>
            ),
        },
        {
            field: "projecttInfo",
            headerName: "Project Name",
            width: 150,
            renderCell: (params) => (
                <div className="candinfo">
                    <p>{params.row?.projecttInfo?.name}</p>
                    <span>{params?.row?.projecttInfo?.location}</span>
                </div>
            ),
        },
        {
            field: "DOJ",
            headerName: "DOJ",
            type: "number",
            width: 120,
        },
        {
            field: "Appraisal Date",
            headerName: "Appraisal Date",
            type: "number",
            width: 130,
        },
        {
            field: "Reporting Manager",
            headerName: "Reporting Manager",
            type: "number",
            width: 200,
        },
        {
            field: "Department",
            headerName: "Department",
            type: "number",
            width: 120,
        },
        {
            field: "contractTimeline",
            headerName: "Contract Timeline",
            width: 120,
            renderCell: (params) => (
                <div className="candinfo lineBreack">
                    <p>{params.row?.contractTimeline?.startdate}</p>
                    <span>{params?.row?.contractTimeline?.enddate}</span>
                </div>
            ),
        },
        {
            field: "salaryStructure",
            headerName: "Salary CTC",
            width: 120,
            renderCell: (params) => (
                <div className="candinfo lineBreack" onClick={(e) => handleSalaryShow(e, params.row?.value)}>
                    <p className='color-blue'>{params.row?.salaryStructure?.ctc}</p>
                </div>
            ),
        },
        {
            field: "relatedDoc",
            headerName: "Related Doc",
            width: 120,
            renderCell: (params) => (
                <div className="candinfo lineBreack" style={{ cursor: 'pointer' }}>
                    <p className='color-blue' onClick={(e) => handleShow(e, params.row?.value?.kpi_kra)}>{params.row?.relatedDoc?.doc1} / {params.row?.relatedDoc?.doc2}</p>
                    {/* <p className='color-blue' onClick={(e) => handleShow(e, params.row?.value?.kra, 'KRA DATA :-')}>{params.row?.relatedDoc?.doc2}</p> */}
                    <p className='color-blue' onClick={(e) => handleJDShow(e, params.row?.value?.jd, 'JD DATA :-')}>{params.row?.relatedDoc?.doc3}</p>
                </div>
            ),
        }

    ];

    return (
        <>
            <div className="w-100 empdtl_table">
                <Box sx={{ height:700, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        headerClassName="custom-header-class"
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        rowHeight={100}
                        pageSizeOptions={[10, 20]}
                        loading={isLoading}
                        sx={{ 
                            minHeight: 400,
                        }}
                    />
                </Box>
            </div>
            <SalaryStructureModal show={SalaryShow} onHide={() => setSalary()} salary={SalaryStructure} />


            <Modal show={show} onHide={() => setShow(false)} size="lg" className="jobtemp_modal offermodal">
                <Modal.Header className="border-0" closeButton>
                    <Modal.Title>
                        {/* <h4>{title}</h4> */}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-0'>
                    {
                        Object.entries(KPI_KRA).length > 0 && Object.entries(KPI_KRA).map(([key, value]) => {
                            // console.log(key , 'this is Key check the Error here');
                            if (key === "undefined") {
                                return (
                                    <>
                                        <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>
                                            KPI / KRA  Data Not Found
                                        </h4>
                                    </>
                                )
                            }
                            if(key !== '' && key !== 'undefined'){
                                return (
                                    <>
                                        <h5 style={{ textAlign: 'start', marginBottom: '20px' }}>
                                            KPI / KRA Assessment Year / Period: {key}
                                        </h5>
                                        <Table bordered hover>
                                            <thead style={{ backgroundColor: '#f8f9fa' }}> {/* You can style the whole thead */}
                                                <tr>
                                                    <th style={{ padding: '10px', textAlign: 'center' }}>#</th>
                                                    <th style={{ padding: '10px', textAlign: 'center' }}>KRA Description</th>
                                                    <th style={{ padding: '10px', textAlign: 'center' }}>KPI (SMART)</th>
                                                    <th style={{ padding: '10px', textAlign: 'center' }}>Weightage(%)</th>
                                                    <th style={{ padding: '10px', textAlign: 'center' }}>Target</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    value.length > 0 && value?.map((key) => {
                                                        return (
                                                            <>
                                                                <tr>
                                                                    <td>{key?.sno}</td>
                                                                    <td dangerouslySetInnerHTML={{ __html: key?.kra }}>
                                                                    </td>
                                                                    <td dangerouslySetInnerHTML={{ __html: key?.kpi }}>
                                                                    </td>
                                                                    <td>{key?.weightage}%</td>
                                                                    <td>{key?.target}%</td>
                                                                </tr>
                                                            </>
                                                        )
                                                    })
                                                }
                                                {/* <tr>
                                                    <td>2</td>
                                                    <td>
                                                        <strong>Manpower Management and second line development</strong>
                                                        <ul>
                                                            <li>Timely recruitment of required manpower in coordination with HR department.</li>
                                                            <li>Retain quality resources and control attrition</li>
                                                            <li>Second line development and his/her interaction with the Reporting Officer</li>
                                                        </ul>
                                                    </td>
                                                    <td>
                                                        Ensure zero loss due to shortage of manpower.<br />
                                                        Second line manager in the division is completely aware of the programs and able to update.
                                                    </td>
                                                    <td>20%</td>
                                                    <td>100%</td>
                                                </tr>
                                                <tr>
                                                    <td>3</td>
                                                    <td>
                                                        <strong>Receivables and Donor Management</strong>
                                                        <ul>
                                                            <li>Ensure good liaisoning with donors/stakeholders/partners</li>
                                                            <li>Ensure timely release of grants/funds from the donors.</li>
                                                        </ul>
                                                    </td>
                                                    <td>
                                                        Number of complaints from donors<br />
                                                        Timely receiving of grants/funds
                                                    </td>
                                                    <td>15%</td>
                                                    <td>No complaints</td>
                                                </tr>
                                                <tr>
                                                    <td>4</td>
                                                    <td>
                                                        <strong>Coordination with other departments</strong>
                                                        <ul>
                                                            <li>Pleasant inter-personal, intra-department communication with other departments and support functions</li>
                                                        </ul>
                                                    </td>
                                                    <td>Good coordination with the departments and support team</td>
                                                    <td>12%</td>
                                                    <td>100%</td>
                                                </tr> */}
                                            </tbody>
                                        </Table>
                                    </>
                                )
                            }

                        })
                    }

                </Modal.Body>
            </Modal>

            {/* show the JD Models */}
            <Modal show={showJdModel} onHide={() => setJDModels(false)} size="lg" className="jobtemp_modal offermodal">
                <Modal.Header className="border-0" closeButton>
                    <Modal.Title>
                        <h4>{title}</h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="" dangerouslySetInnerHTML={{ __html: JDData }}>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

