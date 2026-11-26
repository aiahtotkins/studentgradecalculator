// ==========================================
// 1. STATE & STORAGE KEYS
// ==========================================
const USERS_KEY = "grademate_users";
const CURRENT_USER_KEY = "grademate_current_user";
let isRegisterMode = true;

// ==========================================
// 2. UI MESSAGE & VIEW HELPERS
// ==========================================
function showError(message) {
  const authError = document.getElementById("authError");
  if (authError) {
    authError.textContent = message;
    authError.style.display = "block";
  }
}

function showSuccess(message) {
  const authSuccess = document.getElementById("authSuccess");
  if (authSuccess) {
    authSuccess.textContent = message;
    authSuccess.style.display = "block";
  }
}

function hideMessages() {
  const authError = document.getElementById("authError");
  const authSuccess = document.getElementById("authSuccess");
  if (authError) {
    authError.textContent = "";
    authError.style.display = "none";
  }
  if (authSuccess) {
    authSuccess.textContent = "";
    authSuccess.style.display = "none";
  }
}

function updateAuthUI() {
  const authTitle = document.getElementById("authTitle");
  const authSubtitle = document.getElementById("authSubtitle");
  const nameGroup = document.getElementById("nameGroup");
  const studentName = document.getElementById("studentName");
  const authSubmitBtn = document.getElementById("authSubmitBtn");
  const toggleText = document.getElementById("toggleText");
  const toggleAuthLink = document.getElementById("toggleAuthLink");
  const forgotRow = document.getElementById("forgotPasswordRow");
  const resetBox = document.getElementById("resetPasswordBox");
  const authForm = document.getElementById("authForm");
  const toggleRow = document.querySelector(".auth-toggle");

  if (resetBox) resetBox.style.display = "none";
  if (authForm) authForm.style.display = "block";
  if (toggleRow) toggleRow.style.display = "block";
  if (forgotRow) forgotRow.style.display = isRegisterMode ? "none" : "block";

  if (isRegisterMode) {
    if (authTitle) authTitle.textContent = "Create CvSU Account";
    if (authSubtitle) authSubtitle.textContent = "Register first using your CvSU email";
    if (nameGroup) nameGroup.style.display = "block";
    if (studentName) studentName.required = true;
    if (authSubmitBtn) authSubmitBtn.textContent = "Register";
    if (toggleText) toggleText.textContent = "Already have an account?";
    if (toggleAuthLink) toggleAuthLink.textContent = "Log in";
  } else {
    if (authTitle) authTitle.textContent = "Log in to GradeMate";
    if (authSubtitle) authSubtitle.textContent = "Enter your registered CvSU email and password";
    if (nameGroup) nameGroup.style.display = "none";
    if (studentName) studentName.required = false;
    if (authSubmitBtn) authSubmitBtn.textContent = "Log in";
    if (toggleText) toggleText.textContent = "Don't have an account?";
    if (toggleAuthLink) toggleAuthLink.textContent = "Register";
  }
}

function toggleAuthMode(event) {
  if (event) event.preventDefault();
  isRegisterMode = !isRegisterMode;
  hideMessages();
  updateAuthUI();
}

function showCalculator(user) {
  const authCard = document.getElementById("authCard");
  const calculatorCard = document.getElementById("calculatorCard");
  const userBar = document.querySelector(".user-bar");
  const welcomeText = document.getElementById("welcomeText");
  const welcomeUser = document.getElementById("welcomeUser");

  if (authCard) authCard.style.display = "none";
  if (calculatorCard) calculatorCard.style.display = "block";
  if (userBar) userBar.style.display = "flex";

  if (welcomeText) {
    welcomeText.textContent = user && user.name ? `Welcome, ${user.name}!` : "Welcome, Student!";
  }
  if (welcomeUser) {
    welcomeUser.textContent = user && user.name ? `Hi, ${user.name}!` : "Hi, Student!";
  }
}

function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);

  const authForm = document.getElementById("authForm");
  const userBar = document.querySelector(".user-bar");
  const calculatorCard = document.getElementById("calculatorCard");
  const authCard = document.getElementById("authCard");

  if (authForm) authForm.reset();
  if (userBar) userBar.style.display = "none";
  if (calculatorCard) calculatorCard.style.display = "none";
  if (authCard) authCard.style.display = "block";

  isRegisterMode = false;
  hideMessages();
  updateAuthUI();
}

// ==========================================
// 3. AUTHENTICATION & RESET PASSWORD
// ==========================================
function handleAuthSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById("studentName");
  const emailInput = document.getElementById("cvsuEmail");
  const passwordInput = document.getElementById("password");
  const authForm = document.getElementById("authForm");

  const name = nameInput ? nameInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
  const password = passwordInput ? passwordInput.value : "";

  hideMessages();

  if (!email.endsWith("@cvsu.edu.ph")) {
    showError("Please use a valid @cvsu.edu.ph email address.");
    return;
  }

  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  if (isRegisterMode) {
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      showError("This CvSU email is already registered. Please log in.");
      return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    if (authForm) authForm.reset();
    isRegisterMode = false;
    updateAuthUI();
    showSuccess("Registration successful! Now log in to open the calculator.");
  } else {
    const matchedUser = users.find((u) => u.email === email && u.password === password);
    if (!matchedUser) {
      showError("Invalid CvSU email or password.");
      return;
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(matchedUser));
    showCalculator(matchedUser);
  }
}

