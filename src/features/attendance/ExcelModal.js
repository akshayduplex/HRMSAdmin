
import React, { useEffect, useState } from "react"; // Ensure useState is imported
import Modal from "react-bootstrap/Modal";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Box from "@mui/material/Box";
import StepConnector from "@mui/material/StepConnector";
import { styled } from "@mui/system";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { stepConnectorClasses } from "@mui/material/StepConnector";
import FormControl from "@mui/material/FormControl";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { useDispatch } from "react-redux";
import { FetchClosedProjectListDropDown } from "../slices/ProjectListDropDown/ProjectListDropdownSlice";
import AsyncSelect from 'react-select/async';
import { Autocomplete, TextField } from '@mui/material';
import moment from "moment";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken, apiHeaderTokenMultiPart } from "../../config/api_header";



const CustomStepIcon = ({ active, completed }) => {
    if (completed) {
        return <CheckCircleIcon color="primary" />;
    } else if (active) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
            >
                <path
                    d="M23 11.5C23 17.8513 17.8513 23 11.5 23C5.14873 23 0 17.8513 0 11.5C0 5.14873 5.14873 0 11.5 0C17.8513 0 23 5.14873 23 11.5ZM8.73782 11.5C8.73782 13.0255 9.97449 14.2622 11.5 14.2622C13.0255 14.2622 14.2622 13.0255 14.2622 11.5C14.2622 9.97449 13.0255 8.73782 11.5 8.73782C9.97449 8.73782 8.73782 9.97449 8.73782 11.5Z"
                    fill="#30A9E2"
                />
            </svg>
        );
    } else {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
            >
                <path
                    d="M23 11.5C23 17.8513 17.8513 23 11.5 23C5.14873 23 0 17.8513 0 11.5C0 5.14873 5.14873 0 11.5 0C17.8513 0 23 5.14873 23 11.5ZM8.73782 11.5C8.73782 13.0255 9.97449 14.2622 11.5 14.2622C13.0255 14.2622 14.2622 13.0255 14.2622 11.5C14.2622 9.97449 13.0255 8.73782 11.5 8.73782C9.97449 8.73782 8.73782 9.97449 8.73782 11.5Z"
                    fill="#EBEBEB"
                />
            </svg>
        );
    }
};

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#D2C9FF',
        },
        height: '44px',
    }),
    menu: (provided) => ({
        ...provided,
        borderTop: '1px solid #D2C9FF',
    }),
    option: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid #D2C9FF',
        color: state.isSelected ? '#fff' : '#000',
        backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#80CBC4' : provided.backgroundColor,
        '&:hover': {
            backgroundColor: '#80CBC4',
            color: '#fff',
        },
    }),
};

const CustomStepConnector = styled(StepConnector)({
    line: {
        height: 3,
        border: 0,
        backgroundColor: "#eaeaf0",
        borderRadius: 1,
    },
    active: {
        "& $line": {
            backgroundImage:
                "linear-gradient( 95deg, rgb(46, 46, 46) 0%, rgb(46, 46, 46) 50%, rgb(194, 194, 194) 50%, rgb(194, 194, 194) 100%)",
        },
    },
    completed: {
        "& $line": {
            backgroundImage:
                "linear-gradient( 95deg, rgb(46, 46, 46) 0%, rgb(46, 46, 46) 50%, rgb(194, 194, 194) 50%, rgb(194, 194, 194) 100%)",
        },
    },
});

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                "linear-gradient( 95deg,rgba(48, 169, 226, 1) 0%,rgba(48, 169, 226, 1) 50%,rgba(48, 169, 226, 1) 100%)",
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                "linear-gradient( 95deg,rgba(48, 169, 226, 1) 0%,rgba(48, 169, 226, 1) 50%,rgba(48, 169, 226, 1) 100%)",
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor:
            theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
        borderRadius: 1,
    },
}));


