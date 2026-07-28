import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MENU_ITEMS, CATEGORIES } from '../data/menuData';
import { FoodTypeFilter, SortOption, MenuItem } from '../types';
import {
  Search,
  X,
  Star,
  Plus,
  Sparkles,
  SlidersHorizontal,
  Flame,
  Utensils,
} from 'lucide-react';

export const Screen3MenuBrowser: React.FC = () => {
  const { setSelectedItemForModal, selectedTable, setIsChangeTableModalOpen } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('Popular');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [foodTypeFilter, setFoodTypeFilter] = useState<FoodTypeFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('popular');

  // Filter & Sort Logic
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Search filter
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Veg / Non-Veg filter
      if (foodTypeFilter === 'veg' && !item.isVeg) return false;
      if (foodTypeFilter === 'non-veg' && item.isVeg) return false;

      // Category filter
      if (activeCategory === 'Popular') {
        // Show bestsellers and top rated
        return item.isBestSeller || item.rating >= 4.8;
      } else {
        return item.category === activeCategory;
      }
    }).sort((a, b) => {
      if (sortOption === 'price-low') return a.price - b.price;
      if (sortOption === 'price-high') return b.price - a.price;
      if (sortOption === 'rating') return b.rating - a.rating;
      // Default popular
      return b.reviewCount - a.reviewCount;
    });
  }, [searchQuery, foodTypeFilter, activeCategory, sortOption]);

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
      {/* Search Bar & Table Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8A8475] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Truffles burgers, sizzlers, shakes..."
            className="w-full pl-10 pr-10 py-3 bg-white rounded-2xl border border-[#E5E2D9] text-[#2D2D2D] text-sm focus:outline-none focus:ring-2 focus:ring-[#800020] shadow-2xs placeholder:text-[#8A8475]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8A8475] hover:text-[#1A1A1A] rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Table Switcher */}
        <button
          onClick={() => setIsChangeTableModalOpen(true)}
          className="sm:shrink-0 flex items-center justify-center gap-2 bg-[#2D2D2D] text-white px-4 py-3 rounded-2xl text-xs font-bold shadow-xs hover:bg-[#1A1A1A] transition-all border border-[#2D2D2D]"
        >
          <Utensils className="w-4 h-4 text-[#800020]" />
          <span>Ordering for Table {selectedTable}</span>
          <span className="text-[10px] text-[#8A8475] underline ml-1">Change</span>
        </button>
      </div>

      {/* Categories Tabs - Horizontally Scrollable */}
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 py-1">
        <div className="flex items-center gap-2 min-w-max">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchQuery('');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#800020] text-white shadow-sm scale-102'
                    : 'bg-white text-[#2D2D2D] hover:bg-[#F0EEE6] border border-[#E5E2D9]'
                }`}
              >
                {cat === 'Popular' && <Flame className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFC107]' : 'text-[#800020]'}`} />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-[#E5E2D9] shadow-2xs">
        {/* Veg / Non-Veg Toggle Pills */}
        <div className="flex items-center gap-1 bg-[#FAF9F6] p-1 rounded-xl border border-[#E5E2D9]">
          <button
            onClick={() => setFoodTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              foodTypeFilter === 'all'
                ? 'bg-white text-[#2D2D2D] shadow-2xs border border-[#E5E2D9]'
                : 'text-[#8A8475] hover:text-[#800020]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFoodTypeFilter('veg')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              foodTypeFilter === 'veg'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'text-[#8A8475] hover:text-[#800020]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#4CAF50]" />
            <span>Veg</span>
          </button>
          <button
            onClick={() => setFoodTypeFilter('non-veg')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              foodTypeFilter === 'non-veg'
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'text-[#8A8475] hover:text-[#800020]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span>Non-Veg</span>
          </button>
        </div>

        {/* Sorting dropdown */}
        <div className="flex items-center gap-1.5 text-xs text-[#5C574E] font-medium pr-1">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#8A8475] hidden xs:inline" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="bg-[#FAF9F6] border border-[#E5E2D9] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#800020]"
          >
            <option value="popular">Popularity</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Menu Cards Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} onSelect={() => setSelectedItemForModal(item)} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-[#E5E2D9] p-10 text-center flex flex-col items-center gap-3 my-8">
          <div className="w-16 h-16 rounded-2xl bg-[#F5F3EF] text-[#800020] flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#1A1A1A]">No dishes found</h3>
          <p className="text-xs text-[#8A8475] max-w-xs">
            We couldn't find any dishes matching "{searchQuery}". Try searching for something else or reset filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFoodTypeFilter('all');
              setActiveCategory('Burgers');
            }}
            className="mt-2 px-5 py-2.5 bg-[#800020] text-white rounded-xl text-xs font-bold hover:bg-[#600018] transition-colors"
          >
            Clear Filters & View Menu
          </button>
        </div>
      )}
    </div>
  );
};

// Reusable Food Card Component
const MenuCard: React.FC<{ item: MenuItem; onSelect: () => void }> = ({ item, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-2xl border border-[#F0EEE6] hover:border-[#E5E2D9] p-4 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 cursor-pointer group hover:-translate-y-0.5 relative overflow-hidden"
    >
      <div className="flex gap-3.5">
        {/* Left Dish Info */}
        <div className="flex-1 space-y-1.5">
          {/* Veg / Non-Veg Icon & Bestseller */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center justify-center w-4 h-4 rounded border-2 bg-white ${
                item.isVeg ? 'border-[#4CAF50]' : 'border-red-600'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  item.isVeg ? 'bg-[#4CAF50]' : 'bg-red-600'
                }`}
              />
            </span>

            {item.isBestSeller && (
              <span className="bg-green-100 text-green-800 text-[9px] font-bold px-2 py-0.5 rounded border border-green-200 uppercase tracking-wider">
                Best Seller
              </span>
            )}
          </div>

          <h3 className="font-bold text-[#1A1A1A] text-base leading-snug group-hover:text-[#800020] transition-colors">
            {item.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-[#8A8475] font-semibold">
            <Star className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
            <span>{item.rating}</span>
            <span className="text-[#E5E2D9]">•</span>
            <span className="text-[#800020] font-bold text-sm">₹{item.price}</span>
          </div>

          <p className="text-xs text-[#8A8475] line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Right Dish Image & ADD CTA */}
        <div className="relative shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-[#FAF9F6] border border-[#E5E2D9]">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* ADD Button overlay */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#800020] text-white hover:bg-[#600018] px-4 py-1.5 rounded-lg font-bold text-xs shadow-md border border-white/20 transition-all flex items-center gap-1 active:scale-95"
          >
            <span>ADD</span>
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
