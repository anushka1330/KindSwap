const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const AuthQueries = require('../queries/authQueries');

const BCRYPT_ROUNDS = 10;

// KindSwap ID rules: 3-30 chars, alphanumeric + underscores, no spaces
function validateKindswapId(kindswapId) {
  if (!kindswapId || typeof kindswapId !== 'string') {
    throw new Error('Please enter a KindSwap ID.');
  }
  const trimmed = kindswapId.trim();
  if (trimmed.length < 3 || trimmed.length > 30) {
    throw new Error('KindSwap ID must be between 3 and 30 characters.');
  }
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
    throw new Error('KindSwap ID can only contain letters, numbers, and underscores.');
  }
  return trimmed;
}

// Password rules: ≥ 8 chars, uppercase, lowercase, number
function validatePassword(password) {
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter.');
  }
  if (!/[a-z]/.test(password)) {
    throw new Error('Password must contain at least one lowercase letter.');
  }
  if (!/[0-9]/.test(password)) {
    throw new Error('Password must contain at least one number.');
  }
}

const AuthService = {
  /**
   * Check whether a KindSwap ID is available
   */
  async checkIdAvailability(kindswapId) {
    try {
      const normalized = validateKindswapId(kindswapId);
      const exists = await AuthQueries.checkKindswapIdExists(normalized);
      if (exists) {
        return {
          available: false,
          message: 'This KindSwap ID is already taken.'
        };
      }
      return {
        available: true,
        message: 'KindSwap ID is available ✓'
      };
    } catch (err) {
      return {
        available: false,
        message: err.message
      };
    }
  },

  /**
   * Register a new user with KindSwap ID + Password (No OTP!)
   */
  async register({ kindswapId, password, confirmPassword, role, state }) {
    const validId = validateKindswapId(kindswapId);
    validatePassword(password);

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    const allowedRoles = ['donor', 'ngo', 'admin'];
    if (!allowedRoles.includes(role)) {
      throw new Error('Invalid role selected.');
    }

    // Check availability
    const exists = await AuthQueries.checkKindswapIdExists(validId);
    if (exists) {
      throw new Error('This KindSwap ID is already taken. Please choose another one.');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Create user record
    const userId = uuidv4();
    try {
      await AuthQueries.createUser({
        id: userId,
        kindswap_id: validId,
        password_hash: passwordHash,
        name: null,
        role,
        state: state || 'India',
        city: null,
        email: null
      });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new Error('This KindSwap ID is already taken. Please choose another one.');
      }
      throw err;
    }

    // Return safe user object for immediate login session creation
    return {
      id: userId,
      kindswap_id: validId,
      name: null,
      age: null,
      city: null,
      state: state || 'India',
      role
    };
  },

  /**
   * Login with KindSwap ID + Password
   */
  async login(kindswapId, password) {
    if (!kindswapId || !password) {
      throw new Error('KindSwap ID and password are required.');
    }

    const user = await AuthQueries.findUserByKindswapId(kindswapId);
    if (!user || !user.password_hash) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Return safe user object
    return {
      id: user.id,
      kindswap_id: user.kindswap_id,
      email: user.email,
      name: user.name,
      age: user.age,
      city: user.city,
      state: user.state,
      role: user.role
    };
  },

  /**
   * Update profile (Page 2: Full Name, Age, City/Location)
   */
  async updateProfile(userId, { name, age, city, state }) {
    if (!userId) {
      throw new Error('User ID is required.');
    }

    // Full name validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new Error('Please enter your full name.');
    }
    const trimmedName = name.trim();
    if (trimmedName.length > 100) {
      throw new Error('Full name cannot exceed 100 characters.');
    }

    // Age validation
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 5 || ageNum > 120) {
      throw new Error('Please enter a valid age between 5 and 120.');
    }

    // City / Location validation
    let trimmedCity = null;
    if (city && typeof city === 'string' && city.trim().length > 0) {
      trimmedCity = city.trim();
      if (trimmedCity.length > 100) {
        throw new Error('City/Location cannot exceed 100 characters.');
      }
    }

    await AuthQueries.updateUserProfile(userId, {
      name: trimmedName,
      age: ageNum,
      city: trimmedCity,
      state: state || undefined
    });

    const refreshed = await AuthQueries.findUserById(userId);
    if (!refreshed) {
      throw new Error('User not found.');
    }

    return {
      id: refreshed.id,
      kindswap_id: refreshed.kindswap_id,
      email: refreshed.email,
      name: refreshed.name,
      age: refreshed.age,
      city: refreshed.city,
      state: refreshed.state,
      role: refreshed.role
    };
  }
};

module.exports = AuthService;
