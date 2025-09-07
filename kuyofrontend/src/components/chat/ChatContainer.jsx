import React, { useEffect, useRef } from "react";

export const ChatContainer = ({ children }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [children]); // scroll automatique à chaque nouveau message

  return (
    <div
      className={`
        flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 relative
        bg-gradient-to-br from-orange-50 via-amber-50 to-green-50
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      `}
    >
      {/* Gradient subtil en haut */}
      <div
        className={`
          absolute top-0 left-0 right-0 h-10 z-10 pointer-events-none
          bg-gradient-to-b from-white/80 to-transparent
          dark:from-gray-900/80
        `}
      />

      {children}

      {/* Ref pour scroll en bas */}
      <div ref={bottomRef} />

      {/* Gradient subtil en bas */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 h-10 z-10 pointer-events-none
          bg-gradient-to-t from-white/80 to-transparent
          dark:from-gray-900/80
        `}
      />
    </div>
  );
};
