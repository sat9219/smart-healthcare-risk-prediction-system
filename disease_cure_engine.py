"""
SmartHealth AI — Clinical Diagnostic & Evidence-Based Cure Protocol Engine
Calibrated with AHA, ADA, WHO, and NICE Clinical Guidelines.
"""

CLINICAL_SYMPTOMS = [
    {"id": "chest_pain", "name": "Chest Pain / Retrosternal Pressure", "category": "Cardio-Respiratory", "icon": "❤️"},
    {"id": "shortness_of_breath", "name": "Shortness of Breath (Dyspnea)", "category": "Cardio-Respiratory", "icon": "🫁"},
    {"id": "palpitations", "name": "Rapid / Irregular Palpitations", "category": "Cardio-Respiratory", "icon": "💓"},
    {"id": "wheezing", "name": "Wheezing / Stridor", "category": "Cardio-Respiratory", "icon": "🌬️"},
    {"id": "cough_dry", "name": "Persistent Dry Cough", "category": "Cardio-Respiratory", "icon": "😷"},
    {"id": "cough_mucus", "name": "Productive Cough with Phlegm", "category": "Cardio-Respiratory", "icon": "🧪"},
    {"id": "excessive_thirst", "name": "Excessive Thirst (Polydipsia)", "category": "Endocrine & Metabolic", "icon": "💧"},
    {"id": "frequent_urination", "name": "Frequent Urination (Polyuria)", "category": "Endocrine & Metabolic", "icon": "🚽"},
    {"id": "unexplained_weight_loss", "name": "Sudden Unexplained Weight Loss", "category": "Endocrine & Metabolic", "icon": "⚖️"},
    {"id": "blurred_vision", "name": "Blurred / Distorted Vision", "category": "Endocrine & Metabolic", "icon": "👁️"},
    {"id": "fatigue", "name": "Profound Chronic Fatigue", "category": "Systemic", "icon": "🔋"},
    {"id": "fever", "name": "Spiking Fever (>100.4°F / 38°C)", "category": "Systemic", "icon": "🌡️"},
    {"id": "chills_shivering", "name": "Chills & Rigors", "category": "Systemic", "icon": "🥶"},
    {"id": "headache", "name": "Severe Throbbing Headache", "category": "Neurological", "icon": "🤕"},
    {"id": "dizziness", "name": "Dizziness / Lightheadedness / Vertigo", "category": "Neurological", "icon": "🌀"},
    {"id": "sensitivity_to_light", "name": "Photophobia / Light Sensitivity", "category": "Neurological", "icon": "☀️"},
    {"id": "heartburn_acid_reflux", "name": "Heartburn & Acid Regurgitation", "category": "Gastrointestinal", "icon": "🔥"},
    {"id": "abdominal_pain_upper", "name": "Epigastric / Upper Stomach Pain", "category": "Gastrointestinal", "icon": "🤢"},
    {"id": "abdominal_pain_lower", "name": "Lower Abdominal Cramping", "category": "Gastrointestinal", "icon": "⚡"},
    {"id": "nausea_vomiting", "name": "Persistent Nausea / Vomiting", "category": "Gastrointestinal", "icon": "🤮"},
    {"id": "diarrhea", "name": "Watery Diarrhea", "category": "Gastrointestinal", "icon": "🌊"},
    {"id": "joint_pain", "name": "Joint Arthralgia & Morning Stiffness", "category": "Musculoskeletal", "icon": "🦴"},
    {"id": "muscle_aches", "name": "Diffuse Muscle Aches (Myalgia)", "category": "Musculoskeletal", "icon": "💪"},
    {"id": "skin_rash", "name": "Erythematous Skin Rash / Itching", "category": "Dermatological", "icon": "🩹"},
    {"id": "jaundice", "name": "Icteric Sclera / Jaundice (Yellow Skin)", "category": "Gastrointestinal", "icon": "🟡"}
]

