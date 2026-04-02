import { Link } from 'react-router';
import { Compass, Home, ArrowLeft, CloudRain, Map } from 'lucide-react';
import { PublicLayout } from '../components/layouts/PublicLayout';

export function NotFound() {
  return (
    <PublicLayout>
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Error Illustration */}
          <div className="relative inline-block">
            <div className="text-[12rem] font-black text-slate-100 dark:text-slate-800 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-[#1B4D3E]">
              <Compass className="w-24 h-24 animate-[spin_10s_linear_infinite]" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-[#1B4D3E] dark:text-[#A8D5BA]">
              Bạn đang lạc giữa sương mù Đà Lạt?
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển đến một thung lũng khác. Đừng lo, hãy để chúng tôi dẫn bạn về nhé!
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/"
              className="px-8 py-3 rounded-2xl bg-[#1B4D3E] hover:bg-[#153D31] text-white font-bold transition-all shadow-xl shadow-[#1B4D3E]/20 flex items-center gap-2 group"
            >
              <Home className="w-5 h-5" />
              Về Trang chủ
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-8 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại trang cũ
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="pt-12 grid grid-cols-3 gap-8 opacity-20 filter grayscale hover:grayscale-0 transition-all duration-1000">
             <div className="flex flex-col items-center gap-2">
                <CloudRain className="w-8 h-8" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#1B4D3E]">Sương mù</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <Map className="w-8 h-8" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#1B4D3E]">Lạc lối</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <Compass className="w-8 h-8" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#1B4D3E]">Dẫn lối</span>
             </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
