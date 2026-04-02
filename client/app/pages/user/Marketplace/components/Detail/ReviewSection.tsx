import { Star, Loader2, Send } from 'lucide-react';

interface ReviewSectionProps {
  reviews: any[];
  loadingReviews: boolean;
  reviewType: 'REVIEW' | 'REPORT';
  setReviewType: (val: 'REVIEW' | 'REPORT') => void;
  reviewRating: number;
  setReviewRating: (val: number) => void;
  reviewContent: string;
  setReviewContent: (val: string) => void;
  submittingReview: boolean;
  handleReviewSubmit: () => void;
}

export function ReviewSection({
  reviews, loadingReviews,
  reviewType, setReviewType,
  reviewRating, setReviewRating,
  reviewContent, setReviewContent,
  submittingReview,
  handleReviewSubmit
}: ReviewSectionProps) {
  return (
    <div className="bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-[#1B4D3E] dark:text-[#10B981] flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
        <Star className="w-6 h-6 text-amber-400" /> Đánh giá & Báo cáo
      </h2>
      
      <div className="space-y-6 mb-10 overflow-y-auto max-h-[500px] pr-4">
        {loadingReviews ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-[#1B4D3E]" /></div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground italic border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl bg-white/50 dark:bg-slate-900/50">
            Chưa có đánh giá nào cho dịch vụ này. Hãy là người đầu tiên!
          </div>
        ) : (
          reviews.map((r, i) => (
            <div key={r.id || i} className="flex gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1B4D3E] to-[#A8D5BA] flex-shrink-0 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm">
                {r.userAvatar ? <img src={r.userAvatar} className="w-full h-full object-cover" /> : (r.userName?.charAt(0) || 'U')}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{r.userName}</span>
                  <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {r.type === 'REVIEW' ? (
                    <div className="flex gap-0.5 text-[#FBBF24]">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 \${s <= r.rating ? 'fill-current' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  ) : (
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold rounded-md uppercase">Báo cáo vi phạm</span>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">"{r.content}"</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm">
        <h4 className="text-lg font-bold mb-4 text-[#1B4D3E] dark:text-[#10B981]">Viết đánh giá hoặc báo cáo</h4>
        <div className="flex items-center gap-6 mb-6">
           <label className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="reviewType" checked={reviewType === 'REVIEW'} onChange={() => setReviewType('REVIEW')} className="w-4 h-4 text-[#1B4D3E] dark:text-[#10B981]" />
              <span className={`text-sm font-bold ${reviewType === 'REVIEW' ? 'text-[#1B4D3E] dark:text-[#10B981]' : 'text-slate-400'}`}>Đánh giá</span>
           </label>
           <label className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="reviewType" checked={reviewType === 'REPORT'} onChange={() => setReviewType('REPORT')} className="w-4 h-4 text-rose-500" />
              <span className={`text-sm font-bold ${reviewType === 'REPORT' ? 'text-rose-500' : 'text-slate-400'}`}>Báo cáo vi phạm</span>
           </label>
        </div>

        {reviewType === 'REVIEW' && (
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">Chọn mức độ hài lòng</label>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 w-fit">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="group relative focus:outline-none transition-transform active:scale-90"
                >
                  <Star
                    className={`w-8 h-8 transition-all duration-300 ${
                      star <= reviewRating
                        ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                        : 'text-slate-200 dark:text-slate-700 hover:text-amber-200'
                    }`}
                  />
                  {/* Tooltip or Label on Hover could be added here if needed */}
                </button>
              ))}
              <span className="ml-4 text-sm font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-lg">
                {reviewRating} / 5
              </span>
            </div>
          </div>
        )}

        <textarea
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          placeholder="Nhập nội dung của bạn..."
          rows={4}
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-[#A8D5BA] mb-4"
        ></textarea>

        <button
          onClick={handleReviewSubmit}
          disabled={submittingReview}
          className="flex items-center gap-2 px-8 py-3 bg-[#1B4D3E] dark:bg-[#10B981] dark:text-slate-900 hover:bg-[#153D31] dark:hover:bg-[#059669] text-white rounded-xl text-sm font-bold shadow-lg transition-all disabled:opacity-50"
        >
          {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Gửi nội dung
        </button>
      </div>
    </div>
  );
}
