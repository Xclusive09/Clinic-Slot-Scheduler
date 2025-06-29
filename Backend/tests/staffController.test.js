import request from 'supertest';
import app from '../server';
import { create, destroy, findOne } from '../models/staff';
import { sign } from 'jsonwebtoken';

describe('Staff Controller', () => {
  beforeAll(async () => {
    // Create a test staff user
    await create({
      username: 'teststaff',
      password_hash: 'password123',
      role: 'staff'
    });
  });

  afterAll(async () => {
    // Clean up
    await destroy({ where: {} });
  });

  describe('POST /api/staff/login', () => {
    it('should return a JWT token for valid credentials', async () => {
      const response = await request(app)
        .post('/api/staff/login')
        .send({
          username: 'teststaff',
          password: 'password123'
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('staff');
      expect(response.body.staff.username).toBe('teststaff');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/staff/login')
        .send({
          username: 'teststaff',
          password: 'wrongpassword'
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });
  });

  describe('GET /api/staff/me', () => {
    it('should return current staff info with valid token', async () => {
      const staff = await findOne({ where: { username: 'teststaff' } });
      const token = sign(
        { id: staff.id, username: staff.username, role: staff.role },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      const response = await request(app)
        .get('/api/staff/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.username).toBe('teststaff');
    });

    it('should return 401 without a token', async () => {
      const response = await request(app)
        .get('/api/staff/me');

      expect(response.statusCode).toBe(401);
    });
  });
});