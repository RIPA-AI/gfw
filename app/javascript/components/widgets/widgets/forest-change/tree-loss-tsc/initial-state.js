export default {
  title: {
    withLocation: 'Annual tree cover loss by driver in {location}',
    global: 'Global annual tree cover loss by driver'
  },
  config: {
    admins: ['global', 'country'],
    // selectors: ['thresholds', 'extentYears', 'startYears', 'endYears'],
    layers: ['loss_by_driver'],
    yearRange: ['2001', '2015'],
    metaKey: 'tsc_drivers',
    sortOrder: {
      summary: 0,
      forestChange: 0,
      global: 0
    },
    sentences: {
      initial:
        'In {location} from {startYear} to {endYear}, {percent} of tree cover loss occurred in areas where {driver} ',
      globalInitial:
        '{location} from {startYear} to {endYear}, {percent} of tree cover loss occurred in areas where {driver} ',
      perm: '(permenant) is the dominant driver of land cover change.',
      temp: '(temporary) is the dominant driver of land cover change.'
    }
  },
  settings: {
    threshold: 0,
    startYear: 2001,
    endYear: 2015,
    layers: ['loss_by_driver']
  },
  enabled: true
};
