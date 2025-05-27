import { json } from '@sveltejs/kit';

// Store the last pulsed app and timestamp
let lastPulsedApp = {
  appId: null,
  timestamp: Date.now()
};

/**
 * Handle POST requests to pulse an app
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request }) {
  try {
    const data = await request.json();
    
    if (data && data.appId) {
      // Update the last pulsed app
      lastPulsedApp = {
        appId: data.appId,
        timestamp: Date.now()
      };
      
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
export async function GET({ url }) {
  // Get the last poll timestamp from the client
  const lastPoll = url.searchParams.get('lastPoll');
  const lastPollTime = lastPoll ? parseInt(lastPoll, 10) : 0;
  
  // Check if there's been a new pulse since the client's last poll
  if (lastPulsedApp.timestamp > lastPollTime) {
    return json({
      appId: lastPulsedApp.appId,
      timestamp: lastPulsedApp.timestamp
    });
  }
  
  // No new pulses
  return json({
    appId: null,
    timestamp: lastPollTime
  });
}
