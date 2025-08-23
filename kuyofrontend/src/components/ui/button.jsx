// src/components/ui/button.jsx
import React from "react";

export const Button = ({ children, variant = "default", ...props }) => {
  const base = "px-4 py-2 rounded font-medium";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-transparent text-blue-600 hover:bg-blue-100",
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
};