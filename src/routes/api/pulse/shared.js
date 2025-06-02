// Shared state for pulse API endpoints
// Using objects with properties instead of primitives to ensure they're passed by reference

// Store the last pulsed app and timestamp
export const lastPulsedApp = {
  appId: null,
  timestamp: Date.now()
};

// Flag to indicate if notifications have been cleared
export const notificationsCleared = {
  cleared: false,
  timestamp: Date.now()
};

// Global flag to broadcast clear notification to all clients
export const broadcastClearNotifications = {
  value: false
};
