import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, CheckCircle, Clock, Zap, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const typeColors = {
    Residential: { bg: 'from-emerald-400 to-teal-500', badge: 'bg-emerald-500' },
    Commercial: { bg: 'from-blue-500 to-indigo-600', badge: 'bg-blue-600' },
    Plotting: { bg: 'from-amber-400 to-orange-500', badge: 'bg-amber-500' },
    Construction: { bg: 'from-slate-500 to-gray-700', badge: 'bg-slate-600' },
    default: { bg: 'from-sky-400 to-blue-600', badge: 'bg-sky-500' },
};

const statusConfig = {
    Completed: { icon: <CheckCircle className="w-3 h-3" />, dot: 'bg-green-400', text: 'text-green-600', bg: 'bg-green-50 border-green-200' },
    Ongoing: { icon: <Clock className="w-3 h-3" />, dot: 'bg-sky-400 animate-pulse', text: 'text-sky-600', bg: 'bg-sky-50 border-sky-200' },
    Upcoming: { icon: <Zap className="w-3 h-3" />, dot: 'bg-amber-400', text: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
};

const ProjectCard = ({ id, name, location, shortDescription, description, status, image, images, type, features }) => {
    const navigate = useNavigate();
    const displayImage = image || (images && images[0]) || '';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-[2rem] cursor-pointer w-full max-w-[380px] shadow-2xl transition-all duration-500 hover:shadow-sky-500/20"
            style={{ aspectRatio: '1/1.1' }}
            onClick={() => id && navigate(`/projects/${id}`)}
        >
            {/* Image Overlay Background */}
            {displayImage ? (
                <img
                    src={displayImage}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
            ) : (
                <div className="w-full h-full bg-slate-900" />
            )}

            {/* Premium Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 border-[8px] border-white/0 group-hover:border-white/5 transition-all duration-500 rounded-[2rem] pointer-events-none" />

            {/* Badges */}
            <div className="absolute top-5 left-5 flex gap-2 notranslate">
                <span className="px-3.5 py-1.5 bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-white/10">
                    {type || 'Project'}
                </span>
            </div>

            <div className="absolute top-5 right-5 notranslate">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${status === 'Completed' ? 'bg-emerald-500' :
                        status === 'Upcoming' ? 'bg-amber-500' : 'bg-sky-500'
                    } text-white shadow-xl`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {status || 'Ongoing'}
                </span>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
                <motion.h3
                    className="text-white font-black text-2xl sm:text-3xl leading-tight mb-2 group-hover:text-sky-300 transition-colors"
                >
                    {name}
                </motion.h3>

                <div className="flex items-center gap-2 text-white/60 text-[12px] font-medium mb-6">
                    <MapPin className="w-4 h-4 text-sky-400" />
                    {location}
                </div>

                {/* Description (visible on larger cards/screens) */}
                {shortDescription && (
                    <p className="text-white/40 text-xs line-clamp-2 mb-6 hidden sm:block font-light leading-relaxed">
                        {shortDescription}
                    </p>
                )}

                <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 px-8 py-3 bg-sky-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all hover:bg-white hover:text-dark"
                >
                    View Project
                    <ArrowRight className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
