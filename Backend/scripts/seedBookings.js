import { Student } from '../models/student.js';
import { Booking } from '../models/booking.js';
import { Slot } from '../models/slot.js';

const studentsData = [
    { student_id: 'FUD/CSC/23/200', name: 'Student One', dept: 'Computer Science', has_paid: true },
    { student_id: 'FUD/CSC/23/201', name: 'Student Two', dept: 'Information Technology', has_paid: false },
    { student_id: 'FUD/CSC/23/202', name: 'Student Three', dept: 'Cyber Security', has_paid: true },
    { student_id: 'FUD/CSC/23/203', name: 'Student Four', dept: 'Software Engineering', has_paid: false },
    { student_id: 'FUD/CSC/23/204', name: 'Student Five', dept: 'Information Technology', has_paid: true },
    { student_id: 'FUD/CSC/23/205', name: 'Student Six', dept: 'Computer Science', has_paid: false },
    { student_id: 'FUD/CSC/23/206', name: 'Student Seven', dept: 'Cyber Security', has_paid: true },
    { student_id: 'FUD/CSC/23/207', name: 'Student Eight', dept: 'Software Engineering', has_paid: false },
    { student_id: 'FUD/CSC/23/208', name: 'Student Nine', dept: 'Information Technology', has_paid: true },
    { student_id: 'FUD/CSC/23/209', name: 'Student Ten', dept: 'Computer Science', has_paid: false }
];

const students = [];
const paidMap = {};
for (const data of studentsData) {
    const [student] = await Student.findOrCreate({
        where: { student_id: data.student_id },
        defaults: {
            name: data.name,
            dept: data.dept
        }
    });
    // Update payment fields
    await student.update({
        payment_confirmed: data.has_paid,
        payment_timestamp: data.has_paid ? new Date() : null
    });
    students.push(student);
    paidMap[student.student_id] = data.has_paid;
}

// Create 10 slots if not enough exist
let slots = await Slot.findAll({ limit: 10 });
if (slots.length < 10) {
    const today = new Date().toISOString().slice(0, 10);
    for (let i = slots.length; i < 10; i++) {
        const [slot] = await Slot.findOrCreate({
            where: {
                slot_date: today,
                slot_time: `0${i + 9}:00:00`
            },
            defaults: {
                is_booked: false,
                student_id: null
            }
        });
        slots.push(slot);
    }
}

// When creating bookings, check payment and update slot

for (let i = 0; i < 10; i++) {
    try {
        if (slots[i]) {
            if (paidMap[students[i].student_id]) {
                await Booking.create({
                    student_id: students[i].student_id,
                    slot_id: slots[i].id,
                    booking_date: new Date(),
                    slot_date: slots[i].slot_date,   // <-- Add this line
                    slot_time: slots[i].slot_time    // <-- Add this line
                });
                // Fetch the latest slot instance from DB before updating
                const slotToUpdate = await Slot.findByPk(slots[i].id);
                await slotToUpdate.update({
                    is_booked: true,
                    student_id: students[i].student_id
                });
                console.log(`Booking created for student ${students[i].student_id}`);
            } else {
                console.log(`Student ${students[i].student_id} has not paid, skipping booking.`);
            }
        } else {
            console.log(`No valid slot for student ${students[i].student_id}, skipping booking.`);
        }
    } catch (err) {
        console.log(`Booking for student ${students[i].student_id} failed:`, err.message);
    }
}