<script lang="ts">
	import { InputChip, Autocomplete } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import MultiSelect from 'svelte-multiselect';
	import UKFuels from '$lib/data/UKFuels.json';

	import Inputs from "$lib/components/Inputs.svelte";
	import { selectedOutputs } from '$lib/shared/stores/outputs.js';
	// import { modelConfigValues, modelConfig } from '$lib/shared/stores/config.js';
	import { modelConfigValues, requiredConfig, config, requiredSiteInputs, _inputs, _output } from '$lib/shared/stores/modelStore.js';
  import { siteInputs } from "$lib/shared/stores/inputs.js";
	import { selectedFuels } from '$lib/shared/stores/fuels.js';
	import { outputNodes } from '$lib/data/outputNodes.js';

	// const fSim = new FireSim();
	// let res = fSim.run();
	let color = 'red';
	let fuelsChip = '';
	let fuelsOptions: string[] = ['gs1', 'sh1', 'sh3', 'sh4', 'gr3'];
	function section(c: string): void {
		color = c;
	}
	function onFuelSelection(event: CustomEvent<AutocompleteOption<string>>): void {
		console.log(event.detail);
		$selectedFuels.push(event.detail.value);
		$selectedFuels = $selectedFuels;
	}
	console.log(UKFuels);
	let popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocomplete',
		placement: 'bottom'
	};
	let inputPopupDemo: string = '';
	function onFuelRemoveHandler(event: any): void {
		console.log('chip index', event.detail.chipIndex);
		// toastStore.trigger({
		// 	message: `"${event.detail.input}" is an invalid value. Please try again!`,
		// 	background: 'variant-filled-error'
		// });
	}
	// $: console.log([...$_output.entries()]);
	$: console.log([$requiredConfig]);
	const selectOptions: AutocompleteOption<string>[] = [];
	for (const [key, value] of Object.entries(UKFuels)) {
		selectOptions.push({ label: value.label, value: key });
	}
	$: console.log('Required config', $requiredConfig);
  $: console.log('model config values', $modelConfigValues)
  $: console.log('config array', $config)
  $: console.log('requiredSiteInputs', $requiredSiteInputs)
  $: console.log('outputs', [...$_output.entries()])



  // $: $requiredConfig.forEach((key) => {
  //   console.log(key)
  //   console.log($modelConfigValues[key]['options'])
  // })
</script>

<!-- <div class="container h-full mx-auto flex justify-center items-center"> -->
<div class="container h-full items-center space-y-8">
	<section class="space-y-4">
		<h2 class="h2">BehavePlus modelling system</h2>
		<!-- <div class="flex justify-center space-x-2"> -->
		<!-- 	<MultiSelect -->
		<!-- 		bind:selected={$selectedFuels} -->
		<!-- 		options={[...Object.keys(UKFuels)]} -->
		<!-- 		minSelect="1" -->
		<!-- 		--sms-options-bg="red" -->
		<!-- 	/> -->
	</section>
	<section class="space-y-1">
		<h3 class="h3 font-bold">Selected model outputs:</h3>
		<ul>
			{#each $selectedOutputs as outputKey}
				<li>{outputNodes[outputKey].label}</li>{/each}
		</ul>
		<select class="select w-full min-w-[120px]" multiple size="5" bind:value={$selectedOutputs}>
			{#each Object.entries(outputNodes) as [key, props]}
				<option value={key}>{props.label}</option>
			{/each}
		</select>
      </section>
    <section class="space-y-1">
		<h3 class="h3 font-bold">Required config options:</h3>
			{#each $requiredConfig as configKey}
        <h5 class="h5 font-bold">{configKey}: {$modelConfigValues[configKey].value}</h5>
        <select class="select" bind:value={$modelConfigValues[configKey].value}>
          {#each $modelConfigValues[configKey].options as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      {/each}
    </section>
		<!-- <ListBox multiple> -->
		<!--   {#each Object.entries(outputNodes) as [key, props]} -->
		<!--     <ListBoxItem bind:group={$selectedOutputs} name="medium" value={key} -->
		<!--       >{props.label}</ListBoxItem -->
		<!--     > -->
		<!--   {/each} -->
		<!-- </ListBox> -->
	<section class="space-y-4">
		<div class="flex justify-center space-x-2">
			{#each $selectedFuels as c}
				<span
					class="chip {color === c ? 'variant-filled' : 'variant-soft'}"
					on:click={() => {
						section(c);
					}}
					on:keypress
				>
					{#if color === c}<span>(icon)</span>{/if}
					<span>{c}</span>
				</span>
			{/each}
			<input
				class="input autocomplete"
				type="search"
				name="autocomplete-search"
				bind:value={fuelsChip}
				placeholder="Filter and select fuels..."
				use:popup={popupSettings}
			/>
			<InputChip bind:input={fuelsChip} bind:value={$selectedFuels} name="chips" />
			<div
				class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto"
				tabindex="-1"
				data-popup="popupAutocomplete"
			>
				<Autocomplete
					bind:input={fuelsChip}
					options={selectOptions}
					denylist={$selectedFuels}
					on:selection={onFuelSelection}
				/>
			</div>
		</div>
	</section>
    <section class="space-y-1">
		<h3 class="h3 font-bold">Required site inputs:</h3>
    <Inputs/>
    </section>
	
</div>

<style lang="postcss">
</style>
