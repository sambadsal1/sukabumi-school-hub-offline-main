
import * as XLSX from 'xlsx';
import { AttendanceStatus, AttendanceRecord } from '@/contexts/AppContext';

// Generate Excel template for attendance import
export const generateAttendanceTemplate = (
  classOptions: { id: string; name: string }[],
  studentOptions: { id: string; name: string }[]
): Blob => {
  // Create data for dropdown options in template
  const classData = classOptions.map(c => `${c.name} (ID: ${c.id})`);
  const studentData = studentOptions.map(s => `${s.name} (ID: ${s.id})`);

  // Create a template worksheet with headers and example rows
  const ws = XLSX.utils.aoa_to_sheet([
    ['classId', 'studentId', 'date', 'status', 'note'], // Header row
    // Example rows
    [
      classData[0] || 'Class-ID-1', 
      studentData[0] || 'Student-ID-1', 
      new Date().toISOString().split('T')[0],
      'present', 
      'Hadir tepat waktu'
    ],
    [
      classData[0] || 'Class-ID-1', 
      studentData[1] || 'Student-ID-2', 
      new Date().toISOString().split('T')[0],
      'absent', 
      'Tanpa keterangan'
    ],
    [
      classData[0] || 'Class-ID-1', 
      studentData[2] || 'Student-ID-3', 
      new Date().toISOString().split('T')[0],
      'sick', 
      'Sakit flu'
    ],
    [
      classData[1] || 'Class-ID-2', 
      studentData[0] || 'Student-ID-1', 
      new Date().toISOString().split('T')[0],
      'permission', 
      'Izin acara keluarga'
    ],
  ]);

  // Create workbook and add worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Attendance');

  // Add instructions sheet
  const instructionsWs = XLSX.utils.aoa_to_sheet([
    ['Petunjuk Pengisian Template Kehadiran'],
    [''],
    ['1. Kolom classId: Gunakan ID kelas dari daftar berikut:'],
    ...classOptions.map(c => [`   - ${c.name}: ${c.id}`]),
    [''],
    ['2. Kolom studentId: Gunakan ID siswa dari daftar berikut:'],
    ...studentOptions.map(s => [`   - ${s.name}: ${s.id}`]),
    [''],
    ['3. Kolom date: Isi dengan tanggal dalam format YYYY-MM-DD'],
    ['4. Kolom status: Isi dengan salah satu status berikut:'],
    ['   - present (Hadir)'],
    ['   - absent (Tidak Hadir)'],
    ['   - sick (Sakit)'],
    ['   - permission (Izin)'],
    ['5. Kolom note: Isi dengan catatan kehadiran (opsional)'],
  ]);
  
  XLSX.utils.book_append_sheet(wb, instructionsWs, 'Petunjuk');

  // Generate binary data
  const wbBinary = XLSX.write(wb, {
    bookType: 'xlsx',
    type: 'binary',
  });

  // Convert binary string to blob
  const blob = new Blob(
    [
      new Uint8Array(
        [...wbBinary].map((char) => char.charCodeAt(0))
      )
    ],
    { type: 'application/octet-stream' }
  );

  return blob;
};

// Function to parse Excel files for attendance records
export const parseAttendanceExcel = (file: File): Promise<Omit<AttendanceRecord, 'id'>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          throw new Error('File Excel tidak berisi data');
        }
        
        // Validate and map the data
        const attendanceRecords = jsonData.map((row: any, index: number) => {
          const rowNum = index + 2; // +2 because Excel rows start at 1 and there's a header row
          
          // Check required fields
          if (!row.classId) {
            throw new Error(`Baris ke-${rowNum}: ID Kelas (classId) tidak boleh kosong`);
          }
          if (!row.studentId) {
            throw new Error(`Baris ke-${rowNum}: ID Siswa (studentId) tidak boleh kosong`);
          }
          if (!row.date) {
            throw new Error(`Baris ke-${rowNum}: Tanggal (date) tidak boleh kosong`);
          }
          if (!row.status) {
            throw new Error(`Baris ke-${rowNum}: Status kehadiran (status) tidak boleh kosong`);
          }
          
          // Extract IDs from the format "Name (ID: id)"
          let classId = row.classId;
          let studentId = row.studentId;
          
          if (typeof classId === 'string' && classId.includes('(ID:')) {
            classId = classId.split('(ID:')[1].trim().replace(')', '');
          }
          
          if (typeof studentId === 'string' && studentId.includes('(ID:')) {
            studentId = studentId.split('(ID:')[1].trim().replace(')', '');
          }
          
          // Validate status
          const status = row.status.toString().toLowerCase();
          const validStatuses = ['present', 'absent', 'sick', 'permission'];
          if (!validStatuses.includes(status)) {
            throw new Error(
              `Baris ke-${rowNum}: Status kehadiran tidak valid (${status}). Gunakan: present, absent, sick, atau permission`
            );
          }
          
          // Parse and validate date
          let dateStr: string;
          try {
            const date = new Date(row.date);
            if (isNaN(date.getTime())) {
              throw new Error();
            }
            dateStr = date.toISOString();
          } catch (e) {
            throw new Error(`Baris ke-${rowNum}: Format tanggal tidak valid (${row.date})`);
          }
          
          // Create the attendance record
          return {
            classId,
            studentId,
            date: dateStr,
            status: status as AttendanceStatus,
            note: row.note ? row.note.toString() : undefined,
          };
        });
        
        resolve(attendanceRecords);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Gagal membaca file Excel'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
