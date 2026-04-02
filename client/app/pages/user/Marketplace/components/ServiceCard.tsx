import { Star, Navigation, Clock, ArrowUpRight } from 'lucide-react';
import { Thumbnail } from '../../../../components/ui/Thumbnail';

interface ServiceCardProps {
  service: any;
  userLocation: any;
  getDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
  isServiceOpen: (s: any) => boolean;
  getTypeInfo: (type: string) => any;
  onSelect: (s: any) => void;
}

export function ServiceCard({
  service,
  userLocation,
  getDistance,
  isServiceOpen,
  getTypeInfo,
  onSelect
}: ServiceCardProps) {
  const info = getTypeInfo(service.serviceType);
  const isOpen = isServiceOpen(service);

  return (
    <div
      onClick={() => onSelect(service)}
      className="group cursor-pointer bg-card rounded-[2.5rem] overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
    >
      <div className="relative h-56 overflow-hidden">
        <Thumbnail
          src={service.imageUrl}
          alt={service.name}
          type={service.serviceType}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Status Badges */}
        <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-[#1B4D3E]/80 dark:bg-[#10B981]/90 backdrop-blur-md text-white dark:text-slate-950 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg border border-white/20 dark:border-white/40">
          <info.icon className="w-3 h-3" />
          {info.label}
        </div>

        {userLocation && service.mapPoints && (
          <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-[#1B4D3E] dark:text-[#10B981] text-[10px] font-bold shadow-lg border border-slate-100 flex items-center gap-1.5">
             <Navigation className="w-3 h-3 text-[#10B981]" />
             {(() => {
                const firstPoint = service.mapPoints.split('|').filter((x: string) => x)[0];
                if (!firstPoint) return "";
                const coords = firstPoint.split(';')[0].split(',');
                const dist = getDistance(userLocation.lat, userLocation.lng, parseFloat(coords[0]), parseFloat(coords[1]));
                return dist > 1 ? dist.toFixed(1) + "km" : Math.round(dist * 1000) + "m";
             })()}
          </div>
        )}

        {!isOpen && (
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
              <div className="px-6 py-2 bg-slate-900/60 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/10">
                 <Clock className="w-3.5 h-3.5 text-orange-400" /> Hiện tại đóng cửa
              </div>
           </div>
        )}
      </div>

      <div className="p-7 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-black text-xl md:text-2xl tracking-tight line-clamp-1 group-hover:text-[#1B4D3E] dark:group-hover:text-[#10B981] transition-colors text-slate-800 dark:text-slate-200">
            {service.serviceName || service.name}
          </h3>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-black text-amber-600">4.8</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
          {service.description || "Dịch vụ chất lượng cao tại Đà Lạt, mang lại trải nghiệm tuyệt vời cho hành trình của bạn."}
        </p>

        <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-[11.5px] font-medium text-slate-500 mb-0.5 tracking-tight">Giá khuyến mãi</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-extrabold text-[#1B4D3E] dark:text-[#10B981] tracking-tighter">
                {(service.salePrice || service.price || 0).toLocaleString()}đ
              </div>
              <div className="text-xs text-slate-400 line-through decoration-1">
                {(service.originalPrice || (service.salePrice || service.price || 0) * 1.2).toLocaleString()}đ
              </div>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-[#1B4D3E] dark:group-hover:bg-[#10B981] group-hover:text-white transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-[#1B4D3E]/20 dark:group-hover:shadow-[#10B981]/20 text-slate-400">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
