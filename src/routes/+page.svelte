<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { 
		PhoneSolid, 
		EnvelopeSolid, 
		ImageSolid, 
		CalendarMonthSolid, 
		ClockSolid, 
		MapPinSolid, 
		MusicSolid, 
		CogSolid, 
		CartSolid, 
		ShoppingBagSolid,
		GlobeSolid
	} from 'flowbite-svelte-icons';
	import { fade } from 'svelte/transition';

	type AppIcon = {
		id: string;
		name: string;
		icon: any;
		color: string;
		path: string;
		pulsing?: boolean;
		notificationCount: number;
		showNotifications?: boolean;
	};

	let apps: AppIcon[] = [
		{ id: 'phone', name: 'Phone', icon: PhoneSolid, color: 'bg-green-500', path: '/phone', pulsing: false, notificationCount: 0, showNotifications: true },
		{ id: 'messages', name: 'Messages', icon: EnvelopeSolid, color: 'bg-green-400', path: '/messages', pulsing: false, notificationCount: 0, showNotifications: true },
		{ id: 'mail', name: 'Mail', icon: EnvelopeSolid, color: 'bg-blue-500', path: '/mail', pulsing: false, notificationCount: 0, showNotifications: true },
		{ id: 'camera', name: 'Camera', icon: CartSolid, color: 'bg-gray-700', path: '/camera', pulsing: false, notificationCount: 0, showNotifications: true },
		{ id: 'photos', name: 'Photos', icon: ImageSolid, color: 'bg-purple-500', path: '/photos', pulsing: false, notificationCount: 0, showNotifications: true },
		{ id: 'calendar', name: 'Calendar', icon: CalendarMonthSolid, color: 'bg-red-500', path: '/calendar', pulsing: false, notificationCount: 0, showNotifications: true },
		{ id: 'clock', name: 'Clock', icon: ClockSolid, color: 'bg-gray-800', path: '/clock', pulsing: false, notificationCount: 0, showNotifications: true },
		{ id: 'maps', name: 'Maps', icon: MapPinSolid, color: 'bg-green-600', path: '/maps', pulsing: false, notificationCount: 0, showNotifications: true },
		{ id: 'music', name: 'Music', icon: MusicSolid, color: 'bg-pink-500', path: '/music', pulsing: false, notificationCount: 0, showNotifications: true },
		{ id: 'settings', name: 'Settings', icon: CogSolid, color: 'bg-gray-500', path: '/settings', pulsing: false, notificationCount: 0, showNotifications: false },
		{ id: 'store', name: 'Store', icon: ShoppingBagSolid, color: 'bg-blue-600', path: '/store', pulsing: false, notificationCount: 0, showNotifications: true },
		{ id: 'findmy', name: 'Find My', icon: GlobeSolid, color: 'bg-blue-400', path: '/findmy', pulsing: false, notificationCount: 0, showNotifications: true }
	];

	let lastPollTime = Date.now();
	let pollInterval: number;
	let lastPulsedAppName: string | null = null;
	let showStatusMessage = false;

	// Function to handle app icon click
	async function handleAppClick(appId: string, event: MouseEvent) {
		// Prevent default navigation
		event.preventDefault();
		
		// If settings app is clicked, clear all notifications
		if (appId === 'settings') {
			// Clear all notification counts locally
			apps = apps.map(app => ({
				...app,
				notificationCount: 0
			}));
			
			// Show status message that notifications were cleared
			lastPulsedAppName = 'Settings';
			showStatusMessage = true;
			
			// Hide status message after 3 seconds
			setTimeout(() => {
				showStatusMessage = false;
			}, 3000);
			
			// Send clear notifications event to server for all clients
			try {
				const response = await fetch('/api/pulse/clear', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					}
				});
				
				if (!response.ok) {
					console.error('Failed to clear notifications for all clients');
				}
			} catch (error) {
				console.error('Error clearing notifications for all clients:', error);
			}
		}
		
		// Trigger pulse animation locally
		triggerPulse(appId);
		
		// Note: We no longer increment the notification count here
		// It will be handled by the polling mechanism to avoid double counting
		
		// Send pulse event to server
		try {
			const response = await fetch('/api/pulse', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ appId })
			});
			
			if (!response.ok) {
				console.error('Failed to send pulse event');
			}
		} catch (error) {
			console.error('Error sending pulse event:', error);
		}
		
		// No navigation - just pulse the app icon
	}

	// Function to trigger pulse animation for an app
	function triggerPulse(appId: string) {
		// Find the app name
		const app = apps.find(a => a.id === appId);
		if (app) {
			lastPulsedAppName = app.name;
			
			// Show status message
			showStatusMessage = true;
			
			// Hide status message after 3 seconds
			setTimeout(() => {
				showStatusMessage = false;
			}, 3000);
		}
		
		// Update the app's pulsing state
		apps = apps.map(app => ({
			...app,
			pulsing: app.id === appId ? true : app.pulsing
		}));
		
		// Reset the pulsing state after animation completes
		setTimeout(() => {
			apps = apps.map(app => ({
				...app,
				pulsing: app.id === appId ? false : app.pulsing
			}));
		}, 1500);
	}

	// Function to poll for pulse events from other clients
	async function pollForPulses() {
		try {
			const response = await fetch(`/api/pulse?lastPoll=${lastPollTime}`);
			const data = await response.json();
			
			// Update the last poll time
			lastPollTime = data.timestamp || lastPollTime;
			
			// Check if we need to clear all notifications
			if (data.clearNotifications) {
				// Clear all notification counts
				apps = apps.map(app => ({
					...app,
					notificationCount: 0
				}));
				
				// Show status message that notifications were cleared
				lastPulsedAppName = 'Settings';
				showStatusMessage = true;
				
				// Hide status message after 3 seconds
				setTimeout(() => {
					showStatusMessage = false;
				}, 3000);
			}
			
			// Handle regular pulse events
			if (data.appId) {
				// Trigger pulse animation for the app
				triggerPulse(data.appId);
				
				// Increment notification count for the remotely pulsed app
				apps = apps.map(app => {
					if (app.id === data.appId) {
						return {
							...app,
							notificationCount: app.notificationCount + 1
						};
					}
					return app;
				});
			}
		} catch (error) {
			console.error('Error polling for pulses:', error);
		}
	}

	onMount(() => {
		// Start polling for pulse events
		pollInterval = setInterval(pollForPulses, 1000) as unknown as number;
	});

	onDestroy(() => {
		// Clean up interval when component is destroyed
		if (pollInterval) clearInterval(pollInterval);
	});
