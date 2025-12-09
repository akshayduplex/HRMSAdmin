import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import config from '../../../../config/config';
import { apiHeaderToken } from '../../../../config/api_header';
import AppointmentLetterCommon from '../../../SendOfferLatterDetailsPage/appointmentLetterCommon';


const HEADER_HEIGHT_MM = 32;
const FOOTER_HEIGHT_MM = 26;
const SIDE_PADDING_MM = 10;

const AppointmentLatter = ({ candidateData }) => {

  const [appointmentLatterData, setAppointmentLatterData] = useState(null);
  const [webSettingData, setWebSettingData] = useState(null)

  useEffect(() => {
    const getAppointmentLatter = async () => {
      try {
        let paylaods = {
          "candidate_id": candidateData?._id,
          "doc_category": "Appointment Letter",
          "approval_note_id": candidateData?.applied_jobs?.find((item) => item?.job_id === candidateData?.job_id)?.approval_note_data?.doc_id
        }

        let response = await axios.post(`${config.API_URL}getCandidateEmailContent`, paylaods, apiHeaderToken(config?.API_TOKEN))
        if (response.status === 200) {
          setAppointmentLatterData(response?.data?.data)
        } else {
          setAppointmentLatterData(null)
        }
      } catch (error) {
        setAppointmentLatterData(null)
      }
    };
    getAppointmentLatter();
  }, [candidateData])

  const contentHtml = appointmentLatterData?.content_data?.trim();


  const getConfigData = async () => {
    try {

      let response = await axios.get(`${config.API_URL}getAllSettingData`, apiHeaderToken(config.API_TOKEN))

      if (response.status === 200) {
        setWebSettingData(response?.data?.data)
      } else {
        setWebSettingData(null)
      }

    } catch (error) {
      setWebSettingData(null)
    }
  }

  useEffect(() => {

    getConfigData()

  }, [])



  // Create a sanitized version of the incoming HTML to remove controls and normalize sizing
  const sanitizedHtml = useMemo(() => {
    if (!contentHtml) return '';
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(contentHtml, 'text/html');
      const body = doc.body;
      // Normalize inline styles that cause oversized fonts/gaps
      body.querySelectorAll('*').forEach((el) => {
        const style = el.getAttribute('style');
        if (style) {
          // Drop font-size and line-height from inline styles
          const cleaned = style
            .replace(/font-size\s*:\s*[^;]+;?/gi, '')
            .replace(/line-height\s*:\s*[^;]+;?/gi, '')
            .replace(/zoom\s*:\s*[^;]+;?/gi, '')
            .replace(/transform\s*:\s*[^;]+;?/gi, '');
          if (cleaned.trim()) {
            el.setAttribute('style', cleaned);
          } else {
            el.removeAttribute('style');
          }
        }
      });
      return body.innerHTML;
    } catch (e) {
      return contentHtml;
    }
  }, [contentHtml]);

  const hasContent = Boolean(contentHtml);

  const formRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: formRef,
    documentTitle: "Appointment Letter",
    pageStyle: `
        :root { 
          --brand: #8dd3e6; 
          --footer: #5157af; 
          --text: #1d1e30; 
          --muted: #667085;
        }

      @page {
        size: A4;
        margin: 0;
      }

      @media print {
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          width: 100%;
          height: 100%;
        }

        body {
          width: 100%;
          height: auto;
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          color-adjust: exact;
          background: white;
          line-height: 1.5;
          overflow: visible !important;
        }

        .MuiPaper-root {
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
          background: white !important;
          width: 100% !important;
          max-width: 100% !important;
          display: block;
          position: relative;
          min-height: 100%;
          height: auto;
        }

        /* ===== PRINT TABLE STRUCTURE ===== */
        .print-table {
          width: 100%;
          border: none;
          border-collapse: collapse;
          table-layout: fixed;
        }

        .print-table thead {
          display: table-header-group;
        }

        .print-table tbody {
          display: table-row-group;
        }

        .print-table tfoot {
          display: table-footer-group;
        }

        .print-table td {
          padding: 0 !important;
          border: none !important;
          vertical-align: top;
        }

        /* Header and Footer Spaces - Reserve exact space matching fixed elements */
        .header-space,
        .footer-space {
          height: 0;
          padding: 0;
        }

        .header-space {
          height: ${HEADER_HEIGHT_MM}mm;
          padding: 2mm 5mm 2mm 5mm;
          box-sizing: border-box;
          background: white;
        }

        .footer-space {
          height: ${FOOTER_HEIGHT_MM}mm;
          padding: 2mm 5mm 2mm 5mm;
          box-sizing: border-box;
          background: white;
        }

        /* ===== HEADER - FIXED at top of every page ===== */
        .page-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          display: block;
          width: 100%;
          height: ${HEADER_HEIGHT_MM}mm;
          padding: 4mm 8mm 4mm 8mm;
          background: white;
          box-sizing: border-box;
          z-index: 100;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .header-lines {
          height: 5px;
          margin-bottom: 12px;
          background: var(--brand);
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .branding {
          display: flex;
          align-items: center;
          gap: 14px;
          height: calc(${HEADER_HEIGHT_MM}mm - 17mm);
          box-sizing: border-box;
        }

        .logo {
          width: auto !important;
          height: auto !important;
          max-width: 100mm !important;
          max-height: 18mm !important;
          object-fit: contain !important;
          opacity: 0.7;
        }

        /* ===== FOOTER - FIXED at bottom of every page ===== */
        .page-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: ${FOOTER_HEIGHT_MM}mm;
          padding: 4mm 10mm 4mm 10mm;
          background: white;
          box-sizing: border-box;
          z-index: 100;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          overflow: visible;
        }

        .footnote {
          font-size: 9px !important;
          line-height: 1.3 !important;
          color: var(--text);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: calc(${FOOTER_HEIGHT_MM}mm - 10mm);
        }

        .comanyname {
          display: block;
          font-size: 9px !important;
          font-weight: 500;
          line-height: 1.3 !important;
        }

        .footer-lines {
          height: 6px;
          margin-top: 4px;
          background: var(--footer);
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .sep {
          margin: 0 4px;
        }

        /* ===== CONTENT - Flows within table body with side padding only ===== */
        .content-cell {
          padding: 0 ${SIDE_PADDING_MM}mm !important;
        }

        .print-content {
          display: block;
          position: relative;
          width: 100%;
          box-sizing: border-box;
          margin: 0;
          /* comfortable padding inside the printed content area */
          padding: 6mm ${SIDE_PADDING_MM}mm !important;
          overflow: visible !important;
          page-break-before: auto;
          page-break-after: auto;
          page-break-inside: auto;
          z-index: 1;
          min-height: auto;
        }

        /* Watermark for printed pages */
        .watermark {
          display: block !important;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(1.0);
          opacity: 0.08;
          z-index: 0;
          pointer-events: none;
          width: 160mm;
          max-width: 80%;
        }

        .print-content > * {
          box-sizing: border-box;
          overflow: visible !important;
          max-height: none !important;
          position: relative;
          z-index: 2;
          page-break-inside: auto;
        }

        .print-content h1 {
          font-size: 16pt !important;
          margin: 16px 0 12px 0 !important;
          color: var(--text);
          page-break-inside: avoid;
          page-break-after: avoid;
          page-break-before: auto;
        }

        .print-content h2 {
          font-size: 14pt !important;
          margin: 14px 0 10px 0 !important;
          color: var(--text);
          page-break-inside: avoid;
          page-break-after: avoid;
          page-break-before: auto;
        }

        .print-content h3 {
          font-size: 12pt !important;
          margin: 12px 0 8px 0 !important;
          color: var(--text);
          page-break-inside: avoid;
          page-break-after: avoid;
          page-break-before: auto;
        }

        .print-content p {
          font-size: 12px !important;
          margin: 8px 0 !important;
          line-height: 1.5 !important;
          text-align: justify;
          widows: 3;
          orphans: 3;
          page-break-inside: auto;
          hyphens: auto;
          -webkit-hyphens: auto;
        }

        .print-content div {
          overflow: visible !important;
          max-height: none !important;
          page-break-inside: auto;
        }

        .print-content ul,
        .print-content ol {
          margin: 8px 0 8px 24px !important;
          padding: 0 !important;
          font-size: 12px !important;
          list-style-position: outside;
          page-break-inside: auto;
        }

        .print-content li {
          margin: 4px 0 !important;
          font-size: 12px !important;
          line-height: 1.5 !important;
          page-break-inside: avoid;
        }

        /* ===== TABLES IN CONTENT ===== */
        .print-content table {
          width: 100% !important;
          max-width: 100% !important;
          border-collapse: collapse !important;
          border-spacing: 0 !important;
          margin: 10px 0 !important;
          table-layout: auto !important;
          page-break-inside: auto;
          background: transparent !important;
        }

        /* Only tables that render data (role="presentation") should have structured borders */
        .print-content table[role="presentation"] {
          border-top: 1px solid #cfd4dc !important;
          border-bottom: 1px solid #cfd4dc !important;
          border-collapse: collapse !important;
          /* make layout more compact for data tables */
          table-layout: auto !important;
          font-size: 10px !important;
        }

        /* Header row styling: subtle background, stronger bottom rule */
        .print-content table[role="presentation"] thead th,
        .print-content table[role="presentation"] th {
          background: #f5f7fa !important;
          font-weight: 700 !important;
          padding: 8px 6px !important;
          border-bottom: 2px solid #cfd4dc !important;
          text-align: left !important;
        }

        /* Body cells: single rule between rows - compact and prevent digit-wrapping */
        .print-content table[role="presentation"] td {
          padding: 6px 6px !important;
          border: 1px solid #e6e9ef !important;
          font-size: 10px !important;
          white-space: nowrap !important;
          word-break: normal !important;
          overflow-wrap: normal !important;
        }

        /* Right-align last column (often amounts) and prevent wrapping */
        .print-content table[role="presentation"] td:last-child,
        .print-content table[role="presentation"] th:last-child {
          text-align: right !important;
          white-space: nowrap !important;
        }

        /* Avoid double borders on collapsed tables */
        .print-content table[role="presentation"] tr:last-child td {
          border-bottom: none !important;
        }

        .print-content hr {
          border: none !important;
          border-top: 1px solid #d9dfe8 !important;
          margin: 8px 0 !important;
          height: 0 !important;
          background: transparent !important;
        }
        /* hr styling inside content */
        .print-content hr {
          border: none !important;
          border-top: 1px solid #d9dfe8 !important;
          margin: 8px 0 !important;
          height: 0 !important;
          background: transparent !important;
        }

        /* Override inline width/max-width styles that come from editor HTML */
        .print-content [style*="max-width"] {
          max-width: 100% !important;
          width: 100% !important;
        }

        .print-content [style*="width"] {
          width: 100% !important;
          max-width: 100% !important;
        }

        /* Force table contents to use full width and remove borders/shadows */
        .print-content table {
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
          background: transparent !important;
          height: auto !important;
          max-height: none !important;
          border-collapse: collapse !important;
        }

        /* Ensure table cells don't have unwanted styling */
        .print-content table * {
          box-sizing: border-box !important;
          background: transparent !important;
          height: auto !important;
          max-height: none !important;
        }

        .print-content thead {
          display: table-header-group;
          background: #f5f5f5;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .print-content tbody {
          display: table-row-group;
          page-break-inside: auto;
        }

        .print-content tfoot {
          display: table-footer-group;
        }

        .print-content tr {
          page-break-inside: avoid;
          break-inside: avoid;
          page-break-after: auto;
        }

        .print-content th,
        .print-content td {
          padding: 8px 6px !important;
          font-size: 11px !important;
          line-height: 1.4 !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          word-break: break-word !important;
          vertical-align: top !important;
          text-align: left;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .print-content th {
          font-weight: 600;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* Only reset borders for non-table elements or when explicitly needed */
        .print-content > * {
          overflow: visible !important;
          max-height: none !important;
        }

        /* ===== UTILITY CLASSES ===== */
        .no-break {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /* Fix hidden content issues */
        .print-content *[style*="position: sticky"] {
          position: static !important;
        }

        .print-content .sticky {
          position: static !important;
        }

        .print-content .ql-editor,
        .print-content .mce-content-body {
          overflow: visible !important;
          max-height: none !important;
          max-width: 100% !important;
          background: transparent !important;
          page-break-inside: auto;
        }

        /* Hide screen elements */
        .screen-only {
          display: none !important;
        }
      }

      /* ===== SCREEN PREVIEW ===== */
      @media screen {
        .MuiPaper-root {
          position: relative;
          display: block;
          max-width: 210mm;
          margin: 0 auto;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        /* Show header and footer statically for preview */
        .header-space {
          height: ${HEADER_HEIGHT_MM}mm !important;
          padding: 2mm 5mm 2mm 5mm !important;
          box-sizing: border-box;
          background: #f9f9f9;
          border-bottom: 1px dashed #ccc;
        }

        .page-header {
          position: static !important;
          display: block;
          width: 100%;
          height: auto;
          min-height: ${HEADER_HEIGHT_MM}mm;
          padding: 4mm 8mm 4mm 8mm;
          background: #f9f9f9;
          border-bottom: 1px dashed #999;
          box-sizing: border-box;
          margin-bottom: 0;
          z-index: auto;
        }

        .footer-space {
          height: ${FOOTER_HEIGHT_MM}mm !important;
          padding: 2mm 5mm 2mm 5mm !important;
          box-sizing: border-box;
          background: #f9f9f9;
          border-top: 1px dashed #ccc;
        }

        .page-footer {
          position: static !important;
          display: block;
          width: 100%;
          height: auto;
          min-height: ${FOOTER_HEIGHT_MM}mm;
          padding: 4mm 10mm 4mm 10mm;
          background: #f9f9f9;
          border-top: 1px dashed #999;
          box-sizing: border-box;
          margin-top: 0;
          overflow: visible;
        }

        .header-lines {
          height: 5px;
          margin-bottom: 12px;
          background: var(--brand);
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .branding {
          display: flex;
          align-items: center;
          padding:10px;
          gap: 14px;
          min-height: 60px;
        }

        .logo {
          width: auto !important;
          height: auto !important;
          max-width: 150px !important;
          max-height: 100px !important;
          object-fit: contain !important;
        }

        .footnote {
          display: block;
          font-size: 9px !important;
          line-height: 1.3 !important;
          color: var(--text);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: calc(${FOOTER_HEIGHT_MM}mm - 10mm);
        }

        .comanyname {
          display: block;
          font-size: 9px !important;
          font-weight: 500;
          line-height: 1.3 !important;
        }

        .footer-lines {
          height: 6px;
          margin-top: 4px;
          background: var(--footer);
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .content-cell {
          padding: ${SIDE_PADDING_MM}mm !important;
          vertical-align: top;
        }

        .print-table {
          width: 100%;
          border: none !important;
          border-collapse: collapse;
          table-layout: auto;
        }

        .print-table td {
          padding: 0 !important;
          border: none !important;
        }

        .print-content {
          position: relative;
          display: block;
          width: 100%;
          padding: 6mm ${SIDE_PADDING_MM}mm;
          margin: 0;
          background: white;
          min-height: 297mm; /* A4 height for full page simulation */
          box-sizing: border-box;
          overflow-y: auto; /* Allow scrolling if content overflows */
          max-height: calc(100vh - 120px); /* Adjust based on viewport minus header/footer */
        }

        /* Watermark for screen preview (non-intrusive) */
        .watermark {
          display: none !important;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0.06;
          z-index: 0;
          pointer-events: none;
          width: 160mm;
          max-width: 80%;
        }

        .print-content * {
          overflow: visible !important;
          max-height: none !important;
        }

        /* Screen: override inline width/max-width in template HTML */
        .print-content [style*="max-width"] {
          max-width: 100% !important;
          width: 100% !important;
        }

        .print-content [style*="width"] {
          width: 100% !important;
          max-width: 100% !important;
        }

        .print-content table {
          width: 100% !important;
          max-width: 100% !important;
          border: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }

        .print-content table[role="presentation"] {
          border-top: 1px solid #ddd !important;
          border-bottom: 1px solid #ddd !important;
        }

        .print-content table[role="presentation"] th,
        .print-content table[role="presentation"] td {
          border: 1px solid #cfd4dc !important;
          padding: 8px 6px !important;
        }

        .print-content table:not([role="presentation"]) th,
        .print-content table:not([role="presentation"]) td {
          border: none !important;
        }

        /* Screen preview: presentation table styling */
        .print-content table[role="presentation"] thead th,
        .print-content table[role="presentation"] th {
          background: #f5f7fa !important;
          font-weight: 400 !important;
          padding: 8px 6px !important;
          border-bottom: 2px solid #cfd4dc !important;
        }

        .print-content table[role="presentation"] td {
          padding: 8px 6px !important;
          border-bottom: 1px solid #e6e9ef !important;
        }

        .print-content table[role="presentation"] tr:last-child td {
          border-bottom: none !important;
        }

        /* Visual table rules for screen preview: top/bottom border only, no inner borders */
        .print-content table {
          border-top: 1px solid #ddd !important;
          border-bottom: 1px solid #ddd !important;
          border-collapse: collapse !important;
          margin: 10px 0 !important;
        }

        .print-content th, .print-content td {
          border: none !important;
          padding: 8px 6px !important;
        }

      /* Simulate page breaks visually on screen with subtle lines */
        .print-content::after {
          content: '';
          display: block;
          height: 1px;
          background: #eee;
          margin: 20mm 0;
        }
      }
    `,
  });

  
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .no-print {
        display: block !important;
      }
      @media print {
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
       <AppointmentLetterCommon templateDescription={contentHtml} webSettingData={webSettingData} previewData={'Appointment'} />
    </>
  );
};

export default AppointmentLatter;