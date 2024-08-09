# Cookie Consent Management Application

## Overview
This application is designed to manage user consent for cookies on a website in a meaningful way. It allows users to accept, decline, or manage their cookie preferences, ensuring compliance with privacy regulations such as the PIPEDA. The application uses JavaScript to handle user interactions and localStorage to save user preferences.

## Features
1. **Cookie Consent Popup:** A popup that asks users for consent to use cookies.
2. **Manage Cookies Tab:** A tab that allows users to manage their cookie preferences at any time.
3. **Essential Cookies:** Always enabled for the website to function properly.
4. **Analytics and Other Cookies:** Optional cookies that can be accepted or declined by the user.
5. **Local Storage:** Saves user preferences to localStorage to remember their choices on subsequent visits.

## How It Works

### Initialization
1. **Document Ready Event:** The script waits for the document to fully load.
2. **Get References to Key DOM Elements:** Key elements such as consentPopup, manageCookiesTab, closePopup, acceptButton, manageButton, declineButton, savePreferencesButton, and settings are accessed using `document.getElementById()`.

### Check User Consent
1. **Check LocalStorage:** If no consent has been recorded, the consentPopup is displayed.
2. **Display Manage Cookies Tab:** If consent is already recorded, the manageCookiesTab is displayed.

### Event Listeners
1. **Accept All Cookies:**
   - Set cookieConsent to "accepted" in localStorage.
   - Set analyticsCookies and otherCookies to "true" in localStorage.
   - Update checkboxes and hide the consentPopup.
   - Display the manageCookiesTab and apply cookie settings by calling `handleCookies()`.

2. **Manage Cookie Preferences:**
   - Display the settings section for managing cookie preferences.
   - Ensure checkboxes are up-to-date by calling `updateCheckboxes()`.

3. **Decline Non-Essential Cookies:**
   - Set cookieConsent to "declined" in localStorage.
   - Set analyticsCookies and otherCookies to "false" in localStorage.
   - Update checkboxes and hide the consentPopup.
   - Display the manageCookiesTab and apply cookie settings by calling `handleCookies()`.

4. **Close Popup:**
   - Hide the consentPopup when the close button is clicked.

5. **Show Popup Again:**
   - Display the consentPopup and settings section when the manageCookiesTab is clicked.
   - Ensure checkboxes are up-to-date by calling `updateCheckboxes()`.

6. **Save Preferences:**
   - Save the states of the cookie checkboxes in localStorage.
   - Set cookieConsent to "custom" in localStorage.
   - Hide the consentPopup and display the manageCookiesTab.
   - Apply the updated cookie settings by calling `handleCookies()`.

### Functions
1. **Load Script:** Dynamically load a script if it is not already present on the page.
2. **Delete Cookie:** Remove a specified cookie by setting its Max-Age to a negative value.
3. **Delete Google Analytics Cookies:** Remove Google Analytics cookies by calling `deleteCookie()` for each relevant cookie.
4. **Handle Cookies:** Retrieve consent settings from localStorage and load or delete cookies based on the user's consent status.
5. **Update Checkboxes:** Update checkboxes based on stored preferences in localStorage.

### Initial Calls
1. **Initial Call to Handle Cookies:** Set up the initial state of cookies based on the current settings.
2. **Initial Call to Update Checkboxes:** Ensure checkboxes reflect the current settings.