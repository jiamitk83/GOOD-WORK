import api from './api';

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  class: string;
  section: string;
  status: 'present' | 'absent' | 'late' | 'leave' | '';
  remark: string;
}

export interface AttendanceRecord {
  id?: string;
  date: string;
  class: string;
  section: string;
  subject?: string;
  period?: number;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  students: Student[];
  takenBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  leaveDays: number;
  attendancePercentage: number;
}

export interface ClassAttendanceStats {
  class: string;
  section: string;
  totalStudents: number;
  averageAttendance: number;
  totalDays: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  leaveCount: number;
}

export interface AttendanceReportFilter {
  startDate: string;
  endDate: string;
  class?: string;
  section?: string;
  student?: string;
  subject?: string;
}

class AttendanceService {
  private baseUrl = '/api/attendance';

  // Get attendance records with filters
  async getAttendanceRecords(filter: Partial<AttendanceReportFilter> = {}): Promise<AttendanceRecord[]> {
    try {
      const params = new URLSearchParams();
      Object.entries(filter).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`${this.baseUrl}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      
      // Return mock data for development
      return this.getMockAttendanceRecords(filter);
    }
  }

  // Get attendance for a specific date, class, and section
  async getAttendanceByDate(date: string, className: string, section: string): Promise<AttendanceRecord | null> {
    try {
      const response = await api.get(`${this.baseUrl}/${date}/${className}/${section}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance by date:', error);
      
      // Return mock data for development
      return this.getMockAttendanceByDate(date, className, section);
    }
  }

