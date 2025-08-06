const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  admissionNumber: {
    type: String,
    required: [true, 'Admission number is required'],
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name must be less than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name must be less than 50 characters']
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other']
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class is required']
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: [true, 'Section is required']
  },
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: [true, 'Academic year is required']
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    trim: true
  },
  contact: {
    phone: {
      type: String,
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  parents: {
    father: {
      name: String,
      phone: String,
      email: String,
      occupation: String
    },
    mother: {
      name: String,
      phone: String,
      email: String,
      occupation: String
    },
    guardian: {
      name: String,
      phone: String,
      email: String,
      relation: String
    }
  },
  admissionDate: {
    type: Date,
    required: [true, 'Admission date is required']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  medicalInfo: {
    allergies: [String],
    conditions: [String],
    medications: [String],
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'transferred', 'graduated', 'suspended'],
    default: 'active'
  },
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  fees: {
    totalFees: {
      type: Number,
      default: 0
    },
    paidFees: {
      type: Number,
      default: 0
    },
    pendingFees: {
      type: Number,
      default: 0
    }
  },
  avatar: String
}, {
  timestamps: true
});

// Indexes for faster queries
studentSchema.index({ admissionNumber: 1 });
studentSchema.index({ class: 1, section: 1 });
studentSchema.index({ academicYear: 1 });
studentSchema.index({ email: 1 });

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to calculate pending fees
studentSchema.pre('save', function(next) {
  if (this.isModified('fees.totalFees') || this.isModified('fees.paidFees')) {
    this.fees.pendingFees = this.fees.totalFees - this.fees.paidFees;
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);
