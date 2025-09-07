import React from "react";
import { Sparkles } from "lucide-react";

export const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-4 animate-slideInLeft">
      {/* Avatar bot */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center shadow-xl animate-pulse">
        <Sparkles size={20} className="text-white animate-spin" />
      </div>

      {/* Bulle typing */}
      <div
        className="
          rounded-2xl px-6 py-4 shadow-lg backdrop-blur-sm border-2 relative overflow-hidden
          bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200
        "
      >
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium">KUYO réfléchit</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-orange-500 to-green-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Effet shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
    </div>
  );
};
