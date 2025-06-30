import { Staff } from '../models/staff.js';
import { sequelize } from '../config/database.js';

async function seedStaff() {
  try {
    await sequelize.sync(); // Ensure tables exist

    // Create a test staff user
    const [staff, created] = await Staff.findOrCreate({
      where: { username: 'babanla' },
      defaults: {
        password_hash: 'password123', // Will be hashed by model hook
        role: 'staff'
      } 
    });

    if (created) {
      console.log('Test staff user created:');
    } else {
      console.log('Test staff user already exists:');
    }
    console.log({
      username: staff.username,
      password: 'password123',
      role: staff.role
    });
  } catch (err) {
    console.error('Error seeding staff:', err);
  } finally {
    await sequelize.close();
  }
}

seedStaff();