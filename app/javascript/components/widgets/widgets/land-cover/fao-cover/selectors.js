import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';
import { getColorPalette } from 'utils/data';

// get list data
const getData = state => state.data || null;
const getCurrentLocation = state => state.currentLabel || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentences;

// get lists selected
export const parseData = createSelector(
  [getData, getCurrentLocation, getColors],
  (data, currentLabel, colors) => {
    if (isEmpty(data)) return null;
    const {
      area_ha,
      planted_forest,
      forest_primary,
      forest_regenerated
    } = data;
    const colorRange = getColorPalette(colors.ramp, 3);
    const nonForest =
      area_ha - (forest_regenerated + forest_primary + planted_forest);
    return [
      {
        label: 'Naturally regenerated Forest',
        value: forest_regenerated,
        percentage: forest_regenerated / area_ha * 100,
        color: colorRange[0]
      },
      {
        label: 'Primary Forest',
        value: forest_primary,
        percentage: forest_primary / area_ha * 100,
        color: colorRange[1]
      },
      {
        label: 'Planted Forest',
        value: planted_forest,
        percentage: planted_forest / area_ha * 100,
        color: colorRange[2]
      },
      {
        label: 'Non-Forest',
        value: nonForest,
        percentage: nonForest / area_ha * 100,
        color: colors.nonForest
      }
    ];
  }
);

export const getSentence = createSelector(
  [getData, getCurrentLocation, getSentences],
  (data, currentLabel, sentences) => {
    if (isEmpty(data)) return null;
    const { initial, noPrimary, globalInitial, globalNoPrimary } = sentences;
    const { area_ha, extent, forest_primary } = data;

    const params = {
      location: currentLabel || 'globally',
      extent: `${format('.3s')(extent)}ha`,
      primaryPercent:
        forest_primary > 0
          ? `${format('.0f')(forest_primary / area_ha * 100)}%`
          : `${format('.0f')(extent / area_ha * 100)}%`
    };
    let sentence = forest_primary > 0 ? initial : noPrimary;
    if (!currentLabel) { sentence = forest_primary > 0 ? globalInitial : globalNoPrimary; }
    return {
      sentence,
      params
    };
  }
);
