import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import AIDemo from './components/AIDemo';
import WalletFeatures from './components/WalletFeatures';
import TechStack from './components/TechStack';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WalletModal from './components/WalletModalBeginner';
import LearnMoreModal from './components/LearnMoreModal';
import AuthModal from './components/AuthModal';
import EthereumBackground from './components/EthereumBackground';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isLearnMoreModalOpen, setIsLearnMoreModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Native smooth scrolling with intersection observer
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Update active section based on scroll position with intersection observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    const sections = document.querySelectorAll('[id^="home"], [id^="about"], [id^="tech"], [id^="contact"]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Set loading to false after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleLearnMore = () => {
    setIsLearnMoreModalOpen(true);
  };

  const handleGetStarted = () => {
    setIsAuthModalOpen(true);
  };

  // Show loading spinner if still loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading AI Trading Agent..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-premium-mesh text-white relative overflow-hidden">
      {/* Premium Layered Background System */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-gray-950 to-black"></div>
        
        {/* Ambient light effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-float-subtle"></div>
          <div className="absolute top-1/3 right-0 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl animate-float-subtle" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-emerald-500/6 rounded-full blur-3xl animate-float-subtle" style={{animationDelay: '4s'}}></div>
        </div>
        
        {/* Premium grid overlay */}
        <div className="absolute inset-0 bg-premium-grid opacity-20"></div>
        
        {/* Ethereum background animation (enhanced) */}
        <EthereumBackground />
      </div>

      {/* Main Content with improved z-index layering */}
      <div className="relative z-10">
        {/* Enhanced Header */}
        <Header
          activeSection={activeSection}
          onNavigate={scrollToSection}
          onGetStarted={handleGetStarted}
        />

        {/* Main Content */}
        <main className="relative">
          {/* Premium Hero Section */}
          <Hero
            onConnectWallet={handleGetStarted}
            onLearnMore={handleLearnMore}
          />

          {/* Content sections with improved spacing */}
          <div className="space-y-24 pb-24">
            {/* About Section */}
            <About />

            {/* AI Demo Section */}
            <AIDemo />

            {/* Wallet Features Section */}
            <WalletFeatures />

            {/* Tech Stack Section */}
            <TechStack />

            {/* Contact Section */}
            <Contact />
          </div>
        </main>

        {/* Enhanced Footer */}
        <Footer
          scrollToSection={scrollToSection}
        />
      </div>

      {/* Premium Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />

      <LearnMoreModal
        isOpen={isLearnMoreModalOpen}
        onClose={() => setIsLearnMoreModalOpen(false)}
      />
    </div>
  );
}

export default App;
