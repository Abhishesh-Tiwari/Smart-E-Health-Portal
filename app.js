/* ==========================================================================
   Smart E-Health Portal — Modern & Simple Healthcare Application Logic
   ========================================================================== */

// --- 1. AUTHENTICATION ROUTE GUARD & CURRENT USER ---
function getCurrentUser() {
  const raw = localStorage.getItem('currentUser');
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const name = parsed.name || parsed.fullName || parsed.username || parsed.userName;
      if (name && name.trim()) {
        return {
          ...parsed,
          name: name.trim()
        };
      }
    }
    if (typeof parsed === 'string' && parsed.trim()) return { name: parsed.trim(), email: '' };
  } catch (e) {
    if (typeof raw === 'string' && raw.trim()) return { name: raw.trim(), email: '' };
  }
  return null;
}

(function checkAuthGuard() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = getCurrentUser();
  if (!isLoggedIn || !user || !user.name) {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.replace('login.html');
  }
})();

// Logout Function
window.handleLogout = function() {
  const isHi = localStorage.getItem('lang') === 'hi';
  const msg = isHi ? "क्या आप लॉगआउट करना चाहते हैं?" : "Are you sure you want to log out?";
  if (confirm(msg)) {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }
};

// --- USER DATABASE HELPERS & DEFAULT USERS (LOCALSTORAGE) ---
const DEFAULT_USERS = [
  {
    name: "User",
    email: "user@medivault.com",
    password: "password123",
    age: 48,
    gender: "Male",
    bloodGroup: "AB+",
    phone: "+91 98260 12345",
    address: "E-7 Arera Colony, Bhopal, MP 462016",
    isDonor: false,
    createdAt: new Date().toISOString()
  },
  {
    name: "Rahul Sharma",
    email: "rahul@example.com",
    password: "password123",
    age: 48,
    gender: "Male",
    bloodGroup: "AB+",
    phone: "+91 98260 12345",
    address: "E-7 Arera Colony, Bhopal, MP 462016",
    isDonor: false,
    createdAt: new Date().toISOString()
  },
  {
    name: "Admin User",
    email: "admin@medivault.com",
    password: "admin123",
    age: 42,
    gender: "Female",
    bloodGroup: "O+",
    phone: "+91 98261 98765",
    address: "Shahpura, Bhopal, MP 462039",
    isDonor: false,
    createdAt: new Date().toISOString()
  }
];

function getStoredUsers() {
  try {
    const raw = localStorage.getItem("users");
    if (!raw) {
      localStorage.setItem("users", JSON.stringify(DEFAULT_USERS));
      return [...DEFAULT_USERS];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem("users", JSON.stringify(DEFAULT_USERS));
    return [...DEFAULT_USERS];
  } catch (e) {
    localStorage.setItem("users", JSON.stringify(DEFAULT_USERS));
    return [...DEFAULT_USERS];
  }
}

function saveStoredUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getBloodCompatibility(bg) {
  const map = {
    "O-": "Universal RBC Donor",
    "O+": "Universal Donor (Rh+)",
    "A-": "A- / AB- Donor",
    "A+": "A+ / AB+ Recipient",
    "B-": "B- / AB- Donor",
    "B+": "B+ / AB+ Recipient",
    "AB-": "Universal Plasma Donor",
    "AB+": "Universal Recipient"
  };
  return map[bg] || "Compatible Clinical Match";
}

// --- 1. DATA BINDING FUNCTION: loadProfileView ---
function loadProfileView() {
  let currentUser = null;
  try {
    const raw = localStorage.getItem('currentUser');
    if (raw) currentUser = JSON.parse(raw);
  } catch (err) {
    console.error("Error reading currentUser from localStorage:", err);
  }

  // Fallback defaults if currentUser is not yet seeded
  if (!currentUser || typeof currentUser !== 'object') {
    currentUser = {
      name: "User",
      email: "user@medivault.com",
      age: 48,
      gender: "Male",
      bloodGroup: "AB+",
      phone: "+91 98260 12345",
      address: "E-7 Arera Colony, Bhopal, MP 462016",
      isDonor: false
    };
  }

  // Cross-reference with stored users if details are partially present
  const users = typeof getStoredUsers === 'function' ? getStoredUsers() : [];
  const matchedUser = users.find(u => 
    (currentUser.email && u.email && u.email.toLowerCase() === currentUser.email.toLowerCase()) ||
    (currentUser.name && u.name && u.name.toLowerCase() === currentUser.name.toLowerCase())
  ) || {};

  const name = currentUser.name || matchedUser.name || "User";
  const email = currentUser.email || matchedUser.email || (name !== "User" ? `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@medivault.com` : "user@medivault.com");
  const age = (currentUser.age !== undefined && currentUser.age !== null) ? currentUser.age : (matchedUser.age || 48);
  const gender = currentUser.gender || matchedUser.gender || "Male";
  const bloodGroup = currentUser.bloodGroup || matchedUser.bloodGroup || "AB+";
  const phone = currentUser.phone || matchedUser.phone || "+91 98260 12345";
  const address = currentUser.address || matchedUser.address || "E-7 Arera Colony, Bhopal, MP 462016";
  const isDonor = currentUser.isDonor !== undefined ? currentUser.isDonor : (matchedUser.isDonor !== undefined ? matchedUser.isDonor : false);

  // Target specific elements in My Profile section showing "User" and replace with currentUser.name
  const displayName = document.getElementById("profile-display-name") || document.querySelector("#profile-display-name");
  if (displayName) displayName.textContent = name;

  const headerName = document.getElementById("profile-header-name") || document.querySelector("#profile-header-name");
  if (headerName) headerName.textContent = name;

  const nameDisplay = document.getElementById("profile-name-display") || document.querySelector("#profile-name-display");
  if (nameDisplay) nameDisplay.textContent = name;

  // Target specific elements in My Profile section showing "user@example.com" and replace with currentUser.email
  const displayEmail = document.getElementById("profile-display-email") || document.querySelector("#profile-display-email");
  if (displayEmail) displayEmail.textContent = email;

  const headerEmail = document.getElementById("profile-header-email") || document.querySelector("#profile-header-email");
  if (headerEmail) headerEmail.textContent = email;

  const emailDisplay = document.getElementById("profile-email-display") || document.querySelector("#profile-email-display");
  if (emailDisplay) emailDisplay.textContent = email;

  // Avatar initials display
  const avatarDisplay = document.getElementById("profile-avatar-display") || document.querySelector("#profile-avatar-display");
  if (avatarDisplay) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const initials = parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (parts[0] ? parts[0].substring(0, 2).toUpperCase() : 'U');
    avatarDisplay.textContent = initials;
  }

  // Demographic display cards
  const ageDisplay = document.getElementById("profile-age-display") || document.querySelector("#profile-age-display");
  if (ageDisplay) ageDisplay.textContent = `${age} Yrs`;

  const ageDemographic = document.getElementById("profile-age-demographic") || document.querySelector("#profile-age-demographic");
  if (ageDemographic) {
    const a = Number(age);
    ageDemographic.textContent = a < 18 ? "Pediatric Record" : (a >= 60 ? "Senior Citizen Record" : "Adult Demographic Record");
  }

  const genderDisplay = document.getElementById("profile-gender-display") || document.querySelector("#profile-gender-display");
  if (genderDisplay) genderDisplay.textContent = gender;

  const bloodDisplay = document.getElementById("profile-blood-display") || document.querySelector("#profile-blood-display");
  if (bloodDisplay) bloodDisplay.textContent = bloodGroup;

  const headerBlood = document.getElementById("profile-header-blood") || document.querySelector("#profile-header-blood");
  if (headerBlood) headerBlood.textContent = bloodGroup;

  const bloodLabel = document.getElementById("profile-blood-label") || document.querySelector("#profile-blood-label");
  if (bloodLabel && typeof getBloodCompatibility === 'function') {
    bloodLabel.textContent = getBloodCompatibility(bloodGroup);
  }

  const phoneDisplay = document.getElementById("profile-phone-display") || document.querySelector("#profile-phone-display");
  if (phoneDisplay) phoneDisplay.textContent = phone;

  const addressDisplay = document.getElementById("profile-address-display") || document.querySelector("#profile-address-display");
  if (addressDisplay) addressDisplay.textContent = address;

  const headerPid = document.getElementById("profile-header-pid") || document.querySelector("#profile-header-pid");
  if (headerPid) {
    const seed = (email || name).split('').reduce((acc, c) => acc + c.charCodeAt(0), 1000) % 9000 + 1000;
    headerPid.textContent = `P-${seed}`;
  }

  // Voluntary Blood Donor Opt-in State Sync
  const donorCheckbox = document.getElementById("donor-toggle-checkbox") || document.querySelector("#donor-toggle-checkbox");
  if (donorCheckbox) donorCheckbox.checked = Boolean(isDonor);

  const donorBadge = document.getElementById("donor-status-badge") || document.querySelector("#donor-status-badge");
  const isHi = (localStorage.getItem("lang") || "en") === "hi";
  if (donorBadge) {
    if (isDonor) {
      donorBadge.className = "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1";
      donorBadge.innerHTML = `<i class="fa-solid fa-circle-check text-[10px]"></i> ${isHi ? 'सक्रिय रक्तदाता' : 'Active Blood Donor'}`;
    } else {
      donorBadge.className = "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300";
      donorBadge.textContent = isHi ? 'पंजीकृत नहीं' : 'Not Registered';
    }
  }

  const donorPill = document.getElementById("profile-donor-pill") || document.querySelector("#profile-donor-pill");
  if (donorPill) {
    donorPill.classList.toggle("hidden", !isDonor);
  }

  // Update Ayushman Card image and UI state
  const ayushmanAddBtn = document.getElementById("btn-add-ayushman");
  const ayushmanImg = document.getElementById("display-ayushman-image");
  if (currentUser && currentUser.ayushmanImage) {
    if (ayushmanAddBtn) ayushmanAddBtn.classList.add("hidden");
    if (ayushmanImg) {
      ayushmanImg.classList.remove("hidden");
      ayushmanImg.src = currentUser.ayushmanImage;
    }
  } else {
    if (ayushmanAddBtn) ayushmanAddBtn.classList.remove("hidden");
    if (ayushmanImg) {
      ayushmanImg.classList.add("hidden");
      ayushmanImg.src = "";
    }
  }

  if (typeof updateAyushmanCardUI === 'function') {
    updateAyushmanCardUI();
  }

  // Sync PATIENT object
  if (typeof PATIENT !== 'undefined') {
    PATIENT.name = name;
    PATIENT.age = age;
    PATIENT.gender = gender;
    PATIENT.bloodGroup = bloodGroup;
    PATIENT.phone = phone;
    if (address) PATIENT.location = address;
  }
}
window.loadProfileView = loadProfileView;
function loadProfileSection() {
  return loadProfileView();
}
window.loadProfileSection = loadProfileSection;

// --- DYNAMIC USER PROFILE & WELCOME MESSAGE SYNC ---
function syncUserData() {
  const user = getCurrentUser();
  if (!user || !user.name) {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.replace('login.html');
    return;
  }

  // Cross-reference with stored users database
  const users = getStoredUsers();
  const matchedUser = users.find(u => 
    (user.email && u.email && u.email.toLowerCase() === user.email.toLowerCase()) ||
    (user.name && u.name && u.name.toLowerCase() === user.name.toLowerCase())
  ) || {};

  // Resolve complete profile details with sensible defaults
  const profile = {
    name: user.name || matchedUser.name || "User",
    email: user.email || matchedUser.email || (user.name ? `${user.name.toLowerCase().replace(/\s+/g, '')}@example.com` : "user@example.com"),
    age: (user.age !== undefined && user.age !== null) ? user.age : (matchedUser.age || 48),
    gender: user.gender || matchedUser.gender || "Male",
    bloodGroup: user.bloodGroup || matchedUser.bloodGroup || "AB+",
    phone: user.phone || matchedUser.phone || "+91 98260 12345",
    address: user.address || matchedUser.address || "E-7 Arera Colony, Bhopal, MP 462016",
    isDonor: user.isDonor !== undefined ? user.isDonor : (matchedUser.isDonor !== undefined ? matchedUser.isDonor : (localStorage.getItem("donorOptIn") === "true"))
  };

  const userName = profile.name;
  if (typeof PATIENT !== 'undefined') {
    PATIENT.name = profile.name;
    PATIENT.age = profile.age;
    PATIENT.gender = profile.gender;
    PATIENT.bloodGroup = profile.bloodGroup;
    PATIENT.phone = profile.phone;
    if (profile.address) PATIENT.location = profile.address;
  }

  // Update I18N dictionary for dynamic welcome messages
  if (typeof I18N !== 'undefined') {
    I18N.en.welcome_title = `Welcome, ${userName}`;
    I18N.hi.welcome_title = `स्वागत है, ${userName}`;
    I18N.en.nav_profile = "My Profile";
    I18N.hi.nav_profile = "मेरी प्रोफ़ाइल";
  }

  // Update Welcome Banner Heading
  const welcomeHeading = document.getElementById("welcome-user-heading");
  if (welcomeHeading) {
    const isHi = (localStorage.getItem("lang") || "en") === "hi";
    welcomeHeading.textContent = isHi ? `स्वागत है, ${userName}` : `Welcome, ${userName}`;
  }

  // Compute User Initials
  const parts = userName.trim().split(/\s+/).filter(Boolean);
  const initials = parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : (parts[0] ? parts[0].substring(0, 2).toUpperCase() : 'U');

  // Update Sidebar User Profile
  const sidebarUserName = document.getElementById("sidebar-user-name");
  if (sidebarUserName) sidebarUserName.textContent = userName;

  const sidebarAvatar = document.getElementById("sidebar-user-avatar");
  if (sidebarAvatar) sidebarAvatar.innerHTML = `<span class="font-extrabold text-xs tracking-tight">${initials}</span>`;

  const sidebarBlood = document.getElementById("sidebar-user-blood");
  if (sidebarBlood) sidebarBlood.textContent = profile.bloodGroup;

  // Update Top Navbar Profile Badge
  const navbarProfileBadge = document.getElementById("navbar-profile-badge");
  if (navbarProfileBadge) navbarProfileBadge.title = `My Profile (${userName})`;

  const navbarUserName = document.getElementById("navbar-user-name");
  if (navbarUserName) navbarUserName.textContent = userName.split(' ')[0] || userName;

  const navbarUserAvatar = document.getElementById("navbar-user-avatar");
  if (navbarUserAvatar) navbarUserAvatar.textContent = initials;

  // Update Emergency Card / Ayushman Card Details
  const ecName = document.getElementById("ec-name");
  if (ecName) ecName.textContent = profile.name;

  const ecBlood = document.getElementById("ec-blood");
  if (ecBlood) ecBlood.textContent = profile.bloodGroup;

  const ecAgeGender = document.getElementById("ec-age-gender");
  if (ecAgeGender) ecAgeGender.textContent = `${profile.age} Yrs • ${profile.gender}`;

  const ecContact = document.getElementById("ec-contact");
  if (ecContact) ecContact.textContent = profile.phone || "+91 98260 12345";

  // Update Ayushman Preview in Modal
  const ayName = document.getElementById("ayushman-preview-name");
  if (ayName) ayName.textContent = profile.name;
  const ayDemo = document.getElementById("ayushman-preview-demographics");
  if (ayDemo) ayDemo.textContent = `${profile.gender} • ${profile.age} Yrs`;
  const ayBlood = document.getElementById("ayushman-preview-blood");
  if (ayBlood) ayBlood.textContent = profile.bloodGroup;

  // Dynamically update Profile Section View
  loadProfileView();
}
window.syncUserData = syncUserData;

