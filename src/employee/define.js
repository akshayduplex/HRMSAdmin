import React, { useState, useEffect, useRef } from "react";
import GoBackButton from "./Goback";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { addEmployeeSalaryInfo, getEmployeeById } from "./helper/Api_Helper";
import { Box, Button, Chip, DialogContent, FormControl, FormControlLabel, Grid, InputAdornment, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { useMemo } from "react";
import axios from "axios";
import config from "../config/config";
import { apiHeaderToken } from "../config/api_header";
import { useSearchParams } from "react-router-dom";



const currency = (n) =>
  (isNaN(n) ? 0 : n).toLocaleString(undefined, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

const Section = ({ title, children, accent = "white" }) => (
  <Box sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 2, mb: 2, bgcolor: accent }}>
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
      <Typography variant="subtitle1" fontWeight={600} sx={{ m: 0 }}>
        {title}
      </Typography>
    </Box>
    {children}
  </Box>
);

// coerce to number
const num = (v) => (v === "" || v == null ? 0 : Number(v));

// sanitize user input: allow only numbers; optionally allow one decimal point
const sanitizeNumeric = (raw, allowDecimal = false) => {
  if (typeof raw !== "string") raw = String(raw ?? "");
  // remove all except digits and dot
  let cleaned = raw.replace(/[^0-9.]/g, "");
  if (!allowDecimal) {
    // strip all dots if decimals not allowed
    cleaned = cleaned.replace(/\./g, "");
  } else {
    // if decimals allowed, keep only the first dot
    const firstDot = cleaned.indexOf(".");
    if (firstDot !== -1) {
      const before = cleaned.slice(0, firstDot + 1);
      const after = cleaned.slice(firstDot + 1).replace(/\./g, "");
      cleaned = before + after;
    }
  }
  return cleaned;
};

