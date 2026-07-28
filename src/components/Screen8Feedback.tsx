import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, Camera, Heart, CheckCircle2, Utensils, X, Sparkles } from 'lucide-react';

export const Screen8Feedback: React.FC = () => {
  const {
    selectedTable,
    branchName,
    feedback,
    setFeedback,
    isFeedbackSubmitted,
    setIsFeedbackSubmitted,
    setCurrentScreen,
    addToast,
  } = useApp();

  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [photoPreview, setPhotoPreview] = useState<string | null>(feedback.photoUrl || null);

  const starLabels: { [key: number]: string } = {
    1: '1 — Poor',
    2: '2 — Fair',
    3: '3 — Good',
    4: '4 — Great',
    5: '5 — Loved it',
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setFeedback((prev) => ({ ...prev, photoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setFeedback((prev) => ({ ...prev, photoUrl: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.rating) return;

    setIsFeedbackSubmitted(true);
    addToast('Thank you for your valuable feedback! ♥', 'success');
  };

  const handleFinish = () => {
    // Reset or return to home
    setCurrentScreen('menu');
  };

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-xl mx-auto space-y-6">
      {!isFeedbackSubmitted ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E2D9] shadow-sm space-y-6 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-1.5 bg-[#800020]" />

          <div className="w-14 h-14 bg-[#800020]/10 text-[#800020] rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-[#800020]/20">
            <Heart className="w-7 h-7 fill-[#800020]" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              How was your Truffles experience?
            </h1>
            <p className="text-xs text-[#8A8475] mt-1">
              Table {selectedTable} • {branchName} • We'd love to hear how your visit went.
            </p>
          </div>

          {/* Interactive Star Rating */}
          <div className="bg-[#F5F3EF] p-5 rounded-2xl border border-[#E5E2D9] space-y-2">
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= (hoveredStar || feedback.rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setFeedback((prev) => ({ ...prev, rating: star }))}
                    className="p-1 focus:outline-none transition-transform hover:scale-125 active:scale-95"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                        isActive
                          ? 'fill-[#FFC107] text-[#FFC107] stroke-[1.5]'
                          : 'text-[#E5E2D9] fill-white'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <p className="text-xs font-black text-[#800020] uppercase tracking-wider h-4">
              {starLabels[hoveredStar || feedback.rating] || 'Select a rating'}
            </p>
          </div>

          {/* Comment Area */}
          <div className="text-left space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[#1A1A1A]">
              Tell us more (Optional)
            </label>
            <textarea
              value={feedback.comment}
              onChange={(e) =>
                setFeedback((prev) => ({ ...prev, comment: e.target.value }))
              }
              placeholder="What did you love? What could we do better?"
              rows={3}
              className="w-full p-3.5 rounded-2xl border border-[#E5E2D9] bg-[#FAF9F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:bg-white text-[#2D2D2D] placeholder:text-[#8A8475]"
            />
          </div>

          {/* Optional Photo Upload */}
          <div className="text-left space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[#1A1A1A]">
              Add a photo (Optional)
            </label>

            {photoPreview ? (
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#E5E2D9] shadow-sm">
                <img
                  src={photoPreview}
                  alt="Feedback preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-1.5 right-1.5 p-1 bg-[#1A1A1A]/80 text-white rounded-full hover:bg-black transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-[#E5E2D9] bg-[#FAF9F6] hover:bg-[#F0EEE6] transition-colors cursor-pointer group">
                <Camera className="w-6 h-6 text-[#8A8475] group-hover:text-[#800020] mb-1 transition-colors" />
                <span className="text-xs font-bold text-[#2D2D2D]">Share a picture from your visit</span>
                <span className="text-[10px] text-[#8A8475]">JPG, PNG up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#800020] hover:bg-[#600018] text-white font-bold text-sm tracking-wide shadow-md shadow-[#800020]/20 transition-all active:scale-98"
          >
            SUBMIT FEEDBACK
          </button>
        </form>
      ) : (
        /* Thank You Screen */
        <div className="bg-white p-8 rounded-3xl border border-[#E5E2D9] shadow-xl text-center space-y-6 animate-fade-in my-8">
          <div className="w-20 h-20 bg-[#800020]/10 text-[#800020] rounded-full flex items-center justify-center mx-auto shadow-md border border-[#800020]/20">
            <Heart className="w-10 h-10 fill-[#800020]" />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              Thank You!
            </h2>
            <p className="text-sm text-[#8A8475] mt-2 max-w-xs mx-auto leading-relaxed">
              We're glad you stopped by. See you again soon at Truffles!
            </p>
          </div>

          <div className="bg-[#F5F3EF] p-4 rounded-2xl border border-[#E5E2D9] text-xs text-[#8A8475] space-y-1">
            <div className="font-bold text-[#1A1A1A]">Table {selectedTable} Session Completed</div>
            <div>{branchName}</div>
          </div>

          <button
            onClick={handleFinish}
            className="w-full py-4 rounded-2xl bg-[#800020] hover:bg-[#600018] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#FFC107]" />
            <span>DONE</span>
          </button>
        </div>
      )}
    </div>
  );
};
