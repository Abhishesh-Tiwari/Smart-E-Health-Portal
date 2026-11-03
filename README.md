# Smart E-Health Record Portal — Bhopal Hyperlocal Edition
> **Developer:** Abhishesh Tiwari  
> **Guided By:** Prof. A. Sharma  
> **Degree:** Bachelor of Technology (B.Tech) in Computer Science & Engineering / Healthcare Informatics  
> **Demo City:** Bhopal (Madhya Pradesh)  
> **Tech Stack:** HTML5, Tailwind CSS (with `dark:` classes), FontAwesome 6, Chart.js, Vanilla JavaScript (ES6+), LocalStorage Persistence.

---

## 🏥 Executive Project Summary

**Smart E-Health Record Portal (Bhopal Hyperlocal Edition)** transforms standard patient management into a smart city healthcare grid. Focused on the city of **Bhopal**, it integrates real-time bed availability (ICU, Oxygen, General) across premier government apex institutes (*AIIMS Bhopal, Hamidia Hospital*) and private super-specialty facilities (*Bansal Hospital, Chirayu, Apollo Sage, Narmada Trauma Centre*).

The portal operates 100% client-side with zero build tool dependencies and features an instantaneous **Bilingual Engine (English / हिन्दी)** and a smooth **Dark Mode** clinical theme.

---

## 🚀 Key Modules & System Capabilities

### 1. 🏥 Bhopal Hospital, Doctor & Live Bed Directory
- **Detailed Bhopal Hospital Database:** Covers AIIMS Bhopal (Saket Nagar), Hamidia Hospital / GMC (Royal Market), Bansal Hospital (Shahpura), Chirayu (Bairagarh), Apollo Sage (Bawadiya Kalan), and Narmada Trauma Centre (Arera Colony).
- **Real-Time Bed Availability Tracker:**
  - 🔴 **ICU Beds** (Available / Total)
  - 🔵 **Oxygen Beds** (Available / Total)
  - 🟢 **General Ward Beds** (Available / Total)
  - Real-time status tags and limited availability warnings.
- **Doctor Directory & OPD Schedule:** Detailed listing of consulting doctors with qualifications (DM, MCh, MD, MS), consultation timings, room numbers, and OPD days.
- **Search & Filters:** Search by doctor, hospital name, specialty, or Bhopal locality (e.g., *Saket Nagar, Arera Colony, Shahpura*), plus an **ICU Beds Only** quick filter.

### 2. 🩸 Live Blood Bank Inventory & Finder
- **Interactive Blood Group Selector:** Patients select any blood group (`A+`, `A-`, `B+`, `B-`, `O+`, `O-`, `AB+`, `AB-`).
- **Live Stock Units by Hospital:** Displays exact available blood units at each Bhopal hospital with stock status:
  - High Stock (> 15 units)
  - Moderate Stock (5–15 units)
  - Critical / Low Stock (< 5 units)
  - Out of Stock
- **Direct Dial & Helplines:** One-click calling to hospital blood banks, **Red Cross Society Bhopal (0755-2550505)**, and Central Blood Bank (**1910**).

### 3. 🌙 Dark Mode / Light Mode Theme Engine
- **Tailwind CSS `dark:` Mode:** Smooth transition toggle in the navbar.
- **Clinical Color Scheme:** Deep navy/slate palette (`#0f172a`, `#1e293b`) with emerald and cyan accents for reduced eye strain during nighttime hospital rounds.
- **Theme Persistence:** Stores user preference in `localStorage('portal_theme')` and auto-applies on load.

### 4. 🇮🇳 Bilingual Support (English / हिन्दी)
- **Instant Client-Side Translation:** Switch between English and Hindi (`EN / हिन्दी`) with a single click in the navbar.
- **Zero Page Reload:** Dynamically translates navigation items, module titles, buttons, placeholders, and hospital badges using a structured JSON dictionary (`I18N`).
- **Language Persistence:** Stores language preference in `localStorage('portal_lang')`.

### 5. 🩺 Smart Clinical Symptom Triage & Specialist Referral
- Rule-based decision support engine classifying symptoms into:
  - 🔴 **RED EMERGENCY:** Directs immediately to **AIIMS Bhopal Level-1 Trauma** or calls **108**.
  - 🟡 **YELLOW CONSULT SOON:** Recommends specialist OPD at Hamidia / Bansal Hospital within 24–48 hours.
  - 🟢 **GREEN HOME CARE:** Hydration, fever control, and supportive care.

### 6. 🗄️ Digital E-Health Record Vault
- Pre-loaded with realistic patient consultation records for **Rajesh Sharma (Arera Colony, Bhopal)** at AIIMS Bhopal, Bansal Hospital, and Hamidia Hospital.
- **Emergency Health Card:** ABDM-compliant physical ID card with live geometric vector QR code, drug allergies, chronic conditions, and `@media print` formatting for PDF export.

### 7. 📈 Health Vitals & Lifestyle Calculators
- Longitudinal Chart.js tracking for Blood Pressure, Fasting/Post-Prandial Blood Sugar, and Body Weight.
- Built-in instant WHO BMI Calculator and Daily Water & Calorie Targets.

### 8. 💊 Medicine Scheduler & Dose Adherence
- Tri-daily schedule (Morning, Afternoon, Night) with interactive checkoffs and adherence progress percentage.

---

## 📂 File Architecture

```text
MediVault-Major-Project/
├── index.html       # Hyperlocal Bhopal Dashboard, bilingual data-i18n tags, dark mode classes
├── styles.css       # Theme variables, dark glassmorphism, pulse animations, print media rules
├── app.js           # Bhopal hospitals array, live blood stock, I18N dictionary, dark mode toggle, Chart.js logic
├── login.html       # Admin login gateway with glassmorphism, demo credentials (admin / admin123)
└── README.md        # Academic project documentation & viva evaluation guide
```

---

## ⚡ How to Run

1. Open PowerShell or Command Prompt:
   ```powershell
   cd C:\MediVault-Major-Project
   python -m http.server 8000
   ```
2. Open your browser and navigate to:
   👉 **`http://localhost:8000/login.html`**

4. The dashboard will load with full Bhopal Hyperlocal features, Dark Mode switch, and Hindi/English translation toggle.

---

## 🎓 Academic Attribution

- **Project Title:** Smart E-Health Record Portal
- **Developed By:** Abhishesh Tiwari
- 
