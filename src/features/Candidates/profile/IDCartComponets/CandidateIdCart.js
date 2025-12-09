import * as React from 'react';
import {
    Box,
    Button,
    Container,
    Divider,
    Grid,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import PrintIcon from '@mui/icons-material/Print';
import { toast } from 'react-toastify';
import config from '../../../../config/config';
import axios from 'axios';
import { apiHeaderTokenMultiPart } from '../../../../config/api_header';
import { useSearchParams } from 'react-router-dom';

/**
 * HLFPPT-style "Details Required For Official ID card" using MUI v5 (JavaScript)
 * - Photo box at the top with upload/preview (clickable inside box instead of separate button)
 * - Input fields for HR to fill (Employee Code, Name, Emergency Contact, Blood Group, Office Address)
 * - Notes section
 * - Print-friendly styling
 */
export default function CandidateIdCart({ candidateData }) {
    const [searchParams] = useSearchParams()
    const jobId = searchParams.get('job_id')

    const candidateIdCartDetails = candidateData?.applied_jobs?.find((item) => item.job_id === jobId)?.id_card_details;

    const [photo, setPhoto] = React.useState(config.IMAGE_PATH + candidateIdCartDetails?.card_image || config.IMAGE_PATH + candidateData?.photo || null);
    const [photoFile, setPhotoFile] = React.useState(null); // Store actual file for upload


    const [isSaving, setIsSaving] = React.useState(false);
    const [values, setValues] = React.useState({
        employeeCode: candidateIdCartDetails?.employee_code || '',
        name: candidateData?.name || candidateIdCartDetails?.candidate_name || '',
        emergency: candidateData?.mobile_no || candidateIdCartDetails?.emergency_contact_no || '',
        bloodGroup: candidateIdCartDetails?.blood_group || '',
        officeAddress: candidateIdCartDetails?.office_address || '',
    });

    const formRef = useRef();

    const loginUser = React.useMemo(() => {
        const user = JSON.parse(localStorage.getItem('admin_role_user'));
        return user;
    }, [])

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handlePrint = useReactToPrint({
        contentRef: formRef,  // ✔ correctly named
        pageStyle: `
          @media print {
          body { margin: 0; }
          .no-print { display: none !important; }
          .MuiPaper-root {
              box-shadow: none !important;
              padding: 0 !important;
              max-width: 100% !important;
          }
          .MuiContainer-root {
              border: 2px dotted #000 !important;
              padding: 10px !important;
          }
          /* Hide photo remove buttons during print */
          .photo-remove-button {
              display: none !important;
          }
          }
    `
    });

    const handleFileToDataURL = (file, cb) => {
        const reader = new FileReader();
        reader.onload = () => cb(reader.result);
        reader.readAsDataURL(file);
    };

    const handleUpload = (file) => {
        if (!file) return;

        // Validate file size (500KB max)
        const maxSizeInBytes = 500 * 1024; // 500KB in bytes
        if (file.size > maxSizeInBytes) {
            toast.error('Image size should not exceed 500KB. Please choose a smaller image.');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file.');
            return;
        }

        setPhotoFile(file); // Store the actual file for upload
        handleFileToDataURL(file, (dataUrl) => setPhoto(dataUrl));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Create FormData for file upload and form data
            const formData = new FormData();

            const approval_note_doc_id = candidateData?.applied_jobs?.find((item) => item.job_id === jobId)?.approval_note_data?.doc_id;

            if (!approval_note_doc_id) return toast.error('Please Generate the Approval note')
            if (!values.employeeCode) return toast.error('Employee Code Is Required')
            if (!values.bloodGroup) return toast.error('Blood Group Is Required')
            if (!values.emergency) return toast.error("Contact Number is Required")
            if (!values.officeAddress) return toast.error("Office Address is Required")


            // Add form field values
            formData.append('employee_code', values.employeeCode);
            formData.append('candidate_name', values.name);
            formData.append('emergency_contact_no', values.emergency);
            formData.append('blood_group', values.bloodGroup);
            formData.append('office_address', values.officeAddress);
            formData.append('candidate_doc_id', candidateData._id);
            formData.append('approval_note_doc_id', approval_note_doc_id)

            if (photoFile) {
                formData.append('filename', photoFile);
            }
            formData.append("add_by_name", loginUser?.name)
            formData.append("add_by_mobile", loginUser?.mobile_no)
            formData.append("add_by_designation", loginUser?.designation)
            formData.append("add_by_email", loginUser?.email)

            let response = await axios.post(`${config.API_URL}saveIDCardDetailsInCandidateProfile`, formData, apiHeaderTokenMultiPart(config.API_TOKEN))
            if (response.status === 200) {
                toast.success(response.data?.message)
            } else {
                toast.error(response.data?.message)
            }

        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Someting went wrong")
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Box sx={{ backgroundColor: '#f6f7f9', minHeight: '100vh', py: 3 }}>

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
            <Container maxWidth="md" ref={formRef}>
                <Paper sx={{ p: { xs: 2, sm: 3.5 } }}>
                    <Typography variant="h6" textAlign={"center"} sx={{ mb: 2 }}>Details Required For Official ID card:</Typography>

                    <PhotoBox
                        photo={photo}
                        defaultPhoto={candidateData?.photo}
                        onUpload={handleUpload}
                        onRemove={() => setPhoto(null)}
                        setPhoto={setPhoto}
                    />

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FieldInput
                                number={1}
                                label="Employee Code:"
                                name="employeeCode"
                                value={values.employeeCode}
                                onChange={handleChange}
                                hint="(to be filled by HR Dept.)"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FieldInput
                                number={2}
                                label="Name:"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FieldInput
                                number={3}
                                label="Emergency Contact No.:"
                                name="emergency"
                                value={values.emergency}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FieldInput
                                number={4}
                                label="Blood Group:"
                                name="bloodGroup"
                                value={values.bloodGroup}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ mt: 1.5 }}>
                                <Typography sx={{ fontWeight: 600, display: 'inline-block', minWidth: 210 }}>5. Office Address:</Typography>
                                <Typography component="span" sx={{ color: 'text.secondary', fontSize: 12, ml: 1 }}>
                                    (to be filled by HR Dept)
                                </Typography>
                                <TextField
                                    name="officeAddress"
                                    value={values.officeAddress}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>* NOTE:</Typography>
                        <Box component="ol" sx={{ m: 0, pl: 3 }}>
                            <Typography component="li" sx={{ mb: 1, lineHeight: 1.5 }}>
                                Emergency Contact no: This no. should be of your home, family, relative, friend who can be contacted easily in case of emergency. Pls do not provide your own no.
                            </Typography>
                            <Typography component="li" sx={{ lineHeight: 1.5 }}>
                                Blood Group is compulsory.
                            </Typography>
                        </Box>
                    </Box>

                    <Box className="no-print" sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 3 }}>
                        <Button
                            onClick={handleSave}
                            variant="contained"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    </Box>

                </Paper>
            </Container>
        </Box>
    );
}

