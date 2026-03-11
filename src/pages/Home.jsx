import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, Building, Home, Ruler, Activity, ArrowRight, Star, HardHat, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import ProjectDetailModal from '../components/ProjectDetailModal';
import { getDocuments } from '../firebase/firebaseServices';
import { ref, get } from 'firebase/database';
import { db } from '../firebase/firebaseConfig';

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
const heroImages = [
    "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=2500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2500&auto=format&fit=crop"
];

const HeroSection = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 5000); // 5 seconds automation
        return () => clearInterval(interval);
    }, []);

    const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const containerVariant = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div ref={ref} className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-dark">

            {/* Automated Background Slider */}
            <div className="absolute inset-0 z-0 bg-black">
                {heroImages.map((img, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{
                            opacity: index === currentImageIndex ? 1 : 0,
                            scale: index === currentImageIndex ? 1.08 : 1.05
                        }}
                        transition={{
                            opacity: { duration: 1.5, ease: "easeInOut" },
                            scale: { duration: 8, ease: "linear" }
                        }}
                        className="absolute inset-0"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${img})` }}
                        />
                    </motion.div>
                ))}
                {/* Multi-layer overlays for depth */}
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 z-10"></div>
            </div>

            {/* ── Floating Glowing Orbs (decorative effects) ── */}
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ y: [0, -30, 0], x: [0, 15, 0], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 rounded-full bg-sky-500/20 blur-3xl"
                />
                <motion.div
                    animate={{ y: [0, 25, 0], x: [0, -20, 0], opacity: [0.1, 0.25, 0.1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-1/4 right-1/4 w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-blue-400/15 blur-3xl"
                />
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.08, 0.2, 0.08] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-white/5 blur-3xl"
                />
                {/* Animated shimmer lines */}
                <motion.div
                    animate={{ opacity: [0, 0.15, 0], scaleX: [0, 1, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
                />
                <motion.div
                    animate={{ opacity: [0, 0.1, 0], scaleX: [0, 1, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
                    className="absolute bottom-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent"
                />
            </div>

            {/* Slider Indicators */}
            <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-30">
                {heroImages.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`transition-all duration-300 rounded-full ${idx === currentImageIndex
                            ? "w-6 sm:w-8 h-2 bg-white"
                            : "w-2 h-2 bg-white/50 hover:bg-white/80"
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Centered Content */}
            <motion.div
                style={{ y: yText, opacity: opacityText }}
                variants={containerVariant}
                initial="hidden"
                animate="visible"
                className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center pointer-events-none"
            >
                {/* Eyebrow Badge */}
                <motion.div variants={itemVariant} className="mb-4 sm:mb-6 mx-auto">
                    <span className="text-gray-300 font-medium text-xs sm:text-sm tracking-[0.25em] sm:tracking-[0.3em] uppercase backdrop-blur-sm bg-white/10 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border border-white/20 shadow-lg">
                        ✦ Lulla Estate
                        Developer ✦
                    </span>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                    variants={itemVariant}
                    className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif font-light text-white leading-[1.1] mb-4 sm:mb-6 tracking-tight drop-shadow-2xl"
                >
                    LULLA ESTATE <br />
                    <span className="italic font-normal bg-gradient-to-r from-white via-sky-100 to-white bg-clip-text text-transparent">DEVELOPER</span>
                </motion.h1>

                {/* Gold divider line */}
                <motion.div variants={itemVariant} className="flex justify-center mb-4 sm:mb-6">
                    <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-sky-400 to-transparent"></div>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    variants={itemVariant}
                    className="text-sm sm:text-base md:text-lg text-gray-300 mb-8 sm:mb-10 max-w-xs sm:max-w-xl md:max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md px-2"
                >
                    Specializing in high-end combinations, entire home renovations, and premium construction from conceptualization to completion.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div variants={itemVariant} className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center pointer-events-auto px-4 sm:px-0">
                    <Link to="/projects" className="w-full sm:w-auto group relative px-8 sm:px-10 py-3 sm:py-4 bg-white text-dark font-semibold text-xs sm:text-sm tracking-widest uppercase hover:bg-gray-100 transition-all flex items-center justify-center gap-2 overflow-hidden shadow-2xl">
                        <span className="absolute inset-0 bg-sky-500 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
                        <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                            View Portfolio <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                    <Link to="/contact" className="w-full sm:w-auto group px-8 sm:px-10 py-3 sm:py-4 bg-transparent text-white font-semibold text-xs sm:text-sm tracking-widest uppercase border border-white/60 hover:border-white hover:bg-white/15 transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
                        Contact Us
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

// ─── FEATURES SECTION ────────────────────────────────────────────────────────
const FeatureSection = () => {
    const features = [
        { icon: <Building />, title: "General Contracting", desc: "Expert management and execution for residential and commercial spaces." },
        { icon: <ShieldCheck />, title: "Renovations & Additions", desc: "Transforming existing structures with seamless integration and modern aesthetics." },
        { icon: <Ruler />, title: "Pre-construction & Planning", desc: "Thorough budgeting, scheduling, and strategic planning strictly adhered to." },
        { icon: <Activity />, title: "Project Management", desc: "Coordinating all aspects of construction to ensure timely and impeccable delivery." },
    ];

    return (
        <section className="py-16 sm:py-24 bg-gray-50 relative z-20 overflow-hidden">
            {/* Animated background shimmer */}
            <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none z-0"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-10 sm:mb-14">
                    <motion.span
                        initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="text-sky-600 tracking-[0.2em] uppercase text-xs font-black mb-3 block"
                    >Our Services</motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-serif text-dark leading-tight"
                    >
                        Delivering <span className="italic text-gray-400">Excellence</span>
                    </motion.h2>
                    <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
                        className="h-0.5 w-16 bg-sky-500 mx-auto mt-4 rounded-full"
                    />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-30px' }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(14,165,233,0.12)' }}
                            className="relative p-4 sm:p-7 bg-white border border-gray-100 transition-all duration-300 group rounded-xl sm:rounded-2xl overflow-hidden cursor-default"
                        >
                            {/* Corner accent */}
                            <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-sky-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 group-hover:text-sky-500 transition-colors duration-300 mb-3 sm:mb-6 flex items-center">
                                {React.cloneElement(feature.icon, { className: 'w-6 h-6 sm:w-8 sm:h-8 font-light' })}
                            </div>
                            <h3 className="text-xs sm:text-sm font-black text-dark mb-2 sm:mb-3 transition-colors uppercase tracking-wider leading-tight">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed text-xs sm:text-sm font-light hidden sm:block">{feature.desc}</p>
                            <div className="mt-3 sm:mt-6 h-px w-8 bg-gray-200 group-hover:w-full group-hover:bg-sky-400 transition-all duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ─── MAIN HOME PAGE ──────────────────────────────────────────────────────────
const HomePage = () => {
    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Detect Current Language
                const lang = document.cookie.split('; ').find(row => row.startsWith('googtrans='))?.split('=')[1]?.split('/')[2] || 'en';

                const data = await getDocuments('projects');

                // Filter by language (defaulting to 'en' if not set)
                const filteredData = data.filter(p => (p.language || 'en') === lang);

                // Sort by createdAt descending (most recent first)
                const sortedData = [...filteredData].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

                // Take up to 3 for featured
                const withImages = await Promise.all(sortedData.slice(0, 3).map(async (p) => {
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
                setFeaturedProjects(withImages);
            } catch (err) {
                console.error('Failed to fetch featured projects', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <HeroSection />
                <FeatureSection />

                {/* Featured Projects */}
                <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50 rounded-l-[80px] -z-10 hidden lg:block" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="mb-12"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                                <div>
                                    <span className="text-sky-500 font-black tracking-[0.2em] uppercase text-xs mb-3 block">Selected Works</span>
                                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-dark leading-none">Our Portfolio</h2>
                                    <div className="h-1.5 w-20 bg-sky-500 mt-6 rounded-full" />
                                </div>
                                <Link to="/projects" className="group flex items-center gap-3 px-6 py-3 border border-dark/20 text-dark font-black uppercase tracking-widest text-[10px] hover:bg-dark hover:text-white transition-all transition-all duration-300">
                                    Explore All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((n) => (
                                    <div key={n} className="animate-pulse rounded-2xl overflow-hidden">
                                        <div className="bg-gray-200 h-64 sm:h-72 w-full" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {featuredProjects.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center relative z-10 w-full px-4 sm:px-0">
                                        {featuredProjects.map((project) => (
                                            <div key={project.id} className="w-full flex justify-center">
                                                <ProjectCard {...project} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        <img src="/logo.png" alt="TB Lulla Logo" className="w-14 h-14 mx-auto mb-4 rounded-full object-cover grayscale opacity-30 border-2 border-gray-200" />
                                        <h3 className="text-lg font-bold text-gray-400 mb-1">No Projects Yet</h3>
                                        <p className="text-gray-300 text-sm">Projects will appear here once added by admin.</p>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="mt-8 sm:mt-12 text-center sm:hidden">
                            <Link to="/projects" className="inline-flex items-center gap-2 px-7 py-3.5 bg-dark text-white font-bold rounded-xl hover:bg-sky-500 transition-all text-sm shadow-lg">
                                View All Projects <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Premium CTA Section */}
                <section className="py-16 sm:py-24 bg-dark relative overflow-hidden text-center text-white">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-fixed opacity-10 grayscale" />
                    </div>
                    {/* Animated orbs */}
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 6, repeat: Infinity }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"
                    />
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <span className="text-gray-400 font-medium tracking-[0.3em] uppercase text-xs sm:text-sm mb-4 block">
                                Let's Talk
                            </span>
                            <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-light text-white leading-tight mb-4 sm:mb-6">
                                Start Your <br /><span className="italic">Dream Project</span>
                            </h2>
                            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-sky-400 to-transparent mx-auto mb-6 sm:mb-10" />
                            <p className="text-gray-400 text-sm sm:text-lg max-w-sm sm:max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed font-light px-2">
                                Our team of experts is ready to turn your vision into a lasting landmark. Reach out today and let's build something extraordinary together.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center w-full px-4 sm:px-0">
                                <Link to="/contact"
                                    className="w-full sm:w-auto group px-8 sm:px-12 py-3 sm:py-5 bg-white text-dark font-bold text-xs sm:text-sm tracking-widest uppercase hover:bg-sky-500 hover:text-white transition-all flex items-center justify-center gap-3 shadow-2xl"
                                >
                                    Get in Touch <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/projects"
                                    className="w-full sm:w-auto group px-8 sm:px-12 py-3 sm:py-5 border border-white/30 text-white font-bold text-xs sm:text-sm tracking-widest uppercase hover:border-white/60 hover:bg-white/10 transition-all flex items-center justify-center gap-3 backdrop-blur-sm"
                                >
                                    Our Work <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default HomePage;
