const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/config/database');
const { User } = require('../src/models');

describe('Profile Endpoints', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/profile', () => {
    it('should return 404 when no profile exists', async () => {
      const response = await request(app)
        .get('/api/profile')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Profile not found');
    });

    it('should return profile when it exists', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'Test bio',
        title: 'Developer'
      };

      await User.create(userData);

      const response = await request(app)
        .get('/api/profile')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data.email).toBe(userData.email);
    });
  });

  describe('POST /api/profile', () => {
    it('should create a new profile with valid data', async () => {
      const userData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        bio: 'Full-stack developer with 5 years experience',
        title: 'Senior Developer',
        location: 'San Francisco, CA'
      };

      const response = await request(app)
        .post('/api/profile')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Profile created successfully');
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data.email).toBe(userData.email);
    });

    it('should return validation error for invalid email', async () => {
      const userData = {
        name: 'Jane Smith',
        email: 'invalid-email',
        bio: 'Test bio'
      };

      const response = await request(app)
        .post('/api/profile')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Validation errors');
    });

    it('should return validation error for missing required fields', async () => {
      const userData = {
        bio: 'Test bio'
      };

      const response = await request(app)
        .post('/api/profile')
        .send(userData)
        .expect(500); // Sequelize validation error

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('PUT /api/profile', () => {
    beforeEach(async () => {
      await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'Original bio'
      });
    });

    it('should update existing profile', async () => {
      const updateData = {
        name: 'John Updated',
        email: 'john.updated@example.com',
        bio: 'Updated bio'
      };

      const response = await request(app)
        .put('/api/profile')
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Profile updated successfully');
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.bio).toBe(updateData.bio);
    });

    it('should return validation error for invalid URL', async () => {
      const updateData = {
        name: 'John Doe',
        email: 'john@example.com',
        website: 'not-a-valid-url'
      };

      const response = await request(app)
        .put('/api/profile')
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('PATCH /api/profile', () => {
    beforeEach(async () => {
      await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'Original bio',
        title: 'Developer'
      });
    });

    it('should partially update profile', async () => {
      const updateData = {
        bio: 'Partially updated bio'
      };

      const response = await request(app)
        .patch('/api/profile')
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.bio).toBe(updateData.bio);
      expect(response.body.data.name).toBe('John Doe'); // Should remain unchanged
      expect(response.body.data.title).toBe('Developer'); // Should remain unchanged
    });

    it('should ignore undefined fields', async () => {
      const updateData = {
        bio: 'Updated bio',
        name: undefined,
        newField: 'should be ignored'
      };

      const response = await request(app)
        .patch('/api/profile')
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.bio).toBe(updateData.bio);
      expect(response.body.data.name).toBe('John Doe'); // Should remain unchanged
    });
  });
});