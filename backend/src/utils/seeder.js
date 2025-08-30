const { sequelize } = require('../config/database');
const { 
  User, 
  Skill, 
  Project, 
  WorkExperience, 
  Education, 
  ProjectSkill 
} = require('../models');
const logger = require('./logger');

const seedData = async () => {
  try {
    // Sync database
    await sequelize.sync({ force: true });
    logger.info('Database synced successfully');

    // Create user profile
    const user = await User.create({
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      bio: 'Full-stack developer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and emerging technologies. Currently focusing on modern JavaScript frameworks and cloud architecture.',
      title: 'Senior Full-Stack Developer',
      location: 'San Francisco, CA',
      phone: '+1 (555) 123-4567',
      website: 'https://alexjohnson.dev',
      github_url: 'https://github.com/alexjohnson',
      linkedin_url: 'https://linkedin.com/in/alexjohnson-dev',
      twitter_url: 'https://twitter.com/alexjohnsondev',
      profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      resume_url: 'https://alexjohnson.dev/resume.pdf'
    });

    logger.info('User profile created');

    // Create skills
    const skillsData = [
      {
        name: 'JavaScript',
        category: 'Programming Languages',
        proficiency_level: 'Expert',
        years_of_experience: 5,
        is_featured: true,
        description: 'Advanced knowledge of modern ES6+ features, async programming, and performance optimization'
      },
      {
        name: 'TypeScript',
        category: 'Programming Languages',
        proficiency_level: 'Advanced',
        years_of_experience: 3,
        is_featured: true,
        description: 'Strong typing, interfaces, generics, and large-scale application development'
      },
      {
        name: 'Python',
        category: 'Programming Languages',
        proficiency_level: 'Advanced',
        years_of_experience: 4,
        is_featured: true,
        description: 'Backend development, data analysis, automation scripts, and API development'
      },
      {
        name: 'React',
        category: 'Frameworks',
        proficiency_level: 'Expert',
        years_of_experience: 4,
        is_featured: true,
        description: 'Hooks, Context API, performance optimization, and component architecture'
      },
      {
        name: 'Node.js',
        category: 'Frameworks',
        proficiency_level: 'Expert',
        years_of_experience: 4,
        is_featured: true,
        description: 'RESTful APIs, GraphQL, microservices, and server-side optimization'
      },
      {
        name: 'Express.js',
        category: 'Frameworks',
        proficiency_level: 'Advanced',
        years_of_experience: 4,
        is_featured: false,
        description: 'Middleware, routing, authentication, and API development'
      },
      {
        name: 'Next.js',
        category: 'Frameworks',
        proficiency_level: 'Advanced',
        years_of_experience: 2,
        is_featured: true,
        description: 'Server-side rendering, static generation, and full-stack development'
      },
      {
        name: 'PostgreSQL',
        category: 'Databases',
        proficiency_level: 'Advanced',
        years_of_experience: 3,
        is_featured: true,
        description: 'Query optimization, database design, and performance tuning'
      },
      {
        name: 'MongoDB',
        category: 'Databases',
        proficiency_level: 'Intermediate',
        years_of_experience: 2,
        is_featured: false,
        description: 'NoSQL design patterns, aggregation pipeline, and indexing'
      },
      {
        name: 'AWS',
        category: 'Cloud Services',
        proficiency_level: 'Advanced',
        years_of_experience: 3,
        is_featured: true,
        description: 'EC2, S3, Lambda, RDS, and cloud architecture design'
      },
      {
        name: 'Docker',
        category: 'Tools',
        proficiency_level: 'Advanced',
        years_of_experience: 3,
        is_featured: false,
        description: 'Containerization, multi-stage builds, and orchestration'
      },
      {
        name: 'Git',
        category: 'Tools',
        proficiency_level: 'Expert',
        years_of_experience: 5,
        is_featured: false,
        description: 'Version control, branching strategies, and collaboration workflows'
      }
    ];

    const skills = await Skill.bulkCreate(skillsData);
    logger.info(`${skills.length} skills created`);

    // Create work experience
    const workExperienceData = [
      {
        company_name: 'TechCorp Inc.',
        position: 'Senior Full-Stack Developer',
        description: 'Led development of customer-facing web applications serving 100K+ users daily. Architected microservices infrastructure and mentored junior developers.',
        responsibilities: [
          'Developed and maintained React-based web applications',
          'Built RESTful APIs using Node.js and Express',
          'Implemented CI/CD pipelines with Docker and AWS',
          'Mentored 3 junior developers and conducted code reviews',
          'Optimized application performance resulting in 40% faster load times'
        ],
        achievements: [
          'Increased user engagement by 25% through UI/UX improvements',
          'Reduced deployment time by 60% with automated CI/CD pipeline',
          'Led migration to microservices architecture'
        ],
        location: 'San Francisco, CA',
        employment_type: 'Full-time',
        start_date: new Date('2021-03-01'),
        end_date: null,
        is_current: true,
        company_url: 'https://techcorp.com',
        user_id: user.id
      },
      {
        company_name: 'StartupXYZ',
        position: 'Full-Stack Developer',
        description: 'Built the entire web platform from scratch using modern technologies. Worked directly with founders to translate business requirements into technical solutions.',
        responsibilities: [
          'Developed MVP from concept to production in 6 months',
          'Created responsive web application using React and Node.js',
          'Designed and implemented PostgreSQL database schema',
          'Set up AWS infrastructure and deployment processes',
          'Integrated third-party APIs and payment systems'
        ],
        achievements: [
          'Successfully launched platform with 1000+ beta users',
          'Built scalable architecture supporting 10x user growth',
          'Achieved 99.9% uptime in production environment'
        ],
        location: 'San Francisco, CA',
        employment_type: 'Full-time',
        start_date: new Date('2019-06-01'),
        end_date: new Date('2021-02-28'),
        is_current: false,
        company_url: 'https://startupxyz.com',
        user_id: user.id
      },
      {
        company_name: 'Digital Agency Pro',
        position: 'Junior Web Developer',
        description: 'Developed custom websites and web applications for various clients. Gained experience in multiple technologies and client communication.',
        responsibilities: [
          'Built responsive websites using HTML, CSS, and JavaScript',
          'Developed WordPress themes and plugins',
          'Created simple web applications using PHP and MySQL',
          'Collaborated with design team to implement UI/UX specifications',
          'Provided technical support and maintenance for client websites'
        ],
        achievements: [
          'Delivered 15+ client projects on time and within budget',
          'Improved website performance by 35% through optimization',
          'Received outstanding performance review and promotion'
        ],
        location: 'Oakland, CA',
        employment_type: 'Full-time',
        start_date: new Date('2018-01-15'),
        end_date: new Date('2019-05-31'),
        is_current: false,
        company_url: 'https://digitalagencypro.com',
        user_id: user.id
      }
    ];

    const workExperiences = await WorkExperience.bulkCreate(workExperienceData);
    logger.info(`${workExperiences.length} work experiences created`);

    // Create education
    const educationData = [
      {
        institution_name: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field_of_study: 'Computer Science',
        description: 'Focused on software engineering, algorithms, and web development. Participated in hackathons and open-source projects.',
        gpa: 3.7,
        location: 'Berkeley, CA',
        start_date: new Date('2014-08-25'),
        end_date: new Date('2018-05-15'),
        is_current: false,
        institution_url: 'https://berkeley.edu',
        achievements: [
          'Dean\'s List for 3 consecutive semesters',
          'Winner of HackBerkeley 2017',
          'Computer Science Student Association Vice President',
          'Published research paper on web performance optimization'
        ],
        user_id: user.id
      },
      {
        institution_name: 'freeCodeCamp',
        degree: 'Full Stack Web Development Certification',
        field_of_study: 'Web Development',
        description: 'Comprehensive program covering HTML, CSS, JavaScript, React, Node.js, and database technologies.',
        location: 'Online',
        start_date: new Date('2017-06-01'),
        end_date: new Date('2017-12-15'),
        is_current: false,
        institution_url: 'https://freecodecamp.org',
        achievements: [
          'Completed 300+ coding challenges',
          'Built 5 full-stack projects',
          'Contributed to open-source projects'
        ],
        user_id: user.id
      }
    ];

    const educations = await Education.bulkCreate(educationData);
    logger.info(`${educations.length} education records created`);

    // Create projects
    const projectsData = [
      {
        title: 'E-Commerce Platform',
        description: 'A full-featured e-commerce platform built with React, Node.js, and PostgreSQL. Features include user authentication, product catalog, shopping cart, payment processing, and admin dashboard. Implemented advanced features like real-time inventory tracking, order management, and analytics dashboard.',
        short_description: 'Full-stack e-commerce platform with React and Node.js',
        project_url: 'https://ecommerce-demo.alexjohnson.dev',
        github_url: 'https://github.com/alexjohnson/ecommerce-platform',
        demo_url: 'https://ecommerce-demo.alexjohnson.dev',
        image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
        status: 'Completed',
        priority: 10,
        is_featured: true,
        start_date: new Date('2023-01-15'),
        end_date: new Date('2023-04-30'),
        user_id: user.id
      },
      {
        title: 'Task Management Dashboard',
        description: 'A comprehensive project management tool built with Next.js and MongoDB. Features include drag-and-drop task boards, team collaboration, real-time notifications, file attachments, and detailed analytics. Supports multiple project views including Kanban boards, Gantt charts, and calendar views.',
        short_description: 'Next.js project management tool with real-time collaboration',
        project_url: 'https://taskmanager.alexjohnson.dev',
        github_url: 'https://github.com/alexjohnson/task-manager',
        demo_url: 'https://taskmanager.alexjohnson.dev',
        image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800',
        status: 'Completed',
        priority: 9,
        is_featured: true,
        start_date: new Date('2023-06-01'),
        end_date: new Date('2023-08-15'),
        user_id: user.id
      },
      {
        title: 'Weather Analytics API',
        description: 'RESTful API service that aggregates weather data from multiple sources and provides analytics endpoints. Built with Python FastAPI and PostgreSQL. Features include data caching, rate limiting, comprehensive documentation, and real-time weather alerts. Processes over 1M requests daily.',
        short_description: 'Python API for weather data analytics and forecasting',
        github_url: 'https://github.com/alexjohnson/weather-analytics-api',
        demo_url: 'https://weather-api.alexjohnson.dev/docs',
        image_url: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800',
        status: 'Completed',
        priority: 8,
        is_featured: true,
        start_date: new Date('2023-09-01'),
        end_date: new Date('2023-11-30'),
        user_id: user.id
      },
      {
        title: 'Real-time Chat Application',
        description: 'Modern chat application built with React, Socket.io, and Node.js. Features include private messaging, group chats, file sharing, emoji reactions, and push notifications. Implements end-to-end encryption and supports thousands of concurrent users.',
        short_description: 'Real-time chat app with Socket.io and React',
        project_url: 'https://chat.alexjohnson.dev',
        github_url: 'https://github.com/alexjohnson/realtime-chat',
        demo_url: 'https://chat.alexjohnson.dev',
        image_url: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800',
        status: 'Completed',
        priority: 7,
        is_featured: false,
        start_date: new Date('2022-10-01'),
        end_date: new Date('2022-12-15'),
        user_id: user.id
      },
      {
        title: 'Personal Finance Tracker',
        description: 'Web application for tracking personal finances with automated transaction categorization, budget planning, and financial goal tracking. Built with React and Express.js, integrates with major banks APIs for transaction import.',
        short_description: 'Personal finance management with automated categorization',
        github_url: 'https://github.com/alexjohnson/finance-tracker',
        demo_url: 'https://finance.alexjohnson.dev',
        image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
        status: 'In Progress',
        priority: 6,
        is_featured: false,
        start_date: new Date('2024-01-01'),
        end_date: null,
        user_id: user.id
      }
    ];

    const projects = await Project.bulkCreate(projectsData);
    logger.info(`${projects.length} projects created`);

    // Create project-skill associations
    const projectSkillsData = [
      // E-Commerce Platform
      { project_id: projects[0].id, skill_id: skills.find(s => s.name === 'React').id, proficiency_used: 'Expert' },
      { project_id: projects[0].id, skill_id: skills.find(s => s.name === 'Node.js').id, proficiency_used: 'Expert' },
      { project_id: projects[0].id, skill_id: skills.find(s => s.name === 'PostgreSQL').id, proficiency_used: 'Advanced' },
      { project_id: projects[0].id, skill_id: skills.find(s => s.name === 'JavaScript').id, proficiency_used: 'Expert' },
      { project_id: projects[0].id, skill_id: skills.find(s => s.name === 'Express.js').id, proficiency_used: 'Advanced' },

      // Task Management Dashboard
      { project_id: projects[1].id, skill_id: skills.find(s => s.name === 'Next.js').id, proficiency_used: 'Advanced' },
      { project_id: projects[1].id, skill_id: skills.find(s => s.name === 'React').id, proficiency_used: 'Expert' },
      { project_id: projects[1].id, skill_id: skills.find(s => s.name === 'MongoDB').id, proficiency_used: 'Intermediate' },
      { project_id: projects[1].id, skill_id: skills.find(s => s.name === 'TypeScript').id, proficiency_used: 'Advanced' },

      // Weather Analytics API
      { project_id: projects[2].id, skill_id: skills.find(s => s.name === 'Python').id, proficiency_used: 'Advanced' },
      { project_id: projects[2].id, skill_id: skills.find(s => s.name === 'PostgreSQL').id, proficiency_used: 'Advanced' },
      { project_id: projects[2].id, skill_id: skills.find(s => s.name === 'AWS').id, proficiency_used: 'Advanced' },
      { project_id: projects[2].id, skill_id: skills.find(s => s.name === 'Docker').id, proficiency_used: 'Advanced' },

      // Real-time Chat Application
      { project_id: projects[3].id, skill_id: skills.find(s => s.name === 'React').id, proficiency_used: 'Expert' },
      { project_id: projects[3].id, skill_id: skills.find(s => s.name === 'Node.js').id, proficiency_used: 'Expert' },
      { project_id: projects[3].id, skill_id: skills.find(s => s.name === 'JavaScript').id, proficiency_used: 'Expert' },
      { project_id: projects[3].id, skill_id: skills.find(s => s.name === 'MongoDB').id, proficiency_used: 'Intermediate' },

      // Personal Finance Tracker
      { project_id: projects[4].id, skill_id: skills.find(s => s.name === 'React').id, proficiency_used: 'Expert' },
      { project_id: projects[4].id, skill_id: skills.find(s => s.name === 'Express.js').id, proficiency_used: 'Advanced' },
      { project_id: projects[4].id, skill_id: skills.find(s => s.name === 'JavaScript').id, proficiency_used: 'Expert' },
      { project_id: projects[4].id, skill_id: skills.find(s => s.name === 'PostgreSQL').id, proficiency_used: 'Advanced' }
    ];

    await ProjectSkill.bulkCreate(projectSkillsData);
    logger.info(`${projectSkillsData.length} project-skill associations created`);

    logger.info('Database seeding completed successfully!');
    logger.info(`Created:
      - 1 user profile
      - ${skills.length} skills
      - ${workExperiences.length} work experiences
      - ${educations.length} education records
      - ${projects.length} projects
      - ${projectSkillsData.length} project-skill associations`);

  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedData().then(() => {
    logger.info('Seeding completed');
    process.exit(0);
  });
}

module.exports = { seedData };