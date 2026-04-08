import axios from "axios";
import { API_AUTH_BASE_URL } from "@/config/env";
import { path } from "@/path";


// Create simple axios instance
const api = axios.create({
  baseURL: API_AUTH_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Send OTP
export const sendOtp = async (mobile: string) => {
  try {
    const response = await api.post(path.login, { mobile });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};

// Resend OTP (uses same endpoint as sendOtp)
export const resendOtp = async (mobile: string) => {
  return sendOtp(mobile);
};

// Verify OTP
export const verifyOtp = async (mobile: string, otp: string, role: string = 'DRIVER') => {
  console.log('verifyOtp called:', { mobile, otp, role });
  console.log('API endpoint:', path.verifyOtp);
  try {
    const response = await api.post(path.verifyOtp, { mobile, otp, role });
    console.log('verifyOtp response:', response.data);
    return response.data;
  } catch (error: any) {
    console.log('verifyOtp error:', error?.response?.data || error.message);
    return {
      success: false,
      message: error?.response?.data?.message || "Invalid or expired OTP",
    };
  }
};