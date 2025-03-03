#!/bin/bash

# Clear Expo cache
echo "Clearing Expo cache..."
npx expo start -c

# If you need to clear more caches, uncomment these lines
# rm -rf node_modules/.cache
# rm -rf $TMPDIR/metro-*
# watchman watch-del-all

echo "Cache cleared and app restarted!" 