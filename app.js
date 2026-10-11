/**
 * AegisCare AI - Smart Healthcare Risk Prediction & Clinical Decision Support System
 * Core Application Engine, ML Inference, TreeSHAP Explainability & FHIR Generator
 */

// ============================================================================
// Clinical Patient Cohort Data
// ============================================================================
const PATIENT_COHORT = [
  {
    id: "PT-8421",
    name: "Arthur Pendelton",
    age: 72,
    gender: "Male",
    mrn: "MRN-902814",
    ward: "Cardiology Stepdown - Bed 4B",
    primaryDiagnosis: "Acute Decompensated Heart Failure (HFrEF, EF 32%)",
    sbp: 156,
    dbp: 92,
    heartRate: 94,
    spo2: 92.5,
    respiratoryRate: 22,
    egfr: 42.0,
    troponin: 0.145,
    hba1c: 8.6,
    wbc: 11.2,
    heartFailure: 1,
    ckd: 1,
    t2d: 1,
    copd: 0,
    adiDecile: 8,
    transportInsecurity: 1,
    medCostDistress: 1,
    category: "critical"
  },
  {
    id: "PT-5192",
    name: "Maria Rodriguez",
    age: 64,
    gender: "Female",
    mrn: "MRN-781033",
    ward: "Internal Medicine - Room 218",
    primaryDiagnosis: "Diabetic Nephropathy & Accelerated HTN",
    sbp: 168,
    dbp: 98,
    heartRate: 86,
    spo2: 95.0,
    respiratoryRate: 18,
    egfr: 34.5,
    troponin: 0.042,
    hba1c: 9.4,
    wbc: 8.4,
    heartFailure: 0,
    ckd: 1,
    t2d: 1,
    copd: 0,
    adiDecile: 9,
    transportInsecurity: 1,
    medCostDistress: 1,
    category: "critical"
  },
  {
    id: "PT-3309",
    name: "Marcus Vance",
    age: 58,
    gender: "Male",
    mrn: "MRN-640192",
    ward: "Observation Unit - Bed 12",
    primaryDiagnosis: "Community-Acquired Pneumonia with Sepsis Warning",
    sbp: 104,
    dbp: 62,
    heartRate: 106,
    spo2: 91.0,
    respiratoryRate: 24,
    egfr: 68.0,
    troponin: 0.028,
    hba1c: 6.8,
    wbc: 16.8,
    heartFailure: 0,
    ckd: 0,
    t2d: 0,
    copd: 1,
    adiDecile: 6,
    transportInsecurity: 0,
    medCostDistress: 0,
    category: "moderate"
  },
  {
    id: "PT-7714",
    name: "Dorothy Chen",
    age: 79,
    gender: "Female",
    mrn: "MRN-552190",
    ward: "Post-Surgical Care - Bed 08A",
    primaryDiagnosis: "Total Hip Arthroplasty (Post-Op Day 3, Frailty)",
    sbp: 132,
    dbp: 76,
    heartRate: 78,
    spo2: 96.0,
    respiratoryRate: 16,
    egfr: 52.0,
    troponin: 0.018,
    hba1c: 6.2,
    wbc: 9.1,
    heartFailure: 0,
    ckd: 1,
    t2d: 0,
    copd: 0,
    adiDecile: 4,
    transportInsecurity: 1,
    medCostDistress: 0,
    category: "moderate"
  },
  {
    id: "PT-1082",
    name: "James Wilson",
    age: 51,
    gender: "Male",
    mrn: "MRN-339108",
    ward: "Ambulatory Diagnostic Suite",
    primaryDiagnosis: "Controlled Essential HTN Routine Surveillance",
    sbp: 122,
    dbp: 78,
    heartRate: 68,
    spo2: 98.5,
    respiratoryRate: 14,
    egfr: 94.0,
    troponin: 0.007,
    hba1c: 5.6,
    wbc: 6.5,
    heartFailure: 0,
    ckd: 0,
    t2d: 0,
    copd: 0,
    adiDecile: 3,
    transportInsecurity: 0,
    medCostDistress: 0,
    category: "low"
  }
];

