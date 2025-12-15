/**
 * Client-side message constants for user feedback
 */

export const MESSAGES = {
  // Auth messages
  LOGIN_SUCCESS: "Login successful!",
  LOGIN_ERROR: "Login failed. Please try again.",
  SIGNUP_SUCCESS: "Account created successfully!",
  SIGNUP_ERROR: "Signup failed. Please try again.",
  LOGOUT_SUCCESS: "Logged out successfully",
  LOGOUT_INFO: "Logged out",

  // Token messages
  TOKEN_REFRESH_FAILED: "Session expired. Please login again.",

  // Chat messages
  CHAT_CREATED: "Chat created successfully!",
  CHAT_CREATE_ERROR: "Failed to create chat. Please try again.",
  MESSAGE_SENT: "Message sent!",
  MESSAGE_SEND_ERROR: "Failed to send message. Please try again.",

  // Generic messages
  SOMETHING_WENT_WRONG: "Something went wrong. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
} as const;