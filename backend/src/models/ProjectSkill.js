const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProjectSkill = sequelize.define('ProjectSkill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id'
    }
  },
  skill_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'skills',
      key: 'id'
    }
  },
  proficiency_used: {
    type: DataTypes.ENUM,
    values: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    allowNull: true
  }
}, {
  tableName: 'project_skills',
  indexes: [
    {
      unique: true,
      fields: ['project_id', 'skill_id']
    },
    {
      fields: ['project_id']
    },
    {
      fields: ['skill_id']
    }
  ]
});

module.exports = ProjectSkill;