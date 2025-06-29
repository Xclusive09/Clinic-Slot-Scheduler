import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  student_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dept: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  payment_confirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  payment_timestamp: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: 'students',
  timestamps: false
});