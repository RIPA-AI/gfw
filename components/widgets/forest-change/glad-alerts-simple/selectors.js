/* eslint-disable prefer-destructuring */
import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { formatNumber } from 'utils/format';
import moment from 'moment';

// get list data
const selectAlerts = (state) => state.data && state.data.alerts;
const selectColors = (state) => state.colors;
const selectSentences = (state) => state.sentence;
const getIndicator = (state) => state.indicator || null;
const getSettings = (state) => state.settings || null;
const getLocationName = (state) => state.locationLabel;


export const parseData = createSelector([selectAlerts], (data) => {
  if (isEmpty(data)) return null;
  const otherAlertsData = data.filter((d) => d.confirmed === false);
  const confimedAlertsData = data.filter((d) => d.confirmed === true);

  const otherAlerts = otherAlertsData.length ? otherAlertsData[0].alerts : 0;
  const highConfidenceAlerts = confimedAlertsData.length
    ? confimedAlertsData[0].alerts
    : 0;

  const totalAlerts = otherAlerts + highConfidenceAlerts;

  return {
    totalAlertCount: totalAlerts,
    otherAlertCount: otherAlerts,
    otherAlertPercentage: (100 * otherAlerts) / totalAlerts,
    highConfidenceAlertCount: highConfidenceAlerts,
    highConfidenceAlertPercentage: (100 * highConfidenceAlerts) / totalAlerts,
  };
});

export const parseConfig = createSelector(
  [parseData, selectColors, getIndicator],
  (data, colors, indicator) => {
    if (isEmpty(data)) return null;

    const { otherAlertCount, otherAlertPercentage, highConfidenceAlertCount, highConfidenceAlertPercentage} = data;
    const alertsLabel = indicator
      ? `Other alerts in ${indicator.label}`
      : 'Other alerts';
    const highConfidenceAlertsLabel = indicator
      ? `High confidence alerts in ${indicator.label}`
      : 'High confidence alerts';

    const parsedData = [
      {
        label: alertsLabel,
        value: otherAlertCount,
        color: colors.main,
        percentage: otherAlertPercentage,
        unit: 'counts',
      },
      {
        label: highConfidenceAlertsLabel,
        value: highConfidenceAlertCount,
        color: colors.gladConfirmed,
        percentage: highConfidenceAlertPercentage,
        unit: 'counts',
      },
    ];
    // if (indicator) {
    //   parsedData.splice(1, 0, {
    //     label: hasPlantations ? 'Other forest cover' : 'Other tree cover',
    //     value: otherCover,
    //     color: colors.otherCover,
    //     percentage: otherCover / totalArea * 100
    //   });
    // } else if (!indicator && hasPlantations) {
    //   parsedData.splice(1, 0, {
    //     label: 'Plantations',
    //     value: plantations,
    //     color: colors.plantedForest,
    //     percentage: plantations / totalArea * 100
    //   });
    // }
    return parsedData;
  }
);

export const parseSentence = createSelector(
  [
    parseData,
    getSettings,
    selectSentences,
    getIndicator,
    getLocationName
  ],
  (data, settings, sentences, indicator, location) => {
    if (!data) return null;

    const startDate = settings.startDate;
    const endDate = settings.endDate;
    const formattedStartDate = moment(startDate).format('Do of MMMM YYYY');
    const formattedEndDate = moment(endDate).format('Do of MMMM YYYY');
    const params = {
      indicator: indicator && indicator.label,
      location,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      count: formatNumber({ num: data.totalAlertCount, unit: ',' }),
      highConfidencePercentage: data.highConfidenceAlertCount === 0 ? 'none' : formatNumber({
        num: data.highConfidenceAlertPercentage,
        unit: '%',
      }),
    };
    return {
      sentence: indicator ? sentences.withInd : sentences.default,
      params,
    };
  }
);

export default createStructuredSelector({
  data: parseConfig,
  sentence: parseSentence,
});
