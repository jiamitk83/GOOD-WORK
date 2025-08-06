const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Permission name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Permission description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Permission category is required'],
    enum: ['user_management', 'student_management', 'teacher_management', 'academic_management', 'financial_management', 'system_management'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Permission', permissionSchema);
