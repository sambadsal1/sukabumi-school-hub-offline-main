
import React from 'react';
import { useApp, AttendanceRecord } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AttendanceStatus from '@/components/attendance/AttendanceStatus';
import { CalendarIcon, CalendarCheck } from 'lucide-react';
import AttendanceStats from './AttendanceStats';

interface StudentAttendanceViewProps {
  studentId: string;
}

const StudentAttendanceView: React.FC<StudentAttendanceViewProps> = ({ studentId }) => {
  const { attendance, getClassesByStudent, classes } = useApp();
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  
  // Get current month and year
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  
  // Filter attendance records for the current student
  const studentAttendance = attendance.filter(record => record.studentId === studentId);
  
  // Get today's attendance records
  const todayAttendance = studentAttendance.filter(record => 
    record.date.startsWith(todayFormatted)
  );
  
  // Get this month's attendance records
  const startDate = new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];
  
  const monthAttendance = studentAttendance.filter(record => {
    const recordDate = record.date.split('T')[0];
    return recordDate >= startDate && recordDate <= endDate;
  });
  
  // Get student classes
  const studentClasses = getClassesByStudent(studentId);

  const getClassNameById = (classId: string): string => {
    const classObj = classes.find(c => c.id === classId);
    return classObj ? classObj.name : 'Kelas tidak ditemukan';
  };

  const formattedDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get month name
  const monthName = today.toLocaleDateString('id-ID', { month: 'long' });
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's attendance card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Kehadiran Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayAttendance.length > 0 ? (
              <div className="space-y-4">
                {todayAttendance.map((record, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="font-medium">{getClassNameById(record.classId)}</div>
                    <div className="text-sm text-gray-500 mb-2">{formattedDate(record.date)}</div>
                    <div className="flex items-center justify-between">
                      <AttendanceStatus status={record.status} />
                      {record.note && (
                        <div className="text-sm text-gray-500">
                          Catatan: {record.note}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                Tidak ada data kehadiran untuk hari ini
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Monthly summary card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CalendarCheck className="h-5 w-5 mr-2" />
              Ringkasan Bulan {monthName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceStats attendanceRecords={monthAttendance} />
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Kelas saya:</h3>
              <ul className="list-disc pl-5">
                {studentClasses.map(classItem => (
                  <li key={classItem.id}>{classItem.name}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentAttendanceView;
