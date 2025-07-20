import React from "react";

export function Assistant({ message, isLoading }) {
  return (
    <div className="assistant-panel">
      <h4>Lumi's Tip 💡</h4>
      {isLoading ? (
        <p className="loading-text">
          <i>Lumi is thinking...</i>
        </p>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}
