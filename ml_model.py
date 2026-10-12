import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

FEATURE_NAMES = [
    "age", "gender_encoded", "bmi", "glucose",
    "systolic_bp", "diastolic_bp", "cholesterol",
    "heart_rate", "smoking_encoded", "physical_activity_encoded", "family_history_encoded"
]

def encode_patient_features(age, gender, bmi, glucose, systolic_bp, diastolic_bp, cholesterol, heart_rate, smoking, physical_activity, family_history):
    gender_enc = 1.0 if str(gender).strip().lower() == "male" else 0.0
    smoking_enc = 1.0 if str(smoking).strip().lower() == "yes" else 0.0
    family_enc = 1.0 if str(family_history).strip().lower() == "yes" else 0.0
    act_str = str(physical_activity).strip().lower()
    if act_str == "high":
        act_enc = 2.0
    elif act_str == "moderate":
        act_enc = 1.0
    else:
        act_enc = 0.0
    
    return [
        float(age), gender_enc, float(bmi), float(glucose),
        float(systolic_bp), float(diastolic_bp), float(cholesterol),
        float(heart_rate), smoking_enc, act_enc, family_enc
    ]

def generate_clinical_training_data(n_samples=2500, random_state=42):
    np.random.seed(random_state)
    
    age = np.random.randint(18, 85, n_samples)
    gender = np.random.choice([0.0, 1.0], n_samples, p=[0.5, 0.5])
    bmi = np.round(np.random.normal(27.5, 5.5, n_samples), 1)
    bmi = np.clip(bmi, 16.0, 50.0)
    
    glucose = np.round(np.random.normal(110, 32, n_samples), 1)
    glucose = np.clip(glucose, 65.0, 300.0)
    
    systolic_bp = np.round(np.random.normal(125, 20, n_samples), 1)
    systolic_bp = np.clip(systolic_bp, 85.0, 210.0)
    
    diastolic_bp = np.round(np.random.normal(82, 12, n_samples), 1)
    diastolic_bp = np.clip(diastolic_bp, 50.0, 130.0)
    
    cholesterol = np.round(np.normal(205, 42, n_samples), 1)
    cholesterol = np.clip(cholesterol, 120.0, 360.0)
    
    heart_rate = np.round(np.random.normal(75, 14, n_samples), 1)
    heart_rate = np.clip(heart_rate, 50.0, 140.0)
    
    smoking = np.random.choice([0.0, 1.0], n_samples, p=[0.75, 0.25])
    physical_activity = np.random.choice([0.0, 1.0, 2.0], n_samples, p=[0.35, 0.45, 0.20])
    family_history = np.random.choice([0.0, 1.0, 2.0], n_samples, p=[0.65, 0.35, 0.0])[:n_samples]
    
    X = np.column_stack([
        age, gender, bmi, glucose, systolic_bp, diastolic_bp,
        cholesterol, heart_rate, smoking, physical_activity, family_history
    ])
    
    # Clinical ground truth probability equations
    diab_logits = (
        (glucose - 100) * 0.055 +
        (bmi - 25) * 0.12 +
        (age - 45) * 0.035 +
        family_history * 1.1 +
        (2.0 - physical_activity) * 0.45 +
        smoking * 0.35 - 2.2
    )
    p_diabetes = 1 / (1 + np.exp(-diab_logits))
    y_diabetes = (np.random.rand(n_samples) < p_diabetes).astype(int)
    
    heart_logits = (
        (systolic_bp - 120) * 0.045 +
        (cholesterol - 200) * 0.03 +
        (age - 50) * 0.05 +
        smoking * 1.35 +
        family_history * 0.85 +
        (bmi - 25) * 0.07 +
        (heart_rate - 75) * 0.02 - 2.6
    )
    p_heart = 1 / (1 + np.exp(-heart_logits))
    y_heart = (np.random.rand(n_samples) < p_heart).astype(int)
    
    htn_logits = (
        (systolic_bp - 120) * 0.085 +
        (diastolic_bp - 80) * 0.095 +
        (bmi - 25) * 0.09 +
        (age - 45) * 0.035 +
        smoking * 0.5 +
        (2.0 - physical_activity) * 0.35 - 2.4
    )
    p_htn = 1 / (1 + np.exp(-htn_logits))
    y_htn = (np.random.rand(n_samples) < p_htn).astype(int)
    
    return X, y_diabetes, y_heart, y_htn

