// LetterComponents.jsx
import React from 'react';
import config from '../../../config/config';

// Utility function for consistent date formatting
const formatDate = (date = new Date()) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// Get current date in DD/MM/YYYY format
export const getCurrentDate = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
};

// --- SHARED STYLES ---
export const letterStyles = {
    page: {
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: 'white',
        padding: '15mm 20mm 25mm 20mm', // Extra bottom padding for footer
        margin: '0 auto',
        boxSizing: 'border-box',
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: '11pt',
        lineHeight: '1.5',
        color: '#000',
        position: 'relative'
    },
    highlight: {
        backgroundColor: '#FFFF00',
        padding: '0 2px'
    },
    bold: { fontWeight: 'bold' },
    center: { textAlign: 'center' },
    justify: { textAlign: 'justify' },
    table: { width: '100%', borderCollapse: 'collapse', margin: '15px 0' },
    td: { border: '1px solid #000', padding: '6px' },
    th: { border: '1px solid #000', padding: '6px', backgroundColor: '#f9f9f9', textAlign: 'left' },
    signatureRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '50px'
    }
};

// Highlight component
export const Highlight = ({ text, type = 'regular' }) => {
    const style = type === 'underline'
        ? {
            borderBottom: '2px solid #000',
            backgroundColor: 'transparent',
            padding: '2px 4px',
            fontWeight: 'bold',
            display: 'inline-block',
            margin: '0 2px'
        }
        : {
            backgroundColor: '#ffffcc',
            padding: '2px 4px',
            borderRadius: '2px',
            borderBottom: '1px solid #ffcc00',
            fontWeight: 'bold',
            display: 'inline-block',
            margin: '0 2px'
        };

    return (
        <span style={style}>
            {text || '___________________'}
        </span>
    );
};

// Document Watermark Component
export const DocumentWatermark = ({ webSettingData }) => {
    if (!webSettingData?.water_mark_file || webSettingData?.water_mark_file === 'null') return null;

    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-45deg)',
            zIndex: -1,
            opacity: 0.1,
            pointerEvents: 'none'
        }}>
            <img
                src={config.IMAGE_PATH + webSettingData.water_mark_file}
                alt="Watermark"
                style={{
                    width: '80%',
                    height: 'auto',
                    opacity: 0.1
                }}
            />
        </div>
    );
};

// Simple Header Component - Only logo with header line
export const LetterHeader = ({ webSettingData }) => {
    const headerColor = webSettingData?.header_color || '#811845';

    return (
        <div style={{
            marginBottom: '20px',
            position: 'relative'
        }}>
            {/* Header line at top */}
            <div style={{
                height: '5px',
                backgroundColor: headerColor,
                marginBottom: '15px'
            }} />

            {/* Logo only - positioned at top left */}
            {webSettingData?.logo_image && (
                <div style={{
                    position: 'absolute',
                    top: '5px',
                    left: '0'
                }}>
                    <img
                        src={config.IMAGE_PATH + webSettingData.logo_image}
                        alt="Company Logo"
                        style={{
                            height: '20mm',
                            maxWidth: '45mm',
                            objectFit: 'contain',
                            opacity: 0.8
                        }}
                    />
                </div>
            )}
        </div>
    );
};

