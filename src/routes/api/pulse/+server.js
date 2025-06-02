import { json } from '@sveltejs/kit';

// Import shared state
import { lastPulsedApp, notificationsCleared, broadcastClearNotifications } from './shared.js';

/**
 * Handle POST requests to pulse an app
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request, url }) {
  // This endpoint no longer handles /clear requests - they are handled by the dedicated endpoint
  
  // Regular pulse request
  try {
    const data = await request.json();
    
    if (data && data.appId) {
      // Update the last pulsed app
      lastPulsedApp.appId = data.appId;
      lastPulsedApp.timestamp = Date.now();
      
      return json({ success: true });
    }
    
    return json({ success: false, error: 'Invalid request data' }, { status: 400 });
  } catch (error) {
    console.error('Error processing pulse request:', error);
    return json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

/**
 * Handle GET requests to check for app pulses
 * @type {import('./$types').RequestHandler}
 */
export async function GET({ url, request }) {
  // Get the last poll timestamp from the client
  const lastPoll = url.searchParams.get('lastPoll');
  const lastPollTime = lastPoll ? parseInt(lastPoll, 10) : 0;
  
  // Check if we're broadcasting clear notifications to all clients
  if (broadcastClearNotifications.value || (notificationsCleared.cleared && notificationsCleared.timestamp > lastPollTime)) {
    // Create response with clear notifications flag
    const response = {
      appId: null,
      timestamp: Date.now(),
      clearNotifications: true
    };
    
    return json(response);
  }
  
  // Check if there's been a new pulse since the client's last poll
  if (lastPulsedApp.timestamp > lastPollTime) {
    return json({
      appId: lastPulsedApp.appId,
      timestamp: lastPulsedApp.timestamp,
      clearNotifications: false
    });
  }
  
  // No new pulses
  return json({
    appId: null,
    timestamp: lastPollTime,
    clearNotifications: false
  });
}
