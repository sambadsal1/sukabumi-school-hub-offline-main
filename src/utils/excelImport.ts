
import * as XLSX from 'xlsx';
import { Student, Score } from '@/contexts/AppContext';

// Function to generate Excel templates
export const generateStudentTemplate = (): Blob => {
  // Create a template worksheet with headers and multiple example rows
  const ws = XLSX.utils.aoa_to_sheet([
    ['name', 'username', 'password'], // Header row
    ['John Doe', 'johndoe', 'password123'], // Example row 1
    ['Jane Doe', 'janedoe', 'password456'], // Example row 2
    ['Siti Aminah', 'siti', 'siti123'],     // Example row 3
    ['Budi Santoso', 'budi', 'budi456'],    // Example row 4
    ['Dewi Kartika', 'dewi', 'dewi789'],    // Example row 5
  ]);

  // Create workbook and add worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Students');

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

export const generateScoreTemplate = (
  classOptions: { id: string; name: string }[],
  studentOptions: { id: string; name: string }[]
): Blob => {
  // Create data for dropdown options in template
  const classData = classOptions.map(c => `${c.name} (ID: ${c.id})`);
  const studentData = studentOptions.map(s => `${s.name} (ID: ${s.id})`);

  // Create a template worksheet with headers and multiple example rows
  const ws = XLSX.utils.aoa_to_sheet([
    ['classId', 'studentId', 'subject', 'value', 'date'], // Header row
    // Example rows with different subjects and values
    [
      classData[0] || 'Class-ID-1', 
      studentData[0] || 'Student-ID-1', 
      'Matematika', 
      '85', 
      new Date().toISOString().split('T')[0]
    ],
    [
      classData[0] || 'Class-ID-1', 
      studentData[1] || 'Student-ID-2', 
      'Bahasa Indonesia', 
      '78', 
      new Date().toISOString().split('T')[0]
    ],
    [
      classData[0] || 'Class-ID-1', 
      studentData[2] || 'Student-ID-3', 
      'IPA', 
      '92', 
      new Date().toISOString().split('T')[0]
    ],
    [
      classData[1] || 'Class-ID-2', 
      studentData[0] || 'Student-ID-1', 
      'IPS', 
      '88', 
      new Date().toISOString().split('T')[0]
    ],
    [
      classData[1] || 'Class-ID-2', 
      studentData[1] || 'Student-ID-2', 
      'Pendidikan Agama', 
      '95', 
      new Date().toISOString().split('T')[0]
    ],
  ]);

  // Create workbook and add worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Scores');

  // Add instructions sheet
  const instructionsWs = XLSX.utils.aoa_to_sheet([
    ['Petunjuk Pengisian Template Nilai'],
    [''],
    ['1. Kolom classId: Gunakan ID kelas dari daftar berikut:'],
    ...classOptions.map(c => [`   - ${c.name}: ${c.id}`]),
    [''],
    ['2. Kolom studentId: Gunakan ID siswa dari daftar berikut:'],
    ...studentOptions.map(s => [`   - ${s.name}: ${s.id}`]),
    [''],
    ['3. Kolom subject: Isi dengan nama mata pelajaran'],
    ['4. Kolom value: Isi dengan nilai (0-100)'],
    ['5. Kolom date: Isi dengan tanggal dalam format YYYY-MM-DD'],
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

// Function to parse Excel files for students
export const parseStudentExcel = (file: File): Promise<Omit<Student, 'id' | 'classIds'>[]> => {
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
        const students = jsonData.map((row: any, index: number) => {
          // Check required fields
          if (!row.name || !row.username || !row.password) {
            throw new Error(`Baris ke-${index + 2}: Data siswa tidak lengkap (name, username, password)`);
          }
          
          return {
            name: row.name.toString(),
            username: row.username.toString(),
            password: row.password.toString(),
          };
        });
        
        resolve(students);
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

// Function to parse Excel files for scores
export const parseScoreExcel = (file: File): Promise<Omit<Score, 'id'>[]> => {
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
        const scores = jsonData.map((row: any, index: number) => {
          const rowNum = index + 2; // +2 because Excel rows start at 1 and there's a header row
          
          // Check required fields
          if (!row.classId) {
            throw new Error(`Baris ke-${rowNum}: ID Kelas (classId) tidak boleh kosong`);
          }
          if (!row.studentId) {
            throw new Error(`Baris ke-${rowNum}: ID Siswa (studentId) tidak boleh kosong`);
          }
          if (!row.subject) {
            throw new Error(`Baris ke-${rowNum}: Mata Pelajaran (subject) tidak boleh kosong`);
          }
          if (row.value === undefined || row.value === null) {
            throw new Error(`Baris ke-${rowNum}: Nilai (value) tidak boleh kosong`);
          }
          if (!row.date) {
            throw new Error(`Baris ke-${rowNum}: Tanggal (date) tidak boleh kosong`);
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
          
          // Parse value as number
          const value = typeof row.value === 'number' ? row.value : parseFloat(row.value);
          
          // Validate value
          if (isNaN(value)) {
            throw new Error(`Baris ke-${rowNum}: Nilai harus berupa angka (${row.value})`);
          }
          
          if (value < 0 || value > 100) {
            throw new Error(`Baris ke-${rowNum}: Nilai harus antara 0 dan 100 (${value})`);
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
          
          return {
            classId,
            studentId,
            subject: row.subject.toString(),
            value,
            date: dateStr,
          };
        });
        
        resolve(scores);
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
