import { writable } from 'svelte/store';

export const selectedOutputs = writable(['fireReactionIntensity', 'fireFlameLength']);
