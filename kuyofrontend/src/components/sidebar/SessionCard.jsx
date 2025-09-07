import React, { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";

export const SessionCard = ({
  session,
  isActive,
  isEditing,
  onSelect,
  onEdit,
  onDelete,
  onSaveTitle,
  onCancelEdit,
  editingTitle,
  setEditingTitle,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        group relative p-4 mb-3 rounded-2xl cursor-pointer transition-all duration-300
        ${isActive
          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl"
          : "bg-white hover:bg-orange-50 text-gray-700 shadow"}
      `}
      onClick={() => !isEditing && onSelect()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {isEditing ? (
        <input
          value={editingTitle}
          onChange={(e) => setEditingTitle(e.target.value)}
          onBlur={onSaveTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSaveTitle();
            if (e.key === "Escape") onCancelEdit();
          }}
          className="w-full bg-white text-gray-900 px-3 py-2 rounded-xl border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          onClick={(e) => e.stopPropagation()}
          autoFocus
        />
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <div className="truncate text-sm font-semibold">{session.title}</div>
            <div className="text-xs opacity-70">
              {new Date(session.createdAt).toLocaleDateString("fr-FR")}
            </div>
          </div>
          {(isHovered || isActive) && (
            <div className="flex gap-2 ml-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-2 rounded-lg hover:bg-orange-100 text-orange-600"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-2 rounded-lg hover:bg-red-100 text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
