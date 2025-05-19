
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

const Index = () => {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  // Redirect to appropriate page based on authentication status
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return null;
};

export default Index;
