import { MapPin } from 'lucide-react';

export function MapSection() {
  return (
    <div className="bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm relative z-0">
      <h2 className="text-2xl font-bold mb-4 text-[#1B4D3E] dark:text-[#10B981] flex items-center gap-2">
        <MapPin className="w-6 h-6 text-[#10B981]" /> Vị trí / Bản đồ
      </h2>
      <div id="service-map" className="w-full h-[400px] rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden relative z-0">
         <div className="flex items-center justify-center h-full text-muted-foreground italic">Đang tải bản đồ...</div>
      </div>
    </div>
  );
}
