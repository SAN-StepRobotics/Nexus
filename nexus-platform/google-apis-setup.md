# Google Cloud Console Setup Guide

## Your Project Details
- **Project ID:** cohesive-poet-471807-k1
- **Client ID:** 523692462668-ilqt71huadfq025bqsps2h91t8fred8n.apps.googleusercontent.com

## Required APIs to Enable

Visit the Google Cloud Console and enable these APIs for your project:

1. **Google Drive API**
   - Go to: https://console.cloud.google.com/apis/library/drive.googleapis.com?project=cohesive-poet-471807-k1
   - Click "Enable"

2. **Google Sheets API** (Optional, for future features)
   - Go to: https://console.cloud.google.com/apis/library/sheets.googleapis.com?project=cohesive-poet-471807-k1
   - Click "Enable"

## OAuth Consent Screen Setup

1. Go to: https://console.cloud.google.com/apis/credentials/consent?project=cohesive-poet-471807-k1

2. Configure the OAuth consent screen:
   - **User Type:** External (for testing) or Internal (if you have a Google Workspace)
   - **App Name:** Nexus Workflow Platform
   - **User Support Email:** Your email
   - **Developer Contact Information:** Your email

3. **Scopes:** Add these scopes for Drive integration:
   - `https://www.googleapis.com/auth/drive.file`
   - `https://www.googleapis.com/auth/drive.folders`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`

4. **Test Users:** Add your email address for testing

## Authorized Redirect URIs

Make sure your OAuth 2.0 client has these redirect URIs:
- `http://localhost:3000/api/auth/callback/google`
- `http://localhost:3000/api/auth/callback/google-drive` (for company Drive connections)

## Quick Links for Your Project:
- APIs & Services: https://console.cloud.google.com/apis/dashboard?project=cohesive-poet-471807-k1
- Credentials: https://console.cloud.google.com/apis/credentials?project=cohesive-poet-471807-k1
- OAuth Consent: https://console.cloud.google.com/apis/credentials/consent?project=cohesive-poet-471807-k1