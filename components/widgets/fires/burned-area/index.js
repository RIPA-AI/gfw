import { all, spread } from 'axios';
import uniq from 'lodash/uniq';
import moment from 'moment';

import firesAlertsStats from 'components/widgets/fires/fires-alerts';

import { fetchBurnedArea, fetchVIIRSLatest } from 'services/analysis-cached';

import {
  POLITICAL_BOUNDARIES_DATASET,
  BURNED_AREA_MODIS_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  BURNED_AREA_MODIS,
} from 'data/layers';

import getWidgetProps from './selectors';

const defaultConfig = {
  ...firesAlertsStats,
  widget: 'burnedAreaStats',
  title: 'Weekly Burned Area in {location}',
  large: true,
  categories: ['summary', 'fires'],
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      type: 'select',
      placeholder: 'All land cover',
      clearable: true,
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true,
    },
    {
      key: 'dataset',
      label: 'fires dataset',
      type: 'select',
    },
    {
      key: 'compareYear',
      label: 'Compare with the same period in',
      type: 'compare-select',
      placeholder: 'None',
      clearable: true,
      border: true,
    },
  ],
  refetchKeys: ['dataset', 'forestType', 'landCategory'],
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    // fires
    {
      dataset: BURNED_AREA_MODIS_DATASET,
      layers: [BURNED_AREA_MODIS],
    },
  ],
  visible: ['dashboard', 'analysis'],
  types: ['country'],
  metaKey: 'widget_fire_alert_location',
  settings: {
    dataset: 'modis_burned_area',
  },
  sentences: {
    defaultSentence: 'In {location} there ',
    seasonSentence:
      'In {location} the peak fire season typically begins in {fires_season_start} and lasts around {fire_season_length} weeks. ',
    allBurn:
      'Fires burned {area} of land between {start_date} and {end_date}, when data were most recently available. The area burned during this time period is {status} compared to the area burned in previous years going back to {dataset_start_year}.',
    allBurnWithInd:
      'Fires burned {area} of land within {indicator} between {start_date} and {end_date}, when data were most recently available. The area burned during this time period is {status} compared to the area burned in previous years going back to {dataset_start_year}.',
  },
  getData: (params) =>
    all([fetchBurnedArea(params), fetchVIIRSLatest(params)]).then(
      spread((alerts, latest) => {
        const { data } = alerts.data;
        const years = uniq(data.map((d) => d.year));
        const maxYear = Math.max(...years);
        const latestDate = latest && latest.date;

        return (
          {
            alerts: data,
            latest: latestDate,
            options: {
              compareYear: years
                .filter((y) => y !== maxYear)
                .map((y) => ({
                  label: y,
                  value: y,
                })),
            },
            settings: {
              startDateAbsolute:
                params.startDateAbsolute ||
                moment(latestDate).subtract(1, 'year').format('YYYY-MM-DD'),
              endDateAbsolute: params.endDateAbsolute || latestDate,
            },
          } || {}
        );
      })
    ),
  getDataURL: (params) => [fetchBurnedArea({ ...params, download: true })],
  getWidgetProps,
};

export default {
  widget: 'burnedAreaStats',
  proxy: true,
  refetchKeys: ['dataset'],
  getWidget: (props) => { // called when settings changes
    if (!props || !props.dataset) return defaultConfig;
    if (props.dataset === 'modis_burned_area') return defaultConfig;
    if (props.dataset === 'modis') return firesAlertsStats;
    return defaultConfig;
  },
}
