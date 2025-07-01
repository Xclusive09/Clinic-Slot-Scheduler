import { Slot } from '../models/slot.js';
import { sequelize } from '../config/database.js';

const SLOT_START_HOUR = 8;
const SLOT_END_HOUR = 16; // 4pm
const SLOT_DURATION_MINUTES = 5;
const DAYS = 5; // Monday to Friday
const MIN_AVAILABLE_SLOTS = 50; // Threshold to trigger regeneration

function getNextMonday(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = (day === 0 ? 1 : 8 - day); // 0=Sunday, 1=Monday
  d.setDate(d.getDate() + diff);
  return d;
}

async function countAvailableSlots() {
  return await Slot.count({ where: { is_booked: false, student_id: null } });
}

async function generateWeekSlots(startDate = getNextMonday()) {
  const slots = [];
  for (let day = 0; day < DAYS; day++) {
    const slotDate = new Date(startDate);
    slotDate.setDate(startDate.getDate() + day);
    for (let hour = SLOT_START_HOUR; hour < SLOT_END_HOUR; hour++) {
      for (let min = 0; min < 60; min += SLOT_DURATION_MINUTES) {
        const slotTime = `${hour.toString().padStart(2, '0')}:${min
          .toString()
          .padStart(2, '0')}:00`;
        slots.push({
          slot_date: slotDate.toISOString().slice(0, 10),
          slot_time: slotTime,
          is_booked: false,
          student_id: null,
        });
      }
    }
  }
  await Slot.bulkCreate(slots, { ignoreDuplicates: true });
  console.log(`Generated ${slots.length} slots for the week starting ${startDate.toISOString().slice(0, 10)}`);
}

async function autoRegenerateSlots() {
  await sequelize.sync();
  const available = await countAvailableSlots();
  console.log(`Available slots: ${available}`);
  if (available < MIN_AVAILABLE_SLOTS) {
    // Find the latest slot date in DB
    const lastSlot = await Slot.findOne({
      order: [['slot_date', 'DESC']],
    });
    let nextStartDate = lastSlot
      ? new Date(lastSlot.slot_date)
      : getNextMonday();
    nextStartDate.setDate(nextStartDate.getDate() + 1); // Start after last slot
    await generateWeekSlots(nextStartDate);
  } else {
    console.log('Enough slots available, no need to generate.');
  }
  await sequelize.close();
}

autoRegenerateSlots().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});