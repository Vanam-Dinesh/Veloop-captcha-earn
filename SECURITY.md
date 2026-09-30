# Security

## Authentication

The application uses JWT-based authentication for protected API endpoints.

Users must provide a valid JWT token to access private CAPTCHA and wallet operations.

## Password Security

User passwords are hashed using `bcryptjs` before being stored in the database.

Plain-text passwords are not stored.

## CAPTCHA Security

CAPTCHA correctness is determined by the backend.

The frontend does not decide whether an answer is correct or how many GEMs a user receives.

The correct CAPTCHA option is stored on the backend and is not exposed as a separate correct-answer field to the frontend.

## Challenge Ownership

CAPTCHA challenges are associated with the authenticated user.

A user cannot use another user's challenge.

## CAPTCHA Expiration

CAPTCHA challenges have an expiration time.

Expired challenges cannot be successfully verified.

## One-Time Verification

A CAPTCHA challenge can only be processed once.

This helps prevent replaying the same challenge to repeatedly receive rewards.

## Reward Claim Protection

Rewards are claimed through a backend endpoint.

A reward that has already been claimed cannot be claimed again.

## Wallet Security

GEM balances are maintained by the backend and stored in MongoDB.

The frontend does not directly modify the wallet balance.

## Environment Variables

Sensitive configuration such as:

- MongoDB connection details
- JWT secret
- Server configuration

should be stored in environment variables.

`.env` files are excluded from Git using `.gitignore`.

Never commit passwords, database credentials, JWT secrets, or other private credentials to GitHub.

## API Protection

Protected endpoints require authentication.

Unauthorized requests should be rejected by the backend authentication middleware.

## Security Testing

The application has been tested for security-related cases including:

- Expired CAPTCHA challenges
- Duplicate reward claims
- Reuse of CAPTCHA challenges
- Authentication-protected endpoints
- Backend-controlled reward calculation