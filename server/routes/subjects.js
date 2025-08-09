const express = require('express');
const router = express.Router();


// Import Subject model
const Subject = require('../models/Subject');

// GET /subjects - return all subjects (mock or from DB)
router.get('/', async (req, res) => {
  try {
    // Try to fetch from DB (if connected)
    if (Subject && Subject.find) {
      const subjects = await Subject.find();
      return res.json({ success: true, message: 'Subjects fetched from database', data: subjects });
    }
  } catch (err) {
    // Fallback to mock data
  }
  // Mock data fallback
  const mockSubjects = [
    { id: '1', name: 'Mathematics', code: 'MATH', type: 'Core', classes: ['8', '9', '10', '11', '12'] },
    { id: '2', name: 'Physics', code: 'PHY', type: 'Core', classes: ['9', '10', '11', '12'] },
    { id: '3', name: 'Chemistry', code: 'CHEM', type: 'Core', classes: ['9', '10', '11', '12'] },
    { id: '4', name: 'Biology', code: 'BIO', type: 'Core', classes: ['9', '10', '11', '12'] },
    { id: '5', name: 'English', code: 'ENG', type: 'Core', classes: ['8', '9', '10', '11', '12'] },
    { id: '6', name: 'Hindi', code: 'HIN', type: 'Core', classes: ['8', '9', '10', '11', '12'] },
    { id: '7', name: 'Social Studies', code: 'SOC', type: 'Core', classes: ['8', '9', '10'] },
    { id: '8', name: 'Computer Science', code: 'CS', type: 'Elective', classes: ['9', '10', '11', '12'] }
  ];
  res.json({ success: true, message: 'Subjects endpoint working (mock data)', data: mockSubjects });
});

module.exports = router;
