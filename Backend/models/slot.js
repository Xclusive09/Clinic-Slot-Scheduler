import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Slot = sequelize.define('Slot', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  slot_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  slot_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  is_booked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  student_id: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: 'students',
      key: 'student_id'
    }
  }
}, {
  tableName: 'slots',
  timestamps: false
});

