import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Client Controller Integration (Simplified)', () => {
  let token: string;
  let clientId: string;

  const clientData = {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Test St',
    dob: '1990-01-01',
    email: 'john.simple@example.com',
    cell: '123-456-7890',
    companyName: 'Test Corp',
    price: '1000',
    comments: 'Simple test client',
  };

  const loginData = {
    email: 'testuser@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    await prisma.client.deleteMany({
      where: { email: { in: [clientData.email] } },
    });

    const loginRes = await request(app)
      .post('/api/v1/users/login')
      .send(loginData)
      .expect(200);

    token = loginRes.body.data.accessToken;
  });

  afterAll(async () => {
    if (clientId) await prisma.client.delete({ where: { id: clientId } }).catch(() => {});
    await prisma.$disconnect();
  });

  describe('Authentication', () => {
    it('should reject request without token', async () => {
      const res = await request(app).get('/api/v1/clients').expect(401);
      expect(res.body.status).toBe(false);
    });

    it('should accept valid token', async () => {
      const res = await request(app)
        .get('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe('Clients fetched successfully');
    });
  });

  describe('Client CRUD', () => {
    it('should create a new client', async () => {
      const res = await request(app)
        .post('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`)
        .send(clientData)
        .expect(201);

      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe('Client created successfully');
      expect(res.body.data).toHaveProperty('id');
      clientId = res.body.data.id;
    });

    it('should fetch clients list', async () => {
      const res = await request(app)
        .get('/api/v1/clients?page=1&limit=5')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.status).toBe(true);
      expect(Array.isArray(res.body.data.data)).toBe(true);
    });

    it('should fetch client by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/clients/${clientId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.status).toBe(true);
      expect(res.body.data.id).toBe(clientId);
    });

    it('should delete the created client', async () => {
      const res = await request(app)
        .delete(`/api/v1/clients/${clientId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe('Client deleted successfully');
    });
  });
});
