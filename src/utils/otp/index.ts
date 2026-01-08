export const generateOTP = (expireMinutes = 15) => {
    const otp = Math.floor(Math.random() * 90000 + 10000);
    
    // Create expiry date and format it for MySQL (YYYY-MM-DD HH:MM:SS)
    const expireDate = new Date(Date.now() + expireMinutes * 60 * 1000);
    const otpExpire = expireDate.toISOString().slice(0, 19).replace('T', ' ');
    
    return { otp, otpExpire };
};
