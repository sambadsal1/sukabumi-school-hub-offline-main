import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

// Define types
export type Role = 'teacher' | 'student';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: Role;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  students: string[]; // array of student IDs
}

export interface Student {
  id: string;
  name: string;
  username: string;
  password: string;
  classIds: string[]; // array of class IDs
}

export interface Score {
  id: string;
  studentId: string;
  classId: string;
  subject: string;
  value: number;
  date: string;
}

export interface AnnouncementAttachment {
  type: 'image' | 'pdf' | 'youtube' | 'link';
  url: string;
  title?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  teacherId: string;
  classId: string | null; // null means for all classes
  attachments?: AnnouncementAttachment[];
}

// New attendance types
export type AttendanceStatus = 'present' | 'absent' | 'sick' | 'permission';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string; // ISO string format
  status: AttendanceStatus;
  note?: string;
}

interface AppContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  users: User[];
  classes: Class[];
  students: Student[];
  scores: Score[];
  announcements: Announcement[];
  attendance: AttendanceRecord[]; // New attendance records array
  addClass: (classData: Omit<Class, 'id'>) => void;
  updateClass: (id: string, classData: Partial<Omit<Class, 'id'>>) => void;
  removeClass: (id: string) => void;
  addStudent: (studentData: Omit<Student, 'id'>) => void;
  addMultipleStudents: (studentsData: Omit<Student, 'id'>[]) => void;
  updateStudent: (id: string, studentData: Partial<Omit<Student, 'id'>>) => void;
  removeStudent: (id: string) => void;
  addScore: (scoreData: Omit<Score, 'id'>) => void;
  addMultipleScores: (scoresData: Omit<Score, 'id'>[]) => void;
  updateScore: (id: string, scoreData: Partial<Omit<Score, 'id'>>) => void;
  removeScore: (id: string) => void;
  addAnnouncement: (announcementData: Omit<Announcement, 'id'>) => void;
  updateAnnouncement: (id: string, announcementData: Partial<Omit<Announcement, 'id'>>) => void;
  removeAnnouncement: (id: string) => void;
  // New attendance functions
  addAttendance: (attendanceData: Omit<AttendanceRecord, 'id'>) => void;
  addMultipleAttendances: (attendancesData: Omit<AttendanceRecord, 'id'>[]) => void;
  updateAttendance: (id: string, attendanceData: Partial<Omit<AttendanceRecord, 'id'>>) => void;
  removeAttendance: (id: string) => void;
  getAttendanceByDate: (date: string) => AttendanceRecord[];
  getAttendanceByClass: (classId: string) => AttendanceRecord[];
  getAttendanceByStudent: (studentId: string) => AttendanceRecord[];
  getAttendanceByClassAndMonth: (classId: string, year: number, month: number) => AttendanceRecord[];
  getStudentsByClass: (classId: string) => Student[];
  getClassesByStudent: (studentId: string) => Class[];
  getScoresByStudent: (studentId: string) => Score[];
  getScoresByClass: (classId: string) => Score[];
  getAnnouncementsByClass: (classId: string) => Announcement[];
}

// Initial data
const initialUsers: User[] = [
  {
    id: 'teacher-1',
    username: 'teacher',
    password: 'password',
    name: 'Teacher Admin',
    role: 'teacher'
  },
  {
    id: 'student-1',
    username: 'student',
    password: 'password',
    name: 'Student Demo',
    role: 'student'
  }
];

// Create context
const AppContext = createContext<AppContextType | null>(null);