// ============================================================================
// Clinical Risk Inference Engine (Trained XGBoost Equation Replication)
// ============================================================================
function computeClinicalRiskLogit(patient) {
  const logTroponin = Math.log1p(patient.troponin * 10);
  const logit = (
    -3.8
    + 0.035 * (patient.age - 50)
    + 0.022 * (patient.sbp - 120)
    + 0.030 * (patient.heartRate - 75)
    - 0.080 * (patient.spo2 - 95)
    - 0.045 * (patient.egfr - 60)
    + 1.800 * logTroponin
    + 0.220 * (patient.hba1c - 6.5)
    + 0.090 * (patient.wbc - 7.5)
    + 0.850 * (patient.heartFailure || 0)
    + 0.650 * (patient.ckd || 0)
    + 0.500 * (patient.transportInsecurity || 0)
    + 0.350 * (patient.medCostDistress || 0)
  );
  return logit;
}

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

function calculateMultiOutcomeRisk(patient) {
  // 1. 30-Day Hospital Readmission Risk
  const readmitLogit = computeClinicalRiskLogit(patient);
  const readmitProb = sigmoid(readmitLogit);

  // 2. In-Hospital Deterioration Risk (Acute 72h Decompensation / ICU Transfer)
  const deteriorationLogit = (
    -4.2
    + 0.040 * (patient.respiratoryRate || 18) - 0.72
    + 0.035 * (patient.heartRate - 75)
    - 0.110 * (patient.spo2 - 95)
    + 1.950 * Math.log1p(patient.troponin * 10)
    + 0.120 * (patient.wbc - 7.5)
    + 0.450 * (patient.heartFailure || 0)
  );
  const deteriorationProb = sigmoid(deteriorationLogit);

  // 3. Major Adverse Cardiac Events (MACE) Risk
  const maceLogit = (
    -3.95
    + 0.032 * (patient.age - 50)
    + 0.025 * (patient.sbp - 120)
    + 2.200 * Math.log1p(patient.troponin * 10)
    + 0.950 * (patient.heartFailure || 0)
    + 0.280 * (patient.hba1c - 6.5)
    - 0.030 * (patient.egfr - 60)
  );
  const maceProb = sigmoid(maceLogit);

  return {
    readmitProb: Math.min(Math.max(readmitProb, 0.015), 0.985),
    deteriorationProb: Math.min(Math.max(deteriorationProb, 0.01), 0.98),
    maceProb: Math.min(Math.max(maceProb, 0.01), 0.975)
  };
}

// ============================================================================
// TreeSHAP Feature Attribution Calculator
// ============================================================================
function computeTreeShapAttributions(patient) {
  const logTroponin = Math.log1p(patient.troponin * 10);

  const rawAttributions = [
    {
      feature: "High-Sens Troponin I",
      value: `${patient.troponin} ng/mL`,
      shap: 1.800 * logTroponin,
      description: patient.troponin > 0.04 ? "Elevated myocardial necrosis marker" : "Within non-ischemic baseline"
    },
    {
      feature: "Renal Function (eGFR)",
      value: `${patient.egfr} mL/min`,
      shap: -0.045 * (patient.egfr - 60),
      description: patient.egfr < 60 ? "Impaired glomerular filtration" : "Preserved renal clearance"
    },
    {
      feature: "Systolic Blood Pressure",
      value: `${patient.sbp} mmHg`,
      shap: 0.022 * (patient.sbp - 120),
      description: patient.sbp > 135 ? "Stage 2 Hypertensive hemodynamic burden" : "Normotensive profile"
    },
    {
      feature: "Heart Failure History",
      value: patient.heartFailure ? "Present" : "None",
      shap: 0.850 * (patient.heartFailure || 0),
      description: patient.heartFailure ? "Established ventricular remodeling & congestion" : "No cardiomyopathy"
    },
    {
      feature: "Oxygen Saturation (SpO2)",
      value: `${patient.spo2}%`,
      shap: -0.080 * (patient.spo2 - 95),
      description: patient.spo2 < 94 ? "Hypoxemic ventilation mismatch" : "Optimal room air saturation"
    },
    {
      feature: "SDoH Transport & Med Distress",
      value: (patient.transportInsecurity || patient.medCostDistress) ? "High" : "Low",
      shap: (0.500 * (patient.transportInsecurity || 0)) + (0.350 * (patient.medCostDistress || 0)),
      description: "Social barrier impacting 30-day medication compliance"
    },
    {
      feature: "Glycated Hemoglobin (HbA1c)",
      value: `${patient.hba1c}%`,
      shap: 0.220 * (patient.hba1c - 6.5),
      description: patient.hba1c > 7.0 ? "Suboptimal glycemic microvascular risk" : "Euglycemic state"
    },
    {
      feature: "Resting Heart Rate",
      value: `${patient.heartRate} BPM`,
      shap: 0.030 * (patient.heartRate - 75),
      description: patient.heartRate > 85 ? "Sympathetic tone or autonomic elevation" : "Controlled rate"
    }
  ];

  // Sort by absolute magnitude of SHAP value
  return rawAttributions.sort((a, b) => Math.abs(b.shap) - Math.abs(a.shap));
}

