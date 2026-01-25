FROM php:8.1.5-apache

# for vite
EXPOSE 5173

# for php
RUN apt-get update \
    && apt-get install -y libzip-dev zip unzip vim libpq-dev locales libmagickwand-dev qpdf ghostscript \
    && docker-php-ext-configure zip \
    && docker-php-ext-install pdo_pgsql zip \
    && a2enmod rewrite

# for composer
COPY --from=composer /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER 1
ENV COMPOSER_HOME /composer
ENV PATH $PATH:/composer/vendor/bin

# for node.js
COPY --from=node:18.12.0 /usr/local/bin /usr/local/bin
COPY --from=node:18.12.0 /usr/local/lib /usr/local/lib
RUN npm install -g npm@8.19.3

# for xdebug
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

# for imagick
RUN pecl install imagick \
    && docker-php-ext-enable imagick

# fix policy file
RUN sed -i -e 's/<policy domain="coder" rights="none" pattern="\(MVG\|PDF\)" \/>/<policy domain="coder" rights="read|write" pattern="PDF" \/>/g' /etc/ImageMagick-6/policy.xml

# for OPCache
# RUN docker-php-ext-install opcache

# for storybook
EXPOSE 6006
