import { useState } from 'react';
import { db, SiteSettings, Product, Service, PortfolioItem, Testimonial, TeamMember, ContactMessage, HeroSlide, UploadedFile } from '../store/database';
import { useAppContext } from '../App';

interface AdminDashboardProps {
  onLogout: () => void;
}

// File to Base64 converter
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { settings, refreshSettings } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);

  const showNotification = (type: string, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: '📊' },
    { id: 'settings', label: 'إعدادات الموقع', icon: '⚙️' },
    { id: 'media', label: 'إدارة الصور', icon: '🖼️' },
    { id: 'hero', label: 'البانر الرئيسي', icon: '📸' },
    { id: 'services', label: 'الخدمات', icon: '🔧' },
    { id: 'products', label: 'المنتجات', icon: '📦' },
    { id: 'portfolio', label: 'الأعمال', icon: '💼' },
    { id: 'team', label: 'فريق العمل', icon: '👥' },
    { id: 'testimonials', label: 'آراء العملاء', icon: '⭐' },
    { id: 'messages', label: 'الرسائل', icon: '📩' },
    { id: 'files', label: 'إدارة الملفات', icon: '📁' },
    { id: 'colors', label: 'الألوان والتصميم', icon: '🎨' },
  ];

  const stats = db.getStats();

  return (
    <div className="min-h-screen bg-gray-950 text-white" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Notification */}
      {notification && (
        <div 
          className={`fixed top-4 left-1/2 z-[100] px-6 py-3 rounded-xl shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white font-medium`}
          style={{ transform: 'translateX(-50%)' }}
        >
          {notification.type === 'success' ? '✅' : '❌'} {notification.message}
        </div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 right-0 h-full bg-gray-900 border-l border-gray-800 flex flex-col z-40 transition-all duration-300`}
        style={{ width: sidebarOpen ? '256px' : '80px' }}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})` }}
            >
              {settings.siteName.charAt(0)}
            </div>
            {sidebarOpen && <span className="font-bold text-sm truncate">{settings.siteName}</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-500/20 text-white border-l-4 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
              {item.id === 'messages' && stats.unreadMessages > 0 && sidebarOpen && (
                <span className="mr-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.unreadMessages}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.location.hash = ''; window.location.reload(); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className="text-lg">🌐</span>
            {sidebarOpen && <span>عرض الموقع</span>}
          </a>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <span className="text-lg">🚪</span>
            {sidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className="transition-all duration-300"
        style={{ marginRight: sidebarOpen ? '256px' : '80px' }}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <span>{menuItems.find(m => m.id === activeTab)?.icon}</span>
                <span>{menuItems.find(m => m.id === activeTab)?.label}</span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">مرحباً، المدير 👋</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'dashboard' && <DashboardTab stats={stats} settings={settings} />}
          {activeTab === 'settings' && <SettingsTab settings={settings} refreshSettings={refreshSettings} showNotification={showNotification} />}
          {activeTab === 'media' && <MediaTab showNotification={showNotification} />}
          {activeTab === 'hero' && <HeroTab showNotification={showNotification} />}
          {activeTab === 'services' && <ServicesTab showNotification={showNotification} />}
          {activeTab === 'products' && <ProductsTab showNotification={showNotification} />}
          {activeTab === 'portfolio' && <PortfolioTab showNotification={showNotification} />}
          {activeTab === 'team' && <TeamTab showNotification={showNotification} />}
          {activeTab === 'testimonials' && <TestimonialsTab showNotification={showNotification} />}
          {activeTab === 'messages' && <MessagesTab showNotification={showNotification} />}
          {activeTab === 'files' && <FilesTab showNotification={showNotification} />}
          {activeTab === 'colors' && <ColorsTab settings={settings} refreshSettings={refreshSettings} showNotification={showNotification} />}
        </div>
      </main>
    </div>
  );
}

// Dashboard Tab
function DashboardTab({ stats, settings }: { stats: ReturnType<typeof db.getStats>; settings: SiteSettings }) {
  const cards = [
    { label: 'المنتجات', value: stats.products, icon: '📦', color: '#2563eb' },
    { label: 'الخدمات', value: stats.services, icon: '🔧', color: '#7c3aed' },
    { label: 'الأعمال', value: stats.portfolio, icon: '💼', color: '#06b6d4' },
    { label: 'الرسائل', value: stats.messages, icon: '📩', color: '#f59e0b' },
    { label: 'غير مقروءة', value: stats.unreadMessages, icon: '🔔', color: '#ef4444' },
    { label: 'فريق العمل', value: stats.team, icon: '👥', color: '#10b981' },
    { label: 'آراء العملاء', value: stats.testimonials, icon: '⭐', color: '#f97316' },
    { label: 'الملفات', value: stats.files, icon: '📁', color: '#8b5cf6' },
  ];

  const recentMessages = db.getMessages().slice(-5).reverse();

  const isFirebaseConnected = db.isFirebaseConnected();

  return (
    <div className="space-y-6">
      {/* Firebase Status */}
      <div className={`p-4 rounded-2xl border flex items-center gap-4 ${isFirebaseConnected ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isFirebaseConnected ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
          {isFirebaseConnected ? '🔥' : '⚠️'}
        </div>
        <div>
          <h3 className="font-bold">
            {isFirebaseConnected ? '✅ متصل بـ Firebase' : '⚠️ غير متصل بقاعدة البيانات'}
          </h3>
          <p className={`text-sm ${isFirebaseConnected ? 'text-green-400' : 'text-yellow-400'}`}>
            {isFirebaseConnected 
              ? 'جميع التعديلات تظهر لجميع الزوار في الوقت الحقيقي' 
              : 'يجب ربط Firebase لإظهار التعديلات للزوار'}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div 
            key={i} 
            className="p-5 rounded-2xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${card.color}20` }}
              >
                <span className="text-2xl font-black" style={{ color: card.color }}>{card.value}</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Site Info */}
        <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50">
          <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
            <span>📋</span> معلومات الموقع
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-700/50">
              <span className="text-gray-400">اسم الموقع</span>
              <span className="font-medium">{settings.siteName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700/50">
              <span className="text-gray-400">البريد</span>
              <span className="font-medium">{settings.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700/50">
              <span className="text-gray-400">الهاتف</span>
              <span className="font-medium">{settings.phone}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">العنوان</span>
              <span className="font-medium">{settings.address}</span>
            </div>
          </div>
        </div>

        {/* Colors Preview */}
        <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50">
          <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
            <span>🎨</span> الألوان الحالية
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl shadow-lg" style={{ background: settings.primaryColor }} />
              <div>
                <p className="text-sm font-medium">اللون الأساسي</p>
                <p className="text-xs text-gray-400">{settings.primaryColor}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl shadow-lg" style={{ background: settings.secondaryColor }} />
              <div>
                <p className="text-sm font-medium">اللون الثانوي</p>
                <p className="text-xs text-gray-400">{settings.secondaryColor}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl shadow-lg" style={{ background: settings.accentColor }} />
              <div>
                <p className="text-sm font-medium">اللون المميز</p>
                <p className="text-xs text-gray-400">{settings.accentColor}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50">
        <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
          <span>📩</span> آخر الرسائل
        </h3>
        <div className="space-y-3">
          {recentMessages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">📭 لا توجد رسائل بعد</p>
          ) : (
            recentMessages.map(msg => (
              <div 
                key={msg.id} 
                className={`p-4 rounded-xl flex items-center justify-between ${
                  msg.isRead ? 'bg-gray-700/30' : 'bg-blue-500/10 border border-blue-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  {!msg.isRead && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                  <div>
                    <span className="font-medium text-sm">{msg.name}</span>
                    <span className="text-gray-500 mx-2">-</span>
                    <span className="text-gray-400 text-sm">{msg.subject}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{new Date(msg.date).toLocaleDateString('ar-EG')}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable Form Input Component
function FormField({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder = '', 
  required = false, 
  textarea = false, 
  rows = 3 
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
}) {
  const inputClass = "w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-500";
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      {textarea ? (
        <textarea 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          rows={rows} 
          className={inputClass + ' resize-none'} 
          placeholder={placeholder} 
          required={required} 
        />
      ) : (
        <input 
          type={type} 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          className={inputClass} 
          placeholder={placeholder} 
          required={required} 
        />
      )}
    </div>
  );
}

// Image Upload Component
function ImageUpload({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      onChange(base64);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="flex items-center gap-4">
        {value && (
          <img src={value} alt="" className="w-20 h-20 rounded-xl object-cover border-2 border-gray-600" />
        )}
        <label className="flex-1 py-4 px-6 rounded-xl bg-gray-700/50 border-2 border-dashed border-gray-600 cursor-pointer hover:bg-gray-700 hover:border-blue-500 transition-all text-center">
          <div className="text-2xl mb-1">📤</div>
          <span className="text-gray-400 text-sm">اختر صورة أو اسحبها هنا</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
        {value && (
          <button 
            onClick={() => onChange('')} 
            className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}

// Save Button Component
function SaveButton({ onClick, loading = false, text = 'حفظ' }: { onClick: () => void; loading?: boolean; text?: string }) {
  return (
    <button 
      onClick={onClick}
      disabled={loading}
      className="w-full py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-l from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
    >
      {loading ? '⏳ جاري الحفظ...' : `💾 ${text}`}
    </button>
  );
}

// Settings Tab
function SettingsTab({ settings, refreshSettings, showNotification }: { settings: SiteSettings; refreshSettings: () => void; showNotification: (t: string, m: string) => void }) {
  const [form, setForm] = useState<SiteSettings>({ ...settings });

  const handleSave = () => {
    db.updateSettings(form);
    refreshSettings();
    showNotification('success', 'تم حفظ الإعدادات بنجاح');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <span>⚙️</span> الإعدادات العامة
        </h3>
        <div className="space-y-5">
          <FormField label="اسم الموقع" value={form.siteName} onChange={v => setForm({ ...form, siteName: v })} />
          <FormField label="وصف الموقع" value={form.siteDescription} onChange={v => setForm({ ...form, siteDescription: v })} textarea />
          <ImageUpload label="شعار الموقع" value={form.logo} onChange={v => setForm({ ...form, logo: v })} />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <span>📞</span> معلومات التواصل
        </h3>
        <div className="grid md:grid-cols-2 gap-5">
          <FormField label="رقم الهاتف" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
          <FormField label="البريد الإلكتروني" value={form.email} onChange={v => setForm({ ...form, email: v })} type="email" />
          <FormField label="العنوان" value={form.address} onChange={v => setForm({ ...form, address: v })} />
          <FormField label="رقم الواتساب" value={form.whatsapp} onChange={v => setForm({ ...form, whatsapp: v })} placeholder="مثال: 201147497465" />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <span>🌐</span> روابط السوشيال ميديا
        </h3>
        <div className="grid md:grid-cols-2 gap-5">
          <FormField label="Facebook" value={form.facebook} onChange={v => setForm({ ...form, facebook: v })} placeholder="https://facebook.com/..." />
          <FormField label="Twitter" value={form.twitter} onChange={v => setForm({ ...form, twitter: v })} placeholder="https://twitter.com/..." />
          <FormField label="Instagram" value={form.instagram} onChange={v => setForm({ ...form, instagram: v })} placeholder="https://instagram.com/..." />
          <FormField label="LinkedIn" value={form.linkedin} onChange={v => setForm({ ...form, linkedin: v })} placeholder="https://linkedin.com/..." />
        </div>
      </div>

      <SaveButton onClick={handleSave} text="حفظ الإعدادات" />
    </div>
  );
}

// Colors Tab
function ColorsTab({ settings, refreshSettings, showNotification }: { settings: SiteSettings; refreshSettings: () => void; showNotification: (t: string, m: string) => void }) {
  const [primary, setPrimary] = useState(settings.primaryColor);
  const [secondary, setSecondary] = useState(settings.secondaryColor);
  const [accent, setAccent] = useState(settings.accentColor);

  const presets = [
    { name: 'أزرق كلاسيكي', primary: '#2563eb', secondary: '#7c3aed', accent: '#06b6d4' },
    { name: 'أخضر طبيعي', primary: '#10b981', secondary: '#059669', accent: '#34d399' },
    { name: 'أحمر جريء', primary: '#ef4444', secondary: '#dc2626', accent: '#f97316' },
    { name: 'برتقالي دافئ', primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24' },
    { name: 'وردي أنيق', primary: '#ec4899', secondary: '#db2777', accent: '#f472b6' },
    { name: 'ذهبي فاخر', primary: '#d4a017', secondary: '#b8860b', accent: '#ffd700' },
    { name: 'أزرق سماوي', primary: '#0ea5e9', secondary: '#0284c7', accent: '#38bdf8' },
    { name: 'بنفسجي غامق', primary: '#8b5cf6', secondary: '#6d28d9', accent: '#a78bfa' },
  ];

  const handleSave = () => {
    db.updateSettings({ primaryColor: primary, secondaryColor: secondary, accentColor: accent });
    refreshSettings();
    showNotification('success', 'تم تحديث الألوان بنجاح - قم بتحديث الصفحة لرؤية التغييرات');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <span>🎨</span> تخصيص الألوان
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">اللون الأساسي</label>
            <div className="flex items-center gap-3">
              <input 
                type="color" 
                value={primary} 
                onChange={e => setPrimary(e.target.value)} 
                className="w-14 h-14 rounded-xl cursor-pointer border-2 border-gray-600" 
              />
              <input 
                type="text" 
                value={primary} 
                onChange={e => setPrimary(e.target.value)} 
                className="flex-1 px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm" 
                dir="ltr" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">اللون الثانوي</label>
            <div className="flex items-center gap-3">
              <input 
                type="color" 
                value={secondary} 
                onChange={e => setSecondary(e.target.value)} 
                className="w-14 h-14 rounded-xl cursor-pointer border-2 border-gray-600" 
              />
              <input 
                type="text" 
                value={secondary} 
                onChange={e => setSecondary(e.target.value)} 
                className="flex-1 px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm" 
                dir="ltr" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">اللون المميز</label>
            <div className="flex items-center gap-3">
              <input 
                type="color" 
                value={accent} 
                onChange={e => setAccent(e.target.value)} 
                className="w-14 h-14 rounded-xl cursor-pointer border-2 border-gray-600" 
              />
              <input 
                type="text" 
                value={accent} 
                onChange={e => setAccent(e.target.value)} 
                className="flex-1 px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm" 
                dir="ltr" 
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
          <p className="text-sm text-gray-400 mb-3">معاينة الألوان:</p>
          <div className="flex gap-3 mb-3">
            <div className="flex-1 py-4 rounded-xl text-center text-white font-bold" style={{ background: primary }}>أساسي</div>
            <div className="flex-1 py-4 rounded-xl text-center text-white font-bold" style={{ background: secondary }}>ثانوي</div>
            <div className="flex-1 py-4 rounded-xl text-center text-white font-bold" style={{ background: accent }}>مميز</div>
          </div>
          <div className="py-4 rounded-xl text-center text-white font-bold" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}>
            تدرج لوني
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>🎯</span> قوالب ألوان جاهزة
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {presets.map((preset, i) => (
            <button
              key={i}
              onClick={() => { setPrimary(preset.primary); setSecondary(preset.secondary); setAccent(preset.accent); }}
              className="p-4 rounded-xl bg-gray-700/30 border border-gray-600 hover:bg-gray-700/50 hover:border-blue-500 transition-all"
            >
              <div className="flex gap-2 justify-center mb-3">
                <div className="w-8 h-8 rounded-lg shadow-lg" style={{ background: preset.primary }} />
                <div className="w-8 h-8 rounded-lg shadow-lg" style={{ background: preset.secondary }} />
                <div className="w-8 h-8 rounded-lg shadow-lg" style={{ background: preset.accent }} />
              </div>
              <span className="text-sm text-gray-300">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      <SaveButton onClick={handleSave} text="حفظ الألوان" />
    </div>
  );
}

// Hero Tab
function HeroTab({ showNotification }: { showNotification: (t: string, m: string) => void }) {
  const [slides, setSlides] = useState<HeroSlide[]>(db.getHeroSlides());
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [form, setForm] = useState({ title: '', subtitle: '', image: '', buttonText: '', buttonLink: '' });

  const handleSave = () => {
    if (editing) {
      db.updateHeroSlide(editing.id, form);
      showNotification('success', 'تم تحديث البانر بنجاح');
    } else {
      db.addHeroSlide(form);
      showNotification('success', 'تم إضافة البانر بنجاح');
    }
    setSlides(db.getHeroSlides());
    resetForm();
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ title: '', subtitle: '', image: '', buttonText: '', buttonLink: '' });
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditing(slide);
    setForm({ title: slide.title, subtitle: slide.subtitle, image: slide.image, buttonText: slide.buttonText, buttonLink: slide.buttonLink });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا البانر؟')) {
      db.deleteHeroSlide(id);
      setSlides(db.getHeroSlides());
      showNotification('success', 'تم حذف البانر');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          {editing ? <><span>✏️</span> تعديل البانر</> : <><span>➕</span> إضافة بانر جديد</>}
        </h3>
        <div className="space-y-5">
          <FormField label="العنوان الرئيسي" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="مثال: نحول أفكارك إلى واقع رقمي" />
          <FormField label="العنوان الفرعي" value={form.subtitle} onChange={v => setForm({ ...form, subtitle: v })} textarea placeholder="وصف قصير للبانر..." />
          <ImageUpload label="صورة الخلفية" value={form.image} onChange={v => setForm({ ...form, image: v })} />
          <div className="grid md:grid-cols-2 gap-5">
            <FormField label="نص الزر" value={form.buttonText} onChange={v => setForm({ ...form, buttonText: v })} placeholder="ابدأ الآن" />
            <FormField label="رابط الزر" value={form.buttonLink} onChange={v => setForm({ ...form, buttonLink: v })} placeholder="#contact" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-l from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all">
              {editing ? '💾 تحديث البانر' : '➕ إضافة البانر'}
            </button>
            {editing && (
              <button onClick={resetForm} className="py-3 px-6 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors">
                إلغاء
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Slides List */}
      <div className="space-y-3">
        {slides.map(slide => (
          <div key={slide.id} className="p-4 rounded-2xl bg-gray-800/50 border border-gray-700/50 flex items-center gap-4">
            {slide.image ? (
              <img src={slide.image} alt="" className="w-24 h-16 rounded-xl object-cover" />
            ) : (
              <div className="w-24 h-16 rounded-xl bg-gray-700 flex items-center justify-center text-2xl">🖼️</div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm truncate">{slide.title || 'بدون عنوان'}</h4>
              <p className="text-gray-400 text-xs truncate">{slide.subtitle}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(slide)} className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
                ✏️
              </button>
              <button onClick={() => handleDelete(slide.id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Services Tab
function ServicesTab({ showNotification }: { showNotification: (t: string, m: string) => void }) {
  const [services, setServices] = useState<Service[]>(db.getServices());
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ title: '', description: '', icon: 'globe', features: '', isActive: true });
  
  const iconOptions = [
    { value: 'globe', label: '🌐 موقع' },
    { value: 'smartphone', label: '📱 موبايل' },
    { value: 'palette', label: '🎨 تصميم' },
    { value: 'database', label: '🗄️ قاعدة بيانات' },
    { value: 'shopping-cart', label: '🛒 تجارة' },
    { value: 'server', label: '🖥️ سيرفر' },
  ];

  const handleSave = () => {
    const serviceData = {
      title: form.title,
      description: form.description,
      icon: form.icon,
      features: form.features.split(',').map(f => f.trim()).filter(Boolean),
      isActive: form.isActive,
    };

    if (editing) {
      db.updateService(editing.id, serviceData);
      showNotification('success', 'تم تحديث الخدمة بنجاح');
    } else {
      db.addService(serviceData);
      showNotification('success', 'تم إضافة الخدمة بنجاح');
    }
    setServices(db.getServices());
    resetForm();
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ title: '', description: '', icon: 'globe', features: '', isActive: true });
  };

  const handleEdit = (service: Service) => {
    setEditing(service);
    setForm({
      title: service.title,
      description: service.description,
      icon: service.icon,
      features: service.features.join(', '),
      isActive: service.isActive,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      db.deleteService(id);
      setServices(db.getServices());
      showNotification('success', 'تم حذف الخدمة');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50 max-w-4xl">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          {editing ? <><span>✏️</span> تعديل الخدمة</> : <><span>➕</span> إضافة خدمة جديدة</>}
        </h3>
        <div className="space-y-5">
          <FormField label="عنوان الخدمة" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="مثال: تطوير مواقع الويب" />
          <FormField label="وصف الخدمة" value={form.description} onChange={v => setForm({ ...form, description: v })} textarea placeholder="وصف تفصيلي للخدمة..." />
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">الأيقونة</label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map(icon => (
                <button
                  key={icon.value}
                  onClick={() => setForm({ ...form, icon: icon.value })}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    form.icon === icon.value 
                      ? 'bg-blue-500/30 border-blue-500 text-white' 
                      : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
                  } border`}
                >
                  {icon.label}
                </button>
              ))}
            </div>
          </div>
          
          <FormField label="المميزات (مفصولة بفواصل)" value={form.features} onChange={v => setForm({ ...form, features: v })} placeholder="ميزة 1, ميزة 2, ميزة 3" />
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">حالة الخدمة:</span>
            <button
              onClick={() => setForm({ ...form, isActive: !form.isActive })}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                form.isActive ? 'bg-green-500/20 text-green-400 border-green-500' : 'bg-gray-700 text-gray-400 border-gray-600'
              } border`}
            >
              {form.isActive ? '✅ مفعّلة' : '⏸️ معطّلة'}
            </button>
          </div>
          
          <div className="flex gap-3">
            <button onClick={handleSave} className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-l from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all">
              {editing ? '💾 تحديث' : '➕ إضافة'}
            </button>
            {editing && (
              <button onClick={resetForm} className="py-3 px-6 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors">
                إلغاء
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(service => (
          <div key={service.id} className={`p-5 rounded-2xl bg-gray-800/50 border border-gray-700/50 ${!service.isActive ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold">{service.title}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${service.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-400'}`}>
                {service.isActive ? 'مفعّلة' : 'معطّلة'}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{service.description}</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {service.features.slice(0, 3).map((f, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded bg-gray-700/50 text-gray-400">{f}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(service)} className="flex-1 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium">
                ✏️ تعديل
              </button>
              <button onClick={() => handleDelete(service.id)} className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium">
                🗑️ حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Products Tab
function ProductsTab({ showNotification }: { showNotification: (t: string, m: string) => void }) {
  const [products, setProducts] = useState<Product[]>(db.getProducts());
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: '', description: '', category: '', price: '', image: '',
    features: '', technologies: '', demoUrl: '', isActive: true,
  });

  const handleSave = () => {
    const productData = {
      name: form.name,
      description: form.description,
      category: form.category,
      price: form.price,
      image: form.image,
      features: form.features.split(',').map(f => f.trim()).filter(Boolean),
      technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
      demoUrl: form.demoUrl,
      isActive: form.isActive,
    };

    if (editing) {
      db.updateProduct(editing.id, productData);
      showNotification('success', 'تم تحديث المنتج بنجاح');
    } else {
      db.addProduct(productData);
      showNotification('success', 'تم إضافة المنتج بنجاح');
    }
    setProducts(db.getProducts());
    resetForm();
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', description: '', category: '', price: '', image: '', features: '', technologies: '', demoUrl: '', isActive: true });
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name, description: product.description, category: product.category,
      price: product.price, image: product.image, features: product.features.join(', '),
      technologies: product.technologies.join(', '), demoUrl: product.demoUrl, isActive: product.isActive,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      db.deleteProduct(id);
      setProducts(db.getProducts());
      showNotification('success', 'تم حذف المنتج');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50 max-w-4xl">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          {editing ? <><span>✏️</span> تعديل المنتج</> : <><span>➕</span> إضافة منتج جديد</>}
        </h3>
        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <FormField label="اسم المنتج" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="مثال: نظام إدارة المدارس" />
            <FormField label="التصنيف" value={form.category} onChange={v => setForm({ ...form, category: v })} placeholder="مثال: أنظمة إدارة" />
          </div>
          <FormField label="الوصف" value={form.description} onChange={v => setForm({ ...form, description: v })} textarea placeholder="وصف تفصيلي للمنتج..." />
          <ImageUpload label="صورة المنتج" value={form.image} onChange={v => setForm({ ...form, image: v })} />
          <div className="grid md:grid-cols-2 gap-5">
            <FormField label="السعر ($)" value={form.price} onChange={v => setForm({ ...form, price: v })} placeholder="5000" />
            <FormField label="رابط التجربة" value={form.demoUrl} onChange={v => setForm({ ...form, demoUrl: v })} placeholder="https://demo.example.com" />
          </div>
          <FormField label="المميزات (مفصولة بفواصل)" value={form.features} onChange={v => setForm({ ...form, features: v })} placeholder="ميزة 1, ميزة 2, ميزة 3" />
          <FormField label="التقنيات المستخدمة (مفصولة بفواصل)" value={form.technologies} onChange={v => setForm({ ...form, technologies: v })} placeholder="React, Node.js, MongoDB" />
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">حالة المنتج:</span>
            <button
              onClick={() => setForm({ ...form, isActive: !form.isActive })}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                form.isActive ? 'bg-green-500/20 text-green-400 border-green-500' : 'bg-gray-700 text-gray-400 border-gray-600'
              } border`}
            >
              {form.isActive ? '✅ مفعّل' : '⏸️ معطّل'}
            </button>
          </div>
          
          <div className="flex gap-3">
            <button onClick={handleSave} className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-l from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all">
              {editing ? '💾 تحديث' : '➕ إضافة'}
            </button>
            {editing && <button onClick={resetForm} className="py-3 px-6 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors">إلغاء</button>}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className={`rounded-2xl bg-gray-800/50 border border-gray-700/50 overflow-hidden ${!product.isActive ? 'opacity-50' : ''}`}>
            {product.image ? (
              <img src={product.image} alt="" className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center text-4xl">📦</div>
            )}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold">{product.name}</h4>
                <span className="text-lg font-bold text-green-400">${product.price}</span>
              </div>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(product)} className="flex-1 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium">
                  ✏️ تعديل
                </button>
                <button onClick={() => handleDelete(product.id)} className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium">
                  🗑️ حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Portfolio Tab
function PortfolioTab({ showNotification }: { showNotification: (t: string, m: string) => void }) {
  const [items, setItems] = useState<PortfolioItem[]>(db.getPortfolio());
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState({ title: '', description: '', category: '', image: '', url: '', technologies: '', client: '' });

  const handleSave = () => {
    const data = {
      title: form.title, description: form.description, category: form.category,
      image: form.image, url: form.url,
      technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
      client: form.client,
    };

    if (editing) {
      db.updatePortfolioItem(editing.id, data);
      showNotification('success', 'تم تحديث العمل بنجاح');
    } else {
      db.addPortfolioItem(data);
      showNotification('success', 'تم إضافة العمل بنجاح');
    }
    setItems(db.getPortfolio());
    resetForm();
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ title: '', description: '', category: '', image: '', url: '', technologies: '', client: '' });
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditing(item);
    setForm({
      title: item.title, description: item.description, category: item.category,
      image: item.image, url: item.url, technologies: item.technologies.join(', '), client: item.client,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العمل؟')) {
      db.deletePortfolioItem(id);
      setItems(db.getPortfolio());
      showNotification('success', 'تم حذف العمل');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50 max-w-4xl">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          {editing ? <><span>✏️</span> تعديل العمل</> : <><span>➕</span> إضافة عمل جديد</>}
        </h3>
        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <FormField label="عنوان المشروع" value={form.title} onChange={v => setForm({ ...form, title: v })} />
            <FormField label="التصنيف" value={form.category} onChange={v => setForm({ ...form, category: v })} placeholder="مواقع ويب, تطبيقات موبايل" />
          </div>
          <FormField label="الوصف" value={form.description} onChange={v => setForm({ ...form, description: v })} textarea />
          <ImageUpload label="صورة المشروع" value={form.image} onChange={v => setForm({ ...form, image: v })} />
          <div className="grid md:grid-cols-2 gap-5">
            <FormField label="رابط المشروع" value={form.url} onChange={v => setForm({ ...form, url: v })} />
            <FormField label="اسم العميل" value={form.client} onChange={v => setForm({ ...form, client: v })} />
          </div>
          <FormField label="التقنيات (مفصولة بفواصل)" value={form.technologies} onChange={v => setForm({ ...form, technologies: v })} />
          <div className="flex gap-3">
            <button onClick={handleSave} className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-l from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all">
              {editing ? '💾 تحديث' : '➕ إضافة'}
            </button>
            {editing && <button onClick={resetForm} className="py-3 px-6 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors">إلغاء</button>}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="rounded-2xl bg-gray-800/50 border border-gray-700/50 overflow-hidden">
            {item.image ? (
              <img src={item.image} alt="" className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center text-4xl">💼</div>
            )}
            <div className="p-4">
              <h4 className="font-bold mb-1">{item.title}</h4>
              <p className="text-gray-400 text-xs mb-3">{item.category} • {item.client}</p>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="flex-1 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium">✏️</button>
                <button onClick={() => handleDelete(item.id)} className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium">🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Team Tab
function TeamTab({ showNotification }: { showNotification: (t: string, m: string) => void }) {
  const [team, setTeam] = useState<TeamMember[]>(db.getTeam());
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState({ name: '', role: '', image: '', bio: '' });

  const handleSave = () => {
    const data = { name: form.name, role: form.role, image: form.image, bio: form.bio, social: {} };

    if (editing) {
      db.updateTeamMember(editing.id, data);
      showNotification('success', 'تم تحديث عضو الفريق بنجاح');
    } else {
      db.addTeamMember(data);
      showNotification('success', 'تم إضافة عضو الفريق بنجاح');
    }
    setTeam(db.getTeam());
    resetForm();
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', role: '', image: '', bio: '' });
  };

  const handleEdit = (member: TeamMember) => {
    setEditing(member);
    setForm({ name: member.name, role: member.role, image: member.image, bio: member.bio });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العضو؟')) {
      db.deleteTeamMember(id);
      setTeam(db.getTeam());
      showNotification('success', 'تم حذف عضو الفريق');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50 max-w-4xl">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          {editing ? <><span>✏️</span> تعديل العضو</> : <><span>➕</span> إضافة عضو جديد</>}
        </h3>
        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <FormField label="الاسم" value={form.name} onChange={v => setForm({ ...form, name: v })} />
            <FormField label="المنصب" value={form.role} onChange={v => setForm({ ...form, role: v })} />
          </div>
          <ImageUpload label="الصورة الشخصية" value={form.image} onChange={v => setForm({ ...form, image: v })} />
          <FormField label="نبذة" value={form.bio} onChange={v => setForm({ ...form, bio: v })} textarea />
          <div className="flex gap-3">
            <button onClick={handleSave} className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-l from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all">
              {editing ? '💾 تحديث' : '➕ إضافة'}
            </button>
            {editing && <button onClick={resetForm} className="py-3 px-6 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors">إلغاء</button>}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {team.map(member => (
          <div key={member.id} className="p-5 rounded-2xl bg-gray-800/50 border border-gray-700/50 text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden bg-gray-700 flex items-center justify-center text-3xl border-2 border-gray-600">
              {member.image ? <img src={member.image} alt="" className="w-full h-full object-cover" /> : '👤'}
            </div>
            <h4 className="font-bold">{member.name}</h4>
            <p className="text-gray-400 text-sm mb-4">{member.role}</p>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(member)} className="flex-1 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm">✏️</button>
              <button onClick={() => handleDelete(member.id)} className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Testimonials Tab
function TestimonialsTab({ showNotification }: { showNotification: (t: string, m: string) => void }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(db.getTestimonials());
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ name: '', role: '', company: '', image: '', text: '', rating: 5 });

  const handleSave = () => {
    if (editing) {
      db.updateTestimonial(editing.id, form);
      showNotification('success', 'تم تحديث الرأي بنجاح');
    } else {
      db.addTestimonial(form);
      showNotification('success', 'تم إضافة الرأي بنجاح');
    }
    setTestimonials(db.getTestimonials());
    resetForm();
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', role: '', company: '', image: '', text: '', rating: 5 });
  };

  const handleEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ name: t.name, role: t.role, company: t.company, image: t.image, text: t.text, rating: t.rating });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الرأي؟')) {
      db.deleteTestimonial(id);
      setTestimonials(db.getTestimonials());
      showNotification('success', 'تم حذف الرأي');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50 max-w-4xl">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          {editing ? <><span>✏️</span> تعديل الرأي</> : <><span>➕</span> إضافة رأي جديد</>}
        </h3>
        <div className="space-y-5">
          <div className="grid md:grid-cols-3 gap-5">
            <FormField label="الاسم" value={form.name} onChange={v => setForm({ ...form, name: v })} />
            <FormField label="المنصب" value={form.role} onChange={v => setForm({ ...form, role: v })} />
            <FormField label="الشركة" value={form.company} onChange={v => setForm({ ...form, company: v })} />
          </div>
          <ImageUpload label="الصورة" value={form.image} onChange={v => setForm({ ...form, image: v })} />
          <FormField label="نص الرأي" value={form.text} onChange={v => setForm({ ...form, text: v })} textarea rows={4} />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">التقييم</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setForm({ ...form, rating: star })}
                  className={`text-3xl transition-transform hover:scale-110 ${star <= form.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-l from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all">
              {editing ? '💾 تحديث' : '➕ إضافة'}
            </button>
            {editing && <button onClick={resetForm} className="py-3 px-6 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors">إلغاء</button>}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map(t => (
          <div key={t.id} className="p-5 rounded-2xl bg-gray-800/50 border border-gray-700/50">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-lg ${i < t.rating ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
              ))}
            </div>
            <p className="text-gray-300 text-sm mb-4 line-clamp-3">"{t.text}"</p>
            <p className="text-sm font-medium">{t.name}</p>
            <p className="text-xs text-gray-500">{t.role} - {t.company}</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => handleEdit(t)} className="flex-1 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm">✏️</button>
              <button onClick={() => handleDelete(t.id)} className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Messages Tab
function MessagesTab({ showNotification }: { showNotification: (t: string, m: string) => void }) {
  const [messages, setMessages] = useState<ContactMessage[]>(db.getMessages());
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const handleRead = (msg: ContactMessage) => {
    db.markMessageRead(msg.id);
    setMessages(db.getMessages());
    setSelected(msg);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      db.deleteMessage(id);
      setMessages(db.getMessages());
      setSelected(null);
      showNotification('success', 'تم حذف الرسالة');
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Messages List */}
      <div className="lg:col-span-1 space-y-3">
        <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 text-center">
          <span className="text-sm text-gray-400">📬 إجمالي الرسائل: {messages.length}</span>
        </div>
        
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="p-8 rounded-xl bg-gray-800/50 border border-gray-700/50 text-center">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-400">لا توجد رسائل بعد</p>
            </div>
          ) : (
            [...messages].reverse().map(msg => (
              <button
                key={msg.id}
                onClick={() => handleRead(msg)}
                className={`w-full text-right p-4 rounded-xl border transition-all ${
                  selected?.id === msg.id
                    ? 'bg-blue-500/20 border-blue-500/50'
                    : msg.isRead
                      ? 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50'
                      : 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{msg.name}</span>
                  {!msg.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                </div>
                <p className="text-gray-400 text-xs truncate">{msg.subject}</p>
                <p className="text-gray-500 text-xs mt-1">{new Date(msg.date).toLocaleDateString('ar-EG')}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className="lg:col-span-2">
        {selected ? (
          <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50">
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-700">
              <div>
                <h3 className="font-bold text-xl mb-2">{selected.subject}</h3>
                <p className="text-gray-400 text-sm">📧 من: {selected.name}</p>
                <p className="text-gray-400 text-sm">✉️ البريد: {selected.email}</p>
                {selected.phone && <p className="text-gray-400 text-sm">📞 الهاتف: {selected.phone}</p>}
              </div>
              <div className="flex gap-2">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors font-medium"
                >
                  ↩️ رد
                </a>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium"
                >
                  🗑️ حذف
                </button>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>
            <div className="mt-4 text-xs text-gray-500 text-left">
              📅 {new Date(selected.date).toLocaleString('ar-EG')}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-12 rounded-2xl bg-gray-800/50 border border-gray-700/50">
            <div className="text-center">
              <p className="text-6xl mb-4">📬</p>
              <p className="text-gray-400 text-lg">اختر رسالة لعرض تفاصيلها</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Media Manager Tab - لإدارة الصور واللوجو
function MediaTab({ showNotification }: { showNotification: (t: string, m: string) => void }) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(db.getUploadedFiles());
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const base64 = await fileToBase64(file);
        const uploadedFile: Omit<UploadedFile, 'id' | 'uploadDate'> = {
          name: fileName || file.name,
          type: file.type,
          size: file.size,
          url: base64,
        };
        const result = await db.addUploadedFile(uploadedFile);
        setUploadedFiles(db.getUploadedFiles());
        setFileName('');
        showNotification('success', `تم رفع ${file.name} بنجاح`);
      } catch (error) {
        showNotification('error', 'حدث خطأ أثناء رفع الملف');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      db.deleteUploadedFile(id);
      setUploadedFiles(db.getUploadedFiles());
      showNotification('success', 'تم حذف الصورة');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    showNotification('success', 'تم نسخ الرابط');
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50 max-w-4xl">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <span>📤</span> رفع الصور واللوجو
        </h3>
        
        <div className="space-y-4">
          <FormField 
            label="اسم الصورة (اختياري)" 
            value={fileName} 
            onChange={setFileName} 
            placeholder="مثال: شعار الموقع، صورة البانر..." 
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">اختر الصورة</label>
            <label className="block w-full py-8 px-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-dashed border-blue-500/50 hover:border-blue-400 cursor-pointer transition-all hover:bg-blue-500/5">
              <div className="text-center">
                <div className="text-5xl mb-3">🖼️</div>
                <p className="text-gray-300 font-medium">اسحب الصورة هنا أو اضغط للاختيار</p>
                <p className="text-gray-500 text-sm mt-1">الصيغ المدعومة: JPG, PNG, GIF, WebP</p>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                disabled={uploading}
                className="hidden" 
              />
            </label>
          </div>

          {uploading && (
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center gap-3">
              <div className="animate-spin">⏳</div>
              <span className="text-blue-300">جاري رفع الصورة...</span>
            </div>
          )}
        </div>
      </div>

      {/* Images Gallery */}
      <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <span>🎞️</span> الصور المرفوعة ({uploadedFiles.length})
        </h3>

        {uploadedFiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-6xl mb-3">📁</p>
            <p className="text-gray-400">لم تقم برفع أي صور بعد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map(file => (
              <div key={file.id} className="rounded-xl bg-gray-700/30 border border-gray-600 overflow-hidden hover:border-blue-500 transition-all">
                {/* Image Preview */}
                {file.type.startsWith('image/') && (
                  <img 
                    src={file.url} 
                    alt={file.name} 
                    className="w-full h-32 object-cover" 
                  />
                )}
                
                {/* File Info */}
                <div className="p-4">
                  <p className="font-medium text-white truncate mb-2">{file.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                    <span>📊 {(file.size / 1024).toFixed(2)} KB</span>
                    <span>📅 {new Date(file.uploadDate).toLocaleDateString('ar-EG')}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(file.url)}
                      className="flex-1 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium"
                      title="نسخ رابط الصورة"
                    >
                      📋 نسخ
                    </button>
                    <a
                      href={file.url}
                      download={file.name}
                      className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-sm font-medium text-center"
                      title="تحميل الصورة"
                    >
                      ⬇️ تحميل
                    </a>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium"
                      title="حذف الصورة"
                    >
                      🗑️ حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>📋</span> نصائح استخدام الصور
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-lg bg-gray-700/30 border border-gray-600">
            <p className="font-medium text-blue-300 mb-2">✅ اللوجو</p>
            <p className="text-gray-400">استخدم صور بصيغة PNG أو SVG بخلفية شفافة للحصول على أفضل النتائج</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-700/30 border border-gray-600">
            <p className="font-medium text-green-300 mb-2">✅ صور البانر</p>
            <p className="text-gray-400">استخدم صور بحجم 1920×600 على الأقل للحصول على جودة عالية</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-700/30 border border-gray-600">
            <p className="font-medium text-purple-300 mb-2">✅ حجم الملف</p>
            <p className="text-gray-400">حاول أن لا يتجاوز حجم الصورة 5MB لتسريع التحميل</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-700/30 border border-gray-600">
            <p className="font-medium text-orange-300 mb-2">✅ صيغ موصى بها</p>
            <p className="text-gray-400">استخدم JPG للصور العادية و PNG للصور التي تحتاج شفافية</p>
          </div>
        </div>
      </div>
    </div>
  );
      </div>
    </div>
  );
}

// Files Tab
function FilesTab({ showNotification }: { showNotification: (t: string, m: string) => void }) {
  const [files, setFiles] = useState<UploadedFile[]>(db.getUploadedFiles());

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const base64 = await fileToBase64(file);
      db.addUploadedFile({
        name: file.name,
        type: file.type,
        size: file.size,
        url: base64,
      });
    }
    setFiles(db.getUploadedFiles());
    showNotification('success', `تم رفع ${fileList.length} ملف بنجاح`);
    e.target.value = '';
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الملف؟')) {
      db.deleteUploadedFile(id);
      setFiles(db.getUploadedFiles());
      showNotification('success', 'تم حذف الملف');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showNotification('success', 'تم نسخ الرابط إلى الحافظة');
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <label className="block p-10 rounded-2xl bg-gray-800/50 border-2 border-dashed border-gray-600 hover:border-blue-500 hover:bg-gray-800 transition-all cursor-pointer text-center">
        <div className="text-5xl mb-3">📁</div>
        <h3 className="text-xl font-bold mb-2">رفع ملفات جديدة</h3>
        <p className="text-gray-400 text-sm mb-4">اسحب الملفات هنا أو انقر للاختيار</p>
        <div className="inline-block px-6 py-3 rounded-xl text-white font-medium bg-gradient-to-l from-blue-600 to-purple-600">
          اختر الملفات
        </div>
        <input type="file" multiple onChange={handleUpload} className="hidden" accept="image/*,.pdf,.doc,.docx,.txt,.zip" />
      </label>

      {/* Files Grid */}
      {files.length === 0 ? (
        <div className="p-10 rounded-2xl bg-gray-800/50 border border-gray-700/50 text-center">
          <p className="text-4xl mb-3">📂</p>
          <p className="text-gray-400">لا توجد ملفات مرفوعة بعد</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map(file => (
            <div key={file.id} className="p-4 rounded-2xl bg-gray-800/50 border border-gray-700/50">
              {file.type.startsWith('image/') ? (
                <img src={file.url} alt={file.name} className="w-full h-36 object-cover rounded-xl mb-3" />
              ) : (
                <div className="w-full h-36 rounded-xl mb-3 flex items-center justify-center bg-gray-700/50 text-5xl">
                  {file.type.includes('pdf') ? '📄' : file.type.includes('zip') ? '📦' : '📁'}
                </div>
              )}
              <h4 className="text-sm font-medium truncate mb-1">{file.name}</h4>
              <p className="text-xs text-gray-500 mb-3">
                {formatSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString('ar-EG')}
              </p>
              <div className="flex gap-2">
                <button onClick={() => copyUrl(file.url)} className="flex-1 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium">
                  📋 نسخ
                </button>
                <button onClick={() => handleDelete(file.id)} className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium">
                  🗑️ حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


