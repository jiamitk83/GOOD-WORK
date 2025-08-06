const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema({
  year: {
    type: String,
    required: [true, 'Academic year is required'],
    unique: true,
    trim: true,
    match: [/^\d{4}-\d{4}$/, 'Academic year must be in format YYYY-YYYY (e.g., 2023-2024)']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  isActive: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true
  },
  terms: [{
    name: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Ensure only one academic year is active at a time
academicYearSchema.pre('save', async function(next) {
  if (this.isActive && this.isModified('isActive')) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

// Validation to ensure end date is after start date
academicYearSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

module.exports = mongoose.model('AcademicYear', academicYearSchema);
