export const config = [
  [
    'configure.fuel.primary',
    ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0],
  ],
  [
    'configure.fuel.secondary',
    [
      'none',
      'catalog',
      'behave',
      'chaparral',
      'palmettoGallberry',
      'westernAspen',
    ][0],
  ],
  ['configure.fuel.curedHerbFraction', ['input', 'estimated'][1]],
  [
    'configure.fuel.moisture',
    ['individual', 'liveCategory', 'category', 'catalog'][2],
  ],
  ['configure.slope.steepness', ['ratio', 'degrees', 'map'][1]],
  [
    'configure.wind.direction',
    ['sourceFromNorth', 'headingFromUpslope', 'upslope'][2],
  ],
  ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][2]],
  // inactive
  ['configure.fire.effectiveWindSpeedLimit', ['applied', 'ignored'][0]],
  ['configure.fire.firelineIntensity', ['firelineIntensity', 'flameLength'][1]],
  [
    'configure.fire.lengthToWidthRatio',
    ['lengthToWidthRatio', 'effectiveWindSpeed'][0],
  ],
  ['configure.fire.weightingMethod', ['arithmetic', 'expected', 'harmonic'][0]],
  ['configure.fire.vector', ['fromHead', 'fromUpslope', 'fromNorth'][0]],
  ['configure.fuel.windSpeedAdjustmentFactor', ['input', 'estimated'][1]],
]
