import React from "react";
import { FaEdit } from "react-icons/fa";
import { MdCurrencyRupee } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Stack,
  Chip,
  Avatar,
  LinearProgress,
  Tooltip,
  IconButton,
  Paper,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const currency = (v) =>
  typeof v === "number"
    ? v.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })
    : "-";

export default function Emp_salary({ data }) {

  const navigate = useNavigate();

  const sections = [
    {
      title: "Earnings",
      color: "success.main",
      items: [
        { label: "Basic", value: data?.salary_data?.basic },
        { label: "HRA", value: data?.salary_data?.hra },
        { label: "Transport", value: data?.salary_data?.transport },
        { label: "Car Facility Limit", value: data?.salary_data?.carFacilityLimit },
        { label: "Children Allowance", value: data?.salary_data?.childrenAI },
        { label: "Medical", value: data?.salary_data?.medical },
        { label: "Special Allowance", value: data?.salary_data?.special_allowance },
        { label: "Uniform", value: data?.salary_data?.uniform },
        { label: "Special", value: data?.salary_data?.special },
        { label: "Others", value: data?.salary_data?.others },
      ],
    },
    {
      title: "Employer Contributions",
      color: "info.main",
      items: [
        { label: "PF (Employer)", value: data?.salary_data?.pfEmployee },
        { label: "Gratuity", value: data?.salary_data?.gratuity },
        { label: "Employer Benefit", value: data?.salary_data?.employerBenefitAmount },
      ],
    },
    {
      title: "Reimbursements",
      color: "error.main",
      items: [
        { label: "PF (Employee)", value: 0 },
        { label: "TDS", value: 0 },
        { label: "Professional Tax", value: 0 },
      ],
    },
  ];

  const summaryCards = [
    {
      label: "Total CTC Monthly",
      value: currency(data?.salary_data?.monthlySalary),
      color: "primary.main",
    },
    {
      label: "Gross Monthly",
      value: currency(data?.salary_data?.grossMonthly),
      color: "primary.main",
    },
    {
      label: "Take Home Monthly",
      value: currency(data?.salary_data?.takeHomeMonthly),
      color: "success.main",
    },
  ];

  const handleProfileEditRedirect = (id) => {
    localStorage.setItem("onBoardingId", id);
    navigate('/salary');
  };

  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => item.value !== 0 && item.value !== null && item.value !== undefined
      ),
    }))
    .filter((section) => section.items.length > 0);


  return (
    <>
      <div className="row my-3" data-aos="fade-in" data-aos-duration="3000">
        <div className="col-lg-12">
          <div className="sitecard pr-0">
            <div className="infobox">

              <div className="AddPencialInTabs">
                <h5>Earning</h5>
                <span className="PensileEdit" onClick={(e) => handleProfileEditRedirect(data?._id)}><FaEdit size={20} /></span>
              </div>

              {
                ["empanelled", "OnContract", "onContract" , 'emPanelled'].includes(data?.employee_type) ? (
                  <Box mt={4} width={'98%'}>
                    <Card sx={{ p: 3, bgcolor: "white", borderRadius: 2, boxShadow: 1, border: "1px solid #e0e0e0" }}>
                      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                        <Box sx={{ width: 4, height: 24, bgcolor: "#212121", borderRadius: 1 }} />
                        <Typography variant="h6" fontWeight={600} color="#212121">
                          Monthly / Per Visit Summary
                        </Typography>
                      </Stack>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Box sx={{ bgcolor: "#fafafa", p: 2, borderRadius: 2, border: "1px solid #e0e0e0" }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                              Total CTC Monthly / Per Visit
                            </Typography>
                            <Typography variant="h6" fontWeight={600} color="#212121" sx={{ mt: 0.5 }}>
                              {currency(data?.salary_data?.monthlySalary)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <Box sx={{ bgcolor: "#fafafa", p: 2, borderRadius: 2, border: "1px solid #e0e0e0" }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                              Tds Deduction of {data?.salary_data?.tdsPercent}% Monthly / Per Visit
                            </Typography>
                            <Typography variant="h6" fontWeight={600} color="#212121" sx={{ mt: 0.5 }}>
                              {currency(data?.salary_data?.tds)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <Box sx={{ bgcolor: "#fafafa", p: 2, borderRadius: 2, border: "1px solid #e0e0e0" }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                              Gross CTC Monthly / Per Visit
                            </Typography>
                            <Typography variant="h6" fontWeight={600} color="#212121" sx={{ mt: 0.5 }}>
                              {currency(data?.salary_data?.takeHomeMonthly)}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Card>
                  </Box>

                ) : (

                  <>
                    <Grid container spacing={2} mb={3} width={'98%'}>
                      {summaryCards.map((card, idx) => (
                        <Grid item xs={12} md={4} key={idx}>
                          <Card sx={{ borderTop: 3, borderColor: "#212121", boxShadow: 1, border: "1px solid #e0e0e0" }}>
                            <CardContent>
                              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                {card.label}
                              </Typography>
                              <Typography variant="h5" fontWeight={600} color="#212121" sx={{ my: 1 }}>
                                {card.value}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    <Grid container spacing={2} width={'98%'}>
                      {sections
                        .map((section) => ({
                          ...section,
                          items: section.items.filter(
                            (item) => item.value !== 0 && item.value !== null && item.value !== undefined
                          ),
                        }))
                        .filter((section) => section.items.length > 0)
                        .map((section, idx) => (
                          <Grid item xs={12} md={filteredSections?.length > 1 ? 6 : 4} key={idx}>
                            <Paper
                              elevation={1}
                              sx={{ borderLeft: 4, borderColor: section.color, borderRadius: 2, border: "1px solid #e0e0e0" }}
                            >
                              <Box sx={{ p: 3 }}>
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  mb={2}
                                >
                                  <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Typography variant="subtitle1" fontWeight={600} color="#212121">
                                      {section.title}
                                    </Typography>
                                  </Stack>
                                  <Tooltip title={`View ${section.title.toLowerCase()}`}>
                                    <IconButton size="small" sx={{ color: "#757575" }}>
                                      <InfoOutlinedIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                                <Divider sx={{ mb: 2 }} />
                                <Stack spacing={1.5}>
                                  {section.items.map((item, itemIdx) => (
                                    <Stack
                                      key={itemIdx}
                                      direction="row"
                                      justifyContent="space-between"
                                      alignItems="center"
                                    >
                                      <Typography variant="body2" color="text.secondary">
                                        {item.label}
                                      </Typography>
                                      <Typography variant="body2" fontWeight={500} color="#212121">
                                        {currency(item.value)}
                                      </Typography>
                                    </Stack>
                                  ))}
                                </Stack>
                                <Divider sx={{ my: 2 }} />
                                {
                                  section.title === 'Earnings' && (
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                      <Typography variant="body2" fontWeight={600} color="#424242">
                                        Total
                                      </Typography>
                                      <Typography variant="body2" fontWeight={600} color="#212121">
                                        {currency(section.items.reduce((sum, item) => sum + (item.value || 0), 0))}
                                      </Typography>
                                    </Stack>
                                  )
                                }
                              </Box>
                            </Paper>
                          </Grid>
                        ))}
                    </Grid>

                    <Box mt={4} width={'98%'}>
                      <Card sx={{ p: 3, bgcolor: "white", borderRadius: 2, boxShadow: 1, border: "1px solid #e0e0e0" }}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                          <Box sx={{ width: 4, height: 24, bgcolor: "#212121", borderRadius: 1 }} />
                          <Typography variant="h6" fontWeight={600} color="#212121">
                            Annual Summary
                          </Typography>
                        </Stack>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={4}>
                            <Box sx={{ bgcolor: "#fafafa", p: 2, borderRadius: 2, border: "1px solid #e0e0e0" }}>
                              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                Total CTC Annual
                              </Typography>
                              <Typography variant="h6" fontWeight={600} color="#212121" sx={{ mt: 0.5 }}>
                                {currency(data?.salary_data?.totalCTOAnnual)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <Box sx={{ bgcolor: "#fafafa", p: 2, borderRadius: 2, border: "1px solid #e0e0e0" }}>
                              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                Gross CTC Annual
                              </Typography>
                              <Typography variant="h6" fontWeight={600} color="#212121" sx={{ mt: 0.5 }}>
                                {currency(data?.salary_data?.grossAnnual)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <Box sx={{ bgcolor: "#fafafa", p: 2, borderRadius: 2, border: "1px solid #e0e0e0" }}>
                              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                Take Home Annual
                              </Typography>
                              <Typography variant="h6" fontWeight={600} color="#212121" sx={{ mt: 0.5 }}>
                                {currency(data?.salary_data?.takeHomeAnnual)}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    </Box>
                  </>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}