# Testing

## Test Environment

- Backend: Node.js + Express.js
- Frontend: React + Vite
- Database: MongoDB
- API testing: PowerShell / REST requests
- Browser testing: Local React application

## Functional Tests

### 1. User Registration

**Test:** Register a new user.

**Expected:** Account is created successfully and a JWT token is returned.

**Result:** Passed

### 2. User Login

**Test:** Login using valid credentials.

**Expected:** Login succeeds and a JWT token is returned.

**Result:** Passed

### 3. CAPTCHA Generation

**Test:** Request a new CAPTCHA.

**Expected:** A challenge containing four distinct options is returned.

**Result:** Passed

### 4. Correct CAPTCHA

**Test:** Submit the correct option.

**Expected:** CAPTCHA is marked correct and the user receives 1 GEM.

**Result:** Passed

### 5. Incorrect CAPTCHA

**Test:** Submit an incorrect option.

**Expected:** CAPTCHA is marked incorrect and the user receives 0.5 GEM.

**Result:** Passed

### 6. Reward Claim

**Test:** Claim an available reward.

**Expected:** Reward status changes to CLAIMED and the wallet is updated.

**Result:** Passed

### 7. Duplicate Claim Protection

**Test:** Attempt to claim the same reward again.

**Expected:** The backend rejects the duplicate claim.

**Result:** Passed

### 8. CAPTCHA Expiration

**Test:** Attempt to verify an expired CAPTCHA.

**Expected:** The backend rejects the expired challenge.

**Result:** Passed

### 9. No Thanks

**Test:** Select the No Thanks option.

**Expected:** The previous challenge is invalidated and a new challenge is generated.

**Result:** Passed

### 10. Wallet Balance

**Test:** Check the wallet after successful rewards.

**Expected:** GEM balance reflects the earned rewards.

**Result:** Passed

### 11. CAPTCHA History

**Test:** Request CAPTCHA history for the authenticated user.

**Expected:** Previous CAPTCHA attempts and reward information are returned.

**Result:** Passed

## Security Tests

The following security-related cases were verified:

- JWT authentication is required for protected endpoints.
- Expired CAPTCHA challenges are rejected.
- CAPTCHA challenges cannot be reused after processing.
- Rewards cannot be claimed more than once.
- Reward calculation is controlled by the backend.
- CAPTCHA correct answers are not exposed separately to the frontend.
- Environment files are excluded from Git.

## Test Summary

| Test | Result |
|---|---|
| Registration | Passed |
| Login | Passed |
| CAPTCHA generation | Passed |
| Correct answer | Passed |
| Incorrect answer | Passed |
| Reward claim | Passed |
| Duplicate claim protection | Passed |
| CAPTCHA expiration | Passed |
| No Thanks flow | Passed |
| Wallet balance | Passed |
| CAPTCHA history | Passed |