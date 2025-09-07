// Service de base pour factoriser fetch
export const BaseService = {
  async request(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("❌ BaseService error:", error);
      throw error;
    }
  },
};
