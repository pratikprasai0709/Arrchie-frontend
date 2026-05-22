import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, RefreshCcw } from 'lucide-react';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter and Search states
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'All');
  const [materialFilter, setMaterialFilter] = useState(searchParams.get('material') || 'All');
  const [capacityFilter, setCapacityFilter] = useState(searchParams.get('capacity') || 'All');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'newest');

  // Load from database based on parameters
  useEffect(() => {
    setLoading(true);
    
    // Construct query parameters
    const query = new URLSearchParams();
    if (searchParams.get('search')) query.set('search', searchParams.get('search')!);
    if (searchParams.get('category') && searchParams.get('category') !== 'All') query.set('category', searchParams.get('category')!);
    if (searchParams.get('material') && searchParams.get('material') !== 'All') query.set('material', searchParams.get('material')!);
    if (searchParams.get('capacity') && searchParams.get('capacity') !== 'All') query.set('capacity', searchParams.get('capacity')!);
    if (searchParams.get('sort')) query.set('sort', searchParams.get('sort')!);

    fetch(`/api/products?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error('Error fetching catalog:', e);
        setLoading(false);
      });
  }, [searchParams]);

  // Synchronize input fields if query changes externally
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
    setCategoryFilter(searchParams.get('category') || 'All');
    setMaterialFilter(searchParams.get('material') || 'All');
    setCapacityFilter(searchParams.get('capacity') || 'All');
    setSortOption(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  const applyFilters = (updates: Record<string, string>) => {
    const updatedParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, val]) => {
      if (val === 'All' || val === '') {
        updatedParams.delete(key);
      } else {
        updatedParams.set(key, val);
      }
    });

    setSearchParams(updatedParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search: searchInput });
  };

  const handleReset = () => {
    setSearchInput('');
    setCategoryFilter('All');
    setMaterialFilter('All');
    setCapacityFilter('All');
    setSortOption('newest');
    setSearchParams(new URLSearchParams());
  };

  const categories = ['All', 'Glass', 'Steel', 'Plastic'];
  const materials = ['All', 'Glass', 'Steel', 'Plastic'];
  const capacities = ['All', '500ml', '650ml', '750ml', '1L'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FAF9F6]">
      
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#E8E6E1] pb-6">
        <div>
          <span className="text-[10px] font-bold text-[#A29F98] uppercase tracking-[0.2em] block mb-1">AeroFlask Collection</span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1A1A1A] italic">
            Engineered Hydration Flasks
          </h1>
          <p className="text-xs text-stone-500 mt-1 font-sans font-light">
            Discover {products.length} elegant options matching your criteria.
          </p>
        </div>
        
        {/* Sort & Quick Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              applyFilters({ sort: e.target.value });
            }}
            className="w-full md:w-48 px-3 py-2.5 text-xs bg-white border border-[#E8E6E1] rounded-none focus:border-[#1A1A1A] focus:outline-none transition-all font-sans"
          >
            <option value="newest">Latest Additions</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          
          <button
            onClick={handleReset}
            className="p-2.5 text-stone-500 hover:text-black bg-white border border-[#E8E6E1] hover:border-[#1A1A1A] rounded-none transition-all cursor-pointer"
            title="Reset All Filters"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary catalog container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side Filters Bar */}
        <aside className="lg:col-span-1 space-y-6 bg-white p-6 border border-[#E8E6E1] rounded-none h-fit">
          <div className="flex items-center gap-2 border-b border-[#E8E6E1] pb-3 text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <h3>Fine-Tune Search</h3>
          </div>

          {/* Keyword Search */}
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <label className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">
              Keyword
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Name, brand..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF9F6] border border-[#E8E6E1] rounded-none focus:outline-none focus:border-[#1A1A1A] transition-all"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-400" />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all rounded-none cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Category Filter */}
          <div className="space-y-2.5 pt-2">
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">
              Category
            </span>
            <div className="flex flex-col gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoryFilter(cat);
                    applyFilters({ category: cat });
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-widest border transition-all cursor-pointer rounded-none ${
                    categoryFilter === cat
                      ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                      : 'bg-white border-[#E8E6E1] text-[#555] hover:border-[#1A1A1A]'
                  }`}
                >
                  {cat === 'All' ? 'All categories' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Material Build Filter */}
          <div className="space-y-2.5">
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">
              Body Material
            </span>
            <div className="flex flex-col gap-1.5">
              {materials.map((mat) => (
                <button
                  key={mat}
                  onClick={() => {
                    setMaterialFilter(mat);
                    applyFilters({ material: mat });
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-widest border transition-all cursor-pointer rounded-none ${
                    materialFilter === mat
                      ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                      : 'bg-white border-[#E8E6E1] text-[#555] hover:border-[#1A1A1A]'
                  }`}
                >
                  {mat === 'All' ? 'All Materials' : mat}
                </button>
              ))}
            </div>
          </div>

          {/* Capacity Size Filter */}
          <div className="space-y-2.5">
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">
              Fluid Capacity
            </span>
            <div className="flex flex-wrap gap-1.5">
              {capacities.map((cap) => (
                <button
                  key={cap}
                  onClick={() => {
                    setCapacityFilter(cap);
                    applyFilters({ capacity: cap });
                  }}
                  className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer rounded-none ${
                    capacityFilter === cap
                      ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                      : 'bg-white border-[#E8E6E1] text-[#555] hover:border-[#1A1A1A]'
                  }`}
                >
                  {cap === 'All' ? 'All' : cap}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* Catalog Grid */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="border border-[#E8E6E1] h-96 bg-white animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 bg-white border border-[#E8E6E1] text-center rounded-none">
              <span className="text-3xl">🔍</span>
              <h3 className="text-sm font-serif font-bold text-[#1A1A1A] mt-4 uppercase tracking-wider">No Matching Flasks</h3>
              <p className="text-xs text-stone-500 mt-2 max-w-xs leading-relaxed font-light">
                We couldn't locate any products matching the search query or filter tags. Try resetting filters or choosing a different criteria.
              </p>
              <button
                onClick={handleReset}
                className="mt-6 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white bg-[#1A1A1A] hover:bg-black transition-all rounded-none cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </main>

      </div>

    </div>
  );
}
