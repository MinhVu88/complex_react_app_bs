import React from "react";

export default function FlashMessages({ messages }) {
  return (
    <div className="floating-alerts">
      {messages.map((msg, index) => {
        return (
          <div
            className="alert alert-success text-center floating-alert shadow-sm"
            key={index}
          >
            {msg}
          </div>
        );
      })}
    </div>
  );
}
