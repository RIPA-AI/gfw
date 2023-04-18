import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Row, Column } from 'gfw-components';

import Image from 'next/image';

class Cover extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      bgImage,
      large,
      className,
      title,
      description,
      children,
      webP,
      altImageText,
    } = this.props;

    return (
      <div className={cx('c-cover', { large }, className)}>
        <Row>
          <Column width={[1, 2 / 3]}>
            <div className="cover-texts">
              <h1
                className={cx('cover-title', { '-with-background': !!bgImage })}
              >
                {title}
              </h1>
              {Array.isArray(description) ? (
                <div className="description">{description}</div>
              ) : (
                <p className="description">{description}</p>
              )}
            </div>
            {children}
          </Column>
        </Row>
        {bgImage && (
          <picture className="picture">
            {webP && <source srcSet={webP.src} type="image/webp" />}
            <source srcSet={bgImage.src} type="image/jpeg" />
            <Image
              src={bgImage}
              layout="fill"
              objectFit="cover"
              alt={altImageText || 'Cover image'}
            />
          </picture>
        )}
      </div>
    );
  }
}

Cover.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  large: PropTypes.bool,
  bgImage: PropTypes.string,
  webP: PropTypes.string,
  altImageText: PropTypes.string,
  children: PropTypes.node,
};

export default Cover;
