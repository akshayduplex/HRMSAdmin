import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Tab, Tabs } from "@mui/material";
import config from "../../config/config";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useReactToPrint } from "react-to-print";
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image, Link, pdf } from '@react-pdf/renderer';


const HEADER_HEIGHT_MM = 32;
const FOOTER_HEIGHT_MM = 26;
const SIDE_PADDING_MM = 10;

// PDF Styles - Exact match to print CSS


const AppointmentLetterCommon = ({ templateDescription, webSettingData, previewData }) => {
  const hasContent = Boolean(templateDescription?.trim());
  const formRef = useRef(null);
  const [activeTab, setActiveTab] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);
  const pdfStyles = StyleSheet.create({
    page: {
      size: 'A4',
      margin: 0,
      padding: `5mm`,
      backgroundColor: '#ffffff',
      fontSize: 11,
      // textAlign:'center',
      lineHeight: 1.5,
      backgroundColor: '#fff',
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
      flexGrow: 1,
      marginTop: 10,
    },
    footer: {
      position: "absolute",
      bottom: 10,
      left: 15,
      right: 15,
      paddingTop: 5,
    },
    footerLines: {
      height: '6px',
      marginTop: '4px',
      backgroundColor: webSettingData?.footer_color,
    },
    signature: {
      width: 100,
      height: 50,
      position: "absolute",
      right: 5,
      bottom: 12,
      objectFit: "contain",
    },
    footerContent: {
      textAlign: "center",
      marginBottom: 6,
    },

    companyName: {
      fontSize: 9,
      fontWeight: 'bold',
      marginBottom: 2,
      color: '#1d1e30',
    },

    address: {
      fontSize: 8,
      marginBottom: 1,
      color: '#1d1e30',
    },

    contact: {
      fontSize: 9,
      color: '#1d1e30',
    },

    heading1: {
      fontSize: 12,
      marginTop: 10,
      marginBottom: 6,
    },

    heading2: {
      fontSize: 10,
      marginTop: 8,
      marginBottom: 4,
    },
    heading3: {
      fontSize: 9,
      fontWeight: 'bold',
      margin: '12pt 0 8pt 0',
      color: '#1d1e30',
    },

    paragraph: {
      fontSize: 9,
      marginTop: 4,
      marginBottom: 4,
      lineHeight: 1.4,
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

  const pagesWithSignature = useMemo(() => {
    if (!templateDescription) return new Set();
    const hasSignature = templateDescription.includes("{#signature}");
    return hasSignature ? new Set([0]) : new Set();
  }, [templateDescription]);

  const showFooterText = true;
  const showSignatureInFooter = (pageIndex) =>
    !pagesWithSignature.has(pageIndex) && webSettingData?.hod_hr_signature;

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
  }, [templateDescription, parseInlineText, hasSkipClass, webSettingData, pdfStyles]);

  let showSignature = useMemo(() => {
    if (previewData?.template_for === "Appointment Letter") {
      return true
    }
    return false
  }, [previewData])

  /* FIX 4: Memoize PDF Document component */
  const PdfDocument = useMemo(() => {
    const documentTitle = previewData?.template_for || previewData?.doc_category || previewData;
    const cleanWebsite = webSettingData?.website_link?.replace("https://hrms.", "https://");

    // -------- MANUAL PAGE SPLITTING --------
    const FIRST_PAGE_LIMIT = 17;
    const firstPageContent = parsedPdfContent.slice(0, FIRST_PAGE_LIMIT);
    const remainingContent = parsedPdfContent.slice(FIRST_PAGE_LIMIT);

    const hasSignatureInContent = (content) => {
      return content.some(item => {
        if (item && item.type === Image) {
          return true;
        }

        return false;
      });
    };

    return () => (
      <Document title={documentTitle}>

        <Page size="A4" style={pdfStyles.page}>

          {/* watermark */}
          {webSettingData?.water_mark_file && (
            <View style={pdfStyles.watermarkContainer} fixed>
              <Image
                style={pdfStyles.watermark}
                src={config.IMAGE_PATH + webSettingData.water_mark_file}
              />
            </View>
          )}

          {/* header */}
          <View style={pdfStyles.header} fixed>
            <View style={pdfStyles.headerLines} />
            {webSettingData?.logo_image && (
              <Image
                style={pdfStyles.logo}
                src={config.IMAGE_PATH + webSettingData.logo_image}
              />
            )}
          </View>

          {/* page 1 content */}
          <View style={pdfStyles.content}>
            {firstPageContent}
          </View>

          {/* footer on first page - WITH webSetting data */}
          <View style={pdfStyles.footer} fixed>
            <Text style={pdfStyles.companyName}>{webSettingData?.meta_title}</Text>
            <Text style={pdfStyles.address}> <Text style={{ fontWeight: 'bold' }}>Corporate Office:</Text> {webSettingData?.office_address}</Text>
            <Text style={pdfStyles.contact}>
              Tel: {webSettingData?.organization_mobile_no} |
              {' '}
              Email:{" "}
              <Link
                src={`mailto:${webSettingData?.organization_email_id}`}
                style={{ color: "#1976d2", textDecoration: "none" }}
              >
                {webSettingData?.organization_email_id}
              </Link>
              {" "}|
              {" "}
              Website:{" "}
              <Link
                src={cleanWebsite}
                style={{ color: "#1976d2", textDecoration: "none" }}
              >
                {cleanWebsite}
              </Link>
            </Text>

            {/* Condition: Show signature only if not already in content */}
            {showSignature && !hasSignatureInContent(firstPageContent) && webSettingData?.hod_hr_signature && (
              <Image
                style={{ width: 100, height: 60, position: 'absolute', right: 5, bottom: 1 }}
                src={config.IMAGE_PATH + webSettingData?.hod_hr_signature}
              />
            )}

            <View style={pdfStyles.footerLines} />
          </View>
        </Page>

        {/* ADDITIONAL PAGES */}
        {remainingContent.length > 0 && (
          (() => {
            const pages = [];
            const itemsPerPage = 25;

            for (let i = 0; i < remainingContent.length; i += itemsPerPage) {
              const pageContent = remainingContent.slice(i, i + itemsPerPage);
              const pageNum = Math.floor(i / itemsPerPage) + 2;

              pages.push(
                <Page key={`page-${pageNum}`} size="A4" style={pdfStyles.page}>
                  {/* header on every page */}
                  <View style={{ marginBottom: 10 }} fixed>
                    <View style={pdfStyles.headerLines} />
                    {webSettingData?.logo_image && (
                      <Image
                        style={pdfStyles.logo}
                        src={config.IMAGE_PATH + webSettingData.logo_image}
                      />
                    )}
                  </View>

                  <View style={pdfStyles.content}>
                    {pageContent}
                  </View>

                  <View style={pdfStyles.footer} fixed>
                    {showSignature && !hasSignatureInContent(pageContent) && webSettingData?.hod_hr_signature && (
                      <Image
                        style={{ width: 100, height: 60, position: 'absolute', right: 5, bottom: 1 }}
                        src={config.IMAGE_PATH + webSettingData?.hod_hr_signature}
                      />
                    )}
                    <View style={pdfStyles.footerLines} />
                  </View>
                </Page>
              );
            }
            return pages;
          })()
        )}

      </Document>
    );
  }, [parsedPdfContent, webSettingData, previewData]);

  const handlePrintPdf = useCallback(async () => {
    if (isPrinting) return;
    setIsPrinting(true);

    try {
      // Generate the PDF as Blob
      const blob = await pdf(<PdfDocument />).toBlob();

      // Create a temporary object URL
      const url = URL.createObjectURL(blob);

      // Create a hidden iframe (not visible to user)
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.style.position = 'absolute';
      iframe.style.width = '0px';
      iframe.style.height = '0px';
      iframe.src = url;

      document.body.appendChild(iframe);

      // Wait for iframe to load the PDF, then trigger print
      iframe.onload = () => {
        try {
          const win = iframe.contentWindow;
          if (win) {
            win.focus();
            win.print(); // ← This opens the native Print dialog
          }
        } catch (e) {
          console.warn('Print failed', e);
        }

        // Clean up after a short delay (so print dialog can stay open)
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
          setIsPrinting(false);
        }, 2000);
      };

    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Error generating PDF for printing.');
      setIsPrinting(false);
    }
  }, [PdfDocument]);

  return (
    <div>
      {hasContent && (
        <Box sx={{ textAlign: "center", display: "flex", gap: 2, alignItems: "center", justifyContent: "center", mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={handlePrintPdf}
            disabled={isPrinting}
            className="screen-only"
          >
            {isPrinting ? 'Generating PDF...' : 'Print Letter'}
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

      <Box sx={{ display: "flex", justifyContent: "center", px: 2 }}>
        {hasContent ? (
          <>
            <Box sx={{ textAlign: "center", mb: 2 }}>
              {/* <Button
                variant="contained"
                color="primary"
                startIcon={<PrintIcon />}
                onClick={handlePrintPdf}
              >
                Print Letter
              </Button> */}
            </Box>

            <Box sx={{
              width: "210mm",
              height: "297mm",
              mx: "auto",
              border: '1px solid #ccc',
              boxShadow: 3,
              overflow: 'hidden',
            }}>
              <PDFViewer width="100%" height="100%">
                <PdfDocument />
              </PDFViewer>
            </Box>
          </>
        ) : (
          <Box component="h5">No Data Found</Box>
        )}
      </Box>

    </div>
  )
}

export default AppointmentLetterCommon;