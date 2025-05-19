
import React from 'react';
import { Student, AttendanceRecord, AttendanceStatus } from '@/contexts/AppContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AttendanceStatusBadge from './AttendanceStatus';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ClassAttendanceGridProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  year: number;
  month: number;
  onEditAttendance: (student: Student, date: string, existingRecord?: AttendanceRecord) => void;
}

const ClassAttendanceGrid: React.FC<ClassAttendanceGridProps> = ({
  students,
  attendanceRecords,
  year,
  month,
  onEditAttendance,
}) => {
  // Get days in month
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // Create an array of dates for the month
  const dates = Array.from({ length: daysInMonth }, (_, i) => 
    new Date(year, month - 1, i + 1)
  );

  // Group attendance records by student ID and date
  const attendanceMap = new Map<string, Map<string, AttendanceRecord>>();
  
  // Initialize attendance map
  students.forEach(student => {
    const studentAttendanceMap = new Map<string, AttendanceRecord>();
    attendanceMap.set(student.id, studentAttendanceMap);
  });

  // Populate attendance map
  attendanceRecords.forEach(record => {
    const date = new Date(record.date);
    const dayFormatted = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    
    const studentMap = attendanceMap.get(record.studentId);
    if (studentMap) {
      studentMap.set(dayFormatted, record);
    }
  });

  // Function to get attendance status for a student on a given date
  const getAttendanceStatus = (studentId: string, date: Date): AttendanceRecord | undefined => {
    const studentMap = attendanceMap.get(studentId);
    if (!studentMap) return undefined;

    const dayFormatted = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return studentMap.get(dayFormatted);
  };

  // Function to get color for attendance status
  const getAttendanceStatusClass = (status?: AttendanceStatus): string => {
    switch (status) {
      case 'present':
        return 'bg-green-100 hover:bg-green-200';
      case 'absent':
        return 'bg-red-100 hover:bg-red-200';
      case 'sick':
        return 'bg-yellow-100 hover:bg-yellow-200';
      case 'permission':
        return 'bg-blue-100 hover:bg-blue-200';
      default:
        return 'bg-gray-50 hover:bg-gray-100';
    }
  };

  // Check if a date is a weekend
  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  return (
    <div className="border rounded-md overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 bg-white z-10">Siswa</TableHead>
            {dates.map((date, index) => (
              <TableHead 
                key={index}
                className={isWeekend(date) ? 'bg-gray-50' : ''}
              >
                <div className="text-center font-medium">
                  {date.getDate()}
                </div>
                <div className="text-xs text-gray-500">
                  {date.toLocaleDateString('id-ID', { weekday: 'short' })}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="sticky left-0 bg-white font-medium z-10">
                {student.name}
              </TableCell>
              {dates.map((date, dateIndex) => {
                const record = getAttendanceStatus(student.id, date);
                const dateString = date.toISOString();
                const statusClass = getAttendanceStatusClass(record?.status);
                const isWeekendCell = isWeekend(date);
                
                return (
                  <TableCell 
                    key={dateIndex} 
                    className={`${statusClass} p-0 text-center cursor-pointer ${isWeekendCell ? 'bg-opacity-50' : ''}`}
                    onClick={() => onEditAttendance(student, dateString, record)}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="w-full h-full p-2">
                          {record && <AttendanceStatusBadge status={record.status} />}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Klik untuk {record ? 'ubah' : 'tambah'} kehadiran</p>
                          {record?.note && (
                            <p className="text-xs text-gray-500 mt-1">Catatan: {record.note}</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClassAttendanceGrid;
