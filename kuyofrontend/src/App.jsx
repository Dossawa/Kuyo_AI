import React, { useState, useEffect, useRef } from "react";

// Auth
import { AuthLayout } from "./components/auth/AuthLayout";

// Chat
import { ChatStats } from "./components/chat/ChatStats";
import { MessageBubble } from "./components/chat/MessageBubble";
import { MessageInput } from "./components/chat/MessageInput";
import { TypingIndicator } from "./components/chat/TypingIndicator";

// Common
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { NotificationSystem } from "./components/common/NotificationSystem";

// Layout
import { MainLayout } from "./components/layout/MainLayout";

// UI
import { Card, CardContent } from "./components/ui/card";

// Services
import { kuyoService } from "./services/kuyoService";

export default function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    isLogin: true,
    error: "",
    isLoading: false,
  });

  const [chatSessions, setChatSessions] = useState([
    {
      id: "1",
      createdAt: Date.now(),
      title: "Bienvenue sur KUYO",
      history: [
        {
          role: "bot",
          content:
            "🎉 Bienvenue sur KUYO ! Posez-moi vos questions sur les services publics ivoiriens.",
          timestamp: Date.now(),
        },
      ],
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [editingTitleIndex, setEditingTitleIndex] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // 🔒 anti double-envoi
  const sendingRef = useRef(false);

  // 🧭 scroll local robuste
  const chatScrollRef = useRef(null);
  useEffect(() => {
    const el = chatScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [chatSessions, activeIndex, isLoading]);

  // Auth fake
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthForm((prev) => ({ ...prev, isLoading: true, error: "" }));

    try {
      if (!authForm.email || !authForm.password) {
        throw new Error("Email et mot de passe requis");
      }
      setUser({ email: authForm.email });
    } catch (error) {
      setAuthForm((prev) => ({
        ...prev,
        error: error.message || "Erreur de connexion",
      }));
    } finally {
      setAuthForm((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Sessions
  const createNewSession = () => {
    const newSession = {
      id: Date.now().toString(),
      createdAt: Date.now(),
      title: "Nouvelle session",
      history: [
        {
          role: "bot",
          content: "Nouvelle session démarrée 🚀",
          timestamp: Date.now(),
        },
      ],
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setActiveIndex(0);
  };

  const deleteSession = (index) => {
    setChatSessions((prev) => prev.filter((_, i) => i !== index));
    setActiveIndex(0);
  };

  const startEditingTitle = (index) => {
    setEditingTitleIndex(index);
    setEditingTitle(chatSessions[index].title);
  };

  const saveTitle = () => {
    if (editingTitleIndex !== null) {
      setChatSessions((prev) => {
        const updated = [...prev];
        updated[editingTitleIndex].title = editingTitle.trim() || "Sans titre";
        return updated;
      });
      setEditingTitleIndex(null);
    }
  };

  const cancelEdit = () => {
    setEditingTitleIndex(null);
    setEditingTitle("");
  };

 // ✅ Envoi (verrou synchrone + garde anti-doublon côté bot)
const handleSend = async (e) => {
  if (e) e.preventDefault();

  if (sendingRef.current) return; // bloque ré-entrées immédiates
  if (isLoading) return;
  if (!message.trim()) return;

  sendingRef.current = true;

  const userMessage = message.trim();
  setMessage(""); // vider l’input

  const newMessage = {
    role: "user",
    content: userMessage,
    timestamp: Date.now(),
  };

  setChatSessions((prev) => {
    const updated = [...prev];
    const history = updated[activeIndex].history;
    // Sécurité anti-doublon utilisateur instantané
    if (!history.length || history[history.length - 1].content !== userMessage) {
      history.push(newMessage);
    }
    return updated;
  });

  setIsLoading(true);
  setIsTyping(true);

  try {
    const answer = await kuyoService.askQuestion(userMessage);
    const botContent = answer?.content ?? "⚠️ Aucune réponse disponible.";
    const botSource  = answer?.source  ?? "Gemini";

    // ✅ Déduplication BOT : n'ajouter que si la dernière réponse bot est différente
    setChatSessions((prev) => {
      const updated = [...prev];
      const history = updated[activeIndex].history;
      const last = history[history.length - 1];

      // On n'ajoute PAS si la dernière entrée est déjà un bot avec le même contenu
      const isDuplicate =
        last &&
        last.role === "bot" &&
        typeof last.content === "string" &&
        typeof botContent === "string" &&
        last.content.trim() === botContent.trim();

      if (!isDuplicate) {
        history.push({
          role: "bot",
          content: botContent,
          source: botSource,
          timestamp: Date.now(),
        });
      }

      return updated;
    });
  } catch (err) {
    console.error("❌ Erreur handleSend:", err);
    setNotifications((prev) => [
      ...prev,
      { type: "error", message: "Erreur lors de la réponse du bot" },
    ]);
  } finally {
    setIsLoading(false);
    setIsTyping(false);
    sendingRef.current = false; // libère le verrou
  }
};


  // =========================
  // Rendu
  // =========================
  if (!user) {
    return (
      <AuthLayout
        authForm={authForm}
        setAuthForm={setAuthForm}
        handleAuth={handleAuth}
      />
    );
  }

  const activeSession = chatSessions[activeIndex];

  return (
    <ErrorBoundary>
      <MainLayout
        title="KUYO"
        user={user}
        onLogout={() => setUser(null)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sessions={chatSessions}
        activeIndex={activeIndex}
        onNewSession={createNewSession}
        onSelectSession={setActiveIndex}
        onDeleteSession={deleteSession}
        onEditSession={startEditingTitle}
        onSaveTitle={saveTitle}
        onCancelEdit={cancelEdit}
        editingTitleIndex={editingTitleIndex}
        editingTitle={editingTitle}
        setEditingTitle={setEditingTitle}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isLoading={isLoading}
        isTyping={isTyping}
      >
        {/* ⚠️ min-h-0 sur chaque maillon + Card min-h-0 */}
        <Card className="flex-1 min-h-0 flex flex-col m-4 rounded-2xl shadow-lg">
          <CardContent className="flex-1 min-h-0 flex flex-col p-0">
            {/* Conteneur scrollable : flex-1 + min-h-0 + garde min-h visuelle */}
            <div
              ref={chatScrollRef}
              className="flex-1 min-h-0 min-h-[200px] overflow-y-auto p-4"
            >
              {activeSession?.history?.map((msg, idx) => (
                <MessageBubble key={idx} message={msg} index={idx} />
              ))}
              {isLoading && <TypingIndicator />}
            </div>

            <div className="border-t p-4 shrink-0">
              <MessageInput
                message={message}
                setMessage={setMessage}
                onSend={handleSend} // compatible event
                isLoading={isLoading}
                isTyping={isTyping}
              />
            </div>
          </CardContent>
        </Card>

        <ChatStats stats={{ total: activeSession?.history?.length || 0 }} />
      </MainLayout>

      <NotificationSystem notifications={notifications} />
    </ErrorBoundary>
  );
}
