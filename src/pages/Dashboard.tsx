
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { Book, Calendar, Info, User, Users, CalendarCheck } from 'lucide-react';

const Dashboard = () => {
  const { 
    currentUser, 
    classes, 
    students, 
    scores, 
    announcements,
    getClassesByStudent,
    attendance
  } = useApp();
  
  const isTeacher = currentUser?.role === 'teacher';
  const studentClasses = !isTeacher && currentUser ? getClassesByStudent(currentUser.id) : [];
  const studentAttendance = currentUser && !isTeacher ? attendance.filter(a => a.studentId === currentUser.id) : [];

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Selamat Datang, {currentUser?.name}!</h1>
          <p className="text-muted-foreground">
            {isTeacher 
              ? 'Kelola data siswa, kelas, nilai, dan pengumuman.' 
              : 'Lihat kelas, nilai, dan pengumuman.'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isTeacher ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
                  <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{classes.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Nilai</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{scores.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pengumuman Aktif</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{announcements.length}</div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Kelas Saya</CardTitle>
                  <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentClasses.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Nilai Saya</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentUser ? scores.filter(s => s.studentId === currentUser.id).length : 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Kehadiran</CardTitle>
                  <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentAttendance.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profil Saya</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-medium">{currentUser?.name}</div>
                  <div className="text-sm text-muted-foreground">Siswa</div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Pengumuman Terbaru</CardTitle>
              <CardDescription>
                {announcements.length > 0
                  ? 'Pengumuman terbaru untuk Anda'
                  : 'Tidak ada pengumuman saat ini'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.length > 0 ? (
                announcements
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 3)
                  .map((announcement) => (
                    <div key={announcement.id} className="border-b pb-4 last:border-0">
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(announcement.date).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="mt-1 text-sm">{announcement.content}</p>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Belum ada pengumuman yang dibuat.
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>{isTeacher ? 'Kelas' : 'Kelas Saya'}</CardTitle>
              <CardDescription>
                {isTeacher
                  ? classes.length > 0
                    ? 'Daftar kelas yang Anda kelola'
                    : 'Belum ada kelas'
                  : studentClasses.length > 0
                  ? 'Daftar kelas yang Anda ikuti'
                  : 'Anda belum terdaftar di kelas manapun'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isTeacher ? (
                classes.length > 0 ? (
                  classes.slice(0, 5).map((classItem) => (
                    <div key={classItem.id} className="border-b pb-4 last:border-0">
                      <h3 className="font-semibold">{classItem.name}</h3>
                      <p className="text-sm">{classItem.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Belum ada kelas yang dibuat.
                  </p>
                )
              ) : studentClasses.length > 0 ? (
                studentClasses.slice(0, 5).map((classItem) => (
                  <div key={classItem.id} className="border-b pb-4 last:border-0">
                    <h3 className="font-semibold">{classItem.name}</h3>
                    <p className="text-sm">{classItem.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Anda belum terdaftar di kelas manapun.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
