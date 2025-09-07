import React from "react";
import { Sparkles, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";

export const AuthLayout = ({ authForm, setAuthForm, handleAuth }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-orange-500 to-green-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-300 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Carte d’authentification */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/95 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-800 transform hover:scale-105 transition-all duration-300">
          {/* Logo & titre */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <h1 className="text-5xl font-black bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent mb-4 animate-pulse">
                KUYO
              </h1>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
              Assistant Citoyen IA Révolutionnaire
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleAuth} className="space-y-6">
            {/* Champ email */}
            <div className="relative">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                value={authForm.email}
                onChange={(e) =>
                  setAuthForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                disabled={authForm.isLoading}
              />
            </div>

            {/* Champ mot de passe */}
            <div className="relative">
              <input
                type="password"
                placeholder="Mot de passe"
                className="w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm((prev) => ({ ...prev, password: e.target.value }))
                }
                required
                disabled={authForm.isLoading}
              />
            </div>

            {/* Message d’erreur */}
            {authForm.error && (
              <div className="bg-red-100/80 dark:bg-red-900/40 backdrop-blur-sm border-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-2xl text-sm flex items-center gap-3 animate-shake">
                <AlertCircle size={18} />
                {authForm.error}
              </div>
            )}

            {/* Bouton connexion */}
            <Button
              type="submit"
              disabled={authForm.isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden group"
            >
              <span className="relative z-10">
                {authForm.isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connexion...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles size={18} />
                    {authForm.isLogin ? "Se connecter" : "S'inscrire"}
                  </div>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            </Button>

            {/* Switch mode login/register */}
            <p
              className="text-center text-green-600 dark:text-green-400 cursor-pointer hover:text-green-700 dark:hover:text-green-300 text-sm font-medium hover:scale-105 transition-all duration-200"
              onClick={() =>
                setAuthForm((prev) => ({ ...prev, isLogin: !prev.isLogin }))
              }
            >
              {authForm.isLogin
                ? "✨ Créer un compte"
                : "🔑 J'ai déjà un compte"}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