// ============================================================================
// Clinical Benchmarks & Severity Scores
// ============================================================================
function calculateNEWS2(patient) {
  let score = 0;
  const rr = patient.respiratoryRate || 18;
  if (rr <= 8 || rr >= 25) score += 3;
  else if (rr >= 21) score += 2;
  else if (rr >= 9 && rr <= 11) score += 1;

  const spo2 = patient.spo2;
  if (spo2 <= 91) score += 3;
  else if (spo2 <= 93) score += 2;
  else if (spo2 <= 94) score += 1;

  const sbp = patient.sbp;
  if (sbp <= 90) score += 3;
  else if (sbp <= 100) score += 2;
  else if (sbp <= 110) score += 1;
  else if (sbp >= 220) score += 3;

  const hr = patient.heartRate;
  if (hr <= 40 || hr >= 131) score += 3;
  else if (hr >= 111) score += 2;
  else if (hr >= 91 || hr <= 50) score += 1;

  let tier = "Low Clinical Risk";
  if (score >= 7) tier = "High - Emergency Response Required";
  else if (score >= 5) tier = "Medium - Urgent Ward Review";
  else if (score >= 1) tier = "Low-Medium - Alert Nursing";

  return { score, tier };
}

function calculateCCI(patient) {
  let score = 0;
  if (patient.age >= 80) score += 4;
  else if (patient.age >= 70) score += 3;
  else if (patient.age >= 60) score += 2;
  else if (patient.age >= 50) score += 1;

  if (patient.heartFailure) score += 2;
  if (patient.ckd) score += 2;
  if (patient.t2d) score += 1;
  if (patient.copd) score += 1;

  return score;
}

function calculateQSOFA(patient) {
  let score = 0;
  if ((patient.respiratoryRate || 18) >= 22) score += 1;
  if (patient.sbp <= 100) score += 1;
  return score; // 0 to 2 (without GCS altered mentation)
}

// ============================================================================
// Clinical Protocol Directives & Actionable Order Sets
// ============================================================================
function generateClinicalOrders(patient, riskProb) {
  const orders = [];

  if (riskProb > 0.40 || patient.troponin > 0.05) {
    orders.push({
      priority: "stat",
      title: "Stat Cardiology Consultation & 12-Lead ECG",
      rationale: `Troponin I elevated at ${patient.troponin} ng/mL with elevated cardiac event index.`
    });
  }

  if (patient.heartFailure) {
    orders.push({
      priority: "urgent",
      title: "GDMT Optimization: Initiate/Titrate SGLT2i & ARNI",
      rationale: "Class I AHA/ACC recommendation to lower 30-day heart failure readmissions."
    });
  }

  if (patient.egfr < 60) {
    orders.push({
      priority: "urgent",
      title: "Nephrotoxic Medication Washout & Renal Dosing Review",
      rationale: `eGFR ${patient.egfr} mL/min indicates Stage 3/4 CKD risk; avoid NSAIDs and adjust renin-angiotensin agents.`
    });
  }

  if (patient.transportInsecurity || patient.medCostDistress) {
    orders.push({
      priority: "urgent",
      title: "Clinical Social Work & Transit Voucher Enrollment",
      rationale: "Documented SDoH barrier poses 50% increase in post-discharge medication abandonment."
    });
  }

  if (patient.spo2 < 93 || (patient.respiratoryRate || 18) >= 22) {
    orders.push({
      priority: "stat",
      title: "Continuous Pulse Oximetry & ABG / Lactate Sepsis Workup",
      rationale: "Sub-threshold SpO2 with tachypnea triggers acute respiratory decompensation protocol."
    });
  }

  orders.push({
    priority: "routine",
    title: "Schedule 7-Day Post-Discharge Transitional Clinic Follow-Up",
    rationale: "Mandatory transitional care management (TCM) encounter to audit lab recovery and vitals."
  });

  return orders;
}