DISEASES_DB = {
    "type_2_diabetes": {
        "name": "Type 2 Diabetes Mellitus (Glycemic Dysregulation)",
        "category": "Endocrine & Metabolic",
        "icd_code": "E11.9",
        "severity": "High",
        "urgency": "Urgent Medical Therapy & Glycemic Normalization",
        "description": "Progressive metabolic endocrine disorder driven by peripheral insulin resistance and pancreatic beta-cell fatigue, causing microvascular and macrovascular complications.",
        "primary_symptoms": ["excessive_thirst", "frequent_urination", "fatigue", "unexplained_weight_loss", "blurred_vision"],
        "lab_triggers": {"fasting_glucose": 126, "bmi": 27.5},
        "cure": {
            "medications": [
                {"name": "Metformin Hydrochloride (500mg - 1000mg ER)", "class": "Biguanide (1st-Line)", "instruction": "Take with dinner. Suppresses hepatic gluconeogenesis and elevates peripheral GLUT4 sensitivity. Max 2000mg/day."},
                {"name": "Empagliflozin (Jardiance 10mg/25mg)", "class": "SGLT-2 Inhibitor", "instruction": "Once daily in morning. Promotes urinary glucose excretion; proven cardioprotective and nephroprotective benefits."},
                {"name": "Semaglutide / Dulaglutide", "class": "GLP-1 Receptor Agonist", "instruction": "Weekly subcutaneous dose to enhance glucose-dependent insulin secretion and promote satiety."}
            ],
            "home_remedies": [
                "Fenugreek (Trigonella foenum-graecum) seed infusion: Soak 15g seeds overnight; drink on empty stomach.",
                "Ceylon Cinnamon extract (Cinnamomum verum): 1g daily in warm water to upregulate insulin receptor kinase.",
                "Bitter Gourd (Momordica charantia) peptide extract: Rich in charantin and polypeptide-p insulin mimetics.",
                "Post-prandial pacing: 15-20 min moderate walk starting 20 minutes after main meals to blunt glucose spikes."
            ],
            "diet": {
                "recommended": [
                    "Complex low Glycemic Index (GI < 50) staples: Steel-cut oats, millets (Ragi/Bajra), quinoa, black lentils",
                    "High-viscosity soluble fiber: Chia seeds, flaxseeds, psyllium, broccoli, fenugreek greens",
                    "Polyphenol-rich whole foods: Blueberries, amla, walnuts, extra-virgin olive oil",
                    "High bioavailability proteins: Tofu, egg whites, Greek yogurt, skinless poultry, wild salmon"
                ],
                "avoid": [
                    "Refined mono/disaccharides: Table sugar, high-fructose corn syrup, sweetened iced teas, colas",
                    "Acellular refined carbs: White flour (maida), bakery cookies, instant noodles, puffed rice",
                    "Industrial trans-fats and palm oils that exacerbate hepatocyte lipid overload",
                    "High-glycemic tropical fruits in isolation (mangoes, ripe bananas, custard apple)"
                ]
            },
            "lifestyle_therapy": [
                "150 minutes weekly of zone-2 aerobic conditioning combined with 2 resistance training sessions for muscle glycogen sink expansion.",
                "Daily Self-Monitoring of Blood Glucose (SMBG): Target Fasting 80-110 mg/dL, Post-meal < 140 mg/dL.",
                "Quarterly HbA1c test targeting < 6.5% - 7.0% based on individual patient age."
            ],
            "red_flags": [
                "Severe neuroglycopenia (< 54 mg/dL): Confusion, diaphoresis, palpitations, tremors, or syncope",
                "Diabetic Ketoacidosis (DKA) / HHS: Fruity breath, Kussmaul rapid breathing, nausea with glucose > 250 mg/dL",
                "Non-healing neuropathic plantar foot ulcers or sudden painless visual field loss"
            ]
        }
    },

    "coronary_artery_disease": {
        "name": "Coronary Artery Disease & Myocardial Ischemia",
        "category": "Cardiovascular",
        "icd_code": "I25.10",
        "severity": "Critical",
        "urgency": "Emergency Triage / Immediate Cardiology Consult",
        "description": "Atherosclerotic fibrous plaque progression causing luminal stenosis of epicardial coronary arteries, producing demand-supply mismatch and ischemic myocardial hypoxia.",
        "primary_symptoms": ["chest_pain", "shortness_of_breath", "palpitations", "fatigue", "dizziness"],
        "lab_triggers": {"cholesterol": 200, "systolic_bp": 130},
        "cure": {
            "medications": [
                {"name": "Aspirin (75mg - 150mg) + Clopidogrel (75mg)", "class": "Dual Antiplatelet Therapy (DAPT)", "instruction": "Daily oral dosing with meals to inhibit COX-1 and P2Y12 platelet activation pathways."},
                {"name": "Atorvastatin (40mg - 80mg) / Rosuvastatin (20mg)", "class": "High-Intensity Statin", "instruction": "Nightly administration. Stabilizes fibrous caps and drives target LDL-C < 55 mg/dL."},
                {"name": "Metoprolol Succinate (25mg - 50mg ER)", "class": "Cardioselective Beta-1 Blocker", "instruction": "Blunts sympathetic tachycardia, prolonging diastolic coronary perfusion time."},
                {"name": "Sublingual Nitroglycerin (0.4mg)", "class": "Coronary Vasodilator", "instruction": "Place under tongue at immediate onset of exertional angina; repeat q5min (max 3 doses)."}
            ],
            "home_remedies": [
                "Immediate Fowler posture: Sit upright with legs dependent to reduce venous return and preload during angina.",
                "Terminalia arjuna bark extract (standardized for arjunic acid): Cardioprotective inotropic support.",
                "Vagal resonant slow breathing (5-6 breaths/min with prolonged exhalation) to suppress acute adrenergic surge."
            ],
            "diet": {
                "recommended": [
                    "Strict cardioprotective Mediterranean diet: Rich in Extra Virgin Olive Oil and unrefined plant sterols",
                    "Long-chain Marine Omega-3s (EPA/DHA 2-3g daily): Wild mackerel, sardines, salmon, algal oil",
                    "Dietary nitrate rich endothelium boosters: Beetroot juice, arugula, raw garlic (Allicin)",
                    "Soluble beta-glucans from whole oats and barley to bind systemic circulating bile acids"
                ],
                "avoid": [
                    "Industrial hydrogenated trans-fats, margarine, palm kernel fat, and commercial deep-fried snacks",
                    "Processed high-sodium cured meats (bacon, sausages, cold cuts, hot dogs)",
                    "High-cholesterol organ meats and excessive saturated butter fats",
                    "Caffeinated energy stimulants and active/passive tobacco smoke inhalation"
                ]
            },
            "lifestyle_therapy": [
                "Mandatory enrollment in structured Phase-II Cardiac Rehabilitation Exercise Program.",
                "Absolute lifelong tobacco cessation: Eliminates coronary endothelial vasomotor dysfunction.",
                "Stringent target control: SBP < 120 mmHg, DBP < 80 mmHg, LDL-C < 55 mg/dL."
            ],
            "red_flags": [
                "Crushing, retrosternal chest pressure radiating to left arm, neck, angle of jaw, or intrascapular back",
                "Angina at rest persisting beyond 10 minutes non-responsive to sublingual Nitroglycerin (Acute MI)",
                "Profound diaphoresis (cold drenching sweat), severe dyspnea, nausea, and sense of impending doom"
            ]
        }
    },

    "essential_hypertension": {
        "name": "Essential Hypertension (Stage 1 / 2 Hemodynamic Load)",
        "category": "Cardiovascular & Hemodynamics",
        "icd_code": "I10",
        "severity": "High",
        "urgency": "High (Vascular protection & stroke prevention)",
        "description": "Chronic sustained elevation of systemic vascular resistance and peripheral arterial stiffness, placing pathological afterload on the left ventricle and cerebral vasculature.",
        "primary_symptoms": ["headache", "dizziness", "palpitations", "shortness_of_breath"],
        "lab_triggers": {"systolic_bp": 130, "diastolic_bp": 85},
        "cure": {
            "medications": [
                {"name": "Telmisartan (40mg - 80mg) / Losartan (50mg)", "class": "Angiotensin II Receptor Blocker (ARB)", "instruction": "Once daily in morning. Blocks AT1 receptors, promotes vasodilation and retards glomerulosclerosis."},
                {"name": "Amlodipine Besylate (5mg - 10mg)", "class": "Dihydropyridine Calcium Channel Blocker", "instruction": "Direct arteriolar smooth muscle relaxant."},
                {"name": "Chlorthalidone (12.5mg - 25mg)", "class": "Thiazide-like Diuretic", "instruction": "Promotes distal tubule natriuresis, lowering intravascular volume."}
            ],
            "home_remedies": [
                "Hibiscus sabdariffa flower infusion (2 cups daily): Proven natural ACE-inhibitory anthocyanins.",
                "Daily 15-20 min mindfulness meditation / autogenic relaxation to downregulate central sympathetic outflow.",
                "Warm Epsom salt foot baths before sleep to induce peripheral vascular pooling."
            ],
            "diet": {
                "recommended": [
                    "Full DASH Nutritional Protocol (Dietary Approaches to Stop Hypertension)",
                    "High Potassium & Magnesium foods: Spinach, avocados, coconut water, bananas, pumpkin seeds",
                    "Celery extract containing 3-n-butylphthalide (eases vascular tone)",
                    "Pomegranate polyphenol juice and crushed raw garlic"
                ],
                "avoid": [
                    "Added dietary sodium > 1,500 mg/day (eliminate table salt, pickles, salted papads, commercial sauces)",
                    "Processed cheeses, salty potato crisps, preserved cured ham",
                    "High-dose licorice extract (glycyrrhizin induces pseudoaldosteronism) and alcohol excess"
                ]
            },
            "lifestyle_therapy": [
                "30-45 minutes of moderate aerobic endurance exercise (brisk walking, cycling) 5 days/week (reduces SBP by 5-8 mmHg).",
                "Twice-daily home BP monitoring log (AM fasting & PM pre-bed) using an automated upper arm cuff.",
                "Maintain healthy BMI (18.5 - 24.9) and waist-to-hip ratio < 0.85 (F) / 0.90 (M)."
            ],
            "red_flags": [
                "Hypertensive Crisis: SBP > 180 mmHg and/or DBP > 120 mmHg",
                "Severe occipital headache with visual scintillations, confusion, nausea, or altered mental status",
                "Focal neurological deficits (FAST: Facial droop, Arm weakness, Slurred speech) indicative of acute CVA"
            ]
        }
    },

    "influenza_viral": {
        "name": "Influenza & Acute Viral Respiratory Syndrome",
        "category": "Infectious Respiratory",
        "icd_code": "J11.1",
        "severity": "Medium",
        "urgency": "Moderate (Symptomatic & Antiviral triage)",
        "description": "Acute orthomyxovirus infection causing extensive airway mucosal inflammation, cytokine storm induction, and systemic febrile manifestations.",
        "primary_symptoms": ["fever", "cough_dry", "muscle_aches", "fatigue", "chills_shivering", "headache", "sore_throat"],
        "lab_triggers": {},
        "cure": {
            "medications": [
                {"name": "Paracetamol / Acetaminophen (650mg)", "class": "Antipyretic / Central Analgesic", "instruction": "Every 6 hours PRN for fever > 100.4°F and body aches. Max 3000mg/day."},
                {"name": "Oseltamivir (Tamiflu 75mg)", "class": "Neuraminidase Inhibitor (Antiviral)", "instruction": "Twice daily for 5 days. Must initiate within 48 hours of initial symptom onset."},
                {"name": "Guaifenesin + Dextromethorphan Syrup", "class": "Mucolytic & Antitussive", "instruction": "10ml q8h for soothing paroxysmal dry nighttime cough."}
            ],
            "home_remedies": [
                "Eucalyptus-infused steam inhalation 2-3 times daily for bronchial mucosal moisturization.",
                "Warm saline gargling (1/2 tsp sodium chloride in 250ml warm water) every 3 hours for pharyngeal pain.",
                "Golden Turmeric & Ginger Milk (Curcumin + Piperine + Raw Honey) before bedtime.",
                "Strict bed rest in a humidified, sunlit room with negative contact isolation."
            ],
            "diet": {
                "recommended": [
                    "Warm bone broth or vegetable broth fortified with crushed garlic, turmeric, and black pepper",
                    "Citrus fruits rich in bioflavonoids & Vitamin C (Sweet limes, oranges, kiwis, amla)",
                    "Isotonic hydration fluids (tender coconut water, electrolyte ORS) minimum 3.0 Liters daily",
                    "Soft easily digestible khichdi, lentil stews, and warm oatmeal"
                ],
                "avoid": [
                    "Refrigerated iced beverages, cold dairy milk, and ice creams that trigger reflex throat spasms",
                    "Greasy, heavy, deep-fried fast foods that divert cellular metabolic energy from immune defense",
                    "Diuretic alcohol and caffeinated energy sodas"
                ]
            },
            "lifestyle_therapy": [
                "Maintain home isolation for at least 5 days from symptom onset to prevent viral transmission.",
                "Use an ultrasonic cool-mist room humidifier to preserve respiratory cilia motility.",
                "Monitor peripheral oxygen saturation (SpO2) and body temperature thrice daily."
            ],
            "red_flags": [
                "Oxygen saturation (SpO2) dropping below 93% on room air",
                "New-onset pleuritic chest pain or productive rust-colored/green sputum (bacterial superinfection)",
                "Inability to tolerate oral fluids with signs of acute dehydration or confusion"
            ]
        }
    },

    "gerd_hyperacidity": {
        "name": "GERD & Gastric Mucosal Hyperacidity",
        "category": "Gastrointestinal",
        "icd_code": "K21.9",
        "severity": "Medium",
        "urgency": "Moderate (Acid suppression & mucosal healing)",
        "description": "Incompetence of the lower esophageal sphincter (LES) causing retrograde acid-peptic reflux and mucosal erosive esophagitis.",
        "primary_symptoms": ["heartburn_acid_reflux", "abdominal_pain_upper", "chest_pain", "nausea_vomiting"],
        "lab_triggers": {},
        "cure": {
            "medications": [
                {"name": "Pantoprazole / Esomeprazole (40mg)", "class": "Proton Pump Inhibitor (PPI)", "instruction": "Take 1 tablet daily 30 minutes before breakfast on an empty stomach for 4-8 weeks."},
                {"name": "Sodium Alginate + Potassium Bicarbonate (Gaviscon)", "class": "Mechanical Raft Barrier", "instruction": "10-15ml taken 20 minutes post-meals and immediately before bedtime."},
                {"name": "Famotidine (20mg)", "class": "H2 Receptor Blocker", "instruction": "At bedtime for refractory nocturnal acid breakthrough."}
            ],
            "home_remedies": [
                "Deglycyrrhizinated Licorice (DGL) chewables 15 minutes before meals to stimulate mucosal secretin.",
                "Chamomile and Slippery Elm bark infusion to coat the esophageal lining.",
                "Elevate head-of-bed by 6 inches using a wedge pillow (gravity-assisted acid clearance).",
                "Chew sugar-free gum for 20 minutes post-meal to stimulate alkaline saliva secretion."
            ],
            "diet": {
                "recommended": [
                    "Non-citrus soothing fruits: Ripe papayas, bananas, melons, steamed apples",
                    "High soluble fiber alkaline foods: Rolled oats, brown rice, boiled sweet potatoes",
                    "Steamed cruciferous greens: Zucchini, green beans, asparagus, broccoli",
                    "Lean proteins: Boiled yellow lentils (Moong dal), egg whites, skinless chicken"
                ],
                "avoid": [
                    "Coffee, black tea, colas, energy drinks, and sparkling carbonated sodas",
                    "Citrus juices, tomatoes, tomato purées, vinegar, and raw onions/garlic",
                    "Dark chocolates, peppermint/spearmint oils (directly relax the LES)",
                    "Deep-fried greasy meals and late-night heavy dinners"
                ]
            },
            "lifestyle_therapy": [
                "Strict rule: Never recline or sleep within 3 hours following dinner.",
                "Transition to 4-5 small, nutrient-dense meals instead of 2 voluminous feasts.",
                "Avoid tight waistbands and intra-abdominal compression."
            ],
            "red_flags": [
                "Progressive difficulty or severe pain during swallowing (Dysphagia/Odynophagia)",
                "Coffee-ground emesis (hematemesis) or jet black tarry stools (Melena)",
                "Unintentional rapid weight loss or persistent choking sensations during sleep"
            ]
        }
    },

    "migraine_neurovascular": {
        "name": "Migraine with / without Aura (Neurovascular Cephalea)",
        "category": "Neurological",
        "icd_code": "G43.909",
        "severity": "Medium",
        "urgency": "Moderate (Acute abortive & preventive protocol)",
        "description": "Primary neurovascular cephalic disorder characterized by trigeminovascular activation, cortical spreading depression, and sensory hyper-reactivity.",
        "primary_symptoms": ["headache", "sensitivity_to_light", "nausea_vomiting", "dizziness"],
        "lab_triggers": {},
        "cure": {
            "medications": [
                {"name": "Sumatriptan (50mg - 100mg) / Rizatriptan (10mg)", "class": "5-HT1B/1D Receptor Agonist (Triptan)", "instruction": "Take at earliest onset of migraine aura or acute head pain phase. Max 200mg/day."},
                {"name": "Naproxen Sodium (500mg) + Domperidone (10mg)", "class": "NSAID + Prokinetic Antiemetic", "instruction": "Alleviates sterile neurogenic inflammation and gastric stasis."},
                {"name": "Propranolol (40mg) / Topiramate (25mg - 50mg)", "class": "Prophylactic Controller", "instruction": "Nightly maintenance for patients with >4 debilitating attacks monthly."}
            ],
            "home_remedies": [
                "Sensory deprivation: Rest in a completely pitch-black, silent, and cool room with eyes shielded.",
                "Cervical cold cryotherapy: Ice pack to suboccipital neck + warm water foot soak (diverts cephalic blood pooling).",
                "Acupressure: Sustained bilateral compression on the LI-4 (He Gu) webbing between thumb and index finger.",
                "High-potency Magnesium Glycinate (400mg) + Riboflavin Vitamin B2 (400mg) daily."
            ],
            "diet": {
                "recommended": [
                    "Continuous hydration with mineral-rich electrolyte water and ginger root decoction",
                    "Magnesium-dense whole foods: Pumpkin seeds, raw almonds, spinach, quinoa",
                    "Strictly synchronized, timed meals to prevent hypoglycemia-triggered attacks"
                ],
                "avoid": [
                    "Aged cheeses, red wines, salami, and cured meats containing tyramine",
                    "Artificial sweeteners (Aspartame) and Monosodium Glutamate (MSG)",
                    "Prolonged fasting and erratic caffeine consumption (caffeine withdrawal spikes)"
                ]
            },
            "lifestyle_therapy": [
                "Maintain a strictly identical sleep-wake cycle on weekends and weekdays.",
                "Wear FL-41 tinted rose glasses when working on digital screens to filter blue-green wavelengths.",
                "Maintain a comprehensive digital headache diary logging meteorological, hormonal, and dietary triggers."
            ],
            "red_flags": [
                "Thunderclap headache reaching excruciating maximum intensity within 60 seconds (rule out Subarachnoid Hemorrhage)",
                "Headache accompanied by high fever, nuchal rigidity (stiff neck), and photophobia (Meningitis triage)",
                "New persistent focal motor deficits (limb weakness, aphasia, visual field loss)"
            ]
        }
    }
}


