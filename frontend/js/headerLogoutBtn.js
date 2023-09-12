import { backToRedirectUrl } from "/frontend/js/backToRedirectUrl.js";

// Get the user and logout button elements
const userIcon = document.getElementById("user");
const logoutButton = document.getElementById("logoutButton");
const token = localStorage.getItem("Authorization_U");

if (!token) {
  $("#logoutButtonText").text("登入");
} else {
  $("#logoutButtonText").text("登出");
}

logoutButton.addEventListener("click", () => {
  if (!token) {
    window.location.href = "/frontend/pages/user/login.html";
  } else {
    localStorage.removeItem("Authorization_U");
    backToRedirectUrl();
  }
});

let timeoutId; // To store the timeout ID
// Show the logout button when user icon is hovered
userIcon.addEventListener("mouseover", () => {
  clearTimeout(timeoutId); // Clear any existing timeouts
  logoutButton.style.opacity = "1";
  logoutButton.style.pointerEvents = "auto";
});

// Hide the logout button with a delay when user icon is not hovered
userIcon.addEventListener("mouseout", () => {
  clearTimeout(timeoutId); // Clear any existing timeouts
  timeoutId = setTimeout(() => {
    logoutButton.style.opacity = "0";
    logoutButton.style.pointerEvents = "none";
  }, 500); // Adjust the delay time (in milliseconds) as needed
});

// Hide the logout button when the button itself is hovered
logoutButton.addEventListener("mouseover", () => {
  clearTimeout(timeoutId); // Clear any existing timeouts
});

// Hide the logout button when the button itself is not hovered
logoutButton.addEventListener("mouseout", () => {
  clearTimeout(timeoutId); // Clear any existing timeouts
  timeoutId = setTimeout(() => {
    logoutButton.style.opacity = "0";
    logoutButton.style.pointerEvents = "none";
  }, 500); // Adjust the delay time (in milliseconds) as needed
});
