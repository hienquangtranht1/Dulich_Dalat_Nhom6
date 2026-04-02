import { X, MapPin, Star } from 'lucide-react';
import { Thumbnail } from '../../../../../components/ui/Thumbnail';

interface DetailHeaderProps {
  selectedService: any;
  onBack: () => void;
  getTypeInfo: (type: string) => any;
}

export function DetailHeader({ selectedService, onBack, getTypeInfo }: DetailHeaderProps) {
  return (
    <>
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-slate-500 hover:text-[#1B4D3E] dark:hover:text-[#10B981] transition-colors"
      >
        <X className="w-5 h-5" /> Quay lại Marketplace
      </button>

      <div className="relative w-full h-[400px] rounded-[2rem] overflow-hidden mb-8 shadow-lg">
        <Thumbnail
          src={selectedService.imageUrl}
          alt={selectedService.name}
          type={selectedService.serviceType}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full bg-[#1B4D3E]/80 dark:bg-[#10B981]/90 backdrop-blur-md border border-white/20 dark:border-white/40 text-sm font-medium text-white dark:text-slate-950">
              {getTypeInfo(selectedService.serviceType).label}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2 drop-shadow-md">{selectedService.serviceName || selectedService.name}</h1>
          <div className="flex items-center gap-4 text-white/90">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>Đà Lạt, Lâm Đồng</span>
            </div>
            <div className="flex items-center gap-1 text-[#FBBF24]">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-medium text-white">4.8 (100+ đánh giá)</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
