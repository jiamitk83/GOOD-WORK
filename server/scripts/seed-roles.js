const mongoose = require('mongoose');
require('dotenv').config();

const Permission = require('../models/Permission');
const Role = require('../models/Role');
const User = require('../models/User');
const connectDB = require('../config/db');

// Default permissions
const defaultPermissions = [
  // User Management
  { name: 'manage_users', description: 'Create, read, update, and delete users', category: 'user_management' },
  { name: 'view_users', description: 'View user information', category: 'user_management' },
  { name: 'manage_roles', description: 'Create and manage user roles', category: 'user_management' },
  
  // Student Management
  { name: 'manage_students', description: 'Create, read, update, and delete students', category: 'student_management' },
  { name: 'view_students', description: 'View student information', category: 'student_management' },
  { name: 'manage_admissions', description: 'Handle student admissions', category: 'student_management' },
  
  // Teacher Management
  { name: 'manage_teachers', description: 'Create, read, update, and delete teachers', category: 'teacher_management' },
  { name: 'view_teachers', description: 'View teacher information', category: 'teacher_management' },
  
  // Academic Management
  { name: 'manage_classes', description: 'Create and manage classes', category: 'academic_management' },
  { name: 'manage_subjects', description: 'Create and manage subjects', category: 'academic_management' },
  { name: 'manage_timetable', description: 'Create and manage timetables', category: 'academic_management' },
  { name: 'manage_grades', description: 'Enter and manage student grades', category: 'academic_management' },
  { name: 'view_grades', description: 'View student grades', category: 'academic_management' },
  { name: 'manage_attendance', description: 'Mark and manage attendance', category: 'academic_management' },
  { name: 'view_attendance', description: 'View attendance records', category: 'academic_management' },
  
  // Financial Management
  { name: 'manage_fees', description: 'Manage fee structures and payments', category: 'financial_management' },
  { name: 'collect_fees', description: 'Collect fee payments', category: 'financial_management' },
  { name: 'view_fees', description: 'View fee information', category: 'financial_management' },
  { name: 'generate_reports', description: 'Generate financial reports', category: 'financial_management' },
  
  // System Management
  { name: 'system_admin', description: 'Full system administration access', category: 'system_management' },
  { name: 'backup_data', description: 'Create and manage data backups', category: 'system_management' },
  { name: 'view_logs', description: 'View system logs', category: 'system_management' }
];

// Default roles with their permissions
const defaultRoles = [
  {
    name: 'admin',
    description: 'System Administrator with full access',
    level: 10,
    permissions: ['system_admin', 'manage_users', 'manage_roles', 'manage_students', 'manage_teachers', 
                 'manage_classes', 'manage_subjects', 'manage_timetable', 'manage_grades', 'manage_attendance',
                 'manage_fees', 'collect_fees', 'generate_reports', 'backup_data', 'view_logs']
  },
  {
    name: 'principal',
    description: 'School Principal with administrative access',
    level: 9,
    permissions: ['view_users', 'manage_students', 'manage_teachers', 'manage_classes', 'manage_subjects',
                 'manage_timetable', 'view_grades', 'view_attendance', 'view_fees', 'generate_reports']
  },
  {
    name: 'teacher',
    description: 'Teacher with academic management access',
    level: 5,
    permissions: ['view_students', 'manage_grades', 'manage_attendance', 'view_attendance', 'view_grades']
  },
  {
    name: 'staff',
    description: 'Administrative staff with limited access',
    level: 3,
    permissions: ['view_students', 'collect_fees', 'view_fees', 'manage_admissions']
  },
  {
    name: 'student',
    description: 'Student with view-only access to own data',
    level: 1,
    permissions: ['view_grades', 'view_attendance', 'view_fees']
  },
  {
    name: 'parent',
    description: 'Parent with view access to child data',
    level: 2,
    permissions: ['view_grades', 'view_attendance', 'view_fees']
  }
];

const seedRolesAndPermissions = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting to seed roles and permissions...');

    // Clear existing data
    await Permission.deleteMany({});
    await Role.deleteMany({});
    console.log('✅ Cleared existing permissions and roles');

    // Create permissions
    const createdPermissions = await Permission.insertMany(defaultPermissions);
    console.log(`✅ Created ${createdPermissions.length} permissions`);

    // Create permission map for easy lookup
    const permissionMap = {};
    createdPermissions.forEach(permission => {
      permissionMap[permission.name] = permission._id;
    });

    // Create roles with permission references
    const rolesToCreate = defaultRoles.map(role => ({
      ...role,
      permissions: role.permissions.map(permName => permissionMap[permName]).filter(id => id)
    }));

    const createdRoles = await Role.insertMany(rolesToCreate);
    console.log(`✅ Created ${createdRoles.length} roles`);

    // Create default admin user if it doesn't exist
    const adminRole = createdRoles.find(role => role.name === 'admin');
    const existingAdmin = await User.findOne({ username: 'admin' });

    if (!existingAdmin && adminRole) {
      const adminUser = new User({
        username: 'admin',
        email: 'admin@school.com',
        password: 'admin123', // This will be hashed by the pre-save middleware
        firstName: 'System',
        lastName: 'Administrator',
        role: adminRole._id
      });

      await adminUser.save();
      console.log('✅ Created default admin user');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('   Email: admin@school.com');
    }

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\nCreated Roles:');
    createdRoles.forEach(role => {
      console.log(`  - ${role.name}: ${role.description} (Level: ${role.level})`);
    });

    console.log('\nCreated Permission Categories:');
    const categories = [...new Set(createdPermissions.map(p => p.category))];
    categories.forEach(category => {
      const count = createdPermissions.filter(p => p.category === category).length;
      console.log(`  - ${category}: ${count} permissions`);
    });

  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
};

// Run the seeding function
if (require.main === module) {
  seedRolesAndPermissions();
}

module.exports = seedRolesAndPermissions;
