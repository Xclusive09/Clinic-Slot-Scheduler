import { Booking } from './booking.js';
import { Staff } from './staff.js';
import { Student } from './student.js';
import { Slot } from './slot.js';

// Associations
Booking.belongsTo(Student, { foreignKey: 'student_id', targetKey: 'student_id' });
Booking.belongsTo(Slot, { foreignKey: 'slot_id', targetKey: 'id' });

Student.hasMany(Booking, { foreignKey: 'student_id', sourceKey: 'student_id' });
Slot.hasMany(Booking, { foreignKey: 'slot_id', sourceKey: 'id' });

// Student <-> Slot association
Slot.belongsTo(Student, { foreignKey: 'student_id', targetKey: 'student_id' });
Student.hasMany(Slot, { foreignKey: 'student_id', sourceKey: 'student_id' });

export { Booking, Staff, Student, Slot };