# Smart Health AI v2.0 - Executive Clinical Decision Support & Risk Prediction System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-2563eb?style=for-the-badge&logo=github)](https://sat9219.github.io/smart-healthcare-risk-prediction-system/)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Flask 3.0+](https://img.shields.io/badge/Flask-3.0+-black.svg?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![scikit-learn](https://img.shields.io/badge/ML-scikit--learn-F7931E.svg?logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![Database](https://img.shields.io/badge/Database-SQLite%203-003B57.svg?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Live Interactive App (GitHub Pages):**
https://sat9219.github.io/smart-healthcare-risk-prediction-system/

---

## Executive Overview

Smart Health AI v2.0 is an enterprise-grade **Clinical Decision Support System (CDSS)** and Healthcare Administration platform engineered by Satyam Kumar Singh (Chief Administrator / CMO). It delivers full clinical risk prediction, Bayesian multi-disease ICD-10 classification, ACC/AHA 10-Year ASCVD scoring, EHR prescription generation, and an interactive biomarker risk intervention simulator -- all aligned with ADA 2024, ACC/AHA 2023, WHO-NCD, and ICMR evidence-based guidelines.

Works 100% standalone in any modern browser via **GitHub Pages** -- no server required.

---

## v2.0 Feature Set

### Clinical Decision Support Engine (CDSS)
- **Bayesian Multi-Disease Risk Classifier** -- Probabilistic scoring for 6 ICD-10 conditions:
  - Type 2 Diabetes E11.9
  - Coronary Artery Disease I25.10
  - Essential Hypertension I10
  - Influenza J11.1
  - GERD K21.9
  - Migraine G43.909
- **ACC/AHA 10-Year ASCVD Hard Risk Calculator** -- Pooled Cohort Equations: Very Low / Borderline / Intermediate / High
- **Hemodynamic Monitoring** -- Live MAP and Pulse Pressure calculation with clinical interpretation
- **ICD-10 Differential Diagnosis Ranking** -- Primary + top-3 differentials with % confidence scores
- **1st-Line Evidence-Based Pharmacotherapy** -- ADA/AHA guideline-aligned: Metformin ER, Jardiance/SGLT-2, GLP-1 agonists, Lisinopril, Statins, Triptans, PPIs
- **Therapeutic Dietary Protocols** -- Condition-specific prescribed vs. contraindicated foods
- **Phytochemical Adjuvant Protocols** -- Fenugreek, Ceylon Cinnamon, Bitter Gourd, Boswellia
- **Critical ER Red Flags** -- Emergency escalation indicators per diagnosis

### 25-Symptom Clinical Matrix
- 6 organ-system categories: Cardio-Respiratory, Endocrine/Metabolic, Systemic, Neurological, GI/Hepatic, Musculoskeletal
- Category filter pills for rapid symptom cluster navigation
- 7 Syndromic Presets: CAD | DKA | HTN Urgency | Viral | GERD | Migraine | Clear All

### Interactive What-If Biomarker Intervention Simulator
- Live sliders for Fasting Glucose, Systolic BP, BMI
- Toggle lifestyle adherence (Stop Smoking / Increase Exercise)
- Real-time projected risk delta badge: "-34% Projected Risk Reduction"
- 12-month simulation summary with target risk levels
- "Apply Simulated Vitals" -- push simulator values into assessment form

### Official EHR Clinical Prescription (Rx) Generator
- Formatted prescription with watermark and CMO Verified stamp
- Patient demographics meta-grid (Name, Age/Sex, Vitals, Labs)
- Itemized pharmacotherapy table with drug class labels
- Therapeutic diet + phytochemical protocol sections
- Critical ER red flags block
- Digital physician signature: Dr. Satyam K. Singh, MD / CMO, License #AI-9219
- Print Rx (PDF) and Copy to Clipboard actions

### Full Patient CRUD and Registry Management
- Add, Edit, Delete patients with vitals, labs, and lifestyle parameters
- Seed 5 Benchmark Clinical Patients (ICMR, CDC-NHANES, WHO-NCD references)
- Cohort risk filters: All / High / Moderate / Stable
- Global real-time patient search

### Clinical Night Shift / Daylight Theme
- Night Shift Mode -- High-contrast dark theme for clinical night workflows
- Daylight Mode -- Professional light theme for daytime administration
- Preference persisted via localStorage

