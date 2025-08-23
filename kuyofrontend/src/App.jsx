import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Send, User, MessageSquare, Menu, X, Plus, Edit2, Trash2, AlertCircle } from "lucide-react";

// Configuration
const CONFIG = {
  USE_GEMINI: true,
  API_KEY: "AIzaSyD15eec9tMgcETJRJkkGx_d_6RJGQtK4WU", // À déplacer dans les variables d'environnement
  WEAVIATE_URL: "http://localhost:8080/v1/graphql",
  RELEVANCE_THRESHOLD: 0.3,
  MAX_CONCEPTS: 10,
  DEFAULT_LIMIT: 5,
  CERTAINTY_THRESHOLD: 0.7
};

// Utilitaires
const utils = {
  // Mots vides en français
  STOPWORDS: new Set([
    "faire", "demande", "comment", "pour", "obtenir", "est", "le", "la", "un", "une", 
    "des", "de", "du", "et", "à", "ce", "que", "qui", "avec", "dans", "sur", "par", 
    "son", "sa", "ses", "son", "ma", "mon", "mes", "ta", "ton", "tes"
  ]),

  extractImportantWords: (sentence) => {
    return sentence
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !utils.STOPWORDS.has(word))
      .slice(0, CONFIG.MAX_CONCEPTS);
  },

  formatTimestamp: (timestamp) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  generateId: () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,

  truncateText: (text, maxLength = 30) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  }
};

