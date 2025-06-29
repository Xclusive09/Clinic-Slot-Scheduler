import pkg from 'jsonwebtoken';
const { verify } = pkg;

const auth = {
  authenticate: (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  },

  authorize: (roles = []) => {
    if (typeof roles === 'string') {
      roles = [roles];
    }

    return (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    };
  }
};

export const authenticate = auth.authenticate;
export const authorize = auth.authorize;
export { auth };