document.addEventListener("DOMContentLoaded", function () {
  const pb = new PocketBase('http://127.0.0.1:8090');
  console.log('PocketBase initialized:', pb);

  const consentPopup = document.getElementById("fv-cookieConsentPopup");
  const manageCookiesTab = document.getElementById("fv-manageCookiesTab");
  const closePopup = document.getElementById("fv-closePopup");
  const acceptButton = document.getElementById("fv-acceptCookies");
  const manageButton = document.getElementById("fv-manageCookies");
  const declineButton = document.getElementById("fv-declineCookies");
  const savePreferencesButton = document.getElementById("fv-savePreferences");
  const settings = document.getElementById("fv-cookieSettings");

  // -------------------------------------------------------------- USER IDENTIFICATION:

  // Generate or retrieve a unique user ID
  let userId = localStorage.getItem("userId");
  if (!userId) {
      userId = generateUUID();
      localStorage.setItem("userId", userId);
  }
  console.log("User ID:", userId);

  // Function to generate a UUID
  function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
      });
  }

  // -------------------------------------------------------------- INITIALIZATION:

  if (!localStorage.getItem("fallsviewCookieConsent")) {
      consentPopup.style.display = "block";
  } else {
      manageCookiesTab.style.display = "block";
  }

  // -------------------------------------------------------------- EVENT LISTENERS:

  acceptButton.addEventListener("click", function () {
      localStorage.setItem("fallsviewCookieConsent", sanitizeInput("accepted"));
      localStorage.setItem("fallsviewAnalyticsCookies", sanitizeInput("true"));
      localStorage.setItem("fallsviewMarketingCookies", sanitizeInput("true"));
      localStorage.setItem("fallsviewConsentUpdated", sanitizeInput(new Date().toLocaleString()));
      recordConsent(userId, "accepted", true, true);
      updateCheckboxes();
      consentPopup.style.display = "none";
      manageCookiesTab.style.display = "block";
      handleCookies();
  });

  manageButton.addEventListener("click", function () {
      settings.style.display = "block";
      updateCheckboxes();
  });

  declineButton.addEventListener("click", function () {
      localStorage.setItem("fallsviewCookieConsent", sanitizeInput("declined"));
      localStorage.setItem("fallsviewAnalyticsCookies", sanitizeInput("true"));
      localStorage.setItem("fallsviewMarketingCookies", sanitizeInput("false"));
      localStorage.setItem("fallsviewConsentUpdated", sanitizeInput(new Date().toLocaleString()));
      recordConsent(userId, "declined", false, true);
      updateCheckboxes();
      consentPopup.style.display = "none";
      manageCookiesTab.style.display = "block";
      handleCookies();
  });

  closePopup.addEventListener("click", function () {
      consentPopup.style.display = "none";
  });

  manageCookiesTab.addEventListener("click", function () {
      consentPopup.style.display = "block";
      settings.style.display = "block";
      updateCheckboxes();
  });

  savePreferencesButton.addEventListener("click", function () {
      const marketingChecked = document.getElementById("fv-marketingCookies").checked;
      const consentType = marketingChecked ? 'custom' : 'declined';
      localStorage.setItem("fallsviewAnalyticsCookies", sanitizeInput("true"));
      localStorage.setItem("fallsviewMarketingCookies", sanitizeInput(marketingChecked.toString()));
      localStorage.setItem("fallsviewCookieConsent", sanitizeInput(consentType));
      localStorage.setItem("fallsviewConsentUpdated", sanitizeInput(new Date().toLocaleString()));
      recordConsent(userId, consentType, marketingChecked, true);
      consentPopup.style.display = "none";
      manageCookiesTab.style.display = "block";
      handleCookies();
  });

  // -------------------------------------------------------------- FUNCTIONS:

  function sanitizeInput(input) {
      const element = document.createElement('div');
      element.innerText = input;
      return element.innerHTML;
  }

  function handleCookies() {
      const marketingConsent = getMarketingConsent();

      console.log("Marketing consent status:", marketingConsent);

      gtag('consent', 'update', {
          'ad_storage': marketingConsent ? 'granted' : 'denied',
          'analytics_storage': 'granted',
      });

      (function(w,d,s,l,i){
          w[l]=w[l]||[];
          w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
          var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
          j.async = true;
          j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
          f.parentNode.insertBefore(j, f);
      })(window, document, 'script', 'dataLayer', 'GTM-5KHP8BR');

      if (marketingConsent) {
          console.log("Loading marketing scripts");
      } else {
          console.log("Deleting marketing cookies");
          deleteMarketingCookies();
      }
  }

  function deleteMarketingCookies() {
      console.log("Marketing cookies deleted");
  }

  async function recordConsent(userId, consentType, marketingConsent, analyticsConsent) {
      const userConsent = {
          userId: userId, // Associate the consent with the generated user ID
          consentType: consentType,
          marketingConsent: marketingConsent,
          analyticsConsent: analyticsConsent,
          timestamp: new Date().toISOString()
      };

      try {
          console.log("Sending data to PocketBase:", userConsent);
          const response = await pb.collection('userConsents').create(userConsent);
          console.log("Consent recorded:", response);
      } catch (error) {
          console.error("Error recording consent:", error);
      }
  }

  function updateCheckboxes() {
      document.getElementById("fv-analyticsCookies").checked = true;
      document.getElementById("fv-marketingCookies").checked = localStorage.getItem("fallsviewMarketingCookies") === "true";
  }

  function getMarketingConsent() {
      var consent = localStorage.getItem('fallsviewCookieConsent');
      var marketingConsent = localStorage.getItem('fallsviewMarketingCookies') === 'true';
      return (consent === 'accepted') || (consent === 'custom' && marketingConsent);
  }

  updateCheckboxes();
  handleCookies();
});
