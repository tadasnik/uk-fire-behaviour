<script>
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import RangeSlider from 'svelte-range-slider-pips';
	import { fuelInputs, requiredFuelInputs } from '$lib/shared/stores/modelStore.js';
	import { fuelNodes } from '$lib/data/fuelNodes.js';

	export let fuel;
	export let key;

	let timer;

	function handleInput(event) {
		console.log('before', $fuelInputs[fuel][key]);
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => ($fuelInputs[fuel][key] = event.detail.values), 100);
		console.log('after', $fuelInputs[fuel][key]);
	}
	function debounce_set(e, key) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			console.log('before', $fuelInputs[fuel][key]);
			$fuelInputs[fuel][key] = e.detail.values;
			console.log('after', $fuelInputs[fuel][key]);
			console.log(e.detail.values, key);
		}, 100);
	}

	$: isRange = () => {
		return $fuelInputs[fuel][key].length > 1;
	};

	$: rangeSwitch = (key) => {
		console.log('rangeSwitch');
		if ($fuelInputs[fuel][key].length > 1) {
			$fuelInputs[fuel][key] = [$fuelInputs[fuel][key][0]];
		} else {
			$fuelInputs[fuel][key] = [fuelNodes[key].min, fuelNodes[key].max];
		}
	};
</script>

<div
	class="max-w-sm p-1 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
>
	<div class="flex flex-row gap-2">
		<div class="basis-32 grow">
			<span>{fuelNodes[key].label} ({fuelNodes[key].units}) {$fuelInputs[fuel][key]} </span>
			<!-- <div class="input-group p-2 h-12 input-group-divider items-center grid-cols-[20px_200px_1fr]"> -->
		</div>

		<div class="basis-3">Range?</div>
		<div class="basis-3">
			<SlideToggle name="slide" size="sm" checked={isRange(key)} on:click={rangeSwitch(key)} />
		</div>
	</div>
	<div class="flex flex-row gap-2">
		<div class="basis-32 grow">
			<RangeSlider
				float
				range={isRange(key)}
				pips
				all={false}
				first="label"
				last="label"
				rest={false}
				min={fuelNodes[key].min}
				max={fuelNodes[key].max}
				step={fuelNodes[key].step}
				values={$fuelInputs[fuel][key]}
				on:stop={(e) => {
					handleInput(e);
				}}
			/>
		</div>
	</div>
</div>
