<script>
  import { SlideToggle } from '@skeletonlabs/skeleton';
	import RangeSlider from 'svelte-range-slider-pips';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { requiredInputs } from '$lib/shared/stores/inputs.js';
</script>

<Accordion>
	{#each Object.keys($requiredInputs) as key}
		<AccordionItem>
			<svelte:fragment slot="summary">
				<div class="flex flex-row">
					<div class="basis-3/4">{$requiredInputs[key].label}</div>
					<div class="basis-1/4">
						<strong>{$requiredInputs[key].value}</strong>
						{$requiredInputs[key].units}
					</div>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="content">
				<SlideToggle name="slider-example" size="sm">Range</SlideToggle>
				{#if $requiredInputs[key].value.length > 1}
					<RangeSlider
						range
						float
						hoverable
						first="label"
						last="label"
						min={$requiredInputs[key].min}
						max={$requiredInputs[key].max}
						step={$requiredInputs[key].step}
						bind:values={$requiredInputs[key].value}
					/>
				{:else}
					<RangeSlider
						float
						hoverable
						min={$requiredInputs[key].min}
						max={$requiredInputs[key].max}
						step={$requiredInputs[key].step}
						bind:values={$requiredInputs[key].value}
					/>
				{/if}
			</svelte:fragment>
		</AccordionItem>
	{/each}
</Accordion>