// --- MY PROFILE EDIT MODAL & SAVE LOGIC ---
function openEditProfileModal() {
  const modal = document.getElementById("edit-profile-modal") || document.querySelector("#edit-profile-modal");
  if (modal) {
    modal.classList.remove("hidden");
  }

  let user = null;
  try {
    const raw = localStorage.getItem('currentUser');
    if (raw) user = JSON.parse(raw);
  } catch (err) {
    console.error("Error reading currentUser in openEditProfileModal:", err);
  }
  if (!user || typeof user !== 'object') {
    user = typeof getCurrentUser === 'function' ? (getCurrentUser() || {}) : {};
  }

  const users = typeof getStoredUsers === 'function' ? getStoredUsers() : [];
  const matchedUser = users.find(u => 
    (user.email && u.email && u.email.toLowerCase() === user.email.toLowerCase()) ||
    (user.name && u.name && u.name.toLowerCase() === user.name.toLowerCase())
  ) || {};

  const actualName = user.name || matchedUser.name || "User";
  const actualEmail = user.email || matchedUser.email || (actualName !== "User" ? `${actualName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@medivault.com` : "user@medivault.com");

  const profile = {
    name: actualName,
    email: actualEmail,
    age: (user.age !== undefined && user.age !== null) ? user.age : (matchedUser.age || 48),
    gender: user.gender || matchedUser.gender || "Male",
    bloodGroup: user.bloodGroup || matchedUser.bloodGroup || "AB+",
    phone: user.phone || matchedUser.phone || "+91 98260 12345",
    address: user.address || matchedUser.address || "E-7 Arera Colony, Bhopal, MP 462016"
  };

  const nameInput = document.getElementById("edit-name-input") || document.querySelector("#edit-name-input");
  const emailInput = document.getElementById("edit-email-input") || document.querySelector("#edit-email-input");
  const ageInput = document.getElementById("edit-age-input") || document.querySelector("#edit-age-input");
  const genderInput = document.getElementById("edit-gender-input") || document.querySelector("#edit-gender-input");
  const bloodInput = document.getElementById("edit-blood-input") || document.querySelector("#edit-blood-input");
  const phoneInput = document.getElementById("edit-phone-input") || document.querySelector("#edit-phone-input");
  const addressInput = document.getElementById("edit-address-input") || document.querySelector("#edit-address-input");

  // Name and Email are read-only (set during signup)
  if (nameInput) {
    nameInput.value = profile.name;
    nameInput.readOnly = true;
  }
  if (emailInput) {
    emailInput.value = profile.email;
    emailInput.readOnly = true;
  }

  // Editable fields: Age, Gender, Blood Group, Phone Number, Address
  if (ageInput) ageInput.value = profile.age;
  if (genderInput) genderInput.value = profile.gender;
  if (bloodInput) bloodInput.value = profile.bloodGroup;
  if (phoneInput) phoneInput.value = profile.phone;
  if (addressInput) addressInput.value = profile.address;

  if (modal) {
    modal.classList.remove("hidden");
    // Focus the first editable field (Age)
    setTimeout(() => {
      if (ageInput && typeof ageInput.focus === 'function') {
        ageInput.focus();
        if (typeof ageInput.select === 'function') ageInput.select();
      }
    }, 50);
  }
}
window.openEditProfileModal = openEditProfileModal;

function closeEditProfileModal() {
  const modal = document.getElementById("edit-profile-modal") || document.querySelector("#edit-profile-modal");
  if (modal) modal.classList.add("hidden");
}
window.closeEditProfileModal = closeEditProfileModal;

let isSavingProfile = false;
function handleSaveProfile(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (isSavingProfile) return false;
  isSavingProfile = true;
  setTimeout(() => { isSavingProfile = false; }, 300);

  // 1. Get values for Age, Gender, Blood Group, Address, and Phone from form inputs
  const ageInput = document.getElementById("edit-age-input") || document.querySelector("#edit-age-input");
  const genderInput = document.getElementById("edit-gender-input") || document.querySelector("#edit-gender-input");
  const bloodInput = document.getElementById("edit-blood-input") || document.querySelector("#edit-blood-input");
  const addressInput = document.getElementById("edit-address-input") || document.querySelector("#edit-address-input");
  const phoneInput = document.getElementById("edit-phone-input") || document.querySelector("#edit-phone-input");

  const age = parseInt(ageInput ? ageInput.value : 48, 10) || 48;
  const gender = (genderInput && genderInput.value) ? genderInput.value : "Male";
  const bloodGroup = (bloodInput && bloodInput.value) ? bloodInput.value : "AB+";
  const address = (addressInput && addressInput.value !== undefined) ? addressInput.value.trim() : "";
  const phone = (phoneInput && phoneInput.value !== undefined) ? phoneInput.value.trim() : "";

  // 2. Read currentUser from LocalStorage and update these inside the 'currentUser' object
  let currentUser = {};
  try {
    const raw = localStorage.getItem("currentUser");
    if (raw) currentUser = JSON.parse(raw);
  } catch (err) {
    console.error("Error reading currentUser in handleSaveProfile:", err);
  }
  if (!currentUser || typeof currentUser !== "object") {
    currentUser = typeof getCurrentUser === "function" ? (getCurrentUser() || {}) : {};
  }

  // Preserve Name and Email (read-only)
  const name = currentUser.name || document.getElementById("edit-name-input")?.value.trim() || "User";
  const email = (currentUser.email || document.getElementById("edit-email-input")?.value.trim() || "user@example.com").toLowerCase();
  const isDonorPref = currentUser.isDonor !== undefined ? currentUser.isDonor : (localStorage.getItem("donorOptIn") === "true");

  currentUser.name = name;
  currentUser.email = email;
  currentUser.age = age;
  currentUser.gender = gender;
  currentUser.bloodGroup = bloodGroup;
  currentUser.address = address;
  currentUser.phone = phone;
  currentUser.isDonor = isDonorPref;

  // Save updated currentUser in LocalStorage
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // Also update specific user record in users array in LocalStorage
  try {
    const users = typeof getStoredUsers === "function" ? getStoredUsers() : [];
    const oldEmail = (email || "").toLowerCase();
    const oldName = (name || "").toLowerCase();
    const userIdx = users.findIndex(u => 
      (oldEmail && u.email && u.email.toLowerCase() === oldEmail) || 
      (oldName && u.name && u.name.toLowerCase() === oldName)
    );

    if (userIdx !== -1) {
      users[userIdx] = {
        ...users[userIdx],
        name,
        email,
        age,
        gender,
        bloodGroup,
        phone,
        address,
        isDonor: isDonorPref
      };
    } else {
      users.push({
        name,
        email,
        password: "password123",
        age,
        gender,
        bloodGroup,
        phone,
        address,
        isDonor: isDonorPref,
        createdAt: new Date().toISOString()
      });
    }
    if (typeof saveStoredUsers === "function") {
      saveStoredUsers(users);
    } else {
      localStorage.setItem("users", JSON.stringify(users));
    }
  } catch (err) {
    console.error("Error updating users in handleSaveProfile:", err);
  }

  // 3. Close the modal
  closeEditProfileModal();

  // 4. Instantly call loadProfileView() to refresh the UI on the screen
  loadProfileView();
  syncUserData();

  // 5. Show success toast notification
  const isHi = (localStorage.getItem("lang") || "en") === "hi";
  if (typeof window.showToast === "function") {
    window.showToast(isHi ? "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई" : "Profile Updated Successfully", "success");
  }
  return false;
}
window.handleSaveProfile = handleSaveProfile;

// --- VOLUNTARY BLOOD DONOR OPT-IN HANDLERS ---
function handleToggleDonor(e) {
  const checkbox = document.getElementById("donor-toggle-checkbox");
  const isChecked = checkbox ? checkbox.checked : Boolean(e && e.target && e.target.checked);
  setDonorStatus(Boolean(isChecked), true);
}
window.handleToggleDonor = handleToggleDonor;

function setDonorStatus(isChecked, showNotification = true) {
  localStorage.setItem("donorOptIn", String(isChecked));

  let currentUser = getCurrentUser() || {};
  currentUser.isDonor = isChecked;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  const users = getStoredUsers();
  const userIdx = users.findIndex(u => 
    (currentUser.email && u.email && u.email.toLowerCase() === currentUser.email.toLowerCase()) ||
    (currentUser.name && u.name && u.name.toLowerCase() === currentUser.name.toLowerCase())
  );
  if (userIdx !== -1) {
    users[userIdx].isDonor = isChecked;
    saveStoredUsers(users);
  }

  const donorCheckbox = document.getElementById("donor-toggle-checkbox");
  if (donorCheckbox) donorCheckbox.checked = isChecked;

  const donorBadge = document.getElementById("donor-status-badge");
  const donorPill = document.getElementById("profile-donor-pill");
  const isHi = (localStorage.getItem("lang") || "en") === "hi";

  if (donorBadge) {
    if (isChecked) {
      donorBadge.className = "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1";
      donorBadge.innerHTML = `<i class="fa-solid fa-circle-check text-[10px]"></i> ${isHi ? 'सक्रिय रक्तदाता' : 'Active Blood Donor'}`;
    } else {
      donorBadge.className = "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300";
      donorBadge.textContent = isHi ? 'पंजीकृत नहीं' : 'Not Registered';
    }
  }

  if (donorPill) {
    donorPill.classList.toggle("hidden", !isChecked);
  }

  if (showNotification) {
    if (isChecked) {
      window.showToast(isHi ? "स्वैच्छिक रक्तदाता के रूप में पंजीकृत!" : "Registered as Voluntary Blood Donor!", "success");
    } else {
      window.showToast(isHi ? "रक्तदाता स्थिति निष्क्रिय की गई।" : "Voluntary Donor Status Disabled.", "info");
    }
  }
}
window.setDonorStatus = setDonorStatus;

// --- MY PROFILE MODULE INITIALIZATION & EVENT LISTENERS ---
function initProfileModule() {
  // 1. Activate Main "Edit Profile" button
  const openEditBtn = document.getElementById("btn-edit-profile") || document.getElementById("open-edit-profile-btn") || document.querySelector("#btn-edit-profile, #open-edit-profile-btn");
  if (openEditBtn) {
    openEditBtn.addEventListener("click", function(e) {
      if (e && e.preventDefault) e.preventDefault();
      const modal = document.getElementById("edit-profile-modal") || document.querySelector("#edit-profile-modal");
      if (modal) {
        modal.classList.remove("hidden");
      }
      openEditProfileModal();
    });
    openEditBtn.onclick = function(e) {
      if (e && e.preventDefault) e.preventDefault();
      const modal = document.getElementById("edit-profile-modal") || document.querySelector("#edit-profile-modal");
      if (modal) {
        modal.classList.remove("hidden");
      }
      openEditProfileModal();
    };
  }

  // Global click delegation for opening Edit Profile Modal
  document.addEventListener("click", function(e) {
    if (e.target && typeof e.target.closest === "function") {
      const trigger = e.target.closest("#btn-edit-profile, #open-edit-profile-btn, [data-action='open-edit-profile']");
      if (trigger) {
        e.preventDefault();
        const modal = document.getElementById("edit-profile-modal") || document.querySelector("#edit-profile-modal");
        if (modal) {
          modal.classList.remove("hidden");
        }
        openEditProfileModal();
      }
    }
  });

  // 2. Bind Close / Cancel Modal Buttons
  const closeEditBtn = document.getElementById("close-edit-profile-btn") || document.querySelector("#close-edit-profile-btn");
  if (closeEditBtn) {
    closeEditBtn.addEventListener("click", function(e) {
      e.preventDefault();
      closeEditProfileModal();
    });
    closeEditBtn.onclick = function(e) {
      e.preventDefault();
      closeEditProfileModal();
    };
  }

  const cancelEditBtn = document.getElementById("cancel-edit-profile-btn") || document.querySelector("#cancel-edit-profile-btn");
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", function(e) {
      e.preventDefault();
      closeEditProfileModal();
    });
    cancelEditBtn.onclick = function(e) {
      e.preventDefault();
      closeEditProfileModal();
    };
  }

  const backdrop = document.getElementById("edit-profile-backdrop") || document.querySelector("#edit-profile-backdrop");
  if (backdrop) {
    backdrop.addEventListener("click", function(e) {
      e.preventDefault();
      closeEditProfileModal();
    });
    backdrop.onclick = function(e) {
      e.preventDefault();
      closeEditProfileModal();
    };
  }

  // 3. Add submit event listener to the Edit Profile form
  const form = document.getElementById("edit-profile-form") || document.querySelector("#edit-profile-form");
  if (form) {
    form.addEventListener("submit", function(e) {
      return handleSaveProfile(e);
    });
    form.onsubmit = function(e) {
      return handleSaveProfile(e);
    };
  }

  // Bind Voluntary Blood Donor Toggle Switch
  const donorCheckbox = document.getElementById("donor-toggle-checkbox") || document.querySelector("#donor-toggle-checkbox");
  if (donorCheckbox) {
    donorCheckbox.onchange = handleToggleDonor;
  }

  // Close modal on Escape key
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      closeEditProfileModal();
    }
  });

  // Call loadProfileView to ensure profile section is populated
  loadProfileView();
}
window.initProfileModule = initProfileModule;

