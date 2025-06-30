import { Staff } from '../models/staff.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const seedStaff = async () => {
  try {
    const password = 'admin123'; // Use the same password you'll test with
    const hash = await bcrypt.hash(password, 10);
    
    console.log('Seeding with password:', password);
    console.log('Generated hash:', hash);
    
    await Staff.create({
      username: 'admin',
      password_hash: hash,
      role: 'admin'
    });
    
    console.log('Staff user created successfully!');
  } catch (error) {
    console.error('Error seeding staff:', error);
  }
};

seedStaff();