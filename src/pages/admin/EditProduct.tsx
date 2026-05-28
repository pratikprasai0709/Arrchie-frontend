import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import { ArrowLeft, Save, Sparkles, AlertCircle, Upload, X } from 'lucide-react';

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Glass');
  const [stockQuantity, setStockQuantity] = useState('');
  const [brand, setBrand] = useState('');
  const [capacity, setCapacity] = useState('750ml');
  const [material, setMaterial] = useState('Glass');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [imageSource, setImageSource] = useState<'current' | 'file' | 'url'>('current');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [newUrlsList, setNewUrlsList] = useState<string[]>(['']);

  const templates = [
    { name: 'Glass Vessel', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600' },
    { name: 'Vacuum Steel', url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=600' },
    { name: 'Sports Tritan', url: 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?auto=format&fit=crop&q=80&w=600' },
    { name: 'Glass Infuser', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    
    setErr(null);
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setErr(`Image file "${file.name}" size must be less than 5MB.`);
        continue;
      }
      validFiles.push(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
    
    setNewImageFiles(prev => [...prev, ...validFiles]);
  };

  const removeImageFile = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUrlChange = (index: number, val: string) => {
    const updated = [...newUrlsList];
    updated[index] = val;
    setNewUrlsList(updated);
  };

  const addUrlInput = () => {
    setNewUrlsList([...newUrlsList, '']);
  };

  const removeUrlInput = (index: number) => {
    setNewUrlsList(newUrlsList.filter((_, i) => i !== index));
  };

  const handleTemplateSelect = (url: string) => {
    if (newUrlsList.length === 1 && newUrlsList[0] === '') {
      setNewUrlsList([url]);
    } else {
      setNewUrlsList([...newUrlsList, url]);
    }
  };

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        setName(data.name);
        setDescription(data.description);
        setPrice(String(data.price));
        setCategory(data.category);
        setStockQuantity(String(data.stockQuantity));
        setExistingImages(data.productImages && data.productImages.length > 0 ? data.productImages : [data.productImage]);
        setBrand(data.brand);
        setCapacity(data.capacity);
        setMaterial(data.material);
        setLoading(false);
      })
      .catch((e) => {
        console.error('Error fetching details under edit:', e);
        setErr('Requested product entry is missing.');
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const hasExisting = existingImages.length > 0;
    const hasNewFiles = imageSource === 'file' && newImageFiles.length > 0;
    const filteredNewUrls = imageSource === 'url' ? newUrlsList.filter(Boolean) : [];
    const hasNewUrls = filteredNewUrls.length > 0;

    if (!hasExisting && !hasNewFiles && !hasNewUrls) {
      setErr('A product must have at least one image.');
      return;
    }

    setSaving(true);
    setErr(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('stockQuantity', stockQuantity);
      formData.append('brand', brand);
      formData.append('capacity', capacity);
      formData.append('material', material);

      let baseImages = [...existingImages];
      if (imageSource === 'url') {
        baseImages = [...baseImages, ...filteredNewUrls];
      }
      
      formData.append('productImages', JSON.stringify(baseImages));

      if (imageSource === 'file' && newImageFiles.length > 0) {
        newImageFiles.forEach((file) => {
          formData.append('productImages', file);
        });
      }

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.message || 'Failed to update flask entry details.');
        setSaving(false);
        return;
      }

      setSuccess(true);
      setSaving(false);
      
      setTimeout(() => {
        navigate('/admin/manage-products');
      }, 1500);

    } catch (e) {
      setErr('A network connection error blocked the save request.');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-10 overflow-y-auto animate-fade-in">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/manage-products')}
            className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight font-sans">
              Edit Flask Model
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Update name, descriptions, or prices inside the central catalog database.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-2 p-12 text-center">
            <div className="w-8 h-8 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto"></div>
            <p className="text-xs font-mono text-slate-500">Refining current specification states...</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl">
            {success && (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl">
                ✨ Core details committed successfully! Redirection pending...
              </div>
            )}

            {err && (
              <div className="p-4 bg-rose-500/20 border border-rose-500/20 text-rose-450 text-xs font-semibold rounded-xl">
                ❌ {err}
              </div>
            )}

            {/* Core Form Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 text-white border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-hidden transition-all"
                  />
                </div>

                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                    Model Description Detail *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 text-white border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-hidden transition-all font-sans leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                    Price Amount (Rs.) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 text-white border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-hidden transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                    Total Inventory Stock (Units) *
                  </label>
                  <input
                    type="number"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 text-white border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-hidden transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                    Category Code *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 text-white border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-hidden transition-all font-sans"
                  >
                    <option value="Glass">Glass Group</option>
                    <option value="Steel">Steel Group</option>
                    <option value="Plastic">Plastic Group</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                    Housing Material *
                  </label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 text-white border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-hidden transition-all font-sans"
                  >
                    <option value="Glass">Borosilicate Glass</option>
                    <option value="Steel">Stainless Steel</option>
                    <option value="Plastic">Tritan Plastic</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                    Manufacturing Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 text-white border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-hidden transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                    Flask Capacity *
                  </label>
                  <select
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 text-white border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-hidden transition-all font-sans"
                  >
                    <option value="500ml">500ml size</option>
                    <option value="650ml">650ml size</option>
                    <option value="750ml">750ml size</option>
                    <option value="1L">1L size</option>
                  </select>
                </div>

            <div className="space-y-4 col-span-1 md:col-span-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                Product Image Catalog
              </label>

              {/* 1. Display Current Active Images */}
              {existingImages.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">Current Images (first is primary):</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                    {existingImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2 flex flex-col gap-2">
                        <img
                          src={imgUrl}
                          alt={`Current ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-slate-850"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-3 right-3 p-1 bg-rose-500/80 hover:bg-rose-600 text-white rounded-md transition-all cursor-pointer shadow-lg"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-450 text-xs rounded-xl">
                  ⚠️ No active images in catalog. Please upload or add at least one image below.
                </div>
              )}

              {/* 2. Upload / Add More Images */}
              <div className="border-t border-slate-800 pt-4 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-xs font-semibold text-slate-400">Add More Images:</p>
                  <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setImageSource('file');
                        setErr(null);
                      }}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                        imageSource === 'file'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Upload Files
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageSource('url');
                        setErr(null);
                      }}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                        imageSource === 'url'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      New URLs
                    </button>
                  </div>
                </div>

                {imageSource === 'file' && (
                  <div className="space-y-4">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl cursor-pointer bg-slate-950/50 hover:bg-slate-950/80 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-4 pb-4">
                        <Upload className="w-6 h-6 text-slate-500 group-hover:text-amber-500 transition-colors mb-2" />
                        <p className="text-xs font-semibold text-slate-400 group-hover:text-slate-350 transition-colors">
                          Click to select new files to upload
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono mt-1">
                          PNG, JPG, JPEG up to 5MB each
                        </p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>

                    {newImagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {newImagePreviews.map((preview, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2 flex flex-col gap-2">
                            <img
                              src={preview}
                              alt={`New Preview ${idx + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-slate-850"
                            />
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold text-slate-350 truncate">
                                {newImageFiles[idx]?.name}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImageFile(idx)}
                              className="absolute top-3 right-3 p-1 bg-rose-500/80 hover:bg-rose-600 text-white rounded-md transition-all cursor-pointer shadow-lg"
                              title="Remove image"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {imageSource === 'url' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {newUrlsList.map((url, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => handleUrlChange(idx, e.target.value)}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="flex-1 px-3.5 py-2 text-sm bg-slate-950 text-white border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-hidden transition-all font-mono"
                          />
                          {newUrlsList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeUrlInput(idx)}
                              className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-450 hover:bg-rose-500 hover:text-white rounded-xl transition-all cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={addUrlInput}
                      className="px-3.5 py-2 text-xs bg-slate-950 hover:bg-slate-900 border border-slate-800 text-amber-500 font-bold rounded-xl transition-all cursor-pointer"
                    >
                      + Add Another Image URL
                  </button>

                  <div className="pt-1 text-xs space-y-1.5">
                    <span className="text-slate-400 block font-sans">
                      💡 Catalog Suggested Templates:
                    </span>
                    <div className="flex flex-wrap gap-2 text-slate-350">
                      {templates.map((tpl) => (
                        <button
                          key={tpl.name}
                          type="button"
                          onClick={() => handleTemplateSelect(tpl.url)}
                          className="px-2.5 py-1 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer text-slate-300 font-sans"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          {tpl.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

                <div className="col-span-1 md:col-span-2 pt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold font-sans shadow-lg shadow-amber-500/5 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-slate-950" />
                    {saving ? 'Saving changes...' : 'Save Catalog Specification Changes'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
