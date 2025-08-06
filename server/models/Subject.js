const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Subject code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['core', 'elective', 'optional', 'extra-curricular'],
    default: 'core'
  },
  classes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  credits: {
    type: Number,
    default: 1,
    min: [0, 'Credits cannot be negative']
  },
  hoursPerWeek: {
    type: Number,
    default: 1,
    min: [1, 'Hours per week must be at least 1']
  },
  syllabus: {
    topics: [String],
    books: [{
      title: String,
      author: String,
      publisher: String,
      isbn: String
    }],
    resources: [String]
  },
  assessment: {
    theory: {
      type: Number,
      default: 80,
      min: [0, 'Theory marks cannot be negative'],
      max: [100, 'Theory marks cannot exceed 100']
    },
    practical: {
      type: Number,
      default: 20,
      min: [0, 'Practical marks cannot be negative'],
      max: [100, 'Practical marks cannot exceed 100']
    },
    total: {
      type: Number,
      default: 100
    },
    passingMarks: {
      type: Number,
      default: 35,
      min: [0, 'Passing marks cannot be negative']
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
subjectSchema.index({ code: 1 });
subjectSchema.index({ department: 1 });
subjectSchema.index({ classes: 1 });

// Pre-save middleware to calculate total assessment marks
subjectSchema.pre('save', function(next) {
  if (this.isModified('assessment.theory') || this.isModified('assessment.practical')) {
    this.assessment.total = this.assessment.theory + this.assessment.practical;
  }
  next();
});

module.exports = mongoose.model('Subject', subjectSchema);
