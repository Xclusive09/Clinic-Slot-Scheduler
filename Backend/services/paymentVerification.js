import { autoAssignSlotForStudent } from '../services/slotAssignment.js';
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

    await autoAssignSlotForStudent(student_id);

    res.json({ message: 'Payment confirmed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};