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
  if (!localStorage.getItem("fallsviewCookieConsent")) {
    consentPopup.style.display = "block";
  } else {
    manageCookiesTab.style.display = "block"; // Show the tab if consent has been set
  }

  // -------------------------------------------------------------- EVENT LISTENERS:

  // Accept all cookies
  acceptButton.addEventListener("click", function () {
    localStorage.setItem("fallsviewCookieConsent", sanitizeInput("accepted"));
    localStorage.setItem("fallsviewAnalyticsCookies", sanitizeInput("true"));
    localStorage.setItem("fallsviewOtherCookies", sanitizeInput("true"));
    localStorage.setItem("fallsviewConsentUpdated", sanitizeInput(new Date().toLocaleString()));
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
    localStorage.setItem("fallsviewCookieConsent", sanitizeInput("declined"));
    localStorage.setItem("fallsviewAnalyticsCookies", sanitizeInput("false"));
    localStorage.setItem("fallsviewOtherCookies", sanitizeInput("false"));
    localStorage.setItem("fallsviewConsentUpdated", sanitizeInput(new Date().toLocaleString()));
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
    localStorage.setItem("fallsviewAnalyticsCookies", sanitizeInput(analyticsChecked.toString()));
    localStorage.setItem("fallsviewOtherCookies", sanitizeInput(otherChecked.toString()));
    localStorage.setItem("fallsviewCookieConsent", sanitizeInput("custom"));
    localStorage.setItem("fallsviewConsentUpdated", sanitizeInput(new Date().toLocaleString()));
    consentPopup.style.display = "none";
    manageCookiesTab.style.display = "block";
    handleCookies();
  });

  // -------------------------------------------------------------- FUNCTIONS:

  // Sanitize input to prevent XSS attacks
  function sanitizeInput(input) {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
  }

  // Dynamically load a script if it is not already present on the page
  // Create an HTML script tag with src and id attributes to the head of document
  function loadScript(src, id) {
    if (!document.getElementById(id)) {
      // Validate that the script source is from a secure and trusted domain
      if (src.startsWith('https://')) {
        const script = document.createElement("script");
        script.src = src;
        script.id = id;
        script.async = true; // Ensure the script is loaded asynchronously
        document.head.appendChild(script);
      } else {
        console.error("Untrusted script source:", src);
      }
    }
  }

  // Dynamically load a script without a secure and trusted domain
  /* function loadScript(src, id) {
     if (!document.getElementById(id)) {
       const script = document.createElement("script");
       script.src = src;
       script.id = id;
       script.async = true; // Ensure the script is loaded asynchronously
       document.head.appendChild(script);
     }
   } */

  // Remove a specified cookie by setting its Max-Age to a negative value
  function deleteCookie(name, domain = window.location.hostname) {
    document.cookie = `${name}=; Max-Age=-1; path=/; domain=${domain}; Secure; SameSite=Strict`;
  }

  // Remove Google Analytics cookies
  function deleteGoogleAnalyticsCookies() {
    deleteCookie('_ga', '127.0.0.1'); // .fallsviewcasinoresort.com
    deleteCookie('_ga_QYZMBLS6EW', '127.0.0.1'); // .fallsviewcasinoresort.com
  }

  // Remove third-party cookies
  function deleteThirdPartyCookies() {
    deleteCookie('IDE', '.doubleclick.net');
    deleteCookie('ar_debug', '.doubleclick.net');
    deleteCookie('receive-cookie-deprecation', '.doubleclick.net');
    deleteCookie('__spdt', '127.0.0.1'); // .fallsviewcasinoresort.com
    deleteCookie('_fbp', '127.0.0.1'); // .fallsviewcasinoresort.com
    deleteCookie('_gcl_au', '127.0.0.1'); // .fallsviewcasinoresort.com
  }

  // Retrieve consent settings from localStorage and load or delete cookies based on the user's consent status
  function handleCookies() {
    const consent = localStorage.getItem("fallsviewCookieConsent");
    const analyticsConsent = localStorage.getItem("fallsviewAnalyticsCookies") === "true";
    const otherConsent = localStorage.getItem("fallsviewOtherCookies") === "true";

    // Load essential cookies (always active)
    loadScript("https://essential.js", "essential");

    // Load analytics cookies if consented
    if (analyticsConsent) {
      // Load Google Tag Manager script if consent is given
      (function(w,d,s,l,i){
        w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
        var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
      })(window, document, 'script', 'dataLayer', 'GTM-5KHP8BR');
    } else {
      deleteGoogleAnalyticsCookies(); 
    }
    

    // If the user has agreed to other (non-essential) cookies:
    if (otherConsent) {
      // Load a script that sets up these additional cookies.
      // This is a placeholder for the actual script that manages first-party non-essential cookies.
      loadScript("https://other.js", "other");
    } else {
      // If the user has declined other cookies:
      // Delete any existing non-essential cookies specific to your site (e.g., "_ga_QYZMBLS6EW").
      deleteCookie("otherCookieName", '127.0.0.1'); // .fallsviewcasinoresort.com
      
      // Also, delete any third-party cookies that are non-essential.
      deleteThirdPartyCookies();
    }
  }

  // Update checkboxes based on stored preferences
  function updateCheckboxes() {
    document.getElementById("fv-analyticsCookies").checked = localStorage.getItem("fallsviewAnalyticsCookies") === "true";
    document.getElementById("fv-otherCookies").checked = localStorage.getItem("fallsviewOtherCookies") === "true";
  }

  // -------------------------------------------------------------- INITIAL CALLS:

  // Set up the initial state of cookies based on the current settings
  handleCookies();

  // Update checkboxes based on current settings
  updateCheckboxes();
});
