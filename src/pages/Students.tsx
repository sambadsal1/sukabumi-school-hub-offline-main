
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'sonner';
import ImportDialog from '@/components/ImportDialog';
import { generateStudentTemplate, parseStudentExcel } from '@/utils/excelImport';

// Import the new components
import StudentTable from '@/components/students/StudentTable';
import StudentFormDialog from '@/components/students/StudentFormDialog';
import DeleteStudentDialog from '@/components/students/DeleteStudentDialog';
import StudentPageHeader from '@/components/students/StudentPageHeader';

const Students = () => {
  const { students, addStudent, addMultipleStudents, updateStudent, removeStudent } = useApp();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (student: any) => {
    setSelectedStudentId(student.id);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsDeleteDialogOpen(true);
  };

  const handleAddStudent = (studentData: any) => {
    addStudent(studentData);
    toast.success('Siswa berhasil ditambahkan');
  };

  const handleEditStudent = (studentData: any) => {
    if (selectedStudentId) {
      updateStudent(selectedStudentId, studentData);
      toast.success('Data siswa berhasil diperbarui');
    }
  };

  const handleDeleteStudent = () => {
    if (selectedStudentId) {
      removeStudent(selectedStudentId);
      toast.success('Siswa berhasil dihapus');
    }
    setIsDeleteDialogOpen(false);
  };

  const handleDownloadTemplate = () => {
    const blob = generateStudentTemplate();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'siswa_template.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportStudents = async (file: File) => {
    try {
      const parsedStudents = await parseStudentExcel(file);
      
      if (parsedStudents.length === 0) {
        throw new Error('File tidak berisi data siswa');
      }
      
      // Prepare students for import with classIds
      const studentsToImport = parsedStudents.map(student => ({
        ...student,
        classIds: []
      }));
      
      // Import all students at once using the new function
      addMultipleStudents(studentsToImport);
      
    } catch (error) {
      console.error('Import error:', error);
      toast.error(`Gagal mengimport data: ${error instanceof Error ? error.message : 'Terjadi kesalahan'}`);
      throw error;
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the selected student for editing
  const selectedStudent = selectedStudentId
    ? students.find((s) => s.id === selectedStudentId)
    : undefined;

  return (
    <ProtectedRoute allowedRole="teacher">
      <AppLayout>
        <div className="space-y-6">
          {/* Header Section */}
          <StudentPageHeader
            onAddStudent={openAddDialog}
            onImport={() => setIsImportDialogOpen(true)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Table Section */}
          <StudentTable
            students={filteredStudents}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        </div>

        {/* Add Student Dialog */}
        <StudentFormDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSave={handleAddStudent}
          mode="add"
        />

        {/* Edit Student Dialog */}
        <StudentFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleEditStudent}
          student={selectedStudent}
          mode="edit"
        />

        {/* Delete Confirmation Dialog */}
        <DeleteStudentDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteStudent}
        />

        {/* Import Dialog */}
        <ImportDialog
          open={isImportDialogOpen}
          onOpenChange={setIsImportDialogOpen}
          title="Import Data Siswa"
          description="Unduh template Excel, isi data siswa, kemudian upload untuk mengimport data."
          onImport={handleImportStudents}
          onDownloadTemplate={handleDownloadTemplate}
        />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Students;
