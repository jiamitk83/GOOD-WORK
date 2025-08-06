const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
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
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
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
  joiningDate: {
    type: Date,
    required: [true, 'Joining date is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true
  },
  qualification: {
    highest: {
      type: String,
      required: [true, 'Highest qualification is required']
    },
    details: [{
      degree: String,
      institution: String,
      year: Number,
      percentage: Number
    }]
  },
  experience: {
    total: {
      type: Number,
      default: 0
    },
    previous: [{
      institution: String,
      position: String,
      duration: String,
      from: Date,
      to: Date
    }]
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  classes: [{
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class'
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section'
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    }
  }],
  contact: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    }
  },
  salary: {
    basic: {
      type: Number,
      required: [true, 'Basic salary is required']
    },
    allowances: {
      type: Number,
      default: 0
    },
    deductions: {
      type: Number,
      default: 0
    },
    total: Number
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
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'resigned', 'terminated', 'on_leave'],
    default: 'active'
  },
  avatar: String
}, {
  timestamps: true
});

// Indexes for faster queries
teacherSchema.index({ employeeId: 1 });
teacherSchema.index({ email: 1 });
teacherSchema.index({ department: 1 });
teacherSchema.index({ subjects: 1 });

// Virtual for full name
teacherSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to calculate total salary
teacherSchema.pre('save', function(next) {
  if (this.isModified('salary.basic') || this.isModified('salary.allowances') || this.isModified('salary.deductions')) {
    this.salary.total = this.salary.basic + this.salary.allowances - this.salary.deductions;
  }
  next();
});

module.exports = mongoose.model('Teacher', teacherSchema);
