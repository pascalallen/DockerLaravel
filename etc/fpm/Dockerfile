FROM php:8.0-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libmemcached-dev \
    zip \
    unzip \
    libmagickwand-dev --no-install-recommends

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Memcached PHP extension with pecl
RUN printf "\n" | pecl install memcached

# Enable Memcached PHP extension
RUN docker-php-ext-enable memcached

# Install Xdebug PHP extension with pecl
RUN printf "\n" | pecl install xdebug

# Enable Xdebug PHP extension
RUN docker-php-ext-enable xdebug

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip sockets

# Set working directory
WORKDIR /var/www/app

# Copy project php.ini file to container php.ini
COPY ./conf/php.ini /usr/local/etc/php/php.ini

# Remove www.conf file in container
RUN rm /usr/local/etc/php-fpm.d/www.conf
# Copy project www.conf file to container www.conf
COPY ./conf/www.conf /usr/local/etc/php-fpm.d/www.conf

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash
RUN apt-get install --yes nodejs

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create system user to run Composer and Artisan Commands
RUN useradd -ms /bin/bash pascalallen
RUN chown -R pascalallen:pascalallen /var/www/app
