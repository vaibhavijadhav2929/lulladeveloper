import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PhoneCall, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');
    const location = useLocation();

    useEffect(() => {
        const lang = document.cookie.split('; ').find(row => row.startsWith('googtrans='))?.split('=')[1]?.split('/')[2] || 'en';
        setCurrentLang(lang);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => { setIsOpen(false); }, [location]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Projects', path: '/projects' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path) => location.pathname === path;

    const changeLanguage = (langCode) => {
        document.cookie = `googtrans=/en/${langCode}; path=/;`;
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname};`;
        window.location.reload();
    };

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-0' : 'bg-white py-1'
        } border-b border-gray-100`}>
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-18 md:h-20">

                    {/* Logo + Brand */}
                    <Link to="/" className="flex flex-shrink-0 items-center gap-2 sm:gap-3 group">
                        <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-sky-400 to-sky-600 shadow-md group-hover:shadow-sky-400/50 transition-all duration-300 group-hover:scale-105">
                            <img
                                src="/logo.png"
                                alt="TB Lulla Construction"
                                className="w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full object-cover border-2 border-white bg-white"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150?text=Logo'; }}
                            />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-black text-base sm:text-xl md:text-2xl text-dark tracking-tight">Lulla Estate</span>
                            <span className="text-sky-600 text-[10px] sm:text-xs font-bold tracking-widest uppercase hidden xs:block">Developer</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex md:items-center md:gap-1 lg:gap-2">
                        {navLinks.map((link) => (
                            <Link key={link.name} to={link.path}
                                className={`relative px-3 lg:px-4 py-2 text-sm font-semibold tracking-tight transition-colors hover:text-sky-600 ${
                                    isActive(link.path) ? 'text-sky-500' : 'text-gray-600'
                                }`}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <motion.div layoutId="navbar-indicator"
                                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-sky-500 rounded-full"
                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    />
                                )}
                            </Link>
                        ))}

                        <Link to="/contact"
                            className="ml-2 px-5 py-2.5 rounded-full text-white bg-dark hover:bg-sky-500 transition-all duration-300 font-bold text-sm shadow-md"
                        >
                            Inquire Now
                        </Link>
                        
                        {/* Desktop Language Toggle - Moved after button and styled like mobile */}
                        <div className="flex items-center gap-1.5 ml-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100 shadow-sm notranslate">
                            <button
                                onClick={() => changeLanguage('en')}
                                className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-tight transition-all ${currentLang === 'en' ? 'bg-white text-sky-600 shadow-md border border-sky-50' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                ENG
                            </button>
                            <button
                                onClick={() => changeLanguage('mr')}
                                className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-tight transition-all ${currentLang === 'mr' ? 'bg-white text-sky-600 shadow-md border border-sky-50' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                MR
                            </button>
                        </div>
                    </div>

                    {/* Mobile: Phone + Hamburger */}
                    <div className="flex items-center md:hidden gap-1">
                        <a href="tel:+12345678900" className="p-2 text-gray-500 hover:text-sky-500 transition-colors rounded-lg hover:bg-sky-50" aria-label="Call us">
                            <PhoneCall className="w-5 h-5" />
                        </a>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 rounded-xl transition-all ${isOpen ? 'bg-sky-100 text-sky-600' : 'text-gray-600 hover:bg-gray-100'}`}
                            aria-label="Toggle menu"
                        >
                            <AnimatePresence mode="wait">
                                {isOpen
                                    ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}><X className="h-6 w-6" /></motion.div>
                                    : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}><Menu className="h-6 w-6" /></motion.div>
                                }
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="md:hidden bg-white overflow-hidden border-t border-gray-100 shadow-xl"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {navLinks.map((link, idx) => (
                                <motion.div key={link.name}
                                    initial={{ x: -16, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.04 }}
                                >
                                    <Link to={link.path} onClick={() => setIsOpen(false)}
                                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-bold transition-all ${
                                            isActive(link.path) ? 'bg-sky-50 text-sky-600' : 'text-dark hover:bg-gray-50'
                                        }`}
                                    >
                                        {link.name}
                                        <ChevronRight className={`w-4 h-4 transition-transform ${isActive(link.path) ? 'opacity-100 text-sky-500' : 'opacity-0'}`} />
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="pt-3 pb-1 space-y-3">
                                <div className="flex items-center justify-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 notranslate">
                                    <button
                                        onClick={() => changeLanguage('en')}
                                        className={`flex-1 py-2 rounded-lg text-xs font-black tracking-widest transition-all ${currentLang === 'en' ? 'bg-white text-sky-600 shadow-md border border-sky-50' : 'text-gray-400'}`}
                                    >
                                        ENG
                                    </button>
                                    <button
                                        onClick={() => changeLanguage('mr')}
                                        className={`flex-1 py-2 rounded-lg text-xs font-black tracking-widest transition-all ${currentLang === 'mr' ? 'bg-white text-sky-600 shadow-md border border-sky-50' : 'text-gray-400'}`}
                                    >
                                        MR
                                    </button>
                                </div>
                                <Link to="/contact" onClick={() => setIsOpen(false)}
                                    className="block w-full text-center px-4 py-4 rounded-xl bg-dark text-white font-bold text-base shadow-lg hover:bg-sky-500 transition-all"
                                >
                                    Start Your Project
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;


