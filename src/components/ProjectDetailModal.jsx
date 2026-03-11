import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, MapPin, CheckCircle, Clock, Zap, Building2, Home, Ruler, Layers,
    Phone, Mail, ArrowRight, ChevronLeft, ChevronRight, Star, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const typeIcons = {
    Residential: <Home className="w-4 h-4" />,
    Commercial: <Building2 className="w-4 h-4" />,
    Plotting: <Layers className="w-4 h-4" />,
    Construction: <Ruler className="w-4 h-4" />,
};

const statusConfig = {
    Completed: { icon: <CheckCircle className="w-4 h-4" />, className: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
    Ongoing: { icon: <Clock className="w-4 h-4" />, className: 'bg-sky-100 text-sky-700 border-sky-200', dot: 'bg-sky-500 animate-pulse' },
    Upcoming: { icon: <Zap className="w-4 h-4" />, className: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
};

const ProjectDetailModal = ({ project, onClose }) => {
    const [activeImg, setActiveImg] = useState(0);
    const images = project?.images?.length > 0 ? project.images : [project?.image].filter(Boolean);
    const statusCfg = statusConfig[project?.status] || statusConfig.Ongoing;
    const featuresList = project?.features || [];
    const amenitiesList = project?.amenities || [];

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    const prevImg = (e) => { e.stopPropagation(); setActiveImg((p) => (p - 1 + images.length) % images.length); };
    const nextImg = (e) => { e.stopPropagation(); setActiveImg((p) => (p + 1) % images.length); };

    if (!project) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4"
                onClick={onClose}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                {/* Modal Panel */}
                <motion.div
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className="relative w-full sm:max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 z-30 w-9 h-9 bg-white/90 hover:bg-red-50 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-gray-500 hover:text-red-500 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto flex-1">

                        {/* ── Image Gallery ── */}
                        <div className="relative h-52 sm:h-72 md:h-80 bg-gray-900 flex-shrink-0">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImg}
                                    src={images[activeImg] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'}
                                    alt={project.name}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                            {/* Gallery navigation */}
                            {images.length > 1 && (
                                <>
                                    <button onClick={prevImg} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button onClick={nextImg} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                        {images.map((_, i) => (
                                            <button key={i} onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                                                className={`rounded-full transition-all ${i === activeImg ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Status badge on image */}
                            {project.status && (
                                <div className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border bg-white/95 ${statusCfg.className}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                                    {project.status}
                                </div>
                            )}
                        </div>

                        {/* Thumbnail strip */}
                        {images.length > 1 && (
                            <div className="flex gap-2 p-3 bg-gray-50 border-b border-gray-100 overflow-x-auto">
                                {images.map((img, i) => (
                                    <button key={i} onClick={() => setActiveImg(i)}
                                        className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? 'border-sky-500 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* ── Project Info ── */}
                        <div className="p-4 sm:p-6">

                            {/* Title + Type */}
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-dark leading-tight">{project.name}</h2>
                                    {project.location && (
                                        <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1.5">
                                            <MapPin className="w-4 h-4 text-sky-500 flex-shrink-0" />
                                            <span>{project.location}</span>
                                        </div>
                                    )}
                                </div>
                                {project.type && (
                                    <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-full text-xs font-bold">
                                        {typeIcons[project.type]} {project.type}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {(project.description || project.shortDescription) && (
                                <div className="mb-5">
                                    <h3 className="text-sm font-black text-dark uppercase tracking-wider mb-2">About this Project</h3>
                                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                        {project.description || project.shortDescription}
                                    </p>
                                </div>
                            )}

                            {/* Features + Amenities grid */}
                            <div className="grid sm:grid-cols-2 gap-5 mb-5">
                                {featuresList.length > 0 && (
                                    <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100">
                                        <h3 className="text-xs font-black text-sky-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                            <Star className="w-3.5 h-3.5 fill-current" /> Key Features
                                        </h3>
                                        <ul className="space-y-2">
                                            {featuresList.map((f, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                    <CheckCircle className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {amenitiesList.length > 0 && (
                                    <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                                        <h3 className="text-xs font-black text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                            <CheckCircle className="w-3.5 h-3.5" /> Amenities
                                        </h3>
                                        <ul className="space-y-2">
                                            {amenitiesList.map((a, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                                    <span>{a}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Map Link */}
                            {project.mapLink && (
                                <a href={project.mapLink} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sky-600 hover:text-sky-700 text-sm font-semibold mb-5 group"
                                >
                                    <MapPin className="w-4 h-4" />
                                    View on Google Maps
                                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </a>
                            )}

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                                <Link to="/contact"
                                    onClick={onClose}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-dark text-white font-bold text-sm rounded-xl hover:bg-sky-500 transition-all"
                                >
                                    <Phone className="w-4 h-4" /> Enquire Now
                                </Link>
                                <a href="mailto:info@tblullaconstruction.com"
                                    className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-dark text-dark font-bold text-sm rounded-xl hover:border-sky-500 hover:text-sky-600 transition-all"
                                >
                                    <Mail className="w-4 h-4" /> Email Us
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProjectDetailModal;
