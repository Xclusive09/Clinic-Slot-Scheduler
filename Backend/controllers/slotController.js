import { Slot } from '../models/slot.js';
import { Student } from '../models/student.js';

// PUT /slots/:id - Update slot status
export const updateSlotStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_booked, student_id } = req.body;
    const slot = await Slot.findByPk(id);
    if (!slot) return res.status(404).json({ error: 'Slot not found' });

    await slot.update({ is_booked, student_id });
    res.json(slot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /slots/generate - Bulk slot creation with conflict validation
export const generateSlots = async (req, res) => {
  try {
    const { slots } = req.body; // Array of { slot_date, slot_time }
    if (!Array.isArray(slots)) return res.status(400).json({ error: 'Slots array required' });

    const conflicts = [];
    const created = [];
    for (const s of slots) {
      const exists = await Slot.findOne({ where: { slot_date: s.slot_date, slot_time: s.slot_time } });
      if (exists) {
        conflicts.push({ slot_date: s.slot_date, slot_time: s.slot_time });
      } else {
        const slot = await Slot.create({ ...s, is_booked: false, student_id: null });
        created.push(slot);
      }
    }
    res.json({ created, conflicts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET /slots - Get all slots with student info
export const getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.findAll({
      include: [
        {
          model: Student,
          attributes: ['student_id', 'name'],
          required: false,
          foreignKey: 'student_id',
        }
      ]
    });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};