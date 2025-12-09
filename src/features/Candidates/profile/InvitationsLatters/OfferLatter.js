import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import config from '../../../../config/config';
import { apiHeaderToken } from '../../../../config/api_header';

const OfferLatter = ({ candidateData }) => {

    const [offerLatterData, setOfferLatterData] = useState(null);

    useEffect(() => {

        const getOfferLatter = async (values) => {
            try {
                let paylaods = {
                    "candidate_id": candidateData?._id,
                    "doc_category": "Offer Letter",
                    "approval_note_id": candidateData?.applied_jobs?.find((item) => item?.job_id === candidateData?.job_id)?.approval_note_data?.doc_id
                }

                let response = await axios.post(`${config.API_URL}getCandidateEmailContent`, paylaods, apiHeaderToken(config?.API_TOKEN))
                if (response.status === 200) {
                    setOfferLatterData(response?.data?.data)
                } else {
                    setOfferLatterData(null)
                }
            } catch (error) {
                setOfferLatterData(null)
            }
            // handle submission logic
        };
        getOfferLatter();
    }, [candidateData])

    const formRef = useRef();

    const handlePrint = useReactToPrint({
        contentRef: formRef,
        pageStyle: `
        @media print {
        body { margin: 0; }
        .MuiPaper-root {
            box-shadow: none !important;
            padding: 0 !important;
            max-width: 100% !important;
        }
        }
  `
    });

    const contentHtml = offerLatterData?.content_data?.trim();
    
    // Create a sanitized version of the incoming HTML to remove controls and normalize sizing
    // const sanitizedHtml = useMemo(() => {
    //     if (!contentHtml) return '';
    //     try {
    //         const parser = new DOMParser();
    //         const doc = parser.parseFromString(contentHtml, 'text/html');
    //         const body = doc.body;
            
            
    //         // Normalize inline styles that cause oversized fonts/gaps
    //         body.querySelectorAll('*').forEach((el) => {
    //             const style = el.getAttribute('style');
    //             if (style) {
    //                 // Drop font-size and line-height from inline styles
    //                 const cleaned = style
    //                     .replace(/font-size\s*:\s*[^;]+;?/gi, '')
    //                     .replace(/line-height\s*:\s*[^;]+;?/gi, '')
    //                     .replace(/zoom\s*:\s*[^;]+;?/gi, '')
    //                     .replace(/transform\s*:\s*[^;]+;?/gi, '');
    //                 if (cleaned.trim()) {
    //                     el.setAttribute('style', cleaned);
    //                 } else {
    //                     el.removeAttribute('style');
    //                 }
    //             }
    //         });
    //         return body.innerHTML;
    //     } catch (e) {
    //         return contentHtml;
    //     }
    // }, [contentHtml]);
    
    const hasContent = Boolean(contentHtml);

    return (
        <>
            {hasContent && (
                <Box sx={{
                    textAlign: 'center',
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Button
                        variant="contained"
                        sx={{
                            textAlign: 'center',
                            alignItems: 'center',
                            marginBottom: "5px"
                        }}
                        color="primary"
                        startIcon={<PrintIcon />}
                        onClick={handlePrint}
                    >
                        Print Form
                    </Button>
                </Box>
            )}

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: hasContent ? undefined : 200,
                    px: 2
                }}
            >
                {hasContent ? (
                    <Box
                        ref={formRef}
                        sx={{
                            width: '100%',
                            maxWidth: '100% !important',
                            mx: 'auto',
                            bgcolor: 'background.paper',
                            p: 2,
                            boxShadow: 'none',
                            '& *': {
                                boxSizing: 'border-box',
                                fontSize: '12px !important',
                                lineHeight: 1.2,
                            },
                            // Override any inline max-width coming from the template
                            '& [style*="max-width"]': { maxWidth: '100% !important' },
                            '& h1': { fontSize: '20px !important', margin: '12px 0 8px' },
                            '& h2': { fontSize: '18px !important', margin: '12px 0 8px' },
                            '& h3': { fontSize: '16px !important', margin: '10px 0 6px' },
                            '& p': { margin: '0px' },
                            '& ul, & ol': { margin: '8px 0 8px 20px' },
                            '& table': { width: '100% !important', borderCollapse: 'collapse', margin: '8px 0' },
                            '& th, & td': {padding: '6px 8px', verticalAlign: 'top' },
                            '& img': { maxWidth: '100%', height: 'auto' },
                            '& a': { color: 'inherit', textDecoration: 'none' },
                            '& p.ql-align-justify': { margin: '0px 0' },
                        }}
                    >
                        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                    </Box>
                ) : (
                    <Box component="h3" sx={{ m: 0 }}>
                        No Data Found
                    </Box>
                )}
            </Box>
        </>
    );
};

export default OfferLatter;