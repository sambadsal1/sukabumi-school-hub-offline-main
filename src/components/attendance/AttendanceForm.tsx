
import React, { useState } from 'react';
import { useApp, AttendanceStatus, Student, AttendanceRecord } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CalendarCheck, User } from 'lucide-react';
import AttendanceStatusBadge from './AttendanceStatus';

interface AttendanceFormProps {
  student: Student;
  classId: string;
  date: string;
  existingRecord?: AttendanceRecord;
  onSave: () => void;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({
  student,
  classId,
  date,
  existingRecord,
  onSave,
}) => {
  const { addAttendance, updateAttendance } = useApp();
  const [status, setStatus] = useState<AttendanceStatus>(existingRecord?.status || 'present');
  const [note, setNote] = useState<string>(existingRecord?.note || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const attendanceData = {
      studentId: student.id,
      classId,
      date,
      status,
      note: note.trim() === '' ? undefined : note,
    };

    if (existingRecord) {
      updateAttendance(existingRecord.id, attendanceData);
    } else {
      addAttendance(attendanceData);
    }

    toast.success(`Kehadiran ${student.name} berhasil disimpan`);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <User className="mr-2 h-4 w-4" />
            {student.name}
          </CardTitle>
          <CardDescription className="flex items-center">
            <CalendarCheck className="mr-2 h-4 w-4" />
            {new Date(date).toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status Kehadiran</Label>
              <RadioGroup 
                value={status} 
                onValueChange={(value) => setStatus(value as AttendanceStatus)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="present" id={`present-${student.id}`} />
                  <Label htmlFor={`present-${student.id}`} className="flex items-center">
                    <AttendanceStatusBadge status="present" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="absent" id={`absent-${student.id}`} />
                  <Label htmlFor={`absent-${student.id}`} className="flex items-center">
                    <AttendanceStatusBadge status="absent" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sick" id={`sick-${student.id}`} />
                  <Label htmlFor={`sick-${student.id}`} className="flex items-center">
                    <AttendanceStatusBadge status="sick" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="permission" id={`permission-${student.id}`} />
                  <Label htmlFor={`permission-${student.id}`} className="flex items-center">
                    <AttendanceStatusBadge status="permission" />
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`note-${student.id}`}>Catatan (opsional)</Label>
              <Textarea 
                id={`note-${student.id}`}
                placeholder="Tambahkan catatan jika diperlukan"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Simpan
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default AttendanceForm;
