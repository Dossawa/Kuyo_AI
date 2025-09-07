// FICHIER: src/components/sidebar/Sidebar.jsx
// ===========================================

import React from "react";
import { Button } from "../ui/button";
import { Plus, Star, X, Moon, Sun, Zap } from "lucide-react";
import { SessionCard } from "./SessionCard";

export const Sidebar = ({
  sessions,
  activeIndex,
  onNewSession,
  onSelectSession,
  onDeleteSession,
  onEditSession,
  onSaveTitle,
  onCancelEdit,
  editingTitleIndex,
  editingTitle,
  setEditingTitle,
  darkMode,
  setDarkMode,
  sidebarOpen,
  setSidebarOpen,
  user,
}) => {
  return (
    <aside
      className={` 
        fixed lg:relative lg:translate-x-0 z-50 lg:z-auto
        w-80 h-full backdrop-blur-xl border-r
        transform transition-all duration-500 ease-out
        flex flex-col shadow-2xl lg:shadow-xl
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        ${darkMode
          ? "bg-gray-800/95 border-gray-700"
          : "bg-white/95 border-gray-200"}
      `}
    >
      {/* === Header avec gradient === */}
      <div className="relative p-6 border-b border-gray-200/50 bg-gradient-to-r from-orange-500 to-green-500">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Star className="animate-spin" size={20} />
              Historique
            </h2>
            <p className="text-white/80 text-sm">Vos conversations</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 text-white"
              title={darkMode ? "Mode clair" : "Mode sombre"}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white/20 rounded-xl transition-all duration-200 text-white"
              title="Fermer"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20" />
      </div>

      {/* === Bouton Nouvelle Session === */}
      <div className="p-4">
        <Button
          onClick={onNewSession}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
                     text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center 
                     justify-center gap-3 transform hover:scale-105 hover:shadow-xl relative overflow-hidden group"
        >
          <Plus
            size={20}
            className="group-hover:rotate-180 transition-transform duration-300"
          />
          Nouvelle session
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </div>

      {/* === Liste des sessions === */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {sessions.map((session, i) => (
          <div
            key={session.id}
            className="animate-slideIn"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <SessionCard
              session={session}
              isActive={i === activeIndex}
              isEditing={editingTitleIndex === i}
              onSelect={() => onSelectSession(i)}
              onEdit={() => onEditSession(i)}
              onDelete={() => onDeleteSession(i)}
              onSaveTitle={onSaveTitle}
              onCancelEdit={onCancelEdit}
              editingTitle={editingTitle}
              setEditingTitle={setEditingTitle}
              index={i}
            />
          </div>
        ))}
      </div>

      {/* === Footer avec stats === */}
      <div
        className={`p-4 border-t ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="text-center space-y-2">
          <div className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <Zap size={12} className="text-orange-500" />
            KUYO Assistant v2.0
          </div>
          <div className="text-xs text-gray-400">
            {sessions.length} session{sessions.length > 1 ? "s" : ""} •{" "}
            {user?.email}
          </div>
        </div>
      </div>
    </aside>
  );
};
