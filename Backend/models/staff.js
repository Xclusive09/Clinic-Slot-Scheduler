import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import bcrypt from 'bcrypt';

const Staff = sequelize.define('Staff', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'staff'
  }
}, {
  tableName: 'staff',
  timestamps: true,
  hooks: {
    beforeCreate: async (staff) => {
      if (staff.password_hash) {
        const salt = await bcrypt.genSalt(10);
        staff.password_hash = await bcrypt.hash(staff.password_hash, salt);
      }
    },
    beforeUpdate: async (staff) => {
      if (staff.changed('password_hash')) {
        const salt = await bcrypt.genSalt(10);
        staff.password_hash = await bcrypt.hash(staff.password_hash, salt);
      }
    }
  }
});

Staff.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password_hash);
};

export { Staff };