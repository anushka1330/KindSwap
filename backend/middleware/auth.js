/**
 * requireAuth — session-based authentication middleware.
 *
 * Attaches req.user from session if the request is authenticated.
 * Returns 401 if no valid session exists.
 */
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }
  return res.status(401).json({ error: 'Authentication required. Please log in.' });
};

/**
 * requireRole — role-based authorization middleware.
 * Must be used AFTER requireAuth.
 *
 * Usage: requireRole('admin') or requireRole(['donor', 'ngo'])
 */
const requireRole = (roles) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to access this resource.' });
    }
    next();
  };
};

module.exports = { requireAuth, requireRole };
