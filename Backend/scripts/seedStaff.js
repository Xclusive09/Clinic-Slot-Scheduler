import { Staff } from '../models/staff.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const seedStaff = async () => {
  try {
    await Staff.create({
      username: 'teststaff01',
      password_hash: await bcrypt.hash('password123', 10),
      role: 'admin'
    });
    
    console.log('Staff user created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding staff:', error);
    process.exit(1);
  }
};

seedStaff();