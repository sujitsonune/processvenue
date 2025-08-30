const express = require('express');
const { query } = require('express-validator');
const { search } = require('../controllers/searchController');

const router = express.Router();

// Validation middleware
const searchValidation = [
  query('q').isLength({ min: 1 }).trim().withMessage('Search query is required'),
  query('type').optional().isIn(['all', 'profile', 'projects', 'skills', 'experience', 'education']),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
];

// Routes
router.get('/', searchValidation, search);

module.exports = router;