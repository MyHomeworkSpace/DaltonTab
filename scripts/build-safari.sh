#!/bin/bash

echoerr() { echo "$@" 1>&2; }

# Check the user's OS to see if they're on macOS.
if ! [[ "$OSTYPE" == "darwin"* ]]; then
	echoerr "This script only works on macOS."
	echoerr "See building-safari.md for more information."
	exit 1
fi

# Check to see if we can use safari-web-extension-converter
if ! xcrun safari-web-extension-converter --help &>/dev/null; then
	echoerr "Your Xcode version doesn't support safari-web-extension-converter."
	echoerr "See building-safari.md for more information."
	exit 1
fi

echo "Running webpack"
if ! cross-env BROWSER=safari webpack; then
	echoerr "Errors occured while running webpack. There is likely additional logging output above."
	exit 1
fi

echo "Converting extension"
xcrun safari-web-extension-converter ./prod-safari --app-name DaltonTab --project-location ./build-app-safari --swift --force --bundle-identifier space.myhomework.daltontab