// Generate unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('users');
      const storedClasses = localStorage.getItem('classes');
      const storedStudents = localStorage.getItem('students');
      const storedScores = localStorage.getItem('scores');
      const storedAnnouncements = localStorage.getItem('announcements');
      const storedAttendance = localStorage.getItem('attendance');
      const storedCurrentUser = localStorage.getItem('currentUser');

      setUsers(storedUsers ? JSON.parse(storedUsers) : initialUsers);
      setClasses(storedClasses ? JSON.parse(storedClasses) : []);
      setStudents(storedStudents ? JSON.parse(storedStudents) : []);
      setScores(storedScores ? JSON.parse(storedScores) : []);
      setAnnouncements(storedAnnouncements ? JSON.parse(storedAnnouncements) : []);
      setAttendance(storedAttendance ? JSON.parse(storedAttendance) : []);
      setCurrentUser(storedCurrentUser ? JSON.parse(storedCurrentUser) : null);
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // If there's an error, initialize with default data
      setUsers(initialUsers);
      setClasses([]);
      setStudents([]);
      setScores([]);
      setAnnouncements([]);
      setAttendance([]);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('classes', JSON.stringify(classes));
      localStorage.setItem('students', JSON.stringify(students));
      localStorage.setItem('scores', JSON.stringify(scores));
      localStorage.setItem('announcements', JSON.stringify(announcements));
      localStorage.setItem('attendance', JSON.stringify(attendance));
      localStorage.setItem('currentUser', currentUser ? JSON.stringify(currentUser) : '');
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
      toast.error('Gagal menyimpan data ke penyimpanan lokal');
    }
  }, [users, classes, students, scores, announcements, attendance, currentUser]);

  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      toast.success('Login berhasil');
      return true;
    }
    toast.error('Username atau password salah');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    toast.success('Logout berhasil');
  };

  // Class operations
  const addClass = (classData: Omit<Class, 'id'>) => {
    const newClass: Class = { ...classData, id: generateId() };
    setClasses([...classes, newClass]);
    toast.success('Kelas berhasil ditambahkan');
  };

  const updateClass = (id: string, classData: Partial<Omit<Class, 'id'>>) => {
    setClasses(classes.map(c => (c.id === id ? { ...c, ...classData } : c)));
    toast.success('Kelas berhasil diperbarui');
  };

  const removeClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
    // Also remove class references from students
    setStudents(
      students.map(s => ({
        ...s,
        classIds: s.classIds.filter(cId => cId !== id)
      }))
    );
    // Remove scores for this class
    setScores(scores.filter(s => s.classId !== id));
    // Remove announcements for this class
    setAnnouncements(announcements.filter(a => a.classId !== id));
    toast.success('Kelas berhasil dihapus');
  };

  // Student operations
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newId = generateId();
    const newStudent: Student = { ...studentData, id: newId };
    
    // Add student to the students array
    setStudents([...students, newStudent]);
    
    // Add student as a user for login
    const newUser: User = {
      id: newId,
      username: studentData.username,
      password: studentData.password,
      name: studentData.name,
      role: 'student'
    };
    setUsers([...users, newUser]);
    
    toast.success('Siswa berhasil ditambahkan');
  };

  const addMultipleStudents = (studentsData: Omit<Student, 'id'>[]) => {
    if (studentsData.length === 0) return;
    
    const newStudents: Student[] = [];
    const newUsers: User[] = [];
    
    // Generate IDs and create student and user objects for each student
    studentsData.forEach((studentData) => {
      const newId = generateId();
      
      // Create student object
      const newStudent: Student = { 
        ...studentData, 
        id: newId 
      };
      newStudents.push(newStudent);
      
      // Create user object for login
      const newUser: User = {
        id: newId,
        username: studentData.username,
        password: studentData.password,
        name: studentData.name,
        role: 'student'
      };
      newUsers.push(newUser);
    });
    
    // Update state with all new students and users in a single update
    setStudents(prevStudents => [...prevStudents, ...newStudents]);
    setUsers(prevUsers => [...prevUsers, ...newUsers]);
    
    toast.success(`${newStudents.length} siswa berhasil ditambahkan`);
  };

  const updateStudent = (id: string, studentData: Partial<Omit<Student, 'id'>>) => {
    setStudents(students.map(s => (s.id === id ? { ...s, ...studentData } : s)));
    
    // Update the user entry as well if name, username or password changed
    if (studentData.name || studentData.username || studentData.password) {
      setUsers(users.map(u => {
        if (u.id === id) {
          return {
            ...u,
            ...(studentData.name && { name: studentData.name }),
            ...(studentData.username && { username: studentData.username }),
            ...(studentData.password && { password: studentData.password })
          };
        }
        return u;
      }));
    }
    
    toast.success('Siswa berhasil diperbarui');
  };

  const removeStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    // Also remove student from classes
    setClasses(
      classes.map(c => ({
        ...c,
        students: c.students.filter(sId => sId !== id)
      }))
    );
    // Remove scores for this student
    setScores(scores.filter(s => s.studentId !== id));
    // Remove user entry
    setUsers(users.filter(u => u.id !== id));
    toast.success('Siswa berhasil dihapus');
  };

  // Score operations
  const addScore = (scoreData: Omit<Score, 'id'>) => {
    const newScore: Score = { ...scoreData, id: generateId() };
    setScores([...scores, newScore]);
    toast.success('Nilai berhasil ditambahkan');
  };

  const addMultipleScores = (scoresData: Omit<Score, 'id'>[]) => {
    if (scoresData.length === 0) return;
    
    const newScores: Score[] = [];
    
    // Generate IDs and create score objects for each score
    scoresData.forEach((scoreData) => {
      const newId = generateId();
      
      // Create score object
      const newScore: Score = { 
        ...scoreData, 
        id: newId 
      };
      newScores.push(newScore);
    });
    
    // Update state with all new scores in a single update
    setScores(prevScores => [...prevScores, ...newScores]);
    
    toast.success(`${newScores.length} nilai berhasil ditambahkan`);
  };

  const updateScore = (id: string, scoreData: Partial<Omit<Score, 'id'>>) => {
    setScores(scores.map(s => (s.id === id ? { ...s, ...scoreData } : s)));
    toast.success('Nilai berhasil diperbarui');
  };

  const removeScore = (id: string) => {
    setScores(scores.filter(s => s.id !== id));
    toast.success('Nilai berhasil dihapus');
  };

  // Announcement operations
  const addAnnouncement = (announcementData: Omit<Announcement, 'id'>) => {
    const newAnnouncement: Announcement = { 
      ...announcementData, 
      id: generateId(),
      date: announcementData.date || new Date().toISOString()
    };
    setAnnouncements([...announcements, newAnnouncement]);
    toast.success('Pengumuman berhasil ditambahkan');
  };

  const updateAnnouncement = (id: string, announcementData: Partial<Omit<Announcement, 'id'>>) => {
    setAnnouncements(announcements.map(a => (a.id === id ? { ...a, ...announcementData } : a)));
    toast.success('Pengumuman berhasil diperbarui');
  };

  const removeAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast.success('Pengumuman berhasil dihapus');
  };

  // New Attendance operations
  const addAttendance = (attendanceData: Omit<AttendanceRecord, 'id'>) => {
    const newAttendance: AttendanceRecord = { ...attendanceData, id: generateId() };
    setAttendance([...attendance, newAttendance]);
    toast.success('Kehadiran berhasil ditambahkan');
  };

  const addMultipleAttendances = (attendancesData: Omit<AttendanceRecord, 'id'>[]) => {
    if (attendancesData.length === 0) return;
    
    const newAttendances: AttendanceRecord[] = attendancesData.map(data => ({
      ...data,
      id: generateId()
    }));
    
    setAttendance(prev => [...prev, ...newAttendances]);
    toast.success(`${newAttendances.length} data kehadiran berhasil ditambahkan`);
  };

  const updateAttendance = (id: string, attendanceData: Partial<Omit<AttendanceRecord, 'id'>>) => {
    setAttendance(attendance.map(a => (a.id === id ? { ...a, ...attendanceData } : a)));
    toast.success('Kehadiran berhasil diperbarui');
  };

  const removeAttendance = (id: string) => {
    setAttendance(attendance.filter(a => a.id !== id));
    toast.success('Kehadiran berhasil dihapus');
  };

  // Attendance utility functions
  const getAttendanceByDate = (date: string): AttendanceRecord[] => {
    // Match by date part only (YYYY-MM-DD)
    const datePrefix = date.split('T')[0];
    return attendance.filter(a => a.date.startsWith(datePrefix));
  };

  const getAttendanceByClass = (classId: string): AttendanceRecord[] => {
    return attendance.filter(a => a.classId === classId);
  };

  const getAttendanceByStudent = (studentId: string): AttendanceRecord[] => {
    return attendance.filter(a => a.studentId === studentId);
  };

  const getAttendanceByClassAndMonth = (classId: string, year: number, month: number): AttendanceRecord[] => {
    // JavaScript months are 0-indexed, but we expect a 1-indexed month parameter
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    return attendance.filter(a => {
      const recordDate = a.date.split('T')[0];
      return a.classId === classId && recordDate >= startDate && recordDate <= endDate;
    });
  };

  // Utility functions
  const getStudentsByClass = (classId: string): Student[] => {
    const classItem = classes.find(c => c.id === classId);
    if (!classItem) return [];
    return students.filter(student => classItem.students.includes(student.id));
  };

  const getClassesByStudent = (studentId: string): Class[] => {
    const student = students.find(s => s.id === studentId);
    if (!student) return [];
    return classes.filter(c => student.classIds.includes(c.id));
  };

  const getScoresByStudent = (studentId: string): Score[] => {
    return scores.filter(s => s.studentId === studentId);
  };

  const getScoresByClass = (classId: string): Score[] => {
    return scores.filter(s => s.classId === classId);
  };

  const getAnnouncementsByClass = (classId: string): Announcement[] => {
    return announcements.filter(a => a.classId === classId || a.classId === null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        users,
        classes,
        students,
        scores,
        announcements,
        attendance,
        addClass,
        updateClass,
        removeClass,
        addStudent,
        addMultipleStudents,
        updateStudent,
        removeStudent,
        addScore,
        addMultipleScores,
        updateScore,
        removeScore,
        addAnnouncement,
        updateAnnouncement,
        removeAnnouncement,
        addAttendance,
        addMultipleAttendances,
        updateAttendance,
        removeAttendance,
        getAttendanceByDate,
        getAttendanceByClass,
        getAttendanceByStudent,
        getAttendanceByClassAndMonth,
        getStudentsByClass,
        getClassesByStudent,
        getScoresByStudent,
        getScoresByClass,
        getAnnouncementsByClass
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
