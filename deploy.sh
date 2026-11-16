#!/bin/bash

# 1. Navigate to the web root
cd ~/public_html || { echo "Failed to find public_html"; exit 1; }

# 2. Check if the zip file exists
if [ ! -f "out.zip" ]; then
  echo "❌ Error: out.zip not found in public_html."
  echo "Please upload your new out.zip via cPanel File Manager first."
  exit 1
fi

echo "🧹 Cleaning up old files (keeping .htaccess and out.zip)..."
# Delete everything except .htaccess and out.zip
find . -mindepth 1 -maxdepth 1 ! -name '.htaccess' ! -name 'out.zip' -exec rm -rf {} +

echo "📦 Extracting new build..."
unzip -q out.zip

# 3. Handle the nested 'out' folder trap
if [ -d "out" ]; then
  echo "📂 Moving files out of the nested 'out' folder..."
  # Move files, but PROTECT the existing .htaccess from being overwritten
  mv -n out/* .
  mv -n out/.[!.]* . 2>/dev/null
  rmdir out
fi

echo "🧹 Removing the zip file..."
rm -f out.zip

echo "🔒 Setting correct permissions..."
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
chmod 644 .htaccess 2>/dev/null

echo "✅ Deployment complete! Your site is live. (Existing .htaccess was preserved)"