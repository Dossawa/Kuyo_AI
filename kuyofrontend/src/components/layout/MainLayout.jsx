import React from "react";
import { Menu, X, Star, Sun, Moon, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Sidebar } from "../sidebar/Sidebar";

export const MainLayout = ({
  title,
  user,
  onLogout,
  darkMode,
  setDarkMode,
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
  sidebarOpen,
  setSidebarOpen,
  children,
}) => {
  return (
    <div className={`h-screen flex overflow-hidden relative ${darkMode ? "dark" : ""}`}>
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        activeIndex={activeIndex}
        onNewSession={onNewSession}
        onSelectSession={onSelectSession}
        onDeleteSession={onDeleteSession}
        onEditSession={onEditSession}
        onSaveTitle={onSaveTitle}
        onCancelEdit={onCancelEdit}
        editingTitleIndex={editingTitleIndex}
        editingTitle={editingTitle}
        setEditingTitle={setEditingTitle}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
      />

      {/* Contenu principal */}
      <main className="flex flex-col h-full min-h-0 flex-1 relative">
        {/* Header */}
        <header
          className={`
            backdrop-blur-xl border-b px-4 lg:px-8 py-6 flex items-center justify-between shrink-0 relative
            ${darkMode
              ? "bg-gray-800/80 border-gray-700"
              : "bg-white/80 border-gray-200"}
          `}
        >
          <div className="flex items-center gap-6">
            {/* Bouton menu mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className={`
                lg:hidden p-3 rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-12
                ${darkMode ? "hover:bg-gray-700" : "hover:bg-orange-100"}
              `}
              title="Ouvrir le menu"
            >
              <Menu size={24} />
            </button>

            {/* Logo + titre */}
            <div className="relative">
              <h1
                className="
                  text-3xl lg:text-4xl font-black 
                  bg-gradient-to-r from-orange-500 via-amber-500 to-green-500 
                  bg-clip-text text-transparent animate-pulse
                "
              >
                {title}
              </h1>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} hidden sm:block`}>
                🚀 Assistant IA Nouvelle Génération
              </p>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
            </div>
          </div>

          {/* Infos utilisateur */}
          <div className="flex items-center gap-4">
            {/* Email + pastille */}
            <div
              className={`
                hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl transition-all duration-300
                ${darkMode ? "bg-gray-700/50" : "bg-white/50"}
              `}
            >
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium truncate max-w-32">
                {user.email}
              </span>
            </div>

            {/* Toggle dark/light */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl transition-all duration-200 hover:scale-110"
              title={darkMode ? "Mode clair" : "Mode sombre"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Déconnexion */}
            <Button
              onClick={onLogout}
              variant="outline"
              className="
                bg-gradient-to-r from-red-500 to-pink-500 text-white border-0
                hover:from-red-600 hover:to-pink-600 
                hover:scale-105 transition-all duration-300 
                rounded-2xl font-semibold px-6
              "
            >
              <LogOut size={18} className="mr-2" />
              Déconnexion
            </Button>
          </div>
        </header>

        {/* Contenu (chat + stats) */}
        <div className="flex-1 flex flex-col min-h-0">{children}</div>
      </main>
    </div>
  );
};
