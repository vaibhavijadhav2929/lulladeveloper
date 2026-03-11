import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

const ADMIN_EMAIL = 'tblulla@gmail.com';
const ADMIN_PASSWORD = '123456';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');
    const navigate = useNavigate();

    useEffect(() => {
        const lang = document.cookie.split('; ').find(row => row.startsWith('googtrans='))?.split('=')[1]?.split('/')[2] || 'en';
        setCurrentLang(lang);
    }, []);

    const changeLanguage = (langCode) => {
        document.cookie = `googtrans=/en/${langCode}; path=/;`;
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname};`;
        window.location.reload();
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Local bypass — works without Firebase Auth configured
        if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            setTimeout(() => navigate('/admin/dashboard'), 400);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error(err);
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-dark to-gray-900 py-12 px-4 relative overflow-hidden">

            {/* Background orbs */}
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Language Toggle */}
            <div className="absolute top-6 right-6 z-50 flex items-center gap-1 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 notranslate shadow-2xl">
                <button
                    onClick={() => changeLanguage('en')}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${currentLang === 'en' ? 'bg-sky-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    ENG
                </button>
                <button
                    onClick={() => changeLanguage('mr')}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${currentLang === 'mr' ? 'bg-sky-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    MR
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

                    {/* Top banner */}
                    <div className="bg-dark px-8 pt-10 pb-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800')] bg-cover bg-center opacity-5" />
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative mx-auto w-16 h-16 bg-sky-500/20 border border-sky-500/30 rounded-2xl flex items-center justify-center mb-4 shadow-xl"
                        >
                            <Shield className="w-8 h-8 text-sky-400" />
                        </motion.div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Admin Portal</h1>
                        <p className="text-gray-400 text-sm mt-1">Lulla Estate Developer Dashboard</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition-all"
                                        placeholder=""
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-dark text-white font-black text-sm rounded-xl hover:bg-sky-500 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Authenticating...
                                    </span>
                                ) : (
                                    <>Sign In <ArrowRight className="w-4 h-4" /></>
                                )}
                            </motion.button>
                        </form>

                        <p className="text-center text-xs text-gray-400 mt-6">
                            Authorized personnel only — Lulla Estate Developer
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
