import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Tab, Tabs } from "@mui/material";
import config from "../../config/config";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useReactToPrint } from "react-to-print";
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';


const HEADER_HEIGHT_MM = 32;
const FOOTER_HEIGHT_MM = 26;
const SIDE_PADDING_MM = 10;

// PDF Styles - Exact match to print CSS


const AppointmentLetterCommon = ({ templateDescription, webSettingData, previewData }) => {
  const hasContent = Boolean(templateDescription?.trim());
  const formRef = useRef(null);
  const [activeTab, setActiveTab] = useState(1);

  const pdfStyles = StyleSheet.create({
    page: {
      size: 'A4',
      margin: 0,
      padding: `5mm`,
      backgroundColor: '#ffffff',
      fontSize: 11,
      // textAlign:'center',
      lineHeight: 1.5,
      position: 'relative',
    },

    // ✅ Fixed watermark container
    watermarkContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 0,
    },

    // ✅ Fixed watermark image
    watermark: {
      width: '60%',
      opacity: 0.08,
      objectFit: 'contain',
    },

    headerLines: {
      height: '5px',
      marginBottom: '12px',
      backgroundColor: webSettingData?.header_color,
    },

    logo: {
      width: 'auto',
      height: '20mm',
      maxWidth: '45mm',
      objectFit: 'contain',
      opacity: 0.7,
    },

    content: {
      flex: 1,
      padding: `6mm 5mm`,
      fontSize: 9,
      lineHeight: 1.5,
      marginTop: `8mm`,
      marginBottom: `5mm`,
    },

    footerLines: {
      height: '6px',
      marginTop: '4px',
      backgroundColor: webSettingData?.footer_color,
    },

    companyName: {
      fontSize: 9,
      fontWeight: 'bold',
      marginBottom: '2mm',
      color: '#1d1e30',
    },

    address: {
      fontSize: 8,
      marginBottom: '1mm',
      color: '#1d1e30',
    },

    contact: {
      fontSize: 9,
      color: '#1d1e30',
    },

    heading1: {
      fontSize: 12,
      fontWeight: 'bold',
      margin: '16pt 0 12pt 0',
      color: '#1d1e30',
    },

    heading2: {
      fontSize: 10,
      fontWeight: 'bold',
      margin: '14pt 0 10pt 0',
      color: '#1d1e30',
    },

    heading3: {
      fontSize: 9,
      fontWeight: 'bold',
      margin: '12pt 0 8pt 0',
      color: '#1d1e30',
    },

    paragraph: {
      fontSize: 9,
      margin: '8pt 0',
      lineHeight: 1.5,
      textAlign: 'justify',
    },

    list: {
      margin: '8pt 0 8pt 24pt',
      padding: 0,
      fontSize: 10,
    },

    listItem: {
      margin: '4pt 0',
      fontSize: 10,
      lineHeight: 1.5,
    },

    separator: {
      margin: '0 4px',
    },

    table: {
      width: '100%',
      margin: '10pt 0',
      borderWidth: 1,
      borderColor: '#d9dfe8',
      borderStyle: 'solid',
    },

    tableHeader: {
      flex: 1,
      padding: '6pt 8pt',
      fontSize: 9,
      fontWeight: 'bold',
      backgroundColor: '#f5f7fa',
      borderRightWidth: 1,
      borderRightColor: '#d9dfe8',
      borderBottomWidth: 1,
      borderBottomColor: '#d9dfe8',
      color: '#1d1e30',
    },

    tableCell: {
      flex: 1,
      padding: '6pt 8pt',
      fontSize: 9,
      borderRightWidth: 1,
      borderRightColor: '#d9dfe8',
      borderBottomWidth: 1,
      borderBottomColor: '#d9dfe8',
      lineHeight: 1.5,
    },

    tableCellRight: {
      flex: 1,
      padding: '6pt 8pt',
      fontSize: 11,
      borderBottomWidth: 1,
      borderBottomColor: '#d9dfe8',
      lineHeight: 1.5,
    },
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

  const parseInlineText = useCallback((element) => {
    const children = Array.from(element.childNodes);
    return children.map((child, idx) => {
      if (child.nodeType === Node.TEXT_NODE) {
        return child.textContent;
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName.toLowerCase();
        const content = child.textContent;

        if (tag === "strong" || tag === "b") {
          return <Text key={idx} style={{ fontWeight: "bold" }}>{content}</Text>;
        } else if (tag === "em" || tag === "i") {
          return <Text key={idx} style={{ fontStyle: "italic" }}>{content}</Text>;
        } else if (tag === "u") {
          return <Text key={idx} style={{ textDecoration: "underline" }}>{content}</Text>;
        }
        return content;
      }
      return "";
    });
  }, []);
  // Helper to skip header/text sections

  const hasSkipClass = useCallback((el) => {
    let current = el;
    while (current) {
      if (current.classList?.contains("headerContent")) {
        return true;
      }
      current = current.parentElement;
    }
    return false;
  }, []);

  const parsedPdfContent = useMemo(() => {
    if (!templateDescription) return [];

    const parseElement = (element, index) => {
      if (hasSkipClass(element)) return null;

      const tagName = element.tagName.toLowerCase();
      const className = element.className || '';
      const attributes = element.attributes;

      switch (tagName) {
        case 'h1':
          return <Text key={index} style={pdfStyles.heading1}>{parseInlineText(element)}</Text>;
        case 'h2':
          return <Text key={index} style={pdfStyles.heading2}>{parseInlineText(element)}</Text>;
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          return <Text key={index} style={pdfStyles.heading3}>{parseInlineText(element)}</Text>;
        case 'p': {
          const pContent = parseInlineText(element);
          if (!pContent || (typeof pContent === "string" && pContent.trim() === "")) {
            return <Text key={index}>{"\n"}</Text>;
          }
          return <Text key={index} style={pdfStyles.paragraph}>{pContent}</Text>;
        }
        case 'br':
          return <Text key={index}>{"\n"}</Text>;
        case 'ul':
          return (
            <View key={index} style={pdfStyles.list}>
              {Array.from(element.children).map((li, liIndex) => (
                <Text key={liIndex} style={pdfStyles.listItem}>• {parseInlineText(li)}</Text>
              ))}
            </View>
          );
        case 'ol':
          return (
            <View key={index} style={pdfStyles.list}>
              {Array.from(element.children).map((li, liIndex) => (
                <Text key={liIndex} style={pdfStyles.listItem}>{liIndex + 1}. {parseInlineText(li)}</Text>
              ))}
            </View>
          );
        case 'table': {
          const isPresentationTable = attributes.getNamedItem('role')?.value === 'presentation' ||
            className.includes('table') ||
            element.style.border ||
            element.getAttribute("style")?.includes("border");

          if (isPresentationTable) {
            const headerRows = [];
            const bodyRows = [];

            const thead = element.querySelector("thead");
            if (thead) {
              Array.from(thead.querySelectorAll("tr")).forEach((row, rowIdx) => {
                const cells = Array.from(row.children);
                headerRows.push(
                  <View key={`h-${rowIdx}`} style={{ flexDirection: "row" }}>
                    {cells.map((cell, cellIndex) => (
                      <Text
                        key={cellIndex}
                        style={{
                          ...pdfStyles.tableHeader,
                          flex: 1,
                          textAlign: cell.style.textAlign || "left",
                        }}
                      >
                        {parseInlineText(cell)}
                      </Text>
                    ))}
                  </View>
                );
              });
            }

            const tbody = element.querySelector("tbody");
            if (tbody) {
              Array.from(tbody.querySelectorAll("tr")).forEach((row, rowIdx) => {
                const cells = Array.from(row.children);
                bodyRows.push(
                  <View key={`b-${rowIdx}`} style={{ flexDirection: "row" }}>
                    {cells.map((cell, cellIndex) => {
                      const isLastCell = cellIndex === cells.length - 1;
                      const textAlign = cell.style.textAlign || (isLastCell ? "right" : "left");
                      return (
                        <Text
                          key={cellIndex}
                          style={{
                            ...(isLastCell ? pdfStyles.tableCellRight : pdfStyles.tableCell),
                            flex: 1,
                            textAlign,
                          }}
                        >
                          {parseInlineText(cell)}
                        </Text>
                      );
                    })}
                  </View>
                );
              });
            }

            return (
              <View key={index} style={pdfStyles.table}>
                {headerRows}
                {bodyRows}
              </View>
            );
          } else {
            const tableContent = [];

            const directRows = Array.from(element.children).filter(child =>
              child.tagName.toLowerCase() === 'tr' || child.tagName.toLowerCase() === 'tbody'
            );

            directRows.forEach((rowOrTbody, rowIdx) => {
              const rows = rowOrTbody.tagName.toLowerCase() === 'tbody'
                ? Array.from(rowOrTbody.children)
                : [rowOrTbody];

              rows.forEach((row, subRowIdx) => {
                if (row.tagName.toLowerCase() !== 'tr') return;

                if (row.classList.contains('headerContent')) {
                  return;
                }

                Array.from(row.children).forEach((cell, cellIdx) => {
                  if (cell.tagName.toLowerCase() !== 'td' && cell.tagName.toLowerCase() !== 'th') return;

                  Array.from(cell.children).forEach((child, childIdx) => {
                    const parsed = parseElement(child, `${index}-${rowIdx}-${subRowIdx}-${cellIdx}-${childIdx}`);
                    if (parsed) tableContent.push(parsed);
                  });
                });
              });
            });
            return <View key={index}>{tableContent}</View>;
          }
        }
        case 'div': {
          if (element.getAttribute('data-type') === 'signature-placeholder') {
            if (webSettingData?.hod_hr_signature) {
              return (
                <Image
                  key={index}
                  style={{ width: 100, height: 60, marginTop: 10, marginBottom: 10 }}
                  src={config.IMAGE_PATH + webSettingData.hod_hr_signature}
                />
              );
            }
            return null;
          }
          const divChildren = Array.from(element.children);
          if (divChildren.length > 0) {
            const parsedChildren = divChildren.map((child, childIdx) => parseElement(child, `${index}-${childIdx}`)).filter(Boolean);
            return (
              <View key={index}>
                {parsedChildren}
              </View>
            );
          }
          const textContent = element.textContent.trim();
          if (textContent) {
            return <Text key={index} style={pdfStyles.paragraph}>{parseInlineText(element)}</Text>;
          }
          return null;
        }
        case 'hr':
          return <View key={index} style={{ borderTop: '1pt solid #d9dfe8', margin: '8pt 0', height: 0 }} />;
        case 'span':
          return <Text key={index} style={pdfStyles.paragraph}>{parseInlineText(element)}</Text>;
        case 'strong':
        case 'b':
          return <Text key={index} style={{ ...pdfStyles.paragraph, fontWeight: 'bold' }}>{parseInlineText(element)}</Text>;
        case 'em':
        case 'i':
          return <Text key={index} style={{ ...pdfStyles.paragraph, fontStyle: 'italic' }}>{parseInlineText(element)}</Text>;
        case 'u':
          return <Text key={index} style={{ ...pdfStyles.paragraph, textDecoration: 'underline' }}>{parseInlineText(element)}</Text>;
        default:
          if (element.textContent.trim()) {
            return <Text key={index} style={pdfStyles.paragraph}>{parseInlineText(element)}</Text>;
          }
          return null;
      }
    };

    const tempDiv = document.createElement('div');
    // Pre-process functionality for signature
    const processedDescription = templateDescription.replace(
      /\{#signature\}/g,
      '<div data-type="signature-placeholder"></div>'
    );
    tempDiv.innerHTML = processedDescription;
    const elements = Array.from(tempDiv.children);

    const validElements = elements.filter(el => {
      const tagName = el.tagName.toLowerCase();
      const isHeadElement = ['meta', 'title', 'link', 'script', 'style', 'head'].includes(tagName);
      return !isHeadElement;
    });

    if (validElements.length === 1 && validElements[0].tagName.toLowerCase() === 'div' && !hasSkipClass(validElements[0])) {
      const singleDiv = validElements[0];
      const divChildren = Array.from(singleDiv.children);
      return divChildren.map((el, i) => parseElement(el, i)).filter(Boolean);
    }

    return validElements.map((el, i) => parseElement(el, i)).filter(Boolean);
  }, [templateDescription, parseInlineText, hasSkipClass, webSettingData, pdfStyles]); // FIXED: Added dependencies

  let showSignature = useMemo(() => {
    if (previewData?.template_for === "Appointment Letter") {
      return true
    }
    return false
  }, [previewData])

  // FIX 4: Memoize PDF Document component
  const PdfDocument = useMemo(() => {
    const documentTitle = previewData?.template_for || previewData?.doc_category || previewData;

    const cleanWebsite = webSettingData?.website_link?.replace("https://hrms.", "https://");
    return () => (
      <Document title={documentTitle}>
        <Page size="A4" style={pdfStyles.page}>

          {webSettingData?.water_mark_file && (
            <View style={pdfStyles.watermarkContainer} fixed>
              <Image
                style={pdfStyles.watermark}
                src={config.IMAGE_PATH + webSettingData.water_mark_file}
              />
            </View>
          )}


          <View style={pdfStyles.header} fixed>
            <View style={pdfStyles.headerLines} />
            <View style={pdfStyles.branding}>
              {webSettingData?.logo_image && (
                <Image
                  style={pdfStyles.logo}
                  src={config.IMAGE_PATH + webSettingData.logo_image}
                />
              )}
            </View>
          </View>

          <View style={pdfStyles.content}>
            {parsedPdfContent}
          </View>
          <View style={pdfStyles.footer} fixed>
            <Text style={pdfStyles.companyName}>
              {webSettingData?.meta_title}
            </Text>

            <Text style={pdfStyles.address}>
              {webSettingData?.office_address}
            </Text>

            <Text style={pdfStyles.contact}>
              Tel: {webSettingData?.organization_mobile_no}
              <Text style={pdfStyles.separator}> | </Text>
              Email: {webSettingData?.organization_email_id}
              <Text style={pdfStyles.separator}> | </Text>
              Website: {cleanWebsite}
            </Text>

            <View style={{ position: 'absolute', bottom: 1, right: 5 }}>
              <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                {showSignature && (
                  <Image
                    style={{ width: 100, height: 60 }}
                    src={config.IMAGE_PATH + webSettingData?.hod_hr_signature}
                  />
                )}
              </View>
            </View>

            <View style={pdfStyles.footerLines} />
          </View>

        </Page>
      </Document>
    );
  }, [parsedPdfContent, webSettingData, previewData]);

  const handlePrint = useReactToPrint({
    contentRef: formRef,
    documentTitle: previewData?.template_for || previewData?.doc_category || previewData,
    filename: `${previewData?.template_for || previewData?.doc_category || previewData}.pdf`,
    onAfterPrint: () => {
      // Switch back to PDF tab after printing
      setActiveTab(1);
    },
    pageStyle: `
            :root { 
              --brand: ${webSettingData?.header_color}; 
              --footer: ${webSettingData?.footer_color}; 
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
    
            /* Preserve text alignment from template editor */
            .print-content * {
              text-align: inherit !important;
            }
    
            .print-content [style*="text-align"] {
              text-align: inherit !important;
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
              text-align: inherit !important;
            }
    
            .print-content h2 {
              font-size: 14pt !important;
              margin: 14px 0 10px 0 !important;
              color: var(--text);
              page-break-inside: avoid;
              page-break-after: avoid;
              page-break-before: auto;
              text-align: inherit !important;
            }
    
            .print-content h3 {
              font-size: 12pt !important;
              margin: 12px 0 8px 0 !important;
              color: var(--text);
              page-break-inside: avoid;
              page-break-after: avoid;
              page-break-before: auto;
              text-align: inherit !important;
            }
    
            .print-content p {
              font-size: 12px !important;
              margin: 8px 0 !important;
              line-height: 1.5 !important;
              text-align: inherit !important;
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
              text-align: inherit !important;
            }
    
            .print-content li {
              margin: 4px 0 !important;
              font-size: 12px !important;
              line-height: 1.5 !important;
              page-break-inside: avoid;
              text-align: inherit !important;
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
    
            /* Preserve all inline styles from rich text editor */
            .print-content [style] {
              text-align: inherit !important;
              font-weight: inherit !important;
              font-style: inherit !important;
              font-size: inherit !important;
              color: inherit !important;
              text-decoration: inherit !important;
            }
    
            /* Allow specific text-align overrides from editor */
            .print-content [style*="text-align: center"] {
              text-align: center !important;
            }
    
            .print-content [style*="text-align: right"] {
              text-align: right !important;
            }
    
            .print-content [style*="text-align: left"] {
              text-align: left !important;
            }
    
            .print-content [style*="text-align: justify"] {
              text-align: justify !important;
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
    
            /* Preserve formatting tags */
            .print-content strong,
            .print-content b {
              font-weight: 700 !important;
            }
    
            .print-content em,
            .print-content i {
              font-style: italic !important;
            }
    
            .print-content u {
              text-decoration: underline !important;
            }
    
            .print-content s,
            .print-content del {
              text-decoration: line-through !important;
            }
    
            .print-content mark {
              background-color: yellow !important;
              padding: 2px 4px;
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
    
            /* Preserve text alignment and formatting on screen */
            .print-content [style*="text-align: center"] {
              text-align: center !important;
            }
    
            .print-content [style*="text-align: right"] {
              text-align: right !important;
            }
    
            .print-content [style*="text-align: left"] {
              text-align: left !important;
            }
    
            .print-content [style*="text-align: justify"] {
              text-align: justify !important;
            }
    
            .print-content strong,
            .print-content b {
              font-weight: 700 !important;
            }
    
            .print-content em,
            .print-content i {
              font-style: italic !important;
            }
    
            .print-content u {
              text-decoration: underline !important;
            }
    
            .print-content s,
            .print-content del {
              text-decoration: line-through !important;
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

  return (
    <div>
      {hasContent && (
        <Box sx={{ textAlign: "center", display: "flex", gap: 2, alignItems: "center", justifyContent: "center", mb: 2 }}>
          <Button
            variant="contained"
            sx={{ textAlign: "center", alignItems: "center" }}
            color="primary"
            startIcon={<PrintIcon />}
            onClick={() => {
              // Switch to HTML tab for printing
              setActiveTab(0);
              // Small delay to ensure the tab switch completes before printing
              setTimeout(() => {
                handlePrint();
              }, 100);
            }}
            className="screen-only"
          >
            Print Letter
          </Button>
        </Box>
      )}

      {/* Tab Navigation */}
      {/* {hasContent && (
                      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                          <Tab label="HTML Preview" />
                          <Tab label="PDF Preview" />
                        </Tabs>
                      </Box>
                    )} */}

      <Box sx={{ display: "flex", justifyContent: "center", minHeight: hasContent ? undefined : 200, px: 2 }}>
        {hasContent ? (
          <>
            {/* HTML Preview Tab */}
            {activeTab === 0 && (
              <Box
                ref={formRef}
                className="MuiPaper-root print-content-only"
                sx={{
                  width: "210mm",
                  // display:'none',
                  mx: "auto",
                  bgcolor: "background.paper",
                  p: 4,
                  fontSize: '4.5mm',
                  boxShadow: 3,
                  "& table": {
                    width: "100% !important",
                    borderCollapse: "collapse",
                  },
                  "& b, strong , h4, h4": {
                    fontSize: '4.5mm',
                  },
                  "& .headerContent": {
                    display: 'none !important',
                  },
                  "& .watermark": {
                    display: 'none',
                  },
                  "& figure.table": {
                    border: "0.1px solid",
                  },
                  "& .screen-only-watermark": {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) scale(0.8)',
                    opacity: 0.08,
                    zIndex: 0,
                    pointerEvents: 'none',
                    width: '160mm',
                    maxWidth: '80%',
                  },
                  position: "relative",
                  "@media print": {
                    width: "100%",
                    boxShadow: "none",
                    border: "none !important",
                    bgcolor: "white !important",
                    "& table": {
                      width: "100% !important",
                    },
                    m: 0,
                    p: 0,
                    "& .headerContent": {
                      display: "none !important",
                    },
                    "& .watermark": {
                      display: 'block !important'
                    },
                    "& .screen-only-watermark": {
                      display: 'none !important'
                    },
                  },
                }}
              >
                {/* Watermark (behind content) */}
                <img
                  className="watermark"
                  src={config.IMAGE_PATH + webSettingData?.water_mark_file}
                  alt="watermark"
                />

                <img
                  className="screen-only-watermark"
                  src={config.IMAGE_PATH + webSettingData?.water_mark_file}
                  alt="watermark"
                />

                {/* HEADER */}
                <header className="page-header">
                  <div className="no-print" style={{ borderTop: `5px solid ${webSettingData?.header_color}`, height: "10px" }}></div>
                  <div className="header-lines"></div>
                  <div className="branding">
                    <img
                      className="logo"
                      src={config.IMAGE_PATH + webSettingData?.logo_image}
                      alt="Organization Logo"
                    />
                  </div>
                </header>

                {/* TABLE STRUCTURE FOR CONTENT FLOW */}
                <table className="print-table">
                  <thead>
                    <tr>
                      <td>
                        <div className="header-space">&nbsp;</div>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="content-cell">
                        <div className="print-content" dangerouslySetInnerHTML={{ __html: templateDescription }} />
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>
                        <div className="footer-space">&nbsp;</div>
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* FOOTER */}
                <footer className="page-footer">
                  <div className="footnote">
                    <span className="comanyname" style={{ fontSize: '5mm' }}>{webSettingData?.meta_title}</span>
                    <div style={{ marginTop: "2px", fontSize: "4mm" }}>
                      <span style={{ fontWeight: 500 }}>Corporate Address:</span> {webSettingData?.office_address}
                    </div>
                    <div style={{ fontSize: "4mm", marginTop: "2px" }}>
                      Tel: {webSettingData?.organization_mobile_no} <span className="sep">|</span> Email: {webSettingData?.organization_email_id} <span className="sep">|</span> Website:  {webSettingData?.website_link}
                    </div>
                  </div>


                  {
                    showSignature && (
                      <div style={{ position: 'absolute', bottom: '30px', right: '30px' }}>
                        <img src={`${config.IMAGE_PATH}${webSettingData?.hod_hr_signature}`} alt="signature" style={{ width: 100, height: 70 }} />
                      </div>
                    )
                  }


                  <div className="footer-lines"></div>
                  <div className="no-print" style={{ borderBottom: `7px solid ${webSettingData?.footer_color}`, height: "10px" }}></div>
                </footer>
              </Box>
            )}

            {/* PDF Preview Tab */}
            {activeTab === 1 && (
              <Box sx={{
                width: "210mm",
                height: "297mm",
                mx: "auto",
                border: '1px solid #ccc',
                boxShadow: 3,
                overflow: 'hidden',
                bgcolor: "background.paper",
                position: "relative",
              }}>
                <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                  <PdfDocument />
                </PDFViewer>
              </Box>
            )}
          </>
        ) : (
          <Box component="h5" sx={{ m: 0 }}>
            No Data Found
          </Box>
        )}
      </Box>

    </div>
  )
}

export default AppointmentLetterCommon;