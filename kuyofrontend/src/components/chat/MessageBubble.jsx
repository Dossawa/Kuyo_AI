import React, { useEffect, useState } from "react";
import { User, Sparkles, AlertCircle, Zap } from "lucide-react";

export const MessageBubble = ({ message, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const isUser = message.role === "user";
  const isError = message.error;

  return (
    <div
      className={`
        flex items-start gap-3 mb-4 transition-all duration-500
        ${isUser ? "flex-row-reverse" : ""}
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
      `}
    >
      {/* Avatar rond avec icône */}
      <div
        className={`
          w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md
          ${isUser
            ? "bg-gradient-to-br from-green-400 to-emerald-600 text-white"
            : isError
            ? "bg-gradient-to-br from-red-400 to-pink-600 text-white"
            : "bg-gradient-to-br from-orange-400 to-amber-600 text-white"}
        `}
      >
        {isUser ? (
          <User size={18} />
        ) : isError ? (
          <AlertCircle size={18} />
        ) : (
          <Sparkles size={18} />
        )}
      </div>

      {/* Contenu de la bulle */}
      <div
        className={`
          relative max-w-lg rounded-2xl px-5 py-4 text-sm shadow-md border
          ${isUser
            ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
            : isError
            ? "bg-gradient-to-br from-red-50 to-pink-50 border-red-200"
            : "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"}
        `}
      >
        <div className="whitespace-pre-wrap leading-relaxed">
          {message.content}
        </div>

        {/* Source éventuelle */}
        {message.source && (
          <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200 flex items-center gap-1">
            <Zap size={12} className="text-orange-500" />
            <span className="font-medium">Source :</span> {message.source}
          </div>
        )}

        {/* Timestamp au survol */}
        {message.timestamp && (
          <div className="absolute -bottom-5 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
            {new Date(message.timestamp).toLocaleString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}

        {/* Effet shimmer au hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  );
};
