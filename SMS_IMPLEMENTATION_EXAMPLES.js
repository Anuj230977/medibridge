/*
 * SMS Service Implementation Examples
 * File: services/smsService.js
 * 
 * This file handles all SMS communications with patients via Twilio
 */

// EXAMPLE 1: Appointment Confirmed SMS
// Status: "Confirmed"
// Message sent to patient:
/*
Your appointment has been confirmed!

Date: 2026-02-15
Time: 3:00 PM
Doctor: Dr. Sharma

Thank you!
*/

// EXAMPLE 2: Appointment Cancelled SMS  
// Status: "Cancelled"
// Message sent to patient:
/*
Your appointment has been cancelled.

Date: 2026-02-15
Time: 3:00 PM

Please contact us for rescheduling.
*/

// EXAMPLE 3: Appointment Completed SMS
// Status: "Completed"
// Message sent to patient:
/*
Your appointment has been completed.

Date: 2026-02-15
Doctor: Dr. Sharma

Thank you for visiting!
*/

// ============================================
// INTEGRATION POINTS IN APPOINTMENTS ROUTE
// ============================================

// When status is updated via API endpoint:
// PATCH /api/appointments/:appointmentId/status
// Request body: { "status": "Confirmed" }

// The route automatically:
// 1. Fetches patient and doctor details
// 2. Extracts patient's phone number
// 3. Calls sendAppointmentSMS()
// 4. Sends customized message based on status

// When appointment is cancelled:
// PUT /api/appointments/cancel/:appointmentId

// The route automatically:
// 1. Updates appointment status to "Cancelled"
// 2. Sends cancellation SMS to patient

// ============================================
// PHONE NUMBER FORMAT REQUIREMENTS
// ============================================

// Phone must be stored with country code:
// Example: +919876543210  (India)
// Example: +14155552671   (USA)
// Example: +441632960000  (UK)

// SMS Service will handle:
// ✓ Adding '+' if missing
// ✓ International number formatting
// ✗ Validating correct country codes (manual validation recommended)

// ============================================
// ERROR HANDLING
// ============================================

// All errors are caught and logged:
// - Twilio API errors
// - Invalid phone numbers
// - Network connectivity issues
// - Missing patient phone number

// Errors do NOT block appointment status updates
// Check console for SMS operation status

// ============================================
// TWILIO ACCOUNT SETUP CHECKLIST
// ============================================

/*
□ Create Twilio account (https://www.twilio.com)
□ Verify phone number (or business)
□ Get Account SID from dashboard
□ Get Auth Token from dashboard
□ Purchase Twilio phone number
□ Update .env with credentials:
  TWILIO_ACCOUNT_SID=AC...
  TWILIO_AUTH_TOKEN=...
  TWILIO_PHONE_NUMBER=+...
□ Npm install twilio
□ Restart Node server
□ Test with sample appointment status change
□ Check Twilio logs for delivery confirmation
*/

// ============================================
// PATIENT PHONE NUMBER UPDATES
// ============================================

// User/Patient model should have phone field:
// {
//   name: String,
//   email: String,
//   password: String,
//   role: "patient" | "doctor",
//   phone: String,  // MUST include country code
//   dob: Date,
//   gender: String,
//   address: String
// }

// When registering patient, ensure phone includes country code
// Example frontend validation:
/*
if (!phone.startsWith('+')) {
  // Add country code
  phone = '+91' + phone; // For India
}
*/

// ============================================
// TESTING THE SMS SERVICE
// ============================================

// Test endpoint using curl:
/*
curl -X PATCH http://localhost:5000/api/appointments/appointmentId/status \
  -H "Content-Type: application/json" \
  -d '{"status":"Confirmed"}'
*/

// Test endpoint using Postman:
/*
Method: PATCH
URL: http://localhost:5000/api/appointments/:appointmentId/status
Body (JSON): {
  "status": "Confirmed"
}
*/

// ============================================
// TWILIO CONSOLE VERIFICATION
// ============================================

// After sending SMS, verify in Twilio console:
// 1. Go to https://www.twilio.com/console
// 2. Click "Messaging" → "SMS"
// 3. View sent messages log
// 4. Check delivery status and recipient number
// 5. If failed, check error message for debugging

// ============================================
// PRODUCTION CONSIDERATIONS
// ============================================

/*
✓ Use environment variables for all credentials
✓ Implement SMS delivery retry logic
✓ Add database logging for SMS attempts
✓ Set up error alerting
✓ Validate international phone numbers properly
✓ Implement SMS rate limiting to avoid costs
✓ Monitor Twilio account balance
✓ Use Twilio webhook for delivery receipts
✓ Implement message queuing for high volume
*/
