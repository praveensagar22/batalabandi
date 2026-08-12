'use client';

import { useState } from 'react';
import { Star, X, Upload, CheckCircle2, AlertCircle, Loader2, ImagePlus } from 'lucide-react';
import { createProductReviewAPI, uploadReviewPhotosAPI } from '@/lib/api/reviews';
import Image from 'next/image';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productTitle: string;
  onSuccess: () => void;
}

export default function WriteReviewModal({
  isOpen,
  onClose,
  productId,
  productTitle,
  onSuccess,
}: WriteReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const ratingLabels: Record<number, string> = {
    1: 'Poor - Would not recommend',
    2: 'Fair - Needs improvement',
    3: 'Average - Decent quality',
    4: 'Good - Very satisfied',
    5: 'Excellent - Absolutely loved it!',
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    const validFiles = filesArray.filter((file) => {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Only image files (JPG, PNG, WebP) are allowed');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Each photo must be less than 5MB');
        return false;
      }
      return true;
    });

    const totalFiles = [...selectedFiles, ...validFiles].slice(0, 5);
    setSelectedFiles(totalFiles);

    // Create local object URLs for previews
    const newPreviews = totalFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newPreviews);
    setErrorMsg(null);
  };

  const handleRemovePhoto = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    const updatedPreviews = updatedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(updatedPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!userName.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }
    if (!comment.trim() || comment.trim().length < 5) {
      setErrorMsg('Please enter a comment (at least 5 characters)');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Upload photos if any
      let uploadedPhotoUrls: string[] = [];
      if (selectedFiles.length > 0) {
        uploadedPhotoUrls = await uploadReviewPhotosAPI(selectedFiles);
      }

      // Step 2: Submit review payload
      await createProductReviewAPI(productId, {
        userName: userName.trim(),
        userEmail: userEmail.trim() || undefined,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
        photos: uploadedPhotoUrls,
      });

      // Reset form
      setRating(5);
      setUserName('');
      setUserEmail('');
      setTitle('');
      setComment('');
      setSelectedFiles([]);
      setPreviewUrls([]);

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <h3 className="text-base font-extrabold text-stone-950">Write a Customer Review</h3>
            <p className="text-xs font-medium text-stone-500 truncate max-w-xs">{productTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200/80 text-stone-500 hover:text-stone-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200/80 rounded-2xl flex items-center gap-2.5 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Star Rating Picker */}
          <div className="space-y-2 text-center bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60">
            <label className="text-xs font-extrabold text-stone-900 uppercase tracking-wider block">
              Overall Rating
            </label>
            <div className="flex items-center justify-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        active ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-semibold text-amber-900 h-4">
              {ratingLabels[hoverRating || rating]}
            </p>
          </div>

          {/* User Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-800 mb-1 block">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Vikram R."
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-stone-950 transition"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-800 mb-1 block">
                Email Address <span className="text-stone-400 text-[10px] font-normal">(Private)</span>
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="e.g. vikram@example.com"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-stone-950 transition"
              />
            </div>
          </div>

          {/* Review Headline / Title */}
          <div>
            <label className="text-xs font-bold text-stone-800 mb-1 block">
              Review Headline <span className="text-stone-400 text-[10px] font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Exceptional Kalamkari texture & fit!"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-stone-950 transition"
            />
          </div>

          {/* Review Comment Body */}
          <div>
            <label className="text-xs font-bold text-stone-800 mb-1 block">
              Detailed Review <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you love or dislike? How was the fit, fabric quality, and comfort?"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-stone-950 transition"
            />
          </div>

          {/* Multi-Photo Upload Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <ImagePlus className="w-3.5 h-3.5 text-stone-700" />
                <span>Upload Photos</span>
              </label>
              <span className="text-[11px] font-medium text-stone-400">
                {selectedFiles.length} / 5 photos
              </span>
            </div>

            {/* Photo Previews & Add Button */}
            <div className="flex flex-wrap gap-2.5">
              {previewUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 group shadow-xs"
                >
                  <Image src={url} alt={`Upload ${idx + 1}`} fill unoptimized className="object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 w-5 h-5 bg-stone-950/80 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-md"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {selectedFiles.length < 5 && (
                <label className="w-16 h-16 rounded-xl border-2 border-dashed border-stone-300 hover:border-stone-900 bg-stone-50 hover:bg-amber-50/50 flex flex-col items-center justify-center cursor-pointer transition text-stone-500 hover:text-stone-900">
                  <Upload className="w-4 h-4 mb-0.5" />
                  <span className="text-[9px] font-bold">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-[10px] text-stone-400">
              Share real photos of the product fit, fabric, or design. Max 5MB per image.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-stone-950 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Publishing Review...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
