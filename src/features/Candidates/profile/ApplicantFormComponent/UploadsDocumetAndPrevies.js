
import React, { useState } from 'react';
import { Grid, Box, FormLabel, Button, Typography, IconButton } from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';
import { useFormikContext } from 'formik';

const PhotoSignatureUpload = () => {
    const { setFieldValue, values, errors, touched, submitCount } = useFormikContext();
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('File size exceeds 2MB');
                return;
            }
            setFieldValue(field, file);
            const reader = new FileReader();
            reader.onload = () => {
                setFieldValue(`${field}Preview`, reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleDrop = (e, field) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('File size exceeds 2MB');
                return;
            }
            setFieldValue(field, file);
            const reader = new FileReader();
            reader.onload = () => {
                setFieldValue(`${field}Preview`, reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Grid container spacing={2}>
            {['photograph', 'signature'].map((field) => {
                const isError = (errors[field] && touched[field]) || (errors[field] && submitCount > 0);

                return (
                    <Grid item xs={12} md={6} key={field}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1.5,
                                p: 2,
                                border: dragActive ? '2px dashed #1976d2' : isError ? '2px dashed red' : '1px dashed #ccc',
                                borderRadius: '4px',
                                backgroundColor: '#fafafa',
                                position: 'relative',
                                cursor: 'pointer'
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDragActive(true);
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDragActive(false);
                            }}
                            onDrop={(e) => handleDrop(e, field)}
                        >
                            <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>
                                {field === 'photograph' ? 'Affix a signed passport sized photograph' : 'Affix your signature'}
                            </FormLabel>

                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id={`${field}-upload`}
                                type="file"
                                onChange={(e) => handleFileChange(e, field)}
                            />
                            <label htmlFor={`${field}-upload`}>
                                <Button
                                    variant="contained"
                                    component="span"
                                    startIcon={<CloudUpload />}
                                    sx={{ mb: 1 }}
                                >
                                    Upload {field.charAt(0).toUpperCase() + field.slice(1)}
                                </Button>
                            </label>

                            {values[`${field}Preview`] ? (
                                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                    <img
                                        src={values[`${field}Preview`]}
                                        alt="Preview"
                                        style={{
                                            width: '150px',
                                            height: field === 'photograph' ? '120px' : '120px',
                                            objectFit: 'cover',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }}
                                    />
                                    <IconButton
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            backgroundColor: 'rgba(255,255,255,0.7)'
                                        }}
                                        onClick={() => {
                                            setFieldValue(field, '');
                                            setFieldValue(`${field}Preview`, null);
                                        }}
                                    >
                                        <Close fontSize="small" />
                                    </IconButton>
                                </Box>
                            ) : (
                                <Box sx={{
                                    width: 150,
                                    height: field === 'photograph' ? 120 : 120,
                                    border: '1px dashed #ccc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#f0f0f0'
                                }}>
                                    <Typography variant="caption" color="textSecondary">
                                        No {field} selected
                                    </Typography>
                                </Box>
                            )}

                            <Typography variant="caption" color="textSecondary">
                                Supported formats: JPEG, PNG | Max size: 2MB
                            </Typography>

                            {isError && (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                    {errors[field]}
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default PhotoSignatureUpload;