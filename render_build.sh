#!/bin/bash

echo "🚀 Starting Laravel build for Render..."

# Install dependencies
echo "📦 Installing dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

# Generate application key
echo "🔑 Generating application key..."
php artisan key:generate --force

# Create storage directories
echo "📁 Setting up storage..."
mkdir -p storage/framework/{sessions,views,cache}
chmod -R 775 storage bootstrap/cache

# Cache configuration
echo "⚡ Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✅ Build completed successfully!"