// Services API
const apiService = {
  async queryWeaviate(message, limit = CONFIG.DEFAULT_LIMIT) {
    const concepts = utils.extractImportantWords(message);
    if (concepts.length === 0) return [];

    try {
      const response = await fetch(CONFIG.WEAVIATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `{
            Get {
              Document(nearText: {
                concepts: ${JSON.stringify(concepts)},
                certainty: ${CONFIG.CERTAINTY_THRESHOLD}
              }, limit: ${limit}) {
                title
                description
                documents
                etapes
                frais
                delai
                direction
                contact
                url
              }
            }
          }`
        })
      });

      if (!response.ok) {
        throw new Error(`Weaviate API error: ${response.status}`);
      }

      const data = await response.json();
      return data?.data?.Get?.Document || [];
    } catch (error) {
      console.error("❌ Erreur Weaviate:", error);
      return [];
    }
  },

  async validateWithGemini(documents, question) {
    if (!documents.length) return null;

    const prompt = `Voici une question d'utilisateur : "${question}"

Voici une liste de documents administratifs :
${documents.map((doc, i) => `[${i + 1}] ${doc.title}\n${doc.description || ""}`).join("\n\n")}

Quel document correspond le mieux à la question ? Réponds uniquement par le numéro (1, 2, 3...), ou 0 si aucun ne correspond.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${CONFIG.API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              role: "user",
              parts: [{ text: prompt }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || "0";
      const index = parseInt(answer.match(/\d+/)?.[0] || "0", 10);
      
      return index >= 1 && index <= documents.length ? documents[index - 1] : null;
    } catch (error) {
      console.error("❌ Erreur Gemini validation:", error);
      return null;
    }
  },

  async queryGemini(message) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${CONFIG.API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              role: "user",
              parts: [{ text: message }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data?.candidates || data.candidates.length === 0) {
        throw new Error("Pas de réponse Gemini");
      }
      
      return {
        content: data.candidates[0].content.parts[0].text,
        source: "Gemini"
      };
    } catch (error) {
      console.error("❌ Erreur Gemini:", error);
      return {
        content: "Je rencontre actuellement un problème technique. Veuillez réessayer dans quelques instants.",
        source: "Gemini",
        error: true
      };
    }
  },

  async fetchKeywords() {
    try {
      const response = await fetch(CONFIG.WEAVIATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "{ Get { MotCle { name } } }"
        })
      });

      if (!response.ok) {
        throw new Error(`Keywords API error: ${response.status}`);
      }

      const data = await response.json();
      return data?.data?.Get?.MotCle?.map(obj => obj.name.toLowerCase()) || [];
    } catch (error) {
      console.error("❌ Erreur chargement mots-clés:", error);
      return [];
    }
  }
};

// Composant principal
export default function KuyoAssistant() {
  // États d'authentification
  const [user, setUser] = useState({ email: "demo@kuyo.ci" });
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    isLogin: true,
    error: "",
    isLoading: false
  });

  // États de l'application
  const [keywords, setKeywords] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState([
    {
      id: "1",
      createdAt: Date.now(),
      title: "Questions sur les services publics",
      history: [{
        role: "bot",
        content: "Bonjour ! Je suis KUYO, votre assistant citoyen IA. Comment puis-je vous aider aujourd'hui ?",
        source: "KUYO",
        timestamp: Date.now()
      }]
    }
  ]);

  // États de session active
  const [activeSessionIndex, setActiveSessionIndex] = useState(0);
  const [messageState, setMessageState] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // États d'édition
  const [editingTitleIndex, setEditingTitleIndex] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Références
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const editingInputRef = useRef(null);
  const messageInputRef = useRef(null);

  // Défilement automatique optimisé
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: "smooth", 
        block: "end" 
      });
    }, 100);
  }, []);

  // Chargement des mots-clés au démarrage
  useEffect(() => {
    const loadKeywords = async () => {
      try {
        const keywordsList = await apiService.fetchKeywords();
        setKeywords(keywordsList);
      } catch (error) {
        console.error("Erreur chargement mots-clés:", error);
      }
    };
    
    loadKeywords();
  }, []);

  // Défilement automatique lors des changements
  useEffect(() => {
    scrollToBottom();
  }, [chatSessions, activeSessionIndex, isLoading, scrollToBottom]);

  // Focus sur l'input d'édition de titre
  useEffect(() => {
    if (editingTitleIndex !== null && editingInputRef.current) {
      editingInputRef.current.focus();
      editingInputRef.current.select();
    }
  }, [editingTitleIndex]);

  // Session active mémorisée
  const activeSession = useMemo(() => {
    return activeSessionIndex !== null ? chatSessions[activeSessionIndex] : null;
  }, [chatSessions, activeSessionIndex]);

  // Formatage du document trouvé
  const formatDocumentResponse = useCallback((doc) => {
    let content = `**${doc.title || "Information"}**\n\n`;
    
    if (doc.description) {
      content += `📄 **Description :** ${doc.description}\n\n`;
    }
    
    if (doc.documents?.length) {
      content += `📎 **Documents requis :** ${doc.documents.join(", ")}\n\n`;
    }
    
    if (doc.etapes?.length) {
      content += `🧭 **Étapes :** \n${doc.etapes.map((etape, i) => `${i + 1}. ${etape}`).join("\n")}\n\n`;
    }
    
    if (doc.frais) {
      content += `💰 **Frais :** ${doc.frais}\n\n`;
    }
    
    if (doc.delai) {
      content += `⏱️ **Délai :** ${doc.delai}\n\n`;
    }
    
    if (doc.direction) {
      content += `🏢 **Direction responsable :** ${doc.direction}\n\n`;
    }
    
    if (doc.contact) {
      content += `📞 **Contact :** ${doc.contact}\n\n`;
    }
    
    if (doc.url) {
      content += `🔗 **Plus d'informations :** ${doc.url}`;
    }

    return content.trim();
  }, []);

  // Envoi de message optimisé
  const handleSend = useCallback(async () => {
    const message = messageState.trim();
    if (!message) return;

    const newUserMessage = {
      role: "user",
      content: message,
      timestamp: Date.now()
    };

    // Mise à jour optimiste
    setChatSessions(prev => {
      const updated = [...prev];
      updated[activeSessionIndex].history.push(newUserMessage);
      return updated;
    });

    setMessageState("");
    setIsLoading(true);

    try {
      let answer = null;

      // Recherche dans Weaviate
      const docs = await apiService.queryWeaviate(message);

      if (docs.length > 0) {
        const bestDoc = await apiService.validateWithGemini(docs, message);
        if (bestDoc) {
          answer = {
            content: formatDocumentResponse(bestDoc),
            source: bestDoc.url || "Base KUYO"
          };
        }
      }

      // Fallback vers Gemini
      if (!answer && CONFIG.USE_GEMINI) {
        answer = await apiService.queryGemini(message);
      }

      // Réponse par défaut
      if (!answer) {
        answer = {
          content: "Je n'ai pas trouvé d'information spécifique à votre demande. Pouvez-vous reformuler votre question ou être plus précis ?",
          source: "KUYO"
        };
      }

      const botReply = {
        role: "bot",
        content: answer.content,
        source: answer.source,
        timestamp: Date.now(),
        error: answer.error || false
      };

      setChatSessions(prev => {
        const updated = [...prev];
        updated[activeSessionIndex].history.push(botReply);
        
        // Mise à jour automatique du titre si c'est le premier message utilisateur
        if (updated[activeSessionIndex].history.filter(m => m.role === "user").length === 1) {
          updated[activeSessionIndex].title = utils.truncateText(message);
        }
        
        return updated;
      });

    } catch (error) {
      console.error("❌ Erreur envoi message:", error);
      
      // Message d'erreur pour l'utilisateur
      const errorReply = {
        role: "bot",
        content: "Une erreur est survenue. Veuillez réessayer.",
        source: "KUYO",
        timestamp: Date.now(),
        error: true
      };

      setChatSessions(prev => {
        const updated = [...prev];
        updated[activeSessionIndex].history.push(errorReply);
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, [messageState, activeSessionIndex, formatDocumentResponse]);

  // Gestion des événements clavier
  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Gestion des sessions
  const createNewSession = useCallback(() => {
    const newSession = {
      id: utils.generateId(),
      createdAt: Date.now(),
      title: "Nouvelle session",
      history: [{
        role: "bot",
        content: "Bonjour ! Je suis KUYO, votre assistant citoyen IA. Comment puis-je vous aider aujourd'hui ?",
        source: "KUYO",
        timestamp: Date.now()
      }]
    };
    
    setChatSessions(prev => [newSession, ...prev]);
    setActiveSessionIndex(0);
    setSidebarOpen(false);
  }, []);

  const selectSession = useCallback((index) => {
    setActiveSessionIndex(index);
    setSidebarOpen(false);
  }, []);

  const deleteSession = useCallback((index) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette session ?")) return;

    setChatSessions(prev => {
      const newSessions = prev.filter((_, i) => i !== index);
      
      if (activeSessionIndex === index) {
        setActiveSessionIndex(newSessions.length > 0 ? 0 : null);
      } else if (activeSessionIndex > index) {
        setActiveSessionIndex(prev => prev - 1);
      }
      
      return newSessions;
    });

    if (editingTitleIndex === index) {
      setEditingTitleIndex(null);
    }
  }, [activeSessionIndex, editingTitleIndex]);

  // Gestion édition de titre
  const startEditingTitle = useCallback((index) => {
    setEditingTitleIndex(index);
    setEditingTitle(chatSessions[index].title);
  }, [chatSessions]);

  const saveTitle = useCallback(() => {
    if (editingTitleIndex !== null) {
      setChatSessions(prev => {
        const updated = [...prev];
        updated[editingTitleIndex].title = editingTitle.trim() || "Sans titre";
        return updated;
      });
      setEditingTitleIndex(null);
      setEditingTitle("");
    }
  }, [editingTitleIndex, editingTitle]);

  const cancelEditingTitle = useCallback(() => {
    setEditingTitleIndex(null);
    setEditingTitle("");
  }, []);

  // Authentification
  const handleAuth = useCallback(async (e) => {
    e.preventDefault();
    
    setAuthForm(prev => ({ ...prev, isLoading: true, error: "" }));
    
    try {
      // Simulation authentification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!authForm.email) {
        throw new Error("Email requis");
      }
      
      setUser({ email: authForm.email });
    } catch (error) {
      setAuthForm(prev => ({ 
        ...prev, 
        error: error.message || "Erreur de connexion" 
      }));
    } finally {
      setAuthForm(prev => ({ ...prev, isLoading: false }));
    }
  }, [authForm.email]);

  // Interface d'authentification
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-orange-500 mb-2">KUYO</h1>
            <p className="text-gray-600 text-sm">Assistant Citoyen IA Ivoirien</p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Adresse email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                value={authForm.email}
                onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                required
                disabled={authForm.isLoading}
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Mot de passe"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                value={authForm.password}
                onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                required
                disabled={authForm.isLoading}
              />
            </div>
            
            {authForm.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {authForm.error}
              </div>
            )}
            
            <Button
              type="submit"
              disabled={authForm.isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              {authForm.isLoading ? "Connexion..." : (authForm.isLogin ? "Se connecter" : "S'inscrire")}
            </Button>
            
            <p
              className="text-center text-green-600 cursor-pointer hover:underline text-sm"
              onClick={() => setAuthForm(prev => ({ ...prev, isLogin: !prev.isLogin }))}
            >
              {authForm.isLogin ? "Créer un compte" : "J'ai déjà un compte"}
            </p>
          </form>
        </div>
      </div>
    );
  }

  // Interface principale
  return (
    <div className="h-screen bg-gradient-to-br from-orange-50 to-green-50 flex overflow-hidden">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative lg:translate-x-0 z-50 lg:z-auto
        w-80 lg:w-72 h-full bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        flex flex-col shadow-xl lg:shadow-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header sidebar */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-orange-500">Historique</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nouvelle session */}
        <div className="p-4">
          <Button
            onClick={createNewSession}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Nouvelle session
          </Button>
        </div>

        {/* Liste des sessions */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {chatSessions.map((session, i) => {
            const isActive = i === activeSessionIndex;
            const isEditing = editingTitleIndex === i;

            return (
              <div
                key={session.id}
                className={`
                  group relative p-3 mb-2 rounded-xl cursor-pointer transition-all duration-200
                  ${isActive 
                    ? 'bg-orange-500 text-white shadow-lg' 
                    : 'bg-gray-50 hover:bg-orange-50 text-gray-700'
                  }
                `}
                onClick={() => !isEditing && selectSession(i)}
                title={`Créée le ${utils.formatTimestamp(session.createdAt)}`}
              >
                {isEditing ? (
                  <input
                    ref={editingInputRef}
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={saveTitle}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveTitle();
                      if (e.key === "Escape") cancelEditingTitle();
                    }}
                    className="w-full bg-white text-gray-900 px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="flex-1 truncate text-sm font-medium">
                      {session.title}
                    </span>
                    <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingTitle(i);
                        }}
                        className="p-1 rounded-lg transition-all hover:scale-110"
                        title="Éditer le titre"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(i);
                        }}
                        className={`
                          p-1 rounded-lg transition-all hover:scale-110
                          ${isActive ? 'hover:bg-orange-600' : 'hover:bg-red-100 text-red-500'}
                        `}
                        title="Supprimer cette session"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer sidebar */}
        <div className="p-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 text-center">
            KUYO - Assistant Citoyen IA
            <br />
            Version 2.0
          </div>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex flex-col h-full min-h-0 flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Ouvrir le menu"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-orange-500">
                KUYO
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Assistant Citoyen IA Ivoirien
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-gray-600 truncate max-w-40">
              {user.email}
            </span>
            <Button
              onClick={() => setUser(null)}
              variant="outline"
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50"
            >
              Déconnexion
            </Button>
          </div>
        </header>

        {/* Zone de chat */}
        <div className="flex-1 flex flex-col p-4 lg:p-6 min-h-0">
          <Card className="flex-1 flex flex-col min-h-0 bg-white shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="flex-1 flex flex-col min-h-0 p-0">
              {/* Messages */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4"
              >
                {activeSession?.history?.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${
                      msg.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center shrink-0
                      ${msg.role === "user" 
                        ? "bg-green-500 text-white" 
                        : msg.error 
                        ? "bg-red-500 text-white"
                        : "bg-orange-500 text-white"
                      }
                    `}>
                      {msg.role === "user" ? (
                        <User size={16} />
                      ) : msg.error ? (
                        <AlertCircle size={16} />
                      ) : (
                        <MessageSquare size={16} />
                      )}
                    </div>
                    
                    <div className={`
                      max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl
                      rounded-2xl px-4 py-3 shadow-sm
                      ${msg.role === "user" 
                        ? "bg-green-50 border border-green-200" 
                        : msg.error
                        ? "bg-red-50 border border-red-200"
                        : "bg-gray-50 border border-gray-200"
                      }
                    `}>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>
                      
                      {msg.source && (
                        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                          <span className="font-semibold">Source :</span> {msg.source}
                        </div>
                      )}
                      
                      {msg.timestamp && (
                        <div className="text-xs text-gray-400 mt-1">
                          {utils.formatTimestamp(msg.timestamp)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Indicateur de frappe */}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                      <MessageSquare size={16} className="text-white" />
                    </div>
                    <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Élément pour défilement automatique */}
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              <div className="border-t border-gray-100 p-4 lg:p-6 shrink-0">
                <div className="flex gap-3 items-end">
                  <textarea
                    ref={messageInputRef}
                    rows={2}
                    value={messageState}
                    onChange={(e) => setMessageState(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Posez votre question ici..."
                    className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!messageState.trim() || isLoading}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white p-3 rounded-xl transition-all duration-200 shrink-0"
                    title="Envoyer le message"
                  >
                    <Send size={18} />
                  </Button>
                  {messageState && (
                    <Button
                      onClick={() => setMessageState("")}
                      disabled={isLoading}
                      variant="outline"
                      className="p-3 rounded-xl transition-all duration-200 shrink-0"
                      title="Effacer le message"
                    >
                      <X size={18} />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}