  // Save attendance record
  async saveAttendance(record: AttendanceRecord): Promise<AttendanceRecord> {
    try {
      if (record.id) {
        // Update existing record
        const response = await api.put(`${this.baseUrl}/${record.id}`, record);
        return response.data;
      } else {
        // Create new record
        const response = await api.post(this.baseUrl, record);
        return response.data;
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      
      // Mock successful save for development
      return {
        ...record,
        id: record.id || `att_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }

  // Delete attendance record
  async deleteAttendance(id: string): Promise<boolean> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting attendance:', error);
      return false;
    }
  }

  // Get student attendance statistics
  async getStudentAttendanceStats(studentId: string, startDate: string, endDate: string): Promise<AttendanceStats> {
    try {
      const response = await api.get(`${this.baseUrl}/stats/student/${studentId}?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student attendance stats:', error);
      
      // Return mock stats for development
      return this.getMockStudentStats();
    }
  }

  // Get class attendance statistics
  async getClassAttendanceStats(className: string, section: string, startDate: string, endDate: string): Promise<ClassAttendanceStats> {
    try {
      const response = await api.get(`${this.baseUrl}/stats/class/${className}/${section}?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching class attendance stats:', error);
      
      // Return mock stats for development
      return this.getMockClassStats(className, section);
    }
  }

  // Get students by class and section
  async getStudentsByClass(className: string, section: string): Promise<Student[]> {
    try {
      const response = await api.get(`/api/students?class=${className}&section=${section}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      
      // Return mock students for development
      return this.getMockStudents(className, section);
    }
  }

  // Bulk attendance operations
  async markAllPresent(date: string, className: string, section: string): Promise<AttendanceRecord> {
    try {
      const response = await api.post(`${this.baseUrl}/bulk/present`, {
        date,
        class: className,
        section
      });
      return response.data;
    } catch (error) {
      console.error('Error marking all present:', error);
      throw error;
    }
  }

  async markAllAbsent(date: string, className: string, section: string): Promise<AttendanceRecord> {
    try {
      const response = await api.post(`${this.baseUrl}/bulk/absent`, {
        date,
        class: className,
        section
      });
      return response.data;
    } catch (error) {
      console.error('Error marking all absent:', error);
      throw error;
    }
  }

  // Export attendance data
  async exportAttendanceData(filter: AttendanceReportFilter, format: 'csv' | 'excel' | 'pdf' = 'csv'): Promise<Blob> {
    try {
      const response = await api.post(`${this.baseUrl}/export`, {
        ...filter,
        format
      }, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting attendance data:', error);
      throw error;
    }
  }

  // Generate attendance reports
  async generateAttendanceReport(filter: AttendanceReportFilter): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/reports`, filter);
      return response.data;
    } catch (error) {
      console.error('Error generating attendance report:', error);
      throw error;
    }
  }

  // Mock data methods for development
  private getMockStudents(className: string, section: string): Student[] {
    const studentCount = Math.floor(Math.random() * 20) + 25; // 25-45 students
    const students: Student[] = [];
    
    for (let i = 1; i <= studentCount; i++) {
      students.push({
        id: `s${i}`,
        rollNo: `${className}${section}${i.toString().padStart(3, '0')}`,
        name: `Student ${i} - ${className}${section}`,
        class: className,
        section: section,
        status: '',
        remark: ''
      });
    }
    
    return students;
  }

  private getMockAttendanceRecords(filter: Partial<AttendanceReportFilter>): AttendanceRecord[] {
    const records: AttendanceRecord[] = [];
    const currentDate = new Date();
    
    // Generate 30 days of mock data
    for (let i = 0; i < 30; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      const classes = ['8', '9', '10', '11', '12'];
      const sections = ['A', 'B', 'C'];
      
      classes.forEach(cls => {
        sections.forEach(section => {
          const students = this.getMockStudents(cls, section);
          const totalStudents = students.length;
          const present = Math.floor(totalStudents * (0.85 + Math.random() * 0.1)); // 85-95% attendance
          const absent = Math.floor((totalStudents - present) * 0.7);
          const late = Math.floor((totalStudents - present - absent) * 0.6);
          const leave = totalStudents - present - absent - late;
          
          records.push({
            id: `att_${date.getTime()}_${cls}_${section}`,
            date: date.toISOString().split('T')[0],
            class: cls,
            section: section,
            totalStudents,
            present,
            absent,
            late,
            leave,
            students: students.map((student, index) => ({
              ...student,
              status: index < present ? 'present' 
                    : index < present + absent ? 'absent'
                    : index < present + absent + late ? 'late'
                    : 'leave'
            })),
            takenBy: 'teacher@school.edu',
            createdAt: date.toISOString(),
            updatedAt: date.toISOString()
          });
        });
      });
    }
    
    // Apply filters
    let filteredRecords = records;
    
    if (filter.startDate) {
      filteredRecords = filteredRecords.filter(record => record.date >= filter.startDate!);
    }
    
    if (filter.endDate) {
      filteredRecords = filteredRecords.filter(record => record.date <= filter.endDate!);
    }
    
    if (filter.class) {
      filteredRecords = filteredRecords.filter(record => record.class === filter.class);
    }
    
    if (filter.section) {
      filteredRecords = filteredRecords.filter(record => record.section === filter.section);
    }
    
    return filteredRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private getMockAttendanceByDate(date: string, className: string, section: string): AttendanceRecord | null {
    const records = this.getMockAttendanceRecords({ startDate: date, endDate: date, class: className, section });
    return records.length > 0 ? records[0] : null;
  }

  private getMockStudentStats(): AttendanceStats {
    const totalDays = 20;
    const presentDays = Math.floor(totalDays * (0.85 + Math.random() * 0.1));
    const absentDays = Math.floor((totalDays - presentDays) * 0.6);
    const lateDays = Math.floor((totalDays - presentDays - absentDays) * 0.5);
    const leaveDays = totalDays - presentDays - absentDays - lateDays;
    
    return {
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      leaveDays,
      attendancePercentage: Math.round((presentDays / totalDays) * 100)
    };
  }

  private getMockClassStats(className: string, section: string): ClassAttendanceStats {
    const totalStudents = Math.floor(Math.random() * 20) + 25;
    const averageAttendance = 85 + Math.random() * 10;
    const totalDays = 20;
    
    return {
      class: className,
      section,
      totalStudents,
      averageAttendance: Math.round(averageAttendance),
      totalDays,
      presentCount: Math.floor(totalStudents * totalDays * (averageAttendance / 100)),
      absentCount: Math.floor(totalStudents * totalDays * ((100 - averageAttendance) / 100) * 0.7),
      lateCount: Math.floor(totalStudents * totalDays * ((100 - averageAttendance) / 100) * 0.2),
      leaveCount: Math.floor(totalStudents * totalDays * ((100 - averageAttendance) / 100) * 0.1)
    };
  }
}

export const attendanceService = new AttendanceService();
export default attendanceService;
