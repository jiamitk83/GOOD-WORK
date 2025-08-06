const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    trim: true,
    enum: ['admin', 'teacher', 'student', 'parent', 'staff', 'principal']
  },
  description: {
    type: String,
    required: [true, 'Role description is required'],
    trim: true
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  level: {
    type: Number,
    required: true,
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);
