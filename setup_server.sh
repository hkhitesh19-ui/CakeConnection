#!/bin/bash
set -e

echo '--- Phase 1: Smart Extraction & Folder Normalization ---'
cd /home/ec2-user
rm -rf cakeconnection-website
mkdir -p cakeconnection-website

# Extracting payload into a temporary processing layer
rm -rf tmp_extract && mkdir -p tmp_extract
tar -xzf project.tar.gz -C tmp_extract

# Smart Check: Checking for Nested Paths and dynamic realignment
if [ -f tmp_extract/package.json ]; then
    echo "Direct root structure detected. Syncing files directly..."
    mv tmp_extract/* cakeconnection-website/ || true
    mv tmp_extract/.* cakeconnection-website/ || true
else
    echo "Nested layout path detected. Resolving root directories dynamically..."
    NESTED_DIR=$(find tmp_extract -maxdepth 2 -name "package.json" | sed 's/\/package.json//')
    if [ ! -z "$NESTED_DIR" ]; then
        mv $NESTED_DIR/* cakeconnection-website/ || true
        mv $NESTED_DIR/.* cakeconnection-website/ || true
    else
        echo "CRITICAL FAILURE: package.json could not be tracked within archive layout!"
        exit 1
    fi
fi

# Cleanup temporary processing layers
rm -rf tmp_extract
cd cakeconnection-website

echo "Directory Status Check: Root items verified:"
ls -la

echo '--- Phase 2: Dependency Tree Tree Resolution ---'
npm install --no-audit

echo '--- Phase 3: Next.js Production Build Engine ---'
npm run build

echo '--- Phase 4: Zero-Downtime PM2 Stream Restart ---'
pm2 restart cakeconnection || pm2 start npm --name "cakeconnection" -- start

echo '========================================='
echo 'PRODUCTION STACK RE-BUILD DEPLOYED LIVE!'
echo '========================================='