// --- Helpers ---
function PhotoBox({ photo, defaultPhoto, onUpload, onRemove, setPhoto }) {
    const fileInputRef = React.useRef(null);

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Box sx={{ position: 'relative', width: 'fit-content', mx: 'auto' }}>
                <Box
                    sx={{
                        width: '3.5cm',
                        height: '4.5cm',
                        border: '2px dashed',
                        borderColor: 'grey.900',
                        borderRadius: 1,
                        overflow: 'hidden',
                        position: 'relative',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                    }}
                    aria-label="Passport size photograph box"
                    onClick={handleClick}
                >
                    {photo || defaultPhoto ? (
                        <img
                            src={photo || config.IMAGE_PATH + defaultPhoto}
                            alt="Passport size"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                display: 'block'
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                p: 1,
                            }}
                        >
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                    Passport Size
                                    <br />
                                    Photograph
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    (Click to upload)
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Box>
                {(photo || defaultPhoto) && (
                    <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        className="photo-remove-button"
                        sx={{
                            position: 'absolute',
                            top: -10,
                            right: -10,
                            minWidth: 'auto',
                            p: 0.5,
                            borderRadius: '50%',
                            bgcolor: 'background.paper'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (setPhoto) {
                                setPhoto(null);
                            }
                            onRemove();
                        }}
                    >
                        ×
                    </Button>
                )}
            </Box>

            <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => onUpload(e.target.files && e.target.files[0])}
            />
        </Box>
    );
}

function FieldInput({ number, label, hint, name, value, onChange }) {
    return (
        <Box sx={{ mb: 1.5 }}>
            <Typography component="span" sx={{ minWidth: 210, fontWeight: 600, display: 'inline-block' }}>
                {number}. {label}
            </Typography>
            <TextField
                name={name}
                value={value}
                onChange={onChange}
                variant="standard"
                size="small"
                sx={{ minWidth: 220 }}
            />
            {hint && (
                <Typography component="span" sx={{ color: 'text.secondary', fontSize: 12, ml: 1 }}>{hint}</Typography>
            )}
        </Box>
    );
}