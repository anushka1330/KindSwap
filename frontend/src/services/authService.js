// src/services/authService.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthService = {

  async register(email, password, confirmPassword, name, role, state, adminCode) {
    const body = { email, password, confirmPassword, name, role, state };
    if (adminCode) body.adminCode = adminCode;

    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed.');
    return data;
  },

  async verifyOTP(email, otp) {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Verification failed.');
    return data;
  },

  async resendOTP(email) {
    const res = await fetch(`${API_BASE}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not resend code.');
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error || 'Login failed.');
      err.requiresVerification = data.requiresVerification || false;
      err.email = email;
      throw err;
    }
    return data.user;
  },

  async logout() {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  },

  async getMe() {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        credentials: 'include'
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  }
};
