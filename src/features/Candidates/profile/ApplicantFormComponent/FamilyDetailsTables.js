import React from 'react';
import { Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Button, TextField, Checkbox, Typography, MenuItem } from '@mui/material';
import { Field, FieldArray, useFormikContext } from 'formik';
import { Delete, Add } from '@mui/icons-material';

const FamilyDependentsTable = () => {
    const { values, errors, touched, submitCount, setFieldValue } = useFormikContext();

    const particularsOptions = [
        'Father',
        'Mother',
        'Wife/Husband',
        'Children',
        'Brothers',
        'Sisters'
    ];

    return (
        <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                8. Details Of Family Members
            </Typography>
            <FieldArray name="familyDependents">
                {({ push, remove }) => (
                    <>
                        <TableContainer
                            component={Paper}
                            sx={{
                                mb: 2,
                                border:
                                    (errors.familyDependents && touched.familyDependents) ||
                                        (errors.familyDependents && submitCount > 0)
                                        ? '2px solid red'
                                        : '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        >
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Particulars</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Age (in Yrs)</TableCell>
                                        <TableCell>Details of Occupation</TableCell>
                                        <TableCell align="center">Dependent?</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {values.familyDependents?.map((_, index) => {
                                        const fieldError =
                                            errors.familyDependents &&
                                            Array.isArray(errors.familyDependents) &&
                                            errors.familyDependents[index];

                                        const fieldTouched =
                                            touched.familyDependents &&
                                            Array.isArray(touched.familyDependents) &&
                                            touched.familyDependents[index];
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Field
                                                        as={TextField}
                                                        select
                                                        name={`familyDependents.${index}.particular`}
                                                        fullWidth
                                                        size="small"
                                                        sx={{ minWidth: 200, maxWidth: 250 }}
                                                        error={
                                                            fieldTouched?.particular &&
                                                            Boolean(fieldError?.particular)
                                                        }
                                                        helperText={
                                                            fieldTouched?.particular &&
                                                            fieldError?.particular
                                                        }
                                                    >
                                                        {particularsOptions?.map((option) => (
                                                            <MenuItem key={option} value={option}>
                                                                {option}
                                                            </MenuItem>
                                                        ))}
                                                    </Field>
                                                </TableCell>
                                                <TableCell>
                                                    <Field
                                                        as={TextField}
                                                        name={`familyDependents.${index}.name`}
                                                        fullWidth
                                                        size="small"
                                                        error={
                                                            fieldTouched?.name &&
                                                            Boolean(fieldError?.name)
                                                        }
                                                        helperText={
                                                            fieldTouched?.name &&
                                                            fieldError?.name
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Field
                                                        as={TextField}
                                                        name={`familyDependents.${index}.age`}
                                                        fullWidth
                                                        size="small"
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (/^\d*$/.test(value) && value?.length <= 2) {
                                                                setFieldValue(e.target.name, value);
                                                            }
                                                        }}
                                                        error={
                                                            fieldTouched?.age &&
                                                            Boolean(fieldError?.age)
                                                        }
                                                        helperText={
                                                            fieldTouched?.age &&
                                                            fieldError?.age
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Field
                                                        as={TextField}
                                                        name={`familyDependents.${index}.occupation`}
                                                        fullWidth
                                                        size="small"
                                                        error={
                                                            fieldTouched?.occupation &&
                                                            Boolean(fieldError?.occupation)
                                                        }
                                                        helperText={
                                                            fieldTouched?.occupation &&
                                                            fieldError?.occupation
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Field
                                                        type="checkbox"
                                                        name={`familyDependents.${index}.dependent`}
                                                        as={Checkbox}
                                                        checked={values.familyDependents[index].dependent}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        onClick={() => remove(index)}
                                                        size="small"
                                                        color="error"
                                                        disabled={values.familyDependents.length === 1}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {typeof errors.familyDependents === 'string' && (
                            <Typography variant="caption" color="error">
                                {errors.familyDependents}
                            </Typography>
                        )}
                        <Button
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={() =>
                                push({
                                    particular: '',
                                    name: '',
                                    age: '',
                                    occupation: '',
                                    dependent: false
                                })
                            }
                        >
                            Add Members
                        </Button>
                    </>
                )}
            </FieldArray>
        </Grid>
    );
};

export default FamilyDependentsTable;