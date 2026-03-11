import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, MapPin, CheckCircle, Clock, Zap, Building2,
    Home, Ruler, Layers, Phone, Mail, ChevronLeft, ChevronRight,
    Star, ExternalLink, Share2, ArrowRight, Calendar, Award
} from 'lucide-react';
import { getDocuments } from '../firebase/firebaseServices';
import { ref, get } from 'firebase/database';
import { db } from '../firebase/firebaseConfig';

/* ── Type + Status configs ── */
const typeColors = {
    Residential: { gradient: 'from-emerald-500 to-teal-600', glow: 'rgba(16,185,129,0.3)', badge: 'bg-emerald-500', icon: <Home className="w-5 h-5" /> },
    Commercial: { gradient: 'from-blue-500 to-indigo-600', glow: 'rgba(59,130,246,0.3)', badge: 'bg-blue-600', icon: <Building2 className="w-5 h-5" /> },
    Plotting: { gradient: 'from-amber-500 to-orange-500', glow: 'rgba(245,158,11,0.3)', badge: 'bg-amber-500', icon: <Layers className="w-5 h-5" /> },
    Construction: { gradient: 'from-slate-600 to-gray-800', glow: 'rgba(100,116,139,0.3)', badge: 'bg-slate-600', icon: <Ruler className="w-5 h-5" /> },
    default: { gradient: 'from-sky-500 to-blue-600', glow: 'rgba(14,165,233,0.3)', badge: 'bg-sky-500', icon: <Building2 className="w-5 h-5" /> },
};

