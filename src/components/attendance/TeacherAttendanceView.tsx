import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, Student, AttendanceRecord, Class } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarCheck, FileText } from 'lucide-react';
import AttendanceCalendar from './AttendanceCalendar';
import ClassAttendanceGrid from './ClassAttendanceGrid';
import AttendanceForm from './AttendanceForm';
import ImportDialog from '@/components/ImportDialog';
import { generateAttendanceTemplate, parseAttendanceExcel } from '@/utils/attendanceExcelImport';
import AttendanceStats from './AttendanceStats';

const TeacherAttendanceView = () => {
  const { currentUser, classes, getStudentsByClass, getAttendanceByClassAndMonth, addMultipleAttendances } = useApp();
  const navigate = useNavigate();
  
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState<string>('');
  const [selectedAttendanceRecord, setSelectedAttendanceRecord] = useState<AttendanceRecord | undefined>(undefined);
  
  // Import dialog state
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Filter classes that belong to the current teacher
  const teacherClasses = currentUser?.role === 'teacher' 
    ? classes.filter(c => c.teacherId === currentUser.id)
    : [];

  useEffect(() => {
    // If teacher has classes, select the first one by default
    if (teacherClasses.length > 0 && !selectedClass) {
      setSelectedClass(teacherClasses[0]);
    }
  }, [teacherClasses, selectedClass]);

  useEffect(() => {
    if (selectedClass) {
      const classStudents = getStudentsByClass(selectedClass.id);
      setStudents(classStudents);
      
      const records = getAttendanceByClassAndMonth(selectedClass.id, currentYear, currentMonth);
      setAttendanceRecords(records);
    } else {
      setStudents([]);
      setAttendanceRecords([]);
    }
  }, [selectedClass, currentYear, currentMonth, getStudentsByClass, getAttendanceByClassAndMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleClassChange = (classId: string) => {
    const classObj = classes.find(c => c.id === classId);
    setSelectedClass(classObj || null);
  };

  const handleEditAttendance = (student: Student, date: string, existingRecord?: AttendanceRecord) => {
    setSelectedStudent(student);
    setSelectedAttendanceDate(date);
    setSelectedAttendanceRecord(existingRecord);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedStudent(null);
    setSelectedAttendanceDate('');
    setSelectedAttendanceRecord(undefined);
    
    // Refresh attendance records
    if (selectedClass) {
      const records = getAttendanceByClassAndMonth(selectedClass.id, currentYear, currentMonth);
      setAttendanceRecords(records);
    }
  };

  // Handle template download
  const handleDownloadTemplate = () => {
    if (!selectedClass) return;
    
    const classStudents = getStudentsByClass(selectedClass.id);
    const blob = generateAttendanceTemplate(
      [{ id: selectedClass.id, name: selectedClass.name }],
      classStudents
    );
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_kehadiran_${selectedClass.name.replace(/\s+/g, '_')}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle import function
  const handleImport = async (file: File): Promise<void> => {
    try {
      if (!selectedClass) {
        throw new Error('Silakan pilih kelas terlebih dahulu');
      }

      const attendanceData = await parseAttendanceExcel(file);
      
      // Filter only records for the selected class
      const filteredData = attendanceData.filter(record => record.classId === selectedClass.id);
      
      if (filteredData.length === 0) {
        throw new Error('Tidak ada data kehadiran yang valid untuk kelas ini');
      }
      
      // Add all attendance records
      addMultipleAttendances(filteredData);
      
      // Refresh the attendance records
      const updatedRecords = getAttendanceByClassAndMonth(selectedClass.id, currentYear, currentMonth);
      setAttendanceRecords(updatedRecords);
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kehadiran</h2>
          <p className="text-muted-foreground">
            Kelola kehadiran siswa di kelas Anda.
          </p>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor="class-select">Pilih Kelas</Label>
          <Select
            value={selectedClass?.id || ''}
            onValueChange={handleClassChange}
          >
            <SelectTrigger id="class-select" className="w-[250px]">
              <SelectValue placeholder="Pilih kelas" />
            </SelectTrigger>
            <SelectContent>
              {teacherClasses.map((classItem) => (
                <SelectItem key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setImportDialogOpen(true)}
          disabled={!selectedClass}
        >
          <FileText className="h-4 w-4" />
          <span>Import Kehadiran</span>
        </Button>
      </div>
      
      <Separator />
      
      {selectedClass ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1">
            <AttendanceCalendar 
              currentYear={currentYear}
              currentMonth={currentMonth}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onSelectDate={handleSelectDate}
              selectedDate={selectedDate}
            />
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CalendarCheck className="h-5 w-5 mr-2" />
                Statistik Kehadiran
              </h3>
              
              <AttendanceStats attendanceRecords={attendanceRecords} />
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-3">
            {students.length > 0 ? (
              <ClassAttendanceGrid
                students={students}
                attendanceRecords={attendanceRecords}
                year={currentYear}
                month={currentMonth}
                onEditAttendance={handleEditAttendance}
              />
            ) : (
              <div className="bg-gray-50 border rounded-md p-8 text-center">
                <h3 className="text-lg font-semibold">Tidak ada siswa</h3>
                <p className="text-gray-500 mt-2">Kelas ini belum memiliki siswa.</p>
                <Button
                  className="mt-4"
                  onClick={() => navigate('/students')}
                >
                  Tambah Siswa
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border rounded-md p-8 text-center">
          <h3 className="text-lg font-semibold">Pilih kelas terlebih dahulu</h3>
          <p className="text-gray-500 mt-2">
            Silakan pilih kelas untuk melihat dan mengelola kehadiran siswa.
          </p>
          {teacherClasses.length === 0 && (
            <Button
              className="mt-4"
              onClick={() => navigate('/classes')}
            >
              Tambah Kelas
            </Button>
          )}
        </div>
      )}

      {/* Attendance Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAttendanceRecord ? 'Edit Kehadiran' : 'Tambah Kehadiran'}
            </DialogTitle>
          </DialogHeader>
          {selectedStudent && selectedClass && (
            <AttendanceForm
              student={selectedStudent}
              classId={selectedClass.id}
              date={selectedAttendanceDate}
              existingRecord={selectedAttendanceRecord}
              onSave={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        title="Import Data Kehadiran"
        description="Upload file Excel yang berisi data kehadiran siswa. Pastikan file mengikuti format template."
        onImport={handleImport}
        onDownloadTemplate={handleDownloadTemplate}
      />
    </div>
  );
};

export default TeacherAttendanceView;
