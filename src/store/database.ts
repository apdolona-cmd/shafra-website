// ✅ Firebase Realtime Database - قاعدة بيانات سحابية حقيقية
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

// ✅ إعدادات Firebase الخاصة بك
const firebaseConfig = {
  apiKey: "AIzaSyABiLZJ_cJES8mflYJxM5C2bWZiDz5IFy8",
  authDomain: "shafr-2235e.firebaseapp.com",
  databaseURL: "https://shafr-2235e-default-rtdb.firebaseio.com",
  projectId: "shafr-2235e",
  storageBucket: "shafr-2235e.firebasestorage.app",
  messagingSenderId: "796560487873",
  appId: "1:796560487873:web:3c6e50fb433bcdb458ab40"
};

// Types
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo: string;
  phone: string;
  email: string;
  address: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  whatsapp: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  image: string;
  features: string[];
  technologies: string[];
  demoUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  isActive: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  social: { facebook?: string; twitter?: string; linkedin?: string };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  text: string;
  rating: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  url: string;
  technologies: string[];
  client: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadDate: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Generate unique ID
const generateId = (): string => Date.now().toString(36) + Math.random().toString(36).substr(2);

// البيانات الافتراضية
const DEFAULTS = {
  settings: {
    siteName: 'Arena Software',
    siteDescription: 'شركة رائدة في تطوير البرمجيات ومواقع الويب',
    primaryColor: '#2563eb',
    secondaryColor: '#7c3aed',
    accentColor: '#06b6d4',
    logo: '',
    phone: '+20 114 749 7465',
    email: 'info@arenasoftware.com',
    address: 'القاهرة، مصر',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    whatsapp: '201147497465',
  } as SiteSettings,
  
  services: [
    { id: 's1', title: 'تطوير مواقع الويب', description: 'نقوم بتصميم وتطوير مواقع ويب احترافية', icon: 'globe', features: ['تصميم متجاوب', 'سرعة عالية', 'SEO محسّن'], isActive: true },
    { id: 's2', title: 'تطوير تطبيقات الموبايل', description: 'تطوير تطبيقات موبايل عالية الأداء', icon: 'smartphone', features: ['Android', 'iOS', 'React Native'], isActive: true },
    { id: 's3', title: 'تصميم واجهات المستخدم', description: 'تصميم واجهات مستخدم جذابة UX/UI', icon: 'palette', features: ['تصميم حديث', 'سهل الاستخدام'], isActive: true },
    { id: 's4', title: 'التجارة الإلكترونية', description: 'بناء متاجر إلكترونية متكاملة', icon: 'shopping-cart', features: ['بوابات دفع', 'إدارة مخزون'], isActive: true },
  ] as Service[],
  
  products: [
    { id: 'p1', name: 'نظام إدارة المدارس', description: 'نظام متكامل لإدارة المدارس', category: 'أنظمة إدارة', price: '5000', image: '/images/web-dev.jpg', features: ['إدارة الطلاب', 'التقارير'], technologies: ['React', 'Node.js'], demoUrl: '#', isActive: true, createdAt: new Date().toISOString() },
    { id: 'p2', name: 'متجر إلكتروني', description: 'منصة تجارة إلكترونية كاملة', category: 'تجارة إلكترونية', price: '8000', image: '/images/mobile-dev.jpg', features: ['سلة تسوق', 'دفع إلكتروني'], technologies: ['Next.js', 'Stripe'], demoUrl: '#', isActive: true, createdAt: new Date().toISOString() },
  ] as Product[],
  
  portfolio: [
    { id: 'w1', title: 'منصة تعليمية', description: 'منصة تعليمية تفاعلية', category: 'مواقع ويب', image: '/images/web-dev.jpg', url: '#', technologies: ['React', 'Node.js'], client: 'أكاديمية التعلم' },
    { id: 'w2', title: 'تطبيق توصيل', description: 'تطبيق توصيل طعام', category: 'تطبيقات موبايل', image: '/images/mobile-dev.jpg', url: '#', technologies: ['React Native'], client: 'مطاعم السعادة' },
  ] as PortfolioItem[],
  
  testimonials: [
    { id: 't1', name: 'أحمد محمد', role: 'مدير تنفيذي', company: 'شركة التقنية', image: '', text: 'عمل رائع وفريق محترف', rating: 5 },
    { id: 't2', name: 'سارة أحمد', role: 'مديرة التسويق', company: 'متجر الأناقة', image: '', text: 'تجربة ممتازة', rating: 5 },
  ] as Testimonial[],
  
  team: [
    { id: 'm1', name: 'محمد أحمد', role: 'المدير التنفيذي', image: '', bio: 'خبرة 10 سنوات', social: {} },
    { id: 'm2', name: 'أحمد خالد', role: 'مطور', image: '', bio: 'متخصص في React', social: {} },
  ] as TeamMember[],
  
  heroSlides: [
    { id: 'h1', title: 'نحول أفكارك إلى واقع رقمي', subtitle: 'شركة رائدة في تطوير البرمجيات', image: '/images/hero-bg.jpg', buttonText: 'ابدأ مشروعك', buttonLink: '#contact' },
  ] as HeroSlide[],
  
  messages: [] as ContactMessage[],
  files: [] as UploadedFile[],
};

