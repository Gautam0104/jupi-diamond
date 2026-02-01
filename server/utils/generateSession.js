// utils/session.js

export const getSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");

  if (!sessionId) {
    sessionId =
      "sess-" + Date.now() + "-" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("sessionId", sessionId);
  }

  return sessionId;
};
