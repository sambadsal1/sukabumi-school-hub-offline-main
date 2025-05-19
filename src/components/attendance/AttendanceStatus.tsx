
import React from 'react';
import { AttendanceStatus as StatusType } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';

interface AttendanceStatusProps {
  status: StatusType;
}

const AttendanceStatus: React.FC<AttendanceStatusProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'present':
        return { label: 'Hadir', variant: 'outline' as const, className: 'bg-green-50 text-green-700 border-green-200' };
      case 'absent':
        return { label: 'Tidak Hadir', variant: 'outline' as const, className: 'bg-red-50 text-red-700 border-red-200' };
      case 'sick':
        return { label: 'Sakit', variant: 'outline' as const, className: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
      case 'permission':
        return { label: 'Izin', variant: 'outline' as const, className: 'bg-blue-50 text-blue-700 border-blue-200' };
      default:
        return { label: 'Tidak Diketahui', variant: 'outline' as const, className: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  const { label, variant, className } = getStatusConfig();

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
};

export default AttendanceStatus;
