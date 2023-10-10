<script lang="ts">
	import { Autocomplete } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	// import MultiSelect from 'svelte-multiselect';
	import UKFuels from '$lib/data/UKFuels.json';

	import Inputs from '$lib/components/Inputs.svelte';
	import InputForm from '$lib/components/inputForm.svelte';
	import FuelForm from '$lib/components/fuelForm.svelte';
	import {
    selectedOutputs,
		modelConfigValues,
		requiredConfig,
		config,
		requiredSiteInputs,
		siteInputs,
		selectedFuels,
		requiredFuelInputs,
    requiredInputs,
		fuelInputs,
		_inputs,
		_output
	} from '$lib/shared/stores/modelStore.js';
	import { outputNodes } from '$lib/data/outputNodes.js';

	// const fSim = new FireSim();
	// let res = fSim.run();
	let color = 'red';
	let fuelsChip = '';
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
	let comboboxValue: string;
	const popupCombobox: PopupSettings = {
		event: 'click',
		target: 'popupCombobox',
		closeQuery: '.listbox-item'
	};

	const selectOptions: AutocompleteOption<string>[] = [];
	for (const [key, value] of Object.entries(UKFuels)) {
		selectOptions.push({ label: value.label, value: key });
	}

    $: console.log('Required config', $requiredConfig);
    //  $: console.log('config array', $config)
    // $: console.log('requiredSiteInputs', $requiredSiteInputs)
    $: console.log('requiredInputs', $requiredInputs)
    // $: console.log('fuelInputs', $fuelInputs['gs3']);
    $: console.log(
     	'requiredFuelInputs',
    	$requiredFuelInputs);
    // $: console.log('fuelInputs', $fuelInputs);
    // $: console.log('_inputs', $_inputs)
    $: console.log('outputs', $_output['gr6'].get("Surface Weighted Fire Spread Rate"));

    // $: $requiredConfig.forEach((key) => {
    //   console.log(key)
    //   console.log($modelConfigValues[key]['options'])
    // })
  </script>

  <!-- <div class="container h-full mx-auto flex justify-center items-center"> -->
  <div class="container h-full items-center space-y-8 p-4">
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
			<!-- <InputChip bind:input={fuelsChip} bind:value={$selectedFuels} name="chips" /> -->
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

	<section class="space-y-4">
		<button class="btn variant-filled w-48 justify-between" use:popup={popupCombobox}>
			<span class="capitalize">{comboboxValue ?? 'Trigger'}</span>
			<i class="fa-solid fa-caret-down opacity-50" />
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="icon icon-tabler icon-tabler-caret-up"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M18 14l-6 -6l-6 6h12" />
			</svg>
		</button>
		<div class="card w-48 shadow-xl py-2" data-popup="popupCombobox">
			<ListBox rounded="rounded-none">
				<ListBoxItem bind:group={comboboxValue} name="medium" value="books">Books</ListBoxItem>
				<ListBoxItem bind:group={comboboxValue} name="medium" value="movies">Movies</ListBoxItem>
				<ListBoxItem bind:group={comboboxValue} name="medium" value="television">TV</ListBoxItem>
			</ListBox>
			<div class="arrow bg-surface-100-800-token" />
		</div>
	</section>
	<section class="space-y-1">
		<h3 class="h3 font-bold">Required site inputs:</h3>
		<InputForm />
	</section>
	{#each $selectedFuels as fuel}
		<section class="space-y-1">
			<h3 class="h3 font-bold">Required site inputs for {fuel}</h3>
			<div class="flex flex-wrap">
				{#each Object.keys($requiredFuelInputs[fuel]) as key}
					{#if key === 'surface.primary.fuel.model.catalogKey'}
						<p>{key}</p>
					{:else}
						<FuelForm fuel={fuel} key={key} />
					{/if}
				{/each}
			</div>
		</section>
	{/each}
	<section class="space-y-1">
		<label class="label">
			<span>Amount</span>
			<div class="input-group input-group-divider grid-cols-[1fr_200px_1fr]">
				<div class="input-group-shim"><i class="fa-solid fa-dollar-sign" /></div>
				<input type="text" placeholder="Amount" />
				<select>
					<option>USD</option>
					<option>CAD</option>
					<option>EURO</option>
				</select>
			</div>
		</label>
	</section>
</div>

<style lang="postcss">
</style>
