
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
    <div className="login-background flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center">
        <img
          src="/lovable-uploads/ad41bcbd-cb29-472a-a417-02112b3f8800.png"
          alt="SD Negeri Sukabumi 2"
          className="h-32 w-32 school-logo"
        />
        <h1 className="mt-6 text-3xl font-bold text-white">SD Negeri Sukabumi 2</h1>
        <p className="mt-2 text-xl text-white/80">Sistem Informasi Kelas</p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Login</CardTitle>
          <CardDescription>Masuk ke akun Anda untuk menggunakan sistem</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm font-medium text-red-500">{error}</p>}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>Login</Button>
        </CardFooter>
      </Card>
      
      <div className="mt-8 text-center text-sm text-white/70">
        <p>Demo Account:</p>
        <p>Teacher: username: teacher, password: password</p>
        <p>Student: username: student, password: password</p>
      </div>
      
      <div className="mt-8 text-center text-sm text-white/70">
        <p>&copy; {new Date().getFullYear()} SD Negeri Sukabumi 2. Hak Cipta Dilindungi.</p>
        <p>Dibuat oleh Samsul Badrus Saleh</p>
      </div>
    </div>
  );
};

export default Login;
