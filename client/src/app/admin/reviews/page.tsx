'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Star,
  Trash2,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Search,
  Filter,
  Loader2,
  Camera,
  ExternalLink,
  ThumbsUp,
  X,
} from 'lucide-react';
import { fetchAllReviewsAPI, deleteReviewAPI, ReviewItem } from '@/lib/api/reviews';
import { formatImageUrl } from '@/lib/api/client';
import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  
  // Lightbox preview
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAllReviewsAPI({
        rating: ratingFilter || undefined,
      });
      setReviews(res.data?.reviews || []);
    } catch (err) {
      console.warn('Failed to load admin reviews', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [ratingFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer review?')) return;
    try {
      await deleteReviewAPI(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.userName.toLowerCase().includes(q) ||
      (r.title && r.title.toLowerCase().includes(q)) ||
      r.comment.toLowerCase().includes(q)
    );
  });

  const totalPhotosCount = reviews.reduce((acc, r) => acc + (r.photos?.length || 0), 0);
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      <AdminHeader />

      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Page Title & Stats Cards */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-950 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-amber-500 fill-amber-500" />
              Reviews Management
            </h1>
            <p className="text-xs font-semibold text-stone-500 mt-0.5">
              Monitor, audit, and manage customer ratings, comments, and uploaded photo proofs
            </p>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Reviews</span>
            <div className="text-2xl font-black text-stone-950 font-mono">{reviews.length}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Average Rating</span>
            <div className="text-2xl font-black text-amber-600 font-mono flex items-center gap-1">
              <span>{avgRating}</span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Customer Photos</span>
            <div className="text-2xl font-black text-emerald-600 font-mono flex items-center gap-1.5">
              <span>{totalPhotosCount}</span>
              <Camera className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, title, or text..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-stone-950 transition"
            />
          </div>

          {/* Star Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => setRatingFilter(null)}
              className={`px-3 py-1.5 rounded-xl border transition ${
                ratingFilter === null
                  ? 'bg-stone-950 text-white border-stone-950'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                onClick={() => setRatingFilter(ratingFilter === star ? null : star)}
                className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1 ${
                  ratingFilter === star
                    ? 'bg-stone-950 text-white border-stone-950'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>{star}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Table / Grid */}
        {isLoading ? (
          <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <span className="text-xs font-bold text-stone-500">Loading reviews...</span>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-stone-300 mx-auto" />
            <h3 className="text-sm font-bold text-stone-900">No reviews found</h3>
            <p className="text-xs text-stone-500">Try clearing search query or star filter</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="divide-y divide-stone-200">
              {filteredReviews.map((rev) => {
                const formattedDate = new Date(rev.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <div key={rev._id} className="p-5 hover:bg-stone-50/50 transition space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      {/* Customer Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center font-bold text-sm">
                          {rev.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-stone-950">{rev.userName}</span>
                            {rev.userEmail && (
                              <span className="text-[11px] text-stone-400 font-medium">({rev.userEmail})</span>
                            )}
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400 font-medium">{formattedDate}</span>
                        </div>
                      </div>

                      {/* Stars & Action */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-0.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-black text-amber-900">{rev.rating}.0</span>
                        </div>

                        <button
                          onClick={() => handleDelete(rev._id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-1 pl-12">
                      {rev.title && (
                        <h4 className="text-xs font-extrabold text-stone-950">{rev.title}</h4>
                      )}
                      <p className="text-xs text-stone-700 leading-relaxed font-normal">{rev.comment}</p>

                      {/* Photos */}
                      {rev.photos && rev.photos.length > 0 && (
                        <div className="flex items-center gap-2 pt-2">
                          {rev.photos.map((photo, pIdx) => {
                            const fullUrl = formatImageUrl(photo);
                            return (
                              <button
                                key={pIdx}
                                onClick={() => setActivePhoto(fullUrl)}
                                className="relative w-14 h-14 rounded-xl overflow-hidden border border-stone-200 hover:scale-105 transition shadow-xs"
                              >
                                <Image
                                  src={fullUrl}
                                  alt={`Customer photo ${pIdx + 1}`}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <div className="pt-2 flex items-center gap-4 text-[11px] text-stone-400 font-medium">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3 text-stone-400" />
                          {rev.helpfulCount} helpful votes
                        </span>
                        <Link
                          href={`/product/${rev.productId}`}
                          target="_blank"
                          className="text-stone-700 hover:underline font-semibold flex items-center gap-1"
                        >
                          View Product <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative w-full max-w-2xl aspect-[4/3] rounded-2xl overflow-hidden">
            <Image src={activePhoto} alt="Review attachment" fill unoptimized className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
