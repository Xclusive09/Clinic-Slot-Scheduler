import { Staff } from '../models/staff.js';
import jwt from 'jsonwebtoken';  // Default import for CommonJS module
import { validationResult } from 'express-validator';

const staffController = {

  login: async (req, res, next) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;

      // Find staff by username
      const staff = await Staff.findOne({ where: { username } });
      if (!staff) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await staff.validPassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(  // Using jwt.sign instead of destructured sign
        { id: staff.id, username: staff.username, role: staff.role },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      // Return token and basic staff info
      res.json({
        token,
        staff: {
          id: staff.id,
          username: staff.username,
          role: staff.role
        }
      });
    } catch (error) {
      next(error);
    }
  },

  logout: (req, res) => {
    res.json({ message: 'Logout successful' });
  },

  getCurrentStaff: (req, res) => {
    res.json({
      id: req.user.id,
      username: req.user.username,
      role: req.user.role
    });
  }
  
};


export  {staffController};