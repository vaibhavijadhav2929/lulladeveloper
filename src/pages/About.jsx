import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Target, Eye, ShieldCheck, Award, Users, Building2,
    CheckCircle, ArrowRight, Star, Zap, Heart, Trophy, MapPin, Calendar
} from 'lucide-react';

/* ── Animated counter hook ── */
function useCounter(target, duration = 2000, inView) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!inView) return;
        const numeric = parseInt(target.replace(/\D/g, ''));
        if (!numeric) { setCount(0); return; }
        let start = 0;
        const increment = numeric / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= numeric) { setCount(numeric); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [inView, target, duration]);
    return target.replace(/\d+/, count);
}

/* ── Stat counter card (dark glass style) ── */
function StatCard({ num, label, icon, delay, inView, gradient }) {
    const displayed = useCounter(num, 2000, inView);
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay, duration: 0.7, ease: 'easeOut' }}
            whileHover={{ y: -8, scale: 1.03 }}
            className="group relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-default text-center p-6 sm:p-8"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
        >
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${gradient}`} />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl"
                style={{ boxShadow: 'inset 0 0 50px rgba(14,165,233,0.15)' }}
            />
            <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {React.cloneElement(icon, { className: 'w-6 h-6 sm:w-7 sm:h-7 text-white' })}
            </div>
            <div className={`text-3xl sm:text-5xl font-black mb-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent tabular-nums`}>{displayed}</div>
            <div className="text-white/40 font-bold uppercase tracking-widest text-[10px] sm:text-xs group-hover:text-white/70 transition-colors">{label}</div>
        </motion.div>
    );
}

/* ── Main About Page ── */
const AboutPage = () => {
    const statsRef = useRef(null);
    const statsInView = useInView(statsRef, { once: true, margin: '-80px' });

    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    const values = [
        { icon: <ShieldCheck />, title: 'Integrity', gradient: 'from-blue-500 to-sky-400', glow: 'rgba(59,130,246,0.3)', text: 'We build relationships on honesty, transparency and unwavering commitment to our word.' },
        { icon: <Zap />, title: 'Innovation', gradient: 'from-violet-500 to-purple-400', glow: 'rgba(139,92,246,0.3)', text: 'Constantly evolving our methods & materials to deliver cutting-edge construction excellence.' },
        { icon: <Trophy />, title: 'Excellence', gradient: 'from-amber-500 to-orange-400', glow: 'rgba(245,158,11,0.3)', text: 'Every project is a masterpiece — precision, quality and pride in every brick we lay.' },
        { icon: <Heart />, title: 'Client First', gradient: 'from-rose-500 to-pink-400', glow: 'rgba(244,63,94,0.3)', text: 'Your vision is our blueprint. We listen, plan, and deliver beyond your expectations.' },
    ];

    const milestones = [
        { year: '2005', event: 'Lulla Estate Developer founded with a vision of premium quality.', icon: <Building2 className="w-4 h-4" /> },
        { year: '2010', event: 'Delivered 50+ residential projects across the region.', icon: <Award className="w-4 h-4" /> },
        { year: '2015', event: 'Expanded into commercial construction & design services.', icon: <Target className="w-4 h-4" /> },
        { year: '2020', event: 'Launched real-estate plotting division with 500+ plots sold.', icon: <MapPin className="w-4 h-4" /> },
        { year: '2025', event: '15+ years strong — 500+ happy families, still growing.', icon: <Star className="w-4 h-4" /> },
    ];

    const expertise = [
        'Luxury Residential Homes', 'Commercial Complexes', 'Real Estate Plotting',
        'Interior Design', 'Architectural Planning', 'Project Management',
    ];

    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.7, delay, ease: 'easeOut' },
    });

    return (
        <div className="bg-gray-50 min-h-screen">

            {/* ════════════════════════════════════════
                HERO — dark cinematic
            ════════════════════════════════════════ */}
            <div ref={heroRef} className="relative overflow-hidden min-h-[85vh] flex items-center" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0f172a 50%, #0a0f1e 100%)' }}>

                {/* Background image overlay */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5" />
                </div>

                {/* Animated orbs */}
                <motion.div style={{ y: heroY }} className="absolute inset-0 pointer-events-none">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-1/4 left-1/4 w-80 h-80 sm:w-[500px] sm:h-[500px] rounded-full bg-sky-500/15 blur-3xl"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-violet-500/12 blur-3xl"
                    />
                    <motion.div
                        animate={{ opacity: [0.05, 0.15, 0.05] }}
                        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl"
                    />
                </motion.div>

                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
                />

                {/* Floating particles */}
                {[...Array(12)].map((_, i) => (
                    <motion.div key={i}
                        className="absolute rounded-full bg-white/20"
                        style={{ width: 2 + (i % 3), height: 2 + (i % 3), left: `${8 + i * 7.5}%`, top: `${15 + (i * 43) % 70}%` }}
                        animate={{ y: [0, -20, 0], opacity: [0.1, 0.4, 0.1] }}
                        transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
                    />
                ))}

                <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center w-full py-20">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sky-400 text-xs font-black uppercase tracking-widest mb-8"
                        style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.25)' }}
                    >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        Our Story & Heritage
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.05] tracking-tight"
                    >
                        <span className="text-white">About </span>
                        <span className="bg-gradient-to-r from-sky-400 via-blue-300 to-violet-400 bg-clip-text text-transparent italic">Lulla Estate</span>
                        <br />
                        <span className="text-white/30 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-wider">Developer</span>
                    </motion.h1>

                    <motion.div
                        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.5 }}
                        className="h-px w-32 mx-auto rounded-full mb-8"
                        style={{ background: 'linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent)' }}
                    />

                    <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.7 }}
                        className="text-white/50 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light px-2"
                    >
                        Over a decade of excellence in shaping landscapes, building landmarks, and creating homes that stand the test of time.
                    </motion.p>

                    {/* Quick stats row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }}
                        className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-12"
                    >
                        {[['50+', 'Projects'], ['15+', 'Years'], ['500+', 'Families'], ['100%', 'Quality']].map(([n, l]) => (
                            <div key={l} className="text-center">
                                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">{n}</div>
                                <div className="text-white/30 text-[10px] uppercase tracking-widest font-bold mt-0.5">{l}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
            </div>


            {/* ════════════════════════════════════════
                OUR STORY — two-column
            ════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Text */}
                    <motion.div {...fadeUp(0)}>
                        <span className="text-sky-500 font-black text-xs uppercase tracking-[0.25em] mb-3 block">Our Story</span>
                        <h2 className="text-4xl sm:text-5xl font-black text-dark mt-2 mb-6 leading-tight">
                            Building Dreams<br />
                            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">Since 2005</span>
                        </h2>
                        <div className="h-1 w-16 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full mb-6" />
                        <p className="text-gray-600 leading-relaxed mb-5 text-base sm:text-lg font-light">
                            Founded on the principles of integrity, innovation, and uncompromising quality,
                            TB Lulla Construction has grown from a modest firm into a premier real estate and
                            construction powerhouse trusted by hundreds of families.
                        </p>
                        <p className="text-gray-500 leading-relaxed mb-8 text-base font-light">
                            We specialize in creating landmarks that stand the test of time — luxury homes, prime
                            commercial spaces, and meticulous plotting layouts — ensuring every detail reflects
                            our commitment to excellence.
                        </p>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {expertise.map((skill, i) => (
                                <motion.span key={skill}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.07 }}
                                    whileHover={{ scale: 1.06 }}
                                    className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold border cursor-default transition-all"
                                    style={{ background: 'rgba(14,165,233,0.06)', borderColor: 'rgba(14,165,233,0.2)', color: '#0ea5e9' }}
                                >
                                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                                    {skill}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Image */}
                    <motion.div {...fadeUp(0.2)} className="relative">
                        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl group">
                            <img
                                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop"
                                alt="TB Lulla Construction"
                                className="w-full h-[420px] sm:h-[520px] object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Floating badge */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute bottom-6 left-6 bg-white rounded-2xl p-4 shadow-2xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Building2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-dark leading-none">50+</p>
                                        <p className="text-xs text-gray-500 font-semibold mt-0.5">Projects Delivered</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Year badge */}
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                                className="absolute top-6 right-6 bg-dark/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-xl"
                            >
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-sky-400" />
                                    <span className="text-white font-black text-sm">Est. 2005</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Decorative shapes */}
                        <div className="absolute -top-6 -right-6 w-36 h-36 rounded-3xl -z-10"
                            style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(139,92,246,0.1))', border: '2px solid rgba(14,165,233,0.15)' }}
                        />
                        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-2xl -z-10"
                            style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.12)' }}
                        />
                    </motion.div>
                </div>
            </div>


            {/* ════════════════════════════════════════
                MISSION & VISION — gradient glass cards
            ════════════════════════════════════════ */}
            <div className="py-20 sm:py-28" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0f172a 100%)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeUp()} className="text-center mb-14 sm:mb-18">
                        <span className="text-sky-400 font-black text-xs tracking-[0.25em] uppercase mb-3 block">What Drives Us</span>
                        <h2 className="text-4xl sm:text-5xl font-black text-white mt-2">Mission <span className="text-white/30">&</span> Vision</h2>
                        <div className="h-px w-20 bg-gradient-to-r from-sky-400 to-violet-400 mx-auto mt-4 rounded-full" />
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                        {[
                            { icon: <Target className="w-8 h-8" />, title: 'Our Mission', gradient: 'from-sky-500 to-blue-600', glow: 'rgba(14,165,233,0.3)',
                              text: 'To deliver superior quality construction and real-estate solutions that exceed client expectations while adhering to the highest standards of safety, sustainability, and ethics.',
                              points: ['World-class construction quality', 'Client-first approach', 'On-time delivery guarantee'] },
                            { icon: <Eye className="w-8 h-8" />, title: 'Our Vision', gradient: 'from-violet-500 to-purple-600', glow: 'rgba(139,92,246,0.3)',
                              text: 'To be the most trusted and preferred construction partner, recognized for our innovative designs, timely delivery, and transformative impact on communities.',
                              points: ['Market-leading innovation', 'Sustainable building practices', 'Community development focus'] },
                        ].map((card, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.15)}
                                whileHover={{ y: -8 }}
                                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-default p-8 sm:p-10"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
                            >
                                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${card.gradient}`} />
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl"
                                    style={{ boxShadow: `inset 0 0 80px ${card.glow}` }}
                                />
                                <div className="relative z-10">
                                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                                        {React.cloneElement(card.icon, { className: 'w-7 h-7 sm:w-8 sm:h-8 text-white' })}
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">{card.title}</h3>
                                    <p className="text-white/50 leading-relaxed mb-6 text-sm sm:text-base font-light">{card.text}</p>
                                    <ul className="space-y-3">
                                        {card.points.map((pt, j) => (
                                            <motion.li key={pt}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.15 + j * 0.1 }}
                                                className="flex items-center gap-2.5 text-white/70 text-sm font-medium"
                                            >
                                                <CheckCircle className="w-4 h-4 flex-shrink-0 text-sky-400" />
                                                {pt}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>


            {/* ════════════════════════════════════════
                CORE VALUES — glowing cards
            ════════════════════════════════════════ */}
            <div className="py-20 sm:py-28 px-4 bg-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeUp()} className="text-center mb-14 sm:mb-18 px-4">
                        <span className="text-sky-500 font-black text-xs tracking-[0.25em] uppercase mb-3 block">Our Foundation</span>
                        <h2 className="text-4xl sm:text-5xl font-black text-dark mt-2 mb-4">Core <span className="bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent">Values</span></h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed">
                            Our core values are the pillars that support every action and define who we are as a company.
                        </p>
                        <div className="h-1 w-24 bg-gradient-to-r from-sky-400 to-violet-400 mx-auto mt-6 rounded-full" />
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {values.map((v, i) => (
                            <motion.div key={v.title}
                                {...fadeUp(i * 0.12)}
                                whileHover={{ y: -14, scale: 1.02 }}
                                className="group relative bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 cursor-default border border-gray-100 flex flex-col items-center text-center overflow-hidden"
                                style={{ boxShadow: '0 4px 24px -6px rgba(0,0,0,0.06)' }}
                            >
                                {/* Glow blobs */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"
                                    style={{ background: v.glow }}
                                />
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                                    style={{ background: v.glow }}
                                />

                                {/* Icon */}
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${v.gradient} flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-400`}
                                >
                                    {React.cloneElement(v.icon, { className: 'w-8 h-8 sm:w-10 sm:h-10 text-white' })}
                                </motion.div>

                                <h3 className="text-xl sm:text-2xl font-black text-dark mb-3 group-hover:text-sky-600 transition-colors duration-300">{v.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm sm:text-base font-light">{v.text}</p>

                                {/* Animated bottom line */}
                                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-0 group-hover:w-full bg-gradient-to-r ${v.gradient} transition-all duration-700 ease-in-out rounded-full`} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>


            {/* ════════════════════════════════════════
                TIMELINE — animated alternating
            ════════════════════════════════════════ */}
            <div className="py-20 sm:py-28 bg-white overflow-hidden">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.div {...fadeUp()} className="text-center mb-14">
                        <span className="text-sky-500 font-black text-xs tracking-[0.25em] uppercase mb-3 block">Our Journey</span>
                        <h2 className="text-4xl sm:text-5xl font-black text-dark mt-2">
                            Key <span className="bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent">Milestones</span>
                        </h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-sky-400 to-violet-400 mx-auto mt-4 rounded-full" />
                    </motion.div>

                    <div className="relative">
                        {/* Vertical line */}
                        <motion.div
                            initial={{ height: 0 }}
                            whileInView={{ height: '100%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 origin-top"
                            style={{ background: 'linear-gradient(to bottom, #38bdf8, #818cf8)' }}
                        />

                        <div className="space-y-10 sm:space-y-14">
                            {milestones.map((m, i) => (
                                <motion.div key={m.year}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    className={`flex items-center gap-6 sm:gap-10 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                                >
                                    <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                        <motion.div
                                            whileHover={{ scale: 1.03, y: -4 }}
                                            className="inline-block bg-white border border-gray-100 rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-xl hover:border-sky-200 transition-all duration-300"
                                        >
                                            <div className={`flex items-center gap-2 mb-2 ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                                                <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center text-white flex-shrink-0">
                                                    {m.icon}
                                                </span>
                                                <span className="text-sky-600 font-black text-xl sm:text-2xl">{m.year}</span>
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed font-light">{m.event}</p>
                                        </motion.div>
                                    </div>

                                    {/* Centre dot */}
                                    <motion.div
                                        whileHover={{ scale: 1.4 }}
                                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex-shrink-0 z-10 shadow-lg"
                                        style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)', boxShadow: '0 0 12px rgba(56,189,248,0.5)' }}
                                    />

                                    <div className="flex-1" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>


            {/* ════════════════════════════════════════
                STATS — dark glass
            ════════════════════════════════════════ */}
            <div ref={statsRef} className="relative py-24 sm:py-32 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0f172a 100%)' }}>
                {/* Ambient glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)' }}
                />
                <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, #38bdf8 30%, #818cf8 70%, transparent)' }} />
                <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, #818cf8 30%, #38bdf8 70%, transparent)' }} />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <motion.div {...fadeUp()}>
                        <span className="text-sky-400 font-black text-xs tracking-[0.25em] uppercase mb-3 block">Numbers That Inspire</span>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mt-2 mb-14 tracking-tight">
                            Why Choose{' '}
                            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent italic">TB Lulla?</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {[
                            { num: '50+', label: 'Projects Completed', icon: <Award />, gradient: 'from-sky-500 to-blue-600' },
                            { num: '15+', label: 'Years Experience', icon: <ShieldCheck />, gradient: 'from-violet-500 to-purple-600' },
                            { num: '500+', label: 'Happy Clients', icon: <Users />, gradient: 'from-emerald-500 to-teal-500' },
                            { num: '100%', label: 'Quality Assurance', icon: <Trophy />, gradient: 'from-amber-500 to-orange-500' },
                        ].map((stat, i) => (
                            <StatCard key={stat.label} {...stat} delay={i * 0.1} inView={statsInView} />
                        ))}
                    </div>
                </div>
            </div>


            {/* ════════════════════════════════════════
                CTA BANNER
            ════════════════════════════════════════ */}
            <div className="py-20 sm:py-24 bg-white overflow-hidden relative">
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(14,165,233,0.05) 0%, transparent 70%)' }}
                />
                <div className="max-w-3xl mx-auto text-center px-4 relative z-10">
                    <motion.div {...fadeUp()}>
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(14,165,233,0.2)' }}
                        >
                            <Building2 className="w-8 h-8 text-sky-500" />
                        </motion.div>
                        <h2 className="text-4xl sm:text-5xl font-black text-dark mb-4 leading-tight">
                            Ready to Build Your{' '}
                            <span className="bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent">Dream Space?</span>
                        </h2>
                        <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                            Let's turn your vision into a landmark. Our team is ready to discuss your project.
                        </p>
                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                            <Link to="/contact"
                                className="inline-flex items-center gap-3 px-10 py-4 text-white font-black rounded-2xl text-base sm:text-lg shadow-xl transition-all"
                                style={{ background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)', boxShadow: '0 8px 30px rgba(14,165,233,0.3)' }}
                            >
                                Get In Touch <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

        </div>
    );
};

export default AboutPage;
