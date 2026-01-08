export const generateOTP = (expireMinutes = 15) => {
    const otp = Math.floor(Math.random() * 90000 + 10000);
    
    // Create expiry date and format it for MySQL (YYYY-MM-DD HH:MM:SS) in LOCAL time
    const expireDate = new Date(Date.now() + expireMinutes * 60 * 1000);
    
    // Format in local time (not UTC)
    const year = expireDate.getFullYear();
    const month = String(expireDate.getMonth() + 1).padStart(2, '0');
    const day = String(expireDate.getDate()).padStart(2, '0');
    const hours = String(expireDate.getHours()).padStart(2, '0');
    const minutes = String(expireDate.getMinutes()).padStart(2, '0');
    const seconds = String(expireDate.getSeconds()).padStart(2, '0');
    
    const otpExpire = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    return { otp, otpExpire };
};
