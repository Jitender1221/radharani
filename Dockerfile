FROM php:8.2-cli

# Optional: Install PHP extensions
RUN docker-php-ext-install mysqli

WORKDIR /var/www/html

COPY . .

EXPOSE 10000

CMD ["php", "-S", "0.0.0.0:10000", "-t", "."]
