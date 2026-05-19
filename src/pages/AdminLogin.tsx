import { useState } from 'react';
import { db } from '../store/database';
import { useAppContext } from '../App';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const { settings } = useAppContext();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (db.login(password)) {
        onLogin();
      } else {
        setError('كلمة المرور غير صحيحة');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        fontFamily: "'Cairo', sans-serif",
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
      }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: settings.primaryColor }}
        />
        <div 
          className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: settings.secondaryColor }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <div 
          className="p-8 rounded-3xl border shadow-2xl"
          style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4"
              style={{ 
                background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                animation: 'float 3s ease-in-out infinite'
              }}
            >
              🔐
            </div>
            <h1 className="text-3xl font-black text-white mb-2">لوحة التحكم</h1>
            <p className="text-gray-400">{settings.siteName}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">كلمة المرور</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-5 py-4 pr-12 rounded-xl text-white text-lg focus:outline-none transition-all duration-300 placeholder-gray-500"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                  }}
                  placeholder="أدخل كلمة المرور..."
                  dir="ltr"
                  onFocus={e => e.target.style.borderColor = settings.primaryColor}
                  onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                  🔑
                </div>
              </div>
            </div>

            {error && (
              <div 
                className="p-4 rounded-xl text-center"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171'
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 disabled:opacity-50"
              style={{ 
                background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                boxShadow: `0 10px 40px ${settings.primaryColor}40`
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  جاري التحقق...
                </span>
              ) : (
                'تسجيل الدخول ←'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); window.location.hash = ''; window.location.reload(); }}
              className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
            >
              <span>←</span> العودة إلى الموقع
            </a>
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-gray-600 text-xs mt-4">
          تلميح: كلمة المرور هي رقم الهاتف
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

  );
}
