// Service d'authentification (futur Firebase ou API)
export const AuthService = {
  async login(email, password) {
    // Ici tu pourras mettre Firebase ou ton backend
    if (!email || !password) throw new Error("Email et mot de passe requis");
    return { email };
  },

  async register(email, password) {
    if (!email || !password) throw new Error("Email et mot de passe requis");
    return { email };
  },

  async logout() {
    return true;
  },
};