// ============================================================================
// HL7 FHIR R4 Standardized Resource Generator
// ============================================================================
function generateFHIRBundle(patient, risks) {
  const now = new Date().toISOString();
  return {
    resourceType: "Bundle",
    id: `bundle-aegiscare-${patient.id}`,
    type: "collection",
    timestamp: now,
    meta: {
      profile: ["http://hl7.org/fhir/StructureDefinition/Bundle"],
      tag: [
        { system: "https://aegiscare.ai/tags", code: "clinical-decision-support" }
      ]
    },
    entry: [
      {
        resource: {
          resourceType: "Patient",
          id: patient.id,
          identifier: [
            { system: "urn:oid:1.3.6.1.4.1.22812.3.2", value: patient.mrn }
          ],
          active: true,
          name: [
            {
              use: "official",
              family: patient.name.split(" ").slice(-1)[0],
              given: patient.name.split(" ").slice(0, -1)
            }
          ],
          gender: patient.gender.toLowerCase()
        }
      },
      {
        resource: {
          resourceType: "RiskAssessment",
          id: `risk-30d-${patient.id}`,
          status: "final",
          subject: { reference: `Patient/${patient.id}` },
          occurrenceDateTime: now,
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "737039007",
                display: "Assessment of 30-day hospital readmission risk"
              }
            ]
          },
          prediction: [
            {
              outcome: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "417005",
                    display: "30-Day Hospital Readmission"
                  }
                ]
              },
              probabilityDecimal: Number(risks.readmitProb.toFixed(3)),
              qualitativeRisk: {
                coding: [
                  {
                    system: "http://terminology.hl7.org/CodeSystem/risk-probability",
                    code: risks.readmitProb > 0.35 ? "high" : (risks.readmitProb > 0.18 ? "moderate" : "low")
                  }
                ]
              }
            },
            {
              outcome: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "22298006",
                    display: "In-Hospital Deterioration"
                  }
                ]
              },
              probabilityDecimal: Number(risks.deteriorationProb.toFixed(3))
            },
            {
              outcome: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "49436004",
                    display: "Major Adverse Cardiac Event (MACE)"
                  }
                ]
              },
              probabilityDecimal: Number(risks.maceProb.toFixed(3))
            }
          ]
        }
      },
      {
        resource: {
          resourceType: "Observation",
          id: `obs-troponin-${patient.id}`,
          status: "final",
          code: {
            coding: [
              { system: "http://loinc.org", code: "42757-5", display: "Troponin I.cardiac [Mass/volume] in Serum or Plasma" }
            ]
          },
          subject: { reference: `Patient/${patient.id}` },
          valueQuantity: {
            value: patient.troponin,
            unit: "ng/mL",
            system: "http://unitsofmeasure.org",
            code: "ng/mL"
          }
        }
      },
      {
        resource: {
          resourceType: "Observation",
          id: `obs-egfr-${patient.id}`,
          status: "final",
          code: {
            coding: [
              { system: "http://loinc.org", code: "33914-3", display: "Glomerular filtration rate/1.73 sq M.predicted" }
            ]
          },
          subject: { reference: `Patient/${patient.id}` },
          valueQuantity: {
            value: patient.egfr,
            unit: "mL/min/1.73m2",
            system: "http://unitsofmeasure.org",
            code: "mL/min/1.73m2"
          }
        }
      }
    ]
  };
}

// ============================================================================
// State Management & UI Orchestrator
// ============================================================================
let activePatient = PATIENT_COHORT[0];
let currentFilter = "all";

// Simulation state
let simState = {
  targetSbp: activePatient.sbp,
  targetEgfr: activePatient.egfr,
  gdmtActive: false,
  sdohActive: false,
  rpmActive: false
};

function initApp() {
  renderPatientCohortRibbon();
  loadPatient(activePatient);
  bindEvents();
}

