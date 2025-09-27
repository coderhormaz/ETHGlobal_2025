import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const { signUp, signIn, user } = useAuth();

  // Close modal when user is authenticated and redirect to dashboard
  useEffect(() => {
    if (user && isOpen) {
      onClose();
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }
  }, [user, isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Scroll lock and keyboard event handling
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Apply scroll lock styles
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      // Prevent scroll events
      const preventScroll = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('wheel', preventScroll, { passive: false });
      document.addEventListener('touchmove', preventScroll, { passive: false });
      
      return () => {
        // Restore scroll position and remove scroll lock
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
        
        // Remove event listeners
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('wheel', preventScroll);
        document.removeEventListener('touchmove', preventScroll);
      };
    }
  }, [isOpen, onClose]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    const newErrors: {[key: string]: string} = {};
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (mode === 'signup') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    
    try {
      if (mode === 'signup') {
        await signUp(formData.email, formData.password, formData.name);
      } else {
        await signIn(formData.email, formData.password);
      }
      
      // Reset form
      setFormData({ email: '', password: '', confirmPassword: '', name: '' });
      
    } catch (error: any) {
      console.error('Authentication error:', error);
      setErrors({ 
        general: error.message || 'An error occurred during authentication' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[9999] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ touchAction: 'none' }}
        >
          <motion.div
            className="glass-premium rounded-3xl border border-white/10 w-full max-w-md overflow-hidden relative shadow-premium"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            
            {/* Animated glow effect */}
            <div className="absolute -inset-1 bg-brand-gradient rounded-3xl blur-xl opacity-20 animate-glow-pulse"></div>
            {/* Premium Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2.5 text-gray-400 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/10 z-20 backdrop-blur-sm border border-white/5"
            >
              <X size={20} />
            </button>

            {/* Enhanced Header with Logo */}
            <div className="relative p-8 pb-6">
              {/* Premium Logo */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-brand-gradient rounded-2xl flex items-center justify-center shadow-premium border border-white/20">
                    <svg 
                      width="28" 
                      height="28" 
                      viewBox="0 0 784.37 1277.39" 
                      className="text-white drop-shadow-sm"
                      fill="currentColor"
                    >
                      <g>
                        <polygon points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "/>
                        <polygon points="392.07,0 0,650.54 392.07,882.29 392.07,472.33 "/>
                        <polygon points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "/>
                        <polygon points="392.07,1277.38 392.07,956.52 0,724.89 "/>
                        <polygon points="392.07,882.29 784.13,650.54 392.07,472.33 "/>
                        <polygon points="0,650.54 392.07,882.29 392.07,472.33 "/>
                      </g>
                    </svg>
                  </div>
                  <div className="absolute -inset-2 bg-brand-gradient rounded-2xl blur-lg opacity-30 animate-glow-pulse"></div>
                </div>
              </div>

              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-3 gradient-text-premium">
                    {mode === 'login' ? 'Welcome Back' : 'Join EthAI'}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {mode === 'login' 
                      ? 'Sign in to access your AI Trading Agent dashboard' 
                      : 'Create your account and start trading with AI intelligence'
                    }
                  </p>
                </motion.div>

                {/* Mode Toggle Tabs */}
                <div className="flex bg-black/30 rounded-xl p-1 mt-6 border border-white/10">
                  <button
                    onClick={() => setMode('login')}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                      mode === 'login' 
                        ? 'bg-white/10 text-white shadow-md border border-white/20' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setMode('signup')}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                      mode === 'signup' 
                        ? 'bg-white/10 text-white shadow-md border border-white/20' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="px-8 pb-8">
              {/* General Error */}
              {errors.general && (
                <motion.div
                  className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-red-400 text-sm">{errors.general}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={18} />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-black/40 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                        placeholder="Enter your full name"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                    )}
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: mode === 'signup' ? 0.3 : 0.2 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-black/40 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter your email"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: mode === 'signup' ? 0.4 : 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full pl-12 pr-14 py-4 bg-black/40 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                  )}
                </motion.div>

                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={18} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="w-full pl-12 pr-14 py-4 bg-black/40 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 p-1"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                  </motion.div>
                )}

                {mode === 'login' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-premium py-4 px-6 text-base font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: mode === 'signup' ? 0.6 : 0.4 }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                  
                  {/* Enhanced button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </motion.button>
              </form>

              {/* Terms */}
              {mode === 'signup' && (
                <motion.div
                  className="mt-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-xs text-gray-500 leading-relaxed">
                    By creating an account, you agree to our{' '}
                    <button className="text-blue-400 hover:text-blue-300 transition-colors underline">
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button className="text-blue-400 hover:text-blue-300 transition-colors underline">
                      Privacy Policy
                    </button>
                  </p>
                </motion.div>
              )}

              {/* Login additional info */}
              {mode === 'login' && (
                <motion.div
                  className="mt-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-xs text-gray-500">
                    Protected by enterprise-grade security
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;