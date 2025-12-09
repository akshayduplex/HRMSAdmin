// StrengthsWeaknessesEditor with consistent static height, scroll if overflow, and clean integration
import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useFormikContext } from 'formik';

const StrengthsWeaknessesEditor = () => {
    const { values, setFieldValue, errors, touched } = useFormikContext();

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean']
        ]
    };

    const editorStyle = {
        '.ql-container': {
            minHeight: '200px',
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'white',
            borderRadius: '4px'
        },
        '.ql-editor': {
            minHeight: '150px',
            maxHeight: '200px',
            overflowY: 'auto'
        }
    };

    return (
        <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    9. Please specify your major strengths & weaknesses.
                </Typography>

                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Strengths
                </Typography>
                <Box sx={editorStyle}>
                    <ReactQuill
                        value={values.strengths || ''}
                        onChange={(value) => setFieldValue('strengths', value)}
                        modules={quillModules}
                        placeholder="Write your major strengths here..."
                        theme="snow"
                    />
                </Box>
                {errors.strengths && touched.strengths && (
                    <Typography variant="caption" color="error">
                        {errors.strengths}
                    </Typography>
                )}

                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Weaknesses
                </Typography>
                <Box sx={editorStyle}>
                    <ReactQuill
                        value={values.weaknesses || ''}
                        onChange={(value) => setFieldValue('weaknesses', value)}
                        modules={quillModules}
                        placeholder="Write your major weaknesses here..."
                        theme="snow"
                    />
                </Box>
                {errors.weaknesses && touched.weaknesses && (
                    <Typography variant="caption" color="error">
                        {errors.weaknesses}
                    </Typography>
                )}
        </Grid>
    );
};

export default StrengthsWeaknessesEditor;