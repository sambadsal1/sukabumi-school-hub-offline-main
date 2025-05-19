
import React from 'react';
import { AttendanceRecord } from '@/contexts/AppContext';

interface AttendanceStatsProps {
  attendanceRecords: AttendanceRecord[];
  className?: string;
}

const AttendanceStats: React.FC<AttendanceStatsProps> = ({ attendanceRecords, className = "" }) => {
  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
  const sickCount = attendanceRecords.filter(r => r.status === 'sick').length;
  const permissionCount = attendanceRecords.filter(r => r.status === 'permission').length;

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <div className="bg-green-50 p-4 rounded-md border border-green-100">
        <div className="text-2xl font-bold text-green-700">{presentCount}</div>
        <div className="text-sm text-green-600">Hadir</div>
      </div>
      <div className="bg-red-50 p-4 rounded-md border border-red-100">
        <div className="text-2xl font-bold text-red-700">{absentCount}</div>
        <div className="text-sm text-red-600">Tidak Hadir</div>
      </div>
      <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
        <div className="text-2xl font-bold text-yellow-700">{sickCount}</div>
        <div className="text-sm text-yellow-600">Sakit</div>
      </div>
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
        <div className="text-2xl font-bold text-blue-700">{permissionCount}</div>
        <div className="text-sm text-blue-600">Izin</div>
      </div>
    </div>
  );
};

export default AttendanceStats;
