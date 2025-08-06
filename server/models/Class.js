const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true
  },
  level: {
    type: Number,
    required: [true, 'Class level is required'],
    min: [1, 'Class level must be at least 1'],
    max: [12, 'Class level cannot exceed 12']
  },
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: [true, 'Academic year is required']
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  maxStudents: {
    type: Number,
    default: 40,
    min: [1, 'Maximum students must be at least 1']
  },
  currentStudents: {
    type: Number,
    default: 0
  },
  fees: {
    tuitionFee: {
      type: Number,
      default: 0
    },
    otherFees: {
      type: Number,
      default: 0
    },
    totalFees: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
classSchema.index({ level: 1, academicYear: 1 });
classSchema.index({ academicYear: 1 });

// Pre-save middleware to calculate total fees
classSchema.pre('save', function(next) {
  if (this.isModified('fees.tuitionFee') || this.isModified('fees.otherFees')) {
    this.fees.totalFees = this.fees.tuitionFee + this.fees.otherFees;
  }
  next();
});

module.exports = mongoose.model('Class', classSchema);
