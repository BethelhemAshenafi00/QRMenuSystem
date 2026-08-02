import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const { login: setUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (user) => {
      setUser(user);
      navigate('/');
    },
    onError: () => setError('Invalid email or password.'),
  });

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] px-4 relative overflow-hidden">

      {/* Background lighting layers */}
      <div className="absolute inset-0">
        <div className="absolute w-[800px] h-[800px] bg-gradient-to-tr from-blue-100/40 via-white to-purple-100/30 blur-[160px] -top-48 -left-48" />
        <div className="absolute w-[700px] h-[700px] bg-gradient-to-br from-white via-gray-50 to-blue-50 blur-[180px] bottom-[-250px] right-[-200px]" />
      </div>

      {/* Main card */}
      <div className="relative w-full max-w-md">

        {/* outer glow frame */}
        <div className="absolute inset-0 bg-white/40 blur-2xl rounded-[32px] scale-[2.1]" />

        <div className="relative backdrop-blur-2xl bg-white/70 border border-white/50 shadow-[0_30px_120px_rgba(0,0,0,0.10)] rounded-[32px] p-3">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-black text-white text-xl mb-4 shadow-lg">
              🍽️
            </div>

            <h3 className="text-4xl font-semibold tracking-tight text-gray-900">
              QRMenu
            </h3>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Welcome back. Sign in to continue managing your restaurant.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="admin@qrmenu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && mutate()}
            />

            {error && (
              <div className="text-sm text-red-600 bg-red-50/70 border border-red-100 rounded-2xl px-4 py-3">
                {error}
              </div>
            )}

            <Button
              className="w-full bg-gradient-to-r from-black to-gray-900 text-white rounded-2xl py-3 font-medium shadow-lg shadow-black/20 hover:shadow-black/30 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300"
              loading={isPending}
              onClick={() => mutate()}
            >
              Sign In
            </Button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs text-gray-400">secure access</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} QRMenu. Built with care.
          </p>

        </div>
      </div>
    </div>
  );
}