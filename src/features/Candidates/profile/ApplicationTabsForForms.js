import React, { useState, lazy, Suspense } from 'react';
import { Tabs, Tab, Box, Typography, Card, CardContent } from '@mui/material';
import ApplicantForm from './ApplicantForm';
import JoiningReportForm from './AnnuxureJoiningForm';
import JoiningReportFormAddEdit from './AnnuxureEditForm';
import ApplicationFormEditORAdd from './ApplicationFormEditORAdd';
import DeclarationForm from './DeclarationForm';
import CandidateIdCart from './IDCartComponets/CandidateIdCart';
// Lazy load OfferLatter to reduce initial bundle size
const OfferLatter = lazy(() => import('./InvitationsLatters/OfferLatter'));
const AppointmentLatter = lazy(() => import('./InvitationsLatters/AppointmentLatter'));

const ApplicationTabs = ({ candidate_data }) => {
    const [tabValue, setTabValue] = useState(0);
    const [editApplication, setEditApplication] = useState(false);
    const handleChange = (event, newValue) => {
        setTabValue(newValue);
        setEditApplication(false)
    };

    return (
        <>

            <Box sx={{ width: '100%' }}>
                <Tabs
                    value={tabValue}
                    onChange={handleChange}
                    variant="fullWidth"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
                >
                    <Tab label="Applicant Form" />
                    <Tab label="Offer Letter" />
                    <Tab label="Appointment Letter" />
                    <Tab label="Joining Form" />
                    <Tab label="Declaration Form" />
                    <Tab label="ID Card" />
                </Tabs>

                {tabValue === 0 && (
                    <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
                        <CardContent>
                            {
                                editApplication || candidate_data?.applicant_form_status === 'Pending' ?
                                    <ApplicationFormEditORAdd candidate_data={candidate_data} setEditApplicant={setEditApplication} />
                                    :
                                    <ApplicantForm candidate_data={candidate_data} setEditApplicant={setEditApplication} />
                            }
                        </CardContent>
                    </Card>
                )}


                {tabValue === 1 && (
                    <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
                        <CardContent>
                            <Suspense fallback={<Typography variant="body2">Loading Offer Letter…</Typography>}>
                                <OfferLatter candidateData={candidate_data} />
                            </Suspense>
                        </CardContent>
                    </Card>
                )}

                {
                    tabValue === 2 && (
                        <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
                            <CardContent>
                                <Suspense fallback={<Typography sx={{ textAlign:'center'}} variant="body2">Loading Appointment Letter…</Typography>}>
                                    <AppointmentLatter candidateData={candidate_data} />
                                </Suspense>
                            </CardContent>
                        </Card>
                    )
                }

                {tabValue === 3 && (
                    <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
                        <CardContent>
                            {
                                editApplication || candidate_data?.annexure_eleven_form_status === 'Pending' ?
                                    <JoiningReportFormAddEdit candidateData={candidate_data} setEditApplicant={setEditApplication} />
                                    :
                                    <JoiningReportForm candidateData={candidate_data} setEditApplicant={setEditApplication} />
                            }
                        </CardContent>
                    </Card>
                )}

                {tabValue === 4 && (
                    <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
                        <CardContent>
                            <DeclarationForm candidateData={candidate_data} />
                        </CardContent>
                    </Card>
                )}

                {tabValue === 5 && (
                    <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
                        <CardContent>
                            <CandidateIdCart candidateData={candidate_data} />
                        </CardContent>
                    </Card>
                )}
            </Box>
        </>

    );
};

export default ApplicationTabs;