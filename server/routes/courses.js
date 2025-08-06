const express = require('express');
const router = express.Router();

// Basic placeholder routes
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Courses endpoint working', data: [] });
});

module.exports = router;
