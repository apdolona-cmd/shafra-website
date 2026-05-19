import { useState, useEffect, createContext, useContext } from 'react';
import { db, SiteSettings } from './store/database';

import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

interface AppContextType {
  settings: SiteSettings;
  refreshSettings: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  dataVersion: number;
}

export const AppContext = createContext<AppContextType>({
  settings: db.getSettings(),
  refreshSettings: () => {},
  currentPage: 'home',
  setCurrentPage: () => {},
  dataVersion: 0,
});

export const useAppContext = () => useContext(AppContext);

function App() {
  const [settings, setSettings] = useState<SiteSettings>(db.getSettings());
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(db.isLoggedIn());
  const [dataVersion, setDataVersion] = useState(0);

  const refreshSettings = () => {
    const s = db.getSettings();
    setSettings({ ...s });
    setDataVersion(v => v + 1);
  };

  // ✅ استمع للتحديثات من Firebase
  useEffect(() => {
    const unsub = db.onUpdate(() => {
      console.log('🔄 App: Firebase data changed! Refreshing...');
      const s = db.getSettings();
      setSettings({ ...s });
      setDataVersion(v => v + 1);
    });
    return () => { unsub(); };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
    document.documentElement.style.setProperty('--color-secondary', settings.secondaryColor);
    document.documentElement.style.setProperty('--color-accent', settings.accentColor);
    document.title = settings.siteName + ' - شركة برمجيات متكاملة';
  }, [settings]);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#/admin') {
        if (db.isLoggedIn()) {
          setIsAdmin(true);
          setCurrentPage('admin');
        } else {
          setCurrentPage('admin-login');
        }
      } else {
        setCurrentPage('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleLogin = () => { setIsAdmin(true); setCurrentPage('admin'); };
  const handleLogout = () => { db.logout(); setIsAdmin(false); setCurrentPage('home'); window.location.hash = ''; };

  return (
    <AppContext.Provider value={{ settings, refreshSettings, currentPage, setCurrentPage, dataVersion }}>
      <div className="min-h-screen" style={{ fontFamily: "'Cairo', sans-serif" }}>
        {currentPage === 'admin-login' && <AdminLogin onLogin={handleLogin} />}
        {currentPage === 'admin' && isAdmin && <AdminDashboard onLogout={handleLogout} />}
        {currentPage === 'home' && <HomePage key={dataVersion} />}
      </div>
    </AppContext.Provider>
  );
}

export default App;
