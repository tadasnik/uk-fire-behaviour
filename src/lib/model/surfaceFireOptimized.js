/**
 * @file surfaceFireOoptimized.js example and performance
 * @copyright 2021 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 */

/**
 * surfaceFireOptimized.js
 *
 * An example of how fire-behavior-simulator internally optimizes computation order
 * to make 240,000 estimates of surface fire spread rate, flame length, and scorch height
 * under various fuel model, moisture, wind, slope, and temperature input values.
 *
 * On my old laptop, 240,000 runs requires from 735 to 1300 millseconds,
 * or 180,000 to 326,000 runs per second.
 */
import { Sim } from '@cbevins/fire-behavior-simulator'
import StorageNeat from "$lib/model/ResultsStore.js";
import { config } from "$lib/model/Configuration.js";
import { inputNodes, outputNodes, fuelNodes } from "$lib/data/nodeProps.js";


function header(content) {
  const dash =
    '\n-----------------------------------------------------------------------\n'
  return dash + content + dash
}

// Step 1 - create a fire behavior simulator with 1 directed acyclical graph (DAG)
export default class FireSim {
  constructor() {
    this.sim = new Sim()
    this.dag = this.sim.createDag('Optimized')
    this.store = new StorageNeat(this.dag)
    this.dag.setStorageClass(this.store)
    // Set display units
    Object.values({ ...inputNodes, ...outputNodes, ...fuelNodes }).forEach((item) => {
      this.dag
        .get(item.geneLabel)._variant
        .setDisplayUnits(item.units)
    });
  };

  selectOutputs(outputs) {
    this.selected = outputs
    console.log('Outputs', outputs)
    this.dag.select(
      this.selected
    )
    this.requiredConfig = this.dag
        .requiredConfigNodes()
        .map((node) => `${node.key()}`)
    return this.requiredConfig
  }

  updateConfig(config) {
    // Step 2 - configure input choices and computational options
    console.log('Configuring')
    this.dag.configure(config);
    return this.dag.requiredInputNodes().map((node) => node.key())
  };
    // Set display units
    // (See ./utils/BehavePlusAlphabeticalOrder.js for complete list of 1200+ names)
  run(inputs) {
    // If interested, request and display the active configuration settings
    console.log(
      'The active configuration options are:',
      this.dag
        .requiredConfigNodes()
        .map((node) => `${node.key()} = '${node.value()}'`)
    )

    // Step 4 - if interested, request and display the required inputs
    console.log(
      'Required inputs are:',
      this.dag.requiredInputNodes().map((node) => node.key())
    )

    // NOTE: we need to bump up the run limit so we can stress test with a lot of inputs
    this.dag.setRunLimit(100000)

    console.log(inputs)

    const inputsArray = []
    for (const [key, values] of Object.entries(inputs)) {
      inputsArray.push([key, this.arrayToNative(key, values)])
    }
 
    this.dag.input(inputsArray)
      // ['surface.primary.fuel.model.catalogKey', fuel],
      // ['site.moisture.live.herb', herb],
      // ['site.moisture.dead.category', mDead],
      // ['site.moisture.live.category', mLive],
      // ['site.moisture.dead.tl1h', tl1h],
      // ['site.moisture.dead.tl10h', tl10h],
      // ['site.moisture.dead.tl100h', tl100h],
      // ['site.moisture.live.stem', stem],
      // ['site.slope.steepness.degrees', slope],
      // ['site.wind.speed.atMidflame', wind],
   
    this.dag.run()
    let elapsed = Date.now() // start the elapsed timer
    const results = this.dag.run()
    elapsed = Date.now() - elapsed

    const runs = results.runs
    const rps = (runs / (0.001 * elapsed)).toFixed(0)
    console.log(
      header(
        `Optimized: ${runs} runs required ${elapsed} ms (${rps} runs/s): ${results.message}`
      )
    )
    this.selected.forEach((item) => {
      const node = this.dag.get(item);
      console.log(node.label(), '=', node.displayString())
    })
    return this.store._valueMap
  }

  arrayToNative(key, values) {
    const valuesNative = []
    const node = this.dag.get(key)
    values.forEach((element) => {
      valuesNative.push(node._variant.displayValueToNativeValue(element))
    })
    return valuesNative
  }
}
