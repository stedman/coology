#!/bin/sh

# ================================== #
# CLUI = Command Line User Interface #
# ================================== #

# COLORS
COLOR_CYAN="\x1b[36m"
COLOR_LIGHT_CYAN="\x1b[96m"
COLOR_RED="\x1b[31m"
COLOR_LEMON="\x1b[93m"
COLOR_GREEN="\x1b[92m"
COLOR_RESET="\x1b[0m"
CHECKMARK="$COLOR_GREEN\xE2\x9C\x94\xEF\xB8\x8E$COLOR_RESET"
XMARK="$COLOR_RED\xE2\x9C\x98$COLOR_RESET"

run_command()
{
  echo $COLOR_LIGHT_CYAN
  echo "$ ${1}\n${COLOR_RESET}"
  eval $1

  if [ $? -eq 0 ]; then
    echo "${COLOR_GREEN}($ ${1}) ${CHECKMARK}"
    echo ""
  else
    echo "${COLOR_RED}($ ${1}) ${XMARK}"
    echo $COLOR_RED
    echo "Exiting. Please fix error(s) and retry...${COLOR_RESET}"
    exit 1;
  fi
}

exit_all()
{
  echo "\nExiting...";
  echo $COLOR_RESET
  exit 1
}
