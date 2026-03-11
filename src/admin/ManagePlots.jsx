import React, { useState, useEffect } from 'react';
import { addDocument, getDocuments, deleteDocument, uploadFile } from '../firebase/firebaseServices';
import { ArrowLeft, Trash2, Plus, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManagePlots = () => {
    const [plots, setPlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        plotName: '',
        location: '',
        size: '',
        price: '',
        description: ''
    });
    const [imageFile, setImageFile] = useState(null);

    const fetchPlots = async () => {
        setLoading(true);
        try {
            const data = await getDocuments('plots');
            setPlots(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlots();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleImageChange = (e) => {
        if (e.target.files[0]) setImageFile(e.target.files[0]);
    };

    const handleAddPlot = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let imageUrl = '';
            if (imageFile) {
                imageUrl = await uploadFile('plot_images', imageFile);
            }
            await addDocument('plots', { ...formData, image: imageUrl, createdAt: new Date() });
            await fetchPlots();
            setFormData({ plotName: '', location: '', size: '', price: '', description: '' });
            setImageFile(null);
        } catch (err) {
            console.error(err);
            // Fallback update
            setPlots([...plots, { id: Date.now().toString(), ...formData, image: '' }]);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this plot?")) return;
        try {
            await deleteDocument('plots', id);
            setPlots(plots.filter(p => p.id !== id));
        } catch (err) {
            console.error(err);
            setPlots(plots.filter(p => p.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/admin/dashboard" className="p-2 bg-white rounded-full shadow-sm hover:text-dark text-gray-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-dark">Manage Plots</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Add Plot Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-2"><Plus className="w-5 h-5 text-green-500" /> Add Plot</h2>
                            <form onSubmit={handleAddPlot} className="flex flex-col gap-3">
                                <input type="text" name="plotName" placeholder="Plot Name (e.g. Phase 1 Block A)" required value={formData.plotName} onChange={handleChange} className="px-4 py-2 border rounded-lg focus:ring-2 outline-none" />
                                <input type="text" name="location" placeholder="Location" required value={formData.location} onChange={handleChange} className="px-4 py-2 border rounded-lg focus:ring-2 outline-none" />
                                <div className="flex gap-2">
                                    <input type="text" name="size" placeholder="Size (2000 sqft)" required value={formData.size} onChange={handleChange} className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 outline-none" />
                                    <input type="text" name="price" placeholder="Price ($50k)" required value={formData.price} onChange={handleChange} className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 outline-none" />
                                </div>
                                <textarea name="description" placeholder="Description..." value={formData.description} onChange={handleChange} className="px-4 py-2 border rounded-lg outline-none resize-none" rows="2"></textarea>
                                <label className="text-sm font-medium text-gray-700 mt-2">Plot Image / Layout Diagram</label>
                                <input type="file" onChange={handleImageChange} className="text-sm" />
                                <button type="submit" disabled={uploading} className="mt-4 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 flex justify-center items-center gap-2">
                                    {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Add Plot'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border p-4">
                            {loading ? <div className="p-8 text-center text-gray-500">Loading...</div> :
                                plots.length === 0 ? <div className="p-8 text-center text-gray-500">No plots added yet.</div> :
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 border-b">
                                                    <th className="p-3">Name</th>
                                                    <th className="p-3">Location</th>
                                                    <th className="p-3">Size/Price</th>
                                                    <th className="p-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {plots.map(plot => (
                                                    <tr key={plot.id} className="border-b hover:bg-gray-50 relative group">
                                                        <td className="p-3 font-medium text-dark flex items-center gap-3">
                                                            {plot.image && <img src={plot.image} className="w-10 h-10 rounded object-cover" />}
                                                            {plot.plotName}
                                                        </td>
                                                        <td className="p-3 text-gray-600">{plot.location}</td>
                                                        <td className="p-3 text-sm"><span className="font-bold text-dark">{plot.size}</span><br /><span className="text-green-600 font-bold">{plot.price}</span></td>
                                                        <td className="p-3 text-right">
                                                            <button onClick={() => handleDelete(plot.id)} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagePlots;
