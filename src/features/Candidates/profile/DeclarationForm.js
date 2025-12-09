import React, { useRef } from 'react';
import { Box, Typography, TextField, Button, FormControlLabel, Checkbox, Grid, Divider } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../../../config/config';
import { apiHeaderToken } from '../../../config/api_header';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';


const DeclarationForm = ({ candidateData }) => {
    const validationSchema = Yup.object({
        applicantName: Yup.string().trim(),
        parentName: Yup.string().trim(),
        residentOf: Yup.string().trim(),
        position: Yup.string().trim(),
        project: Yup.string().trim(),
        date: Yup.date(),
        place: Yup.string().trim(),
        signature: Yup.string().trim(),
        acceptTerms: Yup.boolean().oneOf([true], 'आपको घोषणा स्वीकार करनी होगी (You must accept the declaration)'),
    });

    let formStatus = candidateData?.applied_jobs?.find((item) => item.job_id === candidateData?.job_id)?.declaration_form_status === 'agree';

    const initialValues = {
        applicantName: candidateData?.name || '',
        parentName: candidateData?.applicant_form_data?.father_hushband_name || "",
        residentOf: candidateData?.applicant_form_data?.permanent_address?.address || "",
        position: candidateData?.designation || "",
        project: candidateData?.project_name || "",
        date: '',
        place: candidateData?.applied_jobs?.find((item) => item.job_id === candidateData?.job_id)?.proposed_location || "",
        signature: '',
        acceptTerms: false,
    };

    const handleSubmit = async (values) => {
        console.log('Form Submitted', values);
        try {
            let paylaods = {
                "candidate_id": candidateData?._id,
                "applied_job_id": candidateData?.applied_jobs?.find((item) => item?.job_id === candidateData?.job_id)?._id,
                "is_agree": values.acceptTerms ? 'yes' : 'no'
            }
            let response = await axios.post(`${config.API_URL}saveDeclarationForm`, paylaods, apiHeaderToken(config?.API_TOKEN))
            if (response.status === 200) {
                toast.success(response?.data?.message)
            } else {
                toast.error(response?.data?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message)
        }
        // handle submission logic
    };

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
            </Box>

            <Box ref={formRef} sx={{
                maxWidth: '100%',
                mx: 'auto',
                p: 2,
                // borderRadius: 2,
                // boxShadow: 3,
                bgcolor: 'background.paper'
            }}>
                <Box textAlign="start" mb={2}>
                    <Grid item xs={4}>
                        <img src='/logo512.png' alt='hlfppt logo' />
                    </Grid>
                </Box>
                <Typography variant="h5" align="center" gutterBottom sx={{
                    mb: 4,
                    fontWeight: 'bold',
                    color: '#2c387e'
                }}>
                    घोषणा (Declaration) - HLFPPT
                </Typography>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, handleChange, values }) => (
                        <Form>
                            {/* Declaration Section */}
                            <Box sx={{
                                mb: 4,
                                p: 3,
                                // border: '1px solid #eeeeee',
                                borderRadius: 1,
                                bgcolor: '#fafafa'
                            }}>
                                <Typography paragraph sx={{ mb: 3, lineHeight: 1.8, display: 'inline-block' }}>
                                    मैं
                                    <TextField
                                        name="applicantName"
                                        value={values?.applicantName}
                                        onChange={handleChange}
                                        error={touched?.applicantName && Boolean(errors.applicantName)}
                                        helperText={touched?.applicantName && errors.applicantName}
                                        placeholder="आवेदक का नाम"
                                        variant="standard"
                                        size="small"
                                        sx={{
                                            mx: 1,
                                            // measure content length + a little padding, but at least 30ch
                                            width: `${Math.max(values?.applicantName?.length + 1, 20)}ch`,
                                            maxWidth: '100%',
                                        }}
                                        InputProps={{
                                            readOnly: true,
                                            sx: {
                                                // ensure the inner <input> follows the same width
                                                width: '100%',
                                                boxSizing: 'content-box',
                                            },
                                        }}

                                    />
                                    पुत्र/पुत्री
                                    <TextField
                                        name="parentName"
                                        value={values.parentName}
                                        onChange={handleChange}
                                        error={touched.parentName && Boolean(errors.parentName)}
                                        helperText={touched.parentName && errors.parentName}
                                        placeholder="पिता/पति का नाम"
                                        variant="standard"
                                        size="small"
                                        sx={{
                                            mx: 1,
                                            // measure content length + a little padding, but at least 30ch
                                            width: `${Math.max(values.parentName.length + 1, 30)}ch`,
                                            maxWidth: '100%',
                                        }}
                                        InputProps={{
                                            readOnly: true,
                                            sx: {
                                                // ensure the inner <input> follows the same width
                                                width: '100%',
                                                boxSizing: 'content-box',
                                            },
                                        }}
                                    />
                                    निवासी
                                </Typography>

                                <Typography paragraph sx={{ mb: 3, lineHeight: 1.8 }}>
                                    <TextField
                                        name="residentOf"
                                        value={values.residentOf}
                                        onChange={handleChange}
                                        error={touched.residentOf && Boolean(errors.residentOf)}
                                        helperText={touched.residentOf && errors.residentOf}
                                        placeholder="पूरा पता"
                                        variant="standard"
                                        size="small"
                                        fullWidth
                                        sx={{ mb: 2 }}
                                        InputProps={{
                                            readOnly: true,
                                            sx: {
                                                // ensure the inner <input> follows the same width
                                                width: '100%',
                                                boxSizing: 'content-box',
                                            },
                                        }}
                                    />
                                    घोषणा करता/करती हूँ कि मेरा चयन हिन्दुस्तान लैटेक्स फैमिली प्लानिंग प्रमोशन ट्रस्ट (HLFPPT) में
                                    <TextField
                                        name="position"
                                        value={values.position}
                                        onChange={handleChange}
                                        error={touched.position && Boolean(errors.position)}
                                        helperText={touched.position && errors.position}
                                        placeholder="पद"
                                        variant="standard"
                                        size="small"
                                        sx={{
                                            mx: 1,
                                            // measure content length + a little padding, but at least 30ch
                                            width: `${Math.max(values.position.length + 1, 30)}ch`,
                                            maxWidth: '100%',
                                        }}
                                        InputProps={{
                                            readOnly: true,
                                            sx: {
                                                // ensure the inner <input> follows the same width
                                                width: '100%',
                                                boxSizing: 'content-box',
                                            },
                                        }}
                                    />
                                    पद पर
                                    <TextField
                                        name="project"
                                        value={values.project}
                                        onChange={handleChange}
                                        error={touched.project && Boolean(errors.project)}
                                        helperText={touched.project && errors.project}
                                        placeholder="परियोजना"
                                        variant="standard"
                                        size="small"
                                        sx={{
                                            mx: 1,
                                            // measure content length + a little padding, but at least 30ch
                                            width: `${Math.max(values.project.length + 1, 30)}ch`,
                                            maxWidth: '100%',
                                        }}
                                        InputProps={{
                                            readOnly: true,
                                            sx: {
                                                // ensure the inner <input> follows the same width
                                                width: '100%',
                                                boxSizing: 'content-box',
                                            },
                                        }}
                                    />
                                    परियोजना के अन्तर्गत हुआ है ।
                                </Typography>

                                <Typography paragraph sx={{ mb: 3, lineHeight: 1.8 }}>
                                    मेरा चयन मेरी योग्यता के अनुसार पूरी तरह से पारदर्शी एवं निष्पक्ष प्रक्रिया से हुआ है |
                                </Typography>

                                <Typography paragraph sx={{ mb: 3, lineHeight: 1.8 }}>
                                    आगे मै उपरोक्त चयन को सही मानते हुए ये घोषणा करता हूँ कि मैने किसी व्यक्ति / संस्था
                                    / संदर्भित व्यक्ति से प्रत्यक्ष एवं अप्रत्यक्ष, वित्तीय एवं अन्य किसी भी तरह का कोई भी लेन देन नही
                                    किया है। मै शारीरिक / मानसिक रूप से स्वस्थ हूँ ।
                                </Typography>

                                <Typography paragraph sx={{ lineHeight: 1.8 }}>
                                    उपरोक्त कथन पूर्णतः सत्य है, और यदि यह कथन असत्य पाया जाता है, तो मेसर्स हिन्दुस्तान
                                    लैटेक्स फैमिली प्लानिंग प्रमोशन ट्रस्ट (HLFPPT) का प्रबंधन किसी भी तरह की अनुशासनात्मक कार्यवाही करने के लिए स्वतंत्र होगा ।
                                </Typography>
                            </Box>

                            <Box sx={{
                                mb: 4,
                                p: 3,
                                // border: '1px solid #eeeeee',
                                borderRadius: 1,
                                bgcolor: '#fafafa'
                            }}>
                                <Typography paragraph sx={{ mb: 3, lineHeight: 1.8, display: 'inline-block' }}>
                                    I
                                    <TextField
                                        name="applicantName"
                                        value={values.applicantName}
                                        onChange={handleChange}
                                        error={touched?.applicantName && Boolean(errors.applicantName)}
                                        helperText={touched?.applicantName && errors.applicantName}
                                        placeholder="Applicant Name"
                                        variant="standard"
                                        size="small"
                                        sx={{
                                            mx: 1,
                                            // measure content length + a little padding, but at least 30ch
                                            width: `${Math.max(values?.applicantName?.length + 1, 20)}ch`,
                                            maxWidth: '100%',
                                        }}
                                        InputProps={{
                                            readOnly: true,
                                            sx: {
                                                // ensure the inner <input> follows the same width
                                                width: '100%',
                                                boxSizing: 'content-box',
                                            },
                                        }}
                                    />
                                    son/daughter of
                                    <TextField
                                        name="parentName"
                                        value={values.parentName}
                                        onChange={handleChange}
                                        error={touched.parentName && Boolean(errors.parentName)}
                                        helperText={touched.parentName && errors.parentName}
                                        placeholder="Father/Husband’s Name"
                                        variant="standard"
                                        size="small"
                                        sx={{
                                            mx: 1,
                                            // measure content length + a little padding, but at least 30ch
                                            width: `${Math.max(values.parentName.length + 1, 30)}ch`,
                                            maxWidth: '100%',
                                        }}
                                        InputProps={{
                                            readOnly: true,
                                            sx: {
                                                // ensure the inner <input> follows the same width
                                                width: '100%',
                                                boxSizing: 'content-box',
                                            },
                                        }}
                                    />
                                    residing of
                                </Typography>

                                <Typography paragraph sx={{ mb: 3, lineHeight: 1.8 }}>
                                    <TextField
                                        name="residentOf"
                                        value={values.residentOf}
                                        onChange={handleChange}
                                        error={touched.residentOf && Boolean(errors.residentOf)}
                                        helperText={touched.residentOf && errors.residentOf}
                                        placeholder="Full Address"
                                        variant="standard"
                                        size="small"
                                        fullWidth
                                        sx={{ mb: 2 }}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    declare that I have been selected in Hindustan Latex Family Planning Promotion Trust (HLFPPT),for the position of
                                    <TextField
                                        name="position"
                                        value={values.position}
                                        onChange={handleChange}
                                        error={touched.position && Boolean(errors.position)}
                                        helperText={touched.position && errors.position}
                                        placeholder="Position"
                                        variant="standard"
                                        size="small"
                                        sx={{
                                            mx: 1,
                                            // measure content length + a little padding, but at least 30ch
                                            width: `${Math.max(values.position.length + 1, 30)}ch`,
                                            maxWidth: '100%',
                                        }}
                                        InputProps={{
                                            readOnly: true,
                                            sx: {
                                                // ensure the inner <input> follows the same width
                                                width: '100%',
                                                boxSizing: 'content-box',
                                            },
                                        }}
                                    />
                                    under the
                                    <TextField
                                        name="project"
                                        value={values.project}
                                        onChange={handleChange}
                                        error={touched.project && Boolean(errors.project)}
                                        helperText={touched.project && errors.project}
                                        placeholder="Project"
                                        variant="standard"
                                        size="small"
                                        sx={{
                                            mx: 1,
                                            // measure content length + a little padding, but at least 30ch
                                            width: `${Math.max(values.project.length + 1, 30)}ch`,
                                            maxWidth: '100%',
                                        }}
                                        InputProps={{
                                            readOnly: true,
                                            sx: {
                                                // ensure the inner <input> follows the same width
                                                width: '100%',
                                                boxSizing: 'content-box',
                                            },
                                        }}
                                    />
                                    Project. I am fully aware that my selection is done based on my merit throughan entirely/purely transparent and unbiased process.
                                </Typography>

                                <Typography paragraph sx={{ mb: 3, lineHeight: 1.8 }}>
                                    Further, I declare that for securing the above selection, I have not extended any direct/indirect financial/other favor to any person/agency/referring person. I am fully physically/mentally fit.
                                </Typography>
                                <Typography paragraph sx={{ mb: 3, lineHeight: 1.8 }}>
                                    Apart from this my all documents which is submitted at the time of selectionincluding (qualification, experience, date of birth etc.) are correct.
                                </Typography>
                                <Typography paragraph sx={{ lineHeight: 1.8 }}>
                                    The above-mentioned statement is completely true. If found false, then the management of Hindustan Latex Family Planning Promotion Trust (HLFPPT), will have the right to take any kind of disciplinary action against my candidature
                                </Typography>
                            </Box>

                            {/* Signature Section */}
                            <Box sx={{
                                mt: 4,
                                p: 3,
                                bgcolor: '#fafafa',
                                mx: 'auto',
                            }}>
                                <Grid container spacing={3}>
                                    {/* Place */}
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{
                                            color: '#555',
                                            fontWeight: 'bold',
                                            mb: 0.5
                                        }}>
                                            Place:
                                        </Typography>
                                        <Typography variant="h6" sx={{
                                            fontWeight: 'bold',
                                            color: '#2c387e',
                                            borderBottom: '2px solid #e0e0e0',
                                            pb: 1
                                        }}>
                                            {candidateData?.applied_jobs?.find((item) => item.job_id === candidateData?.job_id)?.proposed_location || "..."}
                                        </Typography>
                                    </Grid>

                                    {/* Signature */}
                                    <Grid item xs={6}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#555',
                                                fontWeight: 'bold',
                                                mb: 0.5,
                                            }}
                                        >
                                            Signature:
                                        </Typography>
                                        <Box
                                            sx={{
                                                height: 60,                   // give enough height for the signature
                                                borderBottom: '2px dashed #aaa',
                                                display: 'flex',
                                                alignItems: 'flex-end',       // push the img down to the line
                                                pl: 1,                        // little padding from left if desired
                                            }}
                                        >
                                            {candidateData?.applicant_form_data?.signature ? (
                                                <img
                                                    src={config.IMAGE_PATH + candidateData.applicant_form_data.signature}
                                                    alt="Signature"
                                                    style={{
                                                        maxHeight: '100%',         // scale image to fit height
                                                        width: 'auto',
                                                    }}
                                                />
                                            ) : (
                                                <Typography
                                                    variant="body1"
                                                    sx={{ color: '#999', fontStyle: 'italic' }}
                                                >
                                                    No signature
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>

                                    {/* Divider */}
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                    </Grid>

                                    {/* Date */}
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{
                                            color: '#555',
                                            fontWeight: 'bold',
                                            mb: 0.5
                                        }}>
                                            Date:
                                        </Typography>
                                        <Typography variant="h6" sx={{
                                            fontWeight: 'bold',
                                            color: '#2c387e',
                                            borderBottom: '2px solid #e0e0e0',
                                            pb: 1
                                        }}>
                                            {moment().format("DD/MM/YYYY")}
                                        </Typography>
                                    </Grid>

                                    {/* Name */}
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{
                                            color: '#555',
                                            fontWeight: 'bold',
                                            mb: 0.5
                                        }}>
                                            Name:
                                        </Typography>
                                        <Typography variant="h6" sx={{
                                            fontWeight: 'bold',
                                            color: '#2c387e',
                                            borderBottom: '2px solid #e0e0e0',
                                            pb: 1
                                        }}>
                                            {values?.applicantName}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>


                            {/* {
                                !formStatus && (
                                    <Box sx={{ margin: 3, textAlign: 'start' }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="acceptTerms"
                                                    checked={values.acceptTerms}
                                                    onChange={handleChange}
                                                    color="primary"
                                                />
                                            }
                                            label={
                                                <Typography>
                                                    मैं उपरोक्त घोषणा स्वीकार करता/करती हूँ
                                                    <Box component="span" sx={{ display: 'block', fontSize: '0.8rem' }}>
                                                        (I accept the above declaration)
                                                    </Box>
                                                </Typography>
                                            }
                                            sx={{ alignItems: 'flex-start' }}
                                        />
                                        {touched.acceptTerms && errors.acceptTerms && (
                                            <Typography variant="caption" color="error" display="block">
                                                {errors.acceptTerms}
                                            </Typography>
                                        )}
                                    </Box>
                                )
                            } */}


                            {/* Submit Button */}
                            {/* {
                                !formStatus && (
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            // size='small'
                                            sx={{
                                                // px: 6,
                                                // py: 1.5,
                                                // fontSize: '1.1rem',
                                                bgcolor: '#2c387e',
                                                '&:hover': { bgcolor: '#1a237e' }
                                            }}
                                        >
                                            Submit
                                        </Button>
                                    </Box>
                                )
                            } */}
                        </Form>
                    )}
                </Formik>
            </Box>
        </>
    );
};

export default DeclarationForm;