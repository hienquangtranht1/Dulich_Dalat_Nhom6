import { Heart, Calendar, Users, Minus, Plus, Navigation, Clock, Loader2, CheckCircle, Check } from 'lucide-react';

interface BookingSidebarProps {
  selectedService: any;
  bookingDate: string;
  setBookingDate: (val: string) => void;
  bookingQuantity: number;
  setBookingQuantity: (val: number) => void;
  bookingNights: number;
  bookingTransport: string;
  setBookingTransport: (val: string) => void;
  bookingLoading: boolean;
  bookingSuccess: boolean;
  handleBook: (id: number) => void;
}

export function BookingSidebar({
  selectedService,
  bookingDate, setBookingDate,
  bookingQuantity, setBookingQuantity,
  bookingNights,
  bookingTransport, setBookingTransport,
  bookingLoading, bookingSuccess,
  handleBook
}: BookingSidebarProps) {
  return (
    <div className="sticky top-24 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest pl-1">Giá khuyến mãi</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#1B4D3E] dark:text-[#10B981] tracking-tighter">
              {(selectedService.salePrice || selectedService.price || 0).toLocaleString()}đ
            </span>
            <span className="text-sm text-slate-400 line-through font-bold decoration-2">
              {(selectedService.originalPrice || (selectedService.salePrice || selectedService.price || 0) * 1.2).toLocaleString()}đ
            </span>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
           <Heart className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Check-in Date */}
        <div className="p-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 flex items-center gap-5 transition-all hover:border-[#10B981]/30">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Calendar className="w-6 h-6 text-[#1B4D3E] dark:text-[#10B981]" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em] mb-1">Ngày chọn</p>
            <input
              type="date"
              value={bookingDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full bg-transparent outline-none font-black text-slate-800 dark:text-white text-base"
            />
          </div>
        </div>

        {/* Quantity / Guests */}
        <div className="p-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 flex items-center gap-5 transition-all hover:border-[#10B981]/30">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Users className="w-6 h-6 text-[#1B4D3E] dark:text-[#10B981]" />
          </div>
          <div className="flex-1 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em] mb-1">{selectedService.serviceType === 'HOTEL' ? 'Số phòng' : 'Số lượng khách'}</p>
              <span className="font-black text-slate-800 dark:text-white text-base">{bookingQuantity} {selectedService.serviceType === 'HOTEL' ? 'Phòng' : 'Khách'}</span>
            </div>
            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
              <button onClick={() => setBookingQuantity(Math.max(1, bookingQuantity - 1))} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-[#1B4D3E]"><Minus className="w-3.5 h-3.5" /></button>
              <button onClick={() => setBookingQuantity(bookingQuantity + 1)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-[#1B4D3E]"><Plus className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>

        {/* Transport */}
        <div className="p-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 flex items-center gap-5 transition-all hover:border-[#10B981]/30">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Navigation className="w-6 h-6 text-[#1B4D3E] dark:text-[#10B981]" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em] mb-1">Phương tiện di chuyển</p>
            <select 
              value={bookingTransport}
              onChange={(e) => setBookingTransport(e.target.value)}
              className="w-full bg-transparent dark:bg-slate-800/10 outline-none font-black text-slate-800 dark:text-white text-base appearance-none cursor-pointer dark:[color-scheme:dark]"
            >
               <option className="dark:bg-slate-900 dark:text-white" value="Xe máy">🛵 Xe máy</option>
               <option className="dark:bg-slate-900 dark:text-white" value="Ô tô / Taxi">🚗 Ô tô / Taxi</option>
               <option className="dark:bg-slate-900 dark:text-white" value="Xe đạp">🚲 Xe đạp</option>
            </select>
          </div>
        </div>

        <div className="p-4 space-y-3 text-xs bg-slate-50/30 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <div className="flex justify-between">
               <span className="text-slate-400 flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Giờ mở cửa</span>
               <span className="font-bold text-slate-600 dark:text-slate-300">{selectedService.openingTime || '00:00'} - {selectedService.closingTime || '23:59'}</span>
            </div>
            <div className="flex justify-between">
               <span className="text-slate-400 flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Sức chứa / Còn lại</span>
               <span className="font-bold text-slate-600 dark:text-slate-300">50 Khách</span>
            </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 text-sm">
        <div className="flex justify-between text-slate-400">
          <span>Giá tạm tính</span>
          <span>{((selectedService.salePrice || selectedService.price) * bookingQuantity).toLocaleString()}đ</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Phí dịch vụ</span>
          <span className="text-[#10B981] font-bold italic">Miễn phí</span>
        </div>
        <div className="flex justify-between font-bold text-slate-800 dark:text-white text-lg pt-4 border-t border-slate-100 dark:border-slate-800">
          <span>Tổng cộng</span>
          <span className="text-[#1B4D3E] dark:text-[#10B981]">
            {((selectedService.salePrice || selectedService.price) * bookingQuantity * (selectedService.serviceType === 'HOTEL' ? bookingNights : 1)).toLocaleString()}đ
          </span>
        </div>
      </div>

      <button
        onClick={() => handleBook(selectedService.id)}
        disabled={bookingLoading || bookingSuccess}
        className={`w-full py-5 rounded-2xl font-bold text-white dark:text-slate-900 transition-all shadow-xl flex items-center justify-center gap-2 ${bookingSuccess ? 'bg-green-500' : 'bg-[#1B4D3E] dark:bg-[#10B981] hover:bg-[#153D31] dark:hover:bg-[#059669]'}`}
      >
        {bookingLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (bookingSuccess ? <CheckCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />)}
        {bookingSuccess ? 'Đã đặt dịch vụ!' : (bookingLoading ? 'Đang xử lý...' : 'Đặt Ngay')}
      </button>
    </div>
  );
}
