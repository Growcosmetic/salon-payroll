#!/bin/bash

echo "🚀 Deploying to Netlify..."

# Install Netlify CLI if not installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=.next

echo "✅ Deployment complete!"
echo "🎉 Your app is now live on Netlify!"
