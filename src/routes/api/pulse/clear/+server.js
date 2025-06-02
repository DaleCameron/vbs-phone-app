import { json } from '@sveltejs/kit';

// Import the shared state from the parent pulse endpoint
import { notificationsCleared, broadcastClearNotifications } from '../shared.js';

/**
 * Handle POST requests to clear notifications for all clients
 * @type {import('./$types').RequestHandler}
 */
export async function POST() {
  try {
    // Set the notifications cleared flag and broadcast flag
    notificationsCleared.cleared = true;
    notificationsCleared.timestamp = Date.now();
    
    // Set global broadcast flag to true
    broadcastClearNotifications.value = true;
    
    // Reset the broadcast flag after 10 seconds to avoid continuously clearing notifications
    setTimeout(() => {
      broadcastClearNotifications.value = false;
    }, 10000);
    
    return json({ success: true, message: 'All notifications cleared' });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