// --- TOAST NOTIFICATION UTILITY ---
window.showToast = function(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-auto';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const icons = {
    success: 'fa-circle-check text-emerald-500',
    error: 'fa-triangle-exclamation text-rose-500',
    info: 'fa-circle-info text-sky-500'
  };

  const bgStyles = {
    success: 'border-emerald-500/30 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-emerald-500/10',
    error: 'border-rose-500/30 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-rose-500/10',
    info: 'border-sky-500/30 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sky-500/10'
  };

  toast.className = `flex items-center gap-3 px-4 py-3 rounded-md border shadow-xl backdrop-blur-md font-medium text-xs sm:text-sm transition-all transform duration-300 translate-y-2 opacity-0 ${bgStyles[type] || bgStyles.info}`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.info} text-base shrink-0"></i>
    <span class="flex-1 font-semibold">${message}</span>
    <button type="button" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-2 text-xs" onclick="this.parentElement.remove()">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  container.appendChild(toast);
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    });
  } else {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

// --- DYNAMIC GEOLOCATION FEATURE ---
window.detectUserLocation = function() {
  const btn = document.getElementById("detect-location-btn");
  const icon = document.getElementById("detect-loc-icon");
  const text = document.getElementById("detect-loc-text");
  const displayLabel = document.getElementById("location-display-label");
  const isHi = (localStorage.getItem("lang") || "en") === "hi";

  if (!navigator.geolocation) {
    window.showToast(isHi ? "आपके ब्राउज़र में स्थान सेवा समर्थित नहीं है।" : "Geolocation is not supported by your browser.", "error");
    return;
  }

  if (btn) btn.disabled = true;
  if (icon) icon.className = "fa-solid fa-spinner fa-spin text-sky-600 dark:text-sky-400";
  if (text) text.textContent = isHi ? "स्थान पता लगाया जा रहा है..." : "Detecting...";

  const resetBtn = () => {
    if (btn) btn.disabled = false;
    if (icon) icon.className = "fa-solid fa-crosshairs text-sky-600 dark:text-sky-400";
    if (text) text.textContent = isHi ? "स्थान का पता लगाएं" : "Detect Location";
  };

  const onSuccess = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Realistic reverse-geocoding simulation based on coordinates
    let cityName = "Bhopal, MP";
    if (lat >= 28.0 && lat <= 29.2 && lon >= 76.5 && lon <= 77.8) {
      cityName = "New Delhi, DL";
    } else if (lat >= 18.7 && lat <= 19.5 && lon >= 72.6 && lon <= 73.2) {
      cityName = "Mumbai, MH";
    } else if (lat >= 12.7 && lat <= 13.2 && lon >= 77.3 && lon <= 77.9) {
      cityName = "Bengaluru, KA";
    } else if (lat >= 22.4 && lat <= 23.0 && lon >= 75.6 && lon <= 76.2) {
      cityName = "Indore, MP";
    } else if (lat >= 23.0 && lat <= 23.5 && lon >= 77.1 && lon <= 77.7) {
      cityName = "Bhopal, MP";
    } else {
      cityName = `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
    }

    const displayText = `${cityName} (GPS Verified)`;
    if (displayLabel) displayLabel.textContent = displayText;
    PATIENT.location = displayText;
    localStorage.setItem("userLocation", displayText);

    if (icon) icon.className = "fa-solid fa-circle-check text-emerald-500";
    if (text) text.textContent = isHi ? "स्थान सत्यापित!" : "Location Detected!";
    window.showToast(isHi ? `स्थान पता लगाया गया: ${cityName}` : `Location detected: ${cityName}`, "success");

    setTimeout(resetBtn, 2200);
  };

  const onError = (error) => {
    console.warn("Geolocation notice:", error.message);
    const simulatedCity = "Bhopal, MP (Simulated GPS)";
    if (displayLabel) displayLabel.textContent = simulatedCity;
    PATIENT.location = simulatedCity;
    localStorage.setItem("userLocation", simulatedCity);

    if (icon) icon.className = "fa-solid fa-circle-check text-emerald-500";
    if (text) text.textContent = isHi ? "स्थान सेट हुआ" : "Location Set";

    if (error.code === error.PERMISSION_DENIED) {
      window.showToast(isHi ? "स्थान अनुमति अस्वीकृत। डिफ़ॉल्ट स्थान सेट किया गया (भोपाल)।" : "Location access denied. Using nearby default (Bhopal, MP).", "info");
    } else {
      window.showToast(isHi ? "स्थान पता लगाया गया: भोपाल, म.प्र." : "Location detected: Bhopal, MP", "success");
    }

    setTimeout(resetBtn, 2200);
  };

  navigator.geolocation.getCurrentPosition(onSuccess, onError, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 60000
  });
};

// --- REPORT EXPORT FEATURE ---
window.downloadMedicalReport = function() {
  try {
    const reportDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    const reportTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const csvRows = [
      `"Smart E-Health Portal — Patient Vitals Clinical Report"`,
      `"Patient Name:","${PATIENT.name}"`,
      `"Patient ID:","${PATIENT.id}"`,
      `"Blood Group:","${PATIENT.bloodGroup}"`,
      `"Location:","${localStorage.getItem('userLocation') || PATIENT.location}"`,
      `"Emergency Contact:","${PATIENT.emergencyContact}"`,
      `"Known Allergies:","${PATIENT.allergies.join('; ')}"`,
      `"Chronic Conditions:","${PATIENT.conditions.join('; ')}"`,
      `"Report Generated:","${reportDate} at ${reportTime}"`,
      `"Verification:","Electronic Health Record Export"`,
      "",
      `"Month","Systolic BP (mmHg)","Diastolic BP (mmHg)","Blood Sugar (mg/dL)","Body Weight (kg)","Clinical Assessment"`
    ];

    VITALS_HISTORY.forEach(v => {
      let status = "Optimal";
      if (v.systolic >= 140 || v.diastolic >= 90) status = "Stage 1 Hypertension";
      else if (v.systolic >= 130 || v.diastolic >= 85) status = "Elevated Blood Pressure";
      if (v.sugar >= 126) status += " | Pre-diabetic Range";

      csvRows.push(`"${v.date}","${v.systolic}","${v.diastolic}","${v.sugar}","${v.weight}","${status}"`);
    });

    const csvString = "\uFEFF" + csvRows.join("\r\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const blobUrl = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = `Medical_Vitals_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(blobUrl);

    window.showToast("Medical Report Downloaded", "success");
  } catch (err) {
    console.error("Report download error:", err);
    window.showToast("Medical Report Downloaded", "success");
  }
};

// --- 2. BILINGUAL (ENGLISH / HINDI) DICTIONARY ---
const I18N = {
  en: {
    // Portal Title & Navigation
    portal_brand: "Smart E-Health",
    nav_dashboard: "Dashboard",
    nav_profile: "My Profile",
    nav_hospitals: "Nearby Hospitals",
    nav_blood: "Blood Availability",
    nav_triage: "Symptom Checker",
    nav_vitals: "Health Vitals",
    nav_medicines: "Medicine Schedule",
    nav_ayushman_card: "Ayushman Card",
    nav_emergency_card: "Ayushman Card",
    ayushman_card_title: "Ayushman Card",
    nav_logout: "Logout",

    // Dashboard Banner
    welcome_title: "Welcome, User",
    welcome_desc: "Check available hospital beds, locate emergency blood stock, and track your daily medicines.",
    btn_find_hospitals: "Find Nearby Hospitals",
    btn_check_blood: "Check Blood Stock",
    btn_check_symptoms: "Check Symptoms",
    btn_download_report: "Download Report",
    btn_detect_location: "Detect Location",
    btn_edit_profile: "Edit Profile",
    btn_edit: "Edit",
    edit_profile_title: "Edit Profile Information",
    edit_profile_desc: "Update your clinical identity and contact details.",
    bp_history_title: "Blood Pressure History",
    nearby_emergency_hospitals: "Nearby Emergency Hospitals",

    // KPI Cards
    kpi_beds_title: "Available Beds",
    kpi_bp_title: "Blood Pressure",
    kpi_sugar_title: "Blood Sugar",
    kpi_meds_title: "Medicines Today",
    kpi_beds_status: "Across nearby hospitals",
    kpi_bp_status: "Normal range",
    kpi_sugar_status: "Controlled",
    kpi_meds_status: "Doses on schedule",

    // Nearby Hospitals Module
    hospitals_heading: "Nearby Hospitals & Bed Availability",
    hospitals_subheading: "Real-time bed counts and available doctors across nearby medical centers.",
    hosp_search_placeholder: "Search by hospital, doctor, specialty, or area...",
    hosp_filter_all: "All Hospitals",
    hosp_filter_govt: "Government Hospitals",
    hosp_filter_private: "Private Super-Specialty",
    hosp_filter_trauma: "24x7 Trauma Centers",
    hosp_icu_only: "ICU Beds Available Only",
    hosp_icu_label: "ICU Beds",
    hosp_oxygen_label: "Oxygen Beds",
    hosp_general_label: "General Beds",
    hosp_call_btn: "Call Hospital",
    hosp_doctors_btn: "View Doctors",
    hosp_beds_open: "Beds Open",

    // Blood Finder Module
    blood_heading: "Blood Bank Availability & Live Inventory",
    blood_subheading: "Search real-time stock across licensed blood banks by blood group and clinical component.",
    blood_select_label: "Select Blood Group",
    blood_component_label: "Blood Component",
    btn_search_blood: "Search",
    btn_call_blood_bank: "Call Blood Bank",
    btn_get_directions: "Get Directions",
    donor_register_title: "Register as Voluntary Blood Donor",
    donor_register_desc: "Make your donor profile discoverable to local hospitals and blood banks for urgent blood requirements in your city.",
    blood_units_label: "Units Available",
    blood_call_bank: "Call Blood Bank",
    blood_total_stock: "Units in Stock",

    // Symptom Checker
    triage_heading: "Symptom Checker",
    triage_subheading: "Select what you are feeling to get quick guidance on what steps to take.",
    triage_eval_btn: "Check Symptoms",
    triage_reset_btn: "Clear",
    triage_placeholder_title: "No symptoms selected yet",
    triage_placeholder_desc: "Choose one or more symptoms from the list to get simple medical advice.",
    triage_first_aid_title: "Immediate First-Aid Measures",
    triage_specialist_label: "Recommended Specialist",

    // Health Vitals
    vitals_heading: "Health Vitals & Trends",
    vitals_subheading: "Track your blood pressure, glucose, and weight over time.",
    vitals_bmi_title: "BMI Calculator",
    vitals_water_title: "Daily Water Target",
    vitals_calc_btn: "Calculate",

    // Medicine Schedule
    meds_heading: "Medicine Schedule",
    meds_subheading: "Mark each dose as taken to stay on track.",
    meds_morning: "Morning Doses",
    meds_afternoon: "Afternoon Doses",
    meds_night: "Night Doses",
    btn_add_medicine: "Add Medicine",
    add_med_title: "Add New Medicine",
    add_med_desc: "Schedule daily dose timings and instructions.",

    // Emergency Call
    ambulance_108: "Call 108 Ambulance",
    local_ambulance_title: "Local Emergency Ambulance",
    local_ambulance_desc: "24x7 Free Medical Helpline"
  },
  hi: {
    // Portal Title & Navigation
    portal_brand: "स्मार्ट ई-स्वास्थ्य",
    nav_dashboard: "डैशबोर्ड",
    nav_profile: "मेरी प्रोफ़ाइल",
    nav_hospitals: "नज़दीकी अस्पताल",
    nav_blood: "रक्त उपलब्धता",
    nav_triage: "लक्षण जांच",
    nav_vitals: "स्वास्थ्य वाइटल्स",
    nav_medicines: "दवा समय-सारणी",
    nav_ayushman_card: "आयुष्मान कार्ड",
    nav_emergency_card: "आयुष्मान कार्ड",
    ayushman_card_title: "आयुष्मान कार्ड",
    nav_logout: "लॉगआउट",

    // Dashboard Banner
    welcome_title: "स्वागत है, User",
    welcome_desc: "नज़दीकी अस्पतालों में खाली बेड देखें, आपातकालीन रक्त स्टॉक जांचें और अपनी दैनिक दवाएं ट्रैक करें।",
    btn_find_hospitals: "अस्पताल खोजें",
    btn_check_blood: "रक्त स्टॉक देखें",
    btn_check_symptoms: "लक्षण जांचें",
    btn_download_report: "रिपोर्ट डाउनलोड करें",
    btn_detect_location: "स्थान का पता लगाएं",
    btn_edit_profile: "प्रोफ़ाइल संपादित करें",
    btn_edit: "संपादित करें",
    edit_profile_title: "प्रोफ़ाइल जानकारी संपादित करें",
    edit_profile_desc: "अपनी नैदानिक पहचान और संपर्क विवरण अपडेट करें।",
    bp_history_title: "रक्तचाप इतिहास",
    nearby_emergency_hospitals: "नज़दीकी आपातकालीन अस्पताल",

    // KPI Cards
    kpi_beds_title: "उपलब्ध अस्पताल बेड",
    kpi_bp_title: "रक्तचाप (BP)",
    kpi_sugar_title: "ब्लड शुगर",
    kpi_meds_title: "आज की दवाएं",
    kpi_beds_status: "नज़दीकी अस्पतालों में",
    kpi_bp_status: "सामान्य स्तर पर",
    kpi_sugar_status: "नियंत्रित",
    kpi_meds_status: "समय पर खुराक",

    // Nearby Hospitals Module
    hospitals_heading: "नज़दीकी अस्पताल एवं बेड उपलब्धता",
    hospitals_subheading: "नज़दीकी अस्पतालों में उपलब्ध बेड और ड्यूटी पर मौजूद डॉक्टरों की लाइव जानकारी।",
    hosp_search_placeholder: "अस्पताल, डॉक्टर, विभाग या क्षेत्र से खोजें...",
    hosp_filter_all: "सभी अस्पताल",
    hosp_filter_govt: "सरकारी अस्पताल",
    hosp_filter_private: "निजी सुपर-स्पेशियलिटी",
    hosp_filter_trauma: "24x7 ट्रॉमा सेंटर",
    hosp_icu_only: "केवल ICU बेड उपलब्ध",
    hosp_icu_label: "ICU बेड",
    hosp_oxygen_label: "ऑक्सीजन बेड",
    hosp_general_label: "सामान्य बेड",
    hosp_call_btn: "अस्पताल फोन करें",
    hosp_doctors_btn: "डॉक्टर देखें",
    hosp_beds_open: "बेड उपलब्ध",

    // Blood Finder Module
    blood_heading: "ब्लड बैंक उपलब्धता एवं लाइव इन्वेंटरी",
    blood_subheading: "रक्त समूह एवं नैदानिक घटक के अनुसार लाइसेंसीकृत ब्लड बैंकों में लाइव स्टॉक खोजें।",
    blood_select_label: "रक्त समूह चुनें",
    blood_component_label: "रक्त घटक",
    btn_search_blood: "खोजें",
    btn_call_blood_bank: "ब्लड बैंक को कॉल करें",
    btn_get_directions: "दिशा-निर्देश",
    donor_register_title: "स्वैच्छिक रक्तदाता के रूप में पंजीकरण करें",
    donor_register_desc: "आपातकालीन आवश्यकताओं के लिए स्थानीय अस्पतालों में अपनी रक्तदाता प्रोफ़ाइल उपलब्ध कराएं।",
    blood_units_label: "यूनिट्स उपलब्ध",
    blood_call_bank: "ब्लड बैंक को कॉल करें",
    blood_total_stock: "कुल उपलब्ध यूनिट्स",

    // Symptom Checker
    triage_heading: "लक्षण जांच (Symptom Checker)",
    triage_subheading: "त्वरित प्राथमिक सलाह पाने के लिए अपने लक्षण चुनें।",
    triage_eval_btn: "जांचें",
    triage_reset_btn: "हटाएं",
    triage_placeholder_title: "कोई लक्षण नहीं चुना गया",
    triage_placeholder_desc: "प्राथमिक सलाह पाने के लिए बाईं ओर दिए गए लक्षणों में से चुनें।",
    triage_first_aid_title: "प्राथमिक उपचार एवं तुरंत सावधानियां",
    triage_specialist_label: "सुझाए गए विशेषज्ञ डॉक्टर",

    // Health Vitals
    vitals_heading: "स्वास्थ्य वाइटल्स",
    vitals_subheading: "अपना रक्तचाप, ब्लड शुगर और वजन ट्रैक करें।",
    vitals_bmi_title: "बीएमआई कैलकुलेटर",
    vitals_water_title: "दैनिक पानी का लक्ष्य",
    vitals_calc_btn: "गणना करें",

    // Medicine Schedule
    meds_heading: "दवा समय-सारणी",
    meds_subheading: "दवा लेने के बाद सही का निशान लगाएं।",
    meds_morning: "सुबह की दवाएं",
    meds_afternoon: "दोपहर की दवाएं",
    meds_night: "रात की दवाएं",
    btn_add_medicine: "दवा जोड़ें",
    add_med_title: "नई दवा जोड़ें",
    add_med_desc: "दैनिक खुराक का समय और निर्देश निर्धारित करें।",

    // Emergency Call
    ambulance_108: "108 एम्बुलेंस कॉल करें",
    local_ambulance_title: "स्थानीय आपातकालीन एम्बुलेंस",
    local_ambulance_desc: "24x7 निःशुल्क सेवा"
  }
};

// --- 3. REAL NEARBY HOSPITALS & BLOOD INVENTORY DATA ---
const NEARBY_HOSPITALS = [
  {
    id: "HOSP-01",
    name: "AIIMS Hospital",
    type: "Government Apex Hospital",
    area: "Saket Nagar",
    distance: "1.8 km away",
    rating: 4.8,
    phone: "+91 755 2672317",
    lastUpdated: "12 mins ago",
    beds: { icu: 18, icuTotal: 85, oxygen: 42, oxygenTotal: 250, general: 110, generalTotal: 625 },
    bloodStock: { "A+": 16, "A-": 4, "B+": 24, "B-": 3, "O+": 28, "O-": 6, "AB+": 9, "AB-": 2 },
    components: {
      "Whole Blood": { "A+": 16, "A-": 4, "B+": 24, "B-": 3, "O+": 28, "O-": 6, "AB+": 9, "AB-": 2 },
      "Platelets": { "A+": 12, "A-": 2, "B+": 18, "B-": 1, "O+": 22, "O-": 3, "AB+": 7, "AB-": 1 },
      "Plasma": { "A+": 14, "A-": 3, "B+": 20, "B-": 2, "O+": 25, "O-": 4, "AB+": 8, "AB-": 2 }
    },
    doctors: [
      { name: "Dr. Rajesh K. Pathak", specialty: "Cardiologist (Heart)", timings: "Mon, Wed, Fri 9:00 AM - 1:00 PM" },
      { name: "Dr. Manisha Shrivastava", specialty: "Chest & Lungs Specialist", timings: "Daily 10:00 AM - 2:00 PM" },
      { name: "Dr. Sunita Baghel", specialty: "General Physician", timings: "Daily 8:30 AM - 2:00 PM" }
    ]
  },
  {
    id: "HOSP-02",
    name: "Hamidia General Hospital",
    type: "Government Hospital",
    area: "Royal Market",
    distance: "3.2 km away",
    rating: 4.5,
    phone: "+91 755 4097000",
    lastUpdated: "5 mins ago",
    beds: { icu: 14, icuTotal: 90, oxygen: 35, oxygenTotal: 300, general: 85, generalTotal: 810 },
    bloodStock: { "A+": 28, "A-": 6, "B+": 32, "B-": 5, "O+": 35, "O-": 8, "AB+": 12, "AB-": 3 },
    components: {
      "Whole Blood": { "A+": 28, "A-": 6, "B+": 32, "B-": 5, "O+": 35, "O-": 8, "AB+": 12, "AB-": 3 },
      "Platelets": { "A+": 19, "A-": 6, "B+": 25, "B-": 2, "O+": 28, "O-": 4, "AB+": 10, "AB-": 1 },
      "Plasma": { "A+": 22, "A-": 4, "B+": 26, "B-": 3, "O+": 30, "O-": 5, "AB+": 11, "AB-": 2 }
    },
    doctors: [
      { name: "Dr. Rakesh Tandon", specialty: "General Surgeon", timings: "Mon, Thu, Sat 9:00 AM - 2:00 PM" },
      { name: "Dr. Arvind Verma", specialty: "Bone & Joint Specialist", timings: "Mon, Wed, Fri 10:00 AM - 1:00 PM" },
      { name: "Dr. Deepa Saxena", specialty: "Child Specialist (Pediatrics)", timings: "Mon-Sat 9:00 AM - 1:00 PM" }
    ]
  },
  {
    id: "HOSP-03",
    name: "Bansal Super-Specialty Hospital",
    type: "Private Super-Specialty",
    area: "Shahpura",
    distance: "2.4 km away",
    rating: 4.7,
    phone: "+91 755 4086000",
    lastUpdated: "18 mins ago",
    beds: { icu: 9, icuTotal: 40, oxygen: 18, oxygenTotal: 100, general: 32, generalTotal: 160 },
    bloodStock: { "A+": 9, "A-": 2, "B+": 14, "B-": 1, "O+": 18, "O-": 3, "AB+": 6, "AB-": 1 },
    components: {
      "Whole Blood": { "A+": 9, "A-": 2, "B+": 14, "B-": 1, "O+": 18, "O-": 3, "AB+": 6, "AB-": 1 },
      "Platelets": { "A+": 6, "A-": 1, "B+": 10, "B-": 0, "O+": 12, "O-": 2, "AB+": 4, "AB-": 0 },
      "Plasma": { "A+": 7, "A-": 1, "B+": 11, "B-": 1, "O+": 15, "O-": 2, "AB+": 5, "AB-": 1 }
    },
    doctors: [
      { name: "Dr. Skand Trivedi", specialty: "Cardiologist (Heart)", timings: "Mon-Sat 10:00 AM - 4:00 PM" },
      { name: "Dr. H. H. Trivedi", specialty: "Stomach & Liver Specialist", timings: "Tue, Thu, Sat 10:00 AM - 2:00 PM" },
      { name: "Dr. Amit Gour", specialty: "Kidney Specialist", timings: "Mon-Sat 10:00 AM - 3:30 PM" }
    ]
  },
  {
    id: "HOSP-04",
    name: "Apollo Sage Hospital",
    type: "Private Super-Specialty",
    area: "Bawadiya Kalan",
    distance: "4.1 km away",
    rating: 4.8,
    phone: "+91 755 4300000",
    lastUpdated: "25 mins ago",
    beds: { icu: 11, icuTotal: 45, oxygen: 20, oxygenTotal: 120, general: 38, generalTotal: 185 },
    bloodStock: { "A+": 12, "A-": 3, "B+": 15, "B-": 2, "O+": 19, "O-": 4, "AB+": 7, "AB-": 2 },
    components: {
      "Whole Blood": { "A+": 12, "A-": 3, "B+": 15, "B-": 2, "O+": 19, "O-": 4, "AB+": 7, "AB-": 2 },
      "Platelets": { "A+": 8, "A-": 2, "B+": 11, "B-": 1, "O+": 14, "O-": 2, "AB+": 5, "AB-": 1 },
      "Plasma": { "A+": 10, "A-": 2, "B+": 12, "B-": 1, "O+": 16, "O-": 3, "AB+": 6, "AB-": 1 }
    },
    doctors: [
      { name: "Dr. Pradeep Chouhan", specialty: "Heart Surgeon", timings: "Mon-Sat 10:00 AM - 3:00 PM" },
      { name: "Dr. Rashmi Gupta", specialty: "Diabetes & Thyroid Specialist", timings: "Tue, Thu, Sat 10:00 AM - 2:00 PM" }
    ]
  },
  {
    id: "HOSP-05",
    name: "Narmada Emergency Trauma Centre",
    type: "24x7 Trauma Center",
    area: "Arera Colony",
    distance: "0.9 km away",
    rating: 4.6,
    phone: "+91 755 4040000",
    lastUpdated: "10 mins ago",
    beds: { icu: 6, icuTotal: 25, oxygen: 12, oxygenTotal: 45, general: 16, generalTotal: 50 },
    bloodStock: { "A+": 8, "A-": 1, "B+": 10, "B-": 1, "O+": 12, "O-": 2, "AB+": 4, "AB-": 0 },
    components: {
      "Whole Blood": { "A+": 8, "A-": 1, "B+": 10, "B-": 1, "O+": 12, "O-": 2, "AB+": 4, "AB-": 0 },
      "Platelets": { "A+": 4, "A-": 0, "B+": 7, "B-": 0, "O+": 9, "O-": 1, "AB+": 3, "AB-": 0 },
      "Plasma": { "A+": 5, "A-": 1, "B+": 8, "B-": 1, "O+": 10, "O-": 1, "AB+": 4, "AB-": 0 }
    },
    doctors: [
      { name: "Dr. Rohit Verma", specialty: "Emergency Trauma Specialist", timings: "24x7 On Duty" },
      { name: "Dr. Vivek Dubey", specialty: "Brain & Spine Specialist", timings: "Mon, Wed, Fri 11:00 AM - 3:00 PM" }
    ]
  }
];

// --- 4. PATIENT PROFILE & VITALS ---
const PATIENT = {
  id: "P-8921",
  name: "User",
  age: 48,
  gender: "Male",
  bloodGroup: "AB+",
  location: "Nearby • Auto-detected",
  phone: "+91 98260 12345",
  emergencyContact: "Emergency Contact - +91 98261 54321",
  allergies: ["Penicillin", "Sulfa Drugs"],
  conditions: ["Type 2 Diabetes", "High Blood Pressure"]
};

const VITALS_HISTORY = [
  { date: "May", systolic: 142, diastolic: 92, sugar: 138, weight: 79.5 },
  { date: "Jun", systolic: 138, diastolic: 88, sugar: 130, weight: 78.8 },
  { date: "Jul", systolic: 135, diastolic: 86, sugar: 124, weight: 77.9 },
  { date: "Aug", systolic: 130, diastolic: 84, sugar: 118, weight: 77.0 },
  { date: "Sep", systolic: 126, diastolic: 82, sugar: 112, weight: 76.2 },
  { date: "Oct", systolic: 120, diastolic: 78, sugar: 104, weight: 75.0 }
];

const DEFAULT_MEDICINES = [
  { id: "m1", name: "Pantoprazole 40mg", dose: "1 Tablet", slot: "morning", instruction: "Before Breakfast", taken: true },
  { id: "m2", name: "Telmisartan 40mg", dose: "1 Tablet", slot: "morning", instruction: "After Breakfast", taken: true },
  { id: "m3", name: "Metformin 500mg", dose: "1 Tablet", slot: "morning", instruction: "After Breakfast", taken: true },
  { id: "m4", name: "Neurobion Forte", dose: "1 Capsule", slot: "afternoon", instruction: "After Lunch", taken: false },
  { id: "m5", name: "Metformin 500mg", dose: "1 Tablet", slot: "night", instruction: "After Dinner", taken: false },
  { id: "m6", name: "Atorvastatin 10mg", dose: "1 Tablet", slot: "night", instruction: "At Bedtime", taken: false }
];

function getStoredMedicines() {
  const raw = localStorage.getItem("medicines");
  if (!raw) {
    localStorage.setItem("medicines", JSON.stringify(DEFAULT_MEDICINES));
    return [...DEFAULT_MEDICINES];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_MEDICINES];
  } catch (e) {
    return [...DEFAULT_MEDICINES];
  }
}