// تحويل Object إلى Array
function toArray<T>(data: unknown): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  return Object.values(data as Record<string, T>);
}

// ✅ تهيئة Firebase
const app = initializeApp(firebaseConfig);
const firebaseDb = getDatabase(app);
console.log('✅ Firebase Connected!');

// ✅ مخزن البيانات المحلي
let DATA = { ...DEFAULTS };

// ✅ Callbacks للتحديث
const updateCallbacks: Set<() => void> = new Set();

// ✅ إعلام جميع المكونات بالتحديث
function notifyAll() {
  console.log(`🔔 Notifying ${updateCallbacks.size} listeners`);
  updateCallbacks.forEach(cb => {
    try { cb(); } catch(e) { console.error(e); }
  });
}

// ✅ الاستماع لتغييرات Firebase - كل قسم على حدة
const sections = ['settings', 'services', 'products', 'portfolio', 'testimonials', 'team', 'heroSlides', 'messages', 'files'] as const;

sections.forEach(section => {
  const sectionRef = ref(firebaseDb, section);
  onValue(sectionRef, (snapshot) => {
    if (snapshot.exists()) {
      const val = snapshot.val();
      console.log(`📡 ${section} updated from Firebase`);
      
      if (section === 'settings') {
        DATA.settings = val as SiteSettings;
      } else {
        const key = section as keyof typeof DATA;
        (DATA as any)[key] = toArray(val);
      }
      
      // أخبر React بالتحديث
      notifyAll();
    }
  });
});

// تهيئة البيانات الافتراضية إذا كانت قاعدة البيانات فارغة
const rootRef = ref(firebaseDb, '/');
onValue(rootRef, (snapshot) => {
  if (!snapshot.exists()) {
    console.log('📝 Initializing Firebase with defaults...');
    set(rootRef, DEFAULTS);
  }
}, { onlyOnce: true });

// Helper function للكتابة في Firebase
const writeToFirebase = async (path: string, data: unknown) => {
  try {
    await set(ref(firebaseDb, path), data);
  } catch (error) {
    console.error('Firebase write error:', error);
  }
};

