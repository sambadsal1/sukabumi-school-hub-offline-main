
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import {
  User,
  Home,
  Book,
  Calendar,
  Users,
  Info,
  LogOut,
  Menu,
  X,
  CalendarCheck
} from 'lucide-react';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const teacherMenuItems = [
    { icon: <Home className="h-5 w-5" />, title: 'Dashboard', path: '/dashboard' },
    { icon: <Users className="h-5 w-5" />, title: 'Siswa', path: '/students' },
    { icon: <Book className="h-5 w-5" />, title: 'Kelas', path: '/classes' },
    { icon: <Calendar className="h-5 w-5" />, title: 'Nilai', path: '/scores' },
    { icon: <CalendarCheck className="h-5 w-5" />, title: 'Kehadiran', path: '/attendance' },
    { icon: <Info className="h-5 w-5" />, title: 'Pengumuman', path: '/announcements' },
  ];

  const studentMenuItems = [
    { icon: <Home className="h-5 w-5" />, title: 'Dashboard', path: '/dashboard' },
    { icon: <Book className="h-5 w-5" />, title: 'Kelas Saya', path: '/my-classes' },
    { icon: <Calendar className="h-5 w-5" />, title: 'Nilai Saya', path: '/my-scores' },
    { icon: <CalendarCheck className="h-5 w-5" />, title: 'Kehadiran', path: '/attendance' },
    { icon: <Info className="h-5 w-5" />, title: 'Pengumuman', path: '/announcements' },
  ];

  const menuItems = currentUser?.role === 'teacher' ? teacherMenuItems : studentMenuItems;

  return (
    <div className="flex h-screen w-full">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-4 z-50"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-40 w-64 bg-sidebar transform transition-transform duration-200 ease-in-out md:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-center py-6">
            <div className="flex flex-col items-center">
              <img
                src="/lovable-uploads/ad41bcbd-cb29-472a-a417-02112b3f8800.png"
                alt="SD Negeri Sukabumi 2"
                className="h-20 w-20 school-logo"
              />
              <h1 className="mt-3 text-xl font-bold text-sidebar-foreground">SD Negeri Sukabumi 2</h1>
              <p className="mt-1 text-sm text-sidebar-foreground/70">Sistem Informasi Kelas</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <button
                      className={`flex w-full items-center rounded-md px-4 py-3 text-left text-sm transition-colors ${
                        location.pathname === item.path
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                      }`}
                      onClick={() => {
                        navigate(item.path);
                        if (isMobile) setIsSidebarOpen(false);
                      }}
                    >
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                <User className="h-5 w-5 text-sidebar-accent-foreground" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-sidebar-foreground">{currentUser?.name}</p>
                <p className="text-xs text-sidebar-foreground/70">
                  {currentUser?.role === 'teacher' ? 'Guru' : 'Siswa'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="mt-4 w-full justify-start text-sidebar-foreground"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`flex-1 ${
          isSidebarOpen ? 'md:ml-64' : ''
        } flex flex-col bg-gray-50 transition-all duration-200 ease-in-out min-h-screen`}
      >
        <main className="flex-1 p-4 md:p-8">{children}</main>

        <footer className="border-t py-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} SD Negeri Sukabumi 2. Hak Cipta Dilindungi.</p>
          <p>Dibuat oleh Samsul Badrus Saleh</p>
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;
