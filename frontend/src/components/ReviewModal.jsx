import React, { useState } from "react";
import { Star, X, MessageSquare, Send } from "lucide-react";

export default function ReviewModal({ isOpen, rating, onClose, onSubmit }) {
  const [text, setText] = useState("");
  const [tempRating, setTempRating] = useState(rating);
  const [hover, setHover] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!tempRating) return;
    onSubmit(tempRating, text.trim());
    setText("");
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl shadow-xl border border-slate-300 dark:border-slate-700"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <MessageSquare className="text-white w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                Write a Review
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
          </div>

          {/* Rating */}
          <div className="p-6">
            <div className="flex justify-center mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setTempRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="p-1"
                >
                  <Star
                    className={`w-8 h-8 transition ${
                      star <= (hover || tempRating)
                        ? "fill-yellow-400 stroke-yellow-500"
                        : "stroke-slate-300 dark:stroke-slate-600"
                    }`}
                  />
                </button>
              ))}
            </div>

            <p classname="text-center text-sm text-slate-500 dark:text-slate-400 mb-4">
              {tempRating ? `You selected ${tempRating} stars` : "Tap to rate"}
            </p>

            {/* Textbox */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts (optional)"
              className="w-full h-32 p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 ring-blue-500 outline-none resize-none"
              maxLength={300}
            />

            <div className="text-right text-xs text-slate-500 mt-1">
              {text.length}/300
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-slate-200 dark:border-slate-700 flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              Submit
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
