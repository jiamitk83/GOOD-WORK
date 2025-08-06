const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

const router = express.Router();

// @route   GET /api/teachers
// @desc    Get all teachers with pagination and filters
// @access  Private
router.get('/', [
  auth,
  checkPermission('view_teachers')
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { isActive: true };
    if (req.query.department) filter.department = req.query.department;
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { employeeId: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const teachers = await Teacher.find(filter)
      .populate('subjects', 'name code')
      .sort({ firstName: 1, lastName: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Teacher.countDocuments(filter);

    res.json({
      success: true,
      data: {
        teachers,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/teachers
// @desc    Create new teacher
// @access  Private
router.post('/', [
  auth,
  checkPermission('manage_teachers'),
  body('employeeId').trim().notEmpty().withMessage('Employee ID is required'),
  body('firstName').trim().isLength({ min: 1, max: 50 }).withMessage('First name must be 1-50 characters'),
  body('lastName').trim().isLength({ min: 1, max: 50 }).withMessage('Last name must be 1-50 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('dateOfBirth').isISO8601().withMessage('Please provide a valid date of birth'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  body('joiningDate').isISO8601().withMessage('Please provide a valid joining date'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('designation').trim().notEmpty().withMessage('Designation is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const teacher = new Teacher(req.body);
    await teacher.save();

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: { teacher }
    });
  } catch (error) {
    console.error('Create teacher error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Teacher with this employee ID or email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
