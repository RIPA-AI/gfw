import { all, spread } from 'axios';
import uniq from 'lodash/uniq';

import { fetchFires, fetchVIIRSLatest } from 'services/analysis-cached';

import getWidgetProps from './selectors';

export default {
  widget: 'firesAlertsCumulative',
  title: {
    default: 'Cumulative Fire Alerts in {location}',
    burnedArea: 'Cumulative Burned Area in {location}',
  },
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
      placeholder: 'None',
      type: 'compare-select',
      clearable: true,
      border: true,
    },
    {
      key: 'confidence',
      label: 'Confidence level',
      type: 'select',
      clearable: false,
    },
  ],
  refetchKeys: ['dataset', 'forestType', 'landCategory', 'confidence'],
  preventRenderKeys: ['startIndex', 'endIndex'],
  visible: ['dashboard', 'analysis'],
  types: ['country', 'wdpa', 'aoi'],
  admins: ['adm0', 'adm1', 'adm2'],
  chartType: 'composedChart',
  hideLayers: true,
  dataType: 'fires',
  colors: 'fires',
  metaKey: 'widget_fire_alert_location',
  sortOrder: {
    summary: 100,
    fires: 2,
  },
  settings: {
    dataset: 'viirs',
    confidence: 'h',
  },
  sentences: {
    allBurn:
      'In {location}, {area} of land has burned so far in {latestYear}. This total is {status} compared to the total for previous years going back to {dataset_start_year}. The most fires recorded in a year was {maxYear}, with {maxArea}.',
    allBurnWithInd:
      'In {location}, {area} of land within {indicator} has burned so far in {latestYear}. This total is {status} compared to the total for previous years going back to {dataset_start_year}. The most fires recorded in a year was {maxYear}, with {maxArea}.',
    allAlerts:
      'In {location} there have been {count} {dataset} fire alerts reported so far in {latestYear}. This total is {status} compared to the total for previous years going back to {dataset_start_year}. The most fires recorded in a year was {maxYear}, with {maxTotal}.',
    highConfidence:
      'In {location} there have been {count} {dataset} fire alerts reported so far in {latestYear} considering <b>high confidence alerts</b> only. This total is {status} compared to the total for previous years going back to {dataset_start_year}. The most fires recorded in a year was {maxYear}, with {maxTotal}.',
    allAlertsWithInd:
      'In {location} there have been {count} {dataset} fire alerts reported within {indicator} so far in {latestYear}. This total is {status} compared to the total for previous years going back to {dataset_start_year}. The most fires recorded in a year was {maxYear}, with {maxTotal}.',
    highConfidenceWithInd:
      'In {location} there have been {count} {dataset} fire alerts reported within {indicator} so far in {latestYear} considering <b>high confidence alerts</b> only. This total is {status} compared to the total for previous years going back to {dataset_start_year}. The most fires recorded in a year was {maxYear}, with {maxTotal}.',
  },
  whitelists: {
    adm0: [
      'AFG',
      'AGO',
      'ALB',
      'AND',
      'ANT',
      'ARE',
      'ARG',
      'ARM',
      'AUS',
      'AUT',
      'AZE',
      'BDI',
      'BEL',
      'BEN',
      'BFA',
      'BGD',
      'BGR',
      'BHR',
      'BHS',
      'BIH',
      'BLM',
      'BLR',
      'BLZ',
      'BOL',
      'BRA',
      'BRB',
      'BRN',
      'BTN',
      'BWA',
      'CAF',
      'CAN',
      'CHE',
      'CHL',
      'CHN',
      'CIV',
      'CMR',
      'COD',
      'COG',
      'COL',
      'COM',
      'CPV',
      'CRI',
      'CUB',
      'CYP',
      'CZE',
      'DEU',
      'DJI',
      'DMA',
      'DNK',
      'DOM',
      'DZA',
      'ECU',
      'EGY',
      'ERI',
      'ESP',
      'EST',
      'ETH',
      'FIN',
      'FJI',
      'FLK',
      'FRA',
      'FSM',
      'GAB',
      'GBR',
      'GEO',
      'GHA',
      'GIB',
      'GIN',
      'GLP',
      'GMB',
      'GNB',
      'GNQ',
      'GRC',
      'GRL',
      'GTM',
      'GUF',
      'GUM',
      'GUY',
      'HND',
      'HRV',
      'HTI',
      'HUN',
      'IDN',
      'IND',
      'IRL',
      'IRN',
      'IRQ',
      'ISR',
      'ITA',
      'JAM',
      'JOR',
      'JPN',
      'KAZ',
      'KEN',
      'KGZ',
      'KHM',
      'KIR',
      'KNA',
      'KOR',
      'KWT',
      'LAO',
      'LBN',
      'LBR',
      'LBY',
      'LCA',
      'LIE',
      'LKA',
      'LSO',
      'LTU',
      'LUX',
      'LVA',
      'MAR',
      'MCO',
      'MDA',
      'MDG',
      'MDV',
      'MEX',
      'MHL',
      'MKD',
      'MLI',
      'MLT',
      'MMR',
      'MNE',
      'MNG',
      'MNP',
      'MOZ',
      'MRT',
      'MSR',
      'MTQ',
      'MUS',
      'MWI',
      'MYS',
      'NAM',
      'NCL',
      'NER',
      'NGA',
      'NIC',
      'NLD',
      'NOR',
      'NPL',
      'NZL',
      'OMN',
      'PAK',
      'PAN',
      'PCN',
      'PER',
      'PHL',
      'PNG',
      'POL',
      'PRI',
      'PRK',
      'PRT',
      'PRY',
      'PSE',
      'PYF',
      'QAT',
      'REU',
      'ROU',
      'RUS',
      'RWA',
      'SAU',
      'SDN',
      'SEN',
      'SGP',
      'SLB',
      'SLE',
      'SLV',
      'SOM',
      'SRB',
      'SSD',
      'STP',
      'SUR',
      'SVK',
      'SVN',
      'SWE',
      'SWZ',
      'SYR',
      'TCD',
      'TGO',
      'THA',
      'TJK',
      'TKL',
      'TKM',
      'TLS',
      'TON',
      'TTO',
      'TUN',
      'TUR',
      'TUV',
      'TZA',
      'UGA',
      'UKR',
      'URY',
      'USA',
      'UZB',
      'VAT',
      'VEN',
      'VIR',
      'VNM',
      'VUT',
      'WSM',
      'YEM',
      'ZAF',
      'ZMB',
      'ZWE',
    ],
  },
  getData: (params) =>
    all([fetchFires(params), fetchVIIRSLatest(params)]).then(
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
  getDataURL: (params) => [fetchFires({ ...params, download: true })],
  getWidgetProps,
};
