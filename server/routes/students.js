const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Student = require('../models/Student');
const Class = require('../models/Class');
const Section = require('../models/Section');
const AcademicYear = require('../models/AcademicYear');
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

const router = express.Router();

// @route   GET /api/students
// @desc    Get all students with pagination and filters
// @access  Private
router.get('/', [
  auth,
  checkPermission('view_students'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('class').optional().isMongoId().withMessage('Invalid class ID'),
  query('section').optional().isMongoId().withMessage('Invalid section ID'),
  query('academicYear').optional().isMongoId().withMessage('Invalid academic year ID')
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };
    if (req.query.class) filter.class = req.query.class;
    if (req.query.section) filter.section = req.query.section;
    if (req.query.academicYear) filter.academicYear = req.query.academicYear;
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { admissionNumber: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Get students with populated references
    const students = await Student.find(filter)
      .populate('class', 'name level')
      .populate('section', 'name')
      .populate('academicYear', 'year')
      .sort({ firstName: 1, lastName: 1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Student.countDocuments(filter);

    res.json({
      success: true,
      data: {
        students,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/students/:id
// @desc    Get student by ID
// @access  Private
router.get('/:id', [
  auth,
  checkPermission('view_students')
], async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('class', 'name level')
      .populate('section', 'name')
      .populate('academicYear', 'year');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: { student }
    });
  } catch (error) {
    console.error('Get student error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/students
// @desc    Create new student
// @access  Private
router.post('/', [
  auth,
  checkPermission('manage_students'),
  body('admissionNumber').trim().notEmpty().withMessage('Admission number is required'),
  body('firstName').trim().isLength({ min: 1, max: 50 }).withMessage('First name must be 1-50 characters'),
  body('lastName').trim().isLength({ min: 1, max: 50 }).withMessage('Last name must be 1-50 characters'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('dateOfBirth').isISO8601().withMessage('Please provide a valid date of birth'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  body('class').isMongoId().withMessage('Invalid class ID'),
  body('section').isMongoId().withMessage('Invalid section ID'),
  body('academicYear').isMongoId().withMessage('Invalid academic year ID'),
  body('rollNumber').trim().notEmpty().withMessage('Roll number is required'),
  body('admissionDate').isISO8601().withMessage('Please provide a valid admission date')
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

    // Check if admission number already exists
    const existingStudent = await Student.findOne({ 
      admissionNumber: req.body.admissionNumber 
    });
    
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this admission number already exists'
      });
    }

    // Verify class, section, and academic year exist
    const [classDoc, section, academicYear] = await Promise.all([
      Class.findById(req.body.class),
      Section.findById(req.body.section),
      AcademicYear.findById(req.body.academicYear)
    ]);

    if (!classDoc || !section || !academicYear) {
      return res.status(400).json({
        success: false,
        message: 'Invalid class, section, or academic year'
      });
    }

    // Create student
    const student = new Student(req.body);
    await student.save();

    // Update section student count
    await Section.findByIdAndUpdate(
      req.body.section,
      { $inc: { currentStudents: 1 } }
    );

    // Populate the created student
    await student.populate('class', 'name level');
    await student.populate('section', 'name');
    await student.populate('academicYear', 'year');

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: { student }
    });
  } catch (error) {
    console.error('Create student error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Student with this admission number or email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private
router.put('/:id', [
  auth,
  checkPermission('manage_students'),
  body('firstName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('First name must be 1-50 characters'),
  body('lastName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Last name must be 1-50 characters'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('dateOfBirth').optional().isISO8601().withMessage('Please provide a valid date of birth'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other')
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

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('class', 'name level')
    .populate('section', 'name')
    .populate('academicYear', 'year');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: { student }
    });
  } catch (error) {
    console.error('Update student error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID'
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Student with this admission number or email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/students/:id
// @desc    Delete student (soft delete)
// @access  Private
router.delete('/:id', [
  auth,
  checkPermission('manage_students')
], async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isActive: false, status: 'inactive' },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update section student count
    await Section.findByIdAndUpdate(
      student.section,
      { $inc: { currentStudents: -1 } }
    );

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
