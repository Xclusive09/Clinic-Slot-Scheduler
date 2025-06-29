import { Student } from '../models/student.js';
import { Slot } from '../models/slot.js';

export async function autoAssignSlots() {
  // Find students who have paid but have no slot
  const students = await Student.findAll({
    where: { payment_confirmed: true },
    include: [{ model: Slot, required: false }]
  });

  for (const student of students) {
    const hasSlot = await Slot.findOne({ where: { student_id: student.student_id } });
    if (!hasSlot) {
      // Find next available slot at least 2 hours from now
      const now = new Date();
      const minTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      const slot = await Slot.findOne({
        where: {
          is_booked: false,
          slot_date: minTime.toISOString().slice(0, 10),
          slot_time: { $gte: minTime.toTimeString().slice(0, 8) }
        }
      });
      if (slot) {
        await slot.update({ is_booked: true, student_id: student.student_id });
      }
    }
  }
}