function toggleResetMode(event) {
  if (event) event.preventDefault();

  const authForm = document.getElementById("authForm");
  const toggleRow = document.querySelector(".auth-toggle");
  const forgotRow = document.getElementById("forgotPasswordRow");
  const resetBox = document.getElementById("resetPasswordBox");

  hideMessages();
  if (authForm) authForm.style.display = "none";
  if (toggleRow) toggleRow.style.display = "none";
  if (forgotRow) forgotRow.style.display = "none";
  if (resetBox) resetBox.style.display = "block";
}

function cancelResetMode(event) {
  if (event) event.preventDefault();

  const authForm = document.getElementById("authForm");
  const toggleRow = document.querySelector(".auth-toggle");
  const forgotRow = document.getElementById("forgotPasswordRow");
  const resetBox = document.getElementById("resetPasswordBox");

  if (resetBox) resetBox.style.display = "none";
  if (authForm) authForm.style.display = "block";
  if (toggleRow) toggleRow.style.display = "block";
  if (forgotRow) forgotRow.style.display = "block";
}

function handleResetPassword() {
  const emailInput = document.getElementById("resetEmail");
  const passInput = document.getElementById("resetNewPassword");

  hideMessages();

  const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
  const newPassword = passInput ? passInput.value : "";

  if (!email || !newPassword) {
    showError("Please enter your CvSU email and a new password.");
    return;
  }

  if (!email.endsWith("@cvsu.edu.ph")) {
    showError("Please use a valid @cvsu.edu.ph email address.");
    return;
  }

  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  const userIndex = users.findIndex((u) => u.email.toLowerCase() === email);

  if (userIndex === -1) {
    showError("No account found with that CvSU email.");
    return;
  }

  users[userIndex].password = newPassword;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  if (emailInput) emailInput.value = "";
  if (passInput) passInput.value = "";

  cancelResetMode();
  showSuccess("Password updated! You can now log in.");
}

// ==========================================
// 4. GWA CALCULATOR LOGIC
// ==========================================
function addSubject() {
  const subjectList = document.getElementById("subjectList");
  if (!subjectList) return;

  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
    <input type="text" placeholder="Subject Name" required>
    <input type="number" class="grade" placeholder="1.75" min="1.00" max="5.00" step="0.25" required>
    <input type="number" class="weight" placeholder="Units" min="0" step="0.5" value="3" required>
    <button type="button" class="btn-remove" onclick="removeRow(this)" title="Remove subject">×</button>
  `;
  subjectList.appendChild(row);
}

function removeRow(button) {
  const subjectList = document.getElementById("subjectList");
  if (!subjectList) return;

  if (subjectList.children.length > 1) {
    button.parentElement.remove();
  } else {
    alert("You need at least one subject to calculate a grade.");
  }
}

function handleGradeSubmit(e) {
  e.preventDefault();

  const grades = document.querySelectorAll(".grade");
  const weights = document.querySelectorAll(".weight");

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (let i = 0; i < grades.length; i++) {
    const gradeValue = parseFloat(grades[i].value) || 0;
    const units = parseFloat(weights[i].value) || 0;

    totalWeightedScore += gradeValue * units;
    totalWeight += units;
  }

  const finalGWA = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

  let motivation = "";
  if (finalGWA <= 1.90) {
    motivation = "Amazing work! Keep that momentum going!";
  } else if (finalGWA <= 3.00) {
    motivation = "Solid progress! Stay consistent and aim even higher next sem.";
  } else {
    motivation = "Don't get discouraged. Keep pushing!";
  }

  const resultBox = document.getElementById("resultBox");
  const finalScoreEl = document.getElementById("finalScore");
  const gradeNoteEl = document.getElementById("gradeNote");

  if (finalScoreEl) finalScoreEl.textContent = `GWA: ${finalGWA.toFixed(2)}`;
  if (gradeNoteEl) gradeNoteEl.textContent = motivation;
  if (resultBox) resultBox.style.display = "block";
}

function resetForm() {
  const gradeForm = document.getElementById("gradeForm");
  const resultBox = document.getElementById("resultBox");

  if (gradeForm) gradeForm.reset();
  if (resultBox) resultBox.style.display = "none";
}

// ==========================================
// 5. INITIALIZATION & EVENT LISTENERS
// ==========================================
window.addEventListener("DOMContentLoaded", function () {
  const authForm = document.getElementById("authForm");
  const gradeForm = document.getElementById("gradeForm");
  const userBar = document.querySelector(".user-bar");

  if (authForm) {
    authForm.addEventListener("submit", handleAuthSubmit);
  }
  if (gradeForm) {
    gradeForm.addEventListener("submit", handleGradeSubmit);
  }

  const activeUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  if (activeUser) {
    showCalculator(activeUser);
  } else {
    const calculatorCard = document.getElementById("calculatorCard");
    const authCard = document.getElementById("authCard");
    if (userBar) userBar.style.display = "none";
    if (calculatorCard) calculatorCard.style.display = "none";
    if (authCard) authCard.style.display = "block";
    updateAuthUI();
  }
});
