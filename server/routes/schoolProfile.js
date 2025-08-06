const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'School profile endpoint working', data: {} });
});

router.put('/', (req, res) => {
  res.json({ success: true, message: 'School profile updated', data: {} });
});

module.exports = router;
