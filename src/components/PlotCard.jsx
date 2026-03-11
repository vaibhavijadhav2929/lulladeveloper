import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Maximize, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const PlotCard = ({ plotName, location, size, price, description, image }) => {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-100 flex flex-col h-full group"
        >
            <div className="relative overflow-hidden h-56 w-full flex-shrink-0">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10"></div>
                <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    src={image || "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=600&auto=format&fit=crop"}
                    alt={plotName}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark/90 to-transparent p-4 z-20">
                    <h3 className="text-xl font-bold text-white text-shadow">{plotName}</h3>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-gray-500 mb-4 text-sm">
                    <MapPin className="h-4 w-4 mr-1 text-sky-500" />
                    <span>{location}</span>
                </div>

                <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex flex-col">
                        <span className="flex items-center text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                            <Maximize className="h-3 w-3 mr-1" /> Size
                        </span>
                        <span className="font-bold text-dark">{size}</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="flex flex-col">
                        <span className="flex items-center text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                            <Tag className="h-3 w-3 mr-1" /> Price
                        </span>
                        <span className="font-bold text-sky-600">{price}</span>
                    </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-2">
                    {description}
                </p>

                <Link
                    to="/contact"
                    className="w-full py-3 px-4 bg-dark text-white text-center rounded-lg font-medium hover:bg-sky-500 transition-colors flex items-center justify-center gap-2"
                >
                    Inquire About Plot
                </Link>
            </div>
        </motion.div>
    );
};

export default PlotCard;