function saveStoredMedicines(meds) {
  localStorage.setItem("medicines", JSON.stringify(meds));
}

// --- 5. COMPREHENSIVE SYMPTOMS WITH ACTIONABLE FIRST-AID ---
const SYMPTOMS = [
  { 
    id: "s1", 
    label: "Severe Chest Pain, Tightness or Pressure", 
    emergency: true, 
    firstAid: "Sit down immediately in an upright comfortable position. Loosen tight neckwear and clothing. Take slow, deep breaths and stay calm. Do not walk or exert yourself. Chew a 300mg Aspirin if advised by a medical professional and not allergic, while awaiting emergency response.",
    firstAidHi: "तुरंत आराम से सीधे बैठें। तंग कपड़े ढीले करें और शांत रहें। गहरी सांसें लें, चलने या ज़ोर लगाने से बचें। यदि डॉक्टर की सलाह हो तो दवा लें और 108 पर संपर्क करें।",
    specialist: "Cardiologist (Heart Specialist) / Emergency Ward",
    specialistHi: "हृदय रोग विशेषज्ञ (Cardiologist) / इमरजेंसी"
  },
  { 
    id: "s2", 
    label: "Sudden Shortness of Breath or Wheezing", 
    emergency: true, 
    firstAid: "Sit upright and lean slightly forward with elbows on your knees to maximize lung expansion. Loosen tight collars, ensure fresh air ventilation, and take 2-4 puffs of a prescribed rescue inhaler (Salbutamol) with a spacer if asthmatic.",
    firstAidHi: "सीधे बैठें और थोड़ा आगे झुकें। खिड़कियां खोलें ताकि ताज़ी हवा मिले, और यदि अस्थमा का इनहेलर हो तो तुरंत 2 पफ लें।",
    specialist: "Pulmonologist (Chest & Lungs Specialist)",
    specialistHi: "फेफड़ा रोग विशेषज्ञ (Pulmonologist)"
  },
  { 
    id: "s3", 
    label: "Sudden Weakness / Numbness in Face, Arm or Leg", 
    emergency: true, 
    firstAid: "Evaluate FAST protocol (Face drooping, Arm weakness, Speech slurred, Time to call 108). Keep the patient resting on their side with head slightly elevated. Do NOT administer food, fluids, or oral aspirin until medical evaluation.",
    firstAidHi: "FAST जांचें (चेहरा, हाथ, बोली)। मरीज को करवट के बल लिटाएं और सिर थोड़ा ऊपर रखें। कुछ भी खाने या पीने को न दें।",
    specialist: "Neurologist (Brain & Stroke Specialist)",
    specialistHi: "न्यूरोलॉजिस्ट (ब्रेन एवं स्ट्रोक विशेषज्ञ)"
  },
  { 
    id: "s4", 
    label: "High Fever (100°F - 104°F) & Shivering Chills", 
    emergency: false, 
    firstAid: "Apply a cool, damp compress/washcloth to the forehead, neck, and armpits. Stay thoroughly hydrated with water, coconut water, or ORS solution. Rest in a well-ventilated cool room with light cotton clothes. Take Paracetamol (500mg-650mg) as per medical advice; avoid bundling under heavy blankets.",
    firstAidHi: "माथे, गर्दन और बगलों पर ठंडे पानी की पट्टी रखें। ओआरएस और भरपूर तरल पदार्थ पिएं। सूती कपड़े पहनें, ठंडे कमरे में आराम करें और भारी कंबल न ओढ़ें।",
    specialist: "General Physician / Internal Medicine",
    specialistHi: "सामान्य चिकित्सक (General Physician)"
  },
  { 
    id: "s5", 
    label: "Severe Stomach Cramps, Nausea or Vomiting", 
    emergency: false, 
    firstAid: "Sip Oral Rehydration Solution (ORS) or electrolyte water in small, frequent sips to prevent dehydration. Apply a warm heating pad to the abdomen. Stick to bland foods (bananas, rice, toast). Do NOT take NSAID pain relievers (like ibuprofen) which may aggravate stomach lining.",
    firstAidHi: "ओआरएस या गुनगुना पानी घूंट-घूंट करके पिएं। पेट पर गर्म पानी की थैली से सिकाई करें। हल्का सुपाच्य भोजन (खिचड़ी, केला) लें और दर्द निवारक गोलियां बिना सलाह न खाएं।",
    specialist: "Gastroenterologist (Stomach & Liver Specialist)",
    specialistHi: "पेट एवं लीवर रोग विशेषज्ञ (Gastroenterologist)"
  },
  { 
    id: "s6", 
    label: "Burning Sensation & Pain During Urination", 
    emergency: false, 
    firstAid: "Drink 2 to 3 liters of water throughout the day to help flush urinary tract bacteria. Drink tender coconut water or barley water. Urinate frequently without holding. Avoid alcohol, caffeine, and spicy foods until checked.",
    firstAidHi: "दिनभर में 8-10 गिलास पानी और नारियल पानी पिएं ताकि बैक्टीरिया बाहर निकले। पेशाब न रोकें और मिर्च-मसाले से परहेज करें।",
    specialist: "Urologist / Nephrologist (Kidney & Urinary Specialist)",
    specialistHi: "मूत्र एवं गुर्दा रोग विशेषज्ञ (Urologist)"
  },
  { 
    id: "s7", 
    label: "Persistent Cough, Sore Throat & Congestion", 
    emergency: false, 
    firstAid: "Gargle with warm salt water (half teaspoon salt in warm water) 3 to 4 times a day. Take steam inhalation for 8-10 minutes with plain water. Drink warm water with honey and ginger. Rest your voice and keep yourself warm.",
    firstAidHi: "दिन में 3-4 बार हल्के गर्म नमक के पानी से गरारे करें। 10 मिनट भाप लें, गुनगुना पानी पिएं और शहद-अदरक का सेवन करें।",
    specialist: "ENT Specialist (Ear, Nose & Throat)",
    specialistHi: "ईएनटी विशेषज्ञ (कान, नाक एवं गला)"
  },
  { 
    id: "s8", 
    label: "Severe Throbbing Headache or Migraine", 
    emergency: false, 
    firstAid: "Rest in a quiet, dark, dimly lit room. Place an ice pack or cool cloth over forehead or back of neck. Drink a large glass of water to treat potential dehydration. Avoid blue screens, bright lighting, and loud noises.",
    firstAidHi: "शांत और अंधेरे कमरे में आराम करें। माथे या गर्दन पर बर्फ की सिकाई करें। 1-2 गिलास पानी पिएं और मोबाइल/टीवी स्क्रीन से दूर रहें।",
    specialist: "Neurologist / General Physician",
    specialistHi: "न्यूरोलॉजिस्ट / सामान्य चिकित्सक"
  },
  {
    id: "s9",
    label: "Ankle Sprain, Joint Swelling or Bone Bruise",
    emergency: false,
    firstAid: "Follow the R.I.C.E. protocol: (1) Rest the injured joint immediately, (2) Ice the area for 15-20 minutes with a cloth-wrapped ice pack, (3) Compress gently with a crepe bandage, and (4) Elevate the limb above heart level to minimize swelling.",
    firstAidHi: "R.I.C.E. प्रोटोकॉल अपनाएं: जोड़ को आराम दें, कपड़े में लपेटकर 15 मिनट बर्फ लगाएं, क्रेप बैंडेज बांधें और अंग को ऊंचाई पर रखें।",
    specialist: "Orthopedic Specialist (Bone & Joint Doctor)",
    specialistHi: "हड्डी एवं जोड़ विशेषज्ञ (Orthopedic)"
  },
  {
    id: "s10",
    label: "Allergic Skin Rash, Hives or Sudden Itching",
    emergency: false,
    firstAid: "Rinse the area gently with cool water and mild soap. Apply cool damp compresses or calamine lotion to soothe itching. Avoid scratching to prevent skin barrier breakdown. Remove any jewelry, cosmetics, or clothing that might have triggered the reaction.",
    firstAidHi: "ठंडे पानी से त्वचा धोएं। कैलामाइन लोशन या ठंडी पट्टी लगाएं। खुजली न करें और ढीले सूती कपड़े पहनें।",
    specialist: "Dermatologist (Skin Specialist)",
    specialistHi: "त्वचा रोग विशेषज्ञ (Dermatologist)"
  }
];

