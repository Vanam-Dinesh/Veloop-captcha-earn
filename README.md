# VELoop CAPTCHA Earn

A full-stack CAPTCHA reward application where authenticated users solve CAPTCHA challenges and earn GEM rewards.

## Features

- User registration and login
- JWT-based authentication
- CAPTCHA challenge generation
- Four CAPTCHA options per challenge
- One correct option, two similar incorrect options, and one unrelated option
- Correct answer reward: +1 GEM
- Incorrect answer reward: +0.5 GEM
- CAPTCHA expiry and one-time verification
- Claim reward protection against duplicate claims
- No Thanks option to generate a fresh challenge
- Wallet balance tracking
- CAPTCHA attempt history
- MongoDB persistence
- Responsive React frontend
- Express.js REST API

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Project Structure

```text
Veloop-captcha-earn/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md