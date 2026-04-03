# SMS Service Integration Guide

This guide explains how to set up and use the Twilio SMS service in your appointment booking system.

## Features
- **Appointment Confirmed**: Sends SMS when doctor confirms an appointment
- **Appointment Cancelled**: Sends SMS when appointment is cancelled  
- **Appointment Completed**: Sends SMS when appointment is marked as completed
- **Patient Phone Storage**: Uses phone numbers stored in MongoDB user profiles

## Setup Instructions

### Step 1: Get Twilio Credentials
1. Go to [Twilio Console](https://www.twilio.com/console)
2. Sign in to your account or create one
3. Find your:
   - **Account SID** (visible on dashboard)
   - **Auth Token** (visible on dashboard, click eye icon to reveal)
   - **Phone Number** (get a Twilio phone number from the Phone Numbers section)

### Step 2: Update Environment Variables
Open `.env` file and update with your Twilio credentials:

```env
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

Example with real format:
```env
TWILIO_ACCOUNT_SID=ACa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
TWILIO_AUTH_TOKEN=aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1w
TWILIO_PHONE_NUMBER=+1987654321
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Ensure Patient Phone Numbers Are Stored
Make sure when patients register, their phone numbers are saved in the database with country code format:
- Example: `+919876543210` (India)
- Example: `+14155552671` (USA)
- Format: `+[country code][phone number]`

If phone numbers are already stored without the `+` prefix, the SMS service will automatically add it.

## How It Works

### When Doctor Updates Appointment Status:

1. **Confirmed Status**
   ```
   Your appointment has been confirmed!
   
   Date: 2026-02-10
   Time: 10:00 AM
   Doctor: Dr. Sharma
   
   Thank you!
   ```

2. **Cancelled Status**
   ```
   Your appointment has been cancelled.
   
   Date: 2026-02-10
   Time: 10:00 AM
   
   Please contact us for rescheduling.
   ```

3. **Completed Status**
   ```
   Your appointment has been completed.
   
   Date: 2026-02-10
   Doctor: Dr. Sharma
   
   Thank you for visiting!
   ```

## API Endpoints

### Update Appointment Status
**Endpoint:** `PATCH /api/appointments/:id/status`

**Request Body:**
```json
{
  "status": "Confirmed"
}
```

**Valid Status Values:**
- `Confirmed`
- `Cancelled`
- `Completed`

**Response Example:**
```json
{
  "success": true,
  "message": "Appointment confirmed successfully. SMS notification sent to patient.",
  "appointment": {
    "_id": "507f1f77bcf86cd799439011",
    "patient_id": "507f1f77bcf86cd799439012",
    "doctor_id": "507f1f77bcf86cd799439013",
    "date": "2026-02-10",
    "time_slot": "10:00 AM",
    "status": "Confirmed",
    "createdAt": "2026-02-08T10:00:00.000Z"
  }
}
```

### Cancel Appointment
**Endpoint:** `PUT /api/appointments/cancel/:id`

**Response Example:**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully. SMS notification sent to patient.",
  "appointment": {
    "status": "Cancelled"
  }
}
```

## File Structure

```
services/
  └── smsService.js          # SMS service with Twilio integration

routes/
  └── appointments.js        # Updated with SMS functionality
  
.env                        # Contains Twilio credentials
package.json               # Added twilio dependency
```

## Error Handling

If SMS fails to send due to:
- **Invalid phone number**: Message will log warning and continue
- **Network error**: Check Twilio connection and credentials
- **Invalid credentials**: Verify .env file values
- **Daily SMS limit**: Check Twilio account limits

All errors are logged in console but don't block the appointment status update.

## Testing SMS Service

You can test with a sample phone number:

```javascript
// In your code or API testing tool
const smsService = require('./services/smsService');

await smsService.sendAppointmentSMS(
  '+919876543210',
  'Confirmed',
  {
    date: '2026-02-10',
    time_slot: '10:00 AM',
    doctorName: 'Dr. Sharma'
  }
);
```

## Troubleshooting

### 1. "SMS not sending"
- ✓ Verify Twilio credentials in .env
- ✓ Check phone number has `+` prefix and country code
- ✓ Ensure .env file is loaded (restart server after updating)
- ✓ Check Twilio account has credits/active trial

### 2. "Module not found: twilio"
```bash
npm install twilio
```

### 3. "Phone number not available"
- Update patient registration form to require phone number
- Ensure phone field is in user schema with country code format

### 4. Check Twilio Logs
Visit [Twilio Console → Logs](https://www.twilio.com/console/sms/logs) to see all SMS sent and debug any issues.

## Security Notes
- Never commit `.env` file to git (add to `.gitignore`)
- Keep Twilio credentials confidential
- Use environment variables for all sensitive data
- In production, validate international phone numbers properly

## Next Steps
1. ✅ Install Twilio package
2. ✅ Create SMS service
3. ✅ Add credentials to .env
4. ✅ Update appointment endpoints
5. 📋 Test with sample appointments
6. 📋 Deploy to production

Happy messaging! 🎉
