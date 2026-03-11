import React from 'react';
import { Link } from 'react-router-dom';
import {
    Facebook, Twitter, Instagram, Linkedin,
    MapPin, Phone, Mail,
    ChevronRight, ArrowUpRight, Heart, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    const quickLinks = [
        { label: 'About Us', to: '/about' },
        { label: 'Our Projects', to: '/projects' },
        { label: 'Contact Us', to: '/contact' },
    ];

    const services = [
        { label: 'Residential Construction', to: '/projects' },
        { label: 'Commercial Projects', to: '/projects' },
        { label: 'Real Estate Consultation', to: '/contact' },
    ];

    const socials = [
        { icon: <Facebook className="w-4 h-4" />, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
        { icon: <Twitter className="w-4 h-4" />, href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
        { icon: <Instagram className="w-4 h-4" />, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
        { icon: <Linkedin className="w-4 h-4" />, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-700' },
    ];

    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5, delay, ease: 'easeOut' },
    });

    return (
        <footer className="relative overflow-hidden bg-dark text-white">

            {/* ── Decorative animated blobs ── */}
            <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000')] bg-cover bg-center opacity-[0.03] pointer-events-none" />

            {/* ── Top accent line ── */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-500 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8">

                {/* ── Main CTA Banner ── */}
                <motion.div
                    {...fadeUp()}
                    className="mb-12 sm:mb-16 p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-sky-500/20 to-blue-600/10 border border-sky-500/20 text-center"
                >
                    <p className="text-gray-400 text-xs sm:text-sm tracking-widest uppercase mb-2">Ready to build?</p>
                    <h3 className="text-2xl sm:text-3xl font-serif font-light text-white mb-4">
                        Turn your vision into <span className="italic text-sky-400">reality</span>
                    </h3>
                    <Link to="/contact"
                        className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm rounded-full transition-all shadow-lg shadow-sky-500/30 hover:shadow-sky-400/40 hover:scale-105"
                    >
                        Get a Free Quote <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                {/* ── Main Grid: 2-col on mobile, 4-col on desktop ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 sm:gap-8 mb-12">

                    {/* Brand Column — full width on mobile */}
                    <motion.div {...fadeUp(0)} className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-0.5 rounded-full bg-gradient-to-tr from-sky-400 to-sky-600 flex-shrink-0 shadow-lg shadow-sky-500/30">
                                <img
                                    src="/logo.png"
                                    alt="Lulla Estate Developer"
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-dark bg-white"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150?text=Logo'; }}
                                />
                            </div>
                            <div>
                                <span className="font-black text-xl text-white tracking-tight block">Lulla Estate</span>
                                <span className="text-sky-400 text-[10px] font-bold tracking-widest uppercase">Developer</span>
                            </div>
                        </div>
                        <p className="text-gray-400 mb-5 leading-relaxed text-sm font-light max-w-xs">
                            Building Trust, Creating Landmarks. Premium construction from conceptualization to completion.
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs font-bold mb-5">
                            <Heart className="w-3 h-3 fill-current" /> Trusted Since 2005
                        </div>
                        {/* Social icons */}
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-3">Follow Us</p>
                            <div className="flex gap-2">
                                {socials.map((s) => (
                                    <motion.a key={s.label} href={s.href} aria-label={s.label}
                                        whileHover={{ y: -3, scale: 1.1 }}
                                        className={`w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white ${s.color} hover:border-transparent transition-all duration-200`}
                                    >
                                        {s.icon}
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Company Links */}
                    <motion.div {...fadeUp(0.1)}>
                        <h3 className="text-white font-black text-sm sm:text-base mb-4 sm:mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-sky-500 rounded-full" />
                            Company
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to}
                                        className="group flex items-center gap-2 text-gray-400 hover:text-sky-400 transition-all duration-200 text-sm"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Services */}
                    <motion.div {...fadeUp(0.2)}>
                        <h3 className="text-white font-black text-sm sm:text-base mb-4 sm:mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-sky-500 rounded-full" />
                            Services
                        </h3>
                        <ul className="space-y-3">
                            {services.map((service) => (
                                <li key={service.label}>
                                    <Link to={service.to}
                                        className="flex items-center gap-2 text-gray-400 text-sm group hover:text-sky-400 transition-colors"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-sky-500/30 group-hover:bg-sky-500 transition-all flex-shrink-0" />
                                        <span className="leading-snug">{service.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div {...fadeUp(0.3)} className="col-span-2 md:col-span-1">
                        <h3 className="text-white font-black text-sm sm:text-base mb-4 sm:mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-sky-500 rounded-full" />
                            Get in Touch
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                                    className="group flex items-start gap-3 text-gray-400 hover:text-sky-400 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-500/20 group-hover:border-sky-500/40 transition-all mt-0.5">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Location</p>
                                        <p className="text-xs leading-relaxed">123 Construction Ave,<br />Landmark City, NY 12345</p>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="tel:+12345678900"
                                    className="group flex items-center gap-3 text-gray-400 hover:text-sky-400 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-500/20 group-hover:border-sky-500/40 transition-all">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Call Us</p>
                                        <p className="text-xs font-semibold">+1 (234) 567-8900</p>
                                    </div>
                                </a>
                            </li>
                            <li>
                                    <a href="mailto:info@lullaestate.com"
                                        className="group flex items-center gap-3 text-gray-400 hover:text-sky-400 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-500/20 group-hover:border-sky-500/40 transition-all">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Email Us</p>
                                            <p className="text-xs font-semibold break-all">info@lullaestate.com</p>
                                        </div>
                                    </a>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* ── Divider ── */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                {/* ── Bottom bar ── */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
                    <p className="text-gray-500 text-center sm:text-left">
                        © {new Date().getFullYear()} <span className="text-white font-bold">Lulla Estate Developer</span>. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 sm:gap-6 text-gray-500">
                        <span className="flex items-center gap-1.5">
                            Made with <Heart className="w-3.5 h-3.5 text-sky-500 fill-current" /> in India
                        </span>
                        <Link to="/admin"
                            className="flex items-center gap-1 hover:text-sky-400 transition-colors group"
                        >
                            Admin <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
