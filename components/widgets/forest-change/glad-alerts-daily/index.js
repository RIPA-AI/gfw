import { fetchGLADLatest, fetchHistoricalGladAlerts } from 'services/analysis-cached';

import {
  POLITICAL_BOUNDARIES_DATASET,
  GLAD_DEFORESTATION_ALERTS_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  GLAD_ALERTS
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'gladAlertsDaily',
  title: 'Glad Alerts Count in {location}',
  large: true,
  refetchKeys: ['startDate', 'endDate'],
  settingsConfig: [
    {
      key: 'dataset',
      label: 'glad dataset',
      type: 'select',
    },
  ],
  visible: ['dashboard', 'analysis'],
  types: ['country', 'geostore', 'wdpa', 'aoi', 'use'],
  categories: ['summary', 'forest-change'],
  admins: ['adm0', 'adm1', 'adm2'],
  chartType: 'composedChart',
  source: 'gadm',
  dataType: 'glad',
  colors: 'loss',
  metaKey: 'widget_deforestation_graph',
  settings: {
    dataset: 'glad',
    minDate: '2000-01-01'
  },
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    {
      dataset: GLAD_DEFORESTATION_ALERTS_DATASET,
      layers: [GLAD_ALERTS],
    },
  ],
  sentences: {
    initial:
      'Between {start_date} and {end_date} {location} experienced a total of {total_alerts} {dataset} glad alerts',
    withInd:
      'Between {start_date} and {end_date} {location} experienced a total of {total_alerts} {dataset} glas alerts within {indicator}',
    highConfidence: ', considering <b>high confidence</b> alerts only.',
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
  fetchGLADLatest(params)
    .then((response) => response?.attributes?.updatedAt || null)
    .then((latest) =>
      fetchHistoricalGladAlerts({
        ...params,
        frequency: 'daily',
        startDate: params.minDate,
        endDate: latest
      }).then((alerts) => {
        const { data } = alerts.data;
        return {
          settings: {
             startDate:
               data && data.length > 0 && data[data.length - 1].alert__date,
             endDate: latest,
           },
          data
        };
  }).catch(() => {
    return null;
  })),
  getDataURL: (params) => [
    fetchHistoricalGladAlerts({ ...params, frequency: 'daily', download: true }),
  ],
  getWidgetProps,
};