def train_and_save_all_models():
    print("Generating clinical benchmark dataset...")
    X, y_diabetes, y_heart, y_htn = generate_clinical_training_data()
    
    disease_targets = {
        "diabetes": y_diabetes,
        "heart": y_heart,
        "hypertension": y_htn
    }
    
    metrics_summary = {}
    
    for disease, y in disease_targets.items():
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
        # Random Forest (Primary)
        rf = RandomForestClassifier(n_estimators=120, max_depth=8, random_state=42, min_samples_split=4)
        rf.fit(X_train, y_train)
        
        # Gradient Boosting
        gb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42)
        gb.fit(X_train, y_train)
        
        # Logistic Regression Baseline
        lr = LogisticRegression(max_iter=1000, random_state=42)
        lr.fit(X_train, y_train)
        
        rf_pred = rf.predict(X_test)
        rf_proba = rf.predict_proba(X_test)[:, 1]
        
        gb_pred = gb.predict(X_test)
        gb_proba = gb.predict_proba(X_test)[:, 1]
        
        lr_pred = lr.predict(X_test)
        lr_proba = lr.predict_proba(X_test)[:, 1]
        
        rf_metrics = {
            "model_name": "Random Forest Classifier",
            "accuracy": round(accuracy_score(y_test, rf_pred) * 100, 2),
            "precision": round(precision_score(y_test, rf_pred, zero_division=0) * 100, 2),
            "recall": round(recall_score(y_test, rf_pred, zero_division=0) * 100, 2),
            "f1_score": round(f1_score(y_test, rf_pred, zero_division=0) * 100, 2),
            "roc_auc": round(roc_auc_score(y_test, rf_proba) * 100, 2),
            "feature_importance": dict(zip(FEATURE_NAMES, [round(float(v) * 100, 2) for v in rf.feature_importances_]))
        }
        
        gb_metrics = {
            "model_name": "Gradient Boosting",
            "accuracy": round(accuracy_score(y_test, gb_pred) * 100, 2),
            "precision": round(precision_score(y_test, gb_pred, zero_division=0) * 100, 2),
            "recall": round(recall_score(y_test, gb_pred, zero_division=0) * 100, 2),
            "f1_score": round(f1_score(y_test, gb_pred, zero_division=0) * 100, 2),
            "roc_auc": round(roc_auc_score(y_test, gb_proba) * 100, 2)
        }
        
        lr_metrics = {
            "model_name": "Logistic Regression",
            "accuracy": round(accuracy_score(y_test, lr_pred) * 100, 2),
            "precision": round(precision_score(y_test, lr_pred, zero_division=0) * 100, 2),
            "recall": round(recall_score(y_test, lr_pred, zero_division=0) * 100, 2),
            "f1_score": round(f1_score(y_test, lr_pred, zero_division=0) * 100, 2),
            "roc_auc": round(roc_auc_score(y_test, lr_proba) * 100, 2)
        }
        
        model_path = os.path.join(MODELS_DIR, f"{disease}_rf_model.joblib")
        joblib.dump(rf, model_path)
        
        metrics_summary[disease] = {
            "best_model": rf_metrics,
            "gradient_boosting": gb_metrics,
            "logistic_regression": lr_metrics
        }
    
    metrics_path = os.path.join(MODELS_DIR, "model_metrics.joblib")
    joblib.dump(metrics_summary, metrics_path)
    return metrics_summary

_LOADED_MODELS = {}

def get_model(disease):
    global _LOADED_MODELS
    if disease not in _LOADED_MODELS:
        model_path = os.path.join(MODELS_DIR, f"{disease}_rf_model.joblib")
        if not os.path.exists(model_path):
            train_and_save_all_models()
        _LOADED_MODELS[disease] = joblib.load(model_path)
    return _LOADED_MODELS[disease]

def get_metrics_summary():
    metrics_path = os.path.join(MODELS_DIR, "model_metrics.joblib")
    if not os.path.exists(metrics_path):
        train_and_save_all_models()
    return joblib.load(metrics_path)

def score_to_category(score):
    if score >= 60:
        return "High"
    elif score >= 30:
        return "Medium"
    else:
        return "Low"

def predict_patient_risks(age, gender, bmi, glucose, systolic_bp, diastolic_bp, cholesterol, heart_rate, smoking, physical_activity, family_history):
    features = encode_patient_features(
        age, gender, bmi, glucose, systolic_bp, diastolic_bp,
        cholesterol, heart_rate, smoking, physical_activity, family_history
    )
    X = np.array([features])
    
    results = {}
    for disease in ["diabetes", "heart", "hypertension"]:
        model = get_model(disease)
        proba = float(model.predict_proba(X)[0][1])
        score = int(round(proba * 100))
        
        results[disease] = {
            "score": score,
            "probability": proba,
            "category": score_to_category(score)
        }
        
    return results

