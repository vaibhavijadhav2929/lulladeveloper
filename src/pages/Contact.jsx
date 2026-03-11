import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, User, MessageSquare, Clock, CheckCircle, AlertCircle, Star } from 'lucide-react';

// ─── Firebase Realtime Database REST API ────────────────────────────────────
// Uses your existing Realtime Database — no Firestore needed!
const RTDB_URL = 'https://tb-lulla-default-rtdb.firebaseio.com';

async function saveEnquiryToRTDB(data) {
    // Firebase RTDB REST: POST to /enquiries.json creates a new entry with auto-ID
    const response = await fetch(`${RTDB_URL}/enquiries.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: data.name || '',
            phone: data.phone || '',
            email: data.email || '',
            subject: data.subject || '',
            interestedIn: data.interestedIn || 'General Inquiry',
            message: data.message || '',
            status: 'New',
            createdAt: new Date().toISOString(),
        }),
    });

    if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody?.error || `Server error: HTTP ${response.status}`);
    }
    return response.json(); // returns { name: "-Nabc123..." } — the new key
}

// ─── Contact Page ─────────────────────────────────────────────────────────────
const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        subject: '',
        interestedIn: 'General Inquiry',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle | sending | success | error
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMsg('');

        try {
            const result = await saveEnquiryToRTDB(formData);
            console.log('Enquiry saved with key:', result.name);
            setStatus('success');
            setFormData({ name: '', phone: '', email: '', subject: '', interestedIn: 'General Inquiry', message: '' });
            setTimeout(() => setStatus('idle'), 8000);
        } catch (err) {
            console.error('Enquiry submission error:', err);
            setStatus('error');
            setErrorMsg(err.message || 'Unknown error. Please try again or call us directly.');
            setTimeout(() => setStatus('idle'), 8000);
        }
    };

    const contactDetails = [
        { icon: <MapPin className="w-6 h-6" />, label: 'Our Location', lines: ['123 Construction Avenue,', 'Landmark City, State 12345'] },
        { icon: <Phone className="w-6 h-6" />, label: 'Phone Number', lines: ['+1 (234) 567-8900', '+1 (987) 654-3210'] },
        { icon: <Mail className="w-6 h-6" />, label: 'Email Address', lines: ['info@lullaestate.com', 'sales@lullaestate.com'] },
        { icon: <Clock className="w-6 h-6" />, label: 'Working Hours', lines: ['Mon – Sat: 9:00 AM – 7:00 PM', 'Sunday: 10:00 AM – 3:00 PM'] },
    ];

    const interests = [
        'General Inquiry', 'Residential Construction', 'Commercial Construction',
        'Plot / Land Purchase', 'Construction Design', 'Interior Design',
        'Real Estate Consultation', 'Other',
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Page Header - Light Theme */}
            <div className="bg-white text-dark py-24 px-4 text-center relative overflow-hidden border-b border-gray-100">
                {/* Subtle background decoration */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop')] bg-cover"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.05)_0%,transparent_70%)]"></div>

                <div className="relative z-10 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-sky-600 text-xs font-black uppercase tracking-widest mb-6"
                    >
                        <Star className="w-3.5 h-3.5 fill-current" /> Talk To Us
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 tracking-tight text-dark">Get In <span className="text-sky-500 italic">Touch</span></motion.h1>
                    <div className="w-24 h-1.5 bg-sky-500 mx-auto rounded-full"></div>
                    <p className="text-gray-500 mt-6 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
                        Have a question, a project in mind, or just want to say hello?<br className="hidden sm:block" />We're here to help you build your future.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-5 gap-10">

                    {/* ── Left: Contact Info ───────────────────────────────────── */}
                    <div className="lg:col-span-2 space-y-6">
                        {contactDetails.map((item, idx) => (
                            <motion.div key={idx}
                                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-start gap-6 group hover:shadow-2xl hover:shadow-sky-500/5 transition-all duration-500 overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="w-14 h-14 bg-gray-50 text-dark rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-all duration-500 shadow-inner group-hover:shadow-lg group-hover:scale-110">
                                    {item.icon}
                                </div>
                                <div className="relative z-10">
                                    <h4 className="font-black text-dark text-lg mb-1 tracking-tight group-hover:text-sky-600 transition-colors">{item.label}</h4>
                                    {item.lines.map((line, i) => (
                                        <p key={i} className="text-gray-500 text-sm font-medium leading-relaxed">{line}</p>
                                    ))}
                                </div>
                            </motion.div>
                        ))}

                        {/* Google Map */}
                        <div className="rounded-[2rem] overflow-hidden h-64 shadow-xl border border-gray-100 group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.41709405615!2d79.0021439!3d21.1610859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a5a31faf13%3A0x19b37d06d0bb3e2b!2sNagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1703248384234!5m2!1sen!2sin"
                                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade" title="Lulla Estate Location"
                                className="grayscale hover:grayscale-0 transition-all duration-700"
                            ></iframe>
                        </div>
                    </div>

                    {/* ── Right: Enquiry Form ──────────────────────────────────── */}
                    <div className="lg:col-span-3">
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-gray-100 overflow-hidden"
                        >
                            <div className="bg-gray-50 p-10 border-b border-gray-100">
                                <h2 className="text-3xl font-black text-dark flex items-center gap-4 tracking-tight">
                                    <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                                        <MessageSquare className="w-7 h-7 text-sky-600" />
                                    </div>
                                    Send Us an <span className="text-sky-500 italic">Enquiry</span>
                                </h2>
                                <p className="text-gray-500 mt-3 text-base font-medium">Fill in the form — we'll get back to you within 24 hours.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-5">

                                {/* Name & Phone */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Full Name <span className="text-red-500"></span>
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                            <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                                placeholder="Your full name"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Phone Number <span className="text-red-500"></span>
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                                                placeholder="+91 98765 43210"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                                            placeholder="your@email.com (optional)"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Interested In */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Interested In <span className="text-red-500"></span>
                                    </label>
                                    <select name="interestedIn" value={formData.interestedIn} onChange={handleChange} required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50 transition-all"
                                    >
                                        {interests.map(i => <option key={i} value={i}>{i}</option>)}
                                    </select>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                                    <input type="text" name="subject" value={formData.subject} onChange={handleChange}
                                        placeholder="Brief subject of your inquiry"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50 transition-all"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Your Message <span className="text-red-500"></span>
                                    </label>
                                    <textarea name="message" value={formData.message} onChange={handleChange} required rows="5"
                                        placeholder="Tell us more about what you're looking for..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50 transition-all resize-none"
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button type="submit" disabled={status === 'sending'}
                                    className="w-full py-4 bg-dark text-white rounded-xl font-bold text-base hover:bg-sky-500 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                                >
                                    {status === 'sending' ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sending Enquiry...
                                        </>
                                    ) : (
                                        <><Send className="w-5 h-5" /> Submit Enquiry</>
                                    )}
                                </button>

                                {/* Success */}
                                {status === 'success' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        className="p-5 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-start gap-3"
                                    >
                                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold">Enquiry Submitted Successfully! 🎉</p>
                                            <p className="text-sm mt-1">We'll get back to you within 24 hours. Thank you!</p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Error */}
                                {status === 'error' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        className="p-5 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3"
                                    >
                                        <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold">Submission Failed</p>
                                            <p className="text-sm mt-1">{errorMsg || 'Please check your connection and try again.'}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </form>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactPage;
