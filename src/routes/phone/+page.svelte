<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { PhoneSolid, ArrowLeftSolid } from 'flowbite-svelte-icons';

	// Sample recent calls
	const recentCalls = [
		{ name: 'John Doe', number: '(555) 123-4567', time: '10:30 AM', missed: false },
		{ name: 'Jane Smith', number: '(555) 987-6543', time: 'Yesterday', missed: true },
		{ name: 'Mike Johnson', number: '(555) 456-7890', time: 'Yesterday', missed: false },
		{ name: 'Sarah Williams', number: '(555) 789-0123', time: 'Monday', missed: true }
	];
</script>

<div class="phone-app bg-white h-full rounded-t-3xl overflow-hidden flex flex-col">
	<div class="app-header bg-gray-100 p-4 flex items-center justify-between">
		<a href="/" class="text-blue-500 flex items-center">
			<ArrowLeftSolid class="w-5 h-5 mr-1" />
			Back
		</a>
		<h1 class="text-xl font-semibold">Phone</h1>
		<div class="w-16"></div> <!-- Spacer for alignment -->
	</div>

	<div class="flex-1 overflow-y-auto">
		<div class="p-4">
			<h2 class="text-lg font-semibold mb-3">Recent Calls</h2>
			<div class="space-y-3">
				{#each recentCalls as call}
					<div class="flex items-center justify-between p-2 border-b">
						<div>
							<p class="font-medium {call.missed ? 'text-red-500' : ''}">{call.name}</p>
							<p class="text-sm text-gray-500">{call.number}</p>
						</div>
						<div class="text-right">
							<p class="text-sm text-gray-500">{call.time}</p>
							<Button size="xs" color="green" class="mt-1">
								<PhoneSolid class="w-3 h-3 mr-1" />
								Call
							</Button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="app-footer bg-gray-100 p-4 grid grid-cols-3 gap-2">
		<Button color="gray" class="flex flex-col items-center justify-center py-3">
			<span class="text-lg">Keypad</span>
		</Button>
		<Button color="green" class="flex flex-col items-center justify-center py-3">
			<PhoneSolid class="w-5 h-5 mb-1" />
			<span class="text-sm">Call</span>
		</Button>
		<Button color="gray" class="flex flex-col items-center justify-center py-3">
			<span class="text-lg">Contacts</span>
		</Button>
	</div>
</div>
