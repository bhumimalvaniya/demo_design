import twilio from 'twilio';//npm i twilio

export const sendOtp = async (phone_no) => {
  try {
    const cleanPhone = phone_no.toString().replace(/^(\+91|91|0)/, '');

    // ✅ Print exact values to check
    console.log("SID:", process.env.TWILIO_ACCOUNT_SID);
    console.log("TOKEN:", process.env.TWILIO_AUTH_TOKEN);
    console.log("VERIFY SID:", process.env.TWILIO_VERIFY_SID);

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({
        to: `+91${cleanPhone}`,
        channel: 'sms',
      });

    console.log("OTP sent successfully!");
    return true;

  } catch (error) {
    console.error("Verify Error Code:", error.code);
    console.error("Verify Error Message:", error.message);
    return false;
  }
};

export const verifyOtpCode = async (phone_no, otp) => {
  try {
    const cleanPhone = phone_no.toString().replace(/^(\+91|91|0)/, '');

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const result = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({
        to: `+91${cleanPhone}`,
        code: otp,
      });

    console.log("Verify status:", result.status);
    return result.status === 'approved';

  } catch (error) {
    console.error("Verify Check Error:", error.message);
    return false;
  }
};