

const gmailContent = (verificationToken) => {
  return `
    <h1 style="color: #008080; font-family: 'Arial', sans-serif; text-align: center;">Email Verification</h1>
    
    <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px;">
      <p style="font-size: 16px; font-family: 'Arial', sans-serif; color: #444; text-align: center;">Click the button below to verify your email:</p>
      <div style="text-align: center; margin-top: 20px;">
        <a href="https://notesbackend-biux.onrender.com/api/v1/users/emailverify/${verificationToken}" style="display: inline-block; background-color: #008080; color: #fff; font-size: 18px; font-family: 'Arial', sans-serif; text-decoration: none; padding: 10px 20px; border-radius: 5px; border: 2px solid #008080; transition: background-color 0.3s ease-in-out;">
          Verify Email
        </a>
      </div>
    </div>
    `;

}
const OtpContent = (otpcode) => {
  return `
    <h1 style="color: #008080; font-family: 'Arial', sans-serif; text-align: center;">NotesBeta</h1>
    <h1 style="color: #008080; font-family: 'Arial', sans-serif; text-align: center;">Reset Password</h1>
    <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px;">
        <p style="font-size: 16px; font-family: 'Arial', sans-serif; color: #444; text-align: center;">Your OTP for resetting password is:</p>
        <div style="text-align: center; margin-top: 20px;">
            <h1>${otpcode}</h1>
        </div>
    </div>
    `;
}

const successFullVerification = () => {
  return `
  <h1 style="color: #008080; font-family: 'Arial', sans-serif; text-align: center;">Congratulations!</h1>
  <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px;">
    <p style="font-size: 16px; font-family: 'Arial', sans-serif; color: #444; text-align: center;">You have successfully verified your email.</p>
    <div style="text-align: center; margin-top: 20px;">
      <a href="https://www.noteshare.online/login" style="display: inline-block; background-color: #008080; color: #fff; font-size: 18px; font-family: 'Arial', sans-serif; text-decoration: none; padding: 10px 20px; border-radius: 5px; border: 2px solid #008080; transition: background-color 0.3s ease-in-out;">
        Go to Home Page
      </a>
    </div>
  </div>
`;
}

module.exports = {
  gmailContent,
  OtpContent,
  successFullVerification
}

