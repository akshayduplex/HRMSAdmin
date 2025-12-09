import React, { useMemo, useRef } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Grid, Button, TableHead } from '@mui/material';
import { styled } from '@mui/material/styles';
import config from '../../../config/config';
import moment from 'moment';
import PrintIcon from '@mui/icons-material/Print';
import { CamelCases } from '../../../utils/common';
import CreateIcon from '@mui/icons-material/Create';
import { useReactToPrint } from 'react-to-print';


// Styled components for consistent design
const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    textDecoration: 'underline',
    margin: '12px 0 6px 0',
    fontSize: '1.1rem',
}));

const FieldLabel = styled(Typography)({
    fontWeight: 'bold',
    marginRight: '6px',
    minWidth: '200px',
    fontSize: '0.85rem',
});

const FieldContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    margin: '6px 0',
});

const UnderlinedField = styled(Box)({
    flexGrow: 1,
    borderBottom: '1px solid black',
    height: '20px',
    marginLeft: '6px',
});

const FormContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    fontFamily: 'Arial, sans-serif',
    maxWidth: '900px',
    margin: '0 auto',
    fontSize: '0.85rem',
    '@media print': {
        boxShadow: 'none',
        padding: 0,
        maxWidth: '100%',
        fontSize: '0.75rem', // Reduced font size for better fit
        // Add print-specific styles
        '& .print-section': {
            pageBreakInside: 'avoid',
        },
        '& table': {
            pageBreakInside: 'avoid',
        },
        '& .keep-together': {
            pageBreakInside: 'avoid',
        },
    },
}));

const PhotoPlaceholder = styled(Box)({
    border: '1px dashed #ccc',
    height: '120px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    fontSize: '0.75rem',
});


