import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PlotCard from '../components/PlotCard';
import { getDocuments } from '../firebase/firebaseServices';

const PlottingPage = () => {
    const [plots, setPlots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlots = async () => {
            try {
                const data = await getDocuments('plots');
                setPlots(data);
            } catch (err) {
                console.error("Failed to fetch plots", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlots();
    }, []);

    return (
        <div className="py-24 bg-white min-h-screen relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-sky-50 rounded-full blur-3xl -z-10 opacity-60"></div>
            <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-indigo-50/50 rounded-full blur-[100px] -z-10 opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-1.5 bg-sky-100 text-sky-600 text-xs font-black uppercase tracking-[0.2em] rounded-full mb-6 border border-sky-200"
                    >
                        Investment Opportunities
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-dark mb-6 tracking-tight"
                    >
                        Premium <span className="text-sky-500 italic">Plotting</span>
                    </motion.h1>
                    <div className="w-24 h-1.5 bg-sky-500 mx-auto rounded-full mb-8"></div>
                    <p className="text-gray-500 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
                        Discover prime lands and meticulously curated plots perfect for your future home or high-return investment.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center flex-col items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
                        <p className="text-gray-500 font-medium animate-pulse">Loading premium plots...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {plots.length > 0 ? (
                            plots.map(plot => (
                                <PlotCard key={plot.id} {...plot} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-3xl text-gray-400">🏞️</span>
                                </div>
                                <h3 className="text-xl font-bold text-dark mb-2">No Plots Available</h3>
                                <p className="text-gray-500 max-w-md mx-auto">All our premium plots are currently sold out or being updated by the admin. Please check back later.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlottingPage;
