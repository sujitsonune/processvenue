const express = require('express');
const { body, query, param } = require('express-validator');
const { getProjects, getProject, createProject, updateProject } = require('../controllers/projectsController');

const router = express.Router();

// Validation middleware
const projectValidation = [
  body('title').isLength({ min: 1, max: 100 }).trim(),
  body('description').isLength({ min: 1 }).trim(),
  body('short_description').optional().isLength({ max: 255 }).trim(),
  body('project_url').optional().isURL(),
  body('github_url').optional().isURL(),
  body('demo_url').optional().isURL(),
  body('image_url').optional().isURL(),
  body('status').optional().isIn(['Planning', 'In Progress', 'Completed', 'On Hold', 'Archived']),
  body('priority').optional().isInt({ min: 0, max: 10 }),
  body('is_featured').optional().isBoolean(),
  body('start_date').optional().isISO8601(),
  body('end_date').optional().isISO8601(),
  body('skills').optional().isArray()
];

const queryValidation = [
  query('skill').optional().isString(),
  query('status').optional().isIn(['Planning', 'In Progress', 'Completed', 'On Hold', 'Archived']),
  query('featured').optional().isBoolean(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
  query('sort').optional().isIn(['priority', 'created_at', 'updated_at', 'title', 'start_date']),
  query('order').optional().isIn(['ASC', 'DESC'])
];

const idValidation = [
  param('id').isInt({ min: 1 })
];

// Routes
router.get('/', queryValidation, getProjects);
router.get('/:id', idValidation, getProject);
router.post('/', projectValidation, createProject);
router.put('/:id', [...idValidation, ...projectValidation], updateProject);

module.exports = router;