import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { LogIn, Mail, Lock, Monitor, AlertCircle } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(email, password);
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/professor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || t('auth.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute top-6 right-6 z-10">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-500 rounded-2xl shadow-lg shadow-primary-500/30 mb-4">
            <Monitor className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t('auth.loginTitle')}</h1>
          <p className="text-gray-400 mt-1 text-sm">{t('auth.loginSubtitle')}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-8">
          {error && (
            <div className="mb-6 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@universite.edu"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-400"
                />
              </div>
            </div>

            <button
              id="login-button"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-600/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {t('auth.loginBtn')}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {t('auth.noAccount')} {' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                {t('auth.createAccount')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
