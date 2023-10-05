<script>
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import RangeSlider from 'svelte-range-slider-pips';
	import { siteInputs, requiredSiteInputs } from '$lib/shared/stores/modelStore.js';

	let timer;

	function debounce_set(e, key) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			console.log(e.detail.values, key);
			$siteInputs[key] = e.detail.values;
		}, 100);
	}
  
  $: isRange = (key) => {
    return ($siteInputs[key].value.length > 1)
  }

  $: rangeSwitch = (key) => {
    if ($siteInputs[key].value.length > 1) {
      $siteInputs[key].value = [$siteInputs[key].defValue]
    } else {
      $siteInputs[key].value = [$siteInputs[key].min, $siteInputs[key].max]
    }
  }
</script>

<div class="flex flex-wrap">
	{#each Object.keys($requiredSiteInputs) as key}
		<div
			class="max-w-sm p-1 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
		>
				<div class="flex flex-row gap-2">
					<div class="basis-32 grow">
						<span>{$siteInputs[key].label} ({$siteInputs[key].units})</span>
						<!-- <div class="input-group p-2 h-12 input-group-divider items-center grid-cols-[20px_200px_1fr]"> -->
					</div>

					<div class="basis-3">
            Range?
          </div>
					<div>
            <label class="flex items-center space-x-2">
						<SlideToggle name="slide" size="sm" checked={isRange(key)} on:click={rangeSwitch(key)} />
              </label>
          </div>
				</div>
				<div class="flex flex-row gap-2">
					<div class="basis-32 grow">
						<RangeSlider
                float
              range={isRange(key)}
              pips all={false} first="label" last="label" rest={false}
							min={$siteInputs[key].min}
							max={$siteInputs[key].max}
							step={$siteInputs[key].step}
							values={$siteInputs[key].value}
							on:stop={(e, key) => {
								debounce_set(e, key);
							}}
						/>
					</div>
					<!-- <div class="basis-14"> -->
					<!-- 	<input -->
					<!-- 		type="number" -->
     <!--          min={$siteInputs[key].min} -->
     <!--          max={$siteInputs[key].max} -->
					<!-- 		bind:value={$siteInputs[key].value[0]} -->
					<!-- 		class="input sm" -->
					<!-- 	/> -->
					<!-- </div> -->
				</div>
		</div>
	{/each}
</div>
