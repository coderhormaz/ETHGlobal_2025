import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import TechStack from './components/TechStack';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WalletModal from './components/WalletModalBeginner';
import LearnMoreModal from './components/LearnMoreModal';
import EthereumBackground from './components/EthereumBackground';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isLearnMoreModalOpen, setIsLearnMoreModalOpen] = useState(false);

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

  const handleConnectWallet = () => {
    setIsWalletModalOpen(true);
  };

  const handleLearnMore = () => {
    setIsLearnMoreModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Global Ethereum Background Animation */}
      <div className="fixed inset-0 z-0">
        <EthereumBackground />
      </div>

      {/* Header */}
      <Header
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onConnectWallet={handleConnectWallet}
      />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <Hero
          onConnectWallet={handleConnectWallet}
          onLearnMore={handleLearnMore}
        />

        {/* About Section */}
        <About />

        {/* Tech Stack Section */}
        <TechStack />

        {/* Contact Section */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer
        scrollToSection={scrollToSection}
      />

      {/* Modals */}
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
