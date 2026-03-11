import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const DesignCard = ({ title, image }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.4 }}
            className="relative rounded-xl overflow-hidden shadow-lg group aspect-square sm:aspect-auto sm:h-80 cursor-pointer"
        >
            <img
                src={image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop"}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90"></div>

            <div className="absolute inset-0 p-6 flex flex-col justify-end items-center text-center">
                <h3 className="text-xl font-bold text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{title}</h3>
                <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                >
                    <span className="inline-flex items-center justify-center p-3 bg-sky-500 rounded-full text-white shadow-xl">
                        <Search className="h-5 w-5" />
                    </span>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default DesignCard;
