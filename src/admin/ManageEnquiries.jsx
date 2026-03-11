import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Trash2, Mail, Phone, User, Tag, MessageSquare, CheckCircle, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

// ─── Firebase Realtime Database REST API ────────────────────────────────────
const RTDB_URL = 'https://tb-lulla-default-rtdb.firebaseio.com';

async function getEnquiries() {
    const res = await fetch(`${RTDB_URL}/enquiries.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    const data = await res.json();
    if (!data) return [];
    // RTDB returns an object where keys are auto-IDs
    return Object.entries(data)
        .map(([id, val]) => ({ id, ...val }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function updateStatus(id, newStatus) {
    const res = await fetch(`${RTDB_URL}/enquiries/${id}/status.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStatus),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

async function deleteEnquiry(id) {
    const res = await fetch(`${RTDB_URL}/enquiries/${id}.json`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

// ─── Status badge colours ─────────────────────────────────────────────────────
const statusColors = {
    New: 'bg-blue-100 text-blue-700 border-blue-200',
    Responded: 'bg-green-100 text-green-700 border-green-200',
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Closed: 'bg-gray-100 text-gray-600 border-gray-200',
};

// ─── Component ────────────────────────────────────────────────────────────────
const ManageEnquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState('All');
    const [currentLang, setCurrentLang] = useState('en');

    useEffect(() => {
        const lang = document.cookie.split('; ').find(row => row.startsWith('googtrans='))?.split('=')[1]?.split('/')[2] || 'en';
        setCurrentLang(lang);
    }, []);

    const changeLanguage = (langCode) => {
        document.cookie = `googtrans=/en/${langCode}; path=/;`;
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname};`;
        window.location.reload();
    };

    const fetchEnquiries = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getEnquiries();
            setEnquiries(data);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(`Could not load enquiries: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEnquiries(); }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateStatus(id, newStatus);
            setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
            if (selected?.id === id) setSelected(p => ({ ...p, status: newStatus }));
        } catch (err) { console.error('Status update error:', err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this enquiry permanently?')) return;
        try {
            await deleteEnquiry(id);
            setEnquiries(prev => prev.filter(e => e.id !== id));
            if (selected?.id === id) setSelected(null);
        } catch (err) { console.error('Delete error:', err); }
    };

    const formatDate = (val) => {
        if (!val) return '—';
        const d = new Date(val);
        return isNaN(d) ? val : d.toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const filtered = filter === 'All' ? enquiries : enquiries.filter(e => (e.status || 'New') === filter);
    const counts = {
        All: enquiries.length,
        New: enquiries.filter(e => !e.status || e.status === 'New').length,
        Pending: enquiries.filter(e => e.status === 'Pending').length,
        Responded: enquiries.filter(e => e.status === 'Responded').length,
        Closed: enquiries.filter(e => e.status === 'Closed').length,
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/admin/dashboard" className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:text-dark transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-dark">Enquiries Inbox</h1>
                            <p className="text-gray-500 text-sm">{enquiries.length} total — Realtime Database</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Admin Language Toggle */}
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-100 shadow-sm notranslate scale-90 sm:scale-100">
                            <button
                                onClick={() => changeLanguage('en')}
                                className={`px-2 py-1 rounded-lg text-[9px] font-black tracking-widest transition-all ${currentLang === 'en' ? 'bg-sky-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                ENG
                            </button>
                            <button
                                onClick={() => changeLanguage('mr')}
                                className={`px-2 py-1 rounded-lg text-[9px] font-black tracking-widest transition-all ${currentLang === 'mr' ? 'bg-sky-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                MR
                            </button>
                        </div>
                        <button onClick={fetchEnquiries}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} /> Refresh
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {['All', 'New', 'Pending', 'Responded', 'Closed'].map(tab => (
                        <button key={tab} onClick={() => setFilter(tab)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${filter === tab ? 'bg-dark text-white border-dark shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                                }`}
                        >
                            {tab}
                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${filter === tab ? 'bg-white/20' : 'bg-gray-100'}`}>
                                {counts[tab]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex gap-2">
                        ⚠️ {error}
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* List */}
                    <div className={`${selected ? 'hidden lg:block' : 'block'} lg:col-span-1 space-y-3`}>
                        {loading ? (
                            <div className="bg-white rounded-2xl p-10 text-center border">
                                <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                                <p className="text-gray-500">Loading from Firebase...</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="bg-white rounded-2xl p-10 text-center border">
                                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No enquiries yet</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {filter !== 'All' ? `No "${filter}" enquiries` : 'Submit the contact form to create the first one.'}
                                </p>
                            </div>
                        ) : (
                            filtered.map(enquiry => (
                                <motion.div key={enquiry.id}
                                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                    onClick={() => setSelected(enquiry)}
                                    className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${selected?.id === enquiry.id ? 'border-primary shadow-md ring-2 ring-primary/20' : 'border-gray-100'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                {(enquiry.name || '?')[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-dark text-sm">{enquiry.name || '—'}</h4>
                                                <p className="text-xs text-gray-500">{enquiry.phone || '—'}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[enquiry.status || 'New']}`}>
                                            {enquiry.status || 'New'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1 font-medium">📌 {enquiry.interestedIn || 'General Inquiry'}</p>
                                    <p className="text-xs text-gray-400 line-clamp-2">{enquiry.message}</p>
                                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {formatDate(enquiry.createdAt)}
                                    </p>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Detail Panel */}
                    <div className="lg:col-span-2">
                        {selected ? (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden"
                            >
                                <div className="bg-dark text-white p-6 flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center font-black text-dark text-lg">
                                            {(selected.name || '?')[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">{selected.name}</h2>
                                            <p className="text-gray-400 text-sm">{formatDate(selected.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setSelected(null)} className="lg:hidden p-2 bg-white/10 rounded-lg">
                                            <ArrowLeft className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(selected.id)}
                                            className="p-2 bg-red-500/20 text-red-300 hover:bg-red-500/40 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {[
                                            { icon: <User />, label: 'Full Name', value: selected.name },
                                            { icon: <Phone />, label: 'Phone', value: selected.phone, href: `tel:${selected.phone}` },
                                            { icon: <Mail />, label: 'Email', value: selected.email || 'Not provided', href: selected.email ? `mailto:${selected.email}` : null },
                                            { icon: <Tag />, label: 'Interested In', value: selected.interestedIn || 'General Inquiry' },
                                        ].map((item, i) => (
                                            <div key={i} className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                                                <div className="w-5 h-5 text-primary mt-0.5 flex-shrink-0">
                                                    {React.cloneElement(item.icon, { className: 'w-5 h-5' })}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</p>
                                                    {item.href ? (
                                                        <a href={item.href} className="font-bold text-dark mt-1 block hover:text-primary break-all">{item.value || '—'}</a>
                                                    ) : (
                                                        <p className="font-bold text-dark mt-1">{item.value || '—'}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {selected.subject && (
                                            <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3 sm:col-span-2">
                                                <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</p>
                                                    <p className="font-bold text-dark mt-1">{selected.subject}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message</p>
                                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {selected.message || '—'}
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Update Status</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['New', 'Pending', 'Responded', 'Closed'].map(s => (
                                                <button key={s} onClick={() => handleStatusChange(selected.id, s)}
                                                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${(selected.status || 'New') === s ? statusColors[s] + ' shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'
                                                        }`}
                                                >
                                                    {(selected.status || 'New') === s && <CheckCircle className="w-3.5 h-3.5 inline mr-1" />}
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100">
                                        {selected.phone && (
                                            <a href={`tel:${selected.phone}`}
                                                className="flex-1 py-3 bg-dark text-white rounded-xl font-bold text-center hover:bg-primary hover:text-dark transition-all flex items-center justify-center gap-2"
                                            >
                                                <Phone className="w-4 h-4" /> Call Now
                                            </a>
                                        )}
                                        {selected.email && (
                                            <a href={`mailto:${selected.email}?subject=RE: ${encodeURIComponent(selected.subject || 'Your Enquiry')}`}
                                                className="flex-1 py-3 bg-primary text-dark rounded-xl font-bold text-center hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                                            >
                                                <Mail className="w-4 h-4" /> Reply via Email
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="hidden lg:flex lg:flex-col items-center justify-center h-full min-h-[400px] bg-white rounded-3xl border border-dashed border-gray-200 text-center p-12">
                                <Eye className="w-16 h-16 text-gray-200 mb-4" />
                                <h3 className="text-xl font-bold text-gray-400 mb-2">Select an Enquiry</h3>
                                <p className="text-gray-400 text-sm max-w-xs">Click any enquiry from the list to view full details.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageEnquiries;
