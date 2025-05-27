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
	};

	let apps: AppIcon[] = [
		{ id: 'phone', name: 'Phone', icon: PhoneSolid, color: 'bg-green-500', path: '/phone', pulsing: false },
		{ id: 'messages', name: 'Messages', icon: EnvelopeSolid, color: 'bg-green-400', path: '/messages', pulsing: false },
		{ id: 'mail', name: 'Mail', icon: EnvelopeSolid, color: 'bg-blue-500', path: '/mail', pulsing: false },
		{ id: 'camera', name: 'Camera', icon: CartSolid, color: 'bg-gray-700', path: '/camera', pulsing: false },
		{ id: 'photos', name: 'Photos', icon: ImageSolid, color: 'bg-purple-500', path: '/photos', pulsing: false },
		{ id: 'calendar', name: 'Calendar', icon: CalendarMonthSolid, color: 'bg-red-500', path: '/calendar', pulsing: false },
		{ id: 'clock', name: 'Clock', icon: ClockSolid, color: 'bg-gray-800', path: '/clock', pulsing: false },
		{ id: 'maps', name: 'Maps', icon: MapPinSolid, color: 'bg-green-600', path: '/maps', pulsing: false },
		{ id: 'music', name: 'Music', icon: MusicSolid, color: 'bg-pink-500', path: '/music', pulsing: false },
		{ id: 'settings', name: 'Settings', icon: CogSolid, color: 'bg-gray-500', path: '/settings', pulsing: false },
		{ id: 'store', name: 'Store', icon: ShoppingBagSolid, color: 'bg-blue-600', path: '/store', pulsing: false },
		{ id: 'findmy', name: 'Find My', icon: GlobeSolid, color: 'bg-blue-400', path: '/findmy', pulsing: false }
	];

	let lastPollTime = Date.now();
	let pollInterval: number;
	let lastPulsedAppName: string | null = null;
	let showStatusMessage = false;

	// Function to handle app icon click
	async function handleAppClick(appId: string, event: MouseEvent) {
		// Prevent default navigation
		event.preventDefault();
		
		// Trigger pulse animation locally
		triggerPulse(appId);
		
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
			
			if (data.appId) {
				// Update the last poll time
				lastPollTime = data.timestamp;
				
				// Trigger pulse animation for the app
				triggerPulse(data.appId);
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
			<div class="{app.color} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden {app.pulsing ? 'pulse-animation' : ''}">
				<!-- iOS-style gradient overlay -->
				<div class="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
				<!-- Icon with subtle shadow for depth -->
				<svelte:component this={app.icon} class="text-white w-8 h-8 relative z-10 drop-shadow-sm" />
				
				<!-- No notification dot as requested -->
			</div>
			<span class="mt-2 text-xs text-white font-medium drop-shadow-md">{app.name}</span>
		</a>
	{/each}
</div>

<!-- Status message for pulsed apps -->
{#if showStatusMessage && lastPulsedAppName}
<div class="fixed bottom-24 left-0 right-0 flex justify-center z-50" transition:fade={{ duration: 300 }}>
	<div class="bg-black/70 text-white px-6 py-3 rounded-full text-sm">
		{lastPulsedAppName} is pulsing
	</div>
</div>
{/if}

<!-- iOS-style dock indicator -->
<div class="flex justify-center mt-auto mb-8">
	<div class="w-32 h-1.5 bg-white/30 rounded-full"></div>
</div>
