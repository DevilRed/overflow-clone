FROM webdevops/php-nginx-dev:8.2

# Install system dependencies
RUN apt-get update && apt-get install -y zip unzip git

# Set working directory
WORKDIR /app

# Laravel requires composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

USER www-data
