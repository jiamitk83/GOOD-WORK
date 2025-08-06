const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Subjects endpoint working', data: [] });
});

module.exports = router;