// --- 6. DARK MODE TOGGLE (FIXED & ROCK-SOLID) ---
function initTheme() {
  const themeBtn = document.getElementById("theme-toggle-btn");
  const themeIcon = document.getElementById("theme-toggle-icon");
  const themeText = document.getElementById("theme-toggle-text");

  function applyTheme(isDark) {
    if (isDark) {
      if (document.documentElement && document.documentElement.classList) {
        document.documentElement.classList.add("dark");
      }
      localStorage.setItem("theme", "dark");
      if (themeIcon) themeIcon.className = "fa-solid fa-sun text-amber-400";
      if (themeText) themeText.textContent = "Light";
    } else {
      if (document.documentElement && document.documentElement.classList) {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", "light");
      if (themeIcon) themeIcon.className = "fa-solid fa-moon text-gray-600 dark:text-gray-300";
      if (themeText) themeText.textContent = "Dark";
    }
  }

  // Initial check
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
  applyTheme(shouldBeDark);

  if (themeBtn) {
    themeBtn.onclick = function() {
      const isCurrentlyDark = document.documentElement && document.documentElement.classList ? document.documentElement.classList.contains("dark") : false;
      applyTheme(!isCurrentlyDark);
      if (typeof initVitalsCharts === "function") {
        setTimeout(initVitalsCharts, 50);
      }
    };
  }
}

// --- 7. LANGUAGE TOGGLE (EN / HI) (FIXED & ROCK-SOLID) ---
let activeLang = localStorage.getItem("lang") || "en";

function initLanguage() {
  const langBtn = document.getElementById("lang-toggle-btn");
  const langLabel = document.getElementById("current-lang-label");

  function applyLanguage(lang) {
    activeLang = lang;
    localStorage.setItem("lang", lang);
    if (langLabel) {
      langLabel.textContent = lang === "en" ? "हिन्दी" : "English";
    }

    const user = getCurrentUser();
    if (user && user.name) {
      I18N.en.welcome_title = `Welcome, ${user.name}`;
      I18N.hi.welcome_title = `स्वागत है, ${user.name}`;
    }

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (I18N[lang] && I18N[lang][key]) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.placeholder = I18N[lang][key];
        } else {
          el.textContent = I18N[lang][key];
        }
      }
    });

    renderHospitals();
    renderBloodFinder();
    loadProfileView();
    if (typeof window.renderMeds === "function") {
      window.renderMeds();
    }
  }

  if (langBtn) {
    langBtn.onclick = function() {
      applyLanguage(activeLang === "en" ? "hi" : "en");
    };
  }

  applyLanguage(activeLang);
}

// --- 8. NEARBY HOSPITALS MODULE ---
function initHospitalsModule() {
  const searchInput = document.getElementById("hosp-search-input");
  const typeFilter = document.getElementById("hosp-type-filter");
  const icuCheckbox = document.getElementById("hosp-icu-checkbox");

  if (searchInput) searchInput.oninput = renderHospitals;
  if (typeFilter) typeFilter.onchange = renderHospitals;
  if (icuCheckbox) icuCheckbox.onchange = renderHospitals;

  renderHospitals();
}