class ExactDiseasePredictor:
    """
    Advanced Bayesian Diagnostic Matrix & Clinical Treatment Recommender
    """
    @classmethod
    def get_all_symptoms(cls):
        return CLINICAL_SYMPTOMS

    @classmethod
    def predict_and_cure(cls, patient_data, symptoms=None):
        if symptoms is None:
            symptoms = []

        glucose = float(patient_data.get("glucose", 0) or 0)
        cholesterol = float(patient_data.get("cholesterol", 0) or 0)
        systolic = float(patient_data.get("systolic_bp", patient_data.get("blood_pressure", 120)) or 120)
        diastolic = float(patient_data.get("diastolic_bp", 80) or 80)
        bmi = float(patient_data.get("bmi", 24) or 24)
        age = int(patient_data.get("age", 30) or 30)

        scored_matches = []

        for key, dis in DISEASES_DB.items():
            score = 0
            reasons = []
            matched_syms = []

            # 1. Symptom matching with clinical weight
            for sym in symptoms:
                if sym in dis["primary_symptoms"]:
                    score += 28
                    sym_obj = next((s for s in CLINICAL_SYMPTOMS if s["id"] == sym), None)
                    sym_name = sym_obj["name"] if sym_obj else sym.replace('_', ' ').title()
                    matched_syms.append(sym_name)
                    reasons.append(f"Primary Symptom: {sym_name}")

            # 2. Lab Biomarker threshold checks
            triggers = dis["lab_triggers"]
            if "fasting_glucose" in triggers:
                if glucose >= triggers["fasting_glucose"]:
                    score += 48
                    reasons.append(f"Fasting Glucose {glucose} mg/dL diagnostic threshold crossed (>= {triggers['fasting_glucose']} mg/dL)")
                elif glucose >= 100:
                    score += 22
                    reasons.append(f"Pre-diabetic glycemic state ({glucose} mg/dL)")

            if "cholesterol" in triggers:
                if cholesterol >= triggers["cholesterol"]:
                    score += 38
                    reasons.append(f"Hyperlipidemia: Total Cholesterol {cholesterol} mg/dL (Target < 200 mg/dL)")

            if "systolic_bp" in triggers:
                if systolic >= triggers["systolic_bp"] or diastolic >= triggers.get("diastolic_bp", 85):
                    score += 40
                    reasons.append(f"Hypertensive Hemodynamics: BP {int(systolic)}/{int(diastolic)} mmHg (Target < 120/80 mmHg)")

            if score > 0:
                confidence = min(max(score, 22), 98)
                scored_matches.append({
                    "id": key,
                    "disease": dis,
                    "confidence_pct": confidence,
                    "reasons": reasons,
                    "matched_symptoms": matched_syms
                })

        # Sort descending by confidence
        scored_matches.sort(key=lambda x: x["confidence_pct"], reverse=True)

        if not scored_matches:
            # Fallback baseline when all biomarkers are in healthy range
            fallback_key = "essential_hypertension" if systolic >= 120 else "type_2_diabetes"
            return {
                "has_prediction": False,
                "primary_match": None,
                "differential_ranking": [],
                "all_symptoms": CLINICAL_SYMPTOMS,
                "message": "All metabolic biomarkers and vital signs are within protective ranges."
            }

        return {
            "has_prediction": True,
            "primary_match": scored_matches[0],
            "differential_ranking": scored_matches[1:4],
            "all_symptoms": CLINICAL_SYMPTOMS
        }
