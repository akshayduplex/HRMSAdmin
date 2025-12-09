import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Button, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { JsonDataParsed, uploadsFiles } from "../slices/ImportCandidateSlice/ImportCandidate";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

const REQUIRED_FIELDS = [
    "email",
    "name",
    "mobile_no",
];


const UploadsExcelFile = () => {
    // const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [loader, setLoader] = useState(false);

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
                        raw: true
                    });

                    if (rawData.length === 0) return reject("Empty file!");

                    const headers = rawData[0].map((header, index) => header || `Empty_Column_${index + 1}`);

                    const formattedData = rawData.slice(1).map(row => {
                        return headers.reduce((obj, header, index) => {
                            obj[header] = row[index] !== undefined ? row[index] : "";
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
                dispatch(JsonDataParsed(data))
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

            // Check only required fields
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
                    <Typography variant="h6" mb={2} textAlign={"center"}>
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