export default function Define() {

  const [searchParams] = useSearchParams();
  const [employeeData, setEmployeeData] = useState({});

  const [monthlySalary, setMonthlySalary] = useState('');
  const [salaryType, setSalaryType] = useState('mediclaim')
  const [basic, setBasic] = useState('');
  const [basicPercent, setBasicPercent] = useState('50');
  // HRA: percentage and editable amount
  const [hraPercent, setHraPercent] = useState('40');
  const [hraAmount, setHraAmount] = useState('');
  const [candidateData, setCandidateDetails] = useState(null);

  // Employer benefit (ESIC / Mediclaim / WorkmenComp / Others)
  const [employerBenefitType, setEmployerBenefitType] = useState('esic');
  const [employerBenefitManual, setEmployerBenefitManual] = useState('');
  const [employerBenefitTitle, setEmployerBenefitTitle] = useState('');

  const [childrenAI, setChildrenAI] = useState('');
  const [childrenHostelAI, setChildrenHostelAI] = useState('');
  const [transport, setTransport] = useState('');
  const [medical, setMedical] = useState('');
  const [special, setSpecial] = useState('');
  const [uniform, setUniform] = useState('');
  const [carFacilityLimit, setCarFacilityLimit] = useState('');
  const [others, setOthers] = useState('');

  // PF inputs removed — PF values are treated as 0 when not configured
  const [gratuityEnabled, setGratuityEnabled] = useState(true);
  const [gratuity, setGratuity] = useState('');
  const [pfEmployerManual, setPfEmployerManual] = useState('');
  const [pfEmployeeManual, setPfEmployeeManual] = useState('');

  // ======= Employee Deductions (editable) =======
  const [professionalTax, setProfessionalTax] = useState('');
  const [tds, setTds] = useState('');
   // Default 10% for empanelled/consultant
  const [tdsPercent, setTdsPercent] = useState('10');

  // Check if candidate is empanelled or OnContract for simplified view
  const allowedTypes = ["empanelled", "OnContract", "onContract" , 'emPanelled'];

  // Check if either variable exists in that array
  const isEmpanelledOrConsultant =
    allowedTypes.includes(candidateData?.job_type) ||
    allowedTypes.includes(employeeData?.employee_type);
  // ======= Reimbursements (editable) =======
  const [sodexo, setSodexo] = useState('');
  const [vehicleAllow, setVehicleAllow] = useState('');
  const [vehicleDS, setVehicleDS] = useState('');
  const [vehicleMaint, setVehicleMaint] = useState('');
  const [telephone, setTelephone] = useState('');
  const [books, setBooks] = useState('');
  const [helper, setHelper] = useState('');
  const [health, setHealth] = useState('');

  const [initialValues, setInitialValues] = useState({});

  // ======= Derived (auto recalculated) =======
  // HRA value is controlled by hraAmount; hraAmount is kept in sync with basic*hraPercent
  const hra = useMemo(() => num(hraAmount), [hraAmount]);

  useEffect(() => {
    if (salaryType) {
      setEmployerBenefitType(salaryType)
    }
  }, [salaryType])

  // keep hraAmount synced when basic or hraPercent change
  useEffect(() => {
    const b = num(basic);
    const pct = num(hraPercent) || 0;
    if (b > 0 && pct > 0) {
      const derived = Math.round((b * pct) / 100);
      setHraAmount(String(derived));
    } else {
      setHraAmount('');
    }
  }, [basic, hraPercent]);

  // derive Basic from monthlySalary and basicPercent (only if not manually edited)
  useEffect(() => {
    if (isManualBasicEditRef.current) {
      isManualBasicEditRef.current = false; // Reset flag after skipping
      return;
    }
    const ms = num(monthlySalary);
    const pct = num(basicPercent) || 0;
    if (ms > 0 && pct > 0) {
      const derived = Math.round((ms * pct) / 100);
      setBasic(String(derived));
    } else {
      setBasic('');
    }
  }, [monthlySalary, basicPercent]);

  // Auto-calculate TDS for empanelled/OnContract based on dynamic percentage
  useEffect(() => {
    if (isEmpanelledOrConsultant) {
      const ms = num(monthlySalary);
      const tdsPercentValue = num(tdsPercent) || 0;
      if (ms > 0 && tdsPercentValue > 0) {
        const calculatedTds = Math.round((ms * tdsPercentValue) / 100);
        setTds(String(calculatedTds));
      } else {
        setTds('');
      }
    }
  }, [monthlySalary, tdsPercent, isEmpanelledOrConsultant]);

  // Clear manual PF values when basic changes to allow auto-calculation
  useEffect(() => {
    setPfEmployerManual('');
    setPfEmployeeManual('');
  }, [basic]);
  // Auto-calculate Gratuity as 4.8% of Basic when Gratuity is enabled
  const grossMonthly = useMemo(
    () =>
      num(basic) +
      num(hraAmount) +
      num(childrenAI) +
      num(childrenHostelAI) +
      num(transport) +
      num(medical) +
      num(uniform) +
      num(carFacilityLimit) +
      num(special) +
      num(others),
    [basic, hraAmount, childrenAI, childrenHostelAI, transport, medical, uniform, carFacilityLimit, others, special]
  );

  useEffect(() => {
    if (gratuityEnabled) {
      if (salaryType === 'mediclaim') {
        // For Mediclaim: calculate based on gross monthly
        // const gross = num(grossMonthly);
        const gross = num(basic);
        if (gross > 0) {
          const derivedGratuity = Math.round((gross * 4.81) / 100);
          setGratuity(String(derivedGratuity));
        } else {
          setGratuity('');
        }
      } else {
        // For ESIC: calculate based on basic
        const b = num(basic);
        if (b > 0) {
          const derivedGratuity = Math.round((b * 4.81) / 100);
          setGratuity(String(derivedGratuity));
        } else {
          setGratuity('');
        }
      }
    }
  }, [gratuityEnabled, salaryType]);

  // const grossMonthly = useMemo(
  //   () =>
  //     num(basic) +
  //     hra +
  //     num(childrenAI) +
  //     num(childrenHostelAI) +
  //     num(transport) +
  //     num(medical) +
  //     num(special) +
  //     num(uniform) +
  //     num(carFacilityLimit) +
  //     num(others),
  //   [basic, hra, childrenAI, childrenHostelAI, transport, medical, special, uniform, carFacilityLimit, others]
  // );

  // PF: auto 12% of Basic by default, but editable via manual fields
  const pfDerived = useMemo(() => Math.round((num(basic) * 12) / 100), [basic]);
  const pfEmployee = useMemo(() => (num(pfEmployeeManual) > 0 ? num(pfEmployeeManual) : pfDerived), [pfEmployeeManual, pfDerived]);
  const pfEmployer = useMemo(() => (num(pfEmployerManual) > 0 ? num(pfEmployerManual) : pfDerived), [pfEmployerManual, pfDerived]);
  // employer benefit amount: ESIC is computed as grossMonthly * 3.25%, others are manual
  const employerBenefitAmount = useMemo(() => {
    if (employerBenefitType === 'esic') return Math.round((grossMonthly * 3.25) / 100);
    return num(employerBenefitManual);
  }, [employerBenefitType, grossMonthly, employerBenefitManual]);

  // auto-fill special as remaining amount after basic, hra and other allowances, then deduct employer contributions (PF, ESIC, Gratuity)
  useEffect(() => {
    const ms = num(monthlySalary);
    if (ms <= 0) {
      setSpecial('');
      return;
    }
    const otherAllowancesExcludingHraAndSpecial =
      num(childrenAI) +
      num(childrenHostelAI) +
      num(transport) +
      num(medical) +
      num(uniform) +
      num(carFacilityLimit) +
      num(others);

    // First calculate special as remaining amount (excluding employer contributions)
    const specialBeforeDeductions = Math.max(0, Math.round(ms - num(basic) - hra - otherAllowancesExcludingHraAndSpecial));

    // Calculate employer contributions that should be deducted from special allowance
    const employerContributions = pfEmployer + employerBenefitAmount + num(gratuity);

    // Final special amount after deducting employer contributions
    const finalSpecial = Math.max(0, specialBeforeDeductions - employerContributions);
    setSpecial(String(finalSpecial));
  }, [monthlySalary, basic, hra, childrenAI, childrenHostelAI, transport, medical, uniform, carFacilityLimit, others, pfEmployer, employerBenefitAmount, gratuity]);

  const ctcMonthly = useMemo(
    () => grossMonthly + pfEmployer + num(gratuity) + employerBenefitAmount,
    [grossMonthly, pfEmployer, gratuity, employerBenefitAmount]
  );

  const takeHomeMonthly = useMemo(() => {
    if (isEmpanelledOrConsultant) {
      // For empanelled/OnContract: Monthly Salary - TDS
      return num(monthlySalary) - num(tds);
    }
    // For regular employees: Gross - (PF + Professional Tax + TDS)
    return grossMonthly - (pfEmployee + num(professionalTax) + num(tds));
  }, [isEmpanelledOrConsultant, monthlySalary, tds, grossMonthly, pfEmployee, professionalTax]);

  const esiMonthly = useMemo(
    () => Math.round((grossMonthly * 0.75) / 100),
    [grossMonthly]
  );

  const reimbursementsMonthly = useMemo(
    () =>
      num(sodexo) +
      num(vehicleAllow) +
      num(vehicleDS) +
      num(vehicleMaint) +
      num(telephone) +
      num(books) +
      num(helper) +
      num(health),
    [sodexo, vehicleAllow, vehicleDS, vehicleMaint, telephone, books, helper, health]
  );

  const totalCTOMonthly = useMemo(
    () => ctcMonthly + reimbursementsMonthly,
    [ctcMonthly, reimbursementsMonthly]
  );

  // Annuals
  const annual = (m) => m * 12;
  const grossAnnual = annual(grossMonthly);
  const ctcAnnual = annual(ctcMonthly);
  const takeHomeAnnual = annual(takeHomeMonthly);
  const reimbursementsAnnual = annual(reimbursementsMonthly);
  const totalCTOAnnual = annual(totalCTOMonthly);

  // console.log(initialValues, 'this is initial value');
  // console.log(candidateData, 'this is candidate Details value');

  // hydrate from optional initialValues only once per open to avoid focus/caret jumps
  const hydratedRef = useRef(false);
  const isManualBasicEditRef = useRef(false);

  useEffect(() => {
    // if (!initialValues || hydratedRef.current) return;
    if (!initialValues) return
    const iv = initialValues || {};
    if (iv.monthlySalary != null) setMonthlySalary(sanitizeNumeric(String(iv.monthlySalary), false));
    if (iv.basicPercent != null) setBasicPercent(String(iv.basicPercent), false);
    if (iv.basic != null) setBasic(sanitizeNumeric(String(iv.basic), false));
    if (iv.hraPercent != null) setHraPercent(sanitizeNumeric(String(iv.hraPercent), false));
    if (iv.hraAmount != null) setHraAmount(sanitizeNumeric(String(iv.hraAmount), false));
    if (iv.childrenAI != null) setChildrenAI(sanitizeNumeric(String(iv.childrenAI), false));
    if (iv.childrenHostelAI != null) setChildrenHostelAI(sanitizeNumeric(String(iv.childrenHostelAI), false));
    if (iv.transport != null) setTransport(sanitizeNumeric(String(iv.transport), false));
    if (iv.medical != null) setMedical(sanitizeNumeric(String(iv.medical), false));
    if (iv.special != null) setSpecial(sanitizeNumeric(String(iv.special), false));
    if (iv.uniform != null) setUniform(sanitizeNumeric(String(iv.uniform), false));
    if (iv.carFacilityLimit != null) setCarFacilityLimit(sanitizeNumeric(String(iv.carFacilityLimit), false));
    if (iv.others != null) setOthers(sanitizeNumeric(String(iv.others), false));

    if (iv.employerBenefitType != null) setEmployerBenefitType(iv.employerBenefitType);
    if (iv.employerBenefitAmount != null) setEmployerBenefitManual(sanitizeNumeric(String(iv.employerBenefitAmount), false));
    if (iv.employerBenefitTitle != null) setEmployerBenefitTitle(iv.employerBenefitTitle);
    if (iv.salaryType != null) setSalaryType(iv.salaryType);

    if (iv.gratuity != null) {
      setGratuity(sanitizeNumeric(String(iv.gratuity), false));
    }
    if (iv.gratuityEnabled != null) setGratuityEnabled(iv.gratuityEnabled);

    if (iv.pfEmployer != null) setPfEmployerManual(sanitizeNumeric(String(iv.pfEmployer), false));
    if (iv.pfEmployee != null) setPfEmployeeManual(sanitizeNumeric(String(iv.pfEmployee), false));

    if (iv.professionalTax != null) setProfessionalTax(sanitizeNumeric(String(iv.professionalTax), false));
    if (iv.tds != null) setTds(sanitizeNumeric(String(iv.tds), false));
    if (iv.tdsPercent != null) setTdsPercent(sanitizeNumeric(String(iv.tdsPercent), false));

    if (iv.reimbursements) {
      const r = iv.reimbursements;
      if (r.sodexo != null) setSodexo(sanitizeNumeric(String(r.sodexo), false));
      if (r.vehicleAllow != null) setVehicleAllow(sanitizeNumeric(String(r.vehicleAllow), false));
      if (r.vehicleDS != null) setVehicleDS(sanitizeNumeric(String(r.vehicleDS), false));
      if (r.vehicleMaint != null) setVehicleMaint(sanitizeNumeric(String(r.vehicleMaint), false));
      if (r.telephone != null) setTelephone(sanitizeNumeric(String(r.telephone), false));
      if (r.books != null) setBooks(sanitizeNumeric(String(r.books), false));
      if (r.helper != null) setHelper(sanitizeNumeric(String(r.helper), false));
      if (r.health != null) setHealth(sanitizeNumeric(String(r.health), false));
    }
    hydratedRef.current = true;
  }, [initialValues]);

  const HandleSaveSalaryFromEmployee = async () => {
    const dataToSave = isEmpanelledOrConsultant ? {
      // For empanelled/OnContract: Only keep essential fields, set rest to 0
      basic: 0,
      hraPercent: 0,
      hraAmount: 0,
      hra: 0,
      childrenAI: 0,
      childrenHostelAI: 0,
      transport: 0,
      medical: 0,
      special: 0,
      uniform: 0,
      carFacilityLimit: 0,
      others: 0,
      isEmpanelledOrConsultant: isEmpanelledOrConsultant,
      gratuity: 0,
      monthlySalary: num(monthlySalary), // Keep monthly salary
      basicPercent: 0,

      employerBenefitType: '',
      employerBenefitAmount: 0,
      employerBenefitTitle: '',

      professionalTax: 0,
      tds: num(tds), // Keep TDS amount
      tdsPercent: num(tdsPercent), // Keep TDS percentage

      reimbursements: {
        sodexo: 0,
        vehicleAllow: 0,
        vehicleDS: 0,
        vehicleMaint: 0,
        telephone: 0,
        books: 0,
        helper: 0,
        health: 0,
      },

      // PF values set to 0
      pfEmployee: 0,
      pfEmployer: 0,

      salaryType: 'mediclaim', // Default salary type
      // totals - only keep take home, set rest to 0
      grossMonthly: 0,
      grossAnnual: 0,
      ctcMonthly: 0,
      ctcAnnual: 0,
      takeHomeMonthly: takeHomeMonthly, // Keep take home
      takeHomeAnnual: takeHomeMonthly * 12,
      reimbursementsMonthly: 0,
      reimbursementsAnnual: 0,
      totalCTOMonthly: 0,
      totalCTOAnnual: 0,
      gratuityEnabled: false,
    } : {
      // For regular employees: Keep all values as before
      basic: num(basic),
      hraPercent: num(hraPercent),
      hraAmount: num(hraAmount),
      hra,
      childrenAI: num(childrenAI),
      childrenHostelAI: num(childrenHostelAI),
      transport: num(transport),
      medical: num(medical),
      special: num(special),
      uniform: num(uniform),
      carFacilityLimit: num(carFacilityLimit),
      others: num(others),

      gratuity: num(gratuity),
      monthlySalary: num(monthlySalary),
      basicPercent: num(basicPercent),

      employerBenefitType: employerBenefitType,
      employerBenefitAmount: employerBenefitAmount,
      employerBenefitTitle: employerBenefitTitle,

      professionalTax: num(professionalTax),
      tds: num(tds),
      tdsPercent: num(tdsPercent),

      reimbursements: {
        sodexo: num(sodexo),
        vehicleAllow: num(vehicleAllow),
        vehicleDS: num(vehicleDS),
        vehicleMaint: num(vehicleMaint),
        telephone: num(telephone),
        books: num(books),
        helper: num(helper),
        health: num(health),
      },

      // PF values (actual numbers)
      pfEmployee: pfEmployee,
      pfEmployer: pfEmployer,

      salaryType: salaryType,

      // totals
      grossMonthly,
      grossAnnual,
      ctcMonthly,
      ctcAnnual,
      takeHomeMonthly: takeHomeMonthly,
      takeHomeAnnual,
      reimbursementsMonthly,
      reimbursementsAnnual,
      totalCTOMonthly,
      totalCTOAnnual,
      gratuityEnabled: gratuityEnabled,
    };

    try {
      const myId = localStorage.getItem("onBoardingId");
      const obj1 = { _id: myId };
      const payload = { ...obj1, ...dataToSave, employee_type: employeeData.employee_type };
      // Save data to the API before proceeding to the next step
      const response = await addEmployeeSalaryInfo(payload);
      if (response.status) {
        toast.success(response.message);
        navigate("/people-profile ");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  const fetchCandidateSalaryRecordsFromApproval = async (candidate_id, approval_note_id) => {
    try {

      let payloads = {
        approval_note_doc_id: approval_note_id,
        scope_fields: []
      }
      const response = await axios.post(
        `${config.API_URL}getAppraisalNoteById`,
        payloads,
        apiHeaderToken(config.API_TOKEN)
      );
      if (response.status) {
        let candidateDetails = response.data?.data?.candidate_list?.find((item) => item?.cand_doc_id?.toString() === candidate_id?.toString());
        // setInitialValues(JSON.parse(candidateDetails?.salary_structure_data))
        setCandidateDetails(candidateDetails)
      }
    } catch (error) {
      // console.log(error.message, 'this is error');
      setInitialValues(null)
      return null
    }
  }

  useEffect(() => {

    if (candidateData?.salary_structure_data) {
      setInitialValues(JSON.parse(candidateData?.salary_structure_data))
    }

  }, [candidateData])

  useEffect(() => {
    if (searchParams.get('approval_note_id') && searchParams.get('candidate_id')) {
      fetchCandidateSalaryRecordsFromApproval(searchParams.get('candidate_id'), searchParams.get('approval_note_id'))
    }
  }, [searchParams])

  // ---------- tiny UI helpers ----------

  const Money = ({ value, variant = "secondary" }) => (
    <Chip label={currency(value)} color={
      variant === "primary" ? "primary" :
        variant === "success" ? "success" :
          variant === "warning" ? "warning" :
            variant === "danger" ? "error" :
              "default"
    } variant="filled" sx={{ fontSize: 16, fontWeight: 600 }} />
  );

  // Handler for manual basic changes - calculate percentage
  const handleBasicChange = (value) => {
    const sanitizedValue = sanitizeNumeric(value, false);
    isManualBasicEditRef.current = true; // Mark as manual edit
    setBasic(sanitizedValue);

    // Calculate and update basic percentage if monthlySalary exists
    const ms = num(monthlySalary);
    const basicVal = num(sanitizedValue);
    if (ms > 0 && basicVal > 0) {
      const calculatedPercent = Math.round((basicVal / ms) * 100 * 100) / 100; // Round to 2 decimal places
      setBasicPercent(String(calculatedPercent));
    } else if (basicVal === 0 || sanitizedValue === '') {
      setBasicPercent('');
    }
  };



  /**
   * this feature might be deprecated after salary range feature
   */
  // On Role base
  const [deductionData, setDeductionData] = useState({});
  const [earningData, setEarningData] = useState({});
  const [onContractData, setOnContractData] = useState({
    no_of_working_days: 0,
    consultation_fee: 0,
    mandate_deduction: 0,
    tds: 0,
    aadharPanLinked: 'No',
  });
  // Initial state for form data
  const [onEmpaneledData, setOnEmpaneledData] = useState({
    no_of_working_days: 0,
    budget_per_day: 0,
  });
  const [formData, setFormData] = useState({
    "basic_salary": 0,
    "total": 0,
    "salary_total": 0,
    "salary_da": 0,
    "salary_hra": 0,
    "transport_allowances": 0,
    "medical_allowances": 0,
    "children_allowances": 0,
    "special_allowances": 0,
    "project_allowances": 0,
    "charge_allowances": 0,
    "substn_allowances": 0,
    "telephone_allowances": 0,
    "pda": 0,
    "other_allowances": 0,
    "perfm_allowances": 0,
    "medical_reimbursement": 0,
    "other_reimbursement": 0,
    "employee_pf": 0,
    "pf_amount": 0,
    "salary_adv": 0,
    "fest_all": 0,
    "other": 0,
    "salary_effective_date": 0,
    "employee_pf_deduction": 0,
    "tds": 0,
    "ESIC_deduction": 0
  });

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const myId = localStorage.getItem("onBoardingId");
        if (!myId) {
          console.error("No onboarding ID found in localStorage");
          return;
        }

        const obj1 = { _id: myId };
        const response = await getEmployeeById(obj1);

        if (response && response.data && response.status) {
          // Destructure data and set default values
          const { deduction_data = {}, earning_data = {} } = response.data;

          setInitialValues(response.data?.salary_data)

          setEmployeeData(response.data); // Extract the data object
          setDeductionData(deduction_data); // Default to empty object if undefined
          setEarningData(earning_data); // Default to empty object if undefined
        } else {
          // Set empty states if response is invalid
          setEmployeeData({});
          setDeductionData({});
          setEarningData({});
        }
      } catch (error) {
        console.error("Error fetching designation data", error);
        setEmployeeData({});
        setDeductionData({});
        setEarningData({});
      }
    };

    fetchDesignations();
  }, []);
  //  console.log(deductionData)
  //  console.log(earningData)
  useEffect(() => {

    const formatDateToYYYYMMDD = (dateStr) => {
      if (!dateStr) return '';

      // Parse the date string
      const date = new Date(dateStr);

      // Check if the date is valid
      if (isNaN(date.getTime())) return '';

      // Format the date to YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    };
    // Update onRoll when deductionData or earningData changes
    setFormData((prevData) => ({
      ...prevData,
      "basic_salary": employeeData.basic_salary || 0,
      "total": employeeData.total || 0,
      "salary_total": employeeData.salary_total || 0,
      "salary_da": employeeData.salary_da || 0,
      "salary_hra": employeeData.salary_hra || 0,
      "salary_effective_date": formatDateToYYYYMMDD(employeeData.salary_effective_date) || 0,
      "transport_allowances": earningData.transport_allowances || 0,
      "medical_allowances": earningData.medical_allowances || 0,
      "children_allowances": earningData.children_allowances || 0,
      "special_allowances": earningData.special_allowances || 0,
      "project_allowances": earningData.project_allowances || 0,
      "charge_allowances": earningData.charge_allowances || 0,
      "substn_allowances": earningData.substn_allowances || 0,
      "telephone_allowances": earningData.telephone_allowances || 0,
      "pda": earningData.pda || 0,
      "other_allowances": earningData.other_allowances || 0,
      "perfm_allowances": earningData.perfm_allowances || 0,
      "medical_reimbursement": earningData.medical_reimbursement || 0,
      "other_reimbursement": earningData.other_reimbursement || 0,
      "employee_pf": earningData.employee_pf || 0,
      "pf_amount": deductionData.pf_amount || 0,
      "salary_adv": deductionData.salary_adv || 0,
      "fest_all": deductionData.fest_all || 0,
      "other": deductionData.other || 0,
      "total": deductionData.total || 0,
    }));
  }, [deductionData, earningData]);

  useEffect(() => {
    // Update emPanelled when earningData changes
    setOnEmpaneledData((prevData) => ({
      ...prevData,
      no_of_working_days: earningData.no_of_working_days || 0,
      budget_per_day: earningData.budget_per_day || 0,

    }));
  }, [earningData]);

  useEffect(() => {
    // Update onContractData when deductionData or earningData changes
    setOnContractData((prevData) => ({
      ...prevData,
      no_of_working_days: earningData.no_of_working_days || 0,
      consultation_fee: earningData.consultation_fee || 0,
      mandate_deduction: deductionData.mandate_deduction || 0,
      tds: deductionData.tds || 0,
      aadharPanLinked: deductionData.aadharPanLinked || 'No',
    }));
  }, [deductionData, earningData]);


  // Handle input changes for text fields
  const handleonContractInputChange = (e) => {
    const { name, value } = e.target;
    setOnContractData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle radio button changes
  const handleRadioChange = (e) => {
    setOnContractData((prevData) => ({
      ...prevData,
      aadharPanLinked: e.target.value,
    }));
  };

  const saveContractData = async () => {
    try {
      const myId = localStorage.getItem("onBoardingId");
      const obj1 = { _id: myId };
      const payload = { ...obj1, ...onContractData, employee_type: employeeData.employee_type };
      // Save data to the API before proceeding to the next step
      const response = await addEmployeeSalaryInfo(payload);
      if (response.status) {
        toast.success(response.message);
        navigate("/people-profile ");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };
  // Contract base


  // Handler for input changes
  const handleonEmpaneledInputChange = (event) => {
    const { name, value } = event.target;
    setOnEmpaneledData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const saveEmpaneledData = async () => {
    try {
      const myId = localStorage.getItem("onBoardingId");
      const obj1 = { _id: myId };
      const payload = { ...obj1, ...onEmpaneledData, employee_type: employeeData.employee_type };
      // Save data to the API before proceeding to the next step
      const response = await addEmployeeSalaryInfo(payload);
      if (response.status) {
        toast.success(response.message);
        navigate("/people-profile ");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };
  // Empaneled base Employee

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("first");
  const calculateTotal = (formData) => {
    const pf_amount = parseFloat(formData.pf_amount) || 0;
    const salary_adv = parseFloat(formData.salary_adv) || 0;
    const fest_all = parseFloat(formData.fest_all) || 0;
    const other = parseFloat(formData.other) || 0;
    const tds = parseFloat(formData.tds) || 0;
    const employee_pf_deduction = parseFloat(formData.employee_pf_deduction) || 0;

    return pf_amount + salary_adv + fest_all + other + tds + employee_pf_deduction;
  };

  const calculateTotalSalary = (data) => {
    // Convert all values to numbers and sum them up
    const total = [
      "basic_salary",
      "salary_hra",
      "transport_allowances",
      "medical_allowances",
      "children_allowances",
      "special_allowances",
      "project_allowances",
      "charge_allowances",
      "salary_da",
      "substn_allowances",
      "telephone_allowances",
      "pda",
      "other_allowances",
      "perfm_allowances",
      "medical_reimbursement",
      "other_reimbursement",
      "employee_pf",
    ].reduce((acc, key) => acc + (parseFloat(data[key]) || 0), 0);

    // Update the total salary in the formData state
    setFormData((prevData) => ({
      ...prevData,
      salary_total: total.toFixed(2), // Format to 2 decimal places
    }));
  };
  const changeTab = () => {
    setActiveTab("second");
  };
  // On Role base
  useEffect(() => {
    // Save formData to localStorage whenever it changes
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [FormData]);
  const resetForm = () => {
    // Clear formData and localStorage
    setFormData({});
    localStorage.removeItem("formData");
    // Optionally, show a success message
    toast.success("Form has been reset.");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    // Calculate total and update form data
    updatedFormData.total = calculateTotal(updatedFormData);

    setFormData(updatedFormData);
    // Recalculate total salary
    calculateTotalSalary({
      ...formData,
      [name]: value,
    });
  };

  const saveData = async () => {
    try {
      const myId = localStorage.getItem("onBoardingId");
      const obj1 = { _id: myId };
      const payload = { ...obj1, ...formData, employee_type: employeeData.employee_type };
      // Save data to the API before proceeding to the next step
      const response = await addEmployeeSalaryInfo(payload);
      if (response.status) {
        toast.success(response.message);
        navigate("/people-profile ");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };
  // On Role base

  return (
    <>
      {/* <AllHeaders /> */}
      <div className="maincontent">
        <div
          className="container"
          data-aos="fade-in"
          data-aos-duration="3000"
        >
          <GoBackButton />
          <div className="d-flex justify-content-between read-btn reload-btn">
            <h2>Define Salary Structure</h2>
          </div>
          <div className="mt-3">

            <DialogContent dividers sx={{ maxHeight: '80vh' }}>

              {/* Simplified View for Empanelled/OnContract */}
              {isEmpanelledOrConsultant ? (
                <Section title="Salary Details (Empanelled/OnContract)">
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Monthly Salary / Per Visit"
                        value={monthlySalary == null ? '' : String(monthlySalary)}
                        onChange={(e) => setMonthlySalary(sanitizeNumeric(e.target.value, false))}
                        onBlur={() => setMonthlySalary(sanitizeNumeric(monthlySalary, false))}
                        InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                        autoComplete="off"
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        size="small"
                        fullWidth
                        label="TDS (%)"
                        value={tdsPercent == null ? '' : String(tdsPercent)}
                        onChange={(e) => setTdsPercent(sanitizeNumeric(e.target.value, false))}
                        onBlur={() => setTdsPercent(sanitizeNumeric(tdsPercent, false))}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>
                        }}
                        autoComplete="off"
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Take Home (Monthly Salary / Per Visit - TDS)"
                        value={takeHomeMonthly == null ? '' : String(takeHomeMonthly)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                          readOnly: true
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Summary:</strong>
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography color="text.secondary">Monthly Salary / Per Visit</Typography>
                      <Money value={num(monthlySalary)} variant="primary" />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography color="text.secondary">TDS ({tdsPercent}%)</Typography>
                      <Money value={num(tds)} variant="error" />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 'bold' }}>
                      <Typography color="text.secondary" fontWeight="bold">Take Home</Typography>
                      <Money value={takeHomeMonthly} variant="success" />
                    </Box>
                  </Box>
                </Section>
              ) : (
                <>
                  {/* Regular Employee View */}
                  {/* Benefit Type Selection */}
                  <Section title="">
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormControl component="fieldset" fullWidth>
                          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                            <RadioGroup
                              row
                              aria-label="salaryType"
                              name="salaryType"
                              value={salaryType}
                              onChange={(e) => setSalaryType(e.target.value)}
                              sx={{ gap: 2 }}
                            >
                              <FormControlLabel
                                value="mediclaim"
                                control={<Radio size="small" color="primary" />}
                                label={
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Typography variant="body2" fontWeight="medium">Mediclaim</Typography>
                                  </Box>
                                }
                                sx={{
                                  // border: 1, 
                                  borderColor: salaryType === 'mediclaim' ? 'primary.main' : 'divider',
                                  // borderRadius: 1,
                                  px: 2,
                                  py: 1,
                                  m: 0,
                                  bgcolor: salaryType === 'mediclaim' ? 'primary.50' : 'transparent',
                                  '&:hover': {
                                    bgcolor: salaryType === 'mediclaim' ? 'primary.100' : 'grey.50'
                                  }
                                }}
                              />
                              <FormControlLabel
                                value="esic"
                                control={<Radio size="small" color="primary" />}
                                label={
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Typography variant="body2" fontWeight="medium">ESIC</Typography>
                                  </Box>
                                }
                                sx={{
                                  // border: 1, 
                                  borderColor: salaryType === 'esic' ? 'primary.main' : 'divider',
                                  // borderRadius: 1,
                                  px: 2,
                                  py: 1,
                                  m: 0,
                                  bgcolor: salaryType === 'esic' ? 'primary.50' : 'transparent',
                                  '&:hover': {
                                    bgcolor: salaryType === 'esic' ? 'primary.100' : 'grey.50'
                                  }
                                }}
                              />
                            </RadioGroup>
                          </Box>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Section>


                  {/* Earnings */}
                  <Section title="Earnings (Monthly)">
                    <Grid container spacing={2}>

                      <Grid item xs={12} md={4}>
                        <TextField size="small" fullWidth label="Salary (Monthly)"
                          value={monthlySalary == null ? '' : String(monthlySalary)}
                          onChange={(e) => setMonthlySalary(sanitizeNumeric(e.target.value, false))}
                          onBlur={() => setMonthlySalary(sanitizeNumeric(monthlySalary, false))}
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                          autoComplete="off" />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField size="small" fullWidth label="Basic %"
                          value={basicPercent == null ? '' : String(basicPercent)}
                          onChange={(e) => setBasicPercent(sanitizeNumeric(e.target.value, false))}
                          InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                          autoComplete="off" />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField size="small" fullWidth label="Basic"
                          value={basic == null ? '' : String(basic)}
                          onChange={(e) => handleBasicChange(e.target.value)}
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                        // inputProps={{ readOnly: true }}
                        />
                      </Grid>


                      <Grid container item spacing={2} sx={{ pl: 1, pr: 1 }}>
                        <Grid item xs={12} md={4}>
                          {/* Empty space - you can add content here if needed */}
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <TextField size="small" fullWidth label="HRA %"
                            value={hraPercent == null ? '' : String(hraPercent)}
                            onChange={(e) => setHraPercent(sanitizeNumeric(e.target.value, false))}
                            InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                            autoComplete="off" />
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <TextField size="small" fullWidth label="HRA Amount"
                            value={hraAmount == null ? '' : String(hraAmount)}
                            onChange={(e) => setHraAmount(sanitizeNumeric(e.target.value, false))}
                            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                            autoComplete="off" />
                        </Grid>
                      </Grid>


                      <Grid item xs={12} md={4}>
                        <TextField size="small" fullWidth label="Children Hostel AI" value={childrenHostelAI == null ? '' : String(childrenHostelAI)}
                          onChange={(e) => setChildrenHostelAI(sanitizeNumeric(e.target.value, false))}
                          onBlur={() => setChildrenHostelAI(sanitizeNumeric(childrenHostelAI, false))}
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                          autoComplete="off" />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField size="small" fullWidth label="Transport" value={transport == null ? '' : String(transport)}
                          onChange={(e) => setTransport(sanitizeNumeric(e.target.value, false))}
                          onBlur={() => setTransport(sanitizeNumeric(transport, false))}
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                          autoComplete="off" />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField size="small" fullWidth label="Medical" value={medical == null ? '' : String(medical)}
                          onChange={(e) => setMedical(sanitizeNumeric(e.target.value, false))}
                          onBlur={() => setMedical(sanitizeNumeric(medical, false))}
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                          autoComplete="off" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField size="small" fullWidth label="Special (Remaning)" value={special == null ? '' : String(special)}
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                          inputProps={{ readOnly: true }}
                          autoComplete="off" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField size="small" fullWidth label="Uniform" value={uniform == null ? '' : String(uniform)}
                          onChange={(e) => setUniform(sanitizeNumeric(e.target.value, false))}
                          onBlur={() => setUniform(sanitizeNumeric(uniform, false))}
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                          autoComplete="off" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField size="small" fullWidth label="Car Facility Limit" value={carFacilityLimit == null ? '' : String(carFacilityLimit)}
                          onChange={(e) => setCarFacilityLimit(sanitizeNumeric(e.target.value, false))}
                          onBlur={() => setCarFacilityLimit(sanitizeNumeric(carFacilityLimit, false))}
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                          autoComplete="off" />
                      </Grid>
                    </Grid>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                      <Typography color="text.secondary">Gross (Monthly)</Typography>
                      <Money value={grossMonthly} variant="warning" />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                      <Typography color="text.secondary">Gross (Annual)</Typography>
                      <Money value={grossAnnual} variant="warning" />
                    </Box>
                  </Section>

                  {/* Employer Contributions: simplified to Gratuity control */}
                  <Section title="Employer Contributions (Added In CTC)">
                    <Grid container spacing={2} alignItems="center" mb={2}>

                      <Grid container item spacing={2} justifyContent={"flex-start"} sx={{ pl: 1, pr: 1 }}>

                        <Grid item xs={12} md={8}>
                          <FormControl component="fieldset">
                            <RadioGroup row aria-label="gratuity" name="gratuity" value={gratuityEnabled ? 'gratuity' : 'non-gratuity'} onChange={(e) => {
                              const isGratuity = e.target.value === 'gratuity';
                              setGratuityEnabled(isGratuity);
                              if (!isGratuity) setGratuity('');
                            }}>
                              <FormControlLabel value="non-gratuity" control={<Radio size="small" />} label="Non Gratuity" />
                              <FormControlLabel value="gratuity" control={<Radio size="small" />} label="Gratuity" />
                            </RadioGroup>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          {gratuityEnabled && (
                            <TextField size="small" label={`Gratuity (Employer) - 4.81% of ${salaryType === 'mediclaim' ? 'Gross' : 'Basic'}`}
                              value={gratuity == null ? '' : String(gratuity)}
                              onChange={(e) => setGratuity(sanitizeNumeric(e.target.value, false))}
                              onBlur={() => setGratuity(sanitizeNumeric(gratuity, false))}
                              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                            />
                          )}
                        </Grid>
                      </Grid>

                      <Grid container item spacing={2} justifyContent={"flex-start"} sx={{ pl: 1, pr: 1, pt: 1 }}>
                        <Grid item xs={12} md={8}>
                          <FormControl component="fieldset">
                            {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Employer Benefit</Typography> */}
                            <RadioGroup row aria-label="employerBenefit" name="employerBenefit" value={employerBenefitType} onChange={(e) => {
                              const v = e.target.value;
                              setEmployerBenefitType(v);
                              // clear manual amount when switching options to avoid stale values
                              setEmployerBenefitManual('');
                              if (v !== 'others') setEmployerBenefitTitle('');
                            }}>
                              {/* Show ESIC only if salary type is not mediclaim */}
                              {salaryType !== 'mediclaim' && (
                                <FormControlLabel value="esic" control={<Radio size="small" />} label="ESIC" />
                              )}
                              {/* Show Mediclaim only if salary type is not esic */}
                              {salaryType !== 'esic' && (
                                <FormControlLabel value="mediclaim" control={<Radio size="small" />} label="Mediclaim" />
                              )}
                              <FormControlLabel value="workmen" control={<Radio size="small" />} label="Workmen Compensation" />
                              <FormControlLabel value="others" control={<Radio size="small" />} label="Others" />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          {employerBenefitType === 'esic' ? (
                            <TextField size="small" fullWidth label="ESIC (Computed)"
                              value={String(employerBenefitAmount)}
                              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                              inputProps={{ readOnly: true }}
                            />
                          ) : (
                            <>
                              <TextField size="small" fullWidth label="Employer Benefit Amount"
                                value={employerBenefitManual == null ? '' : String(employerBenefitManual)}
                                onChange={(e) => setEmployerBenefitManual(sanitizeNumeric(e.target.value, false))}
                                onBlur={() => setEmployerBenefitManual(sanitizeNumeric(employerBenefitManual, false))}
                                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                              />
                            </>
                          )}
                        </Grid>
                      </Grid>
                      {
                        employerBenefitType === 'others' && (
                          <Grid container item spacing={2} justifyContent={"flex-start"} sx={{ pl: 1, pr: 1, pt: 1 }}>
                            <Grid item xs={12} md={8}>
                              <TextField size="small" fullWidth label="Please add other Level or Title"
                                value={employerBenefitTitle == null ? '' : String(employerBenefitTitle)}
                                onChange={(e) => setEmployerBenefitTitle(e.target.value)}
                                autoComplete="off"
                              />
                            </Grid>
                          </Grid>
                        )
                      }
                      <Grid container item spacing={2} justifyContent={"space-between"} sx={{ pl: 1, pr: 1 }}>
                        <Grid item xs={12} md={12}>
                          <Box>
                            <Typography fontSize={'16px'} fontWeight={550} variant="body2" color="text.secondary">(PF At Basic)</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField size="small" fullWidth label="Employer Contribution 12% PF"
                            value={pfEmployer == null ? '' : String(pfEmployer)}
                            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField size="small" fullWidth label="Employee Contribution 12% PF"
                            value={pfEmployee == null ? '' : String(pfEmployee)}
                            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField size="small" fullWidth label="Employee PF"
                            value={pfEmployee == null ? '' : String(pfEmployee + pfEmployer)}
                            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>
                      </Grid>

                      {
                        salaryType !== 'mediclaim' && (
                          <Grid container item spacing={2} justifyContent={"space-between"} sx={{ pl: 1, pr: 1 }}>
                            <Grid item xs={12} md={4}>
                              <TextField size="small" fullWidth label="ESI (Employees) Contribution At 0.7%"
                                value={esiMonthly == null ? '' : String(esiMonthly)}
                                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                inputProps={{ readOnly: true }}
                              />
                            </Grid>
                          </Grid>
                        )
                      }

                    </Grid>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography color="text.secondary">Take Home (Monthly)</Typography>
                      <Money value={salaryType !== 'mediclaim' ? grossMonthly - pfEmployee - esiMonthly : grossMonthly - pfEmployee} variant="success" />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                      <Typography color="text.secondary">CTC (Monthly)</Typography>
                      <Money value={ctcMonthly} variant="success" />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                      <Typography color="text.secondary">CTC (Annual)</Typography>
                      <Money value={ctcAnnual} variant="success" />
                    </Box>
                  </Section>

                  {/* Reimbursements */}
                  <Section title="Reimbursements (add to Total CTO)">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <TextField size="small" fullWidth label="Sodexo Vouchers" value={sodexo == null ? '' : String(sodexo)}
                          onChange={(e) => setSodexo(sanitizeNumeric(e.target.value, false))}
                          onBlur={() => setSodexo(sanitizeNumeric(sodexo, false))}
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                          autoComplete="off" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField size="small" fullWidth label="Vehicle Allowance" value={vehicleAllow == null ? '' : String(vehicleAllow)}
                          onChange={(e) => setVehicleAllow(sanitizeNumeric(e.target.value, false))}
                          onBlur={() => setVehicleAllow(sanitizeNumeric(vehicleAllow, false))}
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                          autoComplete="off" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField size="small" fullWidth label="Vehicle DS" value={vehicleDS == null ? '' : String(vehicleDS)}
                          onChange={(e) => setVehicleDS(sanitizeNumeric(e.target.value, false))}
                          onBlur={() => setVehicleDS(sanitizeNumeric(vehicleDS, false))}
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                          autoComplete="off" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField size="small" fullWidth label="Vehicle Maintenance" value={vehicleMaint == null ? '' : String(vehicleMaint)}
                          onChange={(e) => setVehicleMaint(sanitizeNumeric(e.target.value, false))}
                          onBlur={() => setVehicleMaint(sanitizeNumeric(vehicleMaint, false))}
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                          autoComplete="off" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField size="small" fullWidth label="Telephone Expense" value={telephone == null ? '' : String(telephone)}
                          onChange={(e) => setTelephone(sanitizeNumeric(e.target.value, false))}
                          onBlur={() => setTelephone(sanitizeNumeric(telephone, false))}
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                          autoComplete="off" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField size="small" fullWidth label="Books" value={books == null ? '' : String(books)}
                          onChange={(e) => setBooks(sanitizeNumeric(e.target.value, false))}
                          onBlur={() => setBooks(sanitizeNumeric(books, false))}
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                          autoComplete="off" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField size="small" fullWidth label="Helper" value={helper == null ? '' : String(helper)}
                          onChange={(e) => setHelper(sanitizeNumeric(e.target.value, false))}
                          onBlur={() => setHelper(sanitizeNumeric(helper, false))}
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                          autoComplete="off" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField size="small" fullWidth label="Health & Wellness" value={health == null ? '' : String(health)}
                          onChange={(e) => setHealth(sanitizeNumeric(e.target.value, false))}
                          onBlur={() => setHealth(sanitizeNumeric(health, false))}
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                          autoComplete="off" />
                      </Grid>
                    </Grid>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography color="text.secondary">Reimbursements (Monthly)</Typography>
                      <Money value={reimbursementsMonthly} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                      <Typography color="text.secondary">Reimbursements (Annual)</Typography>
                      <Money value={reimbursementsAnnual} />
                    </Box>
                  </Section>

                  {/* Totals */}
                  <Section title="Totals" accent="background.paper">
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography fontWeight={600}>Total CTO (Monthly)</Typography>
                      <Money value={totalCTOMonthly} variant="primary" />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                      <Typography fontWeight={600}>Total CTO (Annual)</Typography>
                      <Money value={totalCTOAnnual} variant="primary" />
                    </Box>
                  </Section>
                </>
              )}
            </DialogContent>




            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mb: 5 }}>
              <Button variant="contained" onClick={HandleSaveSalaryFromEmployee}>Save</Button>
            </Box>

          </div>
        </div>
      </div>
    </>
  );
}