export default function ExcelModal(props) {
    
    const { onHide } = props;
    const [activeStep, setActiveStep] = useState(0);
    const [option, setOptions] = useState(null)
    const [projectListOption, setProjectOptions] = useState(null);
    const [file, setFile] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const monthNames = moment.months();
    const currentYear = moment().year();
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loading_submit , set_loading] = useState(false);


    useEffect(() => {
        const currentYear = moment().year();
        const currentMonth = moment().format('MMMM');
        setSelectedYear(currentYear);
        setSelectedMonth(currentMonth);
    }, []);

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleMonthChange = (event, newValue) => {
        setSelectedMonth(newValue);
    };


    const years = Array.from(new Array(currentYear - 1990 + 1), (val, index) => moment().year(1990 + index).format('YYYY'));

    const handleYearChange = (event, newValue) => {
        setSelectedYear(newValue);
    };


    /********************** Project List Dropdown ********************/
    const projectLoadOption = async (input) => {
        const result = await dispatch(FetchClosedProjectListDropDown(input)).unwrap();
        return result;
    }
    const projectMenuOpen = async () => {
        const result = await dispatch(FetchClosedProjectListDropDown('')).unwrap();
        setOptions(result);
    }
    const handleProjectChanges = (option) => {
        setProjectOptions(option);
    }

    // Handle Submit the Form Data to show the Records 
    const handleNext = () => {
        if (!projectListOption) {
            return toast.warn("Please Select the Project");
        }
        if (!selectedMonth) {
            return toast.warn("Please Select the Month");
        }
        if (!selectedYear) {
            return toast.warn("Please Select the Year");
        }
        if (!file) {
            return toast.warn("Please Upload the File");
        }

        let formData = new FormData()
        let index = monthNames.indexOf(selectedMonth)
        formData.append('project_id', projectListOption.value)
        formData.append('month_name', index + " " + selectedMonth + " " + selectedYear)
        formData.append("filename", file);
        setLoading(true);

        axios.post(`${config.API_URL}importEmployeeAttendance`, formData, apiHeaderTokenMultiPart(config.API_TOKEN))
            .then((res) => {
                if (res.status === 200) {
                    toast.success(res.data?.data?.message);
                    setTableData(res.data.data)
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                } else {
                    toast.error(res.data?.data?.message);
                }
                setLoading(false);
            }).catch((err) => {
                toast.error(err.response.data?.message || err.message);
                setLoading(false);
        })
    };
    /********************* Handle File uploads and Extract the Data in JSON Formate *******************/
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setLoading(true);
        if (!file) {
            toast.warn("Please Select The File");
            setLoading(false);
            return;
        }
        const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (!validTypes.includes(file.type)) {
            toast.warn('Invalid file type. Please upload an Excel file (.xls or .xlsx)');
            setLoading(false);
            return;
        }
        setFile(file)
        setLoading(false);
    };

    /**
     * @description Add Attendance Sheets -
     * @feature Closed the Modal after Adding Attendance sheets
     */
    const handleAttendantSheet = async () => {
        let Payloads = {
            project_id:projectListOption.value,
            project_name:projectListOption.label,
            month:selectedMonth,
            year:selectedYear,
            attendance:tableData
        }


        console.log( Payloads , 'this is payloads' );
        set_loading(true);
        try {
            let response = await axios.post(`${config.API_URL}` , Payloads  , apiHeaderToken(config.API_TOKEN));
            if(response?.status === 200){
                toast.success(response.data?.message);
                onHide()
            }else {
                toast.error(response.data?.message);
            }
        } catch (error) {
            toast.error(error?.response.data?.message || error?.message || 'Something Went wrong');
        } finally {
            set_loading(false);
        }
    }


    const leaveTypes = ['SL', 'CL', 'OL', 'EL'];

    return (
        <>
            <Modal {...props} size="xl" centered>
                <Modal.Header className="border-0" closeButton>
                    <Modal.Title>Import Excel</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex justify-content-center align-items-center flex-column excelmodal">
                    <Box sx={{ minWidth: 500 }}>
                        <Stepper
                            activeStep={activeStep}
                            connector={<ColorlibConnector />}
                            alternativeLabel
                        >
                            <Step>
                                <StepLabel StepIconComponent={CustomStepIcon}>
                                    <h6>Step 1</h6>
                                    <span>Import Excel</span>
                                </StepLabel>
                            </Step>

                            <Step>
                                <StepLabel StepIconComponent={CustomStepIcon}>
                                    <h6>Step 2</h6>
                                    <span>Preview import and confirm</span>
                                </StepLabel>
                            </Step>

                        </Stepper>
                    </Box>
                    {activeStep === 0 ? (
                        <>
                            <div className="importform_wdth row mt-4 gy-4 px-5 align-items-center">
                                <div className="col-lg-6">
                                    <label className="mb-2">Project</label>

                                    <Box sx={{ minWidth: 300 }}>
                                        <FormControl fullWidth>
                                            <AsyncSelect
                                                cacheOptions
                                                defaultOptions
                                                defaultValue={option}
                                                loadOptions={projectLoadOption}
                                                value={projectListOption}
                                                onMenuOpen={projectMenuOpen}
                                                placeholder="Select Project"
                                                onChange={handleProjectChanges}
                                                classNamePrefix="react-select"
                                                isSearchable
                                                styles={customStyles}
                                            />
                                        </FormControl>
                                    </Box>

                                </div>
                                <div className="col-lg-6 timeprd_slct">
                                    <Box sx={{ minWidth: 300, display: 'flex', marginTop: '10px' }}>
                                        <FormControl fullWidth>
                                            <Autocomplete
                                                options={monthNames}
                                                value={selectedMonth}
                                                className="selectHeight"
                                                onChange={handleMonthChange}
                                                renderInput={(params) => <TextField {...params} label="Select Month" variant="outlined" />}
                                                style={{ width: 180 }}
                                            />
                                        </FormControl>
                                        <FormControl fullWidth>
                                            <Autocomplete
                                                className="selectHeight"
                                                options={years}
                                                value={selectedYear}
                                                onChange={handleYearChange}
                                                renderInput={(params) => <TextField {...params} label="Select Year" variant="outlined" />}
                                                style={{ width: 180, marginRight: '10px' }}
                                            />
                                        </FormControl>
                                    </Box>
                                </div>
                                <div className="col-lg-8">
                                    <Form.Label htmlFor="basic-url">
                                        Select Attendance Excel Sheet
                                    </Form.Label>
                                    <input
                                        type="file"
                                        className="cstmfile w-100 rounded-2 border-secondary"
                                        accept=".xls, .xlsx"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="col-lg-4">
                                    <div className="d-flex justify-content-center align-items-end flex-row gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="17"
                                            viewBox="0 0 16 17"
                                            fill="none"
                                        >
                                            <rect
                                                width="16"
                                                height="16"
                                                transform="translate(0 0.5)"
                                                fill="white"
                                            />
                                            <path
                                                d="M13 12.5V14.5H3V12.5H2V14.5C2 14.7652 2.10536 15.0196 2.29289 15.2071C2.48043 15.3946 2.73478 15.5 3 15.5H13C13.2652 15.5 13.5196 15.3946 13.7071 15.2071C13.8946 15.0196 14 14.7652 14 14.5V12.5H13Z"
                                                fill="#7054FF"
                                            />
                                            <path
                                                d="M13 7.5L12.295 6.795L8.5 10.585V1.5H7.5V10.585L3.705 6.795L3 7.5L8 12.5L13 7.5Z"
                                                fill="#7054FF"
                                            />
                                        </svg>
                                        <a href="/AddTheData.xlsx" className="text-purple">
                                            Sample file
                                        </a>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="read-btn d-flex justify-content-center align-items-center mt-5">
                                        <button className="btn w-large" onClick={handleNext} disabled={loading}>{loading ? "Processing......" : "Import"}</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : null}

                    {activeStep === 1 ? (
                        <>
                            <div className="d-flex flex-column w-100 candd_table exceltable my-4">
                                <div className="projname_entry w-100 d-flex justify-content-between mt-2">
                                    <div className="prjname">
                                        <h6>Project</h6>
                                        <p>{projectListOption && projectListOption?.label}</p>
                                    </div>
                                    <div className="prjname">
                                        <h6>Entry Found</h6>
                                        <p>{tableData && tableData?.length}</p>
                                    </div>
                                </div>

                                <div className="AddHeight">
                                    <Table striped
                                        bordered
                                        hover
                                    >
                                        <thead>
                                            <tr>
                                                <th>Employee ID</th>
                                                <th>Employee name</th>
                                                <th colSpan={4}>Leave OB</th>
                                                <th colSpan={31}>Date</th>
                                            </tr>
                                            <tr>
                                                <th></th>
                                                <th></th>
                                                <th>SL</th>
                                                <th>CL</th>
                                                <th>OL</th>
                                                <th>EL</th>
                                                <th>1</th>
                                                <th>2</th>
                                                <th>3</th>
                                                <th>4</th>
                                                <th>5</th>
                                                <th>6</th>
                                                <th>7</th>
                                                <th>8</th>
                                                <th>9</th>
                                                <th>10</th>
                                                <th>11</th>
                                                <th>12</th>
                                                <th>13</th>
                                                <th>14</th>
                                                <th>15</th>
                                                <th>16</th>
                                                <th>17</th>
                                                <th>18</th>
                                                <th>19</th>
                                                <th>20</th>
                                                <th>21</th>
                                                <th>22</th>
                                                <th>23</th>
                                                <th>24</th>
                                                <th>25</th>
                                                <th>26</th>
                                                <th>27</th>
                                                <th>28</th>
                                                <th>29</th>
                                                <th>30</th>
                                                <th>31</th>
                                            </tr>
                                        </thead>
                                        <tbody>


                                            {
                                                tableData && tableData.map((data, rowIndex) => {
                                                    // Separate the data based on the keys
                                                    const employeeName = data['Employee name'];
                                                    const employeeId = data['Employee ID'];
                                                    const leaveTypeData = Object.entries(data).filter(([key]) => leaveTypes.includes(key));
                                                    const otherData = Object.entries(data).filter(([key]) => !['Employee name', 'Employee ID'].includes(key) && !leaveTypes.includes(key));

                                                    return (
                                                        <tr key={rowIndex}>
                                                            {/* Render Employee name first */}
                                                            {employeeId && <th key="Employee ID">{employeeId}</th>}
                                                            {employeeName && <th key="Employee name">{employeeName}</th>}
                                                            {/* Render Leave Types */}
                                                            {leaveTypeData.map(([key, value]) => (
                                                                <th key={key}>{value}</th>
                                                            ))}
                                                            {/* Render other data */}
                                                            {otherData.map(([key, value]) => (
                                                                <td key={key}>{value}</td>
                                                            ))}
                                                        </tr>
                                                    );
                                                    
                                                })
                                            }

                                        </tbody>
                                    </Table>
                                </div>
                            </div>

                            <div className="w-100 d-flex justify-content-between mt-2">
                                <div className="">
                                    <button className="tbtn btn prevbtn" onClick={handleBack}> Cancel </button>
                                </div>
                                <div className="read-btn">
                                    <button className="excelsubmt_btn btn" disabled={loading_submit} onClick={handleAttendantSheet}>
                                         {loading_submit ? 'Loading...' :'Submit'}
                                    </button>
                                </div>
                            </div>

                        </>
                    ) : null}
                </Modal.Body>
            </Modal>
        </>
    );
}
