# School ERP Backend Setup and Run Instructions

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (running on localhost:27017)

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup Environment
- The `.env` file is already configured for local development
- Default MongoDB connection: `mongodb://localhost:27017/school_erp`

### 3. Seed Initial Data (Optional)
```bash
npm run seed
```
This will create:
- Default permissions and roles
- Admin user (username: `admin`, password: `admin123`)

### 4. Start the Server
```bash
npm start
# or for development with auto-restart:
npm run dev
```

The server will run on: `http://localhost:5000`

## API Endpoints

### Health Check
- GET `/api/health` - Server status

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration
- GET `/api/auth/me` - Get current user
- POST `/api/auth/logout` - User logout
- PUT `/api/auth/change-password` - Change password

### Students
- GET `/api/students` - Get all students
- POST `/api/students` - Create student
- GET `/api/students/:id` - Get student by ID
- PUT `/api/students/:id` - Update student
- DELETE `/api/students/:id` - Delete student

### Teachers
- GET `/api/teachers` - Get all teachers
- POST `/api/teachers` - Create teacher
- (Additional CRUD endpoints available)

### Other Modules
- `/api/classes` - Class management
- `/api/sections` - Section management
- `/api/subjects` - Subject management
- `/api/academic-years` - Academic year management
- `/api/timetable` - Timetable management
- `/api/roles` - Role management
- `/api/school-profile` - School profile

## Database Models
All models are defined in `/models/` directory:
- User.js - User authentication and profiles
- Student.js - Student information
- Teacher.js - Teacher information
- Class.js - Class definitions
- Section.js - Section management
- Subject.js - Subject catalog
- AcademicYear.js - Academic year management
- Role.js - User roles
- Permission.js - System permissions

## Default Admin Account
After running `npm run seed`:
- Username: `admin`
- Password: `admin123`
- Email: `admin@school.com`

## Environment Variables
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school_erp
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=30d
```

## Development Notes
- The server uses MongoDB for data persistence
- JWT tokens for authentication
- Express.js with comprehensive middleware
- Full CRUD operations for all modules
- Role-based permission system
- Input validation and error handling
