
import { useApp } from '@/contexts/AppContext';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Separator } from '@/components/ui/separator';
import StudentAttendanceView from '@/components/attendance/StudentAttendanceView';
import TeacherAttendanceView from '@/components/attendance/TeacherAttendanceView';

const Attendance = () => {
  const { currentUser } = useApp();

  // If no currentUser, return null - ProtectedRoute will handle redirection
  if (!currentUser) return null;

  return (
    <ProtectedRoute allowedRole={currentUser.role}>
      <AppLayout>
        {currentUser.role === 'student' ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Kehadiran</h2>
              <p className="text-muted-foreground">
                Lihat catatan kehadiran Anda.
              </p>
            </div>
            
            <Separator />
            
            <StudentAttendanceView studentId={currentUser.id} />
          </div>
        ) : (
          <TeacherAttendanceView />
        )}
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Attendance;
