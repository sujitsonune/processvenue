const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WorkExperience = sequelize.define('WorkExperience', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  responsibilities: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  achievements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  employment_type: {
    type: DataTypes.ENUM,
    values: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
    allowNull: false,
    defaultValue: 'Full-time'
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_current: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  company_url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'work_experiences',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['is_current']
    },
    {
      fields: ['start_date']
    }
  ]
});

module.exports = WorkExperience;