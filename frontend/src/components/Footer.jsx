import React, { useState, useRef } from "react";
import { Phone, Star, MessageSquare, Send, X, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isHalfStar, setIsHalfStar] = useState(false);
  const [selectedStar, setSelectedStar] = useState(0);
  
  const footerLinks = [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Cookies", href: "#" },
    { name: "Contact", href: "#" },
  ];

  // Handle star click - immediate modal open
  const handleStarClick = (starNumber) => {
    setSelectedStar(starNumber);
    
    if (userRating === starNumber - 0.5 && selectedStar === starNumber) {
      // Second click on same star - make it full star
      setUserRating(starNumber);
      setIsHalfStar(false);
    } else {
      // First click - half star
      setUserRating(starNumber - 0.5);
      setIsHalfStar(true);
    }
    
    // Always open modal immediately
    setShowReviewModal(true);
  };

  // Handle star hover
  const handleStarHover = (rating, isEntering) => {
    if (isEntering) {
      setHoverRating(rating);
    } else {
      setHoverRating(0);
    }
  };

  const handleSubmitReview = () => {
    if (userRating > 0) {
      console.log("Submitted:", { rating: userRating, review: reviewText });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setShowReviewModal(false);
      setReviewText("");
    }
  };

  const handleCloseModal = () => {
    setShowReviewModal(false);
    // Don't reset rating, keep it for next interaction
  };

  // Render stars with proper state
  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => {
      const isFull = userRating >= star;
      const isHalf = userRating === star - 0.5;
      const isHovered = hoverRating >= star;
      const isActive = star === selectedStar;

      return (
        <button
          key={star}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star, true)}
          onMouseLeave={() => handleStarHover(star, false)}
          className="relative w-5 h-5"
          aria-label={`Rate ${star} stars`}
        >
          {/* Base star outline - always visible */}
          <Star className="absolute w-5 h-5 stroke-slate-400 dark:stroke-slate-500 fill-transparent" />
          
          {/* Fill star for full rating */}
          {isFull && (
            <Star className="absolute w-5 h-5 fill-yellow-400 stroke-yellow-500" />
          )}
          
          {/* Fill for half star */}
          {isHalf && isActive && (
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-5 h-5 fill-yellow-400 stroke-yellow-500" />
            </div>
          )}
          
          {/* Hover effect */}
          {isHovered && !isFull && !isHalf && (
            <Star className="absolute w-5 h-5 fill-yellow-100 stroke-yellow-300" />
          )}
        </button>
      );
    });
  };

  return (
    <>
      {/* Compact Footer */}
      <footer className="relative bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Left - Brand & Description */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">AiHouseOS</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">AI for Growth</p>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xs text-center md:text-left">
                Transforming business communication with AI-powered voice agents.
              </p>
            </div>

            {/* Center - Links */}
            <div className="flex items-center gap-6">
              {footerLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Right - Stars & Social */}
            <div className="flex flex-col items-center gap-3">
              {/* Star Rating */}
              <div className="flex items-center gap-1">
                {renderStars()}
              </div>
              
              {/* Rating Text */}
              {userRating > 0 ? (
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  {isHalfStar ? "Rate: " : "Rated: "}{userRating.toFixed(1)}/5.0
                </p>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click to rate
                </p>
              )}

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <a href="#" className="p-1.5 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors duration-200">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="p-1.5 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors duration-200">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="p-1.5 text-slate-500 hover:text-pink-500 dark:text-slate-400 dark:hover:text-pink-400 transition-colors duration-200">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              © 2025 VoiceOS Technologies. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Review Modal */}
      {showReviewModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fadeIn"
            onClick={handleCloseModal}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">Share Your Feedback</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                userRating >= star 
                                  ? "fill-yellow-400 stroke-yellow-500" 
                                  : userRating >= star - 0.5
                                  ? "fill-yellow-400 stroke-yellow-500 opacity-50"
                                  : "stroke-slate-300 dark:stroke-slate-600 fill-transparent"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-yellow-500">
                          {userRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </button>
                </div>
                
                {/* Instructions */}
                <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                  {isHalfStar ? 
                    "You selected a half-star. Click the same star again to make it full, or submit your review." :
                    "You selected a full star. Submit your review or go back to adjust."
                  }
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us about your experience (optional)..."
                  className="w-full h-32 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  maxLength={300}
                />
                <div className="text-right text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {reviewText.length}/300
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-2"
                >
                  <X className="w-3.5 h-3.5" />
                  Back to Stars
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center gap-2"
                >
                  Submit Review
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 animate-slideIn">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-sm">🎉</span>
            </div>
            <div>
              <p className="font-medium text-sm">Thank You!</p>
              <p className="text-xs opacity-90">
                Your {userRating.toFixed(1)}-star review submitted
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="p-1 hover:bg-white/20 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}