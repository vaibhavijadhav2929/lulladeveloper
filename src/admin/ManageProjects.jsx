import React, { useState, useEffect } from 'react';
import { addDocument, getDocuments, deleteDocument, updateDocument } from '../firebase/firebaseServices';
import { ref, push, set, get } from 'firebase/database';
import { db } from '../firebase/firebaseConfig';
import { ArrowLeft, Trash2, Plus, RefreshCw, Edit2, X, CheckCircle, Upload, ImagePlus, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const EMPTY_FORM = {
    name: '', location: '', type: 'Residential',
    shortDescription: '', description: '',
    status: 'Ongoing', features: '', amenities: '', mapLink: '',
    language: 'en', // Default to English
};

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [toast, setToast] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');
    const [listFilter, setListFilter] = useState('all'); // all, en, mr

    useEffect(() => {
        const lang = document.cookie.split('; ').find(row => row.startsWith('googtrans='))?.split('=')[1]?.split('/')[2] || 'en';
        setCurrentLang(lang);
    }, []);

    const changeLanguage = (langCode) => {
        document.cookie = `googtrans=/en/${langCode}; path=/;`;
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname};`;
        window.location.reload();
    };

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const data = await getDocuments('projects');
            // Load images from RTDB project_images for each project
            const withImages = await Promise.all(data.map(async (p) => {
                const rawIds = p._imageIds;
                const imageIds = Array.isArray(rawIds) ? rawIds : (rawIds ? Object.values(rawIds) : []);

                if (imageIds.length > 0) {
                    const imgs = [];
                    const validIds = [];
                    for (const id of imageIds) {
                        try {
                            const snap = await get(ref(db, `project_images/${id}`));
                            if (snap.exists()) {
                                imgs.push(snap.val().data);
                                validIds.push(id);
                            }
                        } catch (_) { }
                    }
                    return { ...p, images: imgs, image: imgs[0] || '', _imageIds: validIds };
                }
                return p;
            }));
            setProjects(withImages);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchProjects(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Compress image to Base64 (max 600px, JPEG 60%) — keeps size under Firestore 1MB limit
    const compressToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                const MAX = 600;
                const ratio = Math.min(1, MAX / Math.max(img.width, img.height));
                const canvas = document.createElement('canvas');
                canvas.width = Math.round(img.width * ratio);
                canvas.height = Math.round(img.height * ratio);
                canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
            img.onerror = reject;
            img.src = ev.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    // Save a single base64 image as its own RTDB node → returns key
    const saveImageDoc = async (base64) => {
        const imagesRef = ref(db, 'project_images');
        const newRef = push(imagesRef);
        await set(newRef, { data: base64, createdAt: Date.now() });
        return newRef.key;
    };

    // Load base64 strings for a list of image keys from RTDB
    const loadImageDocs = async (ids = []) => {
        const results = [];
        for (const id of ids) {
            try {
                const snap = await get(ref(db, `project_images/${id}`));
                if (snap.exists()) results.push(snap.val().data);
            } catch (_) { }
        }
        return results;
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        setImageFiles((prev) => [...prev, ...files]);
        setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    };

    const handleRemoveImage = (index) => {
        const currentIds = Array.isArray(formData._imageIds) ? [...formData._imageIds] : (formData._imageIds ? Object.values(formData._imageIds) : []);
        
        if (index < currentIds.length) {
            // Removing an existing image
            currentIds.splice(index, 1);
            setFormData(prev => ({ ...prev, _imageIds: currentIds }));
        } else {
            // Removing a newly added image (file)
            setImageFiles(prev => prev.filter((_, idx) => idx !== (index - currentIds.length)));
        }
        
        // Remove from previews
        setImagePreviews(prev => prev.filter((_, idx) => idx !== index));
    };

    const resetForm = () => {
        setFormData(EMPTY_FORM);
        setImageFiles([]);
        setImagePreviews([]);
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (p) => {
        setFormData({
            name: p.name || '', location: p.location || '', type: p.type || 'Residential',
            shortDescription: p.shortDescription || '', description: p.description || '',
            status: p.status || 'Ongoing',
            features: Array.isArray(p.features) ? p.features.join('\n') : p.features || '',
            amenities: Array.isArray(p.amenities) ? p.amenities.join('\n') : p.amenities || '',
            mapLink: p.mapLink || '',
            language: p.language || 'en',
            _imageIds: p._imageIds || [],
            images: p.images || [],
        });
        setEditingId(p.id);
        setImagePreviews(p.images || (p.image ? [p.image] : []));
        setImageFiles([]);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.location) return showToast('Name and location are required!', 'error');
        setUploading(true);
        try {
            // imageIds = IDs of already-saved image docs (from editing mode)
            // Ensure imageIds is always an array (RTDB sometimes returns objects for arrays)
            const currentIds = formData._imageIds;
            let imageIds = Array.isArray(currentIds) ? [...currentIds] : (currentIds ? Object.values(currentIds) : []);
            
            // Compress new files → save each as its own RTDB doc → collect IDs
            for (const file of imageFiles) {
                try {
                    const b64 = await compressToBase64(file);
                    const id = await saveImageDoc(b64);
                    imageIds.push(id);
                } catch (imgErr) {
                    console.warn('Image save error:', imgErr);
                    showToast('One image could not be saved. Others will save.', 'error');
                }
            }

            const payload = {
                ...formData,
                _imageIds: imageIds,
                features: formData.features ? formData.features.split('\n').map(s => s.trim()).filter(Boolean) : [],
                amenities: formData.amenities ? formData.amenities.split('\n').map(s => s.trim()).filter(Boolean) : [],
                updatedAt: Date.now(), // Use timestamp for RTDB
            };

            // Remove preview/local data from payload
            delete payload.images;
            delete payload.image;

            if (editingId) {
                await updateDocument('projects', editingId, payload);
                showToast('Project updated successfully!');
            } else {
                await addDocument('projects', { ...payload, createdAt: Date.now() });
                showToast('Project added successfully!');
            }

            resetForm();
            await fetchProjects(); // Await to ensure refresh finishes before UI unlocks
        } catch (err) {
            console.error('Error saving project:', err);
            showToast(`Save failed: ${err.message || 'Check connection.'}`, 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project? This cannot be undone.')) return;
        try {
            await deleteDocument('projects', id);
            setProjects(projects.filter((p) => p.id !== id));
            showToast('Project deleted.');
        } catch (err) {
            setProjects(projects.filter((p) => p.id !== id));
            showToast('Deleted (local only — check Firebase config).', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-8">

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
                        className={`fixed top-4 right-4 z-[999] px-5 py-3 rounded-xl shadow-lg text-white text-sm font-bold flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}
                    >
                        <CheckCircle className="w-4 h-4" /> {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-5 sm:mb-6 gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <Link to="/admin/dashboard" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-500 hover:text-dark flex-shrink-0">
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-lg sm:text-2xl font-black text-dark truncate">Manage Projects</h1>
                            <p className="text-gray-400 text-xs mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
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
                        <button
                            onClick={() => { resetForm(); setShowForm((v) => !v); }}
                            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-dark text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-sky-500 transition-all shadow-md flex-shrink-0"
                        >
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden xs:inline">Add</span> Project
                        </button>
                    </div>
                </div>

                {/* Add / Edit Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mb-8"
                        >
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-lg font-black text-dark flex items-center gap-2">
                                        {editingId ? <Edit2 className="w-5 h-5 text-sky-500" /> : <Plus className="w-5 h-5 text-sky-500" />}
                                        {editingId ? 'Edit Project' : 'Add New Project'}
                                    </h2>
                                    <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Project Name *</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                                className="mt-1 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-300 outline-none transition-all"
                                                placeholder="e.g. Lulla Heights" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Location *</label>
                                            <input type="text" name="location" value={formData.location} onChange={handleChange} required
                                                className="mt-1 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-300 outline-none transition-all"
                                                placeholder="e.g. Nagpur, Maharashtra" />
                                        </div>
                                    </div>
                                    <div className="grid sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Project Type</label>
                                            <select name="type" value={formData.type} onChange={handleChange}
                                                className="mt-1 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-300 outline-none">
                                                {['Residential', 'Commercial', 'Plotting', 'Construction'].map(t => <option key={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Status</label>
                                            <select name="status" value={formData.status} onChange={handleChange}
                                                className="mt-1 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-300 outline-none">
                                                {['Ongoing', 'Completed', 'Upcoming'].map(s => <option key={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="notranslate">
                                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Display Language</label>
                                            <select name="language" value={formData.language} onChange={handleChange}
                                                className="mt-1 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-300 outline-none font-bold text-sky-600">
                                                <option value="en">English (ENG)</option>
                                                <option value="mr">Marathi (MR)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Short Description (card preview)</label>
                                        <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows="2"
                                            className="mt-1 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-300 outline-none resize-none"
                                            placeholder="2–3 lines shown on card..." />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Full Description (detail view)</label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} rows="4"
                                            className="mt-1 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-300 outline-none resize-none"
                                            placeholder="Detailed project description..." />
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Features (one per line)</label>
                                            <textarea name="features" value={formData.features} onChange={handleChange} rows="4"
                                                className="mt-1 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-300 outline-none resize-none"
                                                placeholder="e.g. 3 BHK Apartments&#10;Swimming Pool&#10;Parking Space" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Amenities (one per line)</label>
                                            <textarea name="amenities" value={formData.amenities} onChange={handleChange} rows="4"
                                                className="mt-1 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-300 outline-none resize-none"
                                                placeholder="e.g. Gym&#10;Clubhouse&#10;24/7 Security" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Google Maps Link (optional)</label>
                                        <div className="relative mt-1">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input type="url" name="mapLink" value={formData.mapLink} onChange={handleChange}
                                                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-300 outline-none"
                                                placeholder="https://maps.google.com/..." />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Project Images (multiple allowed)</label>
                                        <label className="mt-1 flex flex-col items-center justify-center w-full py-6 px-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-sky-50 hover:border-sky-300 transition-all">
                                            <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-500 font-medium">Click to upload images</span>
                                            <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — multiple files allowed</span>
                                            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                                        </label>
                                        {imagePreviews.length > 0 && (
                                            <div className="flex gap-2 mt-3 flex-wrap">
                                                {imagePreviews.map((p, i) => (
                                                    <div key={i} className="relative group">
                                                        <img src={p} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                                                        <button type="button" onClick={() => handleRemoveImage(i)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button type="submit" disabled={uploading}
                                            className="flex-1 py-3 bg-dark text-white rounded-xl font-bold text-sm hover:bg-sky-500 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                        >
                                            {uploading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</> : <><Upload className="w-4 h-4" /> {editingId ? 'Update Project' : 'Save Project'}</>}
                                        </button>
                                        <button type="button" onClick={resetForm}
                                            className="px-5 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
                                        >Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Projects List with Language Filter Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl w-fit mb-6 notranslate">
                    {['all', 'en', 'mr'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setListFilter(filter)}
                            className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${listFilter === filter ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {filter === 'all' ? 'All' : filter === 'en' ? 'English' : 'Marathi'}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><RefreshCw className="w-8 h-8 animate-spin text-sky-500" /></div>
                ) : projects.filter(p => listFilter === 'all' || (p.language || 'en') === listFilter).length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                        <span className="text-4xl mb-4 block">🏗️</span>
                        <p className="text-gray-500 font-medium tracking-tight">
                            No {listFilter !== 'all' ? (listFilter === 'en' ? 'English' : 'Marathi') : ''} projects found.
                        </p>
                    </div>
                ) : (
                    <motion.div 
                        layout
                        className={projects.filter(p => listFilter === 'all' || (p.language || 'en') === listFilter).length === 1 
                            ? "flex justify-center" 
                            : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"}
                    >
                        {projects
                            .filter(p => listFilter === 'all' || (p.language || 'en') === listFilter)
                            .map((p) => (
                            <motion.div key={p.id} layout
                                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-lg transition-all"
                            >
                                <div className="h-44 sm:h-48 bg-gray-100 relative overflow-hidden">
                                    {p.image || (p.images && p.images[0]) ? (
                                        <img src={p.image || p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                            <ImagePlus className="w-8 h-8 mb-1" />
                                            <span className="text-xs">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 notranslate">
                                        {p.type && <span className="px-2 py-0.5 bg-sky-500 text-white text-[10px] font-bold rounded-full">{p.type}</span>}
                                        <span className={`px-2 py-0.5 text-white text-[10px] font-black rounded-full shadow-sm ${p.language === 'mr' ? 'bg-orange-500' : 'bg-gray-700'}`}>
                                            {p.language === 'mr' ? 'MR' : 'ENG'}
                                        </span>
                                    </div>
                                    <span className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded-full ${p.status === 'Completed' ? 'bg-green-500 text-white' : p.status === 'Upcoming' ? 'bg-amber-500 text-white' : 'bg-sky-500 text-white'}`}>
                                        {p.status}
                                    </span>
                                    {p.images && p.images.length > 1 && (
                                        <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-white text-[10px] rounded-full">
                                            {p.images.length} photos
                                        </span>
                                    )}
                                </div>
                                <div className="p-4 flex-grow flex flex-col">
                                    <h3 className="font-black text-dark text-base line-clamp-1">{p.name}</h3>
                                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1 mt-0.5">
                                        <MapPin className="w-3 h-3 text-sky-500" /> {p.location}
                                    </p>
                                    {p.shortDescription && <p className="text-xs text-gray-400 line-clamp-2 mb-3">{p.shortDescription}</p>}
                                    <div className="mt-auto flex gap-2 pt-2 border-t border-gray-50">
                                        <button onClick={() => handleEdit(p)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(p.id)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ManageProjects;
