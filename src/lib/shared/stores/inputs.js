import { writable } from 'svelte/store'
import { inputNodes } from '$lib/data/inputNodes.js'

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

export const requiredInputs = writable(initKeys)
export const siteInputs = writable(initSiteInputs)
