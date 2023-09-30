import { writable, derived } from 'svelte/store'
import { selectedOutputs } from '$lib/shared/stores/outputs.js'
import { siteInputs } from '$lib/shared/stores/inputs.js'
import { selectedFuelsInput } from '$lib/shared/stores/fuels.js'
import { inputNodes } from '$lib/data/inputNodes.js'
import { modelConfigOptions } from '$lib/data/configuration.js'
import FireSim from '$lib/model/surfaceFireOptimized.js'

export const fireSim = new FireSim()

export const modelConfigValues = writable(modelConfigOptions)

export const requiredConfig = derived(selectedOutputs, ($selectedOutputs) => {
  const requiredC = fireSim.selectOutputs($selectedOutputs)
  return requiredC
})

export const config = derived([requiredConfig, modelConfigValues], ([$requiredConfig, $modelConfigValues]) => {
  const configArray = [];
  console.log('derive config')
  $requiredConfig.forEach((item) => {
    configArray.push([item, $modelConfigValues[item].value])
  })
  return configArray
})

export const requiredInputs = derived(config, ($config) => {
  const requiredI = fireSim.updateConfig($config);
  return requiredI
})


// Set startInputs
const initKeys = [
	'site.moisture.dead.category',
	'site.moisture.live.category',
	'site.slope.steepness.degrees',
	'site.wind.speed.atMidflame'
]

const initSiteInputs = {}
initKeys.forEach((item) => {
	initSiteInputs[item] = inputNodes[item].value
})

export const startRequiredInputs = writable(initKeys)

export const startInputs = writable(initSiteInputs)
// export const requiredInputs = derived([])

export const _inputs = derived([selectedFuelsInput, siteInputs],
  ([$selectedFuelsInput, $siteInputs]) => {
    const inputs = { ...$selectedFuelsInput, ...$siteInputs }
    return inputs
})
export const _output = derived(_inputs, ($_inputs) => {
	const output = fireSim.run($_inputs)
	return output
})