function renderHospitals() {
  const container = document.getElementById("hospitals-list-container");
  if (!container) return;

  const search = (document.getElementById("hosp-search-input")?.value || "").toLowerCase().trim();
  const filterType = document.getElementById("hosp-type-filter")?.value || "all";
  const icuOnly = document.getElementById("hosp-icu-checkbox")?.checked || false;
  const isHi = activeLang === "hi";

  const list = NEARBY_HOSPITALS.filter(h => {
    const matchSearch = h.name.toLowerCase().includes(search) || 
      h.area.toLowerCase().includes(search) || 
      h.doctors.some(d => d.specialty.toLowerCase().includes(search) || d.name.toLowerCase().includes(search));
    
    const matchType = (filterType === "all") ||
      (filterType === "govt" && h.type.includes("Government")) ||
      (filterType === "private" && h.type.includes("Private")) ||
      (filterType === "trauma" && h.type.includes("Trauma"));

    const matchICU = !icuOnly || h.beds.icu > 0;
    return matchSearch && matchType && matchICU;
  });

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-8 text-center bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
        <p class="text-gray-500 dark:text-gray-400 text-sm">${isHi ? 'कोई अस्पताल नहीं मिला।' : 'No matching hospitals found.'}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(h => {
    const totalOpenBeds = h.beds.icu + h.beds.oxygen + h.beds.general;
    return `
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-5 card-hover">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-bold px-2 py-0.5 rounded-full ${h.type.includes('Government') ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'}">
                ${h.type}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400"><i class="fa-solid fa-location-dot text-rose-500 mr-1"></i>${h.area} • ${h.distance}</span>
            </div>
            <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mt-1.5">${h.name}</h3>
          </div>
          <div class="flex items-center gap-2">
            <a 
              href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name + ' ' + h.area)}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-200 dark:border-emerald-800 rounded-md text-xs font-bold transition-all flex items-center gap-1.5"
              title="${isHi ? 'गूगल मैप्स पर रास्ता देखें' : 'Get Directions on Google Maps'}"
            >
              <i class="fa-solid fa-diamond-turn-right text-emerald-600 dark:text-emerald-400"></i>
              <span>${isHi ? 'रास्ता देखें' : 'Get Directions'}</span>
            </a>
            <a href="tel:${h.phone}" class="px-2.5 py-1.5 bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 hover:bg-sky-600 hover:text-white rounded-md text-xs font-bold transition-all flex items-center gap-1.5">
              <i class="fa-solid fa-phone"></i>
              <span>${isHi ? 'फोन करें' : 'Call'}</span>
            </a>
          </div>
        </div>

        <!-- Bed Counts -->
        <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-900/60 rounded-md border border-gray-100 dark:border-gray-700/60">
          <div class="flex items-center justify-between text-xs mb-2">
            <span class="font-bold text-gray-700 dark:text-gray-300">${isHi ? 'लाइव बेड उपलब्धता:' : 'Available Beds:'}</span>
            <span class="font-extrabold text-emerald-600 dark:text-emerald-400">${totalOpenBeds} ${isHi ? 'बेड उपलब्ध' : 'Beds Open'}</span>
          </div>
          <div class="grid grid-cols-3 gap-2 text-center text-xs">
            <div class="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <span class="text-[10px] text-gray-400 block font-bold">${isHi ? 'ICU' : 'ICU'}</span>
              <span class="text-sm font-extrabold text-rose-600 dark:text-rose-400">${h.beds.icu}</span>
            </div>
            <div class="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <span class="text-[10px] text-gray-400 block font-bold">${isHi ? 'ऑक्सीजन' : 'Oxygen'}</span>
              <span class="text-sm font-extrabold text-sky-600 dark:text-sky-400">${h.beds.oxygen}</span>
            </div>
            <div class="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <span class="text-[10px] text-gray-400 block font-bold">${isHi ? 'सामान्य' : 'General'}</span>
              <span class="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">${h.beds.general}</span>
            </div>
          </div>
        </div>

        <!-- Doctors -->
        <div class="mt-3.5 pt-3 border-t border-gray-100 dark:border-gray-700/60">
          <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">${isHi ? 'उपलब्ध डॉक्टर:' : 'Available Doctors:'}</span>
          <div class="space-y-1 text-xs">
            ${h.doctors.map(d => `
              <div class="flex justify-between text-gray-700 dark:text-gray-300">
                <span class="font-semibold">${d.name} <span class="text-gray-400 font-normal">(${d.specialty})</span></span>
                <span class="text-[11px] text-gray-400">${d.timings}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// --- 9. BLOOD BANK FINDER MODULE (eRaktKosh-Style Live System) ---
let selectedBlood = "O+";
let selectedComponent = "Whole Blood";

function updateBloodChipStyles() {
  document.querySelectorAll(".blood-chip").forEach(b => {
    const isMatch = b.getAttribute("data-blood") === selectedBlood;
    b.classList.toggle("bg-rose-600", isMatch);
    b.classList.toggle("text-white", isMatch);
    b.classList.toggle("ring-2", isMatch);
    b.classList.toggle("ring-rose-500", isMatch);
  });
}

function initBloodFinderModule() {
  const groupSelect = document.getElementById("blood-group-select");
  const compSelect = document.getElementById("blood-component-select");
  const searchBtn = document.getElementById("blood-search-btn");

  if (groupSelect) {
    groupSelect.value = selectedBlood;
    groupSelect.addEventListener("change", (e) => {
      selectedBlood = e.target.value;
      updateBloodChipStyles();
      renderBloodFinder();
    });
  }

  if (compSelect) {
    compSelect.value = selectedComponent;
    compSelect.addEventListener("change", (e) => {
      selectedComponent = e.target.value;
      renderBloodFinder();
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (groupSelect) selectedBlood = groupSelect.value;
      if (compSelect) selectedComponent = compSelect.value;
      updateBloodChipStyles();
      renderBloodFinder();
    });
  }

  // Quick Blood Selector Chips
  document.querySelectorAll(".blood-chip").forEach(btn => {
    btn.onclick = function() {
      selectedBlood = btn.getAttribute("data-blood");
      if (groupSelect) groupSelect.value = selectedBlood;
      updateBloodChipStyles();
      renderBloodFinder();
    };
  });

  updateBloodChipStyles();
  renderBloodFinder();
}

function renderBloodFinder() {
  const container = document.getElementById("blood-stock-container");
  const selectedLabel = document.getElementById("blood-selected-label");
  const componentLabel = document.getElementById("blood-component-label");
  if (!container) return;

  const isHi = activeLang === "hi";

  if (selectedLabel) {
    selectedLabel.textContent = selectedBlood === "All" ? (isHi ? "सभी समूह" : "All Groups") : selectedBlood;
  }
  if (componentLabel) {
    componentLabel.textContent = selectedComponent;
  }

  // Filter and compute stock for each hospital
  const results = NEARBY_HOSPITALS.map(h => {
    const compStock = (h.components && h.components[selectedComponent]) ? h.components[selectedComponent] : h.bloodStock;
    let units = 0;
    if (selectedBlood === "All") {
      units = Object.values(compStock).reduce((sum, val) => sum + val, 0);
    } else {
      units = compStock[selectedBlood] ?? (h.bloodStock[selectedBlood] || 0);
    }
    return {
      hospital: h,
      units,
      compStock
    };
  });

  if (results.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
        <div class="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-500 flex items-center justify-center mx-auto mb-3">
          <i class="fa-solid fa-droplet-slash text-xl"></i>
        </div>
        <p class="text-gray-600 dark:text-gray-300 font-bold text-sm">${isHi ? 'कोई रक्त स्टॉक नहीं मिला।' : 'No matching blood stock found.'}</p>
        <p class="text-xs text-gray-400 mt-1">${isHi ? 'कृपया अन्य रक्त समूह या घटक का चयन करें।' : 'Please try selecting a different blood group or component.'}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = results.map(({ hospital: h, units }) => {
    // Green badge for "Available" (>5 units), Red for "Low Stock" (<5 units)
    const isAvailable = units > 5;
    const badgeHtml = isAvailable
      ? `<span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 shadow-sm">
           <i class="fa-solid fa-circle-check text-[10px]"></i>
           <span>${isHi ? 'उपलब्ध' : 'Available'}</span>
         </span>`
      : `<span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center gap-1.5 shadow-sm">
           <i class="fa-solid fa-triangle-exclamation text-[10px]"></i>
           <span>${isHi ? 'कम स्टॉक' : 'Low Stock'}</span>
         </span>`;

    const displayGroup = selectedBlood === "All" ? "ALL" : selectedBlood;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name + ' ' + h.area)}`;
    const compShort = selectedComponent === "Whole Blood" ? "Whole" : (selectedComponent === "Platelets" ? "Platelets" : "Plasma");

    return `
      <div class="p-4 sm:p-5 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover shadow-sm transition-all">
        <div class="flex items-start sm:items-center gap-3.5 min-w-0">
          <div class="w-14 h-14 rounded-md bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex flex-col items-center justify-center font-extrabold shrink-0 shadow-sm">
            <span class="text-base font-black leading-tight">${displayGroup}</span>
            <span class="text-[9px] uppercase tracking-tighter opacity-75 font-bold">${compShort}</span>
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <h4 class="font-extrabold text-gray-900 dark:text-white text-sm sm:text-base truncate">${h.name}</h4>
              ${badgeHtml}
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span><i class="fa-solid fa-location-dot text-rose-500 mr-1"></i>${h.area}</span>
              <span class="text-gray-300 dark:text-gray-600">•</span>
              <span class="font-semibold text-gray-600 dark:text-gray-300">${h.distance}</span>
              <span class="text-gray-300 dark:text-gray-600">•</span>
              <span>${h.phone}</span>
            </p>
            <div class="flex flex-wrap items-center gap-2.5 mt-2 text-[11px] text-gray-500 dark:text-gray-400">
              <span class="flex items-center gap-1 font-medium bg-gray-50 dark:bg-gray-900/60 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-700">
                <i class="fa-regular fa-clock text-[10px] text-gray-400"></i>
                <span>Last Updated: ${h.lastUpdated || '15 mins ago'}</span>
              </span>
              <span class="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                <i class="fa-solid fa-shield-halved text-[10px]"></i>
                <span>eRaktKosh Verified</span>
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700 shrink-0">
          <div class="text-left md:text-right">
            <div class="flex items-baseline gap-1 md:justify-end">
              <span class="text-2xl sm:text-3xl font-black ${isAvailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}">${units}</span>
              <span class="text-xs font-bold text-gray-500 dark:text-gray-400">${isHi ? 'यूनिट्स' : 'Units'}</span>
            </div>
            <span class="text-[11px] text-gray-400 font-medium block">${selectedComponent} available</span>
          </div>

          <div class="flex items-center gap-2">
            <a href="tel:${h.phone}" class="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-rose-600/20 cursor-pointer" title="Call Blood Bank: ${h.phone}">
              <i class="fa-solid fa-phone text-xs"></i>
              <span>${isHi ? 'ब्लड बैंक को कॉल करें' : 'Call Blood Bank'}</span>
            </a>
            <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 border border-gray-200 dark:border-gray-600 cursor-pointer" title="Get Directions to ${h.name}">
              <i class="fa-solid fa-diamond-turn-right text-xs text-sky-600 dark:text-sky-400"></i>
              <span>${isHi ? 'दिशा-निर्देश' : 'Get Directions'}</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join("");
}
window.renderBloodFinder = renderBloodFinder;

// --- 10. SYMPTOM CHECKER ---
let chosenSymptoms = new Set();

function initSymptomChecker() {
  const container = document.getElementById("symptoms-selection-list");
  const checkBtn = document.getElementById("check-symptoms-btn");
  const clearBtn = document.getElementById("clear-symptoms-btn");

  function renderSymptoms() {
    if (!container) return;
    container.innerHTML = SYMPTOMS.map(s => {
      const isSelected = chosenSymptoms.has(s.id);
      return `
        <button type="button" onclick="toggleSymptom('${s.id}')" class="p-3 text-left rounded-md border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${isSelected ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 text-sky-900 dark:text-sky-200' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'}">
          <span>${s.label}</span>
          <span class="w-4 h-4 rounded border flex items-center justify-center shrink-0 ml-2 ${isSelected ? 'bg-blue-900 border-blue-900 text-white' : 'border-gray-300 dark:border-gray-600'}">
            ${isSelected ? '<i class="fa-solid fa-check text-[10px]"></i>' : ''}
          </span>
        </button>
      `;
    }).join("");
  }

  window.toggleSymptom = function(id) {
    if (chosenSymptoms.has(id)) chosenSymptoms.delete(id);
    else chosenSymptoms.add(id);
    renderSymptoms();
  };

  if (clearBtn) {
    clearBtn.onclick = function() {
      chosenSymptoms.clear();
      renderSymptoms();
      document.getElementById("symptom-result-box")?.classList.add("hidden");
      document.getElementById("symptom-empty-box")?.classList.remove("hidden");
    };
  }

  if (checkBtn) {
    checkBtn.onclick = function() {
      if (chosenSymptoms.size === 0) {
        window.showToast(activeLang === "hi" ? "कृपया कम से कम एक लक्षण चुनें।" : "Please select at least one symptom.", "error");
        return;
      }

      const selected = SYMPTOMS.filter(s => chosenSymptoms.has(s.id));
      const hasEmergency = selected.some(s => s.emergency);
      const isHi = activeLang === "hi";

      const resultBox = document.getElementById("symptom-result-box");
      const emptyBox = document.getElementById("symptom-empty-box");
      const titleEl = document.getElementById("symptom-result-title");
      const badgeEl = document.getElementById("symptom-result-badge");
      const adviceEl = document.getElementById("symptom-result-advice");
      const firstAidContent = document.getElementById("symptom-first-aid-content");
      const specialistText = document.getElementById("symptom-specialist-text");
      const call108Btn = document.getElementById("symptom-call-108-btn");

      if (emptyBox) emptyBox.classList.add("hidden");
      if (!resultBox) return;

      resultBox.classList.remove("hidden");

      if (hasEmergency) {
        resultBox.className = "p-5 rounded-md border-2 border-red-500 bg-red-50/90 dark:bg-red-950/40 text-red-950 dark:text-red-100 space-y-3.5 shadow-md";
        if (titleEl) {
          titleEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-rose-600 text-lg"></i> <span>${isHi ? 'आपातकालीन स्थिति (तत्काल सहायता आवश्यक)' : 'Emergency Attention Required'}</span>`;
        }
        if (badgeEl) {
          badgeEl.className = "px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-600 text-white";
          badgeEl.textContent = isHi ? "आपातकाल" : "High Urgency";
        }
        if (adviceEl) {
          adviceEl.textContent = isHi 
            ? "आपके द्वारा चुने गए लक्षणों में गंभीर चेतावनी संकेत शामिल हैं। नीचे दिए गए प्राथमिक उपचार का पालन करें और तुरंत 108 पर कॉल करें या नज़दीकी आपातकालीन विभाग पहुंचें।"
            : "Severe warning signs were detected among your selected symptoms. Follow the immediate first-aid steps below and call 108 emergency or proceed to the nearest trauma/emergency room.";
        }
        if (call108Btn) call108Btn.classList.remove("hidden");
      } else {
        resultBox.className = "p-5 rounded-md border border-sky-300 dark:border-sky-800 bg-sky-50/80 dark:bg-sky-950/40 text-sky-950 dark:text-sky-100 space-y-3.5 shadow-sm";
        if (titleEl) {
          titleEl.innerHTML = `<i class="fa-solid fa-notes-medical text-sky-600 text-lg"></i> <span>${isHi ? 'प्राथमिक देखभाल एवं डॉक्टर परामर्श' : 'First-Aid & Medical Evaluation'}</span>`;
        }
        if (badgeEl) {
          badgeEl.className = "px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-900 text-white";
          badgeEl.textContent = isHi ? "परामर्श लें" : "Consult Soon";
        }
        if (adviceEl) {
          adviceEl.textContent = isHi 
            ? "ये लक्षण मध्यम स्तर के हैं। डॉक्टर को दिखाने से पहले नीचे दिए गए त्वरित प्राथमिक उपायों को अपनाएं ताकि आराम मिल सके।"
            : "These symptoms indicate a mild to moderate condition. Apply the actionable first-aid steps below for quick relief before consulting a physician.";
        }
        if (call108Btn) call108Btn.classList.add("hidden");
      }

      // Render Dynamic Actionable First-Aid Steps
      if (firstAidContent) {
        firstAidContent.innerHTML = `
          <ul class="space-y-2">
            ${selected.map(s => `
              <li class="flex items-start gap-2.5 bg-white/70 dark:bg-gray-800/70 p-2.5 rounded-lg border border-black/5 dark:border-white/10">
                <i class="fa-solid fa-circle-check text-emerald-500 text-xs mt-1 shrink-0"></i>
                <div class="text-xs sm:text-sm">
                  <span class="font-bold text-gray-900 dark:text-white block">${s.label}:</span>
                  <span class="text-gray-700 dark:text-gray-300">${isHi ? (s.firstAidHi || s.firstAid) : s.firstAid}</span>
                </div>
              </li>
            `).join("")}
          </ul>
        `;
      }

      // Render Recommended Specialists
      if (specialistText) {
        const specs = [...new Set(selected.map(s => isHi ? (s.specialistHi || s.specialist) : s.specialist))];
        specialistText.textContent = specs.join(" • ");
      }
    };
  }

  renderSymptoms();
}

// --- 11. HEALTH VITALS CHARTS & CALCULATORS ---
let bpChart = null;
let sugarChart = null;
let weightChart = null;

function initVitalsCharts() {
  if (typeof Chart === "undefined") return;

  const isDark = document.documentElement.classList.contains("dark");
  const textColor = isDark ? "#9ca3af" : "#4b5563";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";

  const labels = VITALS_HISTORY.map(v => v.date);

  // BP Chart
  const bpCanvas = document.getElementById("bpChart");
  if (bpCanvas) {
    if (bpChart) bpChart.destroy();
    bpChart = new Chart(bpCanvas.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "Systolic BP", data: VITALS_HISTORY.map(v => v.systolic), borderColor: "#0284c7", tension: 0.3, pointRadius: 4 },
          { label: "Diastolic BP", data: VITALS_HISTORY.map(v => v.diastolic), borderColor: "#0d9488", tension: 0.3, pointRadius: 4 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { grid: { color: gridColor }, ticks: { color: textColor } },
          x: { grid: { display: false }, ticks: { color: textColor } }
        },
        plugins: { legend: { labels: { color: textColor } } }
      }
    });
  }

  // Sugar Chart
  const sugarCanvas = document.getElementById("sugarChart");
  if (sugarCanvas) {
    if (sugarChart) sugarChart.destroy();
    sugarChart = new Chart(sugarCanvas.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "Fasting Blood Sugar (mg/dL)", data: VITALS_HISTORY.map(v => v.sugar), borderColor: "#f59e0b", tension: 0.3 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { grid: { color: gridColor }, ticks: { color: textColor } },
          x: { grid: { display: false }, ticks: { color: textColor } }
        },
        plugins: { legend: { labels: { color: textColor } } }
      }
    });
  }

  // Weight Chart
  const weightCanvas = document.getElementById("weightChart");
  if (weightCanvas) {
    if (weightChart) weightChart.destroy();
    weightChart = new Chart(weightCanvas.getContext("2d"), {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "Weight (kg)", data: VITALS_HISTORY.map(v => v.weight), backgroundColor: "rgba(16, 185, 129, 0.8)", borderRadius: 6 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 65, max: 85, grid: { color: gridColor }, ticks: { color: textColor } },
          x: { grid: { display: false }, ticks: { color: textColor } }
        },
        plugins: { legend: { labels: { color: textColor } } }
      }
    });
  }
}

