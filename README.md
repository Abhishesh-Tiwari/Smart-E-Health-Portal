# Smart E-Health Record Portal 🏥

> **Developer:** Abhishesh Tiwari  
> **Degree:** Bachelor of Technology (B.Tech) in Computer Science & Engineering  
> **Tech Stack:** HTML5, Tailwind CSS, FontAwesome 6, Chart.js, Vanilla JavaScript (ES6+), LocalStorage  
> **Live Demo:** [Smart E-Health Portal](https://abhishesh-tiwari.github.io/Smart-E-Health-Portal/)

---

## 🚀 Executive Project Summary

**Smart E-Health Record Portal** is a scalable, client-side web application designed to transform standard patient management into a smart city healthcare grid. Initially mapped with dummy data for premier medical institutes, it integrates real-time bed availability, blood bank inventory, and clinical triage into a single unified dashboard. 

The portal operates with zero build-tool dependencies, featuring an instantaneous **Bilingual Engine (English / हिन्दी)** and a highly accessible **Dark Mode** clinical theme.

---

## 🌟 Key Modules & System Capabilities

### 1. 🏥 City-Wide Hospital, Doctor & Live Bed Directory
- **Integrated Medical Database:** Comprehensive directory covering apex government hospitals, trauma centers, and private super-specialty facilities.
- **Real-Time Bed Availability Tracker:**
  - 🔴 **ICU Beds** (Available / Total)
  - 🔵 **Oxygen Beds** (Available / Total)
  - 🟢 **General Ward Beds** (Available / Total)
- **Doctor Directory & OPD Schedule:** Detailed listing of consulting doctors, qualifications (MD, MS, DM), consultation timings, and OPD days.
- **Smart Search & Filters:** Search by doctor, hospital name, specialty, or locality with an 'ICU Beds Only' quick filter.

### 2. 🩸 Live Blood Bank Inventory & Finder
- **Interactive Blood Group Selector:** Select any blood group (`A+`, `A-`, `B+`, `B-`, `O+`, `O-`, `AB+`, `AB-`).
- **Live Stock Tracking:** Displays available blood units across network hospitals with color-coded stock status (High, Moderate, Critical, Out of Stock).
- **Emergency Helplines:** Integrated direct-dial buttons for Red Cross and Central Blood Bank networks.

### 3. 🌙 Adaptive Theme Engine (Dark / Light Mode)
- **Tailwind CSS `dark:` Mode:** Smooth transition toggle built into the navigation bar.
- **Clinical Color Scheme:** Deep navy/slate palette with emerald and cyan accents to reduce eye strain during nighttime hospital shifts.
- **Theme Persistence:** Saves user preference via `localStorage` for automatic application on the next visit.

### 4. 🇮🇳 Bilingual Support (English / हिन्दी)
- **Instant Client-Side Translation:** Switch between English and Hindi (`EN / हिन्दी`) with a single click.
- **Zero Page Reload:** Dynamically translates navigation items, module titles, and hospital badges using a structured JSON I18N dictionary.

### 5. 🩺 Smart Clinical Symptom Triage 
- Rule-based decision support engine classifying symptoms into:
  - 🔴 **RED (Emergency):** Directs immediately to Level-1 Trauma or emergency helplines.
  - 🟡 **YELLOW (Consult Soon):** Recommends specialist OPD within 24–48 hours.
  - 🟢 **GREEN (Home Care):** Recommends hydration, rest, and supportive care.

### 6. 🗄️ Digital E-Health Record Vault
- **Patient Dashboard:** Pre-loaded with dynamic dummy consultation records and health history.
- **Emergency Health Card:** Virtual ABDM-style ID card featuring a vector QR code, drug allergies, chronic conditions, and optimized `@media print` formatting for PDF export.

### 7. 📈 Health Vitals & Lifestyle Trackers
- **Visual Analytics:** Longitudinal Chart.js tracking for Blood Pressure, Blood Sugar, and Body Weight.
- **Daily Goals:** Built-in WHO BMI Calculator and interactive Daily Water & Calorie Targets.

### 8. 💊 Medicine Scheduler & Dose Adherence
- Tri-daily schedule (Morning, Afternoon, Night) with interactive check-offs and adherence progress calculation.

---

## 📂 File Architecture

```text
Smart-E-Health-Portal/
├── index.html       # Main application dashboard (Bilingual, Dark mode integrated)
├── styles.css       # Theme variables, custom animations, and print media rules
├── app.js           # Core logic: Hospital arrays, I18N dictionary, Chart.js configs
├── login.html       # Admin gateway with glassmorphism UI
└── README.md        # Academic project documentation
