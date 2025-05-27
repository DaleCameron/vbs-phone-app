<script lang="ts">
	import '../app.css';
	import { BatteryOutline, GlobeSolid, PhoneSolid } from 'flowbite-svelte-icons';
	let { children } = $props();
	
	// Get current time in 12-hour format
	function getCurrentTime() {
		const now = new Date();
		let hours = now.getHours();
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		return `${hours}:${minutes} ${ampm}`;
	}
	
	let currentTime = getCurrentTime();
	
	// Update time every minute
	setInterval(() => {
		currentTime = getCurrentTime();
	}, 60000);
</script>

<div class="phone-container h-screen w-screen overflow-hidden bg-black flex flex-col">
	<div class="phone-status-bar h-6 bg-black text-white flex justify-between items-center px-4 text-xs">
		<span>{currentTime}</span>
		<div class="flex items-center space-x-2">
			<!-- Signal icon -->
			<PhoneSolid class="w-3 h-3" />
			
			<!-- WiFi/Internet icon -->
			<GlobeSolid class="w-3 h-3" />
			
			<!-- Battery icon -->
			<BatteryOutline class="w-4 h-3" />
		</div>
	</div>
	<div class="phone-screen flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 overflow-y-auto p-4">
		{@render children()}
	</div>
	<!-- <div class="phone-dock h-16 bg-black/30 backdrop-blur-md flex justify-center items-center space-x-4 border-t border-white/10">
		<div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
			<span class="text-white text-2xl">📱</span>
		</div>
	</div> -->
</div>
