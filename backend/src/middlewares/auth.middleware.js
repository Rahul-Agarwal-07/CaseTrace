const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

exports.authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token missing' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check role
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
    }

    // Attach admin info to request for further use
    req.adminUserId = decoded.userId;
    req.adminEmail = decoded.email; // optional if you included it in JWT
    req.adminRole = decoded.role;

    next();
  } catch (err) {
    console.error('Admin auth error:', err);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

exports.requireAuth = (roles = []) => {
  return (req, res, next) => {
    try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      walletAddress: decoded.walletAddress,
      caseId: decoded.caseId,
    };

    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
