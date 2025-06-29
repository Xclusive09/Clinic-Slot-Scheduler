import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  student_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'students',
      key: 'student_id'
    }
  },
  slot_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'slots',
      key: 'id'
    }
  },
  booking_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  slot_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  slot_time: {
    type: DataTypes.TIME,
    allowNull: false
  }
}, {
  tableName: 'bookings',
  timestamps: false
});