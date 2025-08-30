const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Skill = sequelize.define('Skill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  category: {
    type: DataTypes.ENUM,
    values: ['Programming Languages', 'Frameworks', 'Databases', 'Tools', 'Cloud Services', 'Other'],
    allowNull: false,
    defaultValue: 'Other'
  },
  proficiency_level: {
    type: DataTypes.ENUM,
    values: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    allowNull: false,
    defaultValue: 'Intermediate'
  },
  years_of_experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 50
    }
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  icon_url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'skills',
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['is_featured']
    },
    {
      fields: ['proficiency_level']
    }
  ]
});

module.exports = Skill;