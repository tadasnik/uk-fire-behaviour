import { writable, derived } from 'svelte/store'
import { inputNodes } from '$lib/data/inputNodes.js'
import { fuelNodes } from '$lib/data/fuelNodes.js'
import { outputNodes } from '$lib/data/outputNodes.js'
import { modelConfigOptions } from '$lib/data/configuration.js'
import UKFuels from '$lib/data/UKFuels.json'
import FireSim from '$lib/model/surfaceFireOptimized.js'

export const fireSim = new FireSim({ ...inputNodes, ...fuelNodes, ...outputNodes })
export const siteInputs = writable(inputNodes)
export const selectedOutputs = writable(['surface.weighted.fire.spreadRate'])
export const selectedFuels = writable(['gs3', 'gr6'])

const fuelProps = {}
for (const [f_key, f_values] of Object.entries(UKFuels)) {
  fuelProps[f_key] = {}
  for (const [key, values] of Object.entries(fuelNodes)) {
    fuelProps[f_key][key] = [f_values[values.catalogParam]]
  }
}

export const fuelInputs = writable(fuelProps)
export const modelConfigValues = writable(modelConfigOptions)

export const requiredConfig = derived(selectedOutputs, ($selectedOutputs) => {
	const requiredC = fireSim.selectOutputs($selectedOutputs)
	return requiredC
})

export const config = derived(
	[requiredConfig, modelConfigValues],
	([$requiredConfig, $modelConfigValues]) => {
		const configArray = []
		console.log('derive config')
		$requiredConfig.forEach((item) => {
			configArray.push([item, $modelConfigValues[item].value])
		})
		return configArray
	}
)

export const requiredInputs = derived(config, ($config) => {
	const requiredI = fireSim.updateConfig($config)
	return requiredI
})

export const requiredSiteInputs = derived(
	[requiredInputs, siteInputs],
	([$requiredInputs, $siteInputs]) => {
		const requiredSiteI = {}
		$requiredInputs.forEach((input) => {
			const splitKey = input.split('.')
			if (splitKey[0] === 'site') {
				requiredSiteI[input] = $siteInputs[input].value
			}
		})
		return requiredSiteI
	}
)

export const requiredFuelInputs = derived(
	[requiredInputs, selectedFuels, fuelInputs],
	([$requiredInputs, $selectedFuels, $fuelInputs]) => {
		const requiredFuelI = {}
    $selectedFuels.forEach((fuel) => {
      requiredFuelI[fuel] = {}
      $requiredInputs.forEach((input) => {
        const splitKey = input.split('.')
        if (splitKey[0] === 'surface' && splitKey.at(-1) === 'catalogKey') {
          requiredFuelI[fuel][input] = [fuel]
        } else if (splitKey[0] === 'surface') {
					requiredFuelI[fuel][input] = $fuelInputs[fuel][input]
				}
			})
		})
		return requiredFuelI
	}
)
export const _inputs = derived(
	[selectedFuels, requiredFuelInputs, requiredSiteInputs],
	([$selectedFuels, $requiredFuelInputs, $requiredSiteInputs]) => {
		const inputs = {}
    $selectedFuels.forEach((fuel) => {
      inputs[fuel] = { ...$requiredFuelInputs[fuel], ...$requiredSiteInputs }
		}
    )
		return inputs
	}
)

// export const _inputs = derived(
// 	[selectedFuels, requiredSiteInputs],
// 	([$selectedFuels, $requiredSiteInputs]) => {
// 		const inputs = {
// 			...{ 'surface.primary.fuel.model.catalogKey': $selectedFuels },
// 			...$requiredSiteInputs
// 		}
// 		return inputs
// 	}
// )

// export const _output = derived(, ($_inputs) => {
// 	const output = fireSim.run($_inputs)
// 	return output
// })

export const _output = derived([selectedFuels, _inputs], ([$selectedFuels, $_inputs]) => {
  const output = {}
  $selectedFuels.forEach((fuel) => {
	  output[fuel] = fireSim.run($_inputs[fuel])
  })
	return output
})