def explain_prediction(age, gender, bmi, glucose, systolic_bp, diastolic_bp, cholesterol, heart_rate, smoking, physical_activity, family_history):
    features = encode_patient_features(
        age, gender, bmi, glucose, systolic_bp, diastolic_bp,
        cholesterol, heart_rate, smoking, physical_activity, family_history
    )
    
    feature_labels = {
        "glucose": ("Blood Glucose Level", f"{glucose} mg/dL"),
        "systolic_bp": ("Systolic Blood Pressure", f"{systolic_bp} mmHg"),
        "diastolic_bp": ("Diastolic Blood Pressure", f"{diastolic_bp} mmHg"),
        "bmi": ("Body Mass Index (BMI)", f"{bmi} kg/m²"),
        "cholesterol": ("Serum Cholesterol", f"{cholesterol} mg/dL"),
        "age": ("Patient Age", f"{age} yrs"),
        "smoking_encoded": ("Tobacco Smoking", "Active Smoker" if str(smoking).lower() == "yes" else "Non-Smoker"),
        "heart_rate": ("Resting Heart Rate", f"{heart_rate} bpm"),
        "family_history_encoded": ("Family History", "Positive" if str(family_history).lower() == "yes" else "None"),
        "physical_activity_encoded": ("Physical Activity", str(physical_activity).capitalize()),
        "gender_encoded": ("Biological Gender", str(gender).capitalize())
    }
    
    explanations = {}
    for disease in ["diabetes", "heart", "hypertension"]:
        model = get_model(disease)
        importances = model.feature_importances_
        
        factors = []
        for name, weight in zip(FEATURE_NAMES, importances):
            val_label, val_display = feature_labels.get(name, (name, ""))
            
            impact = 0.0
            if name == "glucose":
                impact = max(0.1, (float(glucose) - 100) / 70) * weight
            elif name == "systolic_bp":
                impact = max(0.1, (float(systolic_bp) - 120) / 50) * weight
            elif name == "diastolic_bp":
                impact = max(0.1, (float(diastolic_bp) - 80) / 35) * weight
            elif name == "bmi":
                impact = max(0.1, (float(bmi) - 24) / 16) * weight
            elif name == "cholesterol":
                impact = max(0.1, (float(cholesterol) - 190) / 80) * weight
            elif name == "age":
                impact = max(0.1, (float(age) - 40) / 35) * weight
            elif name == "smoking_encoded":
                impact = (1.0 if str(smoking).lower() == "yes" else 0.1) * weight
            elif name == "family_history_encoded":
                impact = (1.0 if str(family_history).lower() == "yes" else 0.1) * weight
            elif name == "physical_activity_encoded":
                impact = (1.0 if str(physical_activity).lower() == "low" else 0.2) * weight
            else:
                impact = weight * 0.2
                
            factors.append({
                "feature": name,
                "label": val_label,
                "value": val_display,
                "impact_score": float(impact)
            })
            
        total_impact = sum(f["impact_score"] for f in factors) or 1.0
        for f in factors:
            f["contribution_pct"] = round((f["impact_score"] / total_impact) * 100, 1)
            
        factors.sort(key=lambda x: x["contribution_pct"], reverse=True)
        explanations[disease] = factors[:5] # Top 5 primary risk drivers
        
    return explanations

def simulate_risk(base_patient, changes):
    """
    Given a patient dict/object and updated fields (e.g. {'glucose': 95, 'smoking': 'No'}),
    returns simulated predictions and change deltas.
    """
    age = float(changes.get("age", getattr(base_patient, "age", 45)))
    gender = str(changes.get("gender", getattr(base_patient, "gender", "Male")))
    bmi = float(changes.get("bmi", getattr(base_patient, "bmi", 25.0)))
    glucose = float(changes.get("glucose", getattr(base_patient, "glucose", 100.0)))
    systolic_bp = float(changes.get("systolic_bp", getattr(base_patient, "systolic_bp", 120.0)))
    diastolic_bp = float(changes.get("diastolic_bp", getattr(base_patient, "diastolic_bp", 80.0)))
    cholesterol = float(changes.get("cholesterol", getattr(base_patient, "cholesterol", 200.0)))
    heart_rate = float(changes.get("heart_rate", getattr(base_patient, "heart_rate", 72.0)))
    smoking = str(changes.get("smoking", getattr(base_patient, "smoking", "No")))
    physical_activity = str(changes.get("physical_activity", getattr(base_patient, "physical_activity", "Moderate")))
    family_history = str(changes.get("family_history", getattr(base_patient, "family_history", "No")))
    
    return predict_patient_risks(
        age, gender, bmi, glucose, systolic_bp, diastolic_bp,
        cholesterol, heart_rate, smoking, physical_activity, family_history
    )
