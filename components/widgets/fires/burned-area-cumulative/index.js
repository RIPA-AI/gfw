import { all, spread } from 'axios';
import uniq from 'lodash/uniq';

import firesAlertsCumulative from 'components/widgets/fires/fires-alerts-cumulative';

import { fetchBurnedArea, fetchVIIRSLatest } from 'services/analysis-cached';

import getWidgetProps from './selectors';

export default {
  ...firesAlertsCumulative,
  widget: 'burnedAreaCumulative',
  title: 'Cumulative Burned Area in {location}',
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
      placeholder: 'None',
      type: 'compare-select',
      clearable: true,
      border: true,
    },
  ],
  refetchKeys: ['dataset', 'forestType', 'landCategory'],
  visible: ['dashboard', 'analysis'],
  types: ['country'],
  metaKey: 'widget_fire_alert_location',
  settings: {
    dataset: 'modis_burned_area',
  },
  sentences: {
    allBurn:
      'In {location}, {area} of land has burned so far in {latestYear}. This total is {status} compared to the total for previous years going back to {dataset_start_year}. The most fires recorded in a year was {maxYear}, with {maxArea}.',
    allBurnWithInd:
      'In {location}, {area} of land within {indicator} has burned so far in {latestYear}. This total is {status} compared to the total for previous years going back to {dataset_start_year}. The most fires recorded in a year was {maxYear}, with {maxArea}.',
  },
  getData: (params) =>
    all([fetchBurnedArea(params), fetchVIIRSLatest(params)]).then(
      spread((alerts, latest) => {
        const { data } = alerts.data;
        const years = uniq(data.map((d) => d.year));
        const maxYear = Math.max(...years);
        const latestDate = latest && latest.date;
        const allYears = years.filter((y) => y !== maxYear);

        return (
          {
            alerts: data,
            latest: latestDate,
            options: {
              compareYear: [
                { label: 'All', value: 'all' },
                ...allYears.map((y) => ({
                  label: y,
                  value: y,
                })),
              ],
            },
          } || {}
        );
      })
    ),
  getDataURL: (params) => [fetchBurnedArea({ ...params, download: true })],
  getWidgetProps,
};