</script>

<div class="grid grid-cols-4 gap-6 py-8 px-4 max-w-4xl mx-auto w-full">
	{#each apps as app}
		<a 
			href={app.path} 
			class="flex flex-col items-center" 
			on:click|preventDefault={(e) => handleAppClick(app.id, e)}
		>
			<div class="relative">
				<!-- Notification badge positioned to overlap the app icon -->
				{#if app.notificationCount > 0 && app.showNotifications !== false}
				<div class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1 border-2 border-black shadow-md z-50">
					{app.notificationCount > 99 ? '99+' : app.notificationCount}
				</div>
				{/if}
				
				<div class="{app.color} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden {app.pulsing ? 'pulse-animation' : ''}">
					<!-- iOS-style gradient overlay -->
					<div class="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
					<!-- Icon with subtle shadow for depth -->
					<svelte:component this={app.icon} class="text-white w-8 h-8 relative z-10 drop-shadow-sm" />
				</div>
			</div>
			<span class="mt-2 text-xs text-white font-medium drop-shadow-md">{app.name}</span>
		</a>
	{/each}
</div>

<!-- Status message removed as requested -->

<!-- iOS-style dock indicator -->
<div class="flex justify-center mt-auto mb-8">
	<div class="w-32 h-1.5 bg-white/30 rounded-full"></div>
</div>
