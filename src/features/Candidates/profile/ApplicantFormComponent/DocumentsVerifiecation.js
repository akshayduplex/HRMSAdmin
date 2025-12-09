import React from 'react';
import {
    Grid,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    TextField,
    Button,
    Box,
    Paper
} from '@mui/material';
import { useFormikContext } from 'formik';

const CategoryHealthSection = () => {
    const { values, setFieldValue, errors, touched, setFieldTouched, submitCount } = useFormikContext();

    const categories = [
        {
            key: 'scStObcExService',
            letter: 'a',
            label: 'Do you belong to SC/ST/OBC/Ex-Serviceman Category? (If yes, please specify and attach proof)'
        },
        {
            key: 'physicallyHandicapped',
            letter: 'b',
            label: 'Are you physically handicapped? (If yes, Please specify and attach proof)'
        },
        {
            key: 'majorAilments',
            letter: 'c',
            label: 'Do you suffer from any major ailments? (If yes, please specify and attach proof)'
        }
    ];

    return (
        <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{
                fontWeight: 'bold',
                // fontSize: '1.1rem',
                borderBottom: '1px solid #ddd',
                pb: 1,
                mb: 2
            }}>
                10. Category & Health Details
            </Typography>

            <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: '4px' }}>
                {categories.map(({ key, letter, label }) => (
                    <Box key={key} sx={{
                        mb: 3,
                        p: 2,
                        backgroundColor: '#f9f9f9',
                        borderRadius: '4px',
                        borderLeft: '3px solid #3f51b5'
                    }}>
                        <FormControl component="fieldset" fullWidth required>
                            <Typography variant="subtitle2" component="div" sx={{
                                fontWeight: 'bold',
                                mb: 1,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Box component="span" sx={{
                                    minWidth: '24px',
                                    fontWeight: 'bold',
                                    color: 'primary.main'
                                }}>
                                    {letter}.
                                </Box>
                                {label}
                            </Typography>

                            <RadioGroup
                                row
                                value={values[key]?.belongs || ''}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setFieldValue(`${key}.belongs`, v);
                                    if (v === 'yes') {
                                        setFieldTouched(`${key}.details`, true);
                                        setFieldTouched(`${key}.document`, true);
                                    } else if(v === 'no') {
                                        setFieldTouched(`${key}.details`, null);
                                        setFieldTouched(`${key}.document`, null);
                                    }
                                }}
                                sx={{ mb: 1 }}
                            >
                                <FormControlLabel
                                    value="yes"
                                    control={<Radio size="small" />}
                                    label="Yes"
                                />
                                <FormControlLabel
                                    value="no"
                                    control={<Radio size="small" />}
                                    label="No"
                                    sx={{ ml: 2 }}
                                />
                            </RadioGroup>

                            {touched[key] && errors[key]?.belongs && (
                                <Typography variant="caption" color="error">
                                    {errors[key].belongs}
                                </Typography>
                            )}

                            {values[key]?.belongs === 'yes' && (
                                <Box mt={2} sx={{ pl: 3, borderLeft: '2px solid #e0e0e0' }}>
                                    <TextField
                                        label="Please specify"
                                        name={`${key}.details`}
                                        value={values[key]?.details || ''}
                                        onChange={(e) => setFieldValue(`${key}.details`, e.target.value)}
                                        multiline
                                        fullWidth
                                        rows={2}
                                        size="small"
                                        margin="dense"
                                        onBlur={() => setFieldTouched(`${key}.details`, true)}
                                        error={(touched[key]?.details) && Boolean(errors[key]?.details)}
                                        helperText={(touched[key]?.details) && errors[key]?.details}
                                    />

                                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            size="small"
                                        >
                                            Upload Proof Document
                                            <input
                                                type="file"
                                                hidden
                                                onChange={(e) => {
                                                    setFieldValue(`${key}.document`, e.currentTarget.files[0])
                                                    setFieldTouched(e.target.name, true)
                                                }}
                                            />
                                        </Button>

                                        {values[key]?.document && (
                                            <Typography variant="body2" sx={{ ml: 2, fontStyle: 'italic' }}>
                                                Selected: {values[key].document.name}
                                            </Typography>
                                        )}
                                    </Box>

                                    {(touched[key]?.document || submitCount > 0) && errors[key]?.document && (
                                        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                                            {errors[key].document}
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </FormControl>
                    </Box>
                ))}
            </Paper>
        </Grid>
    );
};

export default CategoryHealthSection;