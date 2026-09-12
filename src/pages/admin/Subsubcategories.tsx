import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit, Trash2, Search, X, Check } from 'lucide-react';
import { fetchSubcategories, fetchSubsubcategories, addSubsubcategory, updateSubsubcategory, deleteSubsubcategory, Subcategory, Subsubcategory } from '../../services/productService';

const AdminSubsubcategories: React.FC = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [subsubcategories, setSubsubcategories] = useState<Subsubcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubsubcategory, setCurrentSubsubcategory] = useState<Subsubcategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    subcategory_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subcats, subsubcats] = await Promise.all([
        fetchSubcategories(),
        fetchSubsubcategories()
      ]);
      setSubcategories(subcats);
      setSubsubcategories(subsubcats);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (subsubcategory?: Subsubcategory) => {
    if (subsubcategory) {
      setCurrentSubsubcategory(subsubcategory);
      setFormData({
        name: subsubcategory.name,
        slug: subsubcategory.slug,
        description: subsubcategory.description || '',
        subcategory_id: subsubcategory.subcategory_id
      });
    } else {
      setCurrentSubsubcategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        subcategory_id: subcategories.length > 0 ? subcategories[0].id || '' : ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subcategory_id) {
      alert('Please select a parent subcategory.');
      return;
    }
    try {
      if (currentSubsubcategory && currentSubsubcategory.id) {
        await updateSubsubcategory(currentSubsubcategory.id, formData);
      } else {
        await addSubsubcategory(formData);
      }
      
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Failed to save subsubcategory:', error);
      alert('Failed to save subsubcategory. Please check the console for details.');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this subsubcategory?')) {
      try {
        await deleteSubsubcategory(id);
        loadData();
      } catch (error: any) {
        console.error('Failed to delete subsubcategory:', error);
        alert(error.message || 'Failed to delete subsubcategory');
      }
    }
  };

  const filteredSubsubcategories = subsubcategories.filter(subsubcat =>
    (subsubcat.name && subsubcat.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (subsubcat.description && subsubcat.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getSubcategoryName = (subcategoryId: string) => {
    const subcat = subcategories.find(c => c.id === subcategoryId);
    return subcat ? subcat.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Sub-subcategories</h1>
        <button
          onClick={() => handleOpenModal()}
          className="btn-glow text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Sub-subcategory
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input
          type="text"
          placeholder="Search sub-subcategories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full glass-panel py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-colors"
        />
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-white/5 text-slate-200 uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Parent Subcategory</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">Loading...</td>
                </tr>
              ) : filteredSubsubcategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">No sub-subcategories found.</td>
                </tr>
              ) : (
                filteredSubsubcategories.map((subsubcat) => (
                  <tr key={subsubcat.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{subsubcat.name}</td>
                    <td className="px-6 py-4 text-electric-blue">{getSubcategoryName(subsubcat.subcategory_id)}</td>
                    <td className="px-6 py-4 text-slate-500">{subsubcat.slug}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(subsubcat)}
                        className="text-electric-blue hover:text-blue-300 p-1 hover:bg-electric-blue/10 rounded transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(subsubcat.id)}
                        className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel w-full max-w-md shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0B1120]/90 backdrop-blur-md rounded-t-2xl">
                <h2 className="text-xl font-bold text-white">
                  {currentSubsubcategory ? 'Edit Sub-subcategory' : 'Add New Sub-subcategory'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Sub-subcategory Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-electric-blue focus:ring-1 focus:ring-electric-blue outline-none"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Slug (URL)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-electric-blue focus:ring-1 focus:ring-electric-blue outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Parent Subcategory</label>
                  <select
                    value={formData.subcategory_id}
                    onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })}
                    className="w-full bg-zinc-800 border border-white/10 rounded-lg p-3 text-white focus:border-electric-blue focus:ring-1 focus:ring-electric-blue outline-none"
                    required
                  >
                    <option value="" disabled>Select a subcategory</option>
                    {subcategories.map(subcat => (
                      <option key={subcat.id} value={subcat.id}>{subcat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-electric-blue focus:ring-1 focus:ring-electric-blue outline-none h-32 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-glow px-6 py-2 rounded-lg text-white font-bold flex items-center gap-2 transition-colors"
                  >
                    <Check size={20} />
                    Save Sub-subcategory
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSubsubcategories;
