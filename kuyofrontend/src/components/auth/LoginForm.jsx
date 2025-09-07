import React from "react";
import { Button } from "../ui/button";
import { AlertCircle, Sparkles } from "lucide-react";

export const LoginForm = ({
  authForm,
  setAuthForm,
  handleAuth,
}) => {
  return (
    <form onSubmit={handleAuth} className="space-y-6">
      <div>
        <input
          type="email"
          placeholder="Votre adresse email"
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 bg-white/50"
          value={authForm.email}
          onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
          required
          disabled={authForm.isLoading}
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 bg-white/50"
          value={authForm.password}
          onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
          required
          disabled={authForm.isLoading}
        />
      </div>

      {authForm.error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle size={18} />
          {authForm.error}
        </div>
      )}

      <Button
        type="submit"
        disabled={authForm.isLoading}
        className="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {authForm.isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Connexion...
          </div>
        ) : (
          <>
            <Sparkles size={18} />
            {authForm.isLogin ? "Se connecter" : "S'inscrire"}
          </>
        )}
      </Button>

      <p
        className="text-center text-green-600 cursor-pointer hover:text-green-700 text-sm font-medium"
        onClick={() => setAuthForm((prev) => ({ ...prev, isLogin: !prev.isLogin }))}
      >
        {authForm.isLogin ? "✨ Créer un compte" : "🔑 J'ai déjà un compte"}
      </p>
    </form>
  );
};
