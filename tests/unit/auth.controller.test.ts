import request from 'supertest';
import app from '../../src/app'; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const registerData = {
  email: 'testuser@example.com',
  name: 'Test User',
  password: 'password123',
};

const invalidLoginData = {
  email: 'testuser@example.com',
  password: 'wrongpassword',
};

let userId: string;
let accessToken: string;

describe('Authentication Controller', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: { email: registerData.email },
    });
  });

  afterEach(async () => {
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      });
    }
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/users/register')
        .send(registerData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('data.user');
      expect(response.body.data.user).toHaveProperty('email', registerData.email);
      expect(response.body.data.user).toHaveProperty('name', registerData.name);
      expect(response.body.data.user).not.toHaveProperty('password');
      
      userId = response.body.data.user.id;
    });

    it('should fail registration with existing email', async () => {
      await request(app)
        .post('/api/v1/users/register')
        .send({
          email: 'duplicate@example.com',
          name: 'Duplicate User',
          password: 'password123',
        })
        .expect(201);

      const response = await request(app)
        .post('/api/v1/users/register')
        .send({
          email: 'duplicate@example.com',
          name: 'Another User',
          password: 'password123',
        })
        .expect(500); 

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Email already exists');
    });

    it('should fail registration with invalid data', async () => {
      const invalidData = {
      };

      const response = await request(app)
        .post('/api/v1/users/register')
        .send(invalidData)
        .expect(400); 

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('User Login', () => {
    beforeEach(async () => {
      const existingUser = await prisma.user.findUnique({
        where: { email: registerData.email },
      });
      
      if (!existingUser) {
        await request(app)
          .post('/api/v1/users/register')
          .send(registerData);
      }
    });

    it('should login user and return access token', async () => {
      const response = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: registerData.email,
          password: registerData.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'User logged in successfully');
      expect(response.body).toHaveProperty('data.user');
      expect(response.body).toHaveProperty('data.accessToken');
      expect(response.body.data.user).toHaveProperty('email', registerData.email);
      expect(response.body.data.user).not.toHaveProperty('password');

      accessToken = response.body.data.accessToken;
    });

    it('should fail login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/users/login')
        .send(invalidLoginData)
        .expect(500); 

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should fail login with non-existent user', async () => {
      const response = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(500);

      expect(response.body.message).toContain('User not found');
    });
  });

  describe('Token Refresh', () => {
    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: registerData.email,
          password: registerData.password,
        });
      
      accessToken = loginResponse.body.data.accessToken;
      
      const user = await prisma.user.findUnique({
        where: { email: registerData.email },
      });
      
      if (user?.refreshToken) {
        userId = user.id;
      }
    });

    it('should refresh token successfully', async () => {
      const user = await prisma.user.findUnique({
        where: { email: registerData.email },
      });

      if (!user?.refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await request(app)
        .post('/api/v1/users/refresh')
        .send({ refreshToken: user.refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Token refreshed successfully');
      expect(response.body).toHaveProperty('data.accessToken');
      expect(response.body).toHaveProperty('data.refreshToken');
    });

    it('should fail refresh with invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/users/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(500);

      expect(response.body.message).toContain('Invalid refresh token');
    });
  });

  describe('Authenticated Routes', () => {
    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: registerData.email,
          password: registerData.password,
        });
      accessToken = loginResponse.body.data.accessToken;
    });

    it('should get authenticated user details (/me)', async () => {
      const response = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'User fetched successfully');
      expect(response.body.data.user).toHaveProperty('email', registerData.email);
    });

    it('should fail getting user details without auth', async () => {
      await request(app)
        .get('/api/v1/users/me')
        .expect(401);
    });

    it('should logout user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/users/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'User logged out successfully');

      const user = await prisma.user.findUnique({
        where: { email: registerData.email },
      });
      expect(user?.refreshToken).toBeNull();
    });

    it('should fail logout without auth', async () => {
      await request(app)
        .post('/api/v1/users/logout')
        .expect(401);
    });
  });

  describe('User Management (Admin routes - assuming ADMIN role)', () => {
    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: registerData.email,
          password: registerData.password,
        });
      accessToken = loginResponse.body.data.accessToken;
    });

    it('should get all users with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/users/?page=1&limit=10')
        .set('Authorization', `Bearer ${accessToken}`) 
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Users fetched successfully');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should get user by ID', async () => {
      const user = await prisma.user.findUnique({
        where: { email: registerData.email },
      });
      
      if (!user?.id) throw new Error('User not found');

      const response = await request(app)
        .get(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'User fetched successfully');
      expect(response.body.data.user.id).toBe(user.id);
    });

    it('should update user', async () => {
      const user = await prisma.user.findUnique({
        where: { email: registerData.email },
      });
      
      if (!user?.id) throw new Error('User not found');

      const updateData = {
        name: 'Updated User Name',
      };

      const response = await request(app)
        .put(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'User updated successfully');
      expect(response.body.data.user.name).toBe('Updated User Name');
    });
  });
});