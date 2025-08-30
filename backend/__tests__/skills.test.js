const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/config/database');
const { Skill } = require('../src/models');

describe('Skills Endpoints', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Skill.destroy({ where: {} });
    
    // Create test skills
    await Skill.bulkCreate([
      {
        name: 'JavaScript',
        category: 'Programming Languages',
        proficiency_level: 'Expert',
        years_of_experience: 5,
        is_featured: true
      },
      {
        name: 'Python',
        category: 'Programming Languages',
        proficiency_level: 'Advanced',
        years_of_experience: 3,
        is_featured: true
      },
      {
        name: 'React',
        category: 'Frameworks',
        proficiency_level: 'Expert',
        years_of_experience: 4,
        is_featured: false
      },
      {
        name: 'PostgreSQL',
        category: 'Databases',
        proficiency_level: 'Intermediate',
        years_of_experience: 2,
        is_featured: false
      }
    ]);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/skills', () => {
    it('should return all skills', async () => {
      const response = await request(app)
        .get('/api/skills')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(4);
      expect(response.body).toHaveProperty('pagination');
    });

    it('should filter skills by category', async () => {
      const response = await request(app)
        .get('/api/skills?category=Programming Languages')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every(skill => skill.category === 'Programming Languages')).toBe(true);
    });

    it('should filter skills by proficiency level', async () => {
      const response = await request(app)
        .get('/api/skills?proficiency=Expert')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every(skill => skill.proficiency_level === 'Expert')).toBe(true);
    });

    it('should filter featured skills', async () => {
      const response = await request(app)
        .get('/api/skills?featured=true')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every(skill => skill.is_featured === true)).toBe(true);
    });

    it('should respect pagination', async () => {
      const response = await request(app)
        .get('/api/skills?limit=2&offset=1')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.pagination.offset).toBe(1);
    });
  });

  describe('GET /api/skills/top', () => {
    it('should return featured skills only', async () => {
      const response = await request(app)
        .get('/api/skills/top')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every(skill => skill.is_featured === true)).toBe(true);
    });

    it('should respect limit parameter', async () => {
      const response = await request(app)
        .get('/api/skills/top?limit=1')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
    });

    it('should order by years of experience descending', async () => {
      const response = await request(app)
        .get('/api/skills/top')
        .expect(200);

      const experiences = response.body.data.map(skill => skill.years_of_experience);
      expect(experiences[0]).toBeGreaterThanOrEqual(experiences[1]);
    });
  });

  describe('POST /api/skills', () => {
    it('should create a new skill with valid data', async () => {
      const skillData = {
        name: 'Vue.js',
        category: 'Frameworks',
        proficiency_level: 'Intermediate',
        years_of_experience: 1,
        is_featured: false,
        description: 'Progressive JavaScript framework'
      };

      const response = await request(app)
        .post('/api/skills')
        .send(skillData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Skill created successfully');
      expect(response.body.data.name).toBe(skillData.name);
      expect(response.body.data.category).toBe(skillData.category);
    });

    it('should return validation error for invalid category', async () => {
      const skillData = {
        name: 'InvalidSkill',
        category: 'Invalid Category',
        proficiency_level: 'Expert'
      };

      const response = await request(app)
        .post('/api/skills')
        .send(skillData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Validation errors');
    });

    it('should return validation error for invalid proficiency level', async () => {
      const skillData = {
        name: 'TestSkill',
        category: 'Tools',
        proficiency_level: 'Invalid Level'
      };

      const response = await request(app)
        .post('/api/skills')
        .send(skillData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Validation errors');
    });

    it('should return validation error for duplicate skill name', async () => {
      const skillData = {
        name: 'JavaScript', // Already exists
        category: 'Programming Languages',
        proficiency_level: 'Beginner'
      };

      const response = await request(app)
        .post('/api/skills')
        .send(skillData)
        .expect(500); // Sequelize unique constraint error

      expect(response.body).toHaveProperty('success', false);
    });
  });
});