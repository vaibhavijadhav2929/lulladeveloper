import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DesignCard from '../components/DesignCard';
import { getDocuments } from '../firebase/firebaseServices';

const ConstructionDesignPage = () => {
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDesigns = async () => {
            try {
                const data = await getDocuments('designs');
                setDesigns(data);
            } catch (err) {
                console.error("Failed to fetch designs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDesigns();
    }, []);

    return (
        <div className="py-24 bg-white min-h-screen text-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
                    >
                        Construction <span className="text-sky-500 italic">Designs</span>
                    </motion.h1>
                    <div className="w-24 h-1.5 bg-sky-500 mx-auto rounded-full mb-8"></div>
                    <p className="text-gray-500 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
                        A curated gallery of aesthetic elevations, modern interiors, and structural masterpieces conceptualized by our experts.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center flex-col items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-500 mb-4"></div>
                        <p className="text-gray-500 font-bold animate-pulse">Loading amazing designs...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[350px]">
                        {designs.length > 0 ? (
                            designs.map((design, index) => (
                                <div key={design.id} className={index % 4 === 0 || index % 4 === 3 ? "lg:col-span-2" : ""}>
                                    <DesignCard {...design} />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-24 text-center bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <div className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-8">
                                    <span className="text-4xl">📐</span>
                                </div>
                                <h3 className="text-2xl font-black text-dark mb-3">Design Gallery Empty</h3>
                                <p className="text-gray-500 max-w-sm mx-auto font-medium">Our architects are currently sketching the next generation of landmarks. Stay tuned!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConstructionDesignPage;
