import express, { json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();
import slotRoutes from './routes/slot.js';
import { Router } from 'express';
import staffRoutes from './routes/staff.js';
import studentRoutes from './routes/student.js';
import bcrypt from 'bcrypt';
import {Staff} from './models/staff.js';
import scheduleRoutes from './routes/schedule.js';
import { sequelize } from './config/database.js';

const PORT = process.env.PORT || 3000;
const exportRouter = Router();


const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use('/api/slots', slotRoutes);

// Routes
app.use('/api/staff', staffRoutes);
app.use('/api', studentRoutes);
app.use('/api/schedule', scheduleRoutes);

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });



// Temporary endpoint to reset staff password
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