
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: 'teacher' | 'student' | null; // null means both roles are allowed
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (allowedRole && currentUser.role !== allowedRole) {
      navigate('/dashboard');
    }
  }, [currentUser, allowedRole, navigate]);

  if (!currentUser) {
    return null;
  }

  if (allowedRole && currentUser.role !== allowedRole) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
