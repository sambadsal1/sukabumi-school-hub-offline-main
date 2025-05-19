import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import ImportDialog from '@/components/ImportDialog';
import { FileSpreadsheet } from 'lucide-react';
import { generateScoreTemplate, parseScoreExcel } from '@/utils/excelImport';

const Scores = () => {
  const { classes, students, scores, addScore, addMultipleScores, updateScore, removeScore } = useApp();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [selectedScoreId, setSelectedScoreId] = useState<string | null>(null);
  const [filterClassId, setFilterClassId] = useState<string>('all');
  const [filterStudentId, setFilterStudentId] = useState<string>('all');

  // Get filtered students based on selected class
  const classStudents = selectedClassId
    ? students.filter((s) => {
        const classObj = classes.find((c) => c.id === selectedClassId);
        return classObj?.students.includes(s.id);
      })
    : [];

  // Filter scores based on selected filters
  const filteredScores = scores.filter((score) => {
    if (filterClassId !== 'all' && score.classId !== filterClassId) return false;
    if (filterStudentId !== 'all' && score.studentId !== filterStudentId) return false;
    return true;
  });

  const openAddDialog = () => {
    setSelectedClassId('');
    setSelectedStudentId('');
    setSubject('');
    setValue('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (score: any) => {
    setSelectedScoreId(score.id);
    setSelectedClassId(score.classId);
    setSelectedStudentId(score.studentId);
    setSubject(score.subject);
    setValue(score.value.toString());
    setDate(score.date.split('T')[0]);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (scoreId: string) => {
    setSelectedScoreId(scoreId);
    setIsDeleteDialogOpen(true);
  };

  const handleAddScore = () => {
    if (!selectedClassId || !selectedStudentId || !subject || !value || !date) {
      toast.error('Semua field harus diisi');
      return;
    }

    const scoreValue = parseFloat(value);
    if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100) {
      toast.error('Nilai harus berupa angka antara 0 dan 100');
      return;
    }

    addScore({
      classId: selectedClassId,
      studentId: selectedStudentId,
      subject,
      value: scoreValue,
      date: new Date(date).toISOString(),
    });

    setIsAddDialogOpen(false);
  };

  const handleEditScore = () => {
    if (!selectedClassId || !selectedStudentId || !subject || !value || !date) {
      toast.error('Semua field harus diisi');
      return;
    }

    const scoreValue = parseFloat(value);
    if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100) {
      toast.error('Nilai harus berupa angka antara 0 dan 100');
      return;
    }

    if (selectedScoreId) {
      updateScore(selectedScoreId, {
        classId: selectedClassId,
        studentId: selectedStudentId,
        subject,
        value: scoreValue,
        date: new Date(date).toISOString(),
      });
    }

    setIsEditDialogOpen(false);
  };

  const handleDeleteScore = () => {
    if (selectedScoreId) {
      removeScore(selectedScoreId);
    }

    setIsDeleteDialogOpen(false);
  };

  const handleDownloadTemplate = () => {
    // Prepare data for template
    const classOptions = classes.map(c => ({ id: c.id, name: c.name }));
    const studentOptions = students.map(s => ({ id: s.id, name: s.name }));
    
    const blob = generateScoreTemplate(classOptions, studentOptions);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nilai_template.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportScores = async (file: File) => {
    try {
      const scoreData = await parseScoreExcel(file);
      
      if (scoreData.length === 0) {
        throw new Error('File tidak berisi data nilai');
      }
      
      // Validate all scores before importing
      for (const score of scoreData) {
        // Check if class exists
        const classExists = classes.some(c => c.id === score.classId);
        if (!classExists) {
          throw new Error(`Kelas dengan ID ${score.classId} tidak ditemukan`);
        }
        
        // Check if student exists
        const studentExists = students.some(s => s.id === score.studentId);
        if (!studentExists) {
          throw new Error(`Siswa dengan ID ${score.studentId} tidak ditemukan`);
        }
      }
      
      // Import all scores at once using the new function
      addMultipleScores(scoreData);
      
    } catch (error) {
      console.error('Import error:', error);
      toast.error(`Gagal mengimport data: ${error instanceof Error ? error.message : 'Terjadi kesalahan'}`);
      throw error;
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    return student ? student.name : '-';
  };

  const getClassName = (classId: string) => {
    const classItem = classes.find((c) => c.id === classId);
    return classItem ? classItem.name : '-';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <ProtectedRoute allowedRole="teacher">
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Manajemen Nilai</h1>
              <p className="text-muted-foreground">Kelola nilai siswa berdasarkan kelas dan mata pelajaran</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsImportDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Import Excel
              </Button>
              <Button onClick={openAddDialog}>Tambah Nilai</Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="filterClass">Filter Kelas</Label>
              <Select value={filterClassId} onValueChange={setFilterClassId}>
                <SelectTrigger id="filterClass">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filterStudent">Filter Siswa</Label>
              <Select value={filterStudentId} onValueChange={setFilterStudentId}>
                <SelectTrigger id="filterStudent">
                  <SelectValue placeholder="Pilih siswa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Siswa</SelectItem>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Siswa
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Kelas
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Mata Pelajaran
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Nilai
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Tanggal
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredScores.length > 0 ? (
                    filteredScores.map((score) => (
                      <tr
                        key={score.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">{getStudentName(score.studentId)}</td>
                        <td className="p-4 align-middle">{getClassName(score.classId)}</td>
                        <td className="p-4 align-middle">{score.subject}</td>
                        <td className="p-4 align-middle">{score.value}</td>
                        <td className="p-4 align-middle">{formatDate(score.date)}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(score)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openDeleteDialog(score.id)}
                            >
                              Hapus
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center">
                        {(filterClassId !== 'all' || filterStudentId !== 'all')
                          ? 'Tidak ada nilai yang sesuai dengan filter'
                          : 'Belum ada data nilai'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Score Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Nilai Baru</DialogTitle>
              <DialogDescription>
                Isi formulir di bawah ini untuk menambahkan nilai baru.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="class">Kelas</Label>
                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="student">Siswa</Label>
                <Select 
                  value={selectedStudentId} 
                  onValueChange={setSelectedStudentId}
                  disabled={!selectedClassId || classStudents.length === 0}
                >
                  <SelectTrigger id="student">
                    <SelectValue placeholder={
                      !selectedClassId 
                        ? "Pilih kelas terlebih dahulu" 
                        : classStudents.length === 0 
                          ? "Tidak ada siswa dalam kelas ini" 
                          : "Pilih siswa"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {classStudents.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Mata Pelajaran</Label>
                <Input
                  id="subject"
                  placeholder="Masukkan nama mata pelajaran"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">Nilai (0-100)</Label>
                <Input
                  id="value"
                  placeholder="Masukkan nilai"
                  type="number"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Tanggal</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddScore}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Score Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Nilai</DialogTitle>
              <DialogDescription>Ubah data nilai yang dipilih.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-class">Kelas</Label>
                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                  <SelectTrigger id="edit-class">
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-student">Siswa</Label>
                <Select 
                  value={selectedStudentId} 
                  onValueChange={setSelectedStudentId}
                  disabled={!selectedClassId || classStudents.length === 0}
                >
                  <SelectTrigger id="edit-student">
                    <SelectValue placeholder="Pilih siswa" />
                  </SelectTrigger>
                  <SelectContent>
                    {classStudents.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-subject">Mata Pelajaran</Label>
                <Input
                  id="edit-subject"
                  placeholder="Masukkan nama mata pelajaran"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-value">Nilai (0-100)</Label>
                <Input
                  id="edit-value"
                  placeholder="Masukkan nilai"
                  type="number"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-date">Tanggal</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleEditScore}>Simpan Perubahan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Nilai</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus nilai ini? Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDeleteScore}>
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import Dialog */}
        <ImportDialog
          open={isImportDialogOpen}
          onOpenChange={setIsImportDialogOpen}
          title="Import Data Nilai"
          description="Unduh template Excel, isi data nilai, kemudian upload untuk mengimport data."
          onImport={handleImportScores}
          onDownloadTemplate={handleDownloadTemplate}
        />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Scores;
