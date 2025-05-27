<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="phone-container h-screen w-screen overflow-hidden bg-black flex flex-col">
	<div class="phone-status-bar h-6 bg-black text-white flex justify-between items-center px-4 text-xs">
		<span>9:41 AM</span>
		<div class="flex space-x-1">
			<span>📶</span>
			<span>🔋</span>
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
