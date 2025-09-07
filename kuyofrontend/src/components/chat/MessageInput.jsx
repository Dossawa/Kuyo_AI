import React from "react";
import { Send, Mic, X } from "lucide-react";
import { Button } from "../ui/button";

export const MessageInput = ({ message, setMessage, onSend, isLoading, isTyping }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(e); // garde la signature existante (App.jsx attend un event)
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {isTyping && (
        <div className="text-xs text-gray-500 flex items-center gap-2 animate-fadeIn mb-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          KUYO réfléchit...
        </div>
      )}

      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            rows={1}
            style={{ maxHeight: "120px" }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question ici... ✨"
            className="w-full resize-none border-2 rounded-2xl px-4 py-3 pr-12 
                       focus:outline-none focus:ring-2 focus:ring-orange-500/40 
                       focus:border-orange-500 transition-all duration-200 
                       bg-white/80 backdrop-blur-sm overflow-y-auto"
            disabled={isLoading}
            maxLength={500}
          />
          <span className="absolute bottom-2 right-3 text-xs text-gray-400">
            {message.length}/500
          </span>
        </div>

        <div className="flex gap-2 shrink-0">
          {message && (
            <Button
              type="button"
              onClick={() => setMessage("")}
              disabled={isLoading}
              variant="outline"
              className="p-3 rounded-xl border-gray-300 text-gray-500 hover:bg-gray-100"
              title="Effacer"
            >
              <X size={18} />
            </Button>
          )}

          {/* ⛑️ type='button' pour éviter tout submit implicite */}
          <Button
            type="button"
            onClick={(e) => onSend(e)}
            disabled={!message.trim() || isLoading}
            className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-green-500 
                       hover:from-orange-600 hover:to-green-600 text-white"
            title="Envoyer"
          >
            <Send size={18} />
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled
            className="p-3 rounded-xl border-purple-300 text-purple-500 hover:bg-purple-50"
            title="Reconnaissance vocale (bientôt)"
          >
            <Mic size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};
