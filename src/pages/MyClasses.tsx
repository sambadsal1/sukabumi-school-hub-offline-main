
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProtectedRoute from '@/components/ProtectedRoute';

const MyClasses = () => {
  const { currentUser, getClassesByStudent } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Get student's classes
  const myClasses = currentUser ? getClassesByStudent(currentUser.id) : [];

  // Filter classes based on search term
  const filteredClasses = myClasses.filter((classItem) =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRole="student">
      <AppLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kelas Saya</h1>
            <p className="text-muted-foreground">
              Daftar kelas yang Anda ikuti
            </p>
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
              filteredClasses.map((classItem) => (
                <Card key={classItem.id}>
                  <CardHeader>
                    <CardTitle>{classItem.name}</CardTitle>
                    <CardDescription>{classItem.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Anda terdaftar dalam kelas ini
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center my-8">
                <p className="text-lg text-muted-foreground">
                  {searchTerm
                    ? 'Tidak ada kelas yang sesuai dengan pencarian'
                    : 'Anda belum terdaftar dalam kelas manapun'}
                </p>
              </div>
            )}
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default MyClasses;
