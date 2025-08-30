const express = require('express');
const { body } = require('express-validator');
const { getProfile, createProfile, updateProfile, patchProfile } = require('../controllers/profileController');

const router = express.Router();

// Validation middleware
const profileValidation = [
  body('name').optional().isLength({ min: 1, max: 100 }).trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('bio').optional().isLength({ max: 1000 }).trim(),
  body('title').optional().isLength({ max: 100 }).trim(),
  body('location').optional().isLength({ max: 100 }).trim(),
  body('phone').optional().isMobilePhone(),
  body('website').optional().isURL(),
  body('github_url').optional().isURL(),
  body('linkedin_url').optional().isURL(),
  body('twitter_url').optional().isURL(),
  body('profile_image_url').optional().isURL(),
  body('resume_url').optional().isURL()
];

// Routes
router.get('/', getProfile);
router.post('/', profileValidation, createProfile);
router.put('/', profileValidation, updateProfile);
router.patch('/', profileValidation, patchProfile);

module.exports = router;