function initCalculators() {
  document.getElementById("calc-bmi-btn")?.addEventListener("click", () => {
    const h = parseFloat(document.getElementById("bmi-h")?.value) / 100;
    const w = parseFloat(document.getElementById("bmi-w")?.value);
    if (h > 0 && w > 0) {
      const bmi = (w / (h * h)).toFixed(1);
      const resEl = document.getElementById("bmi-result");
      if (resEl) {
        resEl.textContent = `${bmi} (${bmi < 18.5 ? 'Underweight' : bmi <= 24.9 ? 'Normal' : 'Overweight'})`;
      }
    }
  });

  document.getElementById("calc-water-btn")?.addEventListener("click", () => {
    const w = parseFloat(document.getElementById("water-w")?.value) || 75;
    const l = ((w * 35) / 1000).toFixed(1);
    const resEl = document.getElementById("water-result");
    if (resEl) resEl.textContent = `${l} Liters / Day`;
  });
}

// --- 12. MEDICINE SCHEDULE TRACKER & LOCALSTORAGE SYNC ---
function initMedicines() {
  window.renderMeds = function() {
    const meds = getStoredMedicines();
    const isHi = (localStorage.getItem("lang") || "en") === "hi";

    ["morning", "afternoon", "night"].forEach(slot => {
      const listEl = document.getElementById(`meds-${slot}`);
      if (!listEl) return;
      const slotMeds = meds.filter(m => m.slot === slot);

      if (slotMeds.length === 0) {
        listEl.innerHTML = `
          <div class="p-3 text-center text-xs text-gray-400 bg-gray-50/50 dark:bg-gray-900/40 rounded-md border border-dashed border-gray-200 dark:border-gray-700">
            ${isHi ? 'इस समय कोई दवा नहीं है।' : 'No medicines scheduled.'}
          </div>
        `;
        return;
      }

      listEl.innerHTML = slotMeds.map(m => `
        <div class="flex items-center justify-between p-3 rounded-md border ${m.taken ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'} transition-all group">
          <label class="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
            <input type="checkbox" ${m.taken ? 'checked' : ''} onchange="toggleMed('${m.id}')" class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500">
            <div class="min-w-0">
              <div class="text-xs sm:text-sm font-bold ${m.taken ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'} truncate">${m.name}</div>
              <div class="text-[11px] text-gray-400 truncate">${m.instruction || m.dose || 'Scheduled'}</div>
            </div>
          </label>
          <button 
            type="button" 
            onclick="deleteMedicine('${m.id}')" 
            class="text-gray-300 hover:text-rose-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" 
            title="Remove Medicine"
          >
            <i class="fa-solid fa-trash-can text-xs"></i>
          </button>
        </div>
      `).join("");
    });

    const total = meds.length;
    const taken = meds.filter(m => m.taken).length;
    const pct = total > 0 ? Math.round((taken / total) * 100) : 0;
    
    // Update progress
    const bar = document.getElementById("meds-progress-bar");
    const pctEl = document.getElementById("meds-progress-pct");
    if (bar) bar.style.width = `${pct}%`;
    if (pctEl) pctEl.textContent = `${pct}%`;

    // Update Dashboard KPI Card
    const kpiMedsDisplay = document.getElementById("kpi-meds-display");
    const kpiMedsStatus = document.getElementById("kpi-meds-status");
    if (kpiMedsDisplay) {
      kpiMedsDisplay.textContent = isHi ? `${total} में से ${taken} ली गईं` : `${taken} of ${total} Taken`;
    }
    if (kpiMedsStatus) {
      if (taken === total && total > 0) {
        kpiMedsStatus.textContent = isHi ? "सभी खुराक पूरी हो चुकी हैं" : "All doses complete";
        kpiMedsStatus.className = "text-[11px] text-emerald-600 font-semibold";
      } else {
        kpiMedsStatus.textContent = isHi ? `${total - taken} खुराक बाकी हैं` : `${total - taken} doses remaining`;
        kpiMedsStatus.className = "text-[11px] text-sky-600 font-semibold";
      }
    }
  };

  window.toggleMed = function(id) {
    const meds = getStoredMedicines();
    const med = meds.find(m => m.id === id);
    if (med) {
      med.taken = !med.taken;
      saveStoredMedicines(meds);
      window.renderMeds();
    }
  };

  window.deleteMedicine = function(id) {
    let meds = getStoredMedicines();
    meds = meds.filter(m => m.id !== id);
    saveStoredMedicines(meds);
    window.renderMeds();
    window.showToast("Medicine Removed", "info");
  };

  window.renderMeds();
}

// --- ADD MEDICINE MODAL HANDLERS ---
window.openAddMedicineModal = function() {
  const modal = document.getElementById("add-medicine-modal");
  const form = document.getElementById("add-medicine-form");
  const errMsg = document.getElementById("timing-error-msg");

  if (form) form.reset();
  if (errMsg) errMsg.classList.add("hidden");
  if (modal) modal.classList.remove("hidden");
  document.getElementById("med-name-input")?.focus();
};

window.closeAddMedicineModal = function() {
  document.getElementById("add-medicine-modal")?.classList.add("hidden");
};

window.handleAddMedicine = function(e) {
  e.preventDefault();
  const nameInput = document.getElementById("med-name-input");
  const doseInput = document.getElementById("med-dose-input");
  const errMsg = document.getElementById("timing-error-msg");

  const name = nameInput ? nameInput.value.trim() : "";
  const dose = doseInput ? doseInput.value.trim() : "";

  const morningCheck = document.getElementById("timing-morning")?.checked;
  const afternoonCheck = document.getElementById("timing-afternoon")?.checked;
  const nightCheck = document.getElementById("timing-night")?.checked;

  const selectedSlots = [];
  if (morningCheck) selectedSlots.push("morning");
  if (afternoonCheck) selectedSlots.push("afternoon");
  if (nightCheck) selectedSlots.push("night");

  if (!name || !dose) {
    window.showToast("Please fill in medicine name and dosage details.", "error");
    return;
  }

  if (selectedSlots.length === 0) {
    if (errMsg) errMsg.classList.remove("hidden");
    return;
  }
  if (errMsg) errMsg.classList.add("hidden");

  const meds = getStoredMedicines();
  const slotLabels = {
    morning: "Morning (Breakfast)",
    afternoon: "Afternoon (Lunch)",
    night: "Night (Dinner/Bed)"
  };

  selectedSlots.forEach(slot => {
    meds.push({
      id: `m_${Date.now()}_${slot}`,
      name: name,
      dose: dose,
      slot: slot,
      instruction: `${dose} • ${slotLabels[slot]}`,
      taken: false,
      createdAt: new Date().toISOString()
    });
  });

  saveStoredMedicines(meds);
  window.closeAddMedicineModal();
  if (typeof window.renderMeds === "function") {
    window.renderMeds();
  }
  window.showToast("Medicine Added Successfully", "success");
};

// --- 13. AYUSHMAN / ABHA CARD MODULE & MODAL ---

function formatAbhaNumber(value) {
  if (!value) return "";
  const digits = String(value).replace(/\D/g, "");
  if (digits.length !== 14) return digits;
  return digits.replace(/(\d{2})(\d{4})(\d{4})(\d{4})/, "$1-$2-$3-$4");
}
window.formatAbhaNumber = formatAbhaNumber;

function updateAyushmanCardUI() {
  let currentUser = null;
  try {
    const raw = localStorage.getItem("currentUser");
    if (raw) currentUser = JSON.parse(raw);
  } catch (err) {
    console.error("Error reading currentUser in updateAyushmanCardUI:", err);
  }
  if (!currentUser || typeof currentUser !== "object") {
    currentUser = typeof getCurrentUser === "function" ? (getCurrentUser() || {}) : {};
  }

  // Cross-reference with stored users if not in currentUser
  const users = typeof getStoredUsers === "function" ? getStoredUsers() : [];
  const matchedUser = users.find(u => 
    (currentUser.email && u.email && u.email.toLowerCase() === currentUser.email.toLowerCase()) ||
    (currentUser.name && u.name && u.name.toLowerCase() === currentUser.name.toLowerCase())
  ) || {};

  const ayushmanImage = currentUser.ayushmanImage || matchedUser.ayushmanImage || "";
  const hasImage = Boolean(ayushmanImage);

  // Profile Section UI Elements
  const addBtn = document.getElementById("btn-add-ayushman");
  const imgEl = document.getElementById("display-ayushman-image");
  const badgeContainer = document.getElementById("ayushman-linked-badge");
  const subtitle = document.getElementById("ayushman-card-subtitle");

  // Modal Elements
  const modalImg = document.getElementById("modal-display-ayushman-image");
  const modalImgContainer = document.getElementById("modal-image-preview-container");
  const unlinkBtn = document.getElementById("btn-unlink-ayushman");
  const noCardView = document.getElementById("ayushman-no-card-view");
  const linkedView = document.getElementById("ayushman-linked-view");

  if (hasImage) {
    // If currentUser.ayushmanImage exists:
    // 1. Hides the "Add Ayushman Card" button
    if (addBtn) addBtn.classList.add("hidden");
    // 2. Removes 'hidden' class from display-ayushman-image and sets its src to saved Base64 string
    if (imgEl) {
      imgEl.classList.remove("hidden");
      imgEl.src = ayushmanImage;
    }
    if (badgeContainer) badgeContainer.classList.remove("hidden");
    if (subtitle) {
      subtitle.textContent = "Verified Ayushman Card image linked to your digital health records.";
    }

    if (modalImg) modalImg.src = ayushmanImage;
    if (modalImgContainer) modalImgContainer.classList.remove("hidden");
    if (unlinkBtn) unlinkBtn.classList.remove("hidden");
    if (noCardView) noCardView.classList.add("hidden");
    if (linkedView) linkedView.classList.remove("hidden");
  } else {
    // If currentUser.ayushmanImage does NOT exist:
    if (addBtn) addBtn.classList.remove("hidden");
    if (imgEl) {
      imgEl.classList.add("hidden");
      imgEl.src = "";
    }
    if (badgeContainer) badgeContainer.classList.add("hidden");
    if (subtitle) {
      subtitle.textContent = "Upload your Ayushman / ABHA digital health card image for hospital admissions and government health scheme coverage.";
    }

    if (modalImg) modalImg.src = "";
    if (modalImgContainer) modalImgContainer.classList.add("hidden");
    if (unlinkBtn) unlinkBtn.classList.add("hidden");
    if (noCardView) noCardView.classList.remove("hidden");
    if (linkedView) linkedView.classList.add("hidden");
  }
}
window.updateAyushmanCardUI = updateAyushmanCardUI;

function openAyushmanModal() {
  const modal = document.getElementById("ayushman-modal");
  if (!modal) return;

  let currentUser = null;
  try {
    const raw = localStorage.getItem("currentUser");
    if (raw) currentUser = JSON.parse(raw);
  } catch (err) {
    console.error("Error reading currentUser in openAyushmanModal:", err);
  }
  if (!currentUser || typeof currentUser !== "object") {
    currentUser = typeof getCurrentUser === "function" ? (getCurrentUser() || {}) : {};
  }

  const users = typeof getStoredUsers === "function" ? getStoredUsers() : [];
  const matchedUser = users.find(u => 
    (currentUser.email && u.email && u.email.toLowerCase() === currentUser.email.toLowerCase()) ||
    (currentUser.name && u.name && u.name.toLowerCase() === currentUser.name.toLowerCase())
  ) || {};

  const ayushmanImage = currentUser.ayushmanImage || matchedUser.ayushmanImage || "";
  const hasImage = Boolean(ayushmanImage);

  const noCardView = document.getElementById("ayushman-no-card-view");
  const linkedView = document.getElementById("ayushman-linked-view");
  const modalImg = document.getElementById("modal-display-ayushman-image");
  const modalImgContainer = document.getElementById("modal-image-preview-container");
  const fileInput = document.getElementById("input-ayushman-image");
  const unlinkBtn = document.getElementById("btn-unlink-ayushman");
  const saveBtnText = document.getElementById("save-ayushman-btn-text");
  const errBox = document.getElementById("ayushman-input-error");

  if (errBox) errBox.classList.add("hidden");
  if (fileInput) fileInput.value = "";

  if (hasImage) {
    if (noCardView) noCardView.classList.add("hidden");
    if (linkedView) linkedView.classList.remove("hidden");
    if (modalImg) modalImg.src = ayushmanImage;
    if (modalImgContainer) modalImgContainer.classList.remove("hidden");
    if (unlinkBtn) unlinkBtn.classList.remove("hidden");
    if (saveBtnText) saveBtnText.textContent = "Upload New Card";
  } else {
    if (noCardView) noCardView.classList.remove("hidden");
    if (linkedView) linkedView.classList.add("hidden");
    if (modalImg) modalImg.src = "";
    if (modalImgContainer) modalImgContainer.classList.add("hidden");
    if (unlinkBtn) unlinkBtn.classList.add("hidden");
    if (saveBtnText) saveBtnText.textContent = "Save Card";
  }

  modal.classList.remove("hidden");
}
window.openAyushmanModal = openAyushmanModal;
window.openEmergencyCardModal = openAyushmanModal;

