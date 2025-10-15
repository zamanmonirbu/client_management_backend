// tests/integration/client.integration.test.ts
import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Client Controller Integration Tests (Protected Routes)', () => {
  let token: string;
  let clientId: string;

  const clientData = {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Test St',
    dob: '1990-01-01',
    email: 'john.doe@example.com',
    cell: '123-456-7890',
    companyName: 'Test Corp',
    price: '1000',
    comments: 'Test client',
  };

  const testEmails = [
    'john.doe@example.com',
    'jane.doe@example.com',
    'delete.test@example.com',
    'get-test@example.com',
    'update-test@example.com',
    'client1@example.com',
    'client2@example.com',
  ];

  const loginData = {
    email: 'testuser@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    await prisma.client.deleteMany({
      where: { email: { in: testEmails } },
    });

    const loginResponse = await request(app)
      .post('/api/v1/users/login')
      .send(loginData)
      .expect(200);

    if (!loginResponse.body.data?.accessToken) {
      throw new Error('Failed to obtain access token: ' + loginResponse.body.message);
    }
    
    token = loginResponse.body.data.accessToken;
  });

  afterEach(async () => {
    if (clientId) {
      try {
        await prisma.client.delete({ where: { id: clientId } }).catch(() => {});
      } catch (error) {
        console.warn('Cleanup failed:', error);
      }
      clientId = '';
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Authentication Middleware', () => {
    it('should reject requests without Authorization header - 401', async () => {
      const response = await request(app)
        .get('/api/v1/clients')
        .expect(401);

      expect(response.body).toHaveProperty('status', false);
      expect(response.body.message).toMatch(/unauthorized|token|authentication/i);
    });

    it('should reject requests with invalid token - 401', async () => {
      const response = await request(app)
        .get('/api/v1/clients')
        .set('Authorization', 'Bearer invalid-token-123')
        .expect(401);

      expect(response.body).toHaveProperty('status', false);
      expect(response.body.message).toMatch(/unauthorized|invalid|token/i);
    });

    it('should accept valid token', async () => {
      const response = await request(app)
        .get('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('Clients fetched successfully');
    });
  });

  describe('Client CRUD Operations', () => {
    it('should create a new client - 201', async () => {
      const response = await request(app)
        .post('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`)
        .send(clientData)
        .expect(201);

      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('Client created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.id).toMatch(/^[a-z0-9]+$/i);
      expect(response.body.data.email).toBe(clientData.email);
      expect(response.body.data.firstName).toBe(clientData.firstName);
      expect(response.body.data.lastName).toBe(clientData.lastName);
      expect(response.body.data.companyName).toBe(clientData.companyName);
      expect(response.body.data.price).toBe(clientData.price);
      expect(new Date(response.body.data.dob)).toBeInstanceOf(Date);
      
      clientId = response.body.data.id;

      const dbClient = await prisma.client.findUnique({ where: { id: clientId } });
      expect(dbClient).not.toBeNull();
      expect(dbClient?.email).toBe(clientData.email);
      expect(new Date(dbClient!.dob).toISOString().split('T')[0]).toBe('1990-01-01');
    });

    it('should list clients with pagination - 200', async () => {
      const createPromises = [
        request(app)
          .post('/api/v1/clients')
          .set('Authorization', `Bearer ${token}`)
          .send({ ...clientData, email: 'client1@example.com', firstName: 'Client1' }),
        request(app)
          .post('/api/v1/clients')
          .set('Authorization', `Bearer ${token}`)
          .send({ ...clientData, email: 'client2@example.com', firstName: 'Client2' }),
        request(app)
          .post('/api/v1/clients')
          .set('Authorization', `Bearer ${token}`)
          .send({ ...clientData, email: 'client3@example.com', firstName: 'Client3' }),
      ];

      await Promise.all(createPromises.map(p => p.expect(201)));

      const response = await request(app)
        .get('/api/v1/clients?page=1&limit=2&sortOrder=desc')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('Clients fetched successfully');
      expect(Array.isArray(response.body.data.data)).toBe(true);
      expect(response.body.data.data.length).toBe(2); // limit=2
      expect(response.body.data.pagination).toEqual({
        total: expect.any(Number),
        page: 1,
        limit: 2,
        totalPages: expect.any(Number),
        sortOrder: 'desc',
      });
      expect(response.body.data.pagination.total).toBeGreaterThan(2);
    });

    it('should get client by ID - 200', async () => {
      const createResponse = await request(app)
        .post('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          ...clientData, 
          email: 'get-client@example.com', 
          firstName: 'GetClient',
          comments: 'Get test client'
        })
        .expect(201);
      
      const testClientId = createResponse.body.data.id;

      const response = await request(app)
        .get(`/api/v1/clients/${testClientId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('Client fetched successfully');
      expect(response.body.data.id).toBe(testClientId);
      expect(response.body.data.email).toBe('get-client@example.com');
      expect(response.body.data.comments).toBe('Get test client');
    });

    it('should return 404 for non-existent client - GET', async () => {
      const response = await request(app)
        .get('/api/v1/clients/non-existent-id-123')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe('Client not found');
      expect(response.body.statusCode).toBe(404);
    });

    it('should update existing client - 200', async () => {
      const createResponse = await request(app)
        .post('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          ...clientData, 
          email: 'update-client@example.com', 
          firstName: 'BeforeUpdate',
          price: '1000'
        })
        .expect(201);
      
      const testClientId = createResponse.body.data.id;
      const updateData = {
        firstName: 'Updated Client',
        lastName: 'Updated Doe',
        price: '5000',
        comments: 'Updated via API test',
        companyName: 'Updated Corp Inc',
        address: '456 Updated St',
        cell: '987-654-3210',
      };

      const response = await request(app)
        .put(`/api/v1/clients/${testClientId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('Client updated successfully');
      expect(response.body.data.id).toBe(testClientId);
      expect(response.body.data.firstName).toBe('Updated Client');
      expect(response.body.data.lastName).toBe('Updated Doe');
      expect(response.body.data.price).toBe('5000');
      expect(response.body.data.comments).toBe('Updated via API test');
      expect(response.body.data.companyName).toBe('Updated Corp Inc');
    });

    it('should return 404 for updating non-existent client', async () => {
      const response = await request(app)
        .put('/api/v1/clients/non-existent-update-id')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Test Update', price: '999' })
        .expect(404);

      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe('Client not found');
    });

    it('should delete existing client - 200', async () => {
      const createResponse = await request(app)
        .post('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          ...clientData, 
          email: 'delete-client@example.com', 
          firstName: 'ToDelete'
        })
        .expect(201);
      
      const testClientId = createResponse.body.data.id;

      const deleteResponse = await request(app)
        .delete(`/api/v1/clients/${testClientId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(deleteResponse.body.status).toBe(true);
      expect(deleteResponse.body.message).toBe('Client deleted successfully');
      expect(deleteResponse.body.data).toBeNull();

      // Verify client is actually deleted
      const getResponse = await request(app)
        .get(`/api/v1/clients/${testClientId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(getResponse.body.status).toBe(false);
      expect(getResponse.body.message).toBe('Client not found');
    });

    it('should return 404 for deleting non-existent client', async () => {
      const response = await request(app)
        .delete('/api/v1/clients/non-existent-delete-id')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe('Client not found');
    });
  });

  describe('Validation Tests', () => {
    it('should return 400 for invalid create data', async () => {
      const invalidData = {
        ...clientData,
        email: 'invalid-email', 
        firstName: '', 
        lastName: '', 
      };

      const response = await request(app)
        .post('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.status).toBe(false);
      expect(response.body.message).toContain('validation');
      expect(response.body).toHaveProperty('errors'); 
    });

    it('should return 400 for invalid update data', async () => {
      const createResponse = await request(app)
        .post('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`)
        .send(clientData)
        .expect(201);
      
      const testClientId = createResponse.body.data.id;
      
      const invalidUpdateData = {
        email: 'invalid-email-format',
        firstName: '', 
        dob: 'invalid-date', 
      };

      const response = await request(app)
        .put(`/api/v1/clients/${testClientId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(invalidUpdateData)
        .expect(400);

      expect(response.body.status).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    it('should handle duplicate email gracefully', async () => {
      // Create first client
      await request(app)
        .post('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`)
        .send(clientData)
        .expect(201);

      const response = await request(app)
        .post('/api/v1/clients')
        .set('Authorization', `Bearer ${token}`)
        .send(clientData)
        .expect(500); 

      expect(response.body.status).toBe(false);
      expect(response.body.message).toContain('Duplicate entry');
    });
  });

  describe('Pagination Edge Cases', () => {
    it('should handle large limit gracefully', async () => {
      const response = await request(app)
        .get('/api/v1/clients?page=1&limit=1000')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(response.body.data.pagination.limit).toBe(1000);
    });

    it('should handle page 0 as page 1', async () => {
      const response = await request(app)
        .get('/api/v1/clients?page=0&limit=10')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.pagination.page).toBe(1); 
    });
  });
});