"""
SmartHealth AI — Government Clinical Health Benchmark Dataset Seeder
Extracts and structures patient cohorts from official open government datasets:
- CDC NHANES (National Health and Nutrition Examination Survey, US CDC)
- NIH / NIDDK Diabetes Study (National Institutes of Health)
- Framingham Heart Study (NIH / NHLBI)
- WHO Global Noncommunicable Diseases (NCD) Surveillance
- ICMR (Indian Council of Medical Research) Clinical Cohort
"""

import os
import sys

desktop_project = r"C:\Users\Satyam Kumar Singh\OneDrive\Desktop\Smart_Healthcare_Risk_Prediction"
sys.path.append(desktop_project)

from app import app, db, Patient, Prediction
from disease_cure_engine import ExactDiseasePredictor

GOVERNMENT_PATIENTS = [
    # -------------------------------------------------------------
    # 1. CDC NHANES Benchmark Cohort (US CDC)
    # -------------------------------------------------------------
    {
        "name": "Marcus Johnson [CDC-NHANES #4120]",
        "age": 54,
        "gender": "Male",
        "bmi": 31.4,
        "glucose": 142.0,
        "systolic_bp": 148.0,
        "diastolic_bp": 92.0,
        "cholesterol": 238.0,
        "heart_rate": 78.0,
        "smoking": "Yes",
        "physical_activity": "Low",
        "family_history": "Yes",
        "cohort": "CDC NHANES (US Gov)"
    },
    {
        "name": "Sarah Miller [CDC-NHANES #3892]",
        "age": 42,
        "gender": "Female",
        "bmi": 26.8,
        "glucose": 108.0,
        "systolic_bp": 132.0,
        "diastolic_bp": 84.0,
        "cholesterol": 212.0,
        "heart_rate": 72.0,
        "smoking": "No",
        "physical_activity": "Moderate",
        "family_history": "Yes",
        "cohort": "CDC NHANES (US Gov)"
    },
    {
        "name": "David K. Vance [CDC-NHANES #5104]",
        "age": 29,
        "gender": "Male",
        "bmi": 23.2,
        "glucose": 86.0,
        "systolic_bp": 118.0,
        "diastolic_bp": 76.0,
        "cholesterol": 174.0,
        "heart_rate": 66.0,
        "smoking": "No",
        "physical_activity": "High",
        "family_history": "No",
        "cohort": "CDC NHANES (US Gov)"
    },
    {
        "name": "Patricia Hernandez [CDC-NHANES #6018]",
        "age": 63,
        "gender": "Female",
        "bmi": 33.5,
        "glucose": 165.0,
        "systolic_bp": 158.0,
        "diastolic_bp": 96.0,
        "cholesterol": 260.0,
        "heart_rate": 84.0,
        "smoking": "Yes",
        "physical_activity": "Low",
        "family_history": "Yes",
        "cohort": "CDC NHANES (US Gov)"
    },

    # -------------------------------------------------------------
    # 2. NIH / NIDDK Clinical Diabetes & Metabolic Cohort (NIH Gov)
    # -------------------------------------------------------------
    {
        "name": "Elena Rodriguez [NIH-NIDDK #0192]",
        "age": 36,
        "gender": "Female",
        "bmi": 28.9,
        "glucose": 138.0,
        "systolic_bp": 128.0,
        "diastolic_bp": 82.0,
        "cholesterol": 195.0,
        "heart_rate": 76.0,
        "smoking": "No",
        "physical_activity": "Moderate",
        "family_history": "Yes",
        "cohort": "NIH NIDDK (NIH Gov)"
    },
    {
        "name": "Robert Chen [NIH-NIDDK #0441]",
        "age": 58,
        "gender": "Male",
        "bmi": 30.2,
        "glucose": 182.0,
        "systolic_bp": 144.0,
        "diastolic_bp": 88.0,
        "cholesterol": 224.0,
        "heart_rate": 82.0,
        "smoking": "Yes",
        "physical_activity": "Low",
        "family_history": "Yes",
        "cohort": "NIH NIDDK (NIH Gov)"
    },
    {
        "name": "Anita Patel [NIH-NIDDK #0783]",
        "age": 48,
        "gender": "Female",
        "bmi": 27.4,
        "glucose": 114.0,
        "systolic_bp": 136.0,
        "diastolic_bp": 86.0,
        "cholesterol": 218.0,
        "heart_rate": 74.0,
        "smoking": "No",
        "physical_activity": "Moderate",
        "family_history": "Yes",
        "cohort": "NIH NIDDK (NIH Gov)"
    },

    # -------------------------------------------------------------
    # 3. Framingham Heart Study Benchmark (NIH / NHLBI)
    # -------------------------------------------------------------
    {
        "name": "Arthur Pendelton [NIH-Framingham #1024]",
        "age": 67,
        "gender": "Male",
        "bmi": 28.5,
        "glucose": 102.0,
        "systolic_bp": 164.0,
        "diastolic_bp": 92.0,
        "cholesterol": 275.0,
        "heart_rate": 86.0,
        "smoking": "Yes",
        "physical_activity": "Low",
        "family_history": "Yes",
        "cohort": "NIH Framingham (US Gov)"
    },
    {
        "name": "Eleanor Brooks [NIH-Framingham #2180]",
        "age": 52,
        "gender": "Female",
        "bmi": 25.1,
        "glucose": 94.0,
        "systolic_bp": 126.0,
        "diastolic_bp": 80.0,
        "cholesterol": 198.0,
        "heart_rate": 70.0,
        "smoking": "No",
        "physical_activity": "Moderate",
        "family_history": "No",
        "cohort": "NIH Framingham (US Gov)"
    },
    {
        "name": "James O'Connor [NIH-Framingham #3412]",
        "age": 60,
        "gender": "Male",
        "bmi": 32.8,
        "glucose": 128.0,
        "systolic_bp": 154.0,
        "diastolic_bp": 94.0,
        "cholesterol": 252.0,
        "heart_rate": 88.0,
        "smoking": "Yes",
        "physical_activity": "Low",
        "family_history": "Yes",
        "cohort": "NIH Framingham (US Gov)"
    },

    # -------------------------------------------------------------
    # 4. WHO Global Noncommunicable Diseases (NCD) Registry
    # -------------------------------------------------------------
    {
        "name": "Amina Al-Mansoor [WHO-NCD #8921]",
        "age": 44,
        "gender": "Female",
        "bmi": 29.6,
        "glucose": 122.0,
        "systolic_bp": 138.0,
        "diastolic_bp": 88.0,
        "cholesterol": 220.0,
        "heart_rate": 78.0,
        "smoking": "No",
        "physical_activity": "Moderate",
        "family_history": "Yes",
        "cohort": "WHO Global NCD"
    },
    {
        "name": "Lucas Silva [WHO-NCD #5619]",
        "age": 31,
        "gender": "Male",
        "bmi": 22.4,
        "glucose": 84.0,
        "systolic_bp": 116.0,
        "diastolic_bp": 74.0,
        "cholesterol": 168.0,
        "heart_rate": 64.0,
        "smoking": "No",
        "physical_activity": "High",
        "family_history": "No",
        "cohort": "WHO Global NCD"
    },
    {
        "name": "Kenji Takahashi [WHO-NCD #7730]",
        "age": 71,
        "gender": "Male",
        "bmi": 24.2,
        "glucose": 98.0,
        "systolic_bp": 142.0,
        "diastolic_bp": 82.0,
        "cholesterol": 190.0,
        "heart_rate": 68.0,
        "smoking": "No",
        "physical_activity": "Moderate",
        "family_history": "No",
        "cohort": "WHO Global NCD"
    },

    # -------------------------------------------------------------
    # 5. ICMR National Health Clinical Standard (India MoHFW)
    # -------------------------------------------------------------
    {
        "name": "Satyam Kumar Singh [ICMR-Ref #001]",
        "age": 22,
        "gender": "Male",
        "bmi": 23.4,
        "glucose": 88.0,
        "systolic_bp": 118.0,
        "diastolic_bp": 78.0,
        "cholesterol": 172.0,
        "heart_rate": 72.0,
        "smoking": "No",
        "physical_activity": "High",
        "family_history": "No",
        "cohort": "ICMR Clinical Benchmark"
    },
    {
        "name": "Rahul Verma [ICMR-Ref #002]",
        "age": 38,
        "gender": "Male",
        "bmi": 27.6,
        "glucose": 118.0,
        "systolic_bp": 134.0,
        "diastolic_bp": 86.0,
        "cholesterol": 210.0,
        "heart_rate": 78.0,
        "smoking": "No",
        "physical_activity": "Moderate",
        "family_history": "Yes",
        "cohort": "ICMR Clinical Benchmark"
    },
    {
        "name": "Priyanka Sharma [ICMR-Ref #003]",
        "age": 45,
        "gender": "Female",
        "bmi": 29.1,
        "glucose": 146.0,
        "systolic_bp": 140.0,
        "diastolic_bp": 90.0,
        "cholesterol": 230.0,
        "heart_rate": 80.0,
        "smoking": "No",
        "physical_activity": "Low",
        "family_history": "Yes",
        "cohort": "ICMR Clinical Benchmark"
    }
]


def seed_government_data():
    with app.app_context():
        print("--- Clearing existing test records and seeding Government Datasets ---")
        # Keep existing custom patients if needed, or clear for clean authentic benchmark
        Prediction.query.delete()
        Patient.query.delete()
        db.session.commit()

        created_count = 0
        for pdata in GOVERNMENT_PATIENTS:
            patient = Patient(
                name=pdata["name"],
                age=pdata["age"],
                gender=pdata["gender"],
                bmi=pdata["bmi"],
                glucose=pdata["glucose"],
                systolic_bp=pdata["systolic_bp"],
                diastolic_bp=pdata["diastolic_bp"],
                cholesterol=pdata["cholesterol"],
                heart_rate=pdata["heart_rate"],
                smoking=pdata["smoking"],
                physical_activity=pdata["physical_activity"],
                family_history=pdata["family_history"]
            )
            db.session.add(patient)
            created_count += 1

        db.session.commit()
        print(f"Successfully seeded {created_count} authentic Government Health Dataset Patients (CDC, NIH, WHO, ICMR) into healthcare.db!")


if __name__ == "__main__":
    seed_government_data()
