// API Base URL
const API_URL = "http://localhost:3000/api";

// DOM Elements
const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const viewSubmissionsBtn = document.getElementById("viewSubmissionsBtn");
const submissionsList = document.getElementById("submissionsList");

// Toast notification helper
const showToast = (message, type = "success") => {
  const backgroundColor = {
    success: "linear-gradient(to right, #34a853, #2d8e47)",
    error: "linear-gradient(to right, #ea4335, #d33426)",
    warning: "linear-gradient(to right, #fbbc04, #f9ab00)",
    info: "linear-gradient(to right, #4285f4, #3367d6)",
  };

  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: backgroundColor[type] || backgroundColor.info,
      borderRadius: "8px",
      fontSize: "16px",
      padding: "16px 24px",
    },
  }).showToast();
};

// Client-side validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateForm = () => {
  let isValid = true;

  // Clear previous errors
  document
    .querySelectorAll(".error-message")
    .forEach((el) => (el.textContent = ""));

  // Validate name
  const name = nameInput.value.trim();
  if (name === "") {
    document.getElementById("nameError").textContent = "Name is required";
    isValid = false;
  } else if (name.length < 2) {
    document.getElementById("nameError").textContent =
      "Name must be at least 2 characters";
    isValid = false;
  }

  // Validate email
  const email = emailInput.value.trim();
  if (email === "") {
    document.getElementById("emailError").textContent = "Email is required";
    isValid = false;
  } else if (!validateEmail(email)) {
    document.getElementById("emailError").textContent =
      "Please enter a valid email address";
    isValid = false;
  }

  // Validate message
  const message = messageInput.value.trim();
  if (message === "") {
    document.getElementById("messageError").textContent = "Message is required";
    isValid = false;
  } else if (message.length < 10) {
    document.getElementById("messageError").textContent =
      "Message must be at least 10 characters";
    isValid = false;
  }

  return isValid;
};

// Real-time validation on input
nameInput.addEventListener("blur", () => {
  const name = nameInput.value.trim();
  if (name && name.length < 2) {
    document.getElementById("nameError").textContent =
      "Name must be at least 2 characters";
  } else {
    document.getElementById("nameError").textContent = "";
  }
});

emailInput.addEventListener("blur", () => {
  const email = emailInput.value.trim();
  if (email && !validateEmail(email)) {
    document.getElementById("emailError").textContent =
      "Please enter a valid email address";
  } else {
    document.getElementById("emailError").textContent = "";
  }
});

messageInput.addEventListener("blur", () => {
  const message = messageInput.value.trim();
  if (message && message.length < 10) {
    document.getElementById("messageError").textContent =
      "Message must be at least 10 characters";
  } else {
    document.getElementById("messageError").textContent = "";
  }
});

// Form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validate form
  if (!validateForm()) {
    showToast("Please fix the errors before submitting", "error");
    return;
  }

  // Prepare data
  const formData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim(),
  };

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.classList.add("loading");

  try {
    const response = await fetch(`${API_URL}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Success
      showToast(data.message || "Form submitted successfully! 🎉", "success");
      form.reset();

      // Clear any error messages
      document
        .querySelectorAll(".error-message")
        .forEach((el) => (el.textContent = ""));
    } else {
      // Error from server
      showToast(data.message || "Failed to submit form", "error");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    showToast("Network error. Please check if the server is running.", "error");
  } finally {
    // Reset loading state
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
  }
});

// Fetch and display submissions
const fetchSubmissions = async () => {
  try {
    const response = await fetch(`${API_URL}/submissions`);
    const data = await response.json();

    if (data.success && data.data.length > 0) {
      displaySubmissions(data.data);
      submissionsList.classList.add("visible");
      viewSubmissionsBtn.textContent = "Hide Submissions";
    } else if (data.data.length === 0) {
      submissionsList.innerHTML =
        '<p style="color: #5f6368; text-align: center;">No submissions yet.</p>';
      submissionsList.classList.add("visible");
      viewSubmissionsBtn.textContent = "Hide Submissions";
    }
  } catch (error) {
    console.error("Error fetching submissions:", error);
    showToast("Failed to load submissions", "error");
  }
};

// Display submissions
const displaySubmissions = (submissions) => {
  submissionsList.innerHTML = submissions
    .map((sub) => {
      const date = new Date(sub.created_at).toLocaleString();
      return `
      <div class="submission-card">
        <h3>${escapeHtml(sub.name)}</h3>
        <p><strong>Email:</strong> ${escapeHtml(sub.email)}</p>
        <p><strong>Message:</strong> ${escapeHtml(sub.message)}</p>
        <p class="timestamp">Submitted on: ${date}</p>
      </div>
    `;
    })
    .join("");
};

// Escape HTML to prevent XSS
const escapeHtml = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

// Toggle submissions visibility
viewSubmissionsBtn.addEventListener("click", () => {
  if (submissionsList.classList.contains("visible")) {
    submissionsList.classList.remove("visible");
    viewSubmissionsBtn.textContent = "View All Submissions";
  } else {
    fetchSubmissions();
  }
});

// Welcome message
console.log("🚀 Form Submission App Ready!");
showToast("Welcome! Fill out the form to get started.", "info");

// Set dynamic copyright year
document.getElementById("currentYear").textContent = new Date().getFullYear();
