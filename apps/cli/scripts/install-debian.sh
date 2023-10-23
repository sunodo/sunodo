#!/bin/sh
{
    set -e
    SUDO=''
    if [ "$(id -u)" != "0" ]; then
      SUDO='sudo'
      echo "This script requires superuser access to install apt packages."
      echo "You will be prompted for your password by sudo."
      # clear any previous sudo permission
      sudo -k
    fi

    # run inside sudo
    $SUDO sh <<SCRIPT
  set -ex

  # if apt-transport-https is not installed, clear out old sources, update, then install apt-transport-https
  dpkg -s apt-transport-https 1>/dev/null 2>/dev/null || \
    (echo "" > /etc/apt/sources.list.d/sunodo.list \
      && apt-get update \
      && apt-get install -y apt-transport-https gnupg2 curl)

  # add sunodo repository to apt
  echo "deb https://cli.sunodo.io/channels/stable/apt ./" > /etc/apt/sources.list.d/sunodo.list

  # install sunodo's release key for package verification
  curl -sS https://cli.sunodo.io/release.key | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/sunodo.gpg

  # update your sources
  apt-get update

  # install the sunodo
  apt-get install -y sunodo

SCRIPT
  # test the CLI
  LOCATION=$(which sunodo)
  echo "sunodo installed to $LOCATION"
  sunodo help
}
