import { getTreeCoverDensity } from 'services/analysis-cached';

import {
  POLITICAL_BOUNDARIES_DATASET,
  TROPICAL_TREE_COVER_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  TROPICAL_TREE_COVER_HECTARE,
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'treeCoverDensity',
  title: 'Tree cover density in {location}',
  categories: ['land-cover'],
  types: ['country', 'wdpa', 'aoi'],
  admins: ['adm0', 'adm1', 'adm2'],
  large: true,
  visible: ['dashboard', 'analysis'],
  chartType: 'composedChart',
  colors: 'density',
  settingsConfig: [
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true,
    },
  ],
  pendingKeys: [],
  settings: {
    extentYear: 2020,
  },
  refetchKeys: ['landCategory'],
  dataType: 'tropicalExtent',
  metaKey: 'wri_trees_in_mosaic_landscapes',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    {
      dataset: TROPICAL_TREE_COVER_DATASET,
      layers: [TROPICAL_TREE_COVER_HECTARE],
    },
  ],
  sortOrder: {
    landCover: 2.5,
  },
  sentence: {
    initial:
      'In 2020, {location} had {areasOverTenPercent} of land above {percent} tree cover, extending over {areaInPercent} of its land area.',
    withIndicator:
      'In 2020, {indicator} in {location} had {areasOverTenPercent} of land above {percent} tree cover, extending over {areaInPercent} of its land area.',
  },
  getData: (params = {}) => {
    const treeCoverDensity = getTreeCoverDensity(params);

    return treeCoverDensity.then((data) => data).catch(() => null);
  },
  getWidgetProps,
};
