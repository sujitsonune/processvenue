const User = require('./User');
const Skill = require('./Skill');
const Project = require('./Project');
const WorkExperience = require('./WorkExperience');
const Education = require('./Education');
const ProjectSkill = require('./ProjectSkill');

// Define associations
User.hasMany(Project, { foreignKey: 'user_id', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(WorkExperience, { foreignKey: 'user_id', as: 'work_experiences' });
WorkExperience.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Education, { foreignKey: 'user_id', as: 'educations' });
Education.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Many-to-many relationship between Projects and Skills
Project.belongsToMany(Skill, {
  through: ProjectSkill,
  foreignKey: 'project_id',
  otherKey: 'skill_id',
  as: 'skills'
});

Skill.belongsToMany(Project, {
  through: ProjectSkill,
  foreignKey: 'skill_id',
  otherKey: 'project_id',
  as: 'projects'
});

// Direct associations for junction table access
Project.hasMany(ProjectSkill, { foreignKey: 'project_id', as: 'project_skills' });
ProjectSkill.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

Skill.hasMany(ProjectSkill, { foreignKey: 'skill_id', as: 'skill_projects' });
ProjectSkill.belongsTo(Skill, { foreignKey: 'skill_id', as: 'skill' });

module.exports = {
  User,
  Skill,
  Project,
  WorkExperience,
  Education,
  ProjectSkill
};