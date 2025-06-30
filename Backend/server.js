import express, { json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();
import slotRoutes from './routes/slot.js';


import { authenticate } from './middleware/auth.js';
import { exportToCSV } from './controllers/bookingController.js';
import { Router } from 'express';


const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use('/api/slots', slotRoutes);

// Routes
import staffRoutes from './routes/staff.js';
app.use('/api/staff', staffRoutes);


import studentRoutes from './routes/student.js';
app.use('/api', studentRoutes);

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

import scheduleRoutes from './routes/schedule.js';
app.use('/api/schedule', scheduleRoutes);



// Database connection and server start
import { sequelize } from './config/database.js';
const PORT = process.env.PORT || 3000;
const exportRouter = Router();

exportRouter.get('/export', authenticate, exportToCSV);
app.use('/api', exportRouter);

sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    return sequelize.sync(); // Use { force: true } only for development to reset DB
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  import bcrypt from 'bcrypt';
//   const hash = await bcrypt.hash('admin123', 10);
// console.log(hash);

// Add to your server code temporarily
app.post('/api/admin/reset-password', async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    const hash = await bcrypt.hash(newPassword, 10);
    
    await Staff.update(
      { password_hash: hash },
      { where: { username } }
    );
    
    res.json({ 
      message: 'Password updated',
      username,
      newHash: hash
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default app;