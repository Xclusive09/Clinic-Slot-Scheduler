import { Staff } from '../models/staff.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

const staffController = {

  login: async (req, res, next) => {
    try {
      // 1. Input validation with detailed error logging
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('Validation errors:', {
          errors: errors.array(),
          input: { username: req.body.username }
        });
        return res.status(400).json({ 
          error: 'Validation failed',
          details: errors.array() 
        });
      }

      const { username, password } = req.body;
      console.log(`Login attempt for ${username} from IP: ${req.ip}`);

      // 2. Find staff member with case-sensitive username
      const staff = await Staff.findOne({ 
        where: { 
          username: sequelize.where(
            sequelize.fn('BINARY', sequelize.col('username')),
            username
          )
        }
      });
      
      if (!staff) {
        console.warn(`Staff not found: ${username}`);
        return res.status(401).json({ 
          error: 'Invalid credentials',
          message: 'Username or password is incorrect' // Generic message for security
        });
      }

      // 3. Password validation with multiple fallbacks
      let isValidPassword = false;
      try {
        // Try model method first
        if (typeof staff.validPassword === 'function') {
          isValidPassword = await staff.validPassword(password);
        } 
        // Fallback to direct bcrypt comparison
        else if (staff.password_hash) {
          console.warn('validPassword method not found, using direct bcrypt compare');
          isValidPassword = await bcrypt.compare(password, staff.password_hash);
        }
        
        // Debug logging
        console.log('Password validation:', {
          username: staff.username,
          match: isValidPassword,
          hashMatch: staff.password_hash === await bcrypt.hash(password, 10)
        });
      } catch (hashError) {
        console.error('Password validation error:', hashError);
        return res.status(500).json({ 
          error: 'Authentication error',
          message: 'Could not validate credentials'
        });
      }

      if (!isValidPassword) {
        console.warn(`Failed login attempt for ${username}`);
        return res.status(401).json({ 
          error: 'Invalid credentials',
          message: 'Username or password is incorrect'
        });
      }

      // 4. Token generation with security checks
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not configured');
        return res.status(500).json({ 
          error: 'Server configuration error',
          message: 'Authentication service unavailable'
        });
      }

      const token = jwt.sign(
        { 
          id: staff.id, 
          username: staff.username, 
          role: staff.role,
          iss: 'clinic-scheduler-api',
          aud: 'clinic-scheduler-web'
        },
        process.env.JWT_SECRET,
        { 
          expiresIn: '8h',
          algorithm: 'HS256' // Explicit algorithm specification
        }
      );

      // 5. Successful login response
      console.log(`Successful login for ${username} (ID: ${staff.id})`);
      res.json({
        success: true,
        token,
        expiresIn: 28800, // 8 hours in seconds
        staff: {
          id: staff.id,
          username: staff.username,
          role: staff.role,
          lastLogin: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Login process error:', {
        error: error.message,
        stack: error.stack,
        input: req.body
      });
      res.status(500).json({ 
        error: 'Login failed',
        message: 'An unexpected error occurred'
      });
    }
  },

  logout: async (req, res) => {
    try {
      // In a real implementation, you might blacklist the token here
      console.log(`User logout: ${req.user.username}`);
      res.json({ 
        success: true,
        message: 'Logout successful' 
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Logout failed',
        message: 'Could not complete logout'
      });
    }
  },

  getCurrentStaff: async (req, res) => {
    try {
      // Verify the user still exists in database
      const currentStaff = await Staff.findByPk(req.user.id, {
        attributes: ['id', 'username', 'role', 'createdAt']
      });
      
      if (!currentStaff) {
        return res.status(404).json({
          error: 'Staff not found',
          message: 'Your account may have been removed'
        });
      }

      res.json({
        success: true,
        staff: {
          id: currentStaff.id,
          username: currentStaff.username,
          role: currentStaff.role,
          accountCreated: currentStaff.createdAt
        }
      });
    } catch (error) {
      console.error('Current staff fetch error:', error);
      res.status(500).json({
        error: 'Profile load failed',
        message: 'Could not retrieve staff information'
      });
    }
  }
};

export { staffController };