
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username dan Password harus diisi');
      return;
    }

    const success = login(username, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4">
      <Button 
        variant="ghost" 
        className="absolute left-4 top-4 text-primary hover:text-primary/80"
        onClick={() => navigate('/')}
      >
        &larr; Kembali ke Beranda
      </Button>

      <div className="mb-8 flex flex-col items-center">
        <img
          src="/lovable-uploads/ad41bcbd-cb29-472a-a417-02112b3f8800.png"
          alt="SD Negeri Sukabumi 2"
          className="h-28 w-28 school-logo mb-4 animate-fade-in"
        />
        <h1 className="mt-2 text-3xl font-bold text-primary">SD Negeri Sukabumi 2</h1>
        <p className="mt-1 text-lg text-gray-600">Sistem Informasi Kelas</p>
      </div>
      
      <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden animate-scale-in">
        <div className="h-2 bg-gradient-to-r from-primary to-blue-400"></div>
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl">Masuk</CardTitle>
          <CardDescription>Silahkan masukkan username dan password Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-300"
              />
            </div>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <Button className="w-full bg-primary hover:bg-primary/90" type="submit">
              Masuk
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center text-sm text-gray-700 max-w-md">
        <p className="font-medium mb-1">Demo Account:</p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="bg-white p-2 rounded border border-gray-200">
            <p><strong>Guru:</strong></p>
            <p>username: teacher</p>
            <p>password: password</p>
          </div>
          <div className="bg-white p-2 rounded border border-gray-200">
            <p><strong>Siswa:</strong></p>
            <p>username: student</p>
            <p>password: password</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} SD Negeri Sukabumi 2. Hak Cipta Dilindungi.</p>
        <p>Dibuat oleh Samsul Badrus Saleh</p>
      </div>
    </div>
  );
};

export default Login;
