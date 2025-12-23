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
        height: '297mm',
        backgroundColor: 'white',
        padding: '5mm 15mm 5mm 15mm',
        display: 'block',
        margin: '0 auto',
        boxSizing: 'border-box',
        fontFamily: '"Arial, sans-serif',
        fontSize: '11pt',
        lineHeight: '1.5',
        color: '#000',
        zIndex: 1,
        position: 'relative'
    },
    bold: { fontWeight: 'bold' },
    center: { textAlign: 'center', paddingTop: 25 },
    justify: { textAlign: 'justify' },
    table: { width: '100%', borderCollapse: 'collapse', margin: '15px 0' },
    td: { padding: '6px', fontFamily: 'Arial, sans-serif', fontSize: '8px' },
    th: { padding: '6px', backgroundColor: '#f9f9f9', textAlign: 'left' },
    signatureRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '50px'
    },
    baseTextStyle: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '10pt',
        lineHeight: '1.5'
    },
    AppointmentTextStyle: {
        fontFamily: 'Century Gothic, Arial, sans-serif',
        fontSize: '10pt',
        lineHeight: '1.5'
    }
};

// Document Watermark Component
export const DocumentWatermark = ({ webSettingData }) => {
    if (!webSettingData?.water_mark_file || webSettingData?.water_mark_file === 'null') return null;

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        >
            <img
                src={config.IMAGE_PATH + webSettingData.water_mark_file}
                alt="Watermark"
                style={{
                    width: '70%',
                    opacity: 0.08,
                    transform: 'rotate(-45deg)',
                }}
            />
        </div>
    );
};


//Header Component - Only logo with header line
export const LetterHeader = ({ webSettingData }) => {
    const headerColor = webSettingData?.header_color || '#811845';

    return (
        <div style={{
            marginBottom: '40px',
            position: 'relative',
            paddingTop: '10px'
        }}>
            {/* Always show the header colored line on EVERY page */}
            <div style={{
                height: '5px',
                backgroundColor: headerColor,
                marginBottom: '25px'
            }} />

            {/* Logo positioned below the line */}
            {webSettingData?.logo_image && (
                <div style={{
                    position: 'absolute',
                    top: '25px',
                    left: '0'
                }}>
                    <img
                        src={config.IMAGE_PATH + webSettingData.logo_image}
                        alt="Company Logo"
                        style={{
                            height: '20mm',
                            maxWidth: '45mm',
                            objectFit: 'contain',
                            opacity: 0.8,
                            paddingBottom: '10px'
                        }}
                    />
                </div>
            )}
        </div>
    );
};

// Replace FooterWithTextAndSignature
export const FooterWithTextAndSignature = ({ webSettingData, showSignature = true }) => {
    const footerColor = webSettingData?.footer_color || '#3caf40';
    const cleanWebsite = webSettingData?.website_link?.replace('https://hrms.', 'https://') || webSettingData?.website_link || 'N/A';

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '40px', marginTop: '65px' }}>
                <div style={{ fontSize: '8pt', color: '#1d1e30' }}>
                    <p style={{ margin: '0 0 2px 0', fontWeight: 'bold' }}>
                        {webSettingData?.meta_title || 'Hindustan Latex Family Planning Promotion Trust'}
                    </p>

                    <p style={{ margin: '0 0 2px 0' }}>
                        <strong>Corporate Office:</strong>{' '}
                        {webSettingData?.office_address || 'B-14 A, IInd Floor, Sector - 62, Noida-201301'}
                    </p>

                    <p style={{ margin: 0 }}>
                        Tel: {webSettingData?.organization_mobile_no || 'N/A'} |{''}
                        Email:{' '}
                        <a
                            href={`mailto:${webSettingData?.organization_email_id || 'N/A'}`}
                            style={{ color: '#303af3ff', textDecoration: 'underline' }}
                        >
                            {webSettingData?.organization_email_id || 'N/A'}
                        </a>{' '}
                        | Website:{' '}
                        <a
                            href={
                                cleanWebsite?.startsWith('http')
                                    ? cleanWebsite
                                    : `https://${cleanWebsite}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#303af3ff', textDecoration: 'underline' }}
                        >
                            {cleanWebsite}
                        </a>
                    </p>
                </div>
                {showSignature && webSettingData?.hod_hr_signature && (
                    <img
                        src={config.IMAGE_PATH + webSettingData.hod_hr_signature}
                        alt="HR Signature"
                        style={{ width: '95px', height: '55px', objectFit: 'contain' }}
                    />
                )}
            </div>
            <div style={{ height: '3px', backgroundColor: footerColor, marginTop: '4px' }} />
        </div>
    );
};

// Replace FooterWithSignatureOnly
export const FooterWithSignatureOnly = ({ webSettingData, showSignature = true }) => {
    const footerColor = webSettingData?.footer_color || '#3caf40';

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '40px' }}>
                {showSignature && webSettingData?.hod_hr_signature && (
                    <img
                        src={config.IMAGE_PATH + webSettingData.hod_hr_signature}
                        alt="HR Signature"
                        style={{ width: '95px', height: '55px', objectFit: 'contain' }}
                    />
                )}
            </div>
            <div style={{ height: '3px', backgroundColor: footerColor, marginTop: '4px' }} />
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
        <div
            style={{
                display: 'inline-block',
                textAlign: 'left',
                marginTop: '20px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '8px'
            }}
        >
            <p
                style={{
                    margin: '0 0 5px 0',
                    fontSize: '8px',
                    textDecoration: 'underline',
                    textAlign: 'center',
                    paddingLeft: '126px'
                }}
            >
                Witness {witnessNumber}
            </p>

            <p style={{ margin: '8px 0', fontSize: '8px' }}>
                Signature:
            </p>

            {/* Name line – font size 10 */}
            <p style={{ margin: '8px 0', fontSize: '8px' }}>
                Name:
            </p>

            <p style={{ margin: '8px 0', fontSize: '8px' }}>
                Address:
            </p>

            <p style={{ margin: '8px 0', fontSize: '8px' }}>
                Dated:
            </p>
        </div>
    );
};