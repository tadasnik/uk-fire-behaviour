<script lang="ts">
	import { InputChip } from '@skeletonlabs/skeleton';
  import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
  import MultiSelect from 'svelte-multiselect'
  import UKFuels from '$lib/data/UKFuels.json'
	// import Inputs from "$lib/components/Inputs.svelte";
	import { _inputs, _output } from '$lib/shared/stores/modelStore.js';
	// import { siteInputs } from "$lib/shared/stores/inputs.js";
	import { selectedFuels } from '$lib/shared/stores/fuels.js';

	// const fSim = new FireSim();
	// let res = fSim.run();
  let fuelsOptions: string[] = ['gs1', 'sh1', 'sh3', 'sh4', 'gr3'];
	function onFuelRemoveHandler(event: any): void {
    console.log('chip index', event.detail.chipIndex)
		// toastStore.trigger({
		// 	message: `"${event.detail.input}" is an invalid value. Please try again!`,
		// 	background: 'variant-filled-error'
		// });
	}
	console.log([...$_output.entries()]);
  const selectOptions = [] 
  for (const [key, value] of Object.entries(UKFuels)) {
    selectOptions.push(key)
  }
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h2 class="h2">BehavePlus modelling system</h2>
		<!-- Animated Logo -->
		<div class="flex justify-center space-x-2">
      <MultiSelect bind:selected={$selectedFuels} options={[ ...Object.keys(UKFuels) ]} minSelect=1/>
      <!-- <ListBox multiple> -->
      <!--   {#each Object.entries(UKFuels) as [key, values]} -->
      <!--     <ListBoxItem bind:group={$selectedFuels} name="medium" value={key}>{key}: {values.label}</ListBoxItem> -->
      <!-- {/each} -->
      <!-- </ListBox> -->
			<InputChip
				bind:value={$selectedFuels}
				name="chips"
				placeholder="Enter fuel code"
				on:remove={onFuelRemoveHandler}
			/>
		</div>
		<div class="flex justify-center space-x-2">
			<a class="btn variant-filled" href="https://skeleton.dev/" target="_blank" rel="noreferrer">
				Launch Documentation
			</a>
		</div>
		<div class="space-y-2">
			<p>Try editing the following:</p>
			<p><code class="code">/src/routes/+layout.svelte</code></p>
			<p><code class="code">/src/routes/+page.svelte</code></p>
		</div>
	</div>
</div>

<style lang="postcss">
</style>