// ✅ Database API
export const db = {
  isFirebaseConnected: () => true,
  getFirebaseConfig: () => firebaseConfig,
  saveFirebaseConfig: () => {},
  onUpdate: (cb: () => void): (() => void) => {
    updateCallbacks.add(cb);
    return () => { updateCallbacks.delete(cb); };
  },

  // Settings
  getSettings: (): SiteSettings => DATA.settings,
  updateSettings: async (s: Partial<SiteSettings>) => {
    DATA.settings = { ...DATA.settings, ...s };
    await writeToFirebase('settings', DATA.settings);
    return DATA.settings;
  },

  // Services
  getServices: (): Service[] => DATA.services,
  addService: async (s: Omit<Service, 'id'>) => {
    const n = { ...s, id: generateId() };
    DATA.services.push(n);
    await writeToFirebase('services', DATA.services);
    return n;
  },
  updateService: async (id: string, d: Partial<Service>) => {
    const i = DATA.services.findIndex(s => s.id === id);
    if (i !== -1) { DATA.services[i] = { ...DATA.services[i], ...d }; await writeToFirebase('services', DATA.services); }
  },
  deleteService: async (id: string) => {
    DATA.services = DATA.services.filter(s => s.id !== id);
    await writeToFirebase('services', DATA.services);
  },

  // Products
  getProducts: (): Product[] => DATA.products,
  addProduct: async (p: Omit<Product, 'id' | 'createdAt'>) => {
    const n = { ...p, id: generateId(), createdAt: new Date().toISOString() };
    DATA.products.push(n);
    await writeToFirebase('products', DATA.products);
    return n;
  },
  updateProduct: async (id: string, d: Partial<Product>) => {
    const i = DATA.products.findIndex(p => p.id === id);
    if (i !== -1) { DATA.products[i] = { ...DATA.products[i], ...d }; await writeToFirebase('products', DATA.products); }
  },
  deleteProduct: async (id: string) => {
    DATA.products = DATA.products.filter(p => p.id !== id);
    await writeToFirebase('products', DATA.products);
  },

  // Portfolio
  getPortfolio: (): PortfolioItem[] => DATA.portfolio,
  addPortfolioItem: async (p: Omit<PortfolioItem, 'id'>) => {
    const n = { ...p, id: generateId() };
    DATA.portfolio.push(n);
    await writeToFirebase('portfolio', DATA.portfolio);
    return n;
  },
  updatePortfolioItem: async (id: string, d: Partial<PortfolioItem>) => {
    const i = DATA.portfolio.findIndex(p => p.id === id);
    if (i !== -1) { DATA.portfolio[i] = { ...DATA.portfolio[i], ...d }; await writeToFirebase('portfolio', DATA.portfolio); }
  },
  deletePortfolioItem: async (id: string) => {
    DATA.portfolio = DATA.portfolio.filter(p => p.id !== id);
    await writeToFirebase('portfolio', DATA.portfolio);
  },

  // Testimonials
  getTestimonials: (): Testimonial[] => DATA.testimonials,
  addTestimonial: async (t: Omit<Testimonial, 'id'>) => {
    const n = { ...t, id: generateId() };
    DATA.testimonials.push(n);
    await writeToFirebase('testimonials', DATA.testimonials);
    return n;
  },
  updateTestimonial: async (id: string, d: Partial<Testimonial>) => {
    const i = DATA.testimonials.findIndex(t => t.id === id);
    if (i !== -1) { DATA.testimonials[i] = { ...DATA.testimonials[i], ...d }; await writeToFirebase('testimonials', DATA.testimonials); }
  },
  deleteTestimonial: async (id: string) => {
    DATA.testimonials = DATA.testimonials.filter(t => t.id !== id);
    await writeToFirebase('testimonials', DATA.testimonials);
  },

  // Team
  getTeam: (): TeamMember[] => DATA.team,
  addTeamMember: async (m: Omit<TeamMember, 'id'>) => {
    const n = { ...m, id: generateId() };
    DATA.team.push(n);
    await writeToFirebase('team', DATA.team);
    return n;
  },
  updateTeamMember: async (id: string, d: Partial<TeamMember>) => {
    const i = DATA.team.findIndex(t => t.id === id);
    if (i !== -1) { DATA.team[i] = { ...DATA.team[i], ...d }; await writeToFirebase('team', DATA.team); }
  },
  deleteTeamMember: async (id: string) => {
    DATA.team = DATA.team.filter(t => t.id !== id);
    await writeToFirebase('team', DATA.team);
  },

  // Hero Slides
  getHeroSlides: (): HeroSlide[] => DATA.heroSlides,
  addHeroSlide: async (s: Omit<HeroSlide, 'id'>) => {
    const n = { ...s, id: generateId() };
    DATA.heroSlides.push(n);
    await writeToFirebase('heroSlides', DATA.heroSlides);
    return n;
  },
  updateHeroSlide: async (id: string, d: Partial<HeroSlide>) => {
    const i = DATA.heroSlides.findIndex(s => s.id === id);
    if (i !== -1) { DATA.heroSlides[i] = { ...DATA.heroSlides[i], ...d }; await writeToFirebase('heroSlides', DATA.heroSlides); }
  },
  deleteHeroSlide: async (id: string) => {
    DATA.heroSlides = DATA.heroSlides.filter(s => s.id !== id);
    await writeToFirebase('heroSlides', DATA.heroSlides);
  },

  // Messages
  getMessages: (): ContactMessage[] => DATA.messages,
  addMessage: async (m: Omit<ContactMessage, 'id' | 'date' | 'isRead'>) => {
    const n = { ...m, id: generateId(), date: new Date().toISOString(), isRead: false };
    DATA.messages.push(n);
    await writeToFirebase('messages', DATA.messages);
    return n;
  },
  markMessageRead: async (id: string) => {
    const i = DATA.messages.findIndex(m => m.id === id);
    if (i !== -1) { DATA.messages[i].isRead = true; await writeToFirebase('messages', DATA.messages); }
  },
  deleteMessage: async (id: string) => {
    DATA.messages = DATA.messages.filter(m => m.id !== id);
    await writeToFirebase('messages', DATA.messages);
  },

  // Files
  getUploadedFiles: (): UploadedFile[] => DATA.files,
  addUploadedFile: async (f: Omit<UploadedFile, 'id' | 'uploadDate'>) => {
    const n = { ...f, id: generateId(), uploadDate: new Date().toISOString() };
    DATA.files.push(n);
    await writeToFirebase('files', DATA.files);
    return n;
  },
  deleteUploadedFile: async (id: string) => {
    DATA.files = DATA.files.filter(f => f.id !== id);
    await writeToFirebase('files', DATA.files);
  },

  // Auth
  validateAdmin: (p: string) => p === '01147497465',
  isLoggedIn: () => sessionStorage.getItem('arena_admin_logged') === 'true',
  login: (p: string) => { if (p === '01147497465') { sessionStorage.setItem('arena_admin_logged', 'true'); return true; } return false; },
  logout: () => sessionStorage.removeItem('arena_admin_logged'),

  // Stats
  getStats: () => ({
    products: DATA.products.length,
    services: DATA.services.length,
    portfolio: DATA.portfolio.length,
    messages: DATA.messages.length,
    unreadMessages: DATA.messages.filter(m => !m.isRead).length,
    team: DATA.team.length,
    testimonials: DATA.testimonials.length,
    files: DATA.files.length,
  }),
};
