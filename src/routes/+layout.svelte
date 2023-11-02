<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { initializeStores, Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import SiteInputs from '$lib/components/SiteInputs.svelte';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	initializeStores();

	const drawerStore = getDrawerStore();

	function drawerOpen(): void {
		drawerStore.open({});
	}
</script>

<Drawer bgDrawer="bg-white" rounded="rounded-none">
	<SiteInputs />
</Drawer>
<!-- App Shell -->
<AppShell slotSidebarLeft="bg-white w-0 lg:w-96 border-r-2">
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar background="bg-white" padding="p-3" shadow="shadow-lg">
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<button class="lg:hidden btn btn-sm mr-4" on:click={drawerOpen}>
						<span>
							<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
								<rect width="100" height="20" />
								<rect y="30" width="100" height="20" />
								<rect y="60" width="100" height="20" />
							</svg>
						</span>
					</button>
					<strong
						class="bg-gradient-to-br from-success-500 to-error-900 bg-clip-text text-transparent box-decoration-clone font-bold text-3xl uppercase"
						>UKFDRS</strong
					>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://github.com/skeletonlabs/skeleton"
					target="_blank"
					rel="noreferrer"
				>
					GitHub
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<SiteInputs />
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
