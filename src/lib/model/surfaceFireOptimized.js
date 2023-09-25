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
    // Step 2 - configure input choices and computational options
    this.dag.configure(config);
    // Set display units
    Object.values({ ...inputNodes, ...outputNodes, ...fuelNodes }).forEach((item) => {
      this.dag
        .get(item.geneLabel)._variant
        .setDisplayUnits(item.units)
    });
    // Step 3 - specify the fire behavior variables to be produced
    // (See ./utils/BehavePlusAlphabeticalOrder.js for complete list of 1200+ names)
    this.selected = [
      'surface.weighted.fire.spreadRate',
      'surface.primary.fuel.bed.dead.mineralDamping',
      'surface.primary.fuel.bed.dead.moistureDamping',
    ];
    this.dag.select(
      this.selected
    )
  }

  inputs() {
    let reqNodes = {};
    this.dag.requiredInputNodes().forEach((node) => {
      if (node.key().split(".")[0] === "site") {
        reqNodes[node.key()] = inputNodes[node.key()];
        reqNodes[node.key()].value = reqNodes[node.key()].value;
      }
    });
    reqNodes[$rangeInput].value = [
      reqNodes[$rangeInput].min,
      reqNodes[$rangeInput].max,
    ];
    requiredInputs.set(reqNodes);
  }


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

    // Define an array of input values for each input variable
    // 5 fuel models x 25 wind speeds x 20 dead moistures x 4 live moistures x 4 temperatures x 6 slopes
    // yields 240,000 orthogonal input combinations, and therefore 240,000 sets of run results
    // const fuel = ['gs1', 'sh3']
    // const wind = []
    // for (let i = 0; i < 5; i++) {
    //   wind.push(i * 88)
    // }
    // const tl1h = []
    // for (let i = 1; i <= 5; i++) {
    //   tl1h.push(i * 0.01)
    // }
    // const mDead = [10, 15, 30]
    // const mLive = [50]
    // const slope = [5]
    //
    // Here we go!
    // Step 5 - specify the values of the required inputs

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
