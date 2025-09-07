import React from "react";
import { MessageSquare, Zap } from "lucide-react";

export const ChatStats = ({ stats }) => {
  return (
    <div
      className={`
        mx-4 mb-4 mt-2 rounded-2xl p-4 backdrop-blur-sm border flex items-center justify-between shadow-md
        bg-white/70 border-gray-200
        dark:bg-gray-800/70 dark:border-gray-700
      `}
    >
      {/* Statut à gauche */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="font-medium">En ligne</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-orange-500" />
          <span>{stats?.total || 0} messages</span>
        </div>
      </div>

      {/* Identité du bot à droite */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Zap size={12} className="text-orange-500 animate-pulse" />
        <span className="font-medium">KUYO Assistant v2.0</span>
      </div>
    </div>
  );
};
