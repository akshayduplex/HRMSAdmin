import React, { useState } from 'react';
import {
  Modal,
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Rating,
  Divider,
} from '@mui/material';
import { Delete, InsertDriveFile, PictureAsPdf } from '@mui/icons-material';
import { Document, Page } from 'react-pdf';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80vw',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
  overflow: 'auto',
};

const DocumentPreviewModal = ({ open, handleClose }) => {
  const [files, setFiles] = useState([
    {
      id: 1,
      name: 'document.pdf',
      type: 'pdf',
      url: '/sample.pdf',
      reviews: 4.5,
    },
    {
      id: 2,
      name: 'report.pdf',
      type: 'pdf',
      url: '/report.pdf',
      reviews: 3.8,
    },
    // Add more files as needed
  ]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [numPages, setNumPages] = useState(null);

  const handleDelete = (fileId) => {
    setFiles(files.filter((file) => file.id !== fileId));
    if (selectedFile?.id === fileId) setSelectedFile(null);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Document Preview
        </Typography>
        <Divider />

        <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
          {/* File List */}
          <Box sx={{ width: '30%' }}>
            <List dense>
              {files.map((file) => (
                <ListItem
                  key={file.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(file.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  }
                  sx={{
                    cursor: 'pointer',
                    bgcolor: selectedFile?.id === file.id ? '#f5f5f5' : 'inherit',
                    borderRadius: 1,
                  }}
                  onClick={() => setSelectedFile(file)}
                >
                  <PictureAsPdf sx={{ mr: 1, color: 'error.main' }} />
                  <ListItemText
                    primary={file.name}
                    secondary={
                      <Rating
                        name="read-only"
                        value={file.reviews}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Preview Section */}
          <Box sx={{ flex: 1 }}>
            {selectedFile ? (
              <>
                <Box sx={{ border: '1px solid #ddd', p: 1, borderRadius: 1 }}>
                  <Document
                    file={selectedFile.url}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    {Array.from(new Array(numPages), (el, index) => (
                      <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={600}
                      />
                    ))}
                  </Document>
                </Box>
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  Reviews: {selectedFile.reviews}/5
                </Typography>
              </>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                }}
              >
                Select a file to preview
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DocumentPreviewModal;