const statusConfig = {
    Completed: { label: 'Completed', icon: <CheckCircle className="w-4 h-4" />, cls: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
    Ongoing: { label: 'Ongoing', icon: <Clock className="w-4 h-4" />, cls: 'bg-sky-100 text-sky-700 border-sky-200', dot: 'bg-sky-500 animate-pulse' },
    Upcoming: { label: 'Upcoming', icon: <Zap className="w-4 h-4" />, cls: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
};

const ProjectDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await getDocuments('projects');
                const found = data.find(p => p.id === id);
                if (!found) { navigate('/projects'); return; }

                // Load full images
                const imgs = [];
                // Add the primary image if it exists
                if (found.image) imgs.push(found.image);

                const rawIds = found._imageIds;
                const imageIds = Array.isArray(rawIds) ? rawIds : (rawIds ? Object.values(rawIds) : []);

                if (imageIds.length > 0) {
                    for (const imgId of imageIds) {
                        try {
                            const snap = await get(ref(db, `project_images/${imgId}`));
                            if (snap.exists() && snap.val().data) {
                                // Prevent duplicates if the primary image is also in the array
                                if (!imgs.includes(snap.val().data)) {
                                    imgs.push(snap.val().data);
                                }
                            }
                        } catch (_) { }
                    }
                }
                
                // Also check if there's an 'images' array directly on the project document (for newer data structures)
                if (found.images && Array.isArray(found.images)) {
                    for (const img of found.images) {
                        if (img && typeof img === 'string' && !imgs.includes(img)) {
                            imgs.push(img);
                        }
                    }
                }

                setProject({ ...found, allImages: imgs });
            } catch (err) {
                console.error('Failed to fetch project', err);
                navigate('/projects');
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, navigate]);

    if (loading) return (
        <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full"
            />
        </div>
    );

    if (!project) return null;

    const images = project.allImages || [];
    const typeStyle = typeColors[project.type] || typeColors.default;
    const statusCfg = statusConfig[project.status] || statusConfig.Ongoing;
    const featuresList = project.features || [];
    const amenitiesList = project.amenities || [];

    const prevImg = () => setActiveImg(p => (p - 1 + images.length) % images.length);
    const nextImg = () => setActiveImg(p => (p + 1) % images.length);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ════════════════════════════════════════
                HERO HEADER (TEXT OUTSIDE)
            ════════════════════════════════════════ */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div className="flex-1">
                        {/* Type + Status badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.type && (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-white ${typeStyle.badge} shadow-md`}>
                                    {typeStyle.icon} {project.type}
                                </span>
                            )}
                            {project.status && (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border bg-white ${statusCfg.cls}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                                    {statusCfg.label}
                                </span>
                            )}
                        </div>

                        {/* Project name */}
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-2 tracking-tight">
                            {project.name}
                        </h1>

                        {/* Location */}
                        {project.location && (
                            <div className="flex items-center gap-2 text-gray-500 text-sm sm:text-base font-semibold">
                                <MapPin className="w-5 h-5 text-sky-500 flex-shrink-0" />
                                {project.location}
                            </div>
                        )}
                    </div>

                    <div className="mb-1">
                        {/* Back button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 hover:text-sky-600 hover:border-sky-200 shadow-sm hover:shadow-md text-sm font-bold uppercase tracking-wider rounded-xl border border-gray-200 transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* ════════════════════════════════════════
                HERO IMAGE SECTION (CENTERED, SMALLER)
            ════════════════════════════════════════ */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 flex justify-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                    className="relative w-full max-w-2xl aspect-square bg-gray-900 rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5 group"
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={activeImg}
                            src={images[activeImg] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1800&auto=format&fit=crop'}
                            alt={project.name}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s] ease-out brightness-[0.9]"
                        />
                    </AnimatePresence>

                    {/* Subtle vignette shadow to make image pop */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 pointer-events-none" />

                    {/* Top Accent Line */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${typeStyle.gradient}`} />

                    {/* Navigation inside Image */}
                    {images.length > 1 && (
                        <>
                            <motion.button 
                                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={prevImg}
                                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 transition-all z-10 shadow-lg"
                            >
                                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={nextImg}
                                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 transition-all z-10 shadow-lg"
                            >
                                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                            </motion.button>

                            {/* Dot indicators */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10 bg-black/30 backdrop-blur-md px-5 py-3 rounded-full border border-white/10">
                                {images.map((_, i) => (
                                    <button key={i} onClick={() => setActiveImg(i)}
                                        className={`rounded-full transition-all duration-300 hover:scale-150 ${i === activeImg ? 'w-8 h-2 bg-sky-400' : 'w-2 h-2 bg-white/50 hover:bg-white'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </motion.div>
            </div>

            {/* ════════════════════════════════════════
                THUMBNAIL STRIP
            ════════════════════════════════════════ */}
            {images.length > 1 && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide py-2"
                    >
                        {images.map((img, i) => (
                            <motion.button key={i} onClick={() => setActiveImg(i)}
                                whileHover={{ scale: 1.05, y: -4 }}
                                className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all ${i === activeImg ? 'border-sky-500 shadow-md shadow-sky-200 opacity-100' : 'border-transparent opacity-60 hover:opacity-100 bg-gray-200'}`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </motion.button>
                        ))}
                    </motion.div>
                </div>
            )}

            {/* ════════════════════════════════════════
                MAIN CONTENT
            ════════════════════════════════════════ */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">

                    {/* ── Left: Main Info ── */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* About */}
                        {(project.description || project.shortDescription) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-sky-200/40 hover:border-sky-200 transition-all duration-300 relative overflow-hidden group"
                            >
                                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${typeStyle.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
                                <div className="flex items-center gap-3 mb-5">
                                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${typeStyle.gradient} flex items-center justify-center text-white flex-shrink-0`}>
                                        {typeStyle.icon}
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-black text-dark uppercase tracking-wider">About This Project</h2>
                                </div>
                                <p className="text-gray-600 text-base leading-relaxed font-light">
                                    {project.description || project.shortDescription}
                                </p>
                            </motion.div>
                        )}

                        {/* Features */}
                        {featuresList.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-sky-200/40 hover:border-sky-200 transition-all duration-300 relative overflow-hidden group"
                            >
                                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${typeStyle.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
                                        <Star className="w-5 h-5 fill-current" />
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-black text-dark uppercase tracking-wider">Key Features</h2>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {featuresList.map((f, i) => (
                                        <motion.div key={i}
                                            initial={{ opacity: 0, x: -15 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            whileHover={{ scale: 1.03 }}
                                            transition={{ delay: 0.25 + i * 0.05 }}
                                            className="flex items-center gap-3 p-3 bg-sky-50 rounded-xl border border-sky-100 group hover:bg-sky-100 transition-all cursor-pointer"
                                        >
                                            <div className="w-6 h-6 rounded-lg bg-sky-500 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700">{f}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Amenities */}
                        {amenitiesList.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-sky-200/40 hover:border-sky-200 transition-all duration-300 relative overflow-hidden group"
                            >
                                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${typeStyle.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white flex-shrink-0">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-black text-dark uppercase tracking-wider">Amenities</h2>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {amenitiesList.map((a, i) => (
                                        <motion.div key={i}
                                            initial={{ opacity: 0, x: -15 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            whileHover={{ scale: 1.03 }}
                                            transition={{ delay: 0.3 + i * 0.05 }}
                                            className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-all cursor-pointer"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                            <span className="text-sm font-semibold text-gray-700">{a}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Map link */}
                        {project.mapLink && (
                            <motion.a
                                href={project.mapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                className="flex items-center gap-3 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-sky-200 hover:shadow-md transition-all group"
                            >
                                <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-all">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-black text-dark text-sm">View on Google Maps</p>
                                    <p className="text-gray-400 text-xs">{project.location}</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all" />
                            </motion.a>
                        )}
                    </div>

                    {/* ── Right: Sidebar ── */}
                    <div className="space-y-5">

                        {/* Project summary card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-sky-200/40 hover:border-sky-200 transition-all duration-300 group"
                        >
                            <div className={`p-6 bg-gradient-to-br ${typeStyle.gradient} text-white`}>
                                <p className="text-white/70 text-xs uppercase tracking-widest font-bold mb-1">Project Type</p>
                                <div className="flex items-center gap-2">
                                    {typeStyle.icon}
                                    <p className="text-xl font-black">{project.type || 'Construction'}</p>
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                {project.status && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400 text-sm font-semibold">Status</span>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.cls}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                                            {statusCfg.label}
                                        </span>
                                    </div>
                                )}
                                {project.location && (
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="text-gray-400 text-sm font-semibold flex-shrink-0">Location</span>
                                        <span className="text-dark text-sm font-bold text-right">{project.location}</span>
                                    </div>
                                )}
                                {featuresList.length > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400 text-sm font-semibold">Features</span>
                                        <span className="text-dark text-sm font-black">{featuresList.length}</span>
                                    </div>
                                )}
                                {images.length > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400 text-sm font-semibold">Photos</span>
                                        <span className="text-dark text-sm font-black">{images.length}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* CTA Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                            className="bg-[#0a0f1e] rounded-2xl sm:rounded-3xl p-6 overflow-hidden relative shadow-lg transition-colors"
                        >
                            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, var(--tw-gradient-from, #38bdf8), transparent)` }} />
                            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-20" style={{ background: typeStyle.glow }} />

                            <h3 className="text-white font-black text-lg mb-2">Interested in this project?</h3>
                            <p className="text-white/40 text-sm mb-5 font-light leading-relaxed">Get in touch with our team for detailed information and site visits.</p>

                            <div className="space-y-3">
                                <Link to="/contact"
                                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-black uppercase tracking-widest bg-gradient-to-r ${typeStyle.gradient} shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]`}
                                >
                                    <Phone className="w-4 h-4" /> Enquire Now
                                </Link>
                                <a href="mailto:info@tblullaconstruction.com"
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-bold border border-white/20 hover:bg-white/10 transition-all"
                                >
                                    <Mail className="w-4 h-4" /> Email Us
                                </a>
                            </div>
                        </motion.div>

                        {/* Back to Projects */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Link to="/projects"
                                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-gray-500 text-sm font-bold border border-gray-200 hover:border-sky-300 hover:text-sky-600 transition-all bg-white shadow-sm hover:shadow-md"
                            >
                                <ArrowLeft className="w-4 h-4" /> All Projects
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════
                CTA BANNER
            ════════════════════════════════════════ */}
            <div className="bg-[#0a0f1e] mt-8 py-16 sm:py-20 relative overflow-hidden">
                <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 80% at 50% 50%, ${typeStyle.glow} 0%, transparent 70%)` }} />
                <div className="max-w-3xl mx-auto text-center px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-3">Build With Us</p>
                        <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                            Ready to Start Your <span className={`bg-gradient-to-r ${typeStyle.gradient} bg-clip-text text-transparent`}>Dream Project?</span>
                        </h2>
                        <p className="text-white/40 text-base mb-8 font-light max-w-xl mx-auto">Our team of experts is ready to bring your vision to life. Let's create something extraordinary together.</p>
                        <Link to="/contact"
                            className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest bg-gradient-to-r ${typeStyle.gradient} shadow-xl hover:shadow-2xl hover:scale-105 transition-all`}
                        >
                            Contact Us <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailPage;
