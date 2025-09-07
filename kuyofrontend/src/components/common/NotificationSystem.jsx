import React from "react";

export const NotificationSystem = ({ notifications }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {notifications.map((notif, i) => (
        <div
          key={i}
          className={`p-4 rounded-xl shadow-lg text-white ${
            notif.type === "error"
              ? "bg-red-500"
              : notif.type === "success"
              ? "bg-green-500"
              : "bg-blue-500"
          }`}
        >
          {notif.message}
        </div>
      ))}
    </div>
  );
};
