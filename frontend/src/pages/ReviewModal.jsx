import React, { useState } from "react";
import { Star, X, MessageSquare, Send } from "lucide-react";

export default function ReviewModal({ isOpen, onClose, onSubmit, userRating }) {
  const [reviewText, setReviewText] = useState("");
  const [tempRating, setTempRating] = useState(userRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = () => {
    if (reviewText.trim() && tempRating > 0) {
      onSubmit(tempRating, reviewText);
      setReviewText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  Share Your Experience
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your feedback helps us improve our product for everyone.
            </p>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Star Rating */}
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                How would you rate your experience?
              </p>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setTempRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-125 transition-transform duration-200"
                    aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating || tempRating)
                          ? "fill-yellow-500 stroke-yellow-500"
                          : "stroke-slate-300 dark:stroke-slate-600"
                      } transition-all duration-200`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-2">
                {tempRating > 0
                  ? `You rated ${tempRating} star${tempRating !== 1 ? 's' : ''}`
                  : "Select your rating"}
              </p>
            </div>

            {/* Review Textarea */}
            <div className="mb-6">
              <label 
                htmlFor="review" 
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Your Review (Optional)
              </label>
              <div className="relative">
                <textarea
                  id="review"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your thoughts about our product..."
                  className="w-full h-32 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
                <div className="absolute bottom-2 right-2 text-xs text-slate-400">
                  {reviewText.length}/500
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 Tip: Share what you loved or how we can improve!
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={tempRating === 0}
              className={`px-6 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-300 ${
                tempRating > 0
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
              }`}
            >
              Submit Review
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}