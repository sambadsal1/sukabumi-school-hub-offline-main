
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
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'sonner';

const Classes = () => {
  const { currentUser, classes, students, addClass, updateClass, removeClass, getStudentsByClass } = useApp();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openStudentPopover, setOpenStudentPopover] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Filter classes based on search term
  const filteredClasses = classes.filter((classItem) =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddDialog = () => {
    setName('');
    setDescription('');
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (classItem: any) => {
    setSelectedClassId(classItem.id);
    setName(classItem.name);
    setDescription(classItem.description);
    setIsEditDialogOpen(true);
  };

  const openStudentDialog = (classItem: any) => {
    setSelectedClassId(classItem.id);
    setSelectedStudents([...classItem.students]);
    setIsStudentDialogOpen(true);
  };

  const openDeleteDialog = (classId: string) => {
    setSelectedClassId(classId);
    setIsDeleteDialogOpen(true);
  };

  const handleAddClass = () => {
    if (!name || !description) {
      toast.error('Nama dan deskripsi kelas harus diisi');
      return;
    }

    addClass({
      name,
      description,
      teacherId: currentUser?.id || '',
      students: [],
    });

    setIsAddDialogOpen(false);
  };

  const handleEditClass = () => {
    if (!name || !description) {
      toast.error('Nama dan deskripsi kelas harus diisi');
      return;
    }

    if (selectedClassId) {
      updateClass(selectedClassId, {
        name,
        description,
      });
    }

    setIsEditDialogOpen(false);
  };

  const handleUpdateStudents = () => {
    if (selectedClassId) {
      // Update class with new student list
      updateClass(selectedClassId, {
        students: selectedStudents,
      });
      
      // Update students' classIds
      students.forEach(student => {
        const isSelected = selectedStudents.includes(student.id);
        const alreadyInClass = student.classIds.includes(selectedClassId);
        
        if (isSelected && !alreadyInClass) {
          // Add class to student
          const updatedClassIds = [...student.classIds, selectedClassId];
          updateStudent(student.id, { classIds: updatedClassIds });
        } else if (!isSelected && alreadyInClass) {
          // Remove class from student
          const updatedClassIds = student.classIds.filter(id => id !== selectedClassId);
          updateStudent(student.id, { classIds: updatedClassIds });
        }
      });
    }

    setIsStudentDialogOpen(false);
  };

  const updateStudent = (id: string, data: { classIds: string[] }) => {
    // This is just for updating students' classIds
    const student = students.find(s => s.id === id);
    if (student) {
      student.classIds = data.classIds;
    }
  };

  const handleDeleteClass = () => {
    if (selectedClassId) {
      removeClass(selectedClassId);
    }

    setIsDeleteDialogOpen(false);
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  return (
    <ProtectedRoute allowedRole="teacher">
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Manajemen Kelas</h1>
              <p className="text-muted-foreground">Kelola kelas dan daftarkan siswa ke kelas</p>
            </div>
            <Button onClick={openAddDialog}>Tambah Kelas</Button>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Cari kelas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.length > 0 ? (
              filteredClasses.map((classItem) => {
                const classStudents = getStudentsByClass(classItem.id);
                return (
                  <div
                    key={classItem.id}
                    className="rounded-lg border bg-card text-card-foreground shadow-sm"
                  >
                    <div className="p-6 space-y-2">
                      <h3 className="text-lg font-semibold">{classItem.name}</h3>
                      <p className="text-sm text-muted-foreground">{classItem.description}</p>
                      <p className="text-sm">
                        <span className="font-medium">Jumlah Siswa:</span> {classStudents.length}
                      </p>
                    </div>
                    <div className="bg-muted/50 p-4 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openStudentDialog(classItem)}
                      >
                        Kelola Siswa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(classItem)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(classItem.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center my-8">
                <p className="text-lg text-muted-foreground">
                  {searchTerm ? 'Tidak ada kelas yang sesuai dengan pencarian' : 'Belum ada kelas yang dibuat'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add Class Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Kelas Baru</DialogTitle>
              <DialogDescription>
                Isi formulir di bawah ini untuk menambahkan kelas baru.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Kelas</Label>
                <Input
                  id="name"
                  placeholder="Masukkan nama kelas"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  placeholder="Masukkan deskripsi kelas"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddClass}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Class Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Kelas</DialogTitle>
              <DialogDescription>Ubah data kelas yang dipilih.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nama Kelas</Label>
                <Input
                  id="edit-name"
                  placeholder="Masukkan nama kelas"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Deskripsi</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Masukkan deskripsi kelas"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleEditClass}>Simpan Perubahan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Manage Students Dialog */}
        <Dialog open={isStudentDialogOpen} onOpenChange={setIsStudentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Kelola Siswa Kelas</DialogTitle>
              <DialogDescription>
                Pilih siswa yang akan dimasukkan ke dalam kelas ini.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label className="mb-2 block">Daftar Siswa</Label>
              {students.length > 0 ? (
                <div className="max-h-[300px] overflow-auto border rounded-md">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center space-x-2 p-2 hover:bg-secondary/20"
                    >
                      <input
                        type="checkbox"
                        id={`student-${student.id}`}
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudentSelection(student.id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor={`student-${student.id}`}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        {student.name}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Belum ada siswa yang terdaftar dalam sistem.
                </p>
              )}
            </div>
            <DialogFooter className="sm:justify-end">
              <Button variant="outline" onClick={() => setIsStudentDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleUpdateStudents}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Kelas</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus kelas ini? Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDeleteClass}>
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Classes;
