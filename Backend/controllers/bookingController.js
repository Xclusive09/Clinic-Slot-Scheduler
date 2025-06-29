import { Booking, Staff, Student } from '../models/index.js';
import { Op } from 'sequelize';
import { format } from 'date-fns';

export const getSchedule = async (req, res) => {
  try {
    const { date, page = 1, limit = 10 } = req.query;
    
    const whereClause = {};
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      whereClause.slot_date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Booking.findAndCountAll({
      where: whereClause,
      include: [
        { model: Student, attributes: ['id', 'student_id', 'name'] },
        // { model: Staff, attributes: ['id', 'username'] }
      ],
      order: [['slot_date', 'ASC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const exportToCSV = async (req, res) => {
  try {
    const { date } = req.query;
    
    const whereClause = {};
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      whereClause.slot_date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const bookings = await Booking.findAll({
      where: whereClause,
      include: [
        { model: Student, attributes: ['student_id', 'name'] },
        // { model: Staff, attributes: ['username'] }
      ],
      order: [['slot_date', 'ASC']]
    });

    let csv = 'Student ID,Student Name,Staff,Date,Time\n';
    bookings.forEach(booking => {
      csv += `"${booking.Student.student_id}","${booking.Student.name}","${booking.Staff.username}","${format(new Date(booking.slot_date), 'yyyy-MM-dd')}","${format(new Date(booking.slot_time), 'HH:mm')}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`bookings-${format(new Date(), 'yyyyMMdd')}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};