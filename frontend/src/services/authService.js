// src/services/authService.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthService = {

  /**
   * Real-time KindSwap ID availability check
   */
  async checkKindswapId(kindswapId) {
    if (!kindswapId) return { available: false, message: '' };
    try {
      const res = await fetch(`${API_BASE}/auth/check-id?kindswapId=${encodeURIComponent(kindswapId.trim())}`);
      const data = await res.json();
      return data;
    } catch {
      return { available: false, message: 'Could not verify ID availability.' };
    }
  },

  /**
   * Register Page 1: Create KindSwap ID & Password (No OTP!)
   */
  async register({ kindswapId, password, confirmPassword, role = 'donor', state = 'India', adminCode = '' }) {
    const body = { kindswapId, password, confirmPassword, role, state };
    if (adminCode) body.adminCode = adminCode;

    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed.');
    return data.user;
  },

  /**
   * Login with KindSwap ID + Password
   */
  async login(kindswapId, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ kindswapId: kindswapId.trim(), password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed.');
    }
    return data.user;
  },

  /**
   * Log out and destroy session
   */
  async logout() {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  },

  /**
   * Page 2: Tell us about yourself (Name, Age, City/Location)
   */
  async updateProfile({ name, age, city, state }) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, age, city, state })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile.');
    return data.user;
  },

  /**
   * Session restoration
   */
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