const ApplicantForm = ({ candidate_data, setEditApplicant }) => {

    const formRef = useRef();

    const appliedJob = useMemo(() => {
        return candidate_data?.applied_jobs?.find((item) => item.job_id === candidate_data?.job_id)
    }, [candidate_data])


    const applicant_form = useMemo(() => {

        return candidate_data?.applicant_form_data || {};

    }, [candidate_data])

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

            {
                candidate_data && candidate_data?.applicant_form_status === 'Complete' && (
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
                )
            }


            <FormContainer elevation={3} ref={formRef}>
                {/* Header Section */}
                <div className='print-section'>
                    <Box textAlign="start" mb={2}>
                        <Grid item xs={4}>
                            <img src='/logo512.png' alt='hlfppt logo' />
                        </Grid>
                    </Box>

                    <Box textAlign="center" mb={2} p={2}>
                        <Typography variant="h5" fontWeight="bold" fontSize="1.3rem" color={'#3685fe'}>
                            HINDUSTAN LATEX FAMILY PLANNING PROMOTION TRUST
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" mt={0.5} mb={1} fontSize="1.4rem" color={'#3685fe'}>
                            APPLICATION BLANK
                        </Typography>
                    </Box>

                    {/* Instructions with Photo */}
                    <Grid container spacing={2} mb={2}>
                        <Grid item xs={8}>
                            <Box p={1} height="100%">
                                <Typography variant="body1" fontWeight="bold" fontSize="0.9rem">
                                    INSTRUCTIONS:
                                </Typography>
                                <Typography variant="body2" fontStyle="italic" fontSize="0.8rem">
                                    * Please fill the form in Block Letters filling all the fields
                                </Typography>
                                <Typography variant="body2" fontStyle="italic" fontSize="0.8rem">
                                    * Please mark NA against columns, which are not applicable to you
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                height="150px" // ~4.5cm on screen, adjust for PDF DPI if needed
                                width="117px"  // ~3.5cm on screen
                                border="1px dashed #000"
                                p={0.5}
                                sx={{
                                    mx: "auto",
                                    position: "relative",
                                    overflow: "hidden",
                                    backgroundColor: "#f9f9f9",
                                }}
                            >
                                <Box
                                    component="img"
                                    src={config.IMAGE_PATH + candidate_data?.applicant_form_data?.profile_image || ""}
                                    alt="Passport Photo Placeholder"
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        opacity: 0.8,
                                    }}
                                />
                                <Typography
                                    variant="caption"
                                    sx={{
                                        position: "absolute",
                                        bottom: 4,
                                        left: 0,
                                        right: 0,
                                        textAlign: "center",
                                        background: "rgba(255,255,255,0.7)",
                                        fontSize: "0.65rem",
                                    }}
                                >
                                    3.5cm x 4.5cm
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Position and Interview Details */}
                    <Box
                        mb={2}
                        borderBottom={1}
                        borderColor="#000"
                        sx={{ borderBottomStyle: 'dashed' }}
                    >
                        <FieldContainer>
                            <FieldLabel>Post Applied for:</FieldLabel>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    textDecoration: 'underline',
                                    flex: 1,
                                    minWidth: '180px', // ensures underline extends visibly
                                }}
                            >
                                {candidate_data.job_title || "\u00A0"}
                            </Typography>

                            <FieldLabel>Date Of Interview:</FieldLabel>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    textDecoration: 'underline',
                                    flex: 1,
                                    minWidth: '180px',
                                }}
                            >
                                {
                                    (!["Applied", "Shortlisted"].includes(appliedJob?.form_status) && Array.isArray(appliedJob?.interviewer) && appliedJob?.interviewer.length > 0) ?
                                        moment(appliedJob?.interview_date).format('DD/MM/YYYY') || "\u00A0"
                                        : "\u00A0"
                                }
                            </Typography>
                        </FieldContainer>

                        <FieldContainer>
                            <FieldLabel>Venue Of Interview:</FieldLabel>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    textDecoration: 'underline',
                                    flex: 1,
                                    minWidth: '180px',
                                }}
                            >
                                {
                                    (!["Applied", "Shortlisted"].includes(appliedJob?.form_status) && Array.isArray(appliedJob?.interviewer) && appliedJob?.interviewer.length > 0) ?
                                        appliedJob?.interview_type === 'Online' ? 'Virtual' : appliedJob?.venue_location || "\u00A0"
                                        : "\u00A0"
                                }
                            </Typography>

                            <FieldLabel>Time of Interview:</FieldLabel>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    textDecoration: 'underline',
                                    flex: 1,
                                    minWidth: '180px',
                                }}
                            >
                                {
                                    (!["Applied", "Shortlisted"].includes(appliedJob?.form_status) && Array.isArray(appliedJob?.interviewer) && appliedJob?.interviewer.length > 0) ?
                                        moment.utc(appliedJob?.interview_date).format('hh:mm A') || "\u00A0"
                                        : "\u00A0"
                                }
                            </Typography>
                        </FieldContainer>

                        <FieldContainer>
                            <FieldLabel>Referred By:</FieldLabel>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    textDecoration: 'underline',
                                    flex: 1,
                                    minWidth: '180px',
                                }}
                            >
                                {candidate_data.reference_employee || "\u00A0"}
                            </Typography>
                        </FieldContainer>
                    </Box>

                </div>

                <div className='print-section keep-together'>

                    {/* Personal Data Section */}
                    <SectionTitle variant="h5" textAlign="center">PERSONAL DATA</SectionTitle>

                    {/* Name */}
                    <FieldContainer>
                        <FieldLabel>1. Name:</FieldLabel>

                        {/* First Name */}
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                minWidth: '160px',
                                px: 0.5,
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {applicant_form?.full_name?.first_name || "\u00A0"}
                            </Typography>
                        </Box>
                        <Typography sx={{ mx: 0.5, fontSize: '0.8rem' }}>(First Name)</Typography>

                        {/* Middle Name */}
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                minWidth: '160px',
                                px: 0.5,
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {applicant_form?.full_name?.middle_name || "\u00A0"}
                            </Typography>
                        </Box>
                        <Typography sx={{ mx: 0.5, fontSize: '0.8rem' }}>(Middle Name)</Typography>

                        {/* Surname */}
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                minWidth: '160px',
                                px: 0.5,
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {applicant_form?.full_name?.surname || "\u00A0"}
                            </Typography>
                        </Box>
                        <Typography sx={{ mx: 0.5, fontSize: '0.8rem' }}>(Surname)</Typography>
                    </FieldContainer>


                    {/* Father's/Husband's Name */}
                    <FieldContainer>
                        <FieldLabel>2. Father's / Husband's Name:</FieldLabel>
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                // minWidth: '100%',
                                flex: 1,
                                px: 0.5,
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {applicant_form?.father_hushband_name || "\u00A0"}
                            </Typography>
                        </Box>
                    </FieldContainer>

                    {/* Address for Communication */}
                    <FieldContainer>
                        <FieldLabel>3. Address for Communication:</FieldLabel>
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                flex: 1,
                                px: 0.5,
                                minHeight: '24px',
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {applicant_form?.communication_address?.address || "\u00A0"}
                            </Typography>
                        </Box>
                    </FieldContainer>

                    {/* Pin Code */}
                    <FieldContainer>
                        <Box sx={{ width: '200px' }} />
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                flex: 1,
                                px: 0.5,
                                minHeight: '24px',
                            }}
                        >
                        </Box>

                        <FieldLabel sx={{ minWidth: '120px', ml: 2 }}>Pin Code:</FieldLabel>
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                flex: '0 0 170px',
                                px: 0.5,
                                minHeight: '24px',
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {applicant_form?.communication_address?.pincode || "\u00A0"}
                            </Typography>
                        </Box>
                    </FieldContainer>

                    {/* Telephone and Mobile */}
                    <FieldContainer>
                        <FieldLabel>Telephone No:</FieldLabel>
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                flex: '0 0 170px',
                                px: 0.5,
                                minHeight: '24px',
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {applicant_form?.communication_address?.telephone || "\u00A0"}
                            </Typography>
                        </Box>

                        <FieldLabel sx={{ minWidth: '120px', ml: 2 }}>Mobile No:</FieldLabel>
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                flex: '0 0 170px',
                                px: 0.5,
                                minHeight: '24px',
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {applicant_form?.communication_address?.mobile_no || "\u00A0"}
                            </Typography>
                        </Box>
                    </FieldContainer>

                    {/* Email */}
                    <FieldContainer>
                        <FieldLabel>Email id:</FieldLabel>
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                flex: '0 0 300px',
                                px: 0.5,
                                minHeight: '24px',
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {applicant_form?.communication_address?.email_id || "\u00A0"}
                            </Typography>
                        </Box>
                    </FieldContainer>


                    {/* Permanent Address */}
                    <FieldContainer>
                        <FieldLabel>4. Permanent Address:</FieldLabel>
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                flex: 1,
                                px: 0.5,
                                minHeight: '24px',
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {applicant_form?.permanent_address?.address || "\u00A0"}
                            </Typography>
                        </Box>
                    </FieldContainer>
                    <FieldContainer>
                        <Box sx={{ width: '200px' }} /> {/* empty spacer to align with label above */}
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                flex: 1,
                                px: 0.5,
                                minHeight: '24px',
                            }}
                        >
                        </Box>

                        <FieldLabel sx={{ minWidth: '120px', ml: 2 }}>Pin Code:</FieldLabel>
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                flex: '0 0 170px',
                                px: 0.5,
                                minHeight: '24px',
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {applicant_form?.permanent_address?.pincode || "\u00A0"}
                            </Typography>
                        </Box>
                    </FieldContainer>
                    <FieldContainer>
                        <FieldLabel>Telephone No:</FieldLabel>
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                flex: '0 0 170px',
                                px: 0.5,
                                minHeight: '24px',
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {applicant_form?.permanent_address?.telephone || "\u00A0"}
                            </Typography>
                        </Box>

                        <FieldLabel sx={{ minWidth: '120px', ml: 2 }}>Mobile No:</FieldLabel>
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                flex: '0 0 170px',
                                px: 0.5,
                                minHeight: '24px',
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {applicant_form?.permanent_address?.mobile_no || "\u00A0"}
                            </Typography>
                        </Box>
                    </FieldContainer>

                    {/* Date of Birth */}
                    <FieldContainer>
                        <FieldLabel>5. Date Of Birth & Age:</FieldLabel>
                        <Typography fontSize="0.85rem">In Figures</Typography>
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                flex: 1,
                                px: 0.5,
                                minHeight: '24px',
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    whiteSpace: 'nowrap',
                                    width: '40px', mx: 0.5
                                }}
                            >
                                {applicant_form?.dob?.in_words || "\u00A0"}
                            </Typography>
                        </Box>
                        <Typography fontSize="0.8rem">(Date)</Typography>
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                flex: 1,
                                px: 0.5,
                                minHeight: '24px',
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    whiteSpace: 'nowrap',
                                    width: '40px', mx: 0.5
                                }}
                            >
                                {applicant_form?.dob?.date || "\u00A0"}
                            </Typography>
                        </Box>
                        <Typography fontSize="0.8rem">(Month)</Typography>
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                flex: 1,
                                px: 0.5,
                                minHeight: '24px',
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    whiteSpace: 'nowrap',
                                    width: '40px', mx: 0.5
                                }}
                            >
                                {applicant_form?.dob?.month || "\u00A0"}
                            </Typography>
                        </Box>
                        <Typography fontSize="0.85rem">Years</Typography>
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                flex: 1,
                                px: 0.5,
                                minHeight: '24px',
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    whiteSpace: 'nowrap',
                                    width: '40px', mx: 0.5
                                }}
                            >
                                {applicant_form?.dob?.year || "\u00A0"}
                            </Typography>
                        </Box>
                    </FieldContainer>

                    {/* Gender */}
                    <FieldContainer>
                        <FieldLabel>6. Gender:</FieldLabel>
                        <Typography sx={{ mr: 1, fontSize: '0.85rem' }}>{CamelCases(applicant_form?.gender)}</Typography>
                        {/* <Typography sx={{ mr: 1, fontSize: '0.85rem' }}>Female</Typography> */}
                    </FieldContainer>

                    {/* Marital Status */}
                    <FieldContainer>
                        <FieldLabel>7. Marital Status:</FieldLabel>
                        {/* <UnderlinedField sx={{ width: '170px' }} /> */}
                        <Box
                            sx={{
                                borderBottom: '1px solid #000',
                                flex: '0 0 170px',
                                px: 0.5,
                                minHeight: '24px',
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                    // width: '170px'
                                }}
                            >
                                {CamelCases(applicant_form?.marital_status) || "\u00A0"}
                            </Typography>
                        </Box>
                    </FieldContainer>

                    {/* Languages Known */}
                    <Typography fontWeight="bold" mt={1.5} mb={0.5} fontSize="0.9rem">
                        8. Languages Known (Please specify your mother tongue):
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 1.5, overflowX: 'hidden' }}>
                        <Table size="small" sx={{ tableLayout: 'fixed' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            fontWeight: 'bold',
                                            borderRight: 1,
                                            borderColor: '#ddd',
                                            fontSize: '0.8rem',
                                            py: 0.5,
                                            px: 1,
                                            width: '40px', // S.NO fixed width
                                        }}
                                    >
                                        S.NO
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: 'bold',
                                            borderRight: 1,
                                            borderColor: '#ddd',
                                            fontSize: '0.8rem',
                                            py: 0.5,
                                            px: 1,
                                            width: '140px', // Languages fixed width
                                        }}
                                    >
                                        Languages
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: 'bold',
                                            borderRight: 1,
                                            borderColor: '#ddd',
                                            fontSize: '0.8rem',
                                            py: 0.5,
                                            px: 1,
                                            width: '80px',
                                        }}
                                    >
                                        Read
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: 'bold',
                                            borderRight: 1,
                                            borderColor: '#ddd',
                                            fontSize: '0.8rem',
                                            py: 0.5,
                                            px: 1,
                                            width: '80px',
                                        }}
                                    >
                                        Speak
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: '0.8rem',
                                            py: 0.5,
                                            px: 1,
                                            width: '80px',
                                        }}
                                    >
                                        Write
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {applicant_form?.language?.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell
                                            sx={{
                                                borderRight: 1,
                                                borderColor: '#ddd',
                                                fontSize: '0.8rem',
                                                py: 0.5,
                                                px: 1,
                                            }}
                                            align="center"
                                        >
                                            {index + 1}
                                        </TableCell>

                                        {['name', 'read', 'speak', 'write'].map((field, idx) => (
                                            <TableCell
                                                key={field}
                                                sx={{
                                                    borderRight: idx !== 3 ? 1 : 0,
                                                    borderColor: '#ddd',
                                                    py: 0.5,
                                                    px: 1,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        height: '20px',
                                                        borderBottom: 1,
                                                        borderColor: '#000',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            fontSize: '0.8rem',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            width: '100%',
                                                        }}
                                                    >
                                                        {CamelCases(row?.[field]) || "\u00A0"}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </div>

                <div className='print-section keep-together'>
                    {/* Family Members */}
                    <Typography fontWeight="bold" mt={1.5} mb={0.5} fontSize="0.9rem">
                        9. Details Of Family Members:
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 1.5 }}>
                        <Table size="small">
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Particulars</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Age (in Yrs)</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Details of Occupation</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', py: 0.5, px: 1 }}>Whether Dependent Or Not</TableCell>
                                </TableRow>
                                {applicant_form?.family_members?.map((relation) => (
                                    <TableRow key={relation}>
                                        <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>{relation?.particular || "NA"}</TableCell>
                                        <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                            <Box
                                                sx={{
                                                    height: '20px',
                                                    borderBottom: 1,
                                                    borderColor: '#000',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontSize: '0.8rem',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        width: '100%',
                                                    }}
                                                >
                                                    {relation?.name || "\u00A0"}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                            <Box
                                                sx={{
                                                    height: '20px',
                                                    borderBottom: 1,
                                                    borderColor: '#000',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontSize: '0.8rem',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        width: '100%',
                                                    }}
                                                >
                                                    {relation?.age || "\u00A0"}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                            <Box
                                                sx={{
                                                    height: '20px',
                                                    borderBottom: 1,
                                                    borderColor: '#000',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontSize: '0.8rem',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        width: '100%',
                                                    }}
                                                >
                                                    {CamelCases(relation?.occupation) || "\u00A0"}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ py: 0.5, px: 1 }}>
                                            <Box
                                                sx={{
                                                    height: '20px',
                                                    borderBottom: 1,
                                                    borderColor: '#000',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontSize: '0.8rem',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        width: '100%',
                                                    }}
                                                >
                                                    {CamelCases(relation?.is_dependent) || "\u00A0"}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Strengths & Weaknesses */}
                    <Typography fontWeight="bold" mt={1.5} mb={0.5} fontSize="0.9rem">
                        10. Please specify your major strengths & weaknesses.
                    </Typography>

                    <Box
                        display="flex"
                        gap={2}
                        mb={1.5}
                        flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
                    >
                        <Box flex={1}>
                            <Typography
                                fontWeight="bold"
                                fontSize="0.8rem"
                                mb={0.5}
                            >
                                Major Strengths
                            </Typography>
                            <Box
                                sx={{
                                    minHeight: '150px',
                                    // maxHeight: '200px',
                                    border: '1px solid #000',
                                    p: 1,
                                    fontSize: '0.8rem',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                }}
                                dangerouslySetInnerHTML={{ __html: applicant_form?.weakness || "\u00A0" }}
                            />
                        </Box>
                        <Box flex={1}>
                            <Typography
                                fontWeight="bold"
                                fontSize="0.8rem"
                                mb={0.5}
                            >
                                Major Weaknesses
                            </Typography>
                            <Box
                                sx={{
                                    minHeight: '150px',
                                    // maxHeight: '200px',
                                    border: '1px solid #000',
                                    p: 1,
                                    fontSize: '0.8rem',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                }}
                                dangerouslySetInnerHTML={{ __html: applicant_form?.weakness || "\u00A0" }}
                            />
                        </Box>
                    </Box>


                    {/* Category Information */}
                    <Box mt={1.5}>
                        <FieldContainer>
                            <FieldLabel>
                                11. a. Do you belong to SC/ST/OBC/Ex‑Serviceman Category? Yes / No
                            </FieldLabel>
                        </FieldContainer>
                        <Typography variant="body2" fontSize="0.75rem">
                            (If yes, please specify and attach proof)
                        </Typography>

                        {/* Display the Yes/No answer */}
                        <Box
                            sx={{
                                borderBottom: '1px dashed #000',
                                minHeight: '40px',
                                mb: 1.5,
                                px: 0.5,
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '0.85rem',
                                wordBreak: 'break-word',
                            }}
                        >
                            {applicant_form?.belongs_to_category || "\u00A0"}
                        </Box>

                        {/* Conditionally show the “specify” field if answer is “Yes” */}
                        {applicant_form?.belongs_to_category?.toLowerCase() === 'yes' && applicant_form?.belongs_to_category_details ? (
                            <Box
                                sx={{
                                    borderBottom: '1px dashed #000',
                                    minHeight: '40px',
                                    mb: 1.5,
                                    px: 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '0.85rem',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {applicant_form?.belongs_to_category_details || "\u00A0"}
                            </Box>)
                            : null
                        }


                        <FieldContainer>
                            <FieldLabel>
                                b. Are you physically handicapped? Yes / No
                            </FieldLabel>
                        </FieldContainer>
                        <Typography variant="body2" fontSize="0.75rem">
                            (If yes, please specify and attach proof)
                        </Typography>

                        {/* Display the Yes/No answer */}
                        <Box
                            sx={{
                                borderBottom: '1px dashed #000',
                                minHeight: '40px',
                                mb: 1.5,
                                px: 0.5,
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '0.85rem',
                                wordBreak: 'break-word',
                            }}
                        >
                            {applicant_form?.physically_handicapped || "\u00A0"}
                        </Box>

                        {/* Conditionally show the “specify” field if answer is “Yes” */}
                        {applicant_form?.physically_handicapped?.toLowerCase() === 'yes' && applicant_form?.physically_handicapped_details ? (
                            <Box
                                sx={{
                                    borderBottom: '1px dashed #000',
                                    minHeight: '40px',
                                    mb: 1.5,
                                    px: 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '0.85rem',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {applicant_form?.physically_handicapped_details || "\u00A0"}
                            </Box>)
                            : null
                        }

                        <FieldContainer>
                            <FieldLabel>
                                c. Do you suffer from any major ailments? Yes / No
                            </FieldLabel>
                        </FieldContainer>
                        <Typography variant="body2" fontSize="0.75rem">
                            (If yes, please specify and attach proof)
                        </Typography>

                        {/* Display the Yes/No answer */}
                        <Box
                            sx={{
                                borderBottom: '1px dashed #000',
                                minHeight: '40px',
                                mb: 1.5,
                                px: 0.5,
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '0.85rem',
                                wordBreak: 'break-word',
                            }}
                        >
                            {applicant_form?.major_alignments || "\u00A0"}
                        </Box>

                        {/* Conditionally show the “specify” field if answer is “Yes” */}
                        {applicant_form?.major_alignments?.toLowerCase() === 'yes' && applicant_form?.major_alignments_details ? (
                            <Box
                                sx={{
                                    borderBottom: '1px dashed #000',
                                    minHeight: '40px',
                                    mb: 1.5,
                                    px: 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '0.85rem',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {applicant_form?.major_alignments_details || "\u00A0"}
                            </Box>)
                            : null
                        }

                        <FieldContainer>
                            <FieldLabel>
                                12. Have you been arrested/convicted by any Court of Law in India or Abroad? Yes / No
                            </FieldLabel>
                        </FieldContainer>
                        <Typography variant="body2" fontSize="0.75rem">
                            (If yes, please specify and attach proof)
                        </Typography>

                        {/* Display the Yes/No answer */}
                        <Box
                            sx={{
                                borderBottom: '1px dashed #000',
                                minHeight: '40px',
                                mb: 1.5,
                                px: 0.5,
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '0.85rem',
                                wordBreak: 'break-word',
                            }}
                        >
                            {applicant_form?.arrested_convicted_by_court || "\u00A0"}
                        </Box>

                        {/* Conditionally show the “specify” field if answer is “Yes” */}
                        {applicant_form?.arrested_convicted_by_court?.toLowerCase() === 'yes' && applicant_form?.arrested_convicted_by_court_details ? (
                            <Box
                                sx={{
                                    borderBottom: '1px dashed #000',
                                    minHeight: '40px',
                                    mb: 1.5,
                                    px: 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '0.85rem',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {applicant_form?.arrested_convicted_by_court_details || "\u00A0"}
                            </Box>)
                            : null
                        }
                    </Box>

                    {/* Additional Information */}
                    {[13, 14].map((num, index) => (
                        <Box key={num} mt={1.5}>
                            <FieldContainer>
                                <FieldLabel>
                                    {num}. {index === 0
                                        ? "Have you ever worked with HLFPPT before? Yes / No"
                                        : "Is your any relative/ friend/ close relationship associated with HLFPPT (Presently or in Past)? Yes / No"}
                                </FieldLabel>
                            </FieldContainer>
                            <Typography variant="body2" fontSize="0.75rem">
                                {index === 0 ? "If Yes, Please give details." : "If Yes, Please give details."}
                            </Typography>
                            <Box>
                                <Box
                                    sx={{
                                        borderBottom: '1px dashed #000',
                                        minHeight: '40px',
                                        mb: 1.5,
                                        px: 0.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '0.85rem',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {index === 0 ? applicant_form?.arrested_convicted_by_court : applicant_form?.relationship_associate_status || "\u00A0"}
                                </Box>
                                {
                                    index === 0 ? null :
                                        applicant_form?.relationship_associate_status?.toLowerCase() === 'yes' && Array.isArray(applicant_form?.relationship_associate_list) && (
                                            <>
                                                <TableContainer component={Paper} variant="outlined" sx={{ mb: 1.5 }}>
                                                    <Table size="small">
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Name</TableCell>
                                                                <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>department</TableCell>
                                                                <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Relation</TableCell>
                                                            </TableRow>
                                                            {applicant_form?.relationship_associate_list?.map((relation) => (
                                                                <TableRow key={relation}>
                                                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                        <Box
                                                                            sx={{
                                                                                height: '20px',
                                                                                borderBottom: 1,
                                                                                borderColor: '#000',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                overflow: 'hidden',
                                                                            }}
                                                                        >
                                                                            <Typography
                                                                                variant="body1"
                                                                                sx={{
                                                                                    fontSize: '0.8rem',
                                                                                    whiteSpace: 'nowrap',
                                                                                    overflow: 'hidden',
                                                                                    textOverflow: 'ellipsis',
                                                                                    width: '100%',
                                                                                }}
                                                                            >
                                                                                {relation?.name || "\u00A0"}
                                                                            </Typography>
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                        <Box
                                                                            sx={{
                                                                                height: '20px',
                                                                                borderBottom: 1,
                                                                                borderColor: '#000',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                overflow: 'hidden',
                                                                            }}
                                                                        >
                                                                            <Typography
                                                                                variant="body1"
                                                                                sx={{
                                                                                    fontSize: '0.8rem',
                                                                                    whiteSpace: 'nowrap',
                                                                                    overflow: 'hidden',
                                                                                    textOverflow: 'ellipsis',
                                                                                    width: '100%',
                                                                                }}
                                                                            >
                                                                                {relation?.department || "\u00A0"}
                                                                            </Typography>
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                        <Box
                                                                            sx={{
                                                                                height: '20px',
                                                                                borderBottom: 1,
                                                                                borderColor: '#000',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                overflow: 'hidden',
                                                                            }}
                                                                        >
                                                                            <Typography
                                                                                variant="body1"
                                                                                sx={{
                                                                                    fontSize: '0.8rem',
                                                                                    whiteSpace: 'nowrap',
                                                                                    overflow: 'hidden',
                                                                                    textOverflow: 'ellipsis',
                                                                                    width: '100%',
                                                                                }}
                                                                            >
                                                                                {CamelCases(relation?.relation) || "\u00A0"}
                                                                            </Typography>
                                                                        </Box>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </>
                                        )

                                }
                            </Box>
                        </Box>
                    ))}
                </div>

                <div className='print-section keep-together'>

                    <Typography fontWeight="bold" mt={2} mb={1}>
                        15. Details of Educational Qualification:
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Name of
                                        School/College/
                                        University</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Degree/Diploma</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Major Subjects</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>% of marks scored /Division obtained</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Course Duration From ----- To</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Years of Passing</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', py: 0.5, px: 1 }}>Full Time / Part Time</TableCell>
                                </TableRow>
                                {
                                    applicant_form?.qualification && Array.isArray(applicant_form?.qualification) ? (
                                        <>
                                            {
                                                applicant_form?.qualification.map((item) => {
                                                    return (
                                                        <>
                                                            <TableRow>
                                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                    {item?.school_college}
                                                                </TableCell>
                                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                    {item?.degree}
                                                                </TableCell>
                                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                    {item?.subject}
                                                                </TableCell>
                                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                    {item?.marks}
                                                                </TableCell>
                                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                    <Grid container gap={1}>
                                                                        <Grid item sx={6}>
                                                                            {item?.duration_from}
                                                                        </Grid>
                                                                        <Grid item sx={12}>
                                                                            {"To"}
                                                                        </Grid>
                                                                        <Grid item sx={6}>
                                                                            {item?.duration_to}
                                                                        </Grid>
                                                                    </Grid>
                                                                </TableCell>
                                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                    {item?.passing_year}
                                                                </TableCell>
                                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                    {item?.course_type === 'full_time' ? "Full Time" : 'Part Time'}
                                                                </TableCell>
                                                            </TableRow>
                                                        </>
                                                    )
                                                })
                                            }
                                        </>
                                    ) : (
                                        <>
                                            <TableRow>
                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                    <Box height="24px" borderBottom={1} borderColor="#000" />
                                                </TableCell>
                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                    <Box height="24px" borderBottom={1} borderColor="#000" />
                                                </TableCell>
                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                    <Box height="24px" borderBottom={1} borderColor="#000" />
                                                </TableCell>
                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                    <Box height="24px" borderBottom={1} borderColor="#000" />
                                                </TableCell>
                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                    <Box height="24px" borderBottom={1} borderColor="#000" />
                                                </TableCell>
                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                    <Box height="24px" borderBottom={1} borderColor="#000" />
                                                </TableCell>
                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                    <Box height="24px" borderBottom={1} borderColor="#000" />
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Typography fontWeight="bold" mt={2} mb={1}>
                        16.  Technical / Professional Training:
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Name of the course</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Organization / Institution</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Subject Learnt / Project done</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Duration From ------- To</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Stipend Received</TableCell>
                                </TableRow>
                                {
                                    applicant_form?.training && Array.isArray(applicant_form?.training)
                                        && applicant_form?.training?.length > 0 ?
                                        (
                                            <>
                                                {applicant_form?.training?.map((item) => {
                                                    return (
                                                        <>
                                                            <TableRow>

                                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                    {item?.course}
                                                                </TableCell>
                                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                    {item?.organization}
                                                                </TableCell>
                                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                    {item?.subject_project}
                                                                </TableCell>
                                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                    <Grid container gap={1}>
                                                                        <Grid item sx={6}>
                                                                            {item?.duration_from}
                                                                        </Grid>
                                                                        <Grid item sx={12}>
                                                                            {"To"}
                                                                        </Grid>
                                                                        <Grid item sx={6}>
                                                                            {item?.duration_to}
                                                                        </Grid>
                                                                    </Grid>
                                                                </TableCell>
                                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                    {item?.stipend_recieved}
                                                                </TableCell>
                                                            </TableRow>
                                                        </>
                                                    )
                                                })}
                                            </>
                                        ) :
                                        (
                                            <>
                                                <TableRow>
                                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                        <Box height="24px" borderBottom={1} borderColor="#000" />
                                                    </TableCell>
                                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                        <Box height="24px" borderBottom={1} borderColor="#000" />
                                                    </TableCell>
                                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                        <Box height="24px" borderBottom={1} borderColor="#000" />
                                                    </TableCell>
                                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                        <Box height="24px" borderBottom={1} borderColor="#000" />
                                                    </TableCell>
                                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                        <Box height="24px" borderBottom={1} borderColor="#000" />
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>


                    <Typography fontWeight="bold" mt={1.5} mb={0.2} fontSize="0.9rem">
                        17. Scholarship / Membership of any Professional Association:
                    </Typography>
                    <Box>
                        <Box p={2} height={applicant_form?.scholarship ? '150' : 50} border={1} borderColor="#000" dangerouslySetInnerHTML={{ __html: applicant_form?.scholarship || '' }} />
                    </Box>

                    <Typography fontWeight="bold" mt={1.5} mb={0.2} fontSize="0.9rem">
                        18. Extracurricular activities:
                        (Include office held, distinctions obtained in schools/ colleges, etc. )
                    </Typography>
                    <Box p={2} height={applicant_form?.extracurricular_activities ? '150' : 50} border={1} borderColor="#000" dangerouslySetInnerHTML={{ __html: applicant_form?.extracurricular_activities || '' }} />


                    <Typography fontWeight="bold" mt={2} mb={1}>
                        19.  Employment History:
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Sl. No</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Name of the Organization  Served with  Address</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Designation Held</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Nature of Work (Role & Responsibilities)</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Last Drawn CTC (in Lakhs per annum)</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Duration of Service From ------- To</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Reason of leaving</TableCell>
                                </TableRow>
                                {
                                    applicant_form?.employment_history && Array.isArray(applicant_form?.employment_history) &&
                                        applicant_form?.employment_history?.length > 0 ?
                                        (
                                            <>
                                                {applicant_form.employment_history?.map((item, index) => {
                                                    return (
                                                        <>
                                                            <TableRow key={item?._id}>
                                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                    {index + 1}
                                                                </TableCell>
                                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                    {item?.org_name}
                                                                </TableCell>
                                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                    {item?.designation}
                                                                </TableCell>
                                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                    {item?.nature_of_work}
                                                                </TableCell>
                                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                    {item?.ctc}
                                                                </TableCell>
                                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                    <Grid container spacing={1}>
                                                                        <Grid item>
                                                                            {item?.duration_from}
                                                                        </Grid>
                                                                        <Grid item>
                                                                            To
                                                                        </Grid>
                                                                        <Grid item>
                                                                            {item?.duration_to}
                                                                        </Grid>
                                                                    </Grid>
                                                                </TableCell>
                                                                <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                                    {item?.org_name}
                                                                </TableCell>
                                                            </TableRow>
                                                        </>
                                                    )
                                                })}
                                            </>
                                        ) :
                                        (
                                            <>
                                                <TableRow>
                                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                        <Box height="24px" borderBottom={1} borderColor="#000" />
                                                    </TableCell>
                                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                        <Box height="24px" borderBottom={1} borderColor="#000" />
                                                    </TableCell>
                                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                        <Box height="24px" borderBottom={1} borderColor="#000" />
                                                    </TableCell>
                                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                        <Box height="24px" borderBottom={1} borderColor="#000" />
                                                    </TableCell>
                                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                        <Box height="24px" borderBottom={1} borderColor="#000" />
                                                    </TableCell>
                                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                        <Box height="24px" borderBottom={1} borderColor="#000" />
                                                    </TableCell>
                                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                        <Box height="24px" borderBottom={1} borderColor="#000" />
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>

                </div>

                <div className='print-section keep-together'>
                    {/* 20. Current Compensation Details */}
                    <Typography fontWeight="bold" mt={2} mb={1}>
                        20. Current Compensation Details
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ tableLayout: 'fixed' }}>
                            <colgroup>
                                <col style={{ width: '35%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '35%' }} />
                                <col style={{ width: '15%' }} />
                            </colgroup>
                            <TableBody>
                                {/* Header Row */}
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Monthly Components</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Amount (in Rs.)</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Annual Benefits</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1 }}>Amount (in Rs.)</TableCell>
                                </TableRow>

                                {/* Data Rows */}
                                {[
                                    [
                                        { key: 'Basic', value: applicant_form?.pay_slip?.basic },
                                        { key: 'Provident Fund', value: applicant_form?.pay_slip?.provident_fund }
                                    ],
                                    [
                                        { key: 'HRA/ CLA', value: applicant_form?.pay_slip?.hra_cla },
                                        { key: 'Superannuation', value: applicant_form?.pay_slip?.superannuation }
                                    ],
                                    [
                                        { key: 'Conveyance', value: applicant_form?.pay_slip?.conveyance },
                                        { key: 'Gratuity', value: applicant_form?.pay_slip?.gratuity }
                                    ],
                                    [
                                        { key: 'Petrol Reimbursement', value: applicant_form?.pay_slip?.petrol_reimbursement },
                                        { key: 'Medical Reimbursements', value: applicant_form?.pay_slip?.medical_reimbursements }
                                    ],
                                    [
                                        { key: 'Attire Reimbursement', value: applicant_form?.pay_slip?.attire_reimbursement },
                                        { key: 'LTA', value: applicant_form?.pay_slip?.lta }
                                    ],
                                    [
                                        { key: 'Subscription Allowance', value: applicant_form?.pay_slip?.subscription_allowance },
                                        { key: 'Performance Bonus', value: applicant_form?.pay_slip?.performance_bonus }
                                    ],
                                    [
                                        { key: 'Telephone Reimbursement', value: applicant_form?.pay_slip?.telephone_reimbursement },
                                        { key: 'Any other (pls. specify)', value: applicant_form?.pay_slip?.monthly_any_other }
                                    ],
                                    [
                                        { key: 'Driver’s Salary', value: applicant_form?.pay_slip?.driver_salary },
                                        { key: '—', value: '' }
                                    ],
                                    [
                                        { key: 'Children’s Education Allow.', value: applicant_form?.pay_slip?.childrens_education_allow },
                                        { key: '—', value: '' }
                                    ],
                                    [
                                        { key: 'Professional Development', value: applicant_form?.pay_slip?.professional_development },
                                        { key: '—', value: '' }
                                    ],
                                    [
                                        { key: 'Any other (pls. specify)', value: applicant_form?.pay_slip?.annual_any_other },
                                        { key: '—', value: '' }
                                    ],
                                ]
                                    .map(([left, right], index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>{left.key}</TableCell>
                                            <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                {left.value}
                                            </TableCell>
                                            <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>{right.key}</TableCell>
                                            <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                                {right.value}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* 21. Joining Details */}
                    <Typography fontWeight="bold" mt={2} mb={1}>
                        21. Joining Details
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ tableLayout: 'fixed' }}>
                            <colgroup>
                                <col style={{ width: '50%' }} />
                                <col style={{ width: '50%' }} />
                            </colgroup>
                            <TableBody>
                                {[
                                    { key: 'Minimum Joining Period', value: applicant_form?.joining_details?.minimum_joining_period || "" },
                                    { key: 'Notice Period of Current Employment', value: applicant_form?.joining_details?.notice_period_of_current_emp || "" },
                                    { key: 'Location Preference, if any', value: applicant_form?.joining_details?.preferred_location || "" },
                                    { key: 'Location Constraint, if any', value: applicant_form?.joining_details?.constant_location || "" }
                                ].map((label, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>{label?.key}</TableCell>
                                        <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                            {label?.value}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* 22. References */}
                    <Typography fontWeight="bold" mt={2} mb={1}>
                        22. References:
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ tableLayout: 'fixed' }}>
                            <TableBody>
                                {/* Header Row */}
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1, width: '50%' }}>Name of the Reference</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1, width: '50%' }}>Name of the Reference</TableCell>
                                </TableRow>

                                {/* Reference Name Input */}
                                <TableRow>
                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                        {applicant_form?.references_other_than_family?.[0]?.name || ""}
                                    </TableCell>
                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                        {applicant_form?.references_other_than_family?.[1]?.name || ""}
                                    </TableCell>
                                </TableRow>

                                {/* Designation/Organisation Label */}
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1, width: '50%' }}>Designation</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1, width: '50%' }}>Designation</TableCell>
                                </TableRow>

                                {/* Designation Input */}
                                <TableRow>
                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                        {applicant_form?.references_other_than_family?.[0]?.designation || ""}
                                    </TableCell>
                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                        {applicant_form?.references_other_than_family?.[1]?.designation || ""}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1, width: '50%' }}>Contact Details Email / Mobile</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1, width: '50%' }}>Contact Details Email / Mobile</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                        {applicant_form?.references_other_than_family?.[0]?.email || ""} /  {applicant_form?.references_other_than_family?.[0]?.mobile || ""}
                                    </TableCell>
                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                        {applicant_form?.references_other_than_family?.[1]?.email || ""} / {applicant_form?.references_other_than_family?.[1]?.mobile || ""}
                                    </TableCell>
                                </TableRow>

                                {/* Relationship Label */}
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1, width: '50%' }}>Relationship with self</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: '#ddd', fontSize: '0.8rem', py: 0.5, px: 1, width: '50%' }}>Relationship with self</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                        {applicant_form?.references_other_than_family?.[0]?.relation || ""}
                                    </TableCell>
                                    <TableCell sx={{ borderRight: 1, borderColor: '#ddd', py: 0.5, px: 1 }}>
                                        {applicant_form?.references_other_than_family?.[1]?.relation || ""}
                                    </TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                    </TableContainer>



                    {/* Declaration */}
                    <Box mt={3} p={1.5} borderTop={1} borderColor="#000" sx={{ borderStyle: 'dashed' }}>
                        <Typography variant="body1" fontWeight="bold" textAlign="center" mb={1.5} fontSize="0.95rem">
                            DECLARATION
                        </Typography>
                        <Typography variant="body2" fontSize="0.8rem">
                            I hereby declare that the information furnished above is true to the best of my knowledge and belief and I fully understand that if any information given above is found false, my services are liable to be terminated at any time without any notification by the Management.
                        </Typography>

                        <Box display="flex" justifyContent="space-between" mt={3}>

                            <Box>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <Typography variant="body2" fontWeight="bold" mr={1}>Place:</Typography>
                                    <Box borderBottom="1px solid #000" flex={1} minHeight={24} px={0.5}>
                                        <Typography variant="body2">{candidate_data && candidate_data?.location}</Typography>
                                    </Box>
                                </Box>

                                <Box display="flex" alignItems="center" mb={1}>
                                    <Typography variant="body2" fontWeight="bold" mr={1}>Signature:</Typography>
                                    <Box
                                        borderBottom="1px solid #000"
                                        flex={1}
                                        minHeight={60}
                                        px={0.5}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        {applicant_form?.signature ? (
                                            config.IMAGE_PATH + applicant_form?.signature.startsWith("http") ? (
                                                <img
                                                    src={config.IMAGE_PATH + applicant_form?.signature}
                                                    alt="Signature"
                                                    style={{ maxHeight: "50px", maxWidth: "100%", objectFit: "contain" }}
                                                />
                                            ) : (
                                                null
                                            )
                                        ) : (
                                            <Typography variant="body2">-</Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Box>

                            <Box>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <Typography variant="body2" fontWeight="bold" mr={1}>Date:</Typography>
                                    <Box borderBottom="1px solid #000" flex={1} minHeight={24} px={0.5}>
                                        <Typography variant="body2">{moment().format("DD-MM-YYYY")}</Typography>
                                    </Box>
                                </Box>

                                <Box display="flex" alignItems="center" mb={1}>
                                    <Typography variant="body2" fontWeight="bold" mr={1}>Name:</Typography>
                                    <Box borderBottom="1px solid #000" flex={1} minHeight={24} px={0.5}>
                                        <Typography variant="body2">{applicant_form?.full_name?.first_name || "-"}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </div>
            </FormContainer>
        </>

    );
};

export default ApplicantForm;