import React from "react";
import Modal from 'react-bootstrap/Modal';

const Viewdoc_modal = ({ imageUrl, docName, ...modalProps }) => {
    // Helper to get the file extension
    const getFileExtension = url => {
        const parts = url?.split('.');
        return parts?.length > 1 ? parts.pop().toLowerCase() : '';
    };

    console.log(  imageUrl , 'this is file staus' );

    const fileExt = getFileExtension(imageUrl);

    const renderFile = () => {
        switch (fileExt) {
            // Image types
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'bmp':
                return (
                    <img
                        src={imageUrl}
                        alt={docName}
                        className="img-fluid rounded"
                        style={{ maxHeight: '500px', objectFit: 'contain' }}
                    />
                );

            // PDF
            case 'pdf':
                return (
                    <object
                        data={imageUrl}
                        type="application/pdf"
                        width="100%"
                        height="600"
                    >
                        <p>
                            No PDF plugin?{" "}
                            <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                                Download PDF
                            </a>.
                        </p>
                    </object>
                );

            // Office documents via Google Docs Viewer
            case 'doc':
            case 'docx':
            case 'xls':
            case 'xlsx':
            case 'ppt':
            case 'pptx':
                const gdocsUrl = `https://docs.google.com/gview?url=${encodeURIComponent(imageUrl)}&embedded=true`;
                return (
                    <iframe
                        src={gdocsUrl}
                        width="100%"
                        height="600"
                        frameBorder="0"
                        title={docName}
                    >
                        <p>
                            Your browser doesn’t support embedded Office previews.{" "}
                            <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                                Download {docName}
                            </a>.
                        </p>
                    </iframe>
                );

            // Video types
            case 'mp4':
            case 'webm':
            case 'ogg':
                return (
                    <video controls style={{ width: '100%', maxHeight: '500px' }}>
                        <source src={imageUrl} type={`video/${fileExt}`} />
                        Your browser does not support the video tag.
                    </video>
                );

            // Audio types
            case 'mp3':
            case 'wav':
            case 'aac':
                return (
                    <audio controls style={{ width: '100%' }}>
                        <source src={imageUrl} type={`audio/${fileExt}`} />
                        Your browser does not support the audio element.
                    </audio>
                );

            // Plain text
            case 'txt':
                return (
                    <iframe
                        src={imageUrl}
                        title={docName}
                        style={{ width: '100%', height: '600px', border: 'none' }}
                    >
                        Your browser does not support iframes.
                    </iframe>
                );

            // Fallback
            default:
                return (
                    <div className="text-center">
                        <p>No preview available for this file type.</p>
                        <a
                            href={imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            Download {docName || 'File'}
                        </a>
                    </div>
                );
        }
    };

    return (
        <Modal
            {...modalProps}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header
                closeButton
                closeVariant="white"
                style={{ backgroundColor: '#5c34a4' }}
            >
                <Modal.Title
                    id="contained-modal-title-vcenter"
                    style={{ color: '#fff' }}
                >
                    {docName || 'Document Viewer'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4 bg-light">
                <div className="d-flex justify-content-center align-items-center">
                    {imageUrl ? renderFile() : <p>No file available</p>}
                </div>
            </Modal.Body>
            <Modal.Footer className="border-top-0">
                <button className="btn btn-secondary" onClick={modalProps.onHide}>
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default Viewdoc_modal;
