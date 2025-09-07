import React from "react";
import { Button } from "../ui/button";

export const Header = ({ title, onLogout, onToggleTheme }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-md">
      <h1 className="text-lg font-bold">{title}</h1>
      <div className="flex gap-2">
        {onToggleTheme && (
          <Button variant="ghost" onClick={onToggleTheme}>
            Thème
          </Button>
        )}
        {onLogout && (
          <Button variant="destructive" onClick={onLogout}>
            Déconnexion
          </Button>
        )}
      </div>
    </header>
  );
};
