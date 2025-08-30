const { User, WorkExperience, Education } = require('../models');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

const getProfile = async (req, res) => {
  try {
    const profile = await User.findOne({
      where: { id: 1 }, // Assuming single user for now
      include: [
        {
          model: WorkExperience,
          as: 'work_experiences',
          order: [['start_date', 'DESC']]
        },
        {
          model: Education,
          as: 'educations',
          order: [['start_date', 'DESC']]
        }
      ]
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    logger.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
};

const createProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const profile = await User.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: profile
    });
  } catch (error) {
    logger.error('Error creating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating profile'
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const [updated] = await User.update(req.body, {
      where: { id: 1 } // Assuming single user for now
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    const profile = await User.findOne({
      where: { id: 1 },
      include: [
        {
          model: WorkExperience,
          as: 'work_experiences',
          order: [['start_date', 'DESC']]
        },
        {
          model: Education,
          as: 'educations',
          order: [['start_date', 'DESC']]
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    logger.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

const patchProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // Remove undefined values for partial update
    const updateData = Object.fromEntries(
      Object.entries(req.body).filter(([_, value]) => value !== undefined)
    );

    const [updated] = await User.update(updateData, {
      where: { id: 1 }
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    const profile = await User.findOne({ where: { id: 1 } });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    logger.error('Error patching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
  patchProfile
};