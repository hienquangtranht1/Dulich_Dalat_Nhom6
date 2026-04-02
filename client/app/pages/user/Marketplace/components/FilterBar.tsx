import { useState } from 'react';
import { Search, MapPin, Clock, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filterType: string;
  setFilterType: (val: any) => void;
  showOpenNow: boolean;
  setShowOpenNow: (val: boolean) => void;
  showNearMe: boolean;
  setShowNearMe: (val: boolean) => void;
  requestGPS: () => void;
  userLocation: any;
}

export function FilterBar({
  searchTerm, setSearchTerm,
  filterType, setFilterType,
  showOpenNow, setShowOpenNow,
  showNearMe, setShowNearMe,
  requestGPS, userLocation
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const categories = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'HOTEL', label: 'Khách sạn' },
    { id: 'TOUR', label: 'Tour' },
    { id: 'RESTAURANT', label: 'Nhà hàng' },
    { id: 'CAFE', label: 'Cafe' },
    { id: 'KHAC', label: 'Dịch vụ khác' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-3 shadow-xl flex flex-wrap items-center gap-3 overflow-hidden">
      {/* Search Bar - Flex 1 Smooth Recalculation */}
      <div 
        className="relative flex-1 min-w-[200px] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] shrink-0"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm địa điểm..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 outline-none focus:ring-2 focus:ring-[#A8D5BA]/50 transition-all text-sm"
        />
      </div>

      {/* Toggle Button */}
      <button 
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`hidden md:block p-3 rounded-2xl transition-all shadow-sm border ${isExpanded ? 'bg-[#1B4D3E] dark:bg-[#10B981] text-white dark:text-slate-950 border-[#1B4D3E] dark:border-[#10B981]' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
      >
        <Filter className="w-5 h-5" />
      </button>

      {/* Category Tabs - CSS Animated max-width */}
      <div 
        className={`h-[46px] flex items-center overflow-hidden transition-[max-width,opacity,margin] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isExpanded ? 'max-w-[1000px] opacity-100 ml-1' : 'max-w-0 opacity-0 ml-0 flex-none'
        } ${isExpanded ? 'w-full md:w-auto overflow-x-auto no-scrollbar' : 'hidden md:flex'}`}
      >
        <div className="flex items-center gap-1 bg-slate-50/50 dark:bg-slate-800/50 p-1 rounded-2xl border border-slate-100 dark:border-slate-700 w-max">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilterType(cat.id)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filterType === cat.id ? 'bg-white dark:bg-slate-800 text-[#1B4D3E] dark:text-[#10B981] shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Badges - Right Side */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div 
          onClick={() => setShowOpenNow(!showOpenNow)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-sm border ${showOpenNow ? 'bg-green-500 text-white border-green-500' : 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/10 dark:border-green-800/20'}`}
        >
          <Clock className="w-4 h-4" /> <span className="hidden md:inline">Đang mở</span>
        </div>

        <div 
          onClick={() => {
            if (!userLocation && !showNearMe) requestGPS();
            setShowNearMe(!showNearMe);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-sm border ${showNearMe ? 'bg-[#F43F5E] text-white border-[#F43F5E]' : 'bg-rose-50 text-rose-500 border-rose-100 dark:bg-rose-900/10 dark:border-rose-800/20'}`}
        >
          <MapPin className="w-4 h-4" /> <span className="hidden md:inline">Gần tôi</span>
        </div>
      </div>
    </div>
  );
}
