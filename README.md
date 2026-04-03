**MediBridge — Appointment & SMS Notifications**

Simple appointment booking backend with Twilio SMS notifications for patients when doctors update appointment status.

**Quick Start**
- **Prerequisites:** Node.js, npm, MongoDB, Twilio account
- Clone / open the project and install dependencies:

```bash
cd "d:\project sem 5\sms updating\selected"
npm install
```

**Environment**
- Copy and edit the `.env` file in the project root. Required values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/MediBridge
JWT_SECRET=your_jwt_secret

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

**Run**

```bash
npm start    # production
npm run dev  # development (nodemon)
```

**Features**
- Book appointments (`POST /api/appointments/book`)
- Doctor updates status (`PATCH /api/appointments/:id/status`) — sends SMS on `Confirmed`, `Cancelled`, `Completed`
- Cancel appointment (`PUT /api/appointments/cancel/:id`) — sends cancellation SMS

**Important notes**
- Patient phone numbers must be stored in the `User` documents (`phone` field) and should include a country code (e.g. `+919876543210`). The service will prepend `+` if missing but correct international formatting is recommended.
- Twilio credentials in `.env` must be valid and the Twilio number must be able to send SMS to the target country (trial accounts require verified recipient numbers).

**Files of interest**
- `main.js` — app entry
- `routes/appointments.js` — booking and status endpoints (SMS hooks)
- `services/smsService.js` — Twilio SMS wrapper
- `models/Appointment.js`, `models/user.js` — data models

**Technologies**
- Node.js / Express — server and REST API
- MongoDB + Mongoose — data persistence
- Twilio — SMS gateway
- dotenv — environment variables
- bcrypt / jsonwebtoken — auth and password hashing

**Learning resources (recommended order)**
- JavaScript: MDN Guide — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
- Node.js: Official docs — https://nodejs.org/en/docs/
- Express: https://expressjs.com/
- MongoDB: https://www.mongodb.com/docs/ and MongoDB University M001
- Mongoose: https://mongoosejs.com/docs/guide.html
- JWT Auth: https://jwt.io/introduction/
- Twilio SMS quickstart (Node): https://www.twilio.com/docs/sms/quickstart/node

**Testing**
- Use Postman or curl to hit the endpoints. After changing an appointment status, check Twilio logs: https://www.twilio.com/console/sms/logs

**Contact / Next steps**
- If you want, I can add example Postman collections, a small test script to trigger SMS, or add phone validation logic before sending.
