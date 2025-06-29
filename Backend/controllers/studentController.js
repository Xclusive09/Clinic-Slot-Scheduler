import { Student } from '../models/student.js';
import { Slot } from '../models/slot.js';
import { autoAssignSlots } from '../services/slotAssignment.js';

export const getStudentSlot = async (req, res) => {
  try {
    // You can get student_id from req.user if authenticated, or from query/body
    const student_id = req.user?.student_id || req.query.student_id;
    if (!student_id) return res.status(400).json({ error: 'student_id required' });

    const student = await Student.findOne({ where: { student_id } });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const slot = await Slot.findOne({ where: { student_id } });
    if (!slot) return res.status(404).json({ error: 'No slot assigned' });

    res.json({
      name: student.name,
      department: student.dept,
      slot: `${slot.slot_date}T${slot.slot_time}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const paymentWebhook = async (req, res) => {
    try {
        const { student_id, status } = req.body;
        if (!student_id || status !== 'success') return res.status(400).json({ error: 'Invalid webhook' });

        const student = await Student.findOne({ where: { student_id } });
        if (!student) return res.status(404).json({ error: 'Student not found' });

        await student.update({
            payment_confirmed: true,
            payment_timestamp: new Date()
        });

        await autoAssignSlots();

        res.json({ message: 'Payment confirmed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
