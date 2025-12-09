import React, { useRef } from 'react';
import {
    Box, Typography, Grid, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    Paper, Button
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import config from '../../../config/config';
import moment from 'moment';
import CreateIcon from '@mui/icons-material/Create';
import { useReactToPrint } from 'react-to-print';

const JoiningReportForm = ({ candidateData, setEditApplicant }) => {

    const formRef = useRef();

    const handlePrint = useReactToPrint({
        contentRef: formRef,  // ✔ correctly named
        pageStyle: `
        @media print {
        body { margin: 0; }
        .MuiPaper-root {
            box-shadow: none !important;
            padding: 0 !important;
            max-width: 100% !important;
        }
        }
  `
    });
    return (
        <>
            <Box sx={{
                textAlign: 'center',
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Button
                    variant="contained"
                    sx={{
                        textAlign: 'center',
                        alignItems: 'center',
                        marginBottom: "5px"
                    }}
                    color="primary"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                >
                    Print Form
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        textAlign: 'center',
                        alignItems: 'center',
                        marginBottom: '5px',
                    }}
                    startIcon={<CreateIcon />}
                    onClick={() => setEditApplicant(true)}
                >
                    Edit Form
                </Button>
            </Box>

            <Box ref={formRef} sx={{
                maxWidth: 900,
                margin: '20px auto',
                padding: 2,
                fontFamily: 'Arial, sans-serif',
                '@media print': {
                    padding: 0,
                    margin: 0,
                    maxWidth: '100%'
                }

            }}>
                <Paper elevation={0} sx={{
                    padding: 3,
                    border: '1px solid #000',
                    '@media print': {
                        border: 'none',
                        padding: 0
                    }
                }}>
                    {/* Logo Placeholder */}
                    <Box textAlign="start" mb={2}>
                        <Grid item xs={4}>
                            <img src='/logo512.png' alt='hlfppt logo' />
                        </Grid>
                    </Box>

                    {/* Header Section - Exact Match */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{
                            textDecoration: 'underline',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            mb: 1
                        }}>
                            ANNEXURE 11
                        </Typography>

                        <Typography variant="h6" sx={{
                            fontWeight: 'bold',
                            textDecoration: 'underline',
                            fontSize: '1.1rem',
                            mb: 1
                        }}>
                            HINDUSTAN LATEX FAMILY PLANNING PROMOTION TRUST
                        </Typography>

                        <Typography variant="h6" sx={{
                            fontWeight: 'bold',
                            textDecoration: 'underline',
                            fontSize: '1.1rem',
                            mb: 2
                        }}>
                            JOINING REPORT
                        </Typography>
                    </Box>

                    {/* Instructions - Exact Original Format */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                            Instructions:
                        </Typography>
                        <ol style={{ marginTop: 8, marginBottom: 0, paddingLeft: 24 }}>
                            <li>
                                <Typography variant="body2">
                                    Fill the form furnishing all relevant information against all questions asked.
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2">
                                    The form is required to be submitted to the HR Department at the project site.
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2">
                                    Please attach the attested Photostat copies of the certificates or testimonial in support of your age, qualification, experience and salary.
                                </Typography>
                            </li>
                        </ol>
                    </Box>

                    {/* Employee Information - Document-style layout */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {[
                            { label: 'Name', value: candidateData?.name || "____" },
                            { label: 'Date of Joining', value: candidateData?.annexure_eleven_form_data?.candidate_doj || "____" },
                            { label: 'Date of Birth', value: candidateData?.annexure_eleven_form_data?.candidate_dob || "" },
                            { label: 'Father\'s Name', value: candidateData?.applicant_form_data?.father_hushband_name || "_______" },
                            { label: 'Place of Posting', value: candidateData?.annexure_eleven_form_data?.place_of_posting || "_____" },
                        ].map((item, index) => (
                            <React.Fragment key={index}>
                                <Grid item xs={2}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        {item.label}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="body2" sx={{ borderBottom: '1px solid #000' }}>
                                        {item.value}
                                    </Typography>
                                </Grid>
                            </React.Fragment>
                        ))}

                        {/* HR Section - Document-style */}
                        <Grid item xs={2}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Employee No.
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body2" sx={{ borderBottom: '1px solid #000', fontStyle: 'italic' }}>
                                {candidateData?.annexure_eleven_form_data?.employee_number || "___________"}
                            </Typography>
                        </Grid>

                        <Grid item xs={2}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Reporting Time
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body2" sx={{ borderBottom: '1px solid #000' }}>
                                {candidateData?.annexure_eleven_form_data?.reporting_time || "___________"}
                            </Typography>
                        </Grid>

                        <Grid item xs={2}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Designation
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body2" sx={{ borderBottom: '1px solid #000' }}>
                                {candidateData?.annexure_eleven_form_data?.designation || "___________"}
                            </Typography>
                        </Grid>

                        <Grid item xs={2}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Reporting Manager
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body2" sx={{ borderBottom: '1px solid #000' }}>
                                {candidateData?.annexure_eleven_form_data?.reporting_manager || "___________"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} mt={2}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                *Address for Communication:
                            </Typography>
                            <Box
                                sx={{
                                    border: '1px solid #ccc',
                                    borderRadius: 1,
                                    p: 1,
                                    minHeight: 100,
                                    maxHeight: 250,
                                    overflowY: 'auto',
                                    typography: 'body2',
                                    '&:focus': {
                                        outline: '2px solid #1976d2',
                                        outlineOffset: '2px',
                                    },
                                    cursor: 'text',
                                    backgroundColor: '#fafafa'
                                }}
                            >
                                {candidateData?.applicant_form_data?.communication_address?.address || ""}
                            </Box>
                        </Grid>


                        <Grid item xs={2}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Contact Number
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body2" sx={{ borderBottom: '1px solid #000' }}>
                                {candidateData?.applicant_form_data?.communication_address?.mobile_no || ""}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Email ID
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body2" sx={{ borderBottom: '1px solid #000' }}>
                                {candidateData?.applicant_form_data?.communication_address?.email_id || ""}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} mt={2}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                Permanent Address
                            </Typography>
                            <Box
                                sx={{
                                    border: '1px solid #ccc',
                                    borderRadius: 1,
                                    p: 1,
                                    minHeight: 100,
                                    maxHeight: 250,
                                    overflowY: 'auto',
                                    typography: 'body2',
                                    '&:focus': {
                                        outline: '2px solid #1976d2',
                                        outlineOffset: '2px',
                                    },
                                    cursor: 'text',
                                    backgroundColor: '#fafafa'
                                }}
                            >
                                {candidateData?.applicant_form_data?.permanent_address?.email_id || ""}
                            </Box>
                        </Grid>

                        <Grid item xs={2}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Contact Number
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body2" sx={{ borderBottom: '1px solid #000' }}>
                                {candidateData?.applicant_form_data?.permanent_address?.mobile_no || ""}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Email ID
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body2" sx={{ borderBottom: '1px solid #000' }}>
                                {candidateData?.applicant_form_data?.permanent_address?.email_id || ""}
                            </Typography>
                        </Grid>

                        {/* Personal Details */}
                        <Grid item xs={2}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Sex
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body2" sx={{ borderBottom: '1px solid #000' }}>
                                {candidateData?.applicant_form_data?.gender || ""}
                            </Typography>
                        </Grid>

                        <Grid item xs={2}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Marital Status
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body2" sx={{ borderBottom: '1px solid #000' }}>
                                {candidateData?.applicant_form_data?.marital_status || ""}
                            </Typography>
                        </Grid>

                        <Grid item xs={2}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Date of Wedding
                            </Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="body2" sx={{ borderBottom: '1px solid #000' }}>
                                {candidateData?.annexure_eleven_form_data?.candidate_date_of_wedding || ""}
                            </Typography>
                        </Grid>

                        <Grid item xs={2}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                No. of Children : Male: Female:
                            </Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="body2" sx={{ borderBottom: '1px solid #000' }}>
                                {candidateData?.annexure_eleven_form_data?.no_of_children || "0:0"}
                            </Typography>
                        </Grid>

                        <Grid item xs={2}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Blood Group
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body2" sx={{ borderBottom: '1px solid #000' }}>
                                {candidateData?.annexure_eleven_form_data?.blood_group || ""}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                *PAN No. :
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body2" sx={{ borderBottom: '1px solid #000' }}>
                                {candidateData?.annexure_eleven_form_data?.pan_number || ""}
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Family Details - Exact Table Structure */}
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1, textDecoration: 'underline' }}>
                        *Personal Family Details:
                    </Typography>
                    <TableContainer component={Paper} sx={{ mb: 3, border: '1px solid #000' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #000' }}>S.No</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #000' }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #000' }}>Date of Birth</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #000' }}>Age</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #000' }}>Relationship</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #000' }}>Occupation Pls. Specify</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #000' }}>Whether Dependent or not</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {candidateData?.applicant_form_data && candidateData?.applicant_form_data?.length > 0 ? candidateData?.applicant_form_data?.family_members.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ border: '1px solid #000' }}>{index + 1}</TableCell>
                                        <TableCell sx={{ border: '1px solid #000' }}>{row.name}</TableCell>
                                        <TableCell sx={{ border: '1px solid #000' }}>{row.date_of_birth || "N/A"}</TableCell>
                                        <TableCell sx={{ border: '1px solid #000' }}>{row.age}</TableCell>
                                        <TableCell sx={{ border: '1px solid #000' }}>{row.particulars}</TableCell>
                                        <TableCell sx={{ border: '1px solid #000' }}>{row.occupation}</TableCell>
                                        <TableCell sx={{ border: '1px solid #000' }}>{row.is_dependent}</TableCell>
                                    </TableRow>
                                )) : <TableRow>
                                    <TableCell colSpan={7} sx={{ border: '1px solid #000' }}>No Records Found</TableCell>
                                </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Emergency Contacts - Document-style */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                                *Emergency Contact Details (Local)
                            </Typography>
                            <Box sx={{ pl: 1, mt: 1 }}>
                                <Typography variant="body2">
                                    <strong>Name -</strong> {candidateData?.annexure_eleven_form_data?.emergency_contact_local?.name || ""}

                                </Typography>
                                <Typography variant="body2">
                                    <strong>Contact --</strong> {candidateData?.annexure_eleven_form_data?.emergency_contact_local?.contact_no || ""}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Address-</strong> {candidateData?.annexure_eleven_form_data?.emergency_contact_local?.address || ""}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                                *Emergency Contact Details (Permanent)
                            </Typography>
                            <Box sx={{ pl: 1, mt: 1 }}>
                                <Typography variant="body2">
                                    <strong>Name -</strong> {candidateData?.annexure_eleven_form_data?.emergency_contact_permanent?.name || ""}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Contact -</strong> {candidateData?.annexure_eleven_form_data?.emergency_contact_permanent?.contact_no || ""}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Address-</strong> {candidateData?.annexure_eleven_form_data?.emergency_contact_permanent?.address || ""}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Bank Details */}
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1, textDecoration: 'underline' }}>
                        *Bank Details- Option to attach Cancel cheque
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={4}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Name of Bank</Typography>
                            <Typography variant="body2" sx={{ borderBottom: '1px solid #000', minHeight: 24 }}>
                                {candidateData?.annexure_eleven_form_data?.bank_details?.bank_name || ""}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Branch & IFSC Code</Typography>
                            <Typography variant="body2" sx={{ borderBottom: '1px solid #000', minHeight: 24 }}>
                                {candidateData?.annexure_eleven_form_data?.bank_details?.branch_ifsc || ""}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Account No.</Typography>
                            <Typography variant="body2" sx={{ borderBottom: '1px solid #000', minHeight: 24 }}>
                                {candidateData?.annexure_eleven_form_data?.bank_details?.account_no || ""}
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Previous Employment */}
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1, textDecoration: 'underline' }}>
                        Details of previous employer:
                    </Typography>
                    <TableContainer component={Paper} sx={{ mb: 2, border: '1px solid #000' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #000' }}>Name of the last Organization & Address</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #000' }}>Your Designation</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #000' }}>Reporting Manager (Name with Designation) Email + Mobile Number</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #000' }}>Tenure From ............ To ...........</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ border: '1px solid #000' }}>{candidateData?.annexure_eleven_form_data?.previous_organization_details?.previous_org_name || ""}</TableCell>
                                    <TableCell sx={{ border: '1px solid #000' }}>{candidateData?.annexure_eleven_form_data?.previous_organization_details?.previous_designation || ""}</TableCell>
                                    <TableCell sx={{ border: '1px solid #000' }}>{candidateData?.annexure_eleven_form_data?.previous_organization_details?.previous_reporting_mng_name || ""} , {candidateData?.annexure_eleven_form_data?.previous_organization_details?.previous_reporting_mng_designation || ""} , {candidateData?.annexure_eleven_form_data?.previous_organization_details?.previous_reporting_mng_email || ""} , {candidateData?.annexure_eleven_form_data?.previous_organization_details?.previous_reporting_mng_mobile_no || ""} </TableCell>
                                    <TableCell sx={{ border: '1px solid #000' }}>{candidateData?.annexure_eleven_form_data?.previous_organization_details?.previous_from || ""} to {candidateData?.annexure_eleven_form_data?.previous_organization_details?.previous_to || ""}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            PF Account No. of the last organization:
                        </Typography>
                        <Typography variant="body2" sx={{ borderBottom: '1px solid #000', minHeight: 24 }}>
                            {candidateData?.annexure_eleven_form_data?.previous_organization_details?.previous_pf || ""}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            PF Universal Account No. (UAN)
                        </Typography>
                        <Typography variant="body2" sx={{ borderBottom: '1px solid #000', minHeight: 24 }}>
                            {candidateData?.annexure_eleven_form_data?.previous_organization_details?.previous_pan_no || ""}
                        </Typography>
                    </Box>

                    {/* Declaration */}
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1, textDecoration: 'underline' }}>
                        DECLARATION:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        I, <strong>{candidateData?.name}</strong> son/ daughter of <strong>{candidateData?.applicant_form_data?.father_hushband_name}</strong>, solemnly declare that the information furnished by me is true to the best of my knowledge and that I'll inform the Human Resource Department, HLFPPT regarding any change in the above information within one week from the time of its change.
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    // bgcolor: '#f8f8f8',
                                    minHeight: '40px',
                                    // border: '1px solid #e0e0e0',
                                    // borderRadius: 1
                                }}
                            >
                                <Typography variant="subtitle2" color="textSecondary">
                                    Date
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {moment().format('DD/MM/YYYY')}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    // bgcolor: '#f8f8f8',
                                    minHeight: '40px',
                                    // border: '1px solid #e0e0e0',
                                    // borderRadius: 1
                                }}
                            >
                                <Typography variant="subtitle2" color="textSecondary">
                                    Signature
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        minHeight: '50px'
                                    }}
                                >
                                    {candidateData?.applicant_form_data?.signature ? (
                                        <Box
                                            component="img"
                                            src={config.IMAGE_PATH + candidateData?.applicant_form_data?.signature || ""}
                                            alt="Signature"
                                            sx={{
                                                maxHeight: '50px',
                                                objectFit: 'contain',
                                                width: 'auto',
                                                filter: 'brightness(0.8)',  // Makes signature look more natural
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            component="img"
                                            src="/path/to/default-signature.png"  // Replace with your default signature image
                                            alt="Default Signature"
                                            sx={{
                                                maxHeight: '50px',
                                                objectFit: 'contain',
                                                width: 'auto',
                                                opacity: 0.7
                                            }}
                                        />
                                    )}
                                </Typography>

                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    // bgcolor: '#f8f8f8',
                                    minHeight: '40px',
                                    // border: '1px solid #e0e0e0',
                                    // borderRadius: 1
                                }}
                            >
                                <Typography variant="subtitle2" color="textSecondary">
                                    Place
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {candidateData?.annexure_eleven_form_data?.place_of_posting || ""}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    minHeight: '60px',
                                    borderBottom: '1px solid #999', // mimic signature underline
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    // bgcolor: '#fdfdfd'
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color="textSecondary"
                                    sx={{ mb: 0.5 }}
                                >
                                    Name
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontFamily: `'Dancing Script', 'Pacifico', 'Cedarville Cursive', cursive`,
                                        fontSize: '1rem',
                                        color: '#333',
                                        minHeight: '32px',
                                    }}
                                >
                                    {candidateData?.name}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

        </>
    );
};

export default JoiningReportForm;