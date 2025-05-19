
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileSpreadsheet } from 'lucide-react';

interface StudentPageHeaderProps {
  onAddStudent: () => void;
  onImport: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const StudentPageHeader = ({
  onAddStudent,
  onImport,
  searchTerm,
  onSearchChange,
}: StudentPageHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Siswa</h1>
          <p className="text-muted-foreground">Kelola data siswa pada sistem informasi kelas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onImport}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Import Excel
          </Button>
          <Button onClick={onAddStudent}>Tambah Siswa</Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Cari siswa..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
    </>
  );
};

export default StudentPageHeader;
