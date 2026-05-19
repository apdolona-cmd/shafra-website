import { useState, useEffect, useRef } from 'react';
import { db } from '../store/database';
import { useAppContext } from '../App';

// Icon components
const Icons: Record<string, () => React.ReactNode> = {
  globe: () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  smartphone: () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  palette: () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  database: () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  'shopping-cart': () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
  ),
  server: () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  ),
};

const getIcon = (iconName: string) => {
  const IconComponent = Icons[iconName];
  return IconComponent ? <IconComponent /> : <Icons.globe />;
};

// Intersection Observer Hook
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// Counter animation
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useInView();

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Section Header Component
function SectionHeader({ title, subtitle, color, align = 'center' }: { 
  title: string; 
  subtitle: string; 
  color: string; 
  align?: 'center' | 'right' 
}) {
  const { ref, isInView } = useInView();
  return (
    <div 
      ref={ref} 
      className={`${align === 'center' ? 'text-center' : 'text-right'} ${isInView ? 'animate-fadeInUp' : 'opacity-0'}`}
    >
      <h2 className="text-3xl md:text-4xl font-black mb-4">{title}</h2>
      <div 
        className="w-20 h-1 rounded-full mb-4"
        style={{ 
          background: `linear-gradient(90deg, ${color}, transparent)`,
          marginLeft: align === 'center' ? 'auto' : undefined,
          marginRight: align === 'center' ? 'auto' : '0',
        }} 
      />
      {subtitle && <p className="text-gray-400 text-lg max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}

export default function HomePage() {
  const { settings, dataVersion } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [contactForm, setContactForm] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [localVer, setLocalVer] = useState(0);

  // ✅ استمع للتحديثات من Firebase
  useEffect(() => {
    const unsub = db.onUpdate(() => {
      console.log('🔄 HomePage: data updated!');
      setLocalVer(v => v + 1);
    });
    return () => { unsub(); };
  }, []);

  // تحديث البيانات عند أي تغيير
  const _v = dataVersion + localVer;
  const services = db.getServices().filter(s => s.isActive);
  const products = db.getProducts().filter(p => p.isActive);
  const portfolio = db.getPortfolio();
  const testimonials = db.getTestimonials();
  const team = db.getTeam();
  const heroSlides = db.getHeroSlides();
  void _v; // prevent unused warning

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'products', 'portfolio', 'team', 'testimonials', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom > 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.addMessage(contactForm);
    setFormSubmitted(true);
    setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  const navItems = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'services', label: 'خدماتنا' },
    { id: 'products', label: 'منتجاتنا' },
    { id: 'portfolio', label: 'أعمالنا' },
    { id: 'team', label: 'فريقنا' },
    { id: 'testimonials', label: 'آراء العملاء' },
    { id: 'contact', label: 'تواصل معنا' },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const stats = [
    { number: 150, suffix: '+', label: 'مشروع مكتمل' },
    { number: 50, suffix: '+', label: 'عميل سعيد' },
    { number: 10, suffix: '+', label: 'سنوات خبرة' },
    { number: 24, suffix: '/7', label: 'دعم فني' },
  ];

  const techStack = ['React', 'Next.js', 'Node.js', 'Python', 'Flutter', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'TypeScript', 'Vue.js', 'Laravel'];

  return (
    <div className="bg-slate-900 text-white overflow-x-hidden" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Navbar */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ 
          background: 'rgba(15, 23, 42, 0.95)', 
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-xl"
                style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})` }}
              >
                {settings.siteName.charAt(0)}
              </div>
              <span className="text-xl font-bold bg-gradient-to-l from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {settings.siteName}
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeSection === item.id
                      ? 'text-white bg-white/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <a
                href="#/admin"
                className="mr-3 px-5 py-2 rounded-lg text-sm font-bold text-white transition-all duration-300 hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})` }}
              >
                لوحة التحكم
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden border-t border-white/10"
            style={{ background: 'rgba(15, 23, 42, 0.98)' }}
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="block w-full text-right px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  {item.label}
                </button>
              ))}
              <a
                href="#/admin"
                className="block w-full text-center px-4 py-3 rounded-lg text-white font-medium mt-2"
                style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})` }}
              >
                لوحة التحكم
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {heroSlides[0]?.image ? (
            <img src={heroSlides[0].image} alt="" className="w-full h-full object-cover opacity-30" />
          ) : (
            <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-10"
              style={{
                width: Math.random() * 300 + 100 + 'px',
                height: Math.random() * 300 + 100 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                background: `radial-gradient(circle, ${i % 2 === 0 ? settings.primaryColor : settings.secondaryColor}, transparent)`,
                animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: Math.random() * 2 + 's',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="animate-fadeInUp">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-gray-300">نعمل على مدار الساعة لخدمتك</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              {heroSlides[0]?.title || 'نحول أفكارك إلى'}
              <br />
              <span className="bg-gradient-to-l from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                واقع رقمي مبهر
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              {heroSlides[0]?.subtitle || settings.siteDescription}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => scrollTo('contact')}
                className="px-8 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:scale-105"
                style={{ 
                  background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                  boxShadow: `0 10px 40px ${settings.primaryColor}50`
                }}
              >
                {heroSlides[0]?.buttonText || 'ابدأ مشروعك الآن'} ←
              </button>
              <button
                onClick={() => scrollTo('portfolio')}
                className="px-8 py-4 rounded-xl font-bold text-white text-lg border-2 border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                شاهد أعمالنا
              </button>
            </div>
          </div>

          {/* Tech Stack Marquee */}
          <div className="mt-20 overflow-hidden">
            <div className="flex gap-6 animate-marquee">
              {[...techStack, ...techStack].map((tech, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 whitespace-nowrap"
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: settings.primaryColor }} />
                  <span className="text-gray-400 text-sm">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-2"
              >
                <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: settings.primaryColor }}>
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader 
            title="خدماتنا" 
            subtitle="نقدم مجموعة شاملة من الخدمات البرمجية لتلبية جميع احتياجاتك" 
            color={settings.primaryColor} 
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} settings={settings} />
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section 
        id="products" 
        className="py-20 relative"
        style={{ background: `linear-gradient(180deg, transparent, ${settings.primaryColor}08, transparent)` }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader 
            title="منتجاتنا البرمجية" 
            subtitle="حلول برمجية جاهزة وقابلة للتخصيص لمختلف القطاعات" 
            color={settings.primaryColor} 
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} settings={settings} onContact={() => scrollTo('contact')} />
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader 
            title="أعمالنا السابقة" 
            subtitle="نماذج من المشاريع التي قمنا بتنفيذها بنجاح" 
            color={settings.primaryColor} 
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {portfolio.map((item, index) => (
              <PortfolioCard key={item.id} item={item} index={index} settings={settings} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section 
        className="py-20 relative"
        style={{ background: `linear-gradient(180deg, transparent, ${settings.secondaryColor}08, transparent)` }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader 
                title="لماذا تختارنا؟" 
                subtitle="" 
                color={settings.primaryColor} 
                align="right" 
              />
              <div className="space-y-6 mt-8">
                {[
                  { icon: '🚀', title: 'أداء فائق السرعة', desc: 'نستخدم أحدث التقنيات لضمان سرعة وأداء عالي' },
                  { icon: '🔒', title: 'أمان وحماية متقدمة', desc: 'نطبق أعلى معايير الأمان لحماية بياناتك' },
                  { icon: '📱', title: 'تصميم متجاوب 100%', desc: 'جميع مشاريعنا تعمل بشكل مثالي على جميع الأجهزة' },
                  { icon: '🎯', title: 'تسليم في الموعد', desc: 'نلتزم بالمواعيد المحددة مع ضمان أعلى جودة' },
                  { icon: '💬', title: 'دعم فني مستمر', desc: 'فريق دعم فني متاح على مدار الساعة' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <img src="/images/about.jpg" alt="فريق العمل" className="w-full h-96 object-cover" />
              </div>
              <div 
                className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl flex flex-col items-center justify-center animate-float"
                style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})` }}
              >
                <span className="text-3xl font-black">10+</span>
                <span className="text-sm">سنوات خبرة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader 
            title="فريق العمل" 
            subtitle="نخبة من المطورين والمصممين المحترفين" 
            color={settings.primaryColor} 
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {team.map((member, index) => (
              <TeamCard key={member.id} member={member} index={index} settings={settings} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        id="testimonials" 
        className="py-20 relative"
        style={{ background: `linear-gradient(180deg, transparent, ${settings.primaryColor}08, transparent)` }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader 
            title="آراء عملائنا" 
            subtitle="ماذا يقول عملاؤنا عن تجربتهم معنا" 
            color={settings.primaryColor} 
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} settings={settings} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader 
            title="تواصل معنا" 
            subtitle="نحن هنا لمساعدتك في تحويل أفكارك إلى واقع" 
            color={settings.primaryColor} 
          />

          <div className="grid lg:grid-cols-2 gap-12 mt-12">
            {/* Contact Form */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              {formSubmitted ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold mb-2">تم إرسال رسالتك بنجاح!</h3>
                  <p className="text-gray-400">سنتواصل معك في أقرب وقت ممكن</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">الاسم الكامل *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500"
                        placeholder="أدخل اسمك"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">البريد الإلكتروني *</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">رقم الهاتف</label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500"
                        placeholder="+20 xxx xxx xxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">الموضوع *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.subject}
                        onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500"
                        placeholder="موضوع الرسالة"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">الرسالة *</label>
                    <textarea
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder-gray-500"
                      placeholder="اكتب رسالتك هنا..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:scale-[1.02]"
                    style={{ 
                      background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                      boxShadow: `0 10px 40px ${settings.primaryColor}30`
                    }}
                  >
                    إرسال الرسالة 📩
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-xl font-bold mb-6">📞 معلومات التواصل</h3>
                <div className="space-y-4">
                  {[
                    { icon: '📍', label: 'العنوان', value: settings.address },
                    { icon: '📞', label: 'الهاتف', value: settings.phone },
                    { icon: '✉️', label: 'البريد الإلكتروني', value: settings.email },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                        style={{ background: `${settings.primaryColor}20` }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">{item.label}</p>
                        <p className="font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-xl font-bold mb-4">🌐 تابعنا على</h3>
                <div className="flex gap-3 flex-wrap">
                  {[
                    { name: 'Facebook', url: settings.facebook, icon: 'f', bg: '#1877F2' },
                    { name: 'Twitter', url: settings.twitter, icon: '𝕏', bg: '#000' },
                    { name: 'Instagram', url: settings.instagram, icon: '📷', bg: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' },
                    { name: 'LinkedIn', url: settings.linkedin, icon: 'in', bg: '#0A66C2' },
                    { name: 'WhatsApp', url: `https://wa.me/${settings.whatsapp}`, icon: '💬', bg: '#25D366' },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold hover:scale-110 transition-transform"
                      style={{ background: social.bg }}
                      title={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 rounded-2xl text-white text-center font-bold text-lg hover:scale-[1.02] transition-transform"
                style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
              >
                💬 تواصل معنا عبر واتساب مباشرة
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-xl"
                  style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})` }}
                >
                  {settings.siteName.charAt(0)}
                </div>
                <span className="text-xl font-bold">{settings.siteName}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{settings.siteDescription}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">روابط سريعة</h4>
              <div className="space-y-2">
                {navItems.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => scrollTo(item.id)} 
                    className="block text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">تواصل معنا</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>📍 {settings.address}</p>
                <p>📞 {settings.phone}</p>
                <p>✉️ {settings.email}</p>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} {settings.siteName}. جميع الحقوق محفوظة.</p>
            <p className="mt-1">صُنع بـ ❤️ باستخدام HTML / CSS / JavaScript</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${settings.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:scale-110 transition-transform z-50"
        style={{ background: '#25D366', boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)' }}
      >
        💬
      </a>
    </div>
  );
}

// Card Components
function ServiceCard({ service, index, settings }: { service: any; index: number; settings: any }) {
  const { ref, isInView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-2 ${isInView ? 'animate-fadeInUp' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div 
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
        style={{ background: `${settings.primaryColor}20`, color: settings.primaryColor }}
      >
        {getIcon(service.icon)}
      </div>
      <h3 className="text-xl font-bold mb-3">{service.title}</h3>
      <p className="text-gray-400 mb-4 leading-relaxed text-sm">{service.description}</p>
      <div className="flex flex-wrap gap-2">
        {service.features.slice(0, 4).map((feature: string, i: number) => (
          <span key={i} className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, index, settings, onContact }: { product: any; index: number; settings: any; onContact: () => void }) {
  const { ref, isInView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`group rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:-translate-y-2 transition-all ${isInView ? 'animate-fadeInUp' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="relative h-48 overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${settings.primaryColor}40, ${settings.secondaryColor}40)` }}
          >
            <span className="text-6xl">📦</span>
          </div>
        )}
        <div 
          className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white"
          style={{ background: settings.primaryColor }}
        >
          {product.category}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">{product.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.technologies.slice(0, 4).map((tech: string, i: number) => (
            <span 
              key={i} 
              className="text-xs px-2 py-0.5 rounded-md text-gray-300"
              style={{ background: `${settings.primaryColor}20` }}
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-2xl font-black" style={{ color: settings.primaryColor }}>${product.price}</span>
          <button
            onClick={onContact}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})` }}
          >
            طلب الآن
          </button>
        </div>
      </div>
    </div>
  );
}

function PortfolioCard({ item, index, settings }: { item: any; index: number; settings: any }) {
  const { ref, isInView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl overflow-hidden hover:-translate-y-2 transition-all ${isInView ? 'animate-fadeInUp' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="relative h-64 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div 
            className="w-full h-full"
            style={{ background: `linear-gradient(135deg, ${settings.primaryColor}60, ${settings.secondaryColor}60)` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <span 
            className="inline-block px-3 py-1 rounded-full text-xs text-white mb-2"
            style={{ background: settings.primaryColor }}
          >
            {item.category}
          </span>
          <h3 className="text-lg font-bold mb-1">{item.title}</h3>
          <p className="text-gray-300 text-sm">{item.description}</p>
          <div className="flex gap-2 mt-3">
            {item.technologies.slice(0, 3).map((tech: string, i: number) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded bg-white/20 text-white">{tech}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamCard({ member, index, settings }: { member: any; index: number; settings: any }) {
  const { ref, isInView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-2 ${isInView ? 'animate-fadeInUp' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div 
        className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 flex items-center justify-center text-3xl"
        style={{ borderColor: settings.primaryColor, background: `${settings.primaryColor}20` }}
      >
        {member.image ? (
          <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          '👤'
        )}
      </div>
      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
      <p className="text-sm mb-3" style={{ color: settings.primaryColor }}>{member.role}</p>
      <p className="text-gray-400 text-sm">{member.bio}</p>
    </div>
  );
}

function TestimonialCard({ testimonial, index, settings }: { testimonial: any; index: number; settings: any }) {
  const { ref, isInView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all ${isInView ? 'animate-fadeInUp' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-lg ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
        ))}
      </div>
      <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.text}"</p>
      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-lg"
          style={{ background: `${settings.primaryColor}30` }}
        >
          {testimonial.image ? (
            <img src={testimonial.image} alt="" className="w-full h-full object-cover rounded-full" />
          ) : (
            '👤'
          )}
        </div>
        <div>
          <h4 className="font-bold text-sm">{testimonial.name}</h4>
          <p className="text-gray-500 text-xs">{testimonial.role} - {testimonial.company}</p>
        </div>
      </div>
    </div>
  );
}
