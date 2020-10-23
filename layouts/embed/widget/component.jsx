import PropTypes from 'prop-types';
import cx from 'classnames';

import CountryDataProvider from 'providers/country-data-provider';
import GeodescriberProvider from 'providers/geodescriber-provider';
import GeostoreProvider from 'providers/geostore-provider';
import WhitelistsProvider from 'providers/whitelists-provider';
import AreasProvider from 'providers/areas-provider';
import LocationProvider from 'providers/location-provider';

import Widgets from 'components/widgets';
import Share from 'components/modals/share';
import ModalMeta from 'components/modals/meta';

import './styles.scss';
import './trase-embed-styles.scss';

const WidgetEmbedPage = ({ widget, trase }) => (
  <div className={cx('c-widget-embed', { '-trase': trase })}>
    <div className="widget-wrapper">
      <Widgets embed widget={widget} />
    </div>
    <Share />
    <ModalMeta />
    <CountryDataProvider />
    <WhitelistsProvider />
    <GeodescriberProvider />
    <AreasProvider />
    <GeostoreProvider />
    <LocationProvider />
  </div>
);

WidgetEmbedPage.propTypes = {
  widget: PropTypes.string,
  trase: PropTypes.bool,
};

export default WidgetEmbedPage;