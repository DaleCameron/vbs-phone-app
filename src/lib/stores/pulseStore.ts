import { writable } from 'svelte/store';

// Store to track which app is currently pulsing
export const pulsingApp = writable<string | null>(null);

// Store to track when the last pulse happened (for timing animations)
export const lastPulseTime = writable<number>(Date.now());

// Function to trigger a pulse for a specific app
export function pulseApp(appId: string): void {
  pulsingApp.set(appId);
  lastPulseTime.set(Date.now());
  
  // Reset the pulse after animation completes
  setTimeout(() => {
    pulsingApp.set(null);
  }, 1500); // Animation duration
}