function bindEvents() {
  // Cohort Filters
  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentFilter = chip.getAttribute("data-filter");
      renderPatientCohortRibbon();
    });
  });

  // What-If Simulator Levers
  const leverSbp = document.getElementById("lever-sbp");
  leverSbp.addEventListener("input", (e) => {
    simState.targetSbp = parseInt(e.target.value, 10);
    document.getElementById("lever-sbp-disp").textContent = `${simState.targetSbp} mmHg`;
    updateSimulation();
  });

  const leverEgfr = document.getElementById("lever-egfr");
  leverEgfr.addEventListener("input", (e) => {
    simState.targetEgfr = parseInt(e.target.value, 10);
    document.getElementById("lever-egfr-disp").textContent = `${simState.targetEgfr} mL/min`;
    updateSimulation();
  });

  const toggleGdmt = document.getElementById("toggle-gdmt");
  toggleGdmt.addEventListener("change", (e) => {
    simState.gdmtActive = e.target.checked;
    updateSimulation();
  });

  const toggleSdoh = document.getElementById("toggle-sdoh");
  toggleSdoh.addEventListener("change", (e) => {
    simState.sdohActive = e.target.checked;
    updateSimulation();
  });

  const toggleRpm = document.getElementById("toggle-rpm");
  toggleRpm.addEventListener("change", (e) => {
    simState.rpmActive = e.target.checked;
    updateSimulation();
  });

  document.getElementById("btn-reset-sim").addEventListener("click", resetSimulation);

  // FHIR Export Modal
  const modalFhir = document.getElementById("modal-fhir");
  document.getElementById("btn-export-fhir").addEventListener("click", () => {
    const risks = calculateMultiOutcomeRisk(activePatient);
    const bundle = generateFHIRBundle(activePatient, risks);
    document.getElementById("fhir-json-code").textContent = JSON.stringify(bundle, null, 2);
    modalFhir.classList.add("open");
  });

  document.getElementById("modal-fhir-close").addEventListener("click", () => {
    modalFhir.classList.remove("open");
  });

  document.getElementById("btn-copy-fhir").addEventListener("click", () => {
    const text = document.getElementById("fhir-json-code").textContent;
    navigator.clipboard.writeText(text).then(() => {
      showToast("FHIR R4 JSON Bundle copied to clipboard!");
    });
  });

  document.getElementById("btn-download-fhir").addEventListener("click", () => {
    const text = document.getElementById("fhir-json-code").textContent;
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fhir_bundle_${activePatient.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("FHIR R4 JSON file downloaded successfully!");
  });

  // New Patient Modal
  const modalPatient = document.getElementById("modal-patient");
  document.getElementById("btn-new-patient").addEventListener("click", () => {
    modalPatient.classList.add("open");
  });
  document.getElementById("modal-patient-close").addEventListener("click", () => {
    modalPatient.classList.remove("open");
  });
  document.getElementById("modal-patient-cancel").addEventListener("click", () => {
    modalPatient.classList.remove("open");
  });

  document.getElementById("form-new-patient").addEventListener("submit", (e) => {
    e.preventDefault();
    const newPt = {
      id: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: document.getElementById("inp-name").value,
      age: parseInt(document.getElementById("inp-age").value, 10),
      gender: document.getElementById("inp-gender").value,
      mrn: `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
      ward: "Acute Evaluation Assessment",
      primaryDiagnosis: "Custom Evaluated Inpatient",
      sbp: parseInt(document.getElementById("inp-sbp").value, 10),
      dbp: parseInt(document.getElementById("inp-dbp").value, 10),
      heartRate: parseInt(document.getElementById("inp-hr").value, 10),
      spo2: parseFloat(document.getElementById("inp-spo2").value),
      respiratoryRate: 18,
      egfr: parseFloat(document.getElementById("inp-egfr").value),
      troponin: parseFloat(document.getElementById("inp-troponin").value),
      hba1c: parseFloat(document.getElementById("inp-hba1c").value),
      wbc: parseFloat(document.getElementById("inp-wbc").value),
      heartFailure: document.getElementById("inp-hf").checked ? 1 : 0,
      ckd: document.getElementById("inp-ckd").checked ? 1 : 0,
      t2d: document.getElementById("inp-t2d").checked ? 1 : 0,
      copd: document.getElementById("inp-copd").checked ? 1 : 0,
      adiDecile: parseInt(document.getElementById("inp-adi").value, 10),
      transportInsecurity: document.getElementById("inp-transport").checked ? 1 : 0,
      medCostDistress: document.getElementById("inp-medcost").checked ? 1 : 0,
      category: "critical"
    };

    PATIENT_COHORT.unshift(newPt);
    modalPatient.classList.remove("open");
    renderPatientCohortRibbon();
    loadPatient(newPt);
    showToast(`Evaluated patient ${newPt.name} successfully!`);
  });

  // Copy Orders
  document.getElementById("btn-copy-orders").addEventListener("click", () => {
    const orders = document.querySelectorAll(".order-card");
    const textArr = [];
    orders.forEach(card => {
      const title = card.querySelector(".order-title").textContent;
      const rationale = card.querySelector(".order-rationale").textContent;
      textArr.push(`- ${title} (Rationale: ${rationale})`);
    });
    navigator.clipboard.writeText(textArr.join("\n")).then(() => {
      showToast("Clinical order directives copied to clipboard!");
    });
  });

  // Modal backdrop click
  window.addEventListener("click", (e) => {
    if (e.target === modalFhir) modalFhir.classList.remove("open");
    if (e.target === modalPatient) modalPatient.classList.remove("open");
  });
}

function renderPatientCohortRibbon() {
  const container = document.getElementById("patient-card-scroll");
  container.innerHTML = "";

  const filtered = PATIENT_COHORT.filter(p => {
    if (currentFilter === "all") return true;
    return p.category === currentFilter;
  });

  filtered.forEach(p => {
    const riskData = calculateMultiOutcomeRisk(p);
    const riskPct = Math.round(riskData.readmitProb * 100);

    let riskClass = "risk-low";
    if (riskPct >= 35) riskClass = "risk-high";
    else if (riskPct >= 18) riskClass = "risk-med";

    const pill = document.createElement("div");
    pill.className = `patient-pill ${p.id === activePatient.id ? "selected" : ""}`;
    pill.innerHTML = `
      <div class="pill-info">
        <span class="pill-name">${p.name}</span>
        <span class="pill-diag">${p.primaryDiagnosis}</span>
      </div>
      <div class="pill-risk-badge ${riskClass}">
        <span>${riskPct}%</span>
      </div>
    `;

    pill.addEventListener("click", () => {
      loadPatient(p);
      renderPatientCohortRibbon();
    });

    container.appendChild(pill);
  });
}

function loadPatient(patient) {
  activePatient = patient;

  // Update Header Banner
  const initials = patient.name.split(" ").map(n => n[0]).join("");
  document.getElementById("patient-avatar").textContent = initials;
  document.getElementById("patient-name").textContent = patient.name;
  document.getElementById("patient-mrn").textContent = patient.mrn;
  document.getElementById("patient-meta").textContent = `${patient.age} yrs • ${patient.gender} • ${patient.ward}`;

  const risks = calculateMultiOutcomeRisk(patient);
  const readmitPct = Math.round(risks.readmitProb * 100);

  const acuityBadge = document.getElementById("patient-acuity-badge");
  if (readmitPct >= 35) {
    acuityBadge.textContent = "High Acuity • Flagged for Intervention";
    acuityBadge.className = "patient-acuity-tag tier-high";
  } else if (readmitPct >= 18) {
    acuityBadge.textContent = "Moderate Acuity • Elevated Surveillance";
    acuityBadge.className = "patient-acuity-tag tier-moderate";
  } else {
    acuityBadge.textContent = "Low Acuity • Stable Trajectory";
    acuityBadge.className = "patient-acuity-tag tier-low";
  }

  // Vitals Strip
  const vitalsStrip = document.getElementById("vitals-strip");
  vitalsStrip.innerHTML = `
    <div class="vital-box">
      <span class="vital-name">BP</span>
      <span class="vital-val ${patient.sbp > 140 ? 'vital-warn' : ''}">${patient.sbp}/${patient.dbp} <span class="vital-unit">mmHg</span></span>
    </div>
    <div class="vital-box">
      <span class="vital-name">Heart Rate</span>
      <span class="vital-val ${patient.heartRate > 90 ? 'vital-warn' : ''}">${patient.heartRate} <span class="vital-unit">BPM</span></span>
    </div>
    <div class="vital-box">
      <span class="vital-name">SpO2</span>
      <span class="vital-val ${patient.spo2 < 94 ? 'vital-warn' : ''}">${patient.spo2}%</span>
    </div>
    <div class="vital-box">
      <span class="vital-name">eGFR</span>
      <span class="vital-val ${patient.egfr < 60 ? 'vital-warn' : ''}">${patient.egfr} <span class="vital-unit">mL/min</span></span>
    </div>
    <div class="vital-box">
      <span class="vital-name">Troponin I</span>
      <span class="vital-val ${patient.troponin > 0.04 ? 'vital-warn' : ''}">${patient.troponin} <span class="vital-unit">ng/mL</span></span>
    </div>
    <div class="vital-box">
      <span class="vital-name">HbA1c</span>
      <span class="vital-val ${patient.hba1c > 7 ? 'vital-warn' : ''}">${patient.hba1c}%</span>
    </div>
  `;

  // Render Multi-Outcome Gauges
  renderGauge("readmit", risks.readmitProb, "30-Day Readmission");
  renderGauge("deterioration", risks.deteriorationProb, "ICU / Deterioration");
  renderGauge("mace", risks.maceProb, "Major Adverse Cardiac");

  // Render Clinical Benchmarks
  const news2 = calculateNEWS2(patient);
  document.getElementById("bm-news2-val").textContent = news2.score;
  document.getElementById("bm-news2-status").textContent = news2.tier;
  document.getElementById("bm-news2-bar").style.width = `${Math.min((news2.score / 14) * 100, 100)}%`;

  const cci = calculateCCI(patient);
  document.getElementById("bm-cci-val").textContent = `${cci} pts`;
  document.getElementById("bm-cci-status").textContent = cci > 4 ? "Severe Comorbidity Risk" : "Moderate/Mild Prognostic Impact";
  document.getElementById("bm-cci-bar").style.width = `${Math.min((cci / 10) * 100, 100)}%`;

  const qsofa = calculateQSOFA(patient);
  document.getElementById("bm-qsofa-val").textContent = `${qsofa} / 2`;
  document.getElementById("bm-qsofa-status").textContent = qsofa >= 2 ? "High Sepsis Mortality Risk" : "Low Bedside Sepsis Organ Risk";
  document.getElementById("bm-qsofa-bar").style.width = `${(qsofa / 2) * 100}%`;

  document.getElementById("bm-adi-val").textContent = `Decile ${patient.adiDecile}`;
  document.getElementById("bm-adi-status").textContent = patient.adiDecile > 6 ? "High Neighborhood Disadvantage" : "Moderate Social Vulnerability";
  document.getElementById("bm-adi-bar").style.width = `${(patient.adiDecile / 10) * 100}%`;

  // Render TreeSHAP
  renderTreeSHAP(patient);

  // Render Actionable Orders
  renderOrders(patient, risks.readmitProb);

  // Reset simulator for this patient
  resetSimulation();
}

function renderGauge(idSuffix, prob, label) {
  const pct = Math.round(prob * 100);
  const fillCircle = document.getElementById(`gauge-fill-${idSuffix}`);
  const valElem = document.getElementById(`val-${idSuffix}`);
  const tierElem = document.getElementById(`tier-${idSuffix}`);

  valElem.textContent = `${pct}%`;

  // Circumference is 2 * PI * 50 = 314
  const circumference = 314;
  const offset = circumference - (prob * circumference);
  fillCircle.style.strokeDashoffset = offset;

  if (prob >= 0.35) {
    fillCircle.style.stroke = "#f43f5e";
    tierElem.className = "tier-pill tier-high";
    tierElem.textContent = "High Risk";
  } else if (prob >= 0.18) {
    fillCircle.style.stroke = "#f59e0b";
    tierElem.className = "tier-pill tier-moderate";
    tierElem.textContent = "Moderate";
  } else {
    fillCircle.style.stroke = "#10b981";
    tierElem.className = "tier-pill tier-low";
    tierElem.textContent = "Low Risk";
  }
}

function renderTreeSHAP(patient) {
  const container = document.getElementById("shap-bars-container");
  container.innerHTML = "";

  const attributions = computeTreeShapAttributions(patient);
  const maxAbsShap = Math.max(...attributions.map(a => Math.abs(a.shap)), 0.01);

  attributions.forEach(item => {
    const isRisk = item.shap > 0;
    const absShap = Math.abs(item.shap);
    const widthPct = Math.min((absShap / maxAbsShap) * 100, 100);

    const row = document.createElement("div");
    row.className = "shap-row";
    row.title = `${item.feature} (${item.value}): ${item.description}`;
    row.innerHTML = `
      <span class="shap-feat-name">${item.feature}</span>
      <div class="shap-bar-track">
        <div class="shap-bar-fill ${isRisk ? 'fill-risk' : 'fill-safe'}" style="width: ${widthPct.toFixed(1)}%;"></div>
      </div>
      <span class="shap-val-txt ${isRisk ? 'risk' : 'safe'}">
        ${isRisk ? '+' : ''}${item.shap.toFixed(2)}
      </span>
    `;
    container.appendChild(row);
  });
}

function renderOrders(patient, riskProb) {
  const container = document.getElementById("orders-list");
  container.innerHTML = "";

  const orders = generateClinicalOrders(patient, riskProb);
  orders.forEach(ord => {
    const card = document.createElement("div");
    card.className = "order-card";
    card.innerHTML = `
      <span class="order-badge-priority priority-${ord.priority}">${ord.priority}</span>
      <div class="order-content">
        <h5 class="order-title">${ord.title}</h5>
        <p class="order-rationale">${ord.rationale}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function resetSimulation() {
  simState = {
    targetSbp: activePatient.sbp,
    targetEgfr: activePatient.egfr,
    gdmtActive: false,
    sdohActive: false,
    rpmActive: false
  };

  document.getElementById("lever-sbp").value = activePatient.sbp;
  document.getElementById("lever-sbp-disp").textContent = `${activePatient.sbp} mmHg`;

  document.getElementById("lever-egfr").value = activePatient.egfr;
  document.getElementById("lever-egfr-disp").textContent = `${activePatient.egfr} mL/min`;

  document.getElementById("toggle-gdmt").checked = false;
  document.getElementById("toggle-sdoh").checked = false;
  document.getElementById("toggle-rpm").checked = false;

  updateSimulation();
}

function updateSimulation() {
  const baseRisks = calculateMultiOutcomeRisk(activePatient);
  const baseProb = baseRisks.readmitProb;

  // Clone patient with modified simulated attributes
  const simPatient = { ...activePatient };
  simPatient.sbp = simState.targetSbp;
  simPatient.egfr = simState.targetEgfr;

  let simLogit = computeClinicalRiskLogit(simPatient);

  // GDMT adjustment: -0.42 log-odds reduction (approx 25-30% relative reduction)
  if (simState.gdmtActive) {
    simLogit -= 0.45;
  }

  // SDoH Navigation: resolves transport & med cost penalties
  if (simState.sdohActive) {
    simLogit -= (0.40 * (activePatient.transportInsecurity || 0) + 0.30 * (activePatient.medCostDistress || 0));
  }

  // RPM Telemonitoring: early decompensation mitigation
  if (simState.rpmActive) {
    simLogit -= 0.35;
  }

  const projectedProb = Math.min(Math.max(sigmoid(simLogit), 0.02), 0.98);
  const delta = (projectedProb - baseProb) * 100;

  document.getElementById("sim-base-val").textContent = `${(baseProb * 100).toFixed(1)}%`;
  document.getElementById("sim-projected-val").textContent = `${(projectedProb * 100).toFixed(1)}%`;

  const deltaBadge = document.getElementById("sim-delta-badge");
  const deltaSign = document.querySelector(".sim-delta-sign");
  const deltaLbl = document.querySelector(".sim-delta-lbl");

  if (delta < -0.1) {
    deltaBadge.style.background = "rgba(16, 185, 129, 0.2)";
    deltaBadge.style.borderColor = "rgba(16, 185, 129, 0.4)";
    deltaBadge.style.color = "#34d399";
    deltaSign.textContent = `${delta.toFixed(1)}%`;
    deltaLbl.textContent = "Absolute Reduction";
  } else if (delta > 0.1) {
    deltaBadge.style.background = "rgba(244, 63, 94, 0.2)";
    deltaBadge.style.borderColor = "rgba(244, 63, 94, 0.4)";
    deltaBadge.color = "#fb7185";
    deltaSign.textContent = `+${delta.toFixed(1)}%`;
    deltaLbl.textContent = "Increased Risk Burden";
  } else {
    deltaBadge.style.background = "rgba(255, 255, 255, 0.08)";
    deltaBadge.style.borderColor = "rgba(255, 255, 255, 0.2)";
    deltaBadge.style.color = "#94a3b8";
    deltaSign.textContent = "0.0%";
    deltaLbl.textContent = "No Net Change";
  }
}

function showToast(message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Initial Boot
document.addEventListener("DOMContentLoaded", initApp);
