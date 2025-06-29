import { Booking } from './booking.js';
import { Staff } from './staff.js';
import { Student } from './student.js';
import { Slot } from './slot.js';

// Associations
Booking.belongsTo(Student, { foreignKey: 'student_id', targetKey: 'student_id' });
// Booking.belongsTo(Staff, { foreignKey: 'staff_id', targetKey: 'id' }); // If you have staff_id in Booking
Booking.belongsTo(Slot, { foreignKey: 'slot_id', targetKey: 'id' });

Student.hasMany(Booking, { foreignKey: 'student_id', sourceKey: 'student_id' });
// Staff.hasMany(Booking, { foreignKey: 'staff_id', sourceKey: 'id' }); // If you have staff_id in Booking
Slot.hasMany(Booking, { foreignKey: 'slot_id', sourceKey: 'id' });

export { Booking, Staff, Student, Slot };