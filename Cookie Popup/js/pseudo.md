Cookie Consent Management Script Documentation

- [1. Initialization](#1-initialization)
  - [1.1 Document Ready Event](#11-document-ready-event)
  - [1.2 Get References to Key DOM Elements](#12-get-references-to-key-dom-elements)
  - [1.3 Check User Consent](#13-check-user-consent)
- [2. Event Listeners](#2-event-listeners)
  - [2.1 Accept All Cookies](#21-accept-all-cookies)
  - [2.2 Manage Cookie Preferences](#22-manage-cookie-preferences)
  - [2.3 Decline Non-Essential Cookies](#23-decline-non-essential-cookies)
  - [2.4 Close Popup](#24-close-popup)
  - [2.5 Show Popup Again](#25-show-popup-again)
  - [2.6 Save Preferences](#26-save-preferences)
- [3. Functions](#3-functions)
  - [3.1 Load Script](#31-load-script)
  - [3.2 Delete Cookie](#32-delete-cookie)
  - [3.3 Delete Google Analytics Cookies](#33-delete-google-analytics-cookies)
  - [3.4 Handle Cookies](#34-handle-cookies)
  - [3.5 Update Checkboxes](#35-update-checkboxes)
- [4. Initial Calls](#4-initial-calls)
  - [4.1 Initial Call to Handle Cookies](#41-initial-call-to-handle-cookies)
  - [4.2 Initial Call to Update Checkboxes](#42-initial-call-to-update-checkboxes)

## 1. Initialization

### 1.1 Document Ready Event

- Wait for the document to fully load.

### 1.2 Get References to Key DOM Elements

- `consentPopup`
- `manageCookiesTab`
- `closePopup`
- `acceptButton`
- `manageButton`
- `declineButton`
- `savePreferencesButton`
- `settings`

### 1.3 Check User Consent

- If no consent has been recorded in `localStorage`:
  - Display the `consentPopup`.
- Otherwise:
  - Display the `manageCookiesTab`.

## 2. Event Listeners

### 2.1 Accept All Cookies

- When `acceptButton` is clicked:
  1. Set `cookieConsent` to "accepted" in `localStorage`.
  2. Set `analyticsCookies` to "true" in `localStorage`.
  3. Set `otherCookies` to "true" in `localStorage`.
  4. Call `updateCheckboxes()`.
  5. Hide the `consentPopup`.
  6. Display the `manageCookiesTab`.
  7. Call `handleCookies()` to apply the cookie settings.

### 2.2 Manage Cookie Preferences

- When `manageButton` is clicked:
  1. Display the `settings` section for managing cookie preferences.
  2. Call `updateCheckboxes()` to ensure checkboxes are up-to-date.

### 2.3 Decline Non-Essential Cookies

- When `declineButton` is clicked:
  1. Set `cookieConsent` to "declined" in `localStorage`.
  2. Set `analyticsCookies` to "false" in `localStorage`.
  3. Set `otherCookies` to "false" in `localStorage`.
  4. Call `updateCheckboxes()`.
  5. Hide the `consentPopup`.
  6. Display the `manageCookiesTab`.
  7. Call `handleCookies()` to apply the cookie settings.

### 2.4 Close Popup

- When `closePopup` is clicked:
  1. Hide the `consentPopup`.

### 2.5 Show Popup Again

- When `manageCookiesTab` is clicked:
  1. Display the `consentPopup`.
  2. Display the `settings` section.
  3. Call `updateCheckboxes()`.

### 2.6 Save Preferences

- When `savePreferencesButton` is clicked:
  1. Get the states of the cookie checkboxes:
     - `analyticsChecked`
     - `otherChecked`
  2. Save these states in `localStorage`.
  3. Set `cookieConsent` to "custom" in `localStorage`.
  4. Hide the `consentPopup`.
  5. Display the `manageCookiesTab`.
  6. Call `handleCookies()` to apply the updated cookie settings.

## 3. Functions

### 3.1 Load Script

- Dynamically load a script if it is not already present on the page.

### 3.2 Delete Cookie

- Remove a specified cookie by setting its Max-Age to a negative value.

### 3.3 Delete Google Analytics Cookies

- Remove Google Analytics cookies by calling `deleteCookie()` for each relevant cookie.

### 3.4 Handle Cookies

- Retrieve consent settings from `localStorage`.
- Load or delete cookies based on the user's consent status:
  - Always load essential cookies.
  - Load analytics cookies if consented.
  - Load other cookies if consented.

### 3.5 Update Checkboxes

- Update checkboxes based on stored preferences in `localStorage`.

## 4. Initial Calls

### 4.1 Initial Call to Handle Cookies

- Call `handleCookies()` to set up the initial state of cookies based on the current settings.

### 4.2 Initial Call to Update Checkboxes

- Call `updateCheckboxes()` to ensure checkboxes reflect the current settings.