### Live Lab Range Micro-Pills
- Contextual classification next to every input: Normal, Pre-Diabetic, Diabetic, Stage 1 HTN, Hypertensive Crisis, Obese, Morbid Obese
- Updates live as values are typed

### Executive Admin Dashboard
- Real-time KPI scorecards, multi-condition risk bar chart, cohort severity doughnut chart

### Analytics and ML Model Performance
- Age-group risk distributions, BP vs Glucose scatter, longitudinal trajectories
- ROC AUC curves: Diabetes 0.96 | CVD 0.94 | HTN 0.95
- Feature importance Gini coefficients

### Clinical Audit and Exports
- Full prediction history log with timestamps
- Export Patient Registry CSV and Risk Assessments Audit CSV
- Doctor Consultation Notes with localStorage persistence per patient

---

## System Architecture

Patient Cohort (CDC-NHANES, NIH, WHO, ICMR)
  --> Data Engine & SQLite Database
  --> Machine Learning Pipeline (Random Forest)
  --> Bayesian CDSS Engine (ADA / AHA / WHO Protocols)
  --> Executive Admin Dashboard
      --> Patient Registry CRUD
      --> CDSS Diagnostic Assessment
          --> ASCVD Calculator & Hemodynamics
          --> ICD-10 Differential Diagnosis
          --> EHR Prescription Generator
          --> What-If Biomarker Simulator
      --> Visual Analytics & ROC Metrics
      --> CSV Export & Audit Trail

---

## Repository Structure

```
.
|-- index.html                   # Standalone SPA -- GitHub Pages live demo
|-- app.py                       # Flask backend application and routing
|-- disease_cure_engine.py       # Evidence-based medical diagnosis and cure engine
|-- ml_model.py                  # Machine learning training and inference pipeline
|-- seed_gov_data.py             # Cohort data ingestion script
|-- healthcare.db                # SQLite 3 patient and prediction database
|-- login.html                   # Standalone 3D clinical portal login page
|-- models/                      # Trained Random Forest classifier models (.joblib)
|   |-- diabetes_rf_model.joblib
|   |-- heart_rf_model.joblib
|   |-- hypertension_rf_model.joblib
|   `-- model_metrics.joblib
|-- templates/                   # Flask Jinja2 HTML templates
|-- static/                      # Static styles and 3D scripts
|   |-- css/style.css
|   |-- js/3d_engine.js
|   `-- js/3d_bg_animation.js
|-- requirements.txt             # Python backend dependencies
`-- README.md                    # Project documentation
```

---

## Option 1 -- Live Demo (No Setup Required)

Open the full CDSS dashboard instantly via GitHub Pages:
https://sat9219.github.io/smart-healthcare-risk-prediction-system/

---

## Option 2 -- Run Locally with Python / Flask

### 1. Clone the Repository
```bash
git clone https://github.com/sat9219/smart-healthcare-risk-prediction-system.git
cd smart-healthcare-risk-prediction-system
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Start the Flask Server
```bash
python app.py
```

### 4. Access the Dashboard
```
http://127.0.0.1:5000/dashboard
```

---

## Clinical Portal Credentials

| Role | Email | Password |
|---|---|---|
| Chief Administrator / CMO | dr.satyam@smarthealth.ai | clinical2026 |

Use "1-Click Doctor Sign-In" on the login screen for instant access.

---

## Quick Start (Live Demo)

1. Open the GitHub Pages live demo
2. Sign in with 1-Click Doctor Sign-In
3. Go to "Prediction and CDSS" tab
4. Select a patient or enter custom vitals
5. Select symptoms via 25-symptom matrix or syndromic presets
6. Click "Run Clinical Diagnostic Assessment"
7. Review ASCVD risk, ICD-10 differentials, pharmacotherapy, and What-If simulator
8. Click "Generate Official Rx (EHR)" to produce and print the clinical prescription
9. In Patient Management, click "Seed 5 Patients" to populate the benchmark cohort
10. Toggle Night Shift / Daylight theme using the topbar button

---

## License

This project is licensed under the MIT License.

---

Built with clinical precision by Satyam Kumar Singh -- Chief Administrator, Smart Health AI Clinical Network.
Evidence-based protocols aligned with ADA 2024, ACC/AHA 2023, WHO-NCD, and ICMR clinical guidelines.
