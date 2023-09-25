import { writable, derived } from 'svelte/store';

export const selectedFuels = writable(["gs1", "sh4"]);

export const selectedFuelsInput = derived(selectedFuels, ($selectedFuels) => {
  const fuelsInputObject = { "surface.primary.fuel.model.catalogKey": $selectedFuels }
  return fuelsInputObject
})
