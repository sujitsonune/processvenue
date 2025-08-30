const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/config/database');
const { User, Project, Skill, ProjectSkill } = require('../src/models');

describe('Projects Endpoints', () => {
  let testUser, testSkill1, testSkill2;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    // Clean up
    await ProjectSkill.destroy({ where: {} });
    await Project.destroy({ where: {} });
    await Skill.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Create test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com'
    });

    // Create test skills
    [testSkill1, testSkill2] = await Skill.bulkCreate([
      {
        name: 'React',
        category: 'Frameworks',
        proficiency_level: 'Expert'
      },
      {
        name: 'Node.js',
        category: 'Frameworks',
        proficiency_level: 'Advanced'
      }
    ]);

    // Create test projects
    await Project.bulkCreate([
      {
        title: 'E-Commerce Platform',
        description: 'A full-featured e-commerce platform',
        short_description: 'E-commerce platform with React',
        status: 'Completed',
        priority: 10,
        is_featured: true,
        user_id: testUser.id
      },
      {
        title: 'Task Manager',
        description: 'Project management application',
        short_description: 'Task management tool',
        status: 'In Progress',
        priority: 8,
        is_featured: false,
        user_id: testUser.id
      },
      {
        title: 'Weather API',
        description: 'REST API for weather data',
        short_description: 'Weather data API',
        status: 'Completed',
        priority: 6,
        is_featured: true,
        user_id: testUser.id
      }
    ]);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/projects', () => {
    it('should return all projects', async () => {
      const response = await request(app)
        .get('/api/projects')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(3);
      expect(response.body).toHaveProperty('pagination');
    });

    it('should filter projects by status', async () => {
      const response = await request(app)
        .get('/api/projects?status=Completed')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every(project => project.status === 'Completed')).toBe(true);
    });

    it('should filter featured projects', async () => {
      const response = await request(app)
        .get('/api/projects?featured=true')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every(project => project.is_featured === true)).toBe(true);
    });

    it('should sort projects correctly', async () => {
      const response = await request(app)
        .get('/api/projects?sort=priority&order=DESC')
        .expect(200);

      const priorities = response.body.data.map(project => project.priority);
      expect(priorities[0]).toBeGreaterThanOrEqual(priorities[1]);
      expect(priorities[1]).toBeGreaterThanOrEqual(priorities[2]);
    });

    it('should respect pagination', async () => {
      const response = await request(app)
        .get('/api/projects?limit=2&offset=1')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.pagination.offset).toBe(1);
    });
  });

  describe('GET /api/projects/:id', () => {
    it('should return a specific project', async () => {
      const projects = await Project.findAll();
      const projectId = projects[0].id;

      const response = await request(app)
        .get(`/api/projects/${projectId}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.id).toBe(projectId);
      expect(response.body.data.title).toBe('E-Commerce Platform');
    });

    it('should return 404 for non-existent project', async () => {
      const response = await request(app)
        .get('/api/projects/99999')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Project not found');
    });

    it('should include skills in project response', async () => {
      const projects = await Project.findAll();
      const projectId = projects[0].id;

      // Add skill to project
      await ProjectSkill.create({
        project_id: projectId,
        skill_id: testSkill1.id,
        proficiency_used: 'Expert'
      });

      const response = await request(app)
        .get(`/api/projects/${projectId}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('skills');
      expect(response.body.data.skills).toHaveLength(1);
      expect(response.body.data.skills[0].name).toBe('React');
    });
  });

  describe('POST /api/projects', () => {
    it('should create a new project with valid data', async () => {
      const projectData = {
        title: 'New Project',
        description: 'A brand new project for testing',
        short_description: 'Test project',
        status: 'Planning',
        priority: 5,
        is_featured: false
      };

      const response = await request(app)
        .post('/api/projects')
        .send(projectData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Project created successfully');
      expect(response.body.data.title).toBe(projectData.title);
      expect(response.body.data.user_id).toBe(1); // Default user ID
    });

    it('should create project with skills', async () => {
      const projectData = {
        title: 'Project with Skills',
        description: 'A project that includes skills',
        skills: [
          {
            skill_id: testSkill1.id,
            proficiency_used: 'Expert'
          },
          {
            skill_id: testSkill2.id,
            proficiency_used: 'Advanced'
          }
        ]
      };

      const response = await request(app)
        .post('/api/projects')
        .send(projectData)
        .expect(201);

      expect(response.body.data).toHaveProperty('skills');
      expect(response.body.data.skills).toHaveLength(2);
    });

    it('should return validation error for missing title', async () => {
      const projectData = {
        description: 'Missing title'
      };

      const response = await request(app)
        .post('/api/projects')
        .send(projectData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Validation errors');
    });

    it('should return validation error for invalid status', async () => {
      const projectData = {
        title: 'Test Project',
        description: 'Test description',
        status: 'Invalid Status'
      };

      const response = await request(app)
        .post('/api/projects')
        .send(projectData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should return validation error for invalid URL', async () => {
      const projectData = {
        title: 'Test Project',
        description: 'Test description',
        demo_url: 'not-a-valid-url'
      };

      const response = await request(app)
        .post('/api/projects')
        .send(projectData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('should update existing project', async () => {
      const projects = await Project.findAll();
      const projectId = projects[0].id;

      const updateData = {
        title: 'Updated E-Commerce Platform',
        description: 'Updated description',
        status: 'Archived'
      };

      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Project updated successfully');
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.status).toBe(updateData.status);
    });

    it('should return 404 for non-existent project', async () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated description'
      };

      const response = await request(app)
        .put('/api/projects/99999')
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Project not found');
    });

    it('should return validation error for invalid data', async () => {
      const projects = await Project.findAll();
      const projectId = projects[0].id;

      const updateData = {
        title: '', // Empty title should fail validation
        description: 'Valid description'
      };

      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });
});