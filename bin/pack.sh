#!/bin/sh

# Command Line User Interface for colors and run_command.
. $(dirname ${0})/clui.sh

echo $COLOR_CYAN
echo "================================"
echo "Package Coology extension."
echo "================================"
echo "Make sure that you have updated the manifest.json version number"
echo "and CHANGELOG.md before proceeding."

echo $COLOR_LEMON
echo "Should we package this extension for the Chrome Store? (Y|n)${COLOR_RESET}"
read package_extension
if [[ $package_extension != n ]]; then
  echo $COLOR_CYAN
  echo "Packaging..."

  echo $COLOR_CYAN
  echo "Packing extension..."
  run_command "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=./extension --pack-extension-key=./key.pem"

  if [ -f extension.crx ]; then
    if [ -f coology.crx]; then
      echo $COLOR_CYAN
      echo "Removing previous packed extension..."
      run_command "rm coology.crx"
    fi

    echo $COLOR_CYAN
    echo "Updating packed extension filename..."
    run_command "mv extension.crx coology.crx"
  fi

  if [ -f key.pem ]; then
    echo $COLOR_CYAN
    echo "Moving key into /extension/ directory..."
    run_command "mv key.pem extension/key.pem"
  fi

  if [ -d extension ]; then
    echo $COLOR_CYAN
    echo "Zipping up /extension/..."
    run_command "zip -r coology.zip extension"
  fi

  if [ -f extension/key.pem ]; then
    echo $COLOR_CYAN
    echo "Moving key back out of /extension/ directory..."
    run_command "mv extension/key.pem key.pem"
  fi
else
  echo $COLOR_CYAN
  echo "Okay. We will not package this extension."
  exit_all
fi
