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
    localStorage.setItem("fallsviewMarketingCookies", sanitizeInput("true"));
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
    localStorage.setItem("fallsviewAnalyticsCookies", sanitizeInput("true")); // Analytics always on
    localStorage.setItem("fallsviewMarketingCookies", sanitizeInput("false"));
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
    const marketingChecked = document.getElementById("fv-marketingCookies").checked;
    localStorage.setItem("fallsviewAnalyticsCookies", sanitizeInput("true")); // Analytics always on
    localStorage.setItem("fallsviewMarketingCookies", sanitizeInput(marketingChecked.toString()));
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
  function loadScript(src, id) {
    if (!document.getElementById(id)) {
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

  // Remove a specified cookie by setting its Max-Age to a negative value
  function deleteCookie(name, domain = window.location.hostname) {
    document.cookie = `${name}=; Max-Age=-1; path=/; domain=${domain}; Secure; SameSite=Strict`;
  }

  // Remove marketing cookies
  function deleteMarketingCookies() {
    deleteCookie('IDE', '.doubleclick.net');
    deleteCookie('ar_debug', '.doubleclick.net');
    deleteCookie('receive-cookie-deprecation', '.doubleclick.net');
    deleteCookie('__spdt', '127.0.0.1'); // .fallsviewcasinoresort.com
    deleteCookie('_fbp', '127.0.0.1'); // .fallsviewcasinoresort.com
    deleteCookie('_gcl', '127.0.0.1'); // .fallsviewcasinoresort.com
    deleteCookie('_gcl_au', '127.0.0.1'); // .fallsviewcasinoresort.com
  }

  // Function to determine marketing consent
  function getMarketingConsent() {
    var consent = localStorage.getItem('fallsviewCookieConsent');
    var marketingConsent = localStorage.getItem('fallsviewMarketingCookies') === 'true';
    
    // Marketing consent is true if the user accepted all cookies or specifically accepted marketing
    return (consent === 'accepted') || (consent === 'custom' && marketingConsent);
  }

  // Retrieve consent settings from localStorage and load or delete cookies based on the user's consent status
  function handleCookies() {
    const marketingConsent = getMarketingConsent();

    console.log("Marketing consent status:", marketingConsent);

    // Update GTM consent mode only for marketing cookies
    gtag('consent', 'update', {
      'ad_storage': marketingConsent ? 'granted' : 'denied',
      'analytics_storage': 'granted', // Analytics always granted
    });

    if (marketingConsent) {
      console.log("Loading marketing scripts");
    } else {
      console.log("Deleting marketing cookies");
      deleteMarketingCookies();
    }
  }

  // Update checkboxes based on stored preferences
  function updateCheckboxes() {
    document.getElementById("fv-analyticsCookies").checked = true; // Always true for analytics
    document.getElementById("fv-marketingCookies").checked = localStorage.getItem("fallsviewMarketingCookies") === "true";
  }

  // -------------------------------------------------------------- INITIAL CALLS:

  // Set up the initial state of cookies based on the current settings
  handleCookies();

  // Update checkboxes based on current settings
  updateCheckboxes();

  // Use the Marketing Consent Trigger to initialize consent
  document.getElementById("MarketingConsentTrigger").addEventListener("click", function() {
    handleCookies();
  });
});