// Footer Component - Different for first page vs other pages
export const LetterFooter = ({
    webSettingData,
    showSignature = true,
    isFirstPage = false
}) => {
    const footerColor = webSettingData?.footer_color || '#3caf40';
    const cleanWebsite = webSettingData?.website_link?.replace("https://hrms.", "https://") ||
        (webSettingData?.website_link || 'N/A');

    return (
        <div style={{
            position: 'absolute',
            bottom: '15mm',
            left: '20mm',
            right: '20mm',
            borderTop: `2px solid ${footerColor}`,
            paddingTop: '8px',
            marginTop: '20px',
            height: '40px'
        }}>
            {/* First page: Company info left + Signature right */}
            {isFirstPage ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '100%'
                }}>
                    {/* Company Contact Info - Left side */}
                    <div style={{
                        fontFamily: "'Times New Roman', Times, serif",
                        fontSize: '8pt',
                        color: '#1d1e30',
                        textAlign: 'left'
                    }}>
                        <p style={{ margin: '0 0 2px 0', fontWeight: 'bold' }}>
                            {webSettingData?.meta_title || 'Hindustan Latex Family Planning Promotion Trust'}
                        </p>
                        <p style={{ margin: '0 0 2px 0' }}>
                            <strong>Corporate Office:</strong> {webSettingData?.office_address || 'B-14 A, IInd Floor, Sector - 62, Gautam Budh Nagar, Noida-201301'}
                        </p>
                        <p style={{ margin: '0' }}>
                            Tel: {webSettingData?.organization_mobile_no || '9838387070'} |
                            Email: {webSettingData?.organization_email_id || 'duplextechnology@gmail.com'} |
                            Website: {cleanWebsite}
                        </p>
                    </div>

                    {/* HR Signature - Right side */}
                    {showSignature && webSettingData?.hod_hr_signature && (
                        <div style={{
                            textAlign: 'right'
                        }}>
                            <img
                                src={config.IMAGE_PATH + webSettingData.hod_hr_signature}
                                alt="HR Signature"
                                style={{
                                    width: '80px',
                                    height: '40px',
                                    objectFit: 'contain',
                                    marginBottom: '2px'
                                }}
                            />
                        </div>
                    )}
                </div>
            ) : (
                /* Other pages: Only signature at right corner */
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    height: '100%'
                }}>
                    {showSignature && webSettingData?.hod_hr_signature && (
                        <div style={{
                            textAlign: 'right'
                        }}>
                            <img
                                src={config.IMAGE_PATH + webSettingData.hod_hr_signature}
                                alt="HR Signature"
                                style={{
                                    width: '80px',
                                    height: '40px',
                                    objectFit: 'contain',
                                    marginBottom: '2px'
                                }}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Bottom footer line */}
            <div style={{
                height: '3px',
                marginTop: '4px',
                backgroundColor: footerColor
            }} />
        </div>
    );
};

// Employee Signature Component
export const EmployeeSignature = ({ employeeName, designation }) => {
    return (
        <div style={{
            textAlign: 'left',
            marginTop: '30px',
            marginBottom: '20px'
        }}>
            <div style={{
                borderTop: '1px solid #000',
                width: '200px',
                marginBottom: '10px'
            }}></div>
            <p style={{
                margin: '5px 0 0 0',
                fontSize: '9pt',
                fontFamily: "'Times New Roman', Times, serif",
                fontWeight: 'bold'
            }}>
                {employeeName || '___________________'}
            </p>
            <p style={{
                margin: '0',
                fontSize: '8pt',
                fontFamily: "'Times New Roman', Times, serif"
            }}>
                {designation || '___________________'}
            </p>
        </div>
    );
};

// Witness Signature Component
export const WitnessSignature = ({ witnessNumber = 1 }) => {
    return (
        <div style={{
            textAlign: 'left',
            marginTop: '20px'
        }}>
            <p style={{
                margin: '0 0 5px 0',
                fontSize: '9pt',
                fontFamily: "'Times New Roman', Times, serif",
                textDecoration: 'underline'
            }}>
                Witness {witnessNumber}
            </p>
            <p style={{ margin: '3px 0', fontSize: '8pt' }}>Signature: __________________</p>
            <p style={{ margin: '3px 0', fontSize: '8pt' }}>Name: __________________</p>
            <p style={{ margin: '3px 0', fontSize: '8pt' }}>Address: __________________</p>
            <p style={{ margin: '3px 0', fontSize: '8pt' }}>Dated: __________________</p>
        </div>
    );
};