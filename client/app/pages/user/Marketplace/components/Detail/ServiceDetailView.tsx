import { Compass } from 'lucide-react';
import { DetailHeader } from './DetailHeader';
import { MapSection } from './MapSection';
import { ReviewSection } from './ReviewSection';
import { BookingSidebar } from './BookingSidebar';

interface ServiceDetailViewProps {
  selectedService: any;
  onBack: () => void;
  getTypeInfo: (type: string) => any;
  // Review Props
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
  // Booking Props
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

export function ServiceDetailView(props: ServiceDetailViewProps) {
  const { selectedService, onBack, getTypeInfo } = props;

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-300 pb-12">
      <DetailHeader 
        selectedService={selectedService} 
        onBack={onBack} 
        getTypeInfo={getTypeInfo} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-[#1B4D3E] flex items-center gap-2">
              <Compass className="w-6 h-6" /> Giới thiệu về dịch vụ
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {selectedService.description || "Dịch vụ chất lượng cao được cung cấp bởi đối tác của Smart Tour Đà Lạt."}
            </p>
          </div>

          <MapSection />

          <ReviewSection 
            reviews={props.reviews}
            loadingReviews={props.loadingReviews}
            reviewType={props.reviewType}
            setReviewType={props.setReviewType}
            reviewRating={props.reviewRating}
            setReviewRating={props.setReviewRating}
            reviewContent={props.reviewContent}
            setReviewContent={props.setReviewContent}
            submittingReview={props.submittingReview}
            handleReviewSubmit={props.handleReviewSubmit}
          />
        </div>

        <div className="lg:col-span-1" id="booking-sidebar">
          <BookingSidebar 
            selectedService={selectedService}
            bookingDate={props.bookingDate}
            setBookingDate={props.setBookingDate}
            bookingQuantity={props.bookingQuantity}
            setBookingQuantity={props.setBookingQuantity}
            bookingNights={props.bookingNights}
            bookingTransport={props.bookingTransport}
            setBookingTransport={props.setBookingTransport}
            bookingLoading={props.bookingLoading}
            bookingSuccess={props.bookingSuccess}
            handleBook={props.handleBook}
          />
        </div>
      </div>
    </div>
  );
}
