# MediBridge - Appointment Booking + SMS Notifications

## 🚀 Project Overview
MediBridge is a full-stack medical appointment system built with Node.js, Express, MongoDB, and Twilio. It provides:
- Patient and doctor registration and authentication (JWT)
- Session-safe login for doctors and patients
- Appointment booking, modification, and cancellation
- SMS notifications via Twilio when appointment status changes
- Admin-style doctor schedule management

## 🧩 Core Features
- **User authentication** with secure password hashing (`bcrypt`) and token-based sessions (`JWT`).
- **Role-based endpoints** (patient vs doctor) with middleware checks in `middleware/auth.js`.
- **Appointment lifecycle**:
  - Book: `POST /api/appointments/book`
  - View: `GET /api/appointments` and filtered by doctor/user
  - Update status: `PATCH /api/appointments/:id/status` (`Confirmed`, `Cancelled`, `Completed`)
  - Cancel: `PUT /api/appointments/cancel/:id`
- **SMS notifications** handled in `services/smsService.js`:
  - Sends patient alerts for confirmed, cancelled, completed appointments
  - Uses Twilio API with credentials in `.env`
- **Session management** (front-end helper in `public/js/sessionManager.js`):
  - login persistence across pages
  - logout and route protections
- **Security hardening**:
  - Passwords hashed before save in models (e.g., `generateHash.js`)
  - JWT token authentication with expiration
  - `.env` secrets excluded from repo via `.gitignore`

## 📁 Project Structure
- `main.js` - app entry point, server configuration, middleware setup
- `routes/auth.js` - registration, login, token refresh, role fetch
- `routes/doctors.js` - doctor profile, schedule, listing
- `routes/appointments.js` - appointment requests, status updates
- `services/smsService.js` - Twilio integration + send message logic
- `models/User.js`, `models/Doctor.js`, `models/Appointment.js` - Mongoose schemas
- `middleware/auth.js` - token validation and role guard
- `public/` - UI pages (login, booking, dashboard, profile)
- `docs/` - architecture diagrams and guides (DFD, UML, SMS docs)

## 🛠️ Setup Guide
### Requirements
- Node.js (>=16), npm
- MongoDB (local or Atlas)
- Twilio account (for SMS)

### Installation
```bash
cd "d:/project sem 5/final project for github/sms updating/selected"
npm install
```

### Configure environment
Create `.env` in root:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/MediBridge
JWT_SECRET=your_jwt_secret

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Run
- Dev: `npm run dev` (uses nodemon)
- Prod: `npm start`

## 🧪 Testing Endpoints
Use Postman/Insomnia or curl.
1. Register user: `POST /api/auth/register`
2. Login: `POST /api/auth/login`
3. Book appointment: `POST /api/appointments/book`
4. Doctor state change: `PATCH /api/appointments/:id/status`
5. Check MongoDB to validate appointment writes
6. Check Twilio SMS logs after status update

## 🔒 Session and Security Notes
- JWT tokens are stored as HTTP-only cookies (or client storage in UI scripts).
- Protected routes require `Authorization: Bearer <token>`.
- Passwords are hashed with `bcrypt` and never stored in plain text.
- `.env` is excluded via `.gitignore`.

## 📘 Docs and Design
All architecture docs are now in `docs/`:
- `docs/DFD_DIAGRAMS.md`
- `docs/DFD_VISUAL_DIAGRAMS.md`
- `docs/UML_DIAGRAMS.md`
- `docs/UML_GUIDE.txt`
- `docs/SMS_SETUP_GUIDE.md`
- `docs/SMS_IMPLEMENTATION_EXAMPLES.js`

## ✨ Changelog (high-level)
- Added APIs for appointments, doctors, authentication
- Added Twilio SMS integration for real-time user notifications
- Added session management and secure authentication
- Moved docs into structured `docs/` folder for clarity

## 🙌 Next Improvements
- Add server-side validation for phone and email format
- Add rate limiting (`express-rate-limit`) to protect SMS endpoints
- Add unit tests (Jest/Supertest) for routes and middleware
- Add frontend form validations and better error displays

---
**Tip:** press `Ctrl + C` in the running terminal to stop the server, or use a process manager like PM2 for production.

