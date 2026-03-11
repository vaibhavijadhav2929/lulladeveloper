import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    MessageSquare, LogOut, Bell, LayoutDashboard,
    FolderKanban, ArrowRight, CheckCircle
} from 'lucide-react';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { db } from '../firebase/firebaseConfig';

const Dashboard = () => {
    const navigate = useNavigate();
    const [newEnquiries, setNewEnquiries] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');

    useEffect(() => {
        const lang = document.cookie.split('; ').find(row => row.startsWith('googtrans='))?.split('=')[1]?.split('/')[2] || 'en';
        setCurrentLang(lang);
    }, []);

    const changeLanguage = (langCode) => {
        document.cookie = `googtrans=/en/${langCode}; path=/;`;
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname};`;
        window.location.reload();
    };

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const snap = await get(ref(db, 'enquiries'));
                if (snap.exists()) {
                    const data = snap.val();
                    const count = Object.values(data).filter(e => e.status === 'New').length;
                    setNewEnquiries(count);
                }
            } catch (err) {
                console.error('Error fetching enquiry count:', err);
            }
        };
        fetchCounts();
    }, []);

    const handleLogout = async () => {
        try { await signOut(auth); } catch (_) { }
        navigate('/admin');
    };

    const sidebarLinks = [
        { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, exact: true },
        { to: '/admin/projects', label: 'Manage Projects', icon: <FolderKanban className="w-4 h-4" /> },
        { to: '/admin/enquiries', label: 'Enquiries', icon: <MessageSquare className="w-4 h-4" />, badge: newEnquiries },
    ];

    const quickCards = [
        {
            title: 'Manage Projects',
            desc: 'Add, edit, or delete your construction projects. Upload images and set project details.',
            link: '/admin/projects',
            icon: <FolderKanban className="w-7 h-7 sm:w-8 sm:h-8" />,
            gradient: 'from-sky-500 to-blue-600',
            cta: 'Go to Projects',
        },
        {
            title: 'Enquiries',
            desc: `${newEnquiries > 0 ? `You have ${newEnquiries} new enquir${newEnquiries > 1 ? 'ies' : 'y'} from the website.` : 'View and respond to customer enquiries from the website.'}`,
            link: '/admin/enquiries',
            icon: <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8" />,
            gradient: newEnquiries > 0 ? 'from-amber-500 to-orange-600' : 'from-slate-500 to-gray-700',
            cta: 'View Enquiries',
            badge: newEnquiries,
        },
    ];

    const SidebarContent = () => (
        <>
            <div className="p-5 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="p-0.5 rounded-full bg-gradient-to-tr from-sky-400 to-sky-600 flex-shrink-0">
                        <img src="/logo.png" alt="Logo" className="w-9 h-9 rounded-full object-cover border-2 border-dark" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white tracking-tight">Admin Panel</h2>
                        <p className="text-sky-400 text-[10px] font-bold uppercase tracking-widest">Lulla Estate Developer</p>
                    </div>
                </div>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
                {sidebarLinks.map((link) => {
                    const isActive = link.exact
                        ? window.location.pathname === link.to
                        : window.location.pathname.startsWith(link.to);
                    return (
                        <Link key={link.to} to={link.to}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-sky-500/20 text-sky-400 border border-sky-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <span className="flex items-center gap-2.5">{link.icon} {link.label}</span>
                            {link.badge > 0 && (
                                <span className="bg-amber-400 text-dark text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                    {link.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-3 border-t border-gray-800">
                <button onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
                >
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* ── Desktop Sidebar ── */}
            <aside className="w-60 bg-dark text-white hidden md:flex flex-col border-r border-gray-800 flex-shrink-0">
                <SidebarContent />
            </aside>

            {/* ── Mobile Sidebar Overlay ── */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <motion.aside
                        initial={{ x: -260 }}
                        animate={{ x: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="absolute left-0 top-0 bottom-0 w-64 bg-dark text-white flex flex-col border-r border-gray-800 z-50 shadow-2xl"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <SidebarContent />
                    </motion.aside>
                </div>
            )}

            {/* ── Main Content ── */}
            <main className="flex-1 overflow-auto min-w-0">

                {/* Top Bar */}
                <header className="bg-white border-b border-gray-100 shadow-sm h-14 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        {/* Hamburger — mobile only */}
                        <button
                            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open menu"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-base sm:text-lg font-black text-dark">Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        {newEnquiries > 0 && (
                            <Link to="/admin/enquiries"
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors animate-pulse"
                            >
                                <Bell className="w-3.5 h-3.5" /> {newEnquiries} New Enquir{newEnquiries > 1 ? 'ies' : 'y'}
                            </Link>
                        )}
                        {newEnquiries > 0 && (
                            <Link to="/admin/enquiries"
                                className="flex sm:hidden items-center gap-1 px-2 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold hover:bg-amber-100"
                            >
                                <Bell className="w-3.5 h-3.5" />
                                <span className="bg-amber-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">{newEnquiries}</span>
                            </Link>
                        )}

                        {/* Admin Language Toggle */}
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 notranslate ml-1 sm:ml-2 scale-90 sm:scale-100">
                            <button
                                onClick={() => changeLanguage('en')}
                                className={`px-2 py-1 rounded-lg text-[9px] font-black tracking-widest transition-all ${currentLang === 'en' ? 'bg-white text-sky-600 shadow-sm border border-sky-50' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                ENG
                            </button>
                            <button
                                onClick={() => changeLanguage('mr')}
                                className={`px-2 py-1 rounded-lg text-[9px] font-black tracking-widest transition-all ${currentLang === 'mr' ? 'bg-white text-sky-600 shadow-sm border border-sky-50' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                MR
                            </button>
                        </div>

                        <button onClick={handleLogout}
                            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </header>

                <div className="p-4 sm:p-8 max-w-5xl mx-auto">

                    {/* Welcome */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-7">
                        <h2 className="text-xl sm:text-2xl font-black text-dark">Welcome back, Admin! 👋</h2>
                        <p className="text-gray-500 text-sm mt-1">Here's a quick overview of your Lulla Estate Developer admin panel.</p>
                    </motion.div>

                    {/* Section Heading */}
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">Quick Actions</h3>

                    {/* Action Cards */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8"
                    >
                        {quickCards.map((card, i) => (
                            <Link key={i} to={card.link}
                                className={`relative group block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br ${card.gradient}`}
                            >
                                {/* Decorative circle */}
                                <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-700" />
                                <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/5 group-hover:scale-150 transition-transform duration-700" />

                                <div className="relative p-5 sm:p-7 flex flex-col h-full min-h-[160px]">
                                    {card.badge > 0 && (
                                        <span className="absolute top-4 right-4 bg-white text-orange-600 font-black text-sm w-7 h-7 rounded-full flex items-center justify-center shadow-md">
                                            {card.badge}
                                        </span>
                                    )}
                                    <div className="text-white/80 mb-3 sm:mb-4">{card.icon}</div>
                                    <h3 className="text-lg sm:text-xl font-black text-white mb-1 sm:mb-2">{card.title}</h3>
                                    <p className="text-white/70 text-sm leading-relaxed mb-4 sm:mb-5 flex-grow">{card.desc}</p>
                                    <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                                        {card.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </motion.div>



                </div>
            </main>
        </div>
    );
};

export default Dashboard;
