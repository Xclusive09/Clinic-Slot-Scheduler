import { Staff } from '../models/staff.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

const staffController = {

  login: async (req, res, next) => {
    try {
      // 1. Input validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;
      console.log('Login attempt for:', username);

      // 2. Find staff member
      const staff = await Staff.findOne({ 
        where: { username },
        raw: true // Get plain object for debugging
      });
      
      if (!staff) {
        console.log('Staff not found in database');
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      console.log('Found staff record:', {
        id: staff.id,
        username: staff.username,
        role: staff.role,
        password_hash: staff.password_hash
      });

      // 3. Password validation
      console.log('Comparing password with hash:', staff.password_hash);
      
      // Option 1: If using model method
      // const isValidPassword = await Staff.validPassword(password, staff.password_hash);
      
      // Option 2: Direct bcrypt comparison
      const isValidPassword = await bcrypt.compare(password, staff.password_hash);
      console.log('Password comparison result:', isValidPassword);

      if (!isValidPassword) {
        console.log('Password validation failed');
        console.log('Input password:', password);
        console.log('Generated hash for input:', await bcrypt.hash(password, 10));
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // 4. Token generation
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not set!');
        return res.status(500).json({ error: 'Server configuration error' });
      }

      const token = jwt.sign(
        { 
          id: staff.id, 
          username: staff.username, 
          role: staff.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      console.log('Login successful for:', username);
      res.json({
        token,
        staff: {
          id: staff.id,
          username: staff.username,
          role: staff.role
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      next(error);
    }
  },

  // ... rest of your controller methods
};

export { staffController };