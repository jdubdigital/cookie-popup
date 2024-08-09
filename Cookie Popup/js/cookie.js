document.addEventListener("DOMContentLoaded", function () {
  const consentPopup = document.getElementById("fv-cookieConsentPopup");
  const manageCookiesTab = document.getElementById("fv-manageCookiesTab");
  const closePopup = document.getElementById("fv-closePopup");
  const acceptButton = document.getElementById("fv-acceptCookies");
  const manageButton = document.getElementById("fv-manageCookies");
  const declineButton = document.getElementById("fv-declineCookies");
  const savePreferencesButton = document.getElementById("fv-savePreferences");
  const settings = document.getElementById("fv-cookieSettings");

  // -------------------------------------------------------------- INITIALIZATION:

  // Check if the user has already made a choice
  if (!localStorage.getItem("cookieConsent")) {
    consentPopup.style.display = "block";
  } else {
    manageCookiesTab.style.display = "block"; // Show the tab if consent has been set
  }

  // -------------------------------------------------------------- EVENT LISTENERS:

  // Accept all cookies
  acceptButton.addEventListener("click", function () {
    localStorage.setItem("fallsviewCookieConsent", "accepted");
    localStorage.setItem("fallsviewAnalyticsCookies", "true");
    localStorage.setItem("fallsviewOtherCookies", "true");
    localStorage.setItem("fallsviewConsentUpdated", new Date().toLocaleString());
    updateCheckboxes();
    consentPopup.style.display = "none";
    manageCookiesTab.style.display = "block";
    handleCookies();
  });

  // Manage cookie preferences
  manageButton.addEventListener("click", function () {
    settings.style.display = "block";
    updateCheckboxes(); // Ensure checkboxes are up-to-date when managing preferences
  });

  // Decline non-essential cookies
  declineButton.addEventListener("click", function () {
    localStorage.setItem("fallsviewCookieConsent", "declined");
    localStorage.setItem("fallsviewAnalyticsCookies", "false");
    localStorage.setItem("fallsviewOtherCookies", "false");
    localStorage.setItem("fallsviewConsentUpdated", new Date().toLocaleString());
    updateCheckboxes();
    consentPopup.style.display = "none";
    manageCookiesTab.style.display = "block";
    handleCookies();
  });

  // Close popup when clicking the close button
  closePopup.addEventListener("click", function () {
    consentPopup.style.display = "none";
  });

  // Show popup again when clicking the tab
  manageCookiesTab.addEventListener("click", function () {
    consentPopup.style.display = "block";
    settings.style.display = "block";
    updateCheckboxes();
  });

  // Save preferences
  savePreferencesButton.addEventListener("click", function () {
    const analyticsChecked = document.getElementById("fv-analyticsCookies").checked;
    const otherChecked = document.getElementById("fv-otherCookies").checked;
    localStorage.setItem("fallsviewAnalyticsCookies", analyticsChecked.toString());
    localStorage.setItem("fallsviewOtherCookies", otherChecked.toString());
    localStorage.setItem("fallsviewCookieConsent", "custom");
    localStorage.setItem("fallsviewConsentUpdated", new Date().toLocaleString());
    consentPopup.style.display = "none";
    manageCookiesTab.style.display = "block";
    handleCookies();
  });

  // -------------------------------------------------------------- FUNCTIONS:

  // Dynamically load a script if it is not already present on the page
  function loadScript(src, id) {
    if (!document.getElementById(id)) {
      const script = document.createElement("script");
      script.src = src;
      script.id = id;
      document.head.appendChild(script);
    }
  }

  // Remove a specified cookie by setting its Max-Age to a negative value
  function deleteCookie(name) {
    document.cookie = `${name}=; Max-Age=-99999999; path=/; domain=${window.location.hostname}`;
  }

  // Remove Google Analytics cookies
  function deleteGoogleAnalyticsCookies() {
    deleteCookie('_ga');
    deleteCookie('_ga_QYZMBLS6EW');
  }

  // Retrieve consent settings from localStorage and load or delete cookies based on the user's consent status
  function handleCookies() {
    const consent = localStorage.getItem("cookieConsent");
    const analyticsConsent = localStorage.getItem("fallsviewAnalyticsCookies") === "true";
    const otherConsent = localStorage.getItem("fallsviewOtherCookies") === "true";

    // Load essential cookies (always active)
    loadScript("/path/to/essential-script.js", "essential");

    // Load analytics cookies if consented
    if (analyticsConsent) {
      loadScript("https://www.googletagmanager.com/gtag/js?id=G-QYZMBLS6EW", "analytics");
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag("js", new Date());
      gtag("config", "G-QYZMBLS6EW");
    } else {
      deleteGoogleAnalyticsCookies();
    }

    // Load other cookies if consented
    if (otherConsent) {
      loadScript("https://example.com/other-script.js", "other");
    } else {
      deleteCookie("otherCookieName"); // Replace with actual other cookie names
    }
  }

  // Update checkboxes based on stored preferences
  function updateCheckboxes() {
    document.getElementById("fv-analyticsCookies").checked = localStorage.getItem("analyticsCookies") === "true";
    document.getElementById("fv-otherCookies").checked = localStorage.getItem("otherCookies") === "true";
  }

  // -------------------------------------------------------------- INITIAL CALLS:

  // Set up the initial state of cookies based on the current settings
  handleCookies();

  // Update checkboxes based on current settings
  updateCheckboxes();
});
