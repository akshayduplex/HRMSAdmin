import React, { useCallback, useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Grid,
} from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';
import axios from 'axios';
import config from '../config/config';
import { apiHeaderToken } from '../config/api_header';

const categories = ['Appointment Latter', 'Offer Latter', 'Joining Kits'];

export default function DocumentModalForUploads({ open, handleClose }) {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        file: null,
    });

    let EmployeeId = localStorage.getItem('onBoardingId')


    const [documents, setDocuments] = useState([]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const GetEmployeeDocumentsRecords = useCallback(async () => {

        try {

            let payload = {
                employee_doc_id: EmployeeId
            }

            let response = await axios.post(`${config.API_URL}employee/OnBoardDocumentsList` , payload , apiHeaderToken(config.API_TOKEN))

            if(response.status === 200){
                setDocuments(response.data)
            }else {
                console.log(response.data)
            }
            
        } catch (error) {
            console.log(error)
        }
        
    } , [EmployeeId])

    useEffect(() => {
        if(EmployeeId && open){
            GetEmployeeDocumentsRecords()
        }
    } , [EmployeeId, GetEmployeeDocumentsRecords , open])



    const handleSubmit = () => {
        if (formData.name && formData.category && formData.file) {
            const newDoc = {
                id: Date.now(),
                name: formData.name,
                category: formData.category,
                file: formData.file,
                uploadedBy: 'N/A',
                url: URL.createObjectURL(formData.file),
            };
            setDocuments((prev) => [...prev, newDoc]);
            setFormData({ name: '', category: '', file: null });
        }
    };

    const handleDelete = (id) => {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>Upload & Manage Documents</DialogTitle>
            <DialogContent dividers>
                {/* Upload Form */}
                <Grid container spacing={2} mb={3}>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Document Category</InputLabel>
                            <Select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                label="Document Category"
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat} value={cat}>
                                        {cat}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Document Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                        />
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            sx={{ height: '40px' }}
                        >
                            Browse File
                            <input type="file" name="file" hidden onChange={handleChange} />
                        </Button>
                        {formData.file && (
                            <Typography variant="caption" display="block" mt={0.5}>
                                {formData.file.name}
                            </Typography>
                        )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DialogActions sx={{ p: 0, justifyContent: 'flex-end' }}>
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                fullWidth
                                sx={{ height: '40px' }}
                            >
                                Submit
                            </Button>
                        </DialogActions>
                    </Grid>
                </Grid>

                {/* Document Table */}
                <Typography variant="h6" gutterBottom>
                    Uploaded Documents
                </Typography>

                {documents.length === 0 ? (
                    <Typography variant="body2">No documents uploaded yet.</Typography>
                ) : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Document Name</TableCell>
                                <TableCell>File Name</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Uploaded By</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {documents.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell>{doc.name}</TableCell>
                                    <TableCell>{doc.file?.name}</TableCell>
                                    <TableCell>{doc.category}</TableCell>
                                    <TableCell>{doc.uploadedBy}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => window.open(doc.url, '_blank')}
                                        >
                                            <Visibility />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(doc.id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </DialogContent>
        </Dialog>
    );
}
