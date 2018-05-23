export default {
  title: 'Tree cover gain',
  config: {
    size: 'small',
    indicators: ['gadm28', 'wdpa', 'plantations', 'landmark', 'mining'],
    units: ['ha', '%'],
    categories: ['summary', 'forest-change'],
    admins: ['country', 'region', 'subRegion'],
    selectors: ['indicators', 'thresholds', 'extentYears', 'units'],
    type: 'gain',
    metaKey: 'widget_tree_cover_gain',
    layers: ['forestgain'],
    sortOrder: {
      summary: 3,
      forestChange: 6
    },
    sentences: {
      initial:
        'From 2001 to 2012, {location} gained {gain} of tree cover {indicator}, equivalent to a {percent} increase since {extentYear} and {globalPercent} of global tree cover gain.',
      withIndicator:
        'From 2001 to 2012, {location} gained {gain} of tree cover in {indicator}, equivalent to a {percent} increase since {extentYear} and {globalPercent} of global tree cover gain.',
      regionInitial:
        'From 2001 to 2012, {location} gained {gain} of tree cover {indicator}, equivalent to a {percent} increase since {extentYear} and {globalPercent} of all tree cover gain in {parent}.',
      regionWithIndicator:
        'From 2001 to 2012, {location} gained {gain} of tree cover in {indicator}, equivalent to a {percent} increase since {extentYear} and {globalPercent} of all tree cover gain in {parent}.'
    }
  },
  settings: {
    indicator: 'gadm28',
    threshold: 50,
    unit: 'ha',
    extentYear: 2010,
    layers: ['forestgain']
  },
  enabled: true
};