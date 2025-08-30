const express = require('express');
const { body, query } = require('express-validator');
const { getSkills, getTopSkills, createSkill } = require('../controllers/skillsController');

const router = express.Router();

// Validation middleware
const skillValidation = [
  body('name').isLength({ min: 1, max: 50 }).trim(),
  body('category').isIn(['Programming Languages', 'Frameworks', 'Databases', 'Tools', 'Cloud Services', 'Other']),
  body('proficiency_level').isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
  body('years_of_experience').optional().isInt({ min: 0, max: 50 }),
  body('is_featured').optional().isBoolean(),
  body('icon_url').optional().isURL(),
  body('description').optional().isLength({ max: 500 }).trim()
];

const queryValidation = [
  query('category').optional().isIn(['Programming Languages', 'Frameworks', 'Databases', 'Tools', 'Cloud Services', 'Other']),
  query('proficiency').optional().isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
  query('featured').optional().isBoolean(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
];

// Routes
router.get('/', queryValidation, getSkills);
router.get('/top', getTopSkills);
router.post('/', skillValidation, createSkill);

module.exports = router;