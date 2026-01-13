import React, { useState } from "react";
import { Phone, Star, Twitter, Linkedin, Instagram } from "lucide-react";
import ReviewModal from "./ReviewModal";

export default function Footer() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  const footerColumns = [
    {
      title: "Company",
      links: ["About", "Careers", "Press", "Blog"]
    },
    {
      title: "Support",
      links: ["Help Center", "Contact", "API Docs", "Status"]
    },
    {
      title: "Legal",
      links: ["Privacy", "Terms", "Cookies", "Licenses"]
    },
    {
      title: "Products",
      links: ["AiHouseOS", "VoiceOS", "OS Studio", "Dashboard"]
    }
  ];

  const handleStarClick = (star) => {
    setRating(star);
    setShowModal(true);
  };

  const handleSubmit = (r, reviewText) => {
    setToast({ rating: r, text: reviewText });
    setShowModal(false);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      <footer className="relative bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-6">

          {/* Top section (logo + socials + rating) */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">

            {/* Branding */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                <Phone className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                  AiHouseOS
                </h3>
                <p className="text-sm text-slate-500">AI for Growth</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex flex-col items-start">
              <p className="text-sm text-slate-500 mb-1">Rate Us</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hover || rating)
                          ? "fill-yellow-400 stroke-yellow-500"
                          : "stroke-slate-400"
                      } transition`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Social icons */}
            <div className="flex gap-4">
              <Twitter className="w-5 h-5 text-slate-500 hover:text-blue-500 cursor-pointer" />
              <Linkedin className="w-5 h-5 text-slate-500 hover:text-blue-500 cursor-pointer" />
              <Instagram className="w-5 h-5 text-slate-500 hover:text-pink-500 cursor-pointer" />
            </div>

          </div>

          {/* Multi-column footer (Netflix style) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 mb-10">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-slate-500 hover:text-blue-600"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom text */}
          <p className="text-center text-xs text-slate-500">
            © 2025 VoiceOS Technologies. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showModal}
        rating={rating}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-5 py-3 rounded-lg shadow">
          <p className="font-medium">Thanks! Rated {toast.rating}★</p>
        </div>
      )}
    </>
  );
}
