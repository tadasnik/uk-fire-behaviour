<script>
  import { Accordion, AccordionItem, SlideToggle } from '@skeletonlabs/skeleton';
	import RangeSlider from 'svelte-range-slider-pips';
	import { siteInputs, requiredSiteInputs } from '$lib/shared/stores/modelStore.js';

  let timer;

	function debounce_set(e, key) {
		clearTimeout(timer);
		timer = setTimeout(() => {
      console.log(e.detail, key)
			$siteInputs[key] = e.detail.values;
		}, 100);
	}

</script>

<Accordion>
	{#each Object.keys($requiredSiteInputs) as key}
		<AccordionItem>
			<svelte:fragment slot="summary">
				<div class="flex flex-row">
					<div class="basis-3/4">{$siteInputs[key].label}</div>
					<div class="basis-1/4">
						<strong>{$siteInputs[key].value}</strong>
						{$siteInputs[key].units}
					</div>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="content">
				<SlideToggle name="slider-example" size="sm">Range</SlideToggle>
				{#if $siteInputs[key].value.length > 1}
					<RangeSlider
						range
						float
						hoverable
						first="label"
						last="label"
						min={$siteInputs[key].min}
						max={$siteInputs[key].max}
						step={$siteInputs[key].step}
						bind:values={$siteInputs[key].value}
					/>
				{:else}
					<RangeSlider
						float
						hoverable
						min={$siteInputs[key].min}
						max={$siteInputs[key].max}
						step={$siteInputs[key].step}
						values={$siteInputs[key].value}
            on:stop={(e, key) => {debounce_set(e, key)}}
					/>
				{/if}
			</svelte:fragment>
		</AccordionItem>
	{/each}
</Accordion>
