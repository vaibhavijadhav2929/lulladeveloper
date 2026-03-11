import React, { useState, useEffect } from 'react';
import { addDocument, getDocuments, deleteDocument, uploadFile } from '../firebase/firebaseServices';
import { ArrowLeft, Trash2, Plus, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageDesigns = () => {
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [title, setTitle] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const fetchDesigns = async () => {
        setLoading(true);
        try {
            const data = await getDocuments('designs');
            setDesigns(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDesigns();
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files[0]) setImageFile(e.target.files[0]);
    };

    const handleAddDesign = async (e) => {
        e.preventDefault();
        if (!title || !imageFile) return alert("Title and Image are required!");

        setUploading(true);
        try {
            const imageUrl = await uploadFile('design_images', imageFile);
            await addDocument('designs', { title, image: imageUrl, createdAt: new Date() });
            await fetchDesigns();
            setTitle('');
            setImageFile(null);
        } catch (err) {
            console.error(err);
            // Fallback update
            setDesigns([...designs, { id: Date.now().toString(), title, image: '' }]);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this design?")) return;
        try {
            await deleteDocument('designs', id);
            setDesigns(designs.filter(d => d.id !== id));
        } catch (err) {
            console.error(err);
            setDesigns(designs.filter(d => d.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/admin/dashboard" className="p-2 bg-white rounded-full shadow-sm hover:text-dark text-gray-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-dark">Manage Construction Designs</h1>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-2xl mx-auto">
                    <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-4 mb-4"><Plus className="w-5 h-5 text-indigo-500" /> Upload New Design</h2>
                    <form onSubmit={handleAddDesign} className="flex flex-col md:flex-row gap-4">
                        <input type="text" placeholder="Design Title (e.g. Modern Villa Elevation)" required value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 outline-none" />
                        <div className="flex-1 relative">
                            <input type="file" required accept="image/*" onChange={handleImageChange} className="w-full text-sm font-semibold file:bg-indigo-50 file:text-indigo-600 file:border-0 file:px-4 file:py-2 file:rounded-lg file:mr-4" />
                        </div>
                        <button type="submit" disabled={uploading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
                            {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Upload'}
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-4"><ImageIcon className="w-5 h-5" /> Design Gallery ({designs.length})</h3>
                    {loading ? <div className="text-center p-8 text-gray-500">Loading Designs...</div> :
                        designs.length === 0 ? <div className="text-center p-8 text-gray-500 border-2 border-dashed rounded-xl border-gray-200">No designs uploaded.</div> :
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {designs.map(design => (
                                    <div key={design.id} className="relative group rounded-xl overflow-hidden border bg-gray-100 shadow-sm">
                                        <div className="aspect-square bg-gray-200">
                                            {design.image ? <img src={design.image} alt={design.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex justify-center items-center">No Image</div>}
                                        </div>
                                        <div className="absolute inset-0 bg-dark/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                            <h4 className="text-white font-bold text-sm truncate">{design.title}</h4>
                                            <button onClick={() => handleDelete(design.id)} className="mt-2 text-red-400 hover:text-white hover:bg-red-500 bg-red-500/20 py-1.5 px-3 rounded text-sm transition-colors flex items-center justify-center gap-2">
                                                <Trash2 className="w-3 h-3" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default ManageDesigns;
