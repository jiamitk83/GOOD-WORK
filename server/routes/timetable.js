const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Timetable endpoint working', data: [] });
});

module.exports = router;
