import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Button, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { JsonDataParsed, uploadsFiles } from "../../features/slices/ImportCandidateSlice/ImportCandidate";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import moment from "moment";

const REQUIRED_FIELDS = [
    "employee_id",
    "employee_name",
];

const REQUIRED_FIELDSALARY = [
    "employee_id",
    "employee_name",
    "employee_email",
    "employee_mobile_no",
    "aadhaar_no",
    "basic_salary",
    "salary_hra",
    "salary_da",
    "salary_total",
    "ctc_per_month",
    "ctc_per_anum",
    "transport_allowances",
    "medical_allowances",
    "children_allowances",
    "special_allowances",
    "project_allowances",
    "charge_allowances",
    "uniform_allowance",
    "employee_pf",
    "accident_insurance_premium",
    "sodexo_food_voucher",
    "vehicle_fuel_allowances",
    "vehicle_allowances",
    "books_journals",
    "telephone_allowances",
    "helper_allowance"
];



const UploadsExcelFile = () => {
    // const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [loader, setLoader] = useState(false);
    const location = useLocation();

    const { file, extractedData } = useSelector((state) => state.import)


    const dispatch = useDispatch();


    const convertFileToJson = async (file) => {
        return new Promise((resolve, reject) => {
            if (!file) return reject("No file selected.");

            const reader = new FileReader();

            reader.onload = (event) => {
                const fileData = event.target.result;

                try {
                    const workbook = XLSX.read(fileData, { type: "binary" });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];

                    const rawData = XLSX.utils.sheet_to_json(worksheet, {
                        header: 1,
                        defval: "",
                        raw: true // Ensures raw values from Excel
                    });

                    if (rawData.length === 0) return reject("Empty file!");

                    const headers = rawData[0].map((header, index) => header || `Empty_Column_${index + 1}`);

                    const DATE_FIELDS = [
                        'joining_date',
                        'date_of_birth',
                        'resignation_date',
                        'last_working_date',
                        'offer_date',
                        'start_date',
                        'end_date'
                      ];
                      
                      const formattedData = rawData.slice(1).map(row => {
                        return headers.reduce((obj, header, index) => {
                            let value = row[index];
                            const lowerHeader = header.toLowerCase();
                            
                            if (isPossibleDate(value)) {
                                if (DATE_FIELDS.some(field => lowerHeader.includes(field)) || lowerHeader.includes('date')) {
                                    console.log(`Formatting "${header}" with value "${value}"`);
                                    value = formatDate(value);
                                }
                            }
                            
                            obj[header] = value !== undefined ? value : "";
                            return obj;
                        }, {});
                    });

                    setLoader(false)

                    resolve(formattedData);
                } catch (error) {
                    reject("Error processing file: " + error.message);
                }
            };

            reader.onerror = () => reject("File reading error");
            reader.readAsBinaryString(file);
        });
    };

    /**
     * Detects if a value is a possible Excel date (number or string).
     */
    const isPossibleDate = (value) => {
        if (typeof value === "number" && value > 100 && value < 60000) {
            // Excel serial date range (approx year 1900-2099)
            return true;
        }
        if (typeof value === "string" && moment(value, "DD-MM-YYYY", true).isValid()) {
            // Using Moment.js to strictly validate "DD-MM-YYYY" format
            return true;
        }
        return false;
    };
    

    /**
     * Converts Excel date serial or string date to formatted date.
     */
    function formatDate(excelValue) {
        // If numeric, treat as Excel serial date
        if (typeof excelValue === 'number') {
          // Add that many days to Excel epoch: 1899-12-30
          return moment('1899-12-30').add(excelValue, 'days').format('YYYY-MM-DD');
        } else {
          // If it's a string like "24-02-2010", parse accordingly
          return moment(excelValue, 'DD-MM-YYYY').format('YYYY-MM-DD');
        }
    }
      



    const onDrop = async (acceptedFiles) => {

        setLoader(true)

        const validTypes = [
            "text/csv",
            "application/vnd.ms-excel", // .xls
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        ];

        const selectedFile = acceptedFiles[0];

        if (selectedFile && validTypes.includes(selectedFile.type)) {
            dispatch(uploadsFiles(selectedFile))
            try {
                const data = await convertFileToJson(selectedFile);
                // Remove any entries where email is "test@gmail.com"
                const filteredData = data.filter(item => item.employee_email !== 'test@gmail.com');

                // Update each record with a new serial number (sno) sequentially starting at 1
                const updatedData = filteredData.map((item, index) => ({
                    ...item,
                    Sno: index + 1 // Assign serial number as a sequential number starting from 1
                }));

                dispatch(JsonDataParsed(updatedData))
            } catch (error) {
                return toast.error('Error processing file: ' + error.message);
            }
            setError("");
        } else {

            dispatch(uploadsFiles(null))
            setLoader(false)
            setError("Invalid file type. Please upload a CSV or Excel file (.csv, .xls, .xlsx).");
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ".csv, .xls, .xlsx",
        multiple: false,
    });

    // Total records count
    const totalRecords = (extractedData || Array.isArray(extractedData)) && extractedData.length;

    const errorRecords = extractedData && extractedData
        .map((record, rowIndex) => {
            const missingRequiredFields = [];

            if (location.pathname === '/import-salary') {

                REQUIRED_FIELDSALARY.forEach((field, index) => {
                    const value = record[field];

                    // If the required field is missing or empty
                    if (value === undefined || value === null || (typeof value === "string" ? value.trim() === "" : false)) {
                        missingRequiredFields.push(
                            <span key={field}>
                                {field}
                                <span className='text-danger'>*</span>
                                {index < REQUIRED_FIELDS.length - 1 && <span style={{ margin: "0 5px" }}> , </span>}
                            </span>
                        );
                    }
                });
            } else {

                REQUIRED_FIELDS.forEach((field, index) => {
                    const value = record[field];

                    // If the required field is missing or empty
                    if (value === undefined || value === null || (typeof value === "string" ? value.trim() === "" : false)) {
                        missingRequiredFields.push(
                            <span key={field}>
                                {field}
                                <span className='text-danger'>*</span>
                                {index < REQUIRED_FIELDS.length - 1 && <span style={{ margin: "0 5px" }}> , </span>}
                            </span>
                        );
                    }
                });
            }

            if (missingRequiredFields.length > 0) {
                return (
                    <div key={rowIndex}>
                        Row {rowIndex + 1}: {missingRequiredFields}
                    </div>
                );
            }

            return null;
        })
        .filter(Boolean);  // Filter out rows with no errors


    return (
        <>
            {/* Upload Area */}
            <Box
                sx={{
                    border: "2px dashed #1976d2",
                    padding: "20px",
                    textAlign: "center",
                    borderRadius: "10px",
                    backgroundColor: isDragActive ? "#f0f8ff" : "#fafafa",
                    transition: "background-color 0.3s",
                }}
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                <CloudUploadIcon sx={{ fontSize: 50, color: "#1976d2" }} />
                <Typography variant="h6" mt={2}>
                    {isDragActive
                        ? "Drop the Excel file here..."
                        : "Drag & Drop or Click to Upload an Excel file"}
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }}>
                    Browse File
                </Button>

                {/* Loader / Error inside the upload area */}
                {loader && (
                    <Typography sx={{ mt: 2, color: "error.main" }}>
                        <CircularProgress />
                    </Typography>
                )}
                {!loader && error && (
                    <Typography sx={{ mt: 2, color: "error.main" }}>
                        {error}
                    </Typography>
                )}
            </Box>

            {/* Data Summary Section (Outside the Upload Box) */}
            {!loader && file && extractedData && (
                <Box sx={{ mt: 4, padding: 2, border: "1px solid #ccc", borderRadius: "8px" }}>
                    <Typography variant="h6" mb={2}>
                        Data Summary
                    </Typography>

                    {/* File Info */}
                    <List>
                        <ListItem>
                            <ListItemText
                                primary={file.name}
                                secondary={`${(file.size / 1024).toFixed(2)} KB`}
                            />
                        </ListItem>
                    </List>

                    {/* Summary Details */}
                    <List>
                        <ListItem>
                            <ListItemText primary={`Total Records: ${totalRecords}`} />
                        </ListItem>
                        {errorRecords && errorRecords.length > 0 && (
                            <>
                                <Typography variant="subtitle1" color="error" mt={2}>
                                    Errors (Missing Required Fields):
                                </Typography>
                                {errorRecords.map((err, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={err} />
                                    </ListItem>
                                ))}
                            </>
                        )}
                    </List>
                </Box>
            )}
        </>

    );
};

export default UploadsExcelFile;
