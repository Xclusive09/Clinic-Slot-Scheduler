import { Student } from '../models/student.js';
import { Slot } from '../models/slot.js';

export async function autoAssignSlotForStudent(student_id) {
  // Check if student already has a slot
  const hasSlot = await Slot.findOne({ where: { student_id } });
  if (hasSlot) return; // Already assigned

  // Find next available slot at least 2 hours from now
  const now = new Date();
  const minTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const slot = await Slot.findOne({
    where: {
      is_booked: false,
      slot_date: { $gte: minTime.toISOString().slice(0, 10) },
      slot_time: { $gte: minTime.toTimeString().slice(0, 8) }
    },
    order: [
      ['slot_date', 'ASC'],
      ['slot_time', 'ASC']
    ]
  });
  if (slot) {
    await slot.update({ is_booked: true, student_id });
  }
}