const twilio = require('twilio');

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Send SMS notification to patient
 * @param {string} toPhoneNumber - Patient's phone number (with country code, e.g., +919876543210)
 * @param {string} status - Appointment status (Confirmed, Cancelled, Completed)
 * @param {object} appointmentData - Appointment details (date, time, doctor name)
 */
const sendAppointmentSMS = async (toPhoneNumber, status, appointmentData) => {
  try {
    // Format phone number: ensure it starts with +
    const formattedNumber = toPhoneNumber.startsWith('+') ? toPhoneNumber : '+' + toPhoneNumber;

    let messageBody = '';

    switch (status) {
      case 'Confirmed':
        messageBody = `Your appointment has been confirmed!\n\nDate: ${appointmentData.date}\nTime: ${appointmentData.time_slot}\nDoctor: ${appointmentData.doctorName}\n\nThank you!`;
        break;
      case 'Cancelled':
        messageBody = `Your appointment has been cancelled.\n\nDate: ${appointmentData.date}\nTime: ${appointmentData.time_slot}\n\nPlease contact us for rescheduling.`;
        break;
      case 'Completed':
        messageBody = `Your appointment has been completed.\n\nDate: ${appointmentData.date}\nDoctor: ${appointmentData.doctorName}\n\nThank you for visiting!`;
        break;
      default:
        messageBody = `Your appointment status has been updated to: ${status}`;
    }

    // Send SMS via Twilio
    const message = await client.messages.create({
      body: messageBody,
      from: fromNumber,
      to: formattedNumber
    });

    console.log(`✅ SMS sent successfully. Message SID: ${message.sid}`);
    return { success: true, messageSid: message.sid };

  } catch (error) {
    console.error('❌ Error sending SMS:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendAppointmentSMS
};
