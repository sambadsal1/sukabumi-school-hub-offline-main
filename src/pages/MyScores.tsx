
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import ProtectedRoute from '@/components/ProtectedRoute';

const MyScores = () => {
  const { currentUser, classes, scores, getClassesByStudent } = useApp();
  const [filterClassId, setFilterClassId] = useState<string>('all');
  const [searchSubject, setSearchSubject] = useState('');

  // Get student's classes and scores
  const myClasses = currentUser ? getClassesByStudent(currentUser.id) : [];
  const myScores = currentUser
    ? scores.filter((score) => score.studentId === currentUser.id)
    : [];

  // Filter scores based on selected class and subject search
  const filteredScores = myScores.filter((score) => {
    if (filterClassId !== 'all' && score.classId !== filterClassId) return false;
    if (
      searchSubject &&
      !score.subject.toLowerCase().includes(searchSubject.toLowerCase())
    )
      return false;
    return true;
  });

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
    <ProtectedRoute allowedRole="student">
      <AppLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nilai Saya</h1>
            <p className="text-muted-foreground">Lihat nilai untuk setiap mata pelajaran</p>
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
                  {myClasses.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="searchSubject">Cari Mata Pelajaran</Label>
              <Input
                id="searchSubject"
                placeholder="Cari berdasarkan mata pelajaran..."
                value={searchSubject}
                onChange={(e) => setSearchSubject(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
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
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredScores.length > 0 ? (
                    filteredScores.map((score) => (
                      <tr
                        key={score.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">{getClassName(score.classId)}</td>
                        <td className="p-4 align-middle">{score.subject}</td>
                        <td className="p-4 align-middle">{score.value}</td>
                        <td className="p-4 align-middle">{formatDate(score.date)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center">
                        {filterClassId !== 'all' || searchSubject
                          ? 'Tidak ada nilai yang sesuai dengan filter'
                          : 'Belum ada nilai yang tersedia'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default MyScores;
