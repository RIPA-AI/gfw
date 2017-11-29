import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './country-data-provider-actions';
import reducers, { initialState } from './country-data-provider-reducers';

const mapStateToProps = state => ({
  location: state.location.payload
});

class CountryDataProvider extends PureComponent {
  componentDidMount() {
    const {
      location,
      getCountries,
      getRegions,
      getSubRegions,
      getGeostore
    } = this.props;
    getCountries();
    getRegions(location.country);
    if (location.region) {
      getSubRegions(location.country, location.region);
    }
    getGeostore(location.country, location.region, location.subRegion);
  }

  componentWillReceiveProps(nextProps) {
    const { country, region, subRegion } = nextProps.location;
    const { getRegions, getSubRegions, getGeostore } = this.props;
    const hasCountryChanged = country !== this.props.location.country;
    const hasRegionChanged = region !== this.props.location.region;

    if (hasCountryChanged) {
      getRegions(country);
      if (region) {
        getSubRegions(country, region);
      }
      getGeostore(country, region, subRegion);
    }

    if (hasRegionChanged) {
      if (region) {
        getSubRegions(country, region);
      }
      getGeostore(country, region);
    }
  }

  render() {
    return null;
  }
}

CountryDataProvider.propTypes = {
  location: PropTypes.object.isRequired,
  getCountries: PropTypes.func.isRequired,
  getRegions: PropTypes.func.isRequired,
  getSubRegions: PropTypes.func.isRequired,
  getGeostore: PropTypes.func.isRequired
};

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(CountryDataProvider);
