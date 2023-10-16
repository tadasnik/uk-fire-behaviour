<script>
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import RangeSlider from 'svelte-range-slider-pips';
  // import DoubleSlider from './DoubleSlider.svelte';
  // import Slider from './Slider.svelte';
	import { siteInputs, requiredSiteInputs } from '$lib/shared/stores/modelStore.js';

	let timer;
  let start=0.1;
  let end=0.9;

	function debounce_set(e, key) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			console.log(e.detail.values, key);
			$siteInputs[key] = e.detail.values;
		}, 100);
	}

	$: isRange = (key) => {
		return $siteInputs[key].value.length > 1;
	};

	$: rangeSwitch = (key) => {
		if ($siteInputs[key].value.length > 1) {
			$siteInputs[key].value = [$siteInputs[key].defValue];
		} else {
			$siteInputs[key].value = [$siteInputs[key].min, $siteInputs[key].max];
		}
	};
</script>

<div class="flex flex-col p-2">
	<h3 class="h3 font-bold">Required site inputs:</h3>

	{#each Object.keys($requiredSiteInputs) as key}
		<div
			class="max-w-md p-1 space-y-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
		>
			<div class="flex flex-row gap-1 items-center">
				<div class="basis-32 grow h5">
					<span>{$siteInputs[key].label} {$siteInputs[key].value[0]}({$siteInputs[key].units})</span>
				</div>
				<!-- <div class="basis-20"> -->
				<!-- 	<input -->
				<!-- 		class="input sm variant-form-material" -->
				<!-- 		type="number" -->
				<!-- 		min={$siteInputs[key].min} -->
				<!-- 		max={$siteInputs[key].max} -->
				<!-- 		bind:value={$siteInputs[key].value[0]} -->
				<!-- 	/> -->
				<!-- </div> -->
					<!-- <strong>{$siteInputs[key].value[0]}</strong>
          <span>({$siteInputs[key].units})</span>
					<!-- <div class="input-group p-2 h-12 input-group-divider items-center grid-cols-[20px_200px_1fr]"> -->

				<div class="basis-20">
					<label class="flex items-center space-x-2">
						<input
							class="checkbox"
							type="checkbox"
							checked={isRange(key)}
							on:click={rangeSwitch(key)}
						/>
						<!-- <SlideToggle -->
						<!-- 	name="slide" -->
						<!-- 	size="sm" -->
						<!-- 	checked={isRange(key)} -->
						<!-- 	on:click={rangeSwitch(key)} -->
						<!-- /> -->
						<p>Range?</p>
					</label>
				</div>
			</div>
			<div class="flex flex-row gap-2 items-center">
				<div class="basis-10 justify-end text-right">
					<span>{$siteInputs[key].min}</span>
				</div>
				<div class="basis-32 grow">
          <!-- {#if isRange(key)} -->
          <!--   <DoubleSlider bind:start={$siteInputs[key].value[0]} bind:end={$siteInputs[key].value[1]} /> -->
          <!-- {:else} -->
          <!--   <RangeSlider name={key} bind:value={$siteInputs[key].value[0]} max={25} step={1}></RangeSlider> -->
          <!-- {/if} -->
					<RangeSlider
						float
						range={isRange(key)}
						min={$siteInputs[key].min}
						max={$siteInputs[key].max}
						step={$siteInputs[key].step}
						values={$siteInputs[key].value}
						on:stop={(e, key) => {
							debounce_set(e, key);
						}}
					/>
				</div>
				<div class="basis-10 justify-start text-left">
					<span>{$siteInputs[key].max}</span>
				</div>
				<!-- <div class="basis-16"> -->
				<!-- 	<input -->
				<!-- 		class="input sm variant-form-material" -->
				<!-- 		type="number" -->
				<!-- 		min={$siteInputs[key].min} -->
				<!-- 		max={$siteInputs[key].max} -->
				<!-- 		bind:value={$siteInputs[key].value[0]} -->
				<!-- 	/> -->
				<!-- </div> -->
			</div>
		</div>
	{/each}
</div>
