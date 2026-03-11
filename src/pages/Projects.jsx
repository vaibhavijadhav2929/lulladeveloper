import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { getDocuments } from '../firebase/firebaseServices';
import { ref, get } from 'firebase/database';
import { db } from '../firebase/firebaseConfig';
import { Search, SlidersHorizontal, Building2, Home, Layers, Ruler, Grid3X3, LayoutList } from 'lucide-react';

const FILTERS = ['All', 'Residential', 'Commercial', 'Plotting', 'Construction'];
const STATUS_FILTERS = ['All Status', 'Completed', 'Ongoing', 'Upcoming'];

const filterIcons = {
    All: <Grid3X3 className="w-3.5 h-3.5" />,
    Residential: <Home className="w-3.5 h-3.5" />,
    Commercial: <Building2 className="w-3.5 h-3.5" />,
    Plotting: <Layers className="w-3.5 h-3.5" />,
    Construction: <Ruler className="w-3.5 h-3.5" />,
};

const SkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="bg-gray-200 h-48 sm:h-56" />
        <div className="p-4 sm:p-5 space-y-3">
            <div className="bg-gray-200 h-4 rounded-full w-3/4" />
            <div className="bg-gray-100 h-3 rounded-full w-1/2" />
            <div className="bg-gray-100 h-3 rounded-full w-full" />
            <div className="bg-gray-100 h-3 rounded-full w-5/6" />
            <div className="bg-gray-200 h-9 rounded-xl mt-4" />
        </div>
    </div>
);

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeType, setActiveType] = useState('All');
    const [activeStatus, setActiveStatus] = useState('All Status');
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Detect Current Language
                const lang = document.cookie.split('; ').find(row => row.startsWith('googtrans='))?.split('=')[1]?.split('/')[2] || 'en';

                const data = await getDocuments('projects');

                // Filter by language (defaulting to 'en' if not set)
                const filteredData = data.filter(p => (p.language || 'en') === lang);

                // Load images from separate project_images collection
                const withImages = await Promise.all(filteredData.map(async (p) => {
                    const rawIds = p._imageIds;
                    const imageIds = Array.isArray(rawIds) ? rawIds : (rawIds ? Object.values(rawIds) : []);

                    if (imageIds.length > 0) {
                        const imgs = [];
                        for (const id of imageIds) {
                            try {
                                const snap = await get(ref(db, `project_images/${id}`));
                                if (snap.exists()) imgs.push(snap.val().data);
                            } catch (_) { }
                        }
                        return { ...p, images: imgs, image: imgs[0] || '' };
                    }
                    return p;
                }));
                setProjects(withImages);
            } catch (err) {
                console.error('Failed to fetch projects', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const filtered = useMemo(() => {
        return projects.filter((p) => {
            const matchType = activeType === 'All' || p.type === activeType;
            const matchStatus = activeStatus === 'All Status' || p.status === activeStatus;
            const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.location?.toLowerCase().includes(search.toLowerCase());
            return matchType && matchStatus && matchSearch;
        });
    }, [projects, activeType, activeStatus, search]);

    return (
        <>
            <div className="min-h-screen bg-gray-50">

                {/* ── Premium Centered Header ── */}
                <div className="bg-white pt-6 pb-12 sm:pt-10 sm:pb-20 relative overflow-hidden">
                    {/* Subtle design element */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-sky-50/30 -skew-x-12 translate-x-1/2 pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-block px-4 py-1.5 bg-sky-50 rounded-full mb-4"
                        >
                            <span className="text-sky-500 text-[10px] font-black uppercase tracking-[0.3em] notranslate">Selected Works</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-dark mb-8 leading-[1.1]"
                        >
                            Explore Our <br />
                            <span className="text-sky-500">Masterpieces</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-12"
                        >
                            From luxury residential complexes to commercial landmarks, discover how we are sculpting the future of Sangli-Miraj.
                        </motion.p>

                        {/* ── MODERN SEARCH & FILTERS ── */}
                        <div className="max-w-4xl mx-auto">
                            <div className="relative mb-6 group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-sky-500 transition-all" />
                                <input
                                    type="text"
                                    placeholder="Search projects by name or location..."
                                    className="w-full pl-16 pr-8 py-5 bg-gray-50 border-none rounded-[2rem] text-dark font-medium shadow-inner focus:ring-2 focus:ring-sky-500/20 transition-all text-sm sm:text-base outline-none"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 notranslate">
                                {['All', 'Residential', 'Commercial', 'Plotting', 'Construction'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setActiveType(type)}
                                        className={`px-6 py-2.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${activeType === type
                                                ? 'bg-dark text-white shadow-2xl scale-105 ring-8 ring-sky-500/10'
                                                : 'bg-white text-gray-400 border border-gray-100 hover:border-sky-200'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Main View ── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loader"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
                            >
                                {[1, 2, 3].map(n => (
                                    <div key={n} className="w-full max-w-[380px] aspect-square rounded-[2rem] bg-gray-100 animate-pulse" />
                                ))}
                            </motion.div>
                        ) : filtered.length > 0 ? (
                            <motion.div
                                key="grid"
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
                            >
                                {filtered.map((project, idx) => (
                                    <div key={project.id} className="w-full flex justify-center">
                                        <ProjectCard {...project} />
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="py-24 text-center max-w-md mx-auto"
                            >
                                <div className="w-24 h-24 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-6 text-sky-500">
                                    <Search className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black text-dark mb-3">No Results Found</h3>
                                <p className="text-gray-400 font-medium mb-8">
                                    We couldn't find any projects matching your search. Try different filters or terms.
                                </p>
                                <button
                                    onClick={() => { setSearch(''); setActiveType('All'); setActiveStatus('All Status'); }}
                                    className="px-8 py-3 bg-dark text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-sky-500 transition-all shadow-xl"
                                >
                                    Reset Filters
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
};

export default ProjectsPage;
