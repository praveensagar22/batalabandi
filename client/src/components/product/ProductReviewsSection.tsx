'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Star,
  ThumbsUp,
  Camera,
  CheckCircle2,
  Filter,
  MessageSquare,
  Sparkles,
  ChevronDown,
  X,
  Plus,
  Loader2,
} from 'lucide-react';
import {
  fetchProductReviewsAPI,
  markReviewHelpfulAPI,
  ReviewItem,
  ReviewStats,
} from '@/lib/api/reviews';
import { formatImageUrl } from '@/lib/api/client';
import WriteReviewModal from './WriteReviewModal';

interface ProductReviewsSectionProps {
  productId: string;
  productTitle: string;
}

export default function ProductReviewsSection({
  productId,
  productTitle,
}: ProductReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 5.0,
    ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    allPhotos: [],
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  const [activePhotoFilter, setActivePhotoFilter] = useState<boolean>(false);
  const [activeStarFilter, setActiveStarFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'rating_high' | 'rating_low' | 'helpful'>('newest');
  
  // Lightbox Modal state
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Helpful vote loading map
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetchProductReviewsAPI(productId, {
        hasPhotos: activePhotoFilter || undefined,
        rating: activeStarFilter || undefined,
        sortBy,
      });
      setReviews(res.data.reviews || []);
      if (res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.warn('Failed to fetch reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId, activePhotoFilter, activeStarFilter, sortBy]);

  const handleHelpfulClick = async (reviewId: string) => {
    if (votedMap[reviewId]) return;
    setVotedMap((prev) => ({ ...prev, [reviewId]: true }));
    try {
      const updated = await markReviewHelpfulAPI(reviewId);
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? { ...r, helpfulCount: updated.helpfulCount } : r))
      );
    } catch (err) {
      console.warn('Failed to mark review helpful');
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-stone-200/80 font-sans">
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-stone-950 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-500 fill-amber-500" />
              Customer Reviews
            </h2>
            <p className="text-xs font-semibold text-stone-500 mt-0.5">
              Real feedback and photos from verified buyers
            </p>
          </div>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="px-4 py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-extrabold rounded-xl transition flex items-center gap-2 shadow-xs active:scale-98 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Rating Breakdown Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
          {/* Left: Overall Score Card */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-stone-50 rounded-xl border border-stone-200/60 text-center">
            <span className="text-4xl md:text-5xl font-black text-stone-950 font-mono">
              {stats.averageRating.toFixed(1)}
            </span>
            <div className="flex items-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(stats.averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs font-bold text-stone-600">
              Based on {stats.totalReviews} verified {stats.totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Right: Star Distribution Bars */}
          <div className="md:col-span-7 space-y-2 justify-center flex flex-col">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.ratingCounts[star as 1 | 2 | 3 | 4 | 5] || 0;
              const percentage =
                stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0;
              const isSelected = activeStarFilter === star;

              return (
                <button
                  key={star}
                  onClick={() => setActiveStarFilter(isSelected ? null : star)}
                  className={`flex items-center gap-3 text-xs w-full group rounded-lg p-1 transition ${
                    isSelected ? 'bg-amber-50/80 ring-1 ring-amber-300' : 'hover:bg-stone-50'
                  }`}
                >
                  <span className="font-bold text-stone-700 w-8 flex items-center gap-1">
                    {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200/60">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-stone-500 w-12 text-right">
                    {percentage}% ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Customer Photo Gallery Strip */}
        {stats.allPhotos && stats.allPhotos.length > 0 && (
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-600" />
                Customer Photo Gallery ({stats.allPhotos.length})
              </h3>
              {activePhotoFilter && (
                <button
                  onClick={() => setActivePhotoFilter(false)}
                  className="text-xs font-bold text-amber-700 hover:underline"
                >
                  Show All Reviews
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
              {stats.allPhotos.map((photo, idx) => {
                const formattedUrl = formatImageUrl(photo);
                return (
                  <button
                    key={idx}
                    onClick={() => setLightboxImage(formattedUrl)}
                    className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-stone-200 group hover:scale-105 hover:shadow-md transition duration-200"
                  >
                    <Image
                      src={formattedUrl}
                      alt={`Customer photo ${idx + 1}`}
                      fill
                      unoptimized
                      className="object-cover group-hover:opacity-90 transition"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <button
              onClick={() => {
                setActivePhotoFilter(false);
                setActiveStarFilter(null);
              }}
              className={`px-3 py-1.5 rounded-xl border transition ${
                !activePhotoFilter && activeStarFilter === null
                  ? 'bg-stone-950 text-white border-stone-950 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              All ({stats.totalReviews})
            </button>

            {stats.allPhotos.length > 0 && (
              <button
                onClick={() => setActivePhotoFilter(!activePhotoFilter)}
                className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                  activePhotoFilter
                    ? 'bg-stone-950 text-white border-stone-950 shadow-xs'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>With Photos ({stats.allPhotos.length})</span>
              </button>
            )}

            {[5, 4, 3].map((star) => (
              <button
                key={star}
                onClick={() => setActiveStarFilter(activeStarFilter === star ? null : star)}
                className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1 ${
                  activeStarFilter === star
                    ? 'bg-stone-950 text-white border-stone-950 shadow-xs'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span>{star} ★</span>
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-stone-950 font-bold focus:outline-none focus:border-stone-950 shadow-2xs"
            >
              <option value="newest">Most Recent</option>
              <option value="rating_high">Highest Rating</option>
              <option value="rating_low">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <span className="text-xs font-bold text-stone-500">Loading reviews...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="text-sm font-bold text-stone-900">No reviews found matching your filter</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Be the first to share your experience with this item!
            </p>
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl"
            >
              Write First Review
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => {
              const formattedDate = new Date(rev.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              const isVoted = votedMap[rev._id];

              return (
                <div
                  key={rev._id}
                  className="bg-white p-5 md:p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3 transition hover:border-stone-300"
                >
                  {/* Top Row: User details & Stars */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar initial badge */}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-stone-900 to-stone-800 text-amber-300 flex items-center justify-center font-bold text-sm shadow-2xs">
                        {rev.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-stone-950">{rev.userName}</span>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-400 font-medium">{formattedDate}</span>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Title & Comment */}
                  <div className="space-y-1">
                    {rev.title && (
                      <h4 className="text-xs font-extrabold text-stone-950">{rev.title}</h4>
                    )}
                    <p className="text-xs text-stone-700 leading-relaxed font-normal">{rev.comment}</p>
                  </div>

                  {/* Attached Review Photos */}
                  {rev.photos && rev.photos.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      {rev.photos.map((imgUrl, pIdx) => {
                        const fullUrl = formatImageUrl(imgUrl);
                        return (
                          <button
                            key={pIdx}
                            onClick={() => setLightboxImage(fullUrl)}
                            className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-200/80 group hover:scale-105 transition"
                          >
                            <Image
                              src={fullUrl}
                              alt={`Review attachment ${pIdx + 1}`}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Bottom Helpful Button */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleHelpfulClick(rev._id)}
                      disabled={isVoted}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
                        isVoted
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600 font-semibold'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isVoted ? 'fill-emerald-600' : ''}`} />
                      <span>
                        {isVoted ? 'Helpful!' : 'Helpful'} ({rev.helpfulCount})
                      </span>
                    </button>

                    <span className="text-[11px] font-medium text-stone-400">
                      Was this review helpful to you?
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        productId={productId}
        productTitle={productTitle}
        onSuccess={() => {
          loadReviews();
        }}
      />

      {/* Fullscreen Photo Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-3xl aspect-[4/3] max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={lightboxImage}
              alt="Customer Review Photo Fullsize"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
