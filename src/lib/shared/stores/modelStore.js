/**
 * The FireScope behaveplus-radical svelte data store
 */
import { derived } from 'svelte/store'
import { siteInputs } from '$lib/shared/stores/inputs.js'
import { selectedFuelsInput } from '$lib/shared/stores/fuels.js'
import FireSim from '$lib/model/surfaceFireOptimized.js'

export const fireSim = new FireSim()
export const _inputs = derived([selectedFuelsInput, siteInputs],
  ([$selectedFuelsInput, $siteInputs]) => {
    const inputs = { ...$selectedFuelsInput, ...$siteInputs }
    return inputs
})
export const _output = derived(_inputs, ($_inputs) => {
	const output = fireSim.run($_inputs)
	return output
})
