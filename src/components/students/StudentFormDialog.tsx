
import React, { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Student } from '@/contexts/AppContext';

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (studentData: Omit<Student, 'id'>) => void;
  student?: Student;
  mode: 'add' | 'edit';
}

const StudentFormDialog = ({
  open,
  onOpenChange,
  onSave,
  student,
  mode,
}: StudentFormDialogProps) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (open && student) {
      setName(student.name);
      setUsername(student.username);
      setPassword('');
    } else if (open && !student) {
      setName('');
      setUsername('');
      setPassword('');
    }
  }, [open, student]);

  const handleSave = () => {
    if (!name || !username) {
      toast.error('Nama dan username harus diisi');
      return;
    }

    if (mode === 'add' && !password) {
      toast.error('Password harus diisi untuk siswa baru');
      return;
    }

    onSave({
      name,
      username,
      password,
      classIds: student?.classIds || [],
    });
    
    onOpenChange(false);
  };

  const title = mode === 'add' ? 'Tambah Siswa Baru' : 'Edit Data Siswa';
  const description = mode === 'add' 
    ? 'Isi formulir di bawah ini untuk menambahkan siswa baru.' 
    : 'Ubah data siswa yang dipilih.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              placeholder="Masukkan nama siswa"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">
              {mode === 'add' ? 'Password' : 'Password Baru (opsional)'}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={
                mode === 'add'
                  ? 'Masukkan password'
                  : 'Kosongkan jika tidak ingin mengubah password'
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSave}>{mode === 'add' ? 'Simpan' : 'Simpan Perubahan'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentFormDialog;