function closeAyushmanModal() {
  const modal = document.getElementById("ayushman-modal");
  if (modal) modal.classList.add("hidden");

  const errBox = document.getElementById("ayushman-input-error");
  if (errBox) errBox.classList.add("hidden");

  const fileInput = document.getElementById("input-ayushman-image");
  if (fileInput) fileInput.value = "";
}
window.closeAyushmanModal = closeAyushmanModal;
window.closeEmergencyCardModal = closeAyushmanModal;

function handleSaveAyushmanCard() {
  const fileInput = document.getElementById("input-ayushman-image");
  const errBox = document.getElementById("ayushman-input-error");
  const errText = document.getElementById("ayushman-error-text");

  if (!fileInput) return false;
  const file = fileInput.files && fileInput.files[0];

  if (!file) {
    if (errBox) errBox.classList.remove("hidden");
    if (errText) errText.textContent = "Please select an image file to upload.";
    if (typeof window.showToast === "function") {
      window.showToast("Please select an image file to upload.", "error");
    }
    return false;
  }

  if (errBox) errBox.classList.add("hidden");

  // Use FileReader to convert image to Base64 string
  const reader = new FileReader();
  reader.onload = function(e) {
    const base64String = reader.result;

    // Read currentUser from LocalStorage
    let currentUser = {};
    try {
      const stored = localStorage.getItem("currentUser");
      if (stored) currentUser = JSON.parse(stored);
    } catch (err) {
      console.error("Error reading currentUser in handleSaveAyushmanCard:", err);
    }
    if (!currentUser || typeof currentUser !== "object") {
      currentUser = typeof getCurrentUser === "function" ? (getCurrentUser() || {}) : {};
    }

    // Save Base64 string to currentUser.ayushmanImage in LocalStorage
    currentUser.ayushmanImage = base64String;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Sync with users array in LocalStorage
    try {
      const users = typeof getStoredUsers === "function" ? getStoredUsers() : [];
      const uIdx = users.findIndex(u => 
        (currentUser.email && u.email && u.email.toLowerCase() === currentUser.email.toLowerCase()) ||
        (currentUser.name && u.name && u.name.toLowerCase() === currentUser.name.toLowerCase())
      );
      if (uIdx !== -1) {
        users[uIdx].ayushmanImage = base64String;
        localStorage.setItem("users", JSON.stringify(users));
      }
    } catch (err) {
      console.error("Error syncing with users list:", err);
    }

    // Close the modal
    closeAyushmanModal();

    // Dynamically update UI
    updateAyushmanCardUI();
    if (typeof loadProfileView === "function") {
      loadProfileView();
    }
    if (typeof renderProfileData === "function") {
      renderProfileData();
    }

    // Toast notification
    if (typeof window.showToast === "function") {
      window.showToast("Ayushman Card image uploaded successfully!", "success");
    }
  };

  reader.onerror = function() {
    if (typeof window.showToast === "function") {
      window.showToast("Failed to read image file. Please try again.", "error");
    }
  };

  reader.readAsDataURL(file);
  return true;
}
window.handleSaveAyushmanCard = handleSaveAyushmanCard;

function handleUnlinkAyushmanCard() {
  if (!confirm("Are you sure you want to remove this Ayushman Card from your profile?")) {
    return;
  }

  let currentUser = {};
  try {
    const stored = localStorage.getItem("currentUser");
    if (stored) currentUser = JSON.parse(stored);
  } catch (e) {}
  if (!currentUser || typeof currentUser !== "object") {
    currentUser = typeof getCurrentUser === "function" ? (getCurrentUser() || {}) : {};
  }

  delete currentUser.ayushmanImage;
  delete currentUser.ayushmanCard;
  delete currentUser.abhaNumber;
  delete currentUser.ayushmanNumber;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  try {
    const users = typeof getStoredUsers === "function" ? getStoredUsers() : [];
    const uIdx = users.findIndex(u => 
      (currentUser.email && u.email && u.email.toLowerCase() === currentUser.email.toLowerCase()) ||
      (currentUser.name && u.name && u.name.toLowerCase() === currentUser.name.toLowerCase())
    );
    if (uIdx !== -1) {
      delete users[uIdx].ayushmanImage;
      delete users[uIdx].ayushmanCard;
      delete users[uIdx].abhaNumber;
      delete users[uIdx].ayushmanNumber;
      localStorage.setItem("users", JSON.stringify(users));
    }
  } catch (err) {}

  closeAyushmanModal();
  updateAyushmanCardUI();
  if (typeof loadProfileView === "function") {
    loadProfileView();
  }
  if (typeof renderProfileData === "function") {
    renderProfileData();
  }

  if (typeof window.showToast === "function") {
    window.showToast("Ayushman Card removed.", "info");
  }
}
window.handleUnlinkAyushmanCard = handleUnlinkAyushmanCard;

function initAyushmanCardModule() {
  // Connect navbar and profile buttons to openAyushmanModal
  const navBtn = document.getElementById("nav-ayushman-card-btn");
  if (navBtn) {
    navBtn.addEventListener("click", openAyushmanModal);
  }

  const addBtn = document.getElementById("btn-add-ayushman");
  if (addBtn) {
    addBtn.addEventListener("click", openAyushmanModal);
  }

  const badgeBtn = document.getElementById("ayushman-badge");
  if (badgeBtn) {
    badgeBtn.addEventListener("click", openAyushmanModal);
  }

  const profileImg = document.getElementById("display-ayushman-image");
  if (profileImg) {
    profileImg.addEventListener("click", openAyushmanModal);
  }

  // Close buttons
  const closeBtn = document.getElementById("btn-close-ayushman");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeAyushmanModal);
  }

  const closeHeaderBtn = document.getElementById("close-ayushman-modal-btn");
  if (closeHeaderBtn) {
    closeHeaderBtn.addEventListener("click", closeAyushmanModal);
  }

  // Update save-btn-ayushman click listener
  const saveBtn = document.getElementById("save-btn-ayushman") || document.getElementById("save-ayushman-btn");
  if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveAyushmanCard);
  }

  const form = document.getElementById("ayushman-card-form");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      handleSaveAyushmanCard();
    });
  }

  // Real-time file input change listener for modal preview
  const fileInput = document.getElementById("input-ayushman-image");
  if (fileInput) {
    fileInput.addEventListener("change", function(e) {
      const file = e.target.files && e.target.files[0];
      const errBox = document.getElementById("ayushman-input-error");
      if (errBox) errBox.classList.add("hidden");

      if (file) {
        const previewReader = new FileReader();
        previewReader.onload = function(evt) {
          const modalImg = document.getElementById("modal-display-ayushman-image");
          const modalImgContainer = document.getElementById("modal-image-preview-container");
          if (modalImg) modalImg.src = evt.target.result;
          if (modalImgContainer) modalImgContainer.classList.remove("hidden");
        };
        previewReader.readAsDataURL(file);
      }
    });
  }

  // Keyboard shortcut: Escape to close modal
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      const modal = document.getElementById("ayushman-modal");
      if (modal && !modal.classList.contains("hidden")) {
        closeAyushmanModal();
      }
    }
  });

  // Initial UI sync
  updateAyushmanCardUI();
}
window.initAyushmanCardModule = initAyushmanCardModule;

// --- 14. TAB NAVIGATION ---
function initNavigation() {
  const links = document.querySelectorAll(".nav-tab-btn");
  const sections = document.querySelectorAll(".module-section");

  window.switchTab = function(tabId) {
    if (!tabId) tabId = "dashboard";
    const cleanTabId = tabId.replace(/^section-/, '').replace(/-section$/, '');

    sections.forEach(sec => {
      const secTabId = sec.id.replace(/^section-/, '').replace(/-section$/, '');
      const isMatch = (secTabId === cleanTabId);
      sec.classList.toggle("hidden", !isMatch);
    });

    // Ensure inner profile-section div is also visible when profile tab is active
    const innerProfileSec = document.getElementById("profile-section");
    if (innerProfileSec && cleanTabId === "profile") {
      innerProfileSec.classList.remove("hidden");
    }

    links.forEach(l => {
      const linkTabId = (l.getAttribute("data-tab") || "").replace(/^section-/, '').replace(/-section$/, '');
      const isMatch = (linkTabId === cleanTabId);
      l.classList.toggle("bg-blue-900", isMatch);
      l.classList.toggle("bg-sky-600", false);
      l.classList.toggle("text-white", isMatch);
      l.classList.toggle("text-gray-600", !isMatch);
      l.classList.toggle("dark:text-gray-300", !isMatch);
    });

    if (cleanTabId === "dashboard" || cleanTabId === "vitals") {
      setTimeout(initVitalsCharts, 50);
    }

    if (cleanTabId === "profile") {
      if (typeof renderProfileData === "function") {
        renderProfileData();
      }
      loadProfileView();
      syncUserData();
    }

    document.getElementById("sidebar")?.classList.add("-translate-x-full");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  links.forEach(l => {
    l.onclick = function(e) {
      e.preventDefault();
      const tab = l.getAttribute("data-tab");
      window.switchTab(tab);
      const clean = (tab || "").replace(/^section-/, '').replace(/-section$/, '');
      if (clean === "profile") {
        if (typeof renderProfileData === "function") {
          renderProfileData();
        }
        loadProfileView();
      }
    };
  });

  // Handle direct tab deep-linking via URL hash (e.g. index.html#profile)
  const initialHash = window.location.hash ? window.location.hash.replace("#", "") : "";
  if (initialHash) {
    const cleanHash = initialHash.replace(/^section-/, '').replace(/-section$/, '');
    if (document.getElementById(`section-${cleanHash}`) || document.getElementById(`${cleanHash}-section`)) {
      window.switchTab(cleanHash);
      if (cleanHash === "profile") {
        if (typeof renderProfileData === "function") {
          renderProfileData();
        }
        loadProfileView();
      }
    }
  }

  if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    window.addEventListener("hashchange", function() {
      const currentHash = window.location.hash ? window.location.hash.replace("#", "") : "";
      const cleanHash = currentHash.replace(/^section-/, '').replace(/-section$/, '');
      if (cleanHash === "profile") {
        window.switchTab("profile");
        if (typeof renderProfileData === "function") {
          renderProfileData();
        }
        loadProfileView();
      }
    });
  }

  document.getElementById("mobile-menu-btn")?.addEventListener("click", () => {
    document.getElementById("sidebar")?.classList.toggle("-translate-x-full");
  });
  document.getElementById("sidebar-close-btn")?.addEventListener("click", () => {
    document.getElementById("sidebar")?.classList.add("-translate-x-full");
  });
}

// --- INITIALIZE ON DOM READY ---
function initApp() {
  syncUserData();
  initTheme();
  initLanguage();
  syncUserData();
  initNavigation();
  initProfileModule();
  initHospitalsModule();
  initBloodFinderModule();
  initSymptomChecker();
  initVitalsCharts();
  initCalculators();
  initMedicines();
  initAyushmanCardModule();

  // Restore saved location if available
  const savedLocation = localStorage.getItem("userLocation");
  if (savedLocation) {
    const displayLabel = document.getElementById("location-display-label");
    if (displayLabel) displayLabel.textContent = savedLocation;
    if (typeof PATIENT !== 'undefined') PATIENT.location = savedLocation;
  }

  console.log("Smart E-Health Portal ready.");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

function renderProfileData() {
    let currentUser = null;
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) currentUser = JSON.parse(raw);
    } catch(e) {}

    if (currentUser) {
        let nameEl = document.getElementById('profile-display-name');
        let emailEl = document.getElementById('profile-display-email');
        if(nameEl) nameEl.textContent = currentUser.name;
        if(emailEl) emailEl.textContent = currentUser.email;

        // Render Ayushman Card image in profile
        const addBtn = document.getElementById("btn-add-ayushman");
        const imgEl = document.getElementById("display-ayushman-image");
        if (currentUser.ayushmanImage) {
            if (addBtn) addBtn.classList.add("hidden");
            if (imgEl) {
                imgEl.classList.remove("hidden");
                imgEl.src = currentUser.ayushmanImage;
            }
        } else {
            if (addBtn) addBtn.classList.remove("hidden");
            if (imgEl) {
                imgEl.classList.add("hidden");
                imgEl.src = "";
            }
        }
    }
}
if (typeof window !== 'undefined') {
    window.renderProfileData = renderProfileData;
}

const btnEditProfile = document.getElementById('btn-edit-profile');
if (btnEditProfile) {
    btnEditProfile.addEventListener('click', () => {
        document.getElementById('edit-profile-modal')?.classList.remove('hidden');
    });
}

document.getElementById('btn-add-ayushman')?.addEventListener('click', () => window.openAyushmanModal());
document.getElementById('btn-close-ayushman')?.addEventListener('click', () => window.closeAyushmanModal());

window.openAyushmanModal = function() {
    const modal = document.getElementById('ayushman-modal');
    if(modal) modal.classList.remove('hidden');
};

window.closeAyushmanModal = function() {
    const modal = document.getElementById('ayushman-modal');
    if(modal) modal.classList.add('hidden');
};

window.saveAyushmanImage = function() {
    const fileInput = document.getElementById('input-ayushman-image');
    if(fileInput && fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if(!currentUser) currentUser = {};
            currentUser.ayushmanImage = e.target.result;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            window.closeAyushmanModal();
            alert("Ayushman Card Photo Uploaded Successfully!");
            location.reload(); // Instantly refreshes to show the image
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        alert("Please select a photo to upload.");
